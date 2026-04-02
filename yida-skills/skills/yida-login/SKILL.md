---
name: yida-login
description: 宜搭登录态管理。扫码登录，Cookie 持久化到 .cache/cookies.json。
---

# 宜搭登录态管理

## 严格禁止 (NEVER DO)

- 不要在代码中硬编码 Cookie 或凭证，Cookie 必须通过 `openyida login` 命令获取并缓存到 `.cache/cookies.json`
- 不要在 Cookie 失效时手动修改 `.cache/cookies.json`，必须重新执行登录流程

## 严格要求 (MUST DO)

- 执行任何宜搭操作前，必须先运行 `openyida env` 确认环境和登录态
- Cookie 失效时，重新登录后必须验证新 Cookie 可用（运行任意查询命令确认）

## 适用场景

| 用户意图 | 触发条件 |
|---------|---------|
| 首次使用或 Cookie 失效 | 其他命令报 401/未登录错误时自动触发 |
| 切换账号/组织 | 先 `openyida logout` 再重新登录 |

---


> 通常无需手动调用，其他命令在 Cookie 失效时会自动触发登录。

## 命令

```bash
openyida login
```

## 输出

```json
{"csrf_token":"b2a5d192-xxx","corp_id":"dingxxx","user_id":"1955225xxx","base_url":"https://abcd.aliwork.com"}
```

> `base_url` 取自登录后浏览器实际跳转到的域名，可能与 `config.json` 中的 `loginUrl` 不同。后续所有 API 请求使用此值。

## 错误处理

各命令通过响应体 `errorCode` 自动处理登录态异常：

| errorCode | 含义 | 处理方式 |
|-----------|------|---------|
| `TIANSHU_000030` | CSRF Token 过期 | 自动无头刷新 |
| `307` | Cookie 失效 | 自动重新登录 |