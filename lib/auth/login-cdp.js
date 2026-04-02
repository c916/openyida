/**
 * login-cdp.js - 优先 CDP 协议登录，降级 Playwright 扫码登录
 *
 * 登录策略（按优先级）：
 *   1. CDP 模式：启动本地已安装的 Chrome，通过 CDP 协议连接，无需下载 Chromium
 *   2. Playwright 模式：CDP 不可用时，降级为 playwright 内置 Chromium 扫码登录
 *
 * 导出函数：
 *   loginWithCdpOrPlaywright() - 执行完整登录流程（CDP 优先）
 *   findLocalChrome()          - 查找本地 Chrome 可执行文件路径
 *   launchChromeWithCdp()      - 启动 Chrome 并开启 CDP 调试端口
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawn } = require('child_process');
const { extractInfoFromCookies } = require('../core/utils');
const { saveCookieCache, interactiveLogin } = require('./login');
const { t } = require('../core/i18n');

const DEFAULT_LOGIN_URL = 'https://www.aliwork.com/workPlatform';
const CDP_PORT = 19222;
const CDP_CONNECT_TIMEOUT_MS = 8000;
const LOGIN_POLL_INTERVAL_MS = 2000;
const LOGIN_TIMEOUT_MS = 600_000; // 10 分钟

// ── 本地 Chrome 路径查找 ──────────────────────────────

/**
 * 按平台查找本地已安装的 Chrome / Chromium 可执行文件。
 * @returns {string|null} 可执行文件路径，找不到返回 null
 */
function findLocalChrome() {
  const platform = os.platform();

  const candidates = {
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      path.join(os.homedir(), 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
    ],
    win32: [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'),
    ],
    linux: [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/snap/bin/chromium',
    ],
  };

  const platformCandidates = candidates[platform] || candidates.linux;
  for (const chromePath of platformCandidates) {
    if (fs.existsSync(chromePath)) {
      return chromePath;
    }
  }

  // 尝试从 PATH 中查找
  try {
    const whichResult = execSync('which google-chrome || which chromium-browser || which chromium', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim().split('\n')[0];
    if (whichResult && fs.existsSync(whichResult)) {
      return whichResult;
    }
  } catch {
    // 找不到，忽略
  }

  return null;
}

// ── CDP 连接工具 ──────────────────────────────────────

/**
 * 等待 CDP 调试端口就绪（轮询 /json/version）。
 * @param {number} port
 * @param {number} timeoutMs
 * @returns {Promise<boolean>}
 */
function waitForCdpPort(port, timeoutMs) {
  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;
    const http = require('http');

    function poll() {
      if (Date.now() > deadline) {
        resolve(false);
        return;
      }
      const req = http.get(`http://127.0.0.1:${port}/json/version`, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => {
        setTimeout(poll, 300);
      });
      req.setTimeout(500, () => {
        req.destroy();
        setTimeout(poll, 300);
      });
    }

    poll();
  });
}

/**
 * 启动本地 Chrome 并开启 CDP 调试端口。
 * @param {string} chromePath - Chrome 可执行文件路径
 * @param {string} loginUrl - 登录页 URL
 * @returns {{ process: ChildProcess, userDataDir: string } | null}
 */
function launchChromeWithCdp(chromePath, loginUrl) {
  const userDataDir = path.join(os.tmpdir(), `yidacli-chrome-${Date.now()}`);
  fs.mkdirSync(userDataDir, { recursive: true });

  const args = [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-default-apps',
    loginUrl,
  ];

  try {
    const chromeProcess = spawn(chromePath, args, {
      detached: false,
      stdio: 'ignore',
    });
    return { process: chromeProcess, userDataDir };
  } catch {
    return null;
  }
}

// ── Cookie 轮询等待 ───────────────────────────────────

/**
 * 通过 playwright CDP 连接，轮询等待 tianshu_csrf_token Cookie 出现。
 * @param {object} context - playwright BrowserContext
 * @returns {Promise<{ cookies: Array, baseUrl: string } | null>}
 */
async function pollForLoginCookies(context) {
  const deadline = Date.now() + LOGIN_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, LOGIN_POLL_INTERVAL_MS));

    const cookies = await context.cookies();
    const csrfCookie = cookies.find((cookie) => cookie.name === 'tianshu_csrf_token' && cookie.value);

    if (!csrfCookie) {
      continue;
    }

    // 提取 baseUrl（优先用 yida_user_cookie 的 domain）
    let baseUrl = 'https://www.aliwork.com';
    const yidaCookie = cookies.find((cookie) => cookie.name === 'yida_user_cookie');
    if (yidaCookie && yidaCookie.domain && yidaCookie.domain.includes('aliwork.com')) {
      baseUrl = 'https://' + yidaCookie.domain.replace(/^\./, '');
    } else if (csrfCookie.domain && csrfCookie.domain !== '.aliwork.com') {
      baseUrl = 'https://' + csrfCookie.domain.replace(/^\./, '');
    }

    return { cookies, baseUrl };
  }

  return null;
}

