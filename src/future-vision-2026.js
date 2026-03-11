// ============================================================
// 未来视野2026 - 线上发布会高转化率报名页
// ============================================================

var PAGE_CONFIG = {
  appType: "APP_GIPY0HT28BARZ6TFPT27",
  formUuid: "FORM-EBCFDE76E6584018A9EAF988540783AAMQA9",
  fields: {
    name: "textField_mmcszhmc9goc",
    company: "textField_mmcszhmdmuhb",
    position: "selectField_mmcszhmd7htu",
    email: "textField_mmcszhmed01d",
  },
};

var EVENT_DATE = new Date("2026-03-15T14:00:00+08:00");
var EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

var POSITION_OPTIONS = [
  "CEO/创始人", "CTO/技术VP", "产品总监/VP", "工程总监/经理",
  "产品经理", "架构师/高级工程师", "设计总监/经理",
  "市场/运营总监", "投资人/合伙人", "研究员/分析师", "其他",
];

var FAKE_REGISTRATIONS = [
  { name: "张经理", company: "字节跳动" },
  { name: "李总监", company: "腾讯" },
  { name: "王VP", company: "阿里巴巴" },
  { name: "陈博士", company: "华为" },
  { name: "刘总", company: "蔚来汽车" },
  { name: "赵经理", company: "理想汽车" },
  { name: "孙总监", company: "小米科技" },
  { name: "周VP", company: "百度" },
  { name: "吴经理", company: "京东" },
  { name: "郑总监", company: "美团" },
];

var AGENDA_ITEMS = [
  { time: "14:00-14:10", title: "开幕致辞", detail: "未来视野创始人开场，回顾2025科技里程碑，展望2026趋势蓝图", icon: "🎤" },
  { time: "14:10-14:50", title: "AI 重构商业逻辑", detail: "深度解析大模型如何重塑企业决策链、供应链与客户体验，附3个实战案例", icon: "🤖" },
  { time: "14:50-15:30", title: "碳中和技术圆桌", detail: "三位行业领袖对话：绿色计算、碳交易区块链、可持续供应链的交叉创新", icon: "🌱" },
  { time: "15:30-15:45", title: "中场休息 + VR抽奖", detail: "沉浸式VR互动体验，现场抽取Apple Vision Pro等万元大奖", icon: "🎁" },
  { time: "15:45-16:30", title: "神秘新品全球首发", detail: "一款将改变行业格局的革命性产品，全球同步揭幕", icon: "🚀" },
  { time: "16:30-17:00", title: "互动问答 + 资料包", detail: "与嘉宾实时对话，所有参会者获赠《2026科技趋势白皮书》完整版", icon: "💬" },
];

var SPEAKERS = [
  { name: "陈明远", title: "未来视野 创始人兼CEO", tag: "AI战略", bio: "连续创业者，前Google AI研究员，福布斯30Under30", initials: "陈", color: "#3B82F6" },
  { name: "林思涵", title: "绿碳科技 首席科学家", tag: "碳中和", bio: "MIT博士，全球碳中和技术TOP10专家，3项国际专利", initials: "林", color: "#10B981" },
  { name: "David Chen", title: "硅谷创投 管理合伙人", tag: "投资趋势", bio: "管理50亿美元基金，投出12家独角兽，斯坦福客座教授", initials: "DC", color: "#8B5CF6" },
  { name: "张雨桐", title: "量子智能 CTO", tag: "量子计算", bio: "中科院量子计算博士，Nature发表论文7篇，国家杰青", initials: "张", color: "#EC4899" },
  { name: "???", title: "神秘嘉宾", tag: "3月10日揭晓", bio: "一位将震撼整个科技圈的重磅人物", initials: "?", color: "#F59E0B", mystery: true },
];

var PARTNER_LOGOS = [
  { name: "华为", abbr: "HUAWEI", color: "#E4002B" },
  { name: "腾讯", abbr: "Tencent", color: "#00D26A" },
  { name: "阿里巴巴", abbr: "Alibaba", color: "#FF6A00" },
  { name: "蔚来", abbr: "NIO", color: "#00BFFF" },
  { name: "理想", abbr: "Li Auto", color: "#00D4AA" },
  { name: "小米", abbr: "Xiaomi", color: "#FF6900" },
];

var TESTIMONIALS = [
  { name: "赵明", title: "CTO", company: "创新云科技", text: "去年的发布会让我们提前半年布局AI转型，直接带来了3000万的新业务增长。今年必须参加！", rating: 5, avatar: "赵" },
  { name: "李芳", title: "产品VP", company: "智联未来", text: "嘉宾阵容太强了，每一场分享都是干货。去年的白皮书我们团队反复研读了5遍，已经成为战略参考。", rating: 5, avatar: "李" },
  { name: "王磊", title: "投资总监", company: "前沿资本", text: "作为投资人，这是我每年必参加的发布会。去年在这里发现了2个后来成为独角兽的项目。", rating: 5, avatar: "王" },
];

// ============================================================
// 状态管理
// ============================================================

var _customState = {
  scrolled: false,
  countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
  currentRegistration: 0,
  activeTestimonial: 0,
  expandedAgenda: -1,
  formName: "",
  formCompany: "",
  formPosition: "",
  formEmail: "",
  formEmailValid: false,
  formSubmitting: false,
  formSubmitted: false,
  formError: "",
  registrationCount: 3847,
  visibleSections: {},
  positionDropdownOpen: false,
  receiveReminder: true,
  confettiParticles: [],
};

export function getCustomState(key) {
  if (key) return _customState[key];
  return Object.assign({}, _customState);
}

export function setCustomState(newState) {
  Object.keys(newState).forEach(function (key) {
    _customState[key] = newState[key];
  });
  this.forceUpdate();
}

export function forceUpdate() {
  this.setState({ timestamp: new Date().getTime() });
}

// ============================================================
// 生命周期
// ============================================================

export function didMount() {
  var self = this;

  // 倒计时更新
  self._countdownTimer = setInterval(function () {
    var now = new Date().getTime();
    var distance = EVENT_DATE.getTime() - now;
    if (distance <= 0) {
      _customState.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    } else {
      _customState.countdown = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    }
    self.forceUpdate();
  }, 1000);

  // 报名动态轮播
  self._registrationTimer = setInterval(function () {
    _customState.currentRegistration = (_customState.currentRegistration + 1) % FAKE_REGISTRATIONS.length;
    self.forceUpdate();
  }, 4000);

  // 评价轮播
  self._testimonialTimer = setInterval(function () {
    _customState.activeTestimonial = (_customState.activeTestimonial + 1) % TESTIMONIALS.length;
    self.forceUpdate();
  }, 5000);

  // 报名人数缓慢增长
  self._countGrowTimer = setInterval(function () {
    if (Math.random() > 0.6) {
      _customState.registrationCount += 1;
      self.forceUpdate();
    }
  }, 8000);

  // 滚动监听
  self._scrollHandler = function () {
    var shouldBeScrolled = window.scrollY > 60;
    if (shouldBeScrolled !== _customState.scrolled) {
      _customState.scrolled = shouldBeScrolled;
      self.forceUpdate();
    }
    var sections = document.querySelectorAll("[data-animate]");
    var changed = false;
    for (var i = 0; i < sections.length; i++) {
      var sectionId = sections[i].getAttribute("data-animate");
      var rect = sections[i].getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85 && !_customState.visibleSections[sectionId]) {
        _customState.visibleSections[sectionId] = true;
        changed = true;
      }
    }
    if (changed) self.forceUpdate();
  };
  window.addEventListener("scroll", self._scrollHandler);

  // 关闭下拉菜单
  self._clickOutsideHandler = function (e) {
    if (_customState.positionDropdownOpen && !e.target.closest("#position-dropdown-wrap")) {
      _customState.positionDropdownOpen = false;
      self.forceUpdate();
    }
  };
  document.addEventListener("click", self._clickOutsideHandler);

  setTimeout(function () { self._scrollHandler(); }, 100);
}

export function didUnmount() {
  if (this._countdownTimer) clearInterval(this._countdownTimer);
  if (this._registrationTimer) clearInterval(this._registrationTimer);
  if (this._testimonialTimer) clearInterval(this._testimonialTimer);
  if (this._countGrowTimer) clearInterval(this._countGrowTimer);
  if (this._scrollHandler) window.removeEventListener("scroll", this._scrollHandler);
  if (this._clickOutsideHandler) document.removeEventListener("click", this._clickOutsideHandler);
}

// ============================================================
// 业务方法
// ============================================================

export function scrollToSection(sectionId) {
  var element = document.getElementById(sectionId);
  if (element) element.scrollIntoView({ behavior: "smooth" });
}

export function handleFormSubmit() {
  var self = this;
  var name = _customState.formName.trim();
  var company = _customState.formCompany.trim();
  var position = _customState.formPosition;
  var email = _customState.formEmail.trim();

  if (!name || !company || !position || !email) {
    self.setCustomState({ formError: "请填写所有必填字段" });
    return;
  }
  if (!EMAIL_REGEX.test(email)) {
    self.setCustomState({ formError: "请输入有效的工作邮箱" });
    return;
  }

  self.setCustomState({ formSubmitting: true, formError: "" });

  var formDataJson = {};
  formDataJson[PAGE_CONFIG.fields.name] = name;
  formDataJson[PAGE_CONFIG.fields.company] = company;
  formDataJson[PAGE_CONFIG.fields.position] = position;
  formDataJson[PAGE_CONFIG.fields.email] = email;

  self.utils.yida.saveFormData({
    formUuid: PAGE_CONFIG.formUuid,
    appType: PAGE_CONFIG.appType,
    formDataJson: JSON.stringify(formDataJson),
  }).then(function () {
    var particles = [];
    for (var i = 0; i < 80; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        color: ["#EC4899", "#8B5CF6", "#3B82F6", "#F59E0B", "#10B981"][Math.floor(Math.random() * 5)],
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
      });
    }
    _customState.registrationCount += 1;
    self.setCustomState({ formSubmitting: false, formSubmitted: true, confettiParticles: particles });
  }).catch(function (err) {
    self.setCustomState({ formSubmitting: false, formError: "提交失败，请稍后重试：" + (err.message || "未知错误") });
  });
}

export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ============================================================
// 渲染
// ============================================================