// ── CDP 登录主流程 ────────────────────────────────────

/**
 * 尝试通过 CDP 协议连接本地 Chrome 完成登录。
 * @param {string} loginUrl
 * @returns {Promise<object|null>} loginResult 或 null（失败时）
 */
async function loginViaCdp(loginUrl) {
  const chromePath = findLocalChrome();
  if (!chromePath) {
    console.error('  ℹ️  未找到本地 Chrome，将使用 Playwright 内置 Chromium');
    return null;
  }

  console.error(`  🌐 检测到本地 Chrome：${chromePath}`);
  console.error(`  🔗 正在通过 CDP 协议连接（端口 ${CDP_PORT}）...`);

  // 检查端口是否已被占用（Chrome 已在运行）
  const portAlreadyOpen = await waitForCdpPort(CDP_PORT, 500);
  let chromeProcess = null;
  let userDataDir = null;

  if (!portAlreadyOpen) {
    const launched = launchChromeWithCdp(chromePath, loginUrl);
    if (!launched) {
      console.error('  ⚠️  Chrome 启动失败，降级为 Playwright 模式');
      return null;
    }
    chromeProcess = launched.process;
    userDataDir = launched.userDataDir;

    const ready = await waitForCdpPort(CDP_PORT, CDP_CONNECT_TIMEOUT_MS);
    if (!ready) {
      console.error('  ⚠️  CDP 端口未就绪，降级为 Playwright 模式');
      if (chromeProcess) { chromeProcess.kill(); }
      return null;
    }
  } else {
    console.error('  ℹ️  检测到 Chrome 已在运行，直接连接');
  }

  let playwright;
  try {
    playwright = require('playwright');
  } catch {
    console.error('  ⚠️  playwright 未安装，降级为扫码模式');
    if (chromeProcess) { chromeProcess.kill(); }
    return null;
  }

  let browser = null;
  try {
    browser = await playwright.chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
    const contexts = browser.contexts();
    const context = contexts.length > 0 ? contexts[0] : await browser.newContext();

    // 导航到登录页（如果当前页面不是登录页）
    const pages = context.pages();
    const loginPage = pages.length > 0 ? pages[0] : await context.newPage();
    const currentUrl = loginPage.url();
    if (!currentUrl.includes('aliwork.com')) {
      await loginPage.goto(loginUrl, { timeout: 30000 });
    }

    console.error('  ⏳ 请在浏览器中完成宜搭登录（最多等待 10 分钟）...');

    const result = await pollForLoginCookies(context);
    if (!result) {
      console.error('  ⏰ 登录超时（10 分钟），请重试');
      return null;
    }

    console.error('  ✅ CDP 登录成功！');
    return result;
  } catch (error) {
    console.error(`  ⚠️  CDP 连接失败（${error.message}），降级为 Playwright 模式`);
    return null;
  } finally {
    if (browser) {
      try { await browser.disconnect(); } catch { /* ignore */ }
    }
    if (chromeProcess) {
      try { chromeProcess.kill(); } catch { /* ignore */ }
    }
    if (userDataDir) {
      try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch { /* ignore */ }
    }
  }
}

// ── 对外入口 ──────────────────────────────────────────

/**
 * 登录主入口：优先 CDP 连接本地 Chrome，失败时降级为 Playwright 扫码登录。
 *
 * @param {object} [options]
 * @param {string} [options.loginUrl] - 登录页 URL，默认读取 config.json
 * @returns {object} loginResult { csrf_token, corp_id, user_id, base_url, cookies }
 */
async function loginWithCdpOrPlaywright(options = {}) {
  const loginUrl = options.loginUrl || DEFAULT_LOGIN_URL;

  console.error('\n🔐 正在打开浏览器，请扫码登录...');

  // 策略 1：CDP 连接本地 Chrome
  const cdpResult = await loginViaCdp(loginUrl);
  if (cdpResult) {
    const { csrfToken, corpId, userId } = extractInfoFromCookies(cdpResult.cookies);
    if (!csrfToken) {
      console.error('  ⚠️  CDP 登录后未找到 csrf_token，降级为 Playwright 模式');
    } else {
      saveCookieCache(cdpResult.cookies, cdpResult.baseUrl);
      console.error(`  🔑 csrf_token: ${csrfToken.slice(0, 16)}...`);
      if (corpId) { console.error(`  🏢 组织 ID: ${corpId}`); }
      return {
        csrf_token: csrfToken,
        corp_id: corpId,
        user_id: userId,
        base_url: cdpResult.baseUrl,
        cookies: cdpResult.cookies,
      };
    }
  }

  // 策略 2：降级为 Playwright 扫码登录
  console.error('  📱 使用 Playwright 内置 Chromium 登录...');
  return interactiveLogin();
}

module.exports = {
  loginWithCdpOrPlaywright,
  findLocalChrome,
  launchChromeWithCdp,
};