export function renderJsx() {
  var self = this;
  var timestamp = this.state.timestamp;
  var state = this.getCustomState();

  var globalCSS = "\n    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');\n\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { scroll-behavior: smooth; }\n    body { overflow-x: hidden; }\n\n    @keyframes fadeInUp {\n      from { opacity: 0; transform: translateY(40px); }\n      to { opacity: 1; transform: translateY(0); }\n    }\n    @keyframes float {\n      0%, 100% { transform: translateY(0px); }\n      50% { transform: translateY(-12px); }\n    }\n    @keyframes pulse {\n      0%, 100% { opacity: 0.4; transform: scale(1); }\n      50% { opacity: 0.8; transform: scale(1.15); }\n    }\n    @keyframes glitch1 {\n      0%, 100% { clip-path: inset(0 0 95% 0); transform: translate(0); }\n      20% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 2px); }\n      40% { clip-path: inset(60% 0 10% 0); transform: translate(3px, -1px); }\n      60% { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 1px); }\n      80% { clip-path: inset(80% 0 5% 0); transform: translate(1px, -2px); }\n    }\n    @keyframes gradientShift {\n      0% { background-position: 0% 50%; }\n      50% { background-position: 100% 50%; }\n      100% { background-position: 0% 50%; }\n    }\n    @keyframes countdownFlip {\n      0% { transform: perspective(200px) rotateX(0deg); }\n      50% { transform: perspective(200px) rotateX(-10deg); }\n      100% { transform: perspective(200px) rotateX(0deg); }\n    }\n    @keyframes slideInFade {\n      from { opacity: 0; transform: translateY(10px); }\n      to { opacity: 1; transform: translateY(0); }\n    }\n    @keyframes confettiFall {\n      0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }\n      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }\n    }\n    @keyframes checkDraw {\n      0% { stroke-dashoffset: 100; }\n      100% { stroke-dashoffset: 0; }\n    }\n    @keyframes particleFloat1 {\n      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }\n      25% { transform: translate(80px, -40px) scale(1.2); opacity: 0.3; }\n      50% { transform: translate(40px, -80px) scale(0.8); opacity: 0.2; }\n      75% { transform: translate(-20px, -50px) scale(1.1); opacity: 0.25; }\n    }\n    @keyframes particleFloat2 {\n      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }\n      33% { transform: translate(-60px, -30px) scale(1.3); opacity: 0.25; }\n      66% { transform: translate(40px, -60px) scale(0.9); opacity: 0.15; }\n    }\n    @keyframes timelinePulse {\n      0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); }\n      50% { box-shadow: 0 0 0 8px rgba(139,92,246,0); }\n    }\n    @keyframes numberTick {\n      0% { transform: translateY(0); }\n      50% { transform: translateY(-3px); }\n      100% { transform: translateY(0); }\n    }\n    @keyframes progressGlow {\n      0%, 100% { box-shadow: 0 0 10px rgba(236,72,153,0.3); }\n      50% { box-shadow: 0 0 20px rgba(236,72,153,0.6); }\n    }\n    @keyframes gridMove {\n      0% { transform: translate(0, 0); }\n      100% { transform: translate(40px, 40px); }\n    }\n\n    .cta-primary:hover { transform: translateY(-3px) !important; box-shadow: 0 0 40px rgba(236,72,153,0.5), 0 20px 40px rgba(236,72,153,0.3) !important; }\n    .cta-primary { transition: transform 0.3s ease, box-shadow 0.3s ease !important; }\n    .cta-secondary:hover { background: rgba(255,255,255,0.15) !important; transform: translateY(-2px) !important; }\n    .cta-secondary { transition: all 0.3s ease !important; }\n    .glass-card:hover { transform: translateY(-6px) !important; border-color: rgba(139,92,246,0.4) !important; box-shadow: 0 20px 60px rgba(139,92,246,0.15) !important; }\n    .glass-card { transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease !important; }\n    .speaker-card:hover { transform: translateY(-8px) scale(1.02) !important; border-color: rgba(139,92,246,0.5) !important; }\n    .speaker-card { transition: transform 0.4s ease, border-color 0.4s ease !important; }\n    .logo-item:hover { filter: grayscale(0%) !important; opacity: 1 !important; transform: scale(1.1) !important; }\n    .logo-item { transition: all 0.4s ease !important; }\n    .timeline-item:hover .timeline-detail { max-height: 80px !important; opacity: 1 !important; margin-top: 8px !important; }\n    .timeline-detail { max-height: 0; opacity: 0; overflow: hidden; transition: all 0.4s ease; margin-top: 0; }\n    .nav-cta:hover { transform: scale(1.05) !important; box-shadow: 0 0 20px rgba(236,72,153,0.4) !important; }\n    .nav-cta { transition: transform 0.2s ease, box-shadow 0.2s ease !important; }\n\n    @media (max-width: 768px) {\n      .hide-mobile { display: none !important; }\n    }\n  ";

  var fontFamily = "'Inter', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";

  var sectionVisible = function (id) { return state.visibleSections[id]; };
  var animStyle = function (id, delay) {
    return {
      opacity: sectionVisible(id) ? 1 : 0,
      transform: sectionVisible(id) ? "translateY(0)" : "translateY(40px)",
      transition: "opacity 0.7s ease " + (delay || 0) + "s, transform 0.7s ease " + (delay || 0) + "s",
    };
  };

  var padZero = function (num) { return num < 10 ? "0" + num : "" + num; };
  var currentReg = FAKE_REGISTRATIONS[state.currentRegistration];
  var remainingSeats = 5000 - state.registrationCount;
  var progressPercent = (state.registrationCount / 5000) * 100;

  return (
    <div style={{ fontFamily: fontFamily, background: "#0B0F19", color: "#FFFFFF", minHeight: "100vh", overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }}></style>
      <div style={{ display: "none" }}>{timestamp}</div>

      {/* ==================== 渐变网格背景 ==================== */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "gridMove 20s linear infinite",
        }}></div>
      </div>

      {/* ==================== 固定顶部栏 ==================== */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: state.scrolled
          ? "rgba(11,15,25,0.95)"
          : "linear-gradient(90deg, #0F172A, #7C3AED, #EC4899)",
        backgroundSize: "200% 200%",
        animation: state.scrolled ? "none" : "gradientShift 8s ease infinite",
        backdropFilter: "blur(20px)",
        borderBottom: state.scrolled ? "1px solid rgba(139,92,246,0.2)" : "none",
        transition: "background 0.4s ease, border-bottom 0.4s ease",
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "64px",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", fontWeight: "900", color: "#fff",
            }}>F</div>
            <span style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.02em" }}>未来视野<span style={{ color: "#EC4899" }}>2026</span></span>
          </div>

          {/* 倒计时 */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginRight: "8px" }}>距开幕</span>
            {[
              { value: padZero(state.countdown.days), label: "天" },
              { value: padZero(state.countdown.hours), label: "时" },
              { value: padZero(state.countdown.minutes), label: "分" },
              { value: padZero(state.countdown.seconds), label: "秒" },
            ].map(function (item, index) {
              return (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <div style={{
                    background: "rgba(139,92,246,0.3)", borderRadius: "6px",
                    padding: "4px 8px", minWidth: "36px", textAlign: "center",
                    fontSize: "16px", fontWeight: "800", fontFamily: "'Courier New', monospace",
                    animation: "countdownFlip 1s ease infinite",
                    border: "1px solid rgba(139,92,246,0.3)",
                  }}>{item.value}</div>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                  {index < 3 && <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 2px" }}>:</span>}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <button
            className="nav-cta"
            onClick={function () { self.scrollToSection("registration"); }}
            style={{
              background: "linear-gradient(135deg, #EC4899, #F59E0B)",
              border: "none", borderRadius: "8px",
              padding: "8px 20px", color: "#fff",
              fontSize: "13px", fontWeight: "700",
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >立即锁定席位</button>
        </div>
      </nav>

      {/* ==================== Hero 区 ==================== */}
      <section style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px",
        background: "radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(236,72,153,0.1) 0%, transparent 50%), #0B0F19",
      }}>
        {/* 粒子背景 */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "10%", left: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", animation: "particleFloat1 15s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", top: "60%", right: "10%", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", animation: "particleFloat2 12s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", top: "30%", right: "30%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", animation: "particleFloat1 18s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", bottom: "20%", left: "20%", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)", animation: "particleFloat2 14s ease-in-out infinite" }}></div>
        </div>

        <div style={{ maxWidth: "900px", textAlign: "center", position: "relative", zIndex: 2 }}>
          {/* 标签 */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: "100px", padding: "6px 20px", marginBottom: "32px",
            animation: "fadeInUp 0.8s ease",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#EC4899", animation: "pulse 2s ease-in-out infinite" }}></span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em" }}>2026年度科技趋势发布会 · 线上直播</span>
          </div>

          {/* 主标题 */}
          <h1 style={{
            fontSize: "clamp(36px, 7vw, 80px)", fontWeight: "900",
            lineHeight: 1.05, marginBottom: "24px", letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #FFFFFF 0%, #8B5CF6 40%, #EC4899 70%, #F59E0B 100%)",
            backgroundClip: "text", WebkitBackgroundClip: "text",
            color: "transparent", WebkitTextFillColor: "transparent",
            animation: "fadeInUp 0.8s ease 0.2s both",
            position: "relative",
          }}>
            未来视野
            <br />
            <span style={{ fontSize: "clamp(28px, 5vw, 60px)" }}>预见下一个十年</span>
          </h1>

          {/* 副标题 */}
          <p style={{
            fontSize: "clamp(16px, 2.5vw, 22px)", color: "rgba(255,255,255,0.7)",
            lineHeight: 1.6, marginBottom: "40px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto",
            animation: "fadeInUp 0.8s ease 0.4s both",
          }}>
            与全球 <span style={{ color: "#EC4899", fontWeight: "700" }}>5,000+</span> 创新者共同预见下一个十年
          </p>

          {/* 信息卡 */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "16px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px", padding: "16px 32px", marginBottom: "40px",
            backdropFilter: "blur(10px)",
            animation: "fadeInUp 0.8s ease 0.5s both",
            flexWrap: "wrap", justifyContent: "center",
          }}>
            {[
              { icon: "📅", text: "2026.3.15" },
              { icon: "🕐", text: "14:00-17:00 GMT+8" },
              { icon: "🌐", text: "线上直播 + 互动问答" },
            ].map(function (info, index) {
              return (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>{info.icon}</span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "rgba(255,255,255,0.9)" }}>{info.text}</span>
                  {index < 2 && <span className="hide-mobile" style={{ color: "rgba(255,255,255,0.2)", margin: "0 4px" }}>|</span>}
                </div>
              );
            })}
          </div>

          {/* 双CTA */}
          <div style={{
            display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
            animation: "fadeInUp 0.8s ease 0.6s both",
          }}>
            <button
              className="cta-primary"
              onClick={function () { self.scrollToSection("registration"); }}
              style={{
                background: "linear-gradient(135deg, #EC4899, #F59E0B)",
                border: "none", borderRadius: "14px",
                padding: "18px 40px", color: "#fff",
                fontSize: "17px", fontWeight: "800",
                cursor: "pointer", letterSpacing: "0.02em",
                boxShadow: "0 0 30px rgba(236,72,153,0.3), 0 10px 30px rgba(236,72,153,0.2)",
              }}
            >🚀 免费报名</button>
            <button
              className="cta-secondary"
              onClick={function () { self.scrollToSection("agenda"); }}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: "14px",
                padding: "18px 40px", color: "#fff",
                fontSize: "17px", fontWeight: "700",
                cursor: "pointer", backdropFilter: "blur(10px)",
              }}
            >📋 查看议程</button>
          </div>

          {/* 实时报名动态 */}
          <div style={{
            marginTop: "48px",
            animation: "fadeInUp 0.8s ease 0.8s both",
          }}>
            <div key={state.currentRegistration} style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "100px", padding: "8px 20px",
              animation: "slideInFade 0.5s ease",
            }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", animation: "pulse 2s ease-in-out infinite" }}></span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                刚刚：<span style={{ color: "#fff", fontWeight: "600" }}>{currentReg.name}</span> 来自 <span style={{ color: "#EC4899", fontWeight: "600" }}>{currentReg.company}</span> 完成报名
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 价值主张 ==================== */}
      <section data-animate="value" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={Object.assign({ textAlign: "center", marginBottom: "60px" }, animStyle("value", 0))}>
            <span style={{
              display: "inline-block", background: "rgba(139,92,246,0.15)", color: "#8B5CF6",
              fontSize: "13px", fontWeight: "700", padding: "6px 16px", borderRadius: "100px",
              border: "1px solid rgba(139,92,246,0.3)", marginBottom: "20px",
            }}>为什么不能错过</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "900", letterSpacing: "-0.02em", marginBottom: "16px" }}>
              一场发布会，<span style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>三重价值</span>
            </h2>
          </div>

          {/* 3列卡片 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "48px" }}>
            {[
              { icon: "📊", title: "趋势首发", subtitle: "价值 ¥1,999", desc: "《2026科技趋势白皮书》独家首发，覆盖AI、量子计算、碳中和等8大赛道，200+页深度分析", highlight: "#3B82F6" },
              { icon: "🎙️", title: "顶级嘉宾", subtitle: "3+2 阵容", desc: "3位行业领袖确认出席，2位神秘大咖即将揭晓。每位嘉宾平均从业15年+，累计管理资产超百亿", highlight: "#8B5CF6" },
              { icon: "🌐", title: "资源网络", subtitle: "5,000+ 创新者", desc: "加入未来视野创新者社群，与来自全球500强企业的技术领袖、投资人、创业者直接对话", highlight: "#EC4899" },
            ].map(function (card, index) {
              return (
                <div key={index} className="glass-card" style={Object.assign({
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px", padding: "36px 28px",
                  position: "relative", overflow: "hidden",
                }, animStyle("value", 0.1 + index * 0.15))}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: "150px", height: "150px", background: "radial-gradient(circle at top right, " + card.highlight + "10, transparent 70%)" }}></div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <span style={{ fontSize: "40px", display: "block", marginBottom: "16px" }}>{card.icon}</span>
                    <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "4px" }}>{card.title}</h3>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: card.highlight, display: "block", marginBottom: "16px" }}>{card.subtitle}</span>
                    <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 数据背书 */}
          <div style={Object.assign({
            display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap",
          }, animStyle("value", 0.6))}>
            {[
              { number: "92%", label: "往届满意度" },
              { number: "2.5h", label: "平均观看时长" },
              { number: "500+", label: "合作企业" },
              { number: "50+", label: "媒体报道" },
            ].map(function (stat, index) {
              return (
                <div key={index} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", fontWeight: "900", fontFamily: "'Courier New', monospace", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>{stat.number}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 议程时间轴 ==================== */}
      <section id="agenda" data-animate="agenda" style={{
        padding: "100px 24px", position: "relative", zIndex: 1,
        background: "linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.03) 50%, transparent 100%)",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={Object.assign({ textAlign: "center", marginBottom: "60px" }, animStyle("agenda", 0))}>
            <span style={{
              display: "inline-block", background: "rgba(139,92,246,0.15)", color: "#8B5CF6",
              fontSize: "13px", fontWeight: "700", padding: "6px 16px", borderRadius: "100px",
              border: "1px solid rgba(139,92,246,0.3)", marginBottom: "20px",
            }}>精彩议程</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "900", letterSpacing: "-0.02em" }}>
              3小时，<span style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>6场重磅分享</span>
            </h2>
          </div>

          {/* 时间轴 */}
          <div style={{ position: "relative" }}>
            {/* 垂直线 */}
            <div style={{
              position: "absolute", left: "24px", top: "20px", bottom: "20px", width: "2px",
              background: "linear-gradient(180deg, #8B5CF6, #EC4899, #F59E0B)",
              boxShadow: "0 0 10px rgba(139,92,246,0.3)",
            }}></div>

            {AGENDA_ITEMS.map(function (item, index) {
              return (
                <div key={index} className="timeline-item" style={Object.assign({
                  display: "flex", gap: "24px", marginBottom: "32px",
                  paddingLeft: "0", position: "relative", cursor: "pointer",
                }, animStyle("agenda", 0.1 + index * 0.1))}>
                  {/* 节点 */}
                  <div style={{
                    width: "50px", minWidth: "50px", display: "flex", justifyContent: "center", paddingTop: "4px",
                  }}>
                    <div style={{
                      width: "14px", height: "14px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                      border: "3px solid #0B0F19",
                      animation: "timelinePulse 2s ease-in-out infinite",
                      animationDelay: (index * 0.3) + "s",
                    }}></div>
                  </div>

                  {/* 内容 */}
                  <div style={{
                    flex: 1, background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px", padding: "20px 24px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "20px" }}>{item.icon}</span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#8B5CF6", fontFamily: "'Courier New', monospace" }}>{item.time}</span>
                    </div>
                    <h4 style={{ fontSize: "17px", fontWeight: "800", marginBottom: "0" }}>{item.title}</h4>
                    <div className="timeline-detail">
                      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 嘉宾阵容 ==================== */}
      <section data-animate="speakers" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={Object.assign({ textAlign: "center", marginBottom: "60px" }, animStyle("speakers", 0))}>
            <span style={{
              display: "inline-block", background: "rgba(236,72,153,0.15)", color: "#EC4899",
              fontSize: "13px", fontWeight: "700", padding: "6px 16px", borderRadius: "100px",
              border: "1px solid rgba(236,72,153,0.3)", marginBottom: "20px",
            }}>重磅嘉宾</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "900", letterSpacing: "-0.02em" }}>
              行业<span style={{ background: "linear-gradient(135deg, #EC4899, #F59E0B)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>顶级阵容</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            {SPEAKERS.map(function (speaker, index) {
              return (
                <div key={index} className="speaker-card" style={Object.assign({
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px", padding: "32px 20px",
                  textAlign: "center", position: "relative", overflow: "hidden",
                }, animStyle("speakers", 0.1 + index * 0.1))}>
                  {speaker.mystery && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(245,158,11,0.03) 10px, rgba(245,158,11,0.03) 20px)" }}></div>
                  )}
                  <div style={{ position: "relative", zIndex: 1 }}>
                    {/* 头像 */}
                    <div style={{
                      width: "80px", height: "80px", borderRadius: "50%",
                      background: speaker.mystery
                        ? "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))"
                        : "linear-gradient(135deg, " + speaker.color + ", " + speaker.color + "80)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 16px",
                      fontSize: speaker.mystery ? "32px" : "24px", fontWeight: "800", color: "#fff",
                      border: "2px solid " + (speaker.mystery ? "rgba(245,158,11,0.3)" : speaker.color + "40"),
                    }}>
                      {speaker.mystery ? "?" : speaker.initials}
                    </div>

                    <h4 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "4px", color: speaker.mystery ? "#F59E0B" : "#fff" }}>{speaker.name}</h4>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "12px", lineHeight: 1.4 }}>{speaker.title}</p>

                    {/* 标签 */}
                    <span style={{
                      display: "inline-block", fontSize: "11px", fontWeight: "700",
                      padding: "3px 10px", borderRadius: "100px",
                      background: speaker.color + "20",
                      color: speaker.color,
                      border: "1px solid " + speaker.color + "30",
                    }}>{speaker.tag}</span>

                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "12px", lineHeight: 1.5 }}>{speaker.bio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 社交证明 ==================== */}
      <section data-animate="social" style={{
        padding: "100px 24px", position: "relative", zIndex: 1,
        background: "linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.03) 50%, transparent 100%)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={Object.assign({ textAlign: "center", marginBottom: "60px" }, animStyle("social", 0))}>
            <span style={{
              display: "inline-block", background: "rgba(59,130,246,0.15)", color: "#3B82F6",
              fontSize: "13px", fontWeight: "700", padding: "6px 16px", borderRadius: "100px",
              border: "1px solid rgba(59,130,246,0.3)", marginBottom: "20px",
            }}>他们都在参加</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "900", letterSpacing: "-0.02em" }}>
              <span style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>行业领袖</span>的选择
            </h2>
          </div>

          {/* Logo墙 */}
          <div style={Object.assign({
            display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap", marginBottom: "64px",
          }, animStyle("social", 0.1))}>
            {PARTNER_LOGOS.map(function (logo, index) {
              return (
                <div key={index} className="logo-item" style={{
                  width: "120px", height: "60px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  filter: "grayscale(100%)", opacity: 0.5, cursor: "pointer",
                }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: logo.color, letterSpacing: "0.05em" }}>{logo.abbr}</span>
                </div>
              );
            })}
          </div>

          {/* 评价轮播 */}
          <div style={Object.assign({ maxWidth: "700px", margin: "0 auto 48px" }, animStyle("social", 0.2))}>
            {TESTIMONIALS.map(function (testimonial, index) {
              var isActive = state.activeTestimonial === index;
              return (
                <div key={index} style={{
                  display: isActive ? "block" : "none",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px", padding: "32px",
                  animation: isActive ? "slideInFade 0.5s ease" : "none",
                }}>
                  {/* 星级 */}
                  <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                    {[1, 2, 3, 4, 5].map(function (star) {
                      return <span key={star} style={{ fontSize: "16px", color: star <= testimonial.rating ? "#F59E0B" : "rgba(255,255,255,0.2)" }}>★</span>;
                    })}
                  </div>
                  <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, marginBottom: "24px", fontStyle: "italic" }}>
                    "{testimonial.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", fontWeight: "800",
                    }}>{testimonial.avatar}</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "700" }}>{testimonial.name}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{testimonial.title}，{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 指示器 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
              {TESTIMONIALS.map(function (_, index) {
                var isActive = state.activeTestimonial === index;
                return (
                  <button
                    key={index}
                    onClick={function () { self.setCustomState({ activeTestimonial: index }); }}
                    style={{
                      width: isActive ? "28px" : "8px", height: "8px",
                      borderRadius: "4px", border: "none",
                      background: isActive ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "rgba(255,255,255,0.2)",
                      cursor: "pointer", transition: "all 0.3s ease", padding: 0,
                    }}
                  ></button>
                );
              })}
            </div>
          </div>

          {/* 实时报名计数 */}
          <div style={Object.assign({ textAlign: "center" }, animStyle("social", 0.3))}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "12px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "100px", padding: "12px 28px",
            }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981", animation: "pulse 2s ease-in-out infinite" }}></span>
              <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)" }}>
                已有 <span style={{ fontSize: "24px", fontWeight: "900", fontFamily: "'Courier New', monospace", color: "#EC4899", animation: "numberTick 0.5s ease" }}>{self.formatNumber(state.registrationCount)}</span> 人报名
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 报名表单 ==================== */}
      <section id="registration" data-animate="form" style={{
        padding: "100px 24px", position: "relative", zIndex: 1,
      }}>
        <div style={{ maxWidth: "580px", margin: "0 auto" }}>
          {state.formSubmitted ? (
            /* ===== 成功状态 ===== */
            <div style={Object.assign({
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "24px", padding: "48px 32px",
              textAlign: "center", position: "relative", overflow: "hidden",
            }, animStyle("form", 0))}>
              {/* Confetti */}
              {state.confettiParticles.map(function (particle) {
                return (
                  <div key={particle.id} style={{
                    position: "absolute",
                    left: particle.x + "%",
                    top: "-10px",
                    width: particle.size + "px",
                    height: particle.size + "px",
                    background: particle.color,
                    borderRadius: particle.id % 3 === 0 ? "50%" : "2px",
                    animation: "confettiFall " + particle.duration + "s ease-in " + particle.delay + "s forwards",
                    transform: "rotate(" + particle.rotation + "deg)",
                  }}></div>
                );
              })}

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* 对勾动画 */}
                <div style={{
                  width: "80px", height: "80px", borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))",
                  border: "2px solid #10B981",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px",
                }}>
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <path d="M10 20 L17 27 L30 13" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      style={{ strokeDasharray: 100, animation: "checkDraw 0.8s ease 0.3s forwards", strokeDashoffset: 100 }} />
                  </svg>
                </div>

                <h3 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "12px" }}>🎉 报名成功！</h3>
                <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", marginBottom: "32px", lineHeight: 1.6 }}>
                  你已成功锁定席位，确认信息将发送至你的工作邮箱
                </p>

                {/* 操作按钮 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px", margin: "0 auto" }}>
                  <button style={{
                    background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)",
                    borderRadius: "12px", padding: "14px", color: "#8B5CF6",
                    fontSize: "14px", fontWeight: "700", cursor: "pointer",
                  }}>📅 添加到日历</button>
                  <button style={{
                    background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
                    borderRadius: "12px", padding: "14px", color: "#3B82F6",
                    fontSize: "14px", fontWeight: "700", cursor: "pointer",
                  }}>📄 下载《2026趋势预览》</button>
                  <button style={{
                    background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
                    borderRadius: "12px", padding: "14px", color: "#10B981",
                    fontSize: "14px", fontWeight: "700", cursor: "pointer",
                  }}>💬 加入创新者社群</button>
                </div>

                {/* 社交分享 */}
                <div style={{ marginTop: "32px" }}>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>分享给同事，一起参加</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                    {["微信", "微博", "LinkedIn"].map(function (platform) {
                      return (
                        <div key={platform} style={{
                          width: "40px", height: "40px", borderRadius: "10px",
                          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.6)",
                          cursor: "pointer",
                        }}>{platform.charAt(0)}</div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ===== 报名表单 ===== */
            <div style={Object.assign({
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px", padding: "40px 32px",
              position: "relative", overflow: "hidden",
            }, animStyle("form", 0))}>
              {/* 顶部光效 */}
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "200px", height: "2px", background: "linear-gradient(90deg, transparent, #EC4899, transparent)" }}></div>

              {/* 头部 */}
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <h3 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "8px" }}>
                  🔒 锁定席位
                </h3>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "20px" }}>
                  免费报名，仅限 <span style={{ color: "#EC4899", fontWeight: "700" }}>5,000</span> 人
                </p>

                {/* 进度条 */}
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "100px", height: "8px", overflow: "hidden", marginBottom: "8px" }}>
                  <div style={{
                    width: progressPercent + "%", height: "100%",
                    background: "linear-gradient(90deg, #EC4899, #F59E0B)",
                    borderRadius: "100px",
                    animation: "progressGlow 2s ease-in-out infinite",
                    transition: "width 0.5s ease",
                  }}></div>
                </div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                  剩余 <span style={{ color: "#F59E0B", fontWeight: "700", fontFamily: "'Courier New', monospace" }}>{self.formatNumber(remainingSeats)}</span> 个席位
                </p>
              </div>

              {/* 表单字段 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* 姓名 */}
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                    姓名 <span style={{ color: "#EC4899" }}>*</span>
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    placeholder="请输入您的姓名"
                    defaultValue=""
                    onCompositionStart={function () { _customState._isComposingName = true; }}
                    onCompositionEnd={function (e) { _customState._isComposingName = false; _customState.formName = e.target.value; }}
                    onChange={function (e) { if (!_customState._isComposingName) _customState.formName = e.target.value; }}
                    style={{
                      width: "100%", padding: "14px 16px", borderRadius: "12px",
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff", fontSize: "15px", outline: "none",
                    }}
                  />
                </div>

                {/* 公司 */}
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                    公司 <span style={{ color: "#EC4899" }}>*</span>
                  </label>
                  <input
                    id="form-company"
                    type="text"
                    placeholder="请输入您的公司名称"
                    defaultValue=""
                    onCompositionStart={function () { _customState._isComposingCompany = true; }}
                    onCompositionEnd={function (e) { _customState._isComposingCompany = false; _customState.formCompany = e.target.value; }}
                    onChange={function (e) { if (!_customState._isComposingCompany) _customState.formCompany = e.target.value; }}
                    style={{
                      width: "100%", padding: "14px 16px", borderRadius: "12px",
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff", fontSize: "15px", outline: "none",
                    }}
                  />
                </div>

                {/* 职位下拉 */}
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                    职位 <span style={{ color: "#EC4899" }}>*</span>
                  </label>
                  <div id="position-dropdown-wrap" style={{ position: "relative" }}>
                    <div
                      onClick={function () { self.setCustomState({ positionDropdownOpen: !state.positionDropdownOpen }); }}
                      style={{
                        width: "100%", padding: "14px 16px", borderRadius: "12px",
                        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                        color: state.formPosition ? "#fff" : "rgba(255,255,255,0.4)",
                        fontSize: "15px", cursor: "pointer",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}
                    >
                      <span>{state.formPosition || "请选择您的职位"}</span>
                      <span style={{ transform: state.positionDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", fontSize: "12px" }}>▼</span>
                    </div>
                    {state.positionDropdownOpen && (
                      <div style={{
                        position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                        background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px", overflow: "hidden", zIndex: 100,
                        maxHeight: "240px", overflowY: "auto",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                      }}>
                        {POSITION_OPTIONS.map(function (option) {
                          var isSelected = state.formPosition === option;
                          return (
                            <div
                              key={option}
                              onClick={function () {
                                _customState.formPosition = option;
                                self.setCustomState({ positionDropdownOpen: false, formPosition: option });
                              }}
                              style={{
                                padding: "12px 16px", cursor: "pointer",
                                background: isSelected ? "rgba(139,92,246,0.15)" : "transparent",
                                color: isSelected ? "#8B5CF6" : "rgba(255,255,255,0.8)",
                                fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                              }}
                            >{option}</div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* 工作邮箱 */}
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                    工作邮箱 <span style={{ color: "#EC4899" }}>*</span>
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    placeholder="请输入您的工作邮箱"
                    defaultValue=""
                    onCompositionStart={function () { _customState._isComposingEmail = true; }}
                    onCompositionEnd={function (e) {
                      _customState._isComposingEmail = false;
                      _customState.formEmail = e.target.value;
                      var valid = EMAIL_REGEX.test(e.target.value);
                      if (valid !== _customState.formEmailValid) {
                        _customState.formEmailValid = valid;
                        self.forceUpdate();
                      }
                    }}
                    onChange={function (e) {
                      if (!_customState._isComposingEmail) {
                        _customState.formEmail = e.target.value;
                        var valid = EMAIL_REGEX.test(e.target.value);
                        if (valid !== _customState.formEmailValid) {
                          _customState.formEmailValid = valid;
                          self.forceUpdate();
                        }
                      }
                    }}
                    style={{
                      width: "100%", padding: "14px 16px", borderRadius: "12px",
                      background: "rgba(255,255,255,0.06)", border: "1px solid " + (state.formEmail && !state.formEmailValid ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"),
                      color: "#fff", fontSize: "15px", outline: "none",
                    }}
                  />
                  {state.formEmail && !state.formEmailValid && (
                    <p style={{ fontSize: "12px", color: "#EF4444", marginTop: "4px" }}>请输入有效的工作邮箱</p>
                  )}
                </div>

                {/* 接收提醒 */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    onClick={function () { self.setCustomState({ receiveReminder: !state.receiveReminder }); }}
                    style={{
                      width: "18px", height: "18px", borderRadius: "4px",
                      border: "1px solid " + (state.receiveReminder ? "#8B5CF6" : "rgba(255,255,255,0.2)"),
                      background: state.receiveReminder ? "#8B5CF6" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.2s ease", flexShrink: 0,
                    }}
                  >
                    {state.receiveReminder && <span style={{ fontSize: "11px", color: "#fff" }}>✓</span>}
                  </div>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>接收活动提醒和最新资讯（可随时取消）</span>
                </div>

                {/* 错误提示 */}
                {state.formError && (
                  <div style={{
                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "10px", padding: "12px 16px",
                    fontSize: "13px", color: "#EF4444",
                  }}>{state.formError}</div>
                )}

                {/* 提交按钮 */}
                <button
                  className="cta-primary"
                  onClick={function () { self.handleFormSubmit(); }}
                  disabled={state.formSubmitting}
                  style={{
                    width: "100%", padding: "18px",
                    background: state.formSubmitting ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg, #EC4899, #F59E0B)",
                    border: "none", borderRadius: "14px",
                    color: "#fff", fontSize: "17px", fontWeight: "800",
                    cursor: state.formSubmitting ? "not-allowed" : "pointer",
                    boxShadow: state.formSubmitting ? "none" : "0 0 30px rgba(236,72,153,0.3)",
                    position: "relative",
                  }}
                >
                  {state.formSubmitting ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <span style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></span>
                      提交中...
                    </span>
                  ) : "🚀 立即报名，获取专属席位"}
                </button>

                {/* 安全提示 */}
                <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                  🔒 你的信息严格保密，仅用于活动通知
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== 底部 CTA ==================== */}
      <section style={{
        padding: "80px 24px",
        background: "linear-gradient(180deg, #0B0F19 0%, rgba(139,92,246,0.08) 50%, #0B0F19 100%)",
        textAlign: "center", position: "relative", zIndex: 1,
      }}>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
          2026.3.15 · 14:00 GMT+8
        </p>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "900", marginBottom: "24px" }}>
          未来已来，你来不来？
        </h2>
        <button
          className="cta-primary"
          onClick={function () { self.scrollToSection("registration"); }}
          style={{
            background: "linear-gradient(135deg, #EC4899, #F59E0B)",
            border: "none", borderRadius: "14px",
            padding: "18px 48px", color: "#fff",
            fontSize: "17px", fontWeight: "800",
            cursor: "pointer",
            boxShadow: "0 0 30px rgba(236,72,153,0.3), 0 10px 30px rgba(236,72,153,0.2)",
          }}
        >🚀 免费报名</button>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginTop: "16px" }}>
          免费参加 · 席位有限 · 报名即送白皮书预览版
        </p>
      </section>

      {/* ==================== 页脚 ==================== */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "8px",
              background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: "900", color: "#fff",
            }}>F</div>
            <span style={{ fontSize: "14px", fontWeight: "700" }}>未来视野<span style={{ color: "#EC4899" }}>2026</span></span>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            © 2026 未来视野. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
