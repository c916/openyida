// ============================================================
// 绿源乡村 - 清洁饮水项目品牌故事页
// 高转化率叙事驱动设计，7大模块完整实现
// ============================================================

// ============================================================
// 状态管理
// ============================================================

var _customState = {
  visibleSections: {},
  mobileMenuOpen: false,
  scrolled: false,
  numbersAnimated: false,
  resultsNumbersAnimated: false,
  animatedNumbers: {
    people: 0, hours: 0, preventable: 0,
    villages: 0, benefited: 0, waterRate: 0, healthDrop: 0,
  },
  activeStory: 0,
  activeImpactTab: 0,
  selectedDonation: 0,
  customDonationAmount: "",
  donationSubmitted: false,
  isMonthlyDonation: true,
  selectedPayment: 0,
  expandedVolunteer: -1,
  expandedAccordion: -1,
  subscribeEmail: "",
  subscribeSubmitted: false,
  countdownDays: 0,
  countdownHours: 0,
  countdownMinutes: 0,
  countdownSeconds: 0,
  heroLine1Visible: false,
  heroLine2Visible: false,
  heroBrandVisible: false,
  heroCtaVisible: false,
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

  if (typeof IntersectionObserver !== "undefined") {
    self._sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var sectionId = entry.target.getAttribute("data-animate");
            if (sectionId && !_customState.visibleSections[sectionId]) {
              _customState.visibleSections[sectionId] = true;
              self.forceUpdate();
            }
          }
        });
      },
      { threshold: 0.15 }
    );
    setTimeout(function () {
      var sections = document.querySelectorAll("[data-animate]");
      sections.forEach(function (section) {
        self._sectionObserver.observe(section);
      });
    }, 100);
  }

  self._scrollHandler = function () {
    var shouldBeScrolled = window.pageYOffset > 60;
    if (_customState.scrolled !== shouldBeScrolled) {
      _customState.scrolled = shouldBeScrolled;
      self.forceUpdate();
    }
  };
  window.addEventListener("scroll", self._scrollHandler);

  setTimeout(function () { _customState.heroLine1Visible = true; self.forceUpdate(); }, 500);
  setTimeout(function () { _customState.heroLine2Visible = true; self.forceUpdate(); }, 1800);
  setTimeout(function () { _customState.heroBrandVisible = true; self.forceUpdate(); }, 3000);
  setTimeout(function () { _customState.heroCtaVisible = true; self.forceUpdate(); }, 3800);

  var deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);
  self._countdownDeadline = deadline.getTime();
  self._countdownTimer = setInterval(function () {
    var now = new Date().getTime();
    var distance = self._countdownDeadline - now;
    if (distance <= 0) { clearInterval(self._countdownTimer); return; }
    _customState.countdownDays = Math.floor(distance / (1000 * 60 * 60 * 24));
    _customState.countdownHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    _customState.countdownMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    _customState.countdownSeconds = Math.floor((distance % (1000 * 60)) / 1000);
    self.forceUpdate();
  }, 1000);
}

export function didUnmount() {
  if (this._sectionObserver) this._sectionObserver.disconnect();
  if (this._scrollHandler) window.removeEventListener("scroll", this._scrollHandler);
  if (this._countdownTimer) clearInterval(this._countdownTimer);
  if (this._numberAnimTimers) this._numberAnimTimers.forEach(function (t) { clearInterval(t); });
  if (this._resultNumberAnimTimers) this._resultNumberAnimTimers.forEach(function (t) { clearInterval(t); });
}

// ============================================================
// 业务方法
// ============================================================

export function animateNumbers() {
  if (_customState.numbersAnimated) return;
  _customState.numbersAnimated = true;
  var self = this;
  var targets = { people: 6000, hours: 2, preventable: 80 };
  self._numberAnimTimers = [];
  Object.keys(targets).forEach(function (key) {
    var target = targets[key];
    var current = 0;
    var step = Math.max(1, Math.floor(target / 60));
    var timer = setInterval(function () {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      _customState.animatedNumbers[key] = current;
      self.forceUpdate();
    }, 30);
    self._numberAnimTimers.push(timer);
  });
}

export function animateResultNumbers() {
  if (_customState.resultsNumbersAnimated) return;
  _customState.resultsNumbersAnimated = true;
  var self = this;
  var targets = { villages: 142, benefited: 58000, waterRate: 92, healthDrop: 75 };
  self._resultNumberAnimTimers = [];
  Object.keys(targets).forEach(function (key) {
    var target = targets[key];
    var current = 0;
    var step = Math.max(1, Math.floor(target / 60));
    var timer = setInterval(function () {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      _customState.animatedNumbers[key] = current;
      self.forceUpdate();
    }, 30);
    self._resultNumberAnimTimers.push(timer);
  });
}

export function scrollToSection(sectionId) {
  var element = document.getElementById(sectionId);
  if (element) element.scrollIntoView({ behavior: "smooth" });
  if (_customState.mobileMenuOpen) this.setCustomState({ mobileMenuOpen: false });
}

export function toggleAccordion(index) {
  this.setCustomState({ expandedAccordion: _customState.expandedAccordion === index ? -1 : index });
}

export function handleDonate() {
  var donationAmounts = [50, 200, 500, 2000];
  var amount = _customState.selectedDonation < 4
    ? donationAmounts[_customState.selectedDonation]
    : parseInt(_customState.customDonationAmount, 10) || 0;
  if (amount <= 0) { this.utils.toast({ title: "请输入有效的捐赠金额", type: "error" }); return; }
  var monthlyLabel = _customState.isMonthlyDonation ? "（月捐）" : "";
  this.setCustomState({ donationSubmitted: true });
  this.utils.toast({ title: "感谢您捐赠 ¥" + amount + monthlyLabel + "！您的善举将帮助 " + Math.floor(amount / 50) + " 个孩子喝上干净水", type: "success" });
}

export function handleSubscribe() {
  var email = _customState.subscribeEmail;
  if (!email || email.indexOf("@") === -1) { this.utils.toast({ title: "请输入有效的邮箱地址", type: "error" }); return; }
  this.setCustomState({ subscribeSubmitted: true });
  this.utils.toast({ title: "订阅成功！每季度您将收到项目进展报告", type: "success" });
}

// ============================================================
// 渲染
// ============================================================

export function renderJsx() {
  var self = this;
  var timestamp = this.state.timestamp;
  var state = this.getCustomState();

  var globalCSS = "\n    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Open+Sans:wght@400;500;600;700;800&family=Ma+Shan+Zheng&display=swap');\n\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { scroll-behavior: smooth; }\n    body { overflow-x: hidden; }\n\n    @keyframes fadeInUp {\n      from { opacity: 0; transform: translateY(40px); }\n      to { opacity: 1; transform: translateY(0); }\n    }\n    @keyframes fadeIn {\n      from { opacity: 0; }\n      to { opacity: 1; }\n    }\n    @keyframes pulse {\n      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46,125,50,0.4); }\n      50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(46,125,50,0); }\n    }\n    @keyframes float {\n      0%, 100% { transform: translateY(0px); }\n      50% { transform: translateY(-15px); }\n    }\n    @keyframes dropFall {\n      0% { transform: translateY(-30px); opacity: 0; }\n      50% { opacity: 1; }\n      100% { transform: translateY(30px); opacity: 0; }\n    }\n    @keyframes mapPulse {\n      0%, 100% { transform: scale(1); opacity: 0.8; }\n      50% { transform: scale(1.8); opacity: 0.2; }\n    }\n    @keyframes slideDown {\n      from { opacity: 0; transform: translateY(-20px); }\n      to { opacity: 1; transform: translateY(0); }\n    }\n    @keyframes gentleGlow {\n      0%, 100% { box-shadow: 0 0 20px rgba(46,125,50,0.15); }\n      50% { box-shadow: 0 0 40px rgba(46,125,50,0.3); }\n    }\n    @keyframes waveProgress {\n      0% { background-position: 0% 50%; }\n      100% { background-position: 200% 50%; }\n    }\n\n    .nav-link:hover { color: #2E7D32 !important; }\n    .nav-link { transition: color 0.3s ease; }\n    .story-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.12) !important; }\n    .story-card { transition: transform 0.4s ease, box-shadow 0.4s ease; }\n    .donation-tier:hover { transform: scale(1.06); box-shadow: 0 12px 40px rgba(46,125,50,0.2) !important; }\n    .donation-tier { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }\n    .volunteer-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.1) !important; }\n    .volunteer-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }\n    .impact-tab:hover { background: rgba(46,125,50,0.08) !important; }\n    .accordion-header:hover { background: rgba(46,125,50,0.04) !important; }\n    .footer-link:hover { color: #C8E6C9 !important; }\n    .footer-link { transition: color 0.2s ease; }\n    .cta-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(46,125,50,0.45) !important; }\n    .cta-primary { transition: transform 0.2s ease, box-shadow 0.2s ease; }\n    .cta-secondary:hover { background: rgba(255,255,255,0.12) !important; transform: translateY(-3px); }\n    .cta-secondary { transition: all 0.2s ease; }\n    .trust-badge:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }\n    .trust-badge { transition: all 0.3s ease; }\n    .timeline-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.12) !important; }\n    .timeline-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }\n    .payment-option:hover { border-color: #2E7D32 !important; }\n    .payment-option { transition: all 0.2s ease; }\n\n    @media (max-width: 768px) {\n      .hide-mobile { display: none !important; }\n      .show-mobile { display: flex !important; }\n    }\n    @media (min-width: 769px) {\n      .show-mobile { display: none !important; }\n    }\n  ";

  var fontTitle = "'Playfair Display', 'STSongti-SC-Regular', 'Songti SC', serif";
  var fontBody = "'Open Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif";
  var fontHandwrite = "'Ma Shan Zheng', cursive";

  var COLOR = {
    lifeGreen: "#2E7D32",
    deepForest: "#1B5E20",
    sproutGreen: "#C8E6C9",
    earthBrown: "#5D4037",
    mistBlue: "#E3F2FD",
    warmOrange: "#F57C00",
    paperWhite: "#FFF8E1",
    earthTone: "#8D6E63",
    skyBlue: "#0288D1",
  };

  var sectionVisible = function (id) { return state.visibleSections[id]; };
  var animStyle = function (id, delay) {
    return {
      opacity: sectionVisible(id) ? 1 : 0,
      transform: sectionVisible(id) ? "translateY(0)" : "translateY(40px)",
      transition: "opacity 0.8s ease " + (delay || 0) + "s, transform 0.8s ease " + (delay || 0) + "s",
    };
  };

  if (sectionVisible("problem") && !state.numbersAnimated) self.animateNumbers();
  if (sectionVisible("results") && !state.resultsNumbersAnimated) self.animateResultNumbers();

  // ========== 数据定义 ==========
  var navLinks = [
    { label: "问题", target: "problem" },
    { label: "方案", target: "solution" },
    { label: "成果", target: "results" },
    { label: "参与", target: "action" },
    { label: "透明", target: "transparency" },
  ];

  var stories = [
    { name: "小芳", age: "12岁", location: "云南省怒江州", quote: "以前每天天不亮就要去河边打水，现在学校旁边就有干净的水，我终于可以安心读书了。", before: "每天步行4公里取水，经常因此迟到旷课", after: "村口通了自来水，出勤率从60%提升到98%", emoji: "👧" },
    { name: "王大爷", age: "68岁", location: "贵州省毕节市", quote: "活了大半辈子，头一回喝上这么甘甜的水。孙子再也不闹肚子了。", before: "常年饮用浑浊溪水，孙辈频繁腹泻", after: "安装净水设备后，全家腹泻发病率降为零", emoji: "👴" },
    { name: "李医生", age: "35岁", location: "广西壮族自治区", quote: "作为乡村医生，我亲眼见证了干净水源带来的改变——门诊量少了一半，孩子们更健康了。", before: "每月接诊水源性疾病患者超过40例", after: "通水一年后，水源性疾病下降75%", emoji: "👨‍⚕️" },
  ];

  var solutionPhases = [
    { phase: "第一阶段", title: "勘探评估", color: COLOR.earthTone, lightColor: "#EFEBE9", icon: "🔍", items: ["专业地质勘测定位水源", "社区需求评估与参与", "可持续运营模型设计"], duration: "1-2个月" },
    { phase: "第二阶段", title: "设备安装", color: COLOR.lifeGreen, lightColor: "#E8F5E9", icon: "🔧", items: ["太阳能供电系统部署", "生物砂滤+超滤净化装置", "村民操作维护培训"], duration: "2-3个月" },
    { phase: "第三阶段", title: "长期维护", color: COLOR.skyBlue, lightColor: "#E3F2FD", icon: "🛡️", items: ["培养本地水管员团队", "物联网远程水质监测", "社区水基金自我造血"], duration: "持续运营" },
  ];

  var trustBadges = [
    { name: "中国扶贫基金会", abbr: "扶", color: "#C62828" },
    { name: "腾讯公益", abbr: "腾", color: "#1565C0" },
    { name: "NSF国际认证", abbr: "N", color: "#00695C" },
    { name: "中国慈善联合会", abbr: "慈", color: "#E65100" },
  ];

  var impactStories = [
    { category: "教育", icon: "📚", title: "点亮求学之路", stat: "出勤率提升38%", description: "不再需要长途取水后，孩子们有了更多时间学习。项目覆盖村庄的小学出勤率平均提升38%，辍学率下降52%。", color: "#1565C0" },
    { category: "经济", icon: "💪", title: "释放劳动力", stat: "妇女收入增长45%", description: "妇女从每天数小时的取水劳动中解放出来，投入手工艺、种植等生产活动，家庭收入平均增长45%。", color: "#E65100" },
    { category: "健康", icon: "❤️", title: "守护生命健康", stat: "医疗支出减少60%", description: "清洁水源使水源性疾病大幅减少，村民医疗支出平均降低60%，5岁以下儿童腹泻发病率下降75%。", color: "#C62828" },
    { category: "环境", icon: "🌍", title: "绿色可持续", stat: "减少塑料瓶12万个/年", description: "太阳能供电的净水系统零碳排放，村民不再依赖瓶装水，每年减少约12万个塑料瓶的使用。", color: COLOR.lifeGreen },
  ];

  var donationTiers = [
    { amount: 50, label: "一杯净水", icon: "💧", impact: "1个孩子 × 1个月" },
    { amount: 200, label: "一个滤芯", icon: "🔄", impact: "1个家庭 × 6个月" },
    { amount: 500, label: "一次检测", icon: "🔬", impact: "1个村庄 × 1次" },
    { amount: 2000, label: "一口水井", icon: "⛲", impact: "1个村庄 × 永久" },
  ];

  var paymentMethods = [
    { name: "微信支付", icon: "💚", color: "#07C160" },
    { name: "支付宝", icon: "💙", color: "#1677FF" },
    { name: "银联", icon: "❤️", color: "#E60012" },
    { name: "信用卡", icon: "💳", color: "#333" },
  ];

  var volunteerTypes = [
    { type: "技术志愿者", icon: "⚙️", description: "水利工程、环境科学、IT技术等专业人才", tasks: ["水质检测与分析", "设备安装调试", "物联网系统维护"], requirement: "相关专业背景" },
    { type: "教育志愿者", icon: "📖", description: "教师、培训师、公共卫生教育工作者", tasks: ["卫生健康知识宣教", "村民用水培训", "儿童环保教育"], requirement: "教育或公卫背景" },
    { type: "传播志愿者", icon: "📸", description: "摄影师、记者、新媒体运营、设计师", tasks: ["项目纪实拍摄", "社交媒体运营", "宣传物料设计"], requirement: "内容创作能力" },
  ];

  var timelineEvents = [
    { date: "2026.03.01", title: "云南怒江3村通水仪式", type: "通水", icon: "🎉" },
    { date: "2026.02.20", title: "贵州毕节水质检测报告发布", type: "检测", icon: "📋" },
    { date: "2026.02.10", title: "第12期志愿者培训完成", type: "培训", icon: "🎓" },
    { date: "2026.01.25", title: "广西百色5村设备安装完成", type: "安装", icon: "🔧" },
    { date: "2026.01.15", title: "2025年度审计报告发布", type: "审计", icon: "📊" },
  ];

  var financialData = [
    { label: "设备采购与安装", percent: 62, color: COLOR.lifeGreen },
    { label: "人员与培训", percent: 18, color: COLOR.skyBlue },
    { label: "水质监测", percent: 12, color: COLOR.earthTone },
    { label: "社区发展基金", percent: 8, color: COLOR.warmOrange },
  ];

  var accordionItems = [
    { title: "项目如何确保水质安全？", content: "我们采用三级净化体系：生物砂滤→超滤膜过滤→紫外线消毒，出水水质达到国家《生活饮用水卫生标准》(GB 5749)。每月进行水质检测，数据实时上传物联网平台，确保持续达标。" },
    { title: "捐赠资金如何使用？", content: "100%的捐赠资金直接用于项目执行，行政费用由基金会专项拨款覆盖。每笔捐赠可追溯，季度报告详细列明资金流向。年度审计由德勤会计师事务所独立完成。" },
    { title: "志愿者需要什么条件？", content: "年满18周岁，身体健康，认同公益理念。技术志愿者需相关专业背景，教育和传播志愿者需具备对应技能。所有志愿者需完成线上培训课程后方可参与实地项目。" },
    { title: "如何保证项目可持续运营？", content: "每个项目点建立社区水基金，由村民自主管理。培训本地水管员负责日常维护，物联网系统远程监控设备状态。太阳能供电确保零运营能耗成本。" },
  ];

  var footerLinks = [
    { title: "关于我们", links: ["机构介绍", "团队成员", "发展历程", "合作伙伴"] },
    { title: "项目信息", links: ["进行中项目", "已完成项目", "水质报告", "年度报告"] },
    { title: "参与方式", links: ["个人捐赠", "企业合作", "志愿者申请", "月捐计划"] },
    { title: "联系我们", links: ["service@greensource.org", "400-888-9527", "北京市朝阳区公益路1号"] },
  ];

  // ========== SVG 进度环 ==========
  var renderProgressRing = function (percent, ringColor, size, label, value) {
    var radius = (size - 10) / 2;
    var circumference = 2 * Math.PI * radius;
    var offset = circumference - (percent / 100) * circumference;
    return (
      <div style={{ textAlign: "center" }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="7" />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={ringColor} strokeWidth="7" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.5s ease" }} />
        </svg>
        <div style={{ marginTop: "-" + (size / 2 + 16) + "px", position: "relative", height: (size / 2 + 16) + "px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: Math.max(20, size / 4) + "px", fontWeight: "800", color: ringColor, fontFamily: fontTitle }}>{value}</div>
        </div>
        <div style={{ fontSize: "13px", color: "#666", marginTop: "8px", fontFamily: fontBody }}>{label}</div>
      </div>
    );
  };

  // ========== SVG 饼图 ==========
  var renderPieChart = function (data, size) {
    var total = data.reduce(function (sum, item) { return sum + item.percent; }, 0);
    var currentAngle = 0;
    var paths = data.map(function (item) {
      var angle = (item.percent / total) * 360;
      var startAngle = currentAngle;
      var endAngle = currentAngle + angle;
      currentAngle = endAngle;
      var startRad = ((startAngle - 90) * Math.PI) / 180;
      var endRad = ((endAngle - 90) * Math.PI) / 180;
      var radius = size / 2 - 4;
      var cx = size / 2;
      var cy = size / 2;
      var x1 = cx + radius * Math.cos(startRad);
      var y1 = cy + radius * Math.sin(startRad);
      var x2 = cx + radius * Math.cos(endRad);
      var y2 = cy + radius * Math.sin(endRad);
      var largeArc = angle > 180 ? 1 : 0;
      var pathData = "M " + cx + " " + cy + " L " + x1 + " " + y1 + " A " + radius + " " + radius + " 0 " + largeArc + " 1 " + x2 + " " + y2 + " Z";
      return (<path key={item.label} d={pathData} fill={item.color} stroke="#fff" strokeWidth="2" />);
    });
    return (
      <svg width={size} height={size} viewBox={"0 0 " + size + " " + size}>
        {paths}
        <circle cx={size / 2} cy={size / 2} r={size / 4} fill="#fff" />
        <text x={size / 2} y={size / 2 - 6} textAnchor="middle" fill={COLOR.earthBrown} fontSize="11" fontWeight="700">100%</text>
        <text x={size / 2} y={size / 2 + 10} textAnchor="middle" fill="#999" fontSize="9">用于项目</text>
      </svg>
    );
  };

  // ========== 渲染主体 ==========
  return (
    <div style={{ fontFamily: fontBody, color: "#333", background: COLOR.paperWhite, overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }}></style>
      <div style={{ display: "none" }}>{timestamp}</div>

      {/* ==================== 导航栏 ==================== */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: state.scrolled ? "10px 24px" : "16px 24px", background: state.scrolled ? "rgba(255,248,225,0.95)" : "transparent", backdropFilter: state.scrolled ? "blur(20px)" : "none", borderBottom: state.scrolled ? "1px solid rgba(46,125,50,0.1)" : "none", transition: "all 0.4s ease" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={function () { window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, " + COLOR.lifeGreen + ", " + COLOR.sproutGreen + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 2px 8px rgba(46,125,50,0.3)" }}>💧</div>
            <span style={{ fontSize: "18px", fontWeight: "700", color: state.scrolled ? COLOR.deepForest : "#fff", fontFamily: fontHandwrite, transition: "color 0.4s ease" }}>绿源乡村</span>
          </div>
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {navLinks.map(function (link) {
              return (<a key={link.label} className="nav-link" onClick={function () { self.scrollToSection(link.target); }} style={{ color: state.scrolled ? "#555" : "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.5px" }}>{link.label}</a>);
            })}
            <button className="cta-primary" onClick={function () { self.scrollToSection("action"); }} style={{ padding: "10px 24px", borderRadius: "100px", border: "none", background: "linear-gradient(135deg, " + COLOR.lifeGreen + ", #43A047)", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 16px rgba(46,125,50,0.3)" }}>立即捐赠</button>
          </div>
          <button className="show-mobile" onClick={function () { self.setCustomState({ mobileMenuOpen: !state.mobileMenuOpen }); }} style={{ display: "none", background: "none", border: "none", color: state.scrolled ? COLOR.earthBrown : "#fff", fontSize: "24px", cursor: "pointer", padding: "4px" }}>{state.mobileMenuOpen ? "✕" : "☰"}</button>
        </div>
        {state.mobileMenuOpen && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(255,248,225,0.98)", backdropFilter: "blur(20px)", padding: "20px 24px", borderBottom: "1px solid rgba(46,125,50,0.1)", animation: "slideDown 0.3s ease" }}>
            {navLinks.map(function (link) {
              return (<a key={link.label} onClick={function () { self.scrollToSection(link.target); }} style={{ display: "block", padding: "12px 0", color: "#555", textDecoration: "none", fontSize: "15px", fontWeight: "600", borderBottom: "1px solid rgba(0,0,0,0.04)", cursor: "pointer" }}>{link.label}</a>);
            })}
            <button onClick={function () { self.scrollToSection("action"); }} style={{ width: "100%", marginTop: "12px", padding: "14px", borderRadius: "12px", border: "none", background: COLOR.lifeGreen, color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>立即捐赠</button>
          </div>
        )}
      </nav>

      {/* ==================== 1. 开场（情感锚定） ==================== */}
      <section data-animate="hero" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #0a1f0a 0%, " + COLOR.deepForest + " 40%, #1a4a1a 70%, " + COLOR.lifeGreen + " 100%)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 30% 40%, rgba(200,230,201,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(2,136,209,0.06) 0%, transparent 50%)" }}></div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", overflow: "hidden" }}>
          {[
            { left: "8%", top: "15%", size: 6, delay: "0s", duration: "4s" },
            { left: "22%", top: "60%", size: 4, delay: "1s", duration: "3.5s" },
            { left: "45%", top: "25%", size: 8, delay: "0.5s", duration: "5s" },
            { left: "65%", top: "70%", size: 5, delay: "2s", duration: "4.5s" },
            { left: "80%", top: "35%", size: 7, delay: "1.5s", duration: "3.8s" },
            { left: "90%", top: "55%", size: 4, delay: "0.8s", duration: "4.2s" },
          ].map(function (particle, index) {
            return (<div key={index} style={{ position: "absolute", left: particle.left, top: particle.top, width: particle.size + "px", height: particle.size + "px", borderRadius: "50%", background: "rgba(200,230,201,0.25)", animation: "dropFall " + particle.duration + " ease-in-out infinite " + particle.delay }}></div>);
          })}
        </div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "10%", left: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,230,201,0.06) 0%, transparent 70%)", animation: "float 8s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", bottom: "10%", right: "8%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(2,136,209,0.05) 0%, transparent 70%)", animation: "float 10s ease-in-out infinite 3s" }}></div>
        </div>

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "800px", padding: "0 24px" }}>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 22px)", color: "rgba(255,255,255,0.7)", fontFamily: fontBody, fontWeight: "500", marginBottom: "16px", letterSpacing: "3px", opacity: state.heroLine1Visible ? 1 : 0, transform: state.heroLine1Visible ? "translateY(0)" : "translateY(30px)", transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>6000万人，每天走2小时取水</p>
          <p style={{ fontSize: "clamp(18px, 3vw, 26px)", color: "rgba(255,255,255,0.9)", fontFamily: fontBody, fontWeight: "600", marginBottom: "48px", letterSpacing: "2px", opacity: state.heroLine2Visible ? 1 : 0, transform: state.heroLine2Visible ? "translateY(0)" : "translateY(30px)", transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>但改变，可以从<span style={{ color: COLOR.sproutGreen, fontWeight: "800" }}>一口井</span>开始</p>
          <h1 style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: "900", fontFamily: fontHandwrite, marginBottom: "20px", lineHeight: 1.1, background: "linear-gradient(135deg, " + COLOR.sproutGreen + " 0%, #81C784 30%, #fff 60%, " + COLOR.sproutGreen + " 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", opacity: state.heroBrandVisible ? 1 : 0, transform: state.heroBrandVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)", transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>绿源乡村</h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "rgba(255,255,255,0.5)", fontFamily: fontBody, marginBottom: "48px", letterSpacing: "6px", opacity: state.heroBrandVisible ? 1 : 0, transition: "opacity 1s ease 0.3s" }}>清洁饮水 · 改变命运</p>
          <div style={{ opacity: state.heroCtaVisible ? 1 : 0, transform: state.heroCtaVisible ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease" }}>
            <button className="cta-primary" onClick={function () { self.scrollToSection("problem"); }} style={{ padding: "18px 48px", borderRadius: "100px", border: "none", background: "linear-gradient(135deg, " + COLOR.lifeGreen + ", #43A047)", color: "#fff", fontSize: "17px", fontWeight: "700", cursor: "pointer", letterSpacing: "3px", boxShadow: "0 8px 32px rgba(46,125,50,0.4)", animation: "gentleGlow 3s ease-in-out infinite" }}>探索我们的故事 ↓</button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "80px", overflow: "hidden" }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill={COLOR.paperWhite} />
          </svg>
        </div>
      </section>

      {/* ==================== 2. 问题现状 ==================== */}
      <section id="problem" data-animate="problem" style={{ padding: "100px 24px 80px", background: COLOR.paperWhite }}>
        <div style={Object.assign({ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }, animStyle("problem", 0))}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ display: "inline-block", background: "rgba(93,64,55,0.08)", color: COLOR.earthBrown, fontSize: "13px", fontWeight: "600", padding: "6px 18px", borderRadius: "100px", marginBottom: "16px" }}>问题现状</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800", color: COLOR.earthBrown, fontFamily: fontTitle, marginBottom: "16px" }}>水，不该是奢侈品</h2>
            <p style={{ fontSize: "17px", color: "#666", maxWidth: "600px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.8 }}>在中国偏远农村地区，数千万人仍在为一口干净的水而挣扎</p>
          </div>

          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            <div style={Object.assign({ flex: "1 1 400px", minWidth: "300px" }, animStyle("problem", 0.2))}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "center" }}>
                {renderProgressRing(state.animatedNumbers.people > 0 ? 100 : 0, "#D32F2F", 140, "缺乏安全饮水人口", state.animatedNumbers.people > 0 ? state.animatedNumbers.people + "万" : "0")}
                {renderProgressRing(state.animatedNumbers.hours > 0 ? 100 : 0, COLOR.warmOrange, 140, "平均每日取水往返", state.animatedNumbers.hours > 0 ? state.animatedNumbers.hours + "小时" : "0")}
                {renderProgressRing(state.animatedNumbers.preventable, COLOR.lifeGreen, 140, "水源性疾病可预防", state.animatedNumbers.preventable > 0 ? state.animatedNumbers.preventable + "%" : "0")}
              </div>
              <div style={{ marginTop: "32px", padding: "20px 24px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(211,47,47,0.04), rgba(46,125,50,0.04))", border: "1px solid rgba(93,64,55,0.08)" }}>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.8, textAlign: "center" }}>每年，<strong style={{ color: "#D32F2F" }}>超过5万名</strong>5岁以下儿童因饮用不洁水源而失去生命。<br />但其中<strong style={{ color: COLOR.lifeGreen }}>80%</strong>的疾病可以通过清洁水源预防。</p>
              </div>
            </div>

            <div style={Object.assign({ flex: "1 1 400px", minWidth: "300px" }, animStyle("problem", 0.4))}>
              {stories.map(function (story, index) {
                var isActive = state.activeStory === index;
                return (
                  <div key={story.name} className="story-card" onClick={function () { self.setCustomState({ activeStory: index }); }} style={{ padding: isActive ? "28px" : "16px 20px", borderRadius: "16px", marginBottom: "16px", cursor: "pointer", background: isActive ? "#fff" : "rgba(255,255,255,0.6)", border: isActive ? "2px solid " + COLOR.lifeGreen : "1px solid rgba(0,0,0,0.04)", boxShadow: isActive ? "0 8px 32px rgba(46,125,50,0.1)" : "none", transition: "all 0.4s ease" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: isActive ? "16px" : "0" }}>
                      <span style={{ fontSize: "32px" }}>{story.emoji}</span>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: "700", color: COLOR.earthBrown }}>{story.name}</div>
                        <div style={{ fontSize: "12px", color: "#999" }}>{story.age} · {story.location}</div>
                      </div>
                    </div>
                    {isActive && (
                      <div style={{ animation: "fadeIn 0.5s ease" }}>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.8, fontStyle: "italic", fontFamily: fontHandwrite, marginBottom: "16px", padding: "12px 16px", borderLeft: "3px solid " + COLOR.lifeGreen, background: "rgba(200,230,201,0.15)", borderRadius: "0 8px 8px 0" }}>"{story.quote}"</p>
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          <div style={{ flex: "1 1 180px", padding: "12px 16px", borderRadius: "10px", background: "rgba(211,47,47,0.04)", border: "1px solid rgba(211,47,47,0.1)" }}>
                            <div style={{ fontSize: "11px", color: "#D32F2F", fontWeight: "700", marginBottom: "4px" }}>改变前</div>
                            <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.6 }}>{story.before}</div>
                          </div>
                          <div style={{ flex: "1 1 180px", padding: "12px 16px", borderRadius: "10px", background: "rgba(46,125,50,0.04)", border: "1px solid rgba(46,125,50,0.1)" }}>
                            <div style={{ fontSize: "11px", color: COLOR.lifeGreen, fontWeight: "700", marginBottom: "4px" }}>改变后</div>
                            <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.6 }}>{story.after}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. 解决方案 ==================== */}
      <section id="solution" data-animate="solution" style={{ padding: "100px 24px", background: "linear-gradient(180deg, " + COLOR.paperWhite + " 0%, #f5f0e0 100%)" }}>
        <div style={Object.assign({ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }, animStyle("solution", 0))}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ display: "inline-block", background: "rgba(46,125,50,0.08)", color: COLOR.lifeGreen, fontSize: "13px", fontWeight: "600", padding: "6px 18px", borderRadius: "100px", marginBottom: "16px" }}>解决方案</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800", color: COLOR.earthBrown, fontFamily: fontTitle, marginBottom: "16px" }}>科学、可持续的三阶段方案</h2>
            <p style={{ fontSize: "17px", color: "#666", maxWidth: "600px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.8 }}>从勘探到运营，每一步都经过严谨论证，确保项目长期可持续</p>
          </div>

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
            {solutionPhases.map(function (phase, index) {
              return (
                <div key={phase.title} className="timeline-card" style={Object.assign({ flex: "1 1 320px", maxWidth: "380px", borderRadius: "20px", overflow: "hidden", background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }, animStyle("solution", 0.15 + index * 0.15))}>
                  <div style={{ height: "6px", background: phase.color }}></div>
                  <div style={{ padding: "32px 28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                      <span style={{ fontSize: "32px" }}>{phase.icon}</span>
                      <div>
                        <div style={{ fontSize: "12px", color: phase.color, fontWeight: "700", letterSpacing: "1px" }}>{phase.phase}</div>
                        <div style={{ fontSize: "22px", fontWeight: "800", color: COLOR.earthBrown, fontFamily: fontTitle }}>{phase.title}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                      {phase.items.map(function (item) {
                        return (<div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: phase.color, flexShrink: 0 }}></div><span style={{ fontSize: "14px", color: "#555", lineHeight: 1.6 }}>{item}</span></div>);
                      })}
                    </div>
                    <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "100px", background: phase.lightColor, color: phase.color, fontSize: "13px", fontWeight: "600" }}>⏱ {phase.duration}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={Object.assign({ marginTop: "64px", textAlign: "center" }, animStyle("solution", 0.6))}>
            <p style={{ fontSize: "13px", color: "#999", marginBottom: "20px", letterSpacing: "2px" }}>权威认证与合作伙伴</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              {trustBadges.map(function (badge) {
                return (
                  <div key={badge.name} className="trust-badge" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px", borderRadius: "14px", background: "rgba(255,255,255,0.9)", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: badge.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px", fontWeight: "800" }}>{badge.abbr}</div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: COLOR.earthBrown }}>{badge.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. 成果展示 ==================== */}
      <section id="results" data-animate="results" style={{ padding: "100px 24px", background: "linear-gradient(160deg, " + COLOR.deepForest + " 0%, #1a3a1a 50%, " + COLOR.lifeGreen + " 100%)", position: "relative" }}>
        <div style={Object.assign({ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 2 }, animStyle("results", 0))}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ display: "inline-block", background: "rgba(200,230,201,0.15)", color: COLOR.sproutGreen, fontSize: "13px", fontWeight: "600", padding: "6px 18px", borderRadius: "100px", marginBottom: "16px" }}>成果展示</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800", color: "#fff", fontFamily: fontTitle, marginBottom: "16px" }}>每一滴水，都在改变世界</h2>
            <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: "600px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.8 }}>数据见证我们共同创造的改变</p>
          </div>

          <div style={Object.assign({ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "64px" }, animStyle("results", 0.2))}>
            {[
              { value: state.animatedNumbers.villages, label: "覆盖村庄", icon: "🏘️", unit: "个" },
              { value: state.animatedNumbers.benefited >= 10000 ? (state.animatedNumbers.benefited / 10000).toFixed(1) : state.animatedNumbers.benefited, label: "受益人口", icon: "👨‍👩‍👧‍👦", unit: state.animatedNumbers.benefited >= 10000 ? "万人" : "人" },
              { value: state.animatedNumbers.waterRate, label: "水质达标率", icon: "✅", unit: "%" },
              { value: state.animatedNumbers.healthDrop, label: "腹泻下降", icon: "📉", unit: "%" },
            ].map(function (item) {
              return (
                <div key={item.label} style={{ textAlign: "center", padding: "32px 20px", borderRadius: "20px", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: "28px", marginBottom: "12px" }}>{item.icon}</div>
                  <div style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: "800", color: "#fff", fontFamily: fontTitle }}>{item.value}{item.unit}</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginTop: "8px" }}>{item.label}</div>
                </div>
              );
            })}
          </div>

          <div style={Object.assign({ padding: "32px", borderRadius: "20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "64px", position: "relative", overflow: "hidden", minHeight: "200px" }, animStyle("results", 0.35))}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}><span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>📍 项目覆盖地图 · 实时更新</span></div>
            <div style={{ position: "relative", height: "160px" }}>
              {[
                { left: "15%", top: "30%", label: "云南", count: 38 },
                { left: "25%", top: "55%", label: "贵州", count: 42 },
                { left: "35%", top: "65%", label: "广西", count: 28 },
                { left: "45%", top: "40%", label: "四川", count: 18 },
                { left: "60%", top: "50%", label: "湖南", count: 16 },
              ].map(function (point) {
                return (
                  <div key={point.label} style={{ position: "absolute", left: point.left, top: point.top, textAlign: "center" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: COLOR.sproutGreen, margin: "0 auto 4px", animation: "mapPulse 2s ease-in-out infinite", boxShadow: "0 0 12px rgba(200,230,201,0.5)" }}></div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontWeight: "600" }}>{point.label}</div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>{point.count}村</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={animStyle("results", 0.5)}>
            <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", fontFamily: fontTitle, textAlign: "center", marginBottom: "32px" }}>影响力故事</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
              {impactStories.map(function (story, index) {
                var isActive = state.activeImpactTab === index;
                return (<button key={story.category} className="impact-tab" onClick={function () { self.setCustomState({ activeImpactTab: index }); }} style={{ padding: "10px 20px", borderRadius: "100px", border: "none", background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)", color: isActive ? "#fff" : "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: isActive ? "700" : "500", cursor: "pointer", transition: "all 0.3s ease" }}>{story.icon} {story.category}</button>);
              })}
            </div>
            <div style={{ padding: "36px", borderRadius: "20px", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", animation: "fadeIn 0.5s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <span style={{ fontSize: "40px" }}>{impactStories[state.activeImpactTab].icon}</span>
                <div>
                  <h4 style={{ fontSize: "20px", fontWeight: "800", color: "#fff", fontFamily: fontTitle }}>{impactStories[state.activeImpactTab].title}</h4>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: COLOR.sproutGreen, marginTop: "4px" }}>{impactStories[state.activeImpactTab].stat}</div>
                </div>
              </div>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>{impactStories[state.activeImpactTab].description}</p>
            </div>
          </div>

          <div style={Object.assign({ marginTop: "64px", textAlign: "center", padding: "48px 32px", borderRadius: "20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }, animStyle("results", 0.65))}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎬</div>
            <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>3分钟纪录片：《水的故事》</h4>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>跟随镜头走进乡村，见证清洁水源带来的真实改变</p>
            <button className="cta-secondary" onClick={function () { self.utils.toast({ title: "纪录片即将上线，敬请期待！", type: "success" }); }} style={{ padding: "14px 36px", borderRadius: "100px", border: "2px solid rgba(255,255,255,0.3)", background: "transparent", color: "#fff", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>▶ 点击播放</button>
          </div>
        </div>
      </section>

      {/* ==================== 5. 参与行动 ==================== */}
      <section id="action" data-animate="action" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #f5f0e0 0%, " + COLOR.paperWhite + " 100%)" }}>
        <div style={Object.assign({ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }, animStyle("action", 0))}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ display: "inline-block", background: "rgba(46,125,50,0.08)", color: COLOR.lifeGreen, fontSize: "13px", fontWeight: "600", padding: "6px 18px", borderRadius: "100px", marginBottom: "16px" }}>参与行动</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800", color: COLOR.earthBrown, fontFamily: fontTitle, marginBottom: "16px" }}>您的每一份力量，都是改变的开始</h2>
          </div>

          {/* 紧急项目横幅 */}
          <div style={Object.assign({ marginBottom: "48px", padding: "28px 32px", borderRadius: "20px", background: "linear-gradient(135deg, rgba(245,124,0,0.08), rgba(245,124,0,0.03))", border: "2px solid " + COLOR.warmOrange, position: "relative", overflow: "hidden" }, animStyle("action", 0.1))}>
            <div style={{ position: "absolute", top: "12px", right: "16px", background: COLOR.warmOrange, color: "#fff", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "700", letterSpacing: "1px" }}>🔥 紧急</div>
            <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 300px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: COLOR.warmOrange, marginBottom: "8px" }}>云南20村急需清洁水源</h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.6 }}>怒江州20个村庄的2,400名村民仍在饮用未经处理的河水，急需您的帮助</p>
              </div>
              <div style={{ flex: "0 0 auto", textAlign: "center" }}>
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", color: "#666" }}>已筹集</span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: COLOR.warmOrange }}>67%</span>
                  </div>
                  <div style={{ width: "240px", height: "10px", borderRadius: "5px", background: "rgba(245,124,0,0.1)", overflow: "hidden" }}>
                    <div style={{ width: "67%", height: "100%", borderRadius: "5px", background: "linear-gradient(90deg, " + COLOR.warmOrange + ", #FF9800)", backgroundSize: "200% 100%", animation: "waveProgress 2s linear infinite" }}></div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                  {[
                    { value: state.countdownDays, label: "天" },
                    { value: state.countdownHours, label: "时" },
                    { value: state.countdownMinutes, label: "分" },
                    { value: state.countdownSeconds, label: "秒" },
                  ].map(function (unit) {
                    return (
                      <div key={unit.label} style={{ textAlign: "center" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: COLOR.warmOrange, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "800", fontFamily: fontTitle }}>{unit.value < 10 ? "0" + unit.value : unit.value}</div>
                        <div style={{ fontSize: "10px", color: "#999", marginTop: "4px" }}>{unit.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 双路径 */}
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {/* 捐赠路径 */}
            <div style={Object.assign({ flex: "1 1 500px", minWidth: "320px", borderRadius: "24px", background: "linear-gradient(160deg, " + COLOR.deepForest + ", #1a3a1a)", padding: "40px 32px", color: "#fff" }, animStyle("action", 0.2))}>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <span style={{ display: "inline-block", background: "rgba(200,230,201,0.15)", color: COLOR.sproutGreen, fontSize: "12px", fontWeight: "600", padding: "4px 14px", borderRadius: "100px", marginBottom: "12px" }}>100% 执行 · 0 行政费</span>
                <h3 style={{ fontSize: "24px", fontWeight: "800", fontFamily: fontTitle }}>捐赠清洁水源</h3>
              </div>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px", background: "rgba(255,255,255,0.08)", borderRadius: "100px", padding: "4px" }}>
                {["月捐", "单次"].map(function (label, index) {
                  var isActive = (index === 0 && state.isMonthlyDonation) || (index === 1 && !state.isMonthlyDonation);
                  return (<button key={label} onClick={function () { self.setCustomState({ isMonthlyDonation: index === 0 }); }} style={{ flex: 1, padding: "10px 20px", borderRadius: "100px", border: "none", background: isActive ? COLOR.lifeGreen : "transparent", color: isActive ? "#fff" : "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" }}>{label}{index === 0 ? " 💚" : ""}</button>);
                })}
              </div>

              {state.donationSubmitted ? (
                <div style={{ textAlign: "center", padding: "48px 24px", animation: "fadeIn 0.5s ease" }}>
                  <div style={{ fontSize: "64px", marginBottom: "16px" }}>💚</div>
                  <h4 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "12px" }}>感谢您的善举！</h4>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>您已帮助 <strong style={{ color: COLOR.sproutGreen }}>{Math.floor((donationTiers[state.selectedDonation] ? donationTiers[state.selectedDonation].amount : 0) / 50)}</strong> 个孩子喝上干净水</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>电子证书和抵税发票将发送至您的邮箱</p>
                </div>
              ) : (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "16px" }}>
                    {donationTiers.map(function (tier, index) {
                      var isSelected = state.selectedDonation === index;
                      return (
                        <div key={tier.amount} className="donation-tier" onClick={function () { self.setCustomState({ selectedDonation: index }); }} style={{ padding: "20px 16px", borderRadius: "16px", cursor: "pointer", background: isSelected ? "rgba(46,125,50,0.3)" : "rgba(255,255,255,0.06)", border: isSelected ? "2px solid " + COLOR.sproutGreen : "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
                          <div style={{ fontSize: "24px", marginBottom: "8px" }}>{tier.icon}</div>
                          <div style={{ fontSize: "24px", fontWeight: "800", fontFamily: fontTitle }}>¥{tier.amount}</div>
                          <div style={{ fontSize: "13px", fontWeight: "600", marginTop: "4px", color: COLOR.sproutGreen }}>{tier.label}</div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "6px" }}>{tier.impact}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginBottom: "20px", padding: "14px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.06)", border: state.selectedDonation === 4 ? "2px solid " + COLOR.sproutGreen : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "8px" }} onClick={function () { self.setCustomState({ selectedDonation: 4 }); }}>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", fontWeight: "700" }}>¥</span>
                    <input id="custom-donation-input" type="number" placeholder="自定义金额" defaultValue="" onFocus={function () { self.setCustomState({ selectedDonation: 4 }); }} onChange={function (e) { _customState.customDonationAmount = e.target.value; }} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "16px", fontWeight: "600" }} />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "10px" }}>支付方式</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {paymentMethods.map(function (method, index) {
                        var isSelected = state.selectedPayment === index;
                        return (<button key={method.name} className="payment-option" onClick={function () { self.setCustomState({ selectedPayment: index }); }} style={{ flex: "1 1 auto", padding: "10px 14px", borderRadius: "10px", border: isSelected ? "2px solid " + method.color : "1px solid rgba(255,255,255,0.1)", background: isSelected ? "rgba(255,255,255,0.1)" : "transparent", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}><span>{method.icon}</span> {method.name}</button>);
                      })}
                    </div>
                  </div>

                  <button className="cta-primary" onClick={function () { self.handleDonate(); }} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, " + COLOR.lifeGreen + ", #43A047)", color: "#fff", fontSize: "17px", fontWeight: "800", cursor: "pointer", animation: "pulse 2.5s ease-in-out infinite", letterSpacing: "2px" }}>💚 {state.isMonthlyDonation ? "开始月捐" : "立即捐赠"}</button>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: "12px" }}>捐赠即可获得电子证书 · 可申请抵税发票 · 支持匿名捐赠</p>
                </div>
              )}
            </div>

            {/* 志愿者路径 */}
            <div style={Object.assign({ flex: "1 1 400px", minWidth: "320px", borderRadius: "24px", background: "#E8F5E9", padding: "40px 32px" }, animStyle("action", 0.35))}>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <h3 style={{ fontSize: "24px", fontWeight: "800", color: COLOR.deepForest, fontFamily: fontTitle }}>成为志愿者</h3>
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>用你的专业技能，为乡村带去改变</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                {volunteerTypes.map(function (vol, index) {
                  var isExpanded = state.expandedVolunteer === index;
                  return (
                    <div key={vol.type} className="volunteer-card" onClick={function () { self.setCustomState({ expandedVolunteer: isExpanded ? -1 : index }); }} style={{ padding: "18px 20px", borderRadius: "14px", cursor: "pointer", background: "#fff", border: isExpanded ? "2px solid " + COLOR.lifeGreen : "1px solid rgba(0,0,0,0.04)", boxShadow: isExpanded ? "0 8px 24px rgba(46,125,50,0.1)" : "0 2px 8px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "28px" }}>{vol.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "15px", fontWeight: "700", color: COLOR.earthBrown }}>{vol.type}</div>
                          <div style={{ fontSize: "12px", color: "#888" }}>{vol.description}</div>
                        </div>
                        <span style={{ fontSize: "16px", color: "#999", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>▾</span>
                      </div>
                      {isExpanded && (
                        <div style={{ marginTop: "16px", animation: "fadeIn 0.3s ease" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                            {vol.tasks.map(function (task) { return (<span key={task} style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(46,125,50,0.08)", color: COLOR.lifeGreen, fontSize: "12px", fontWeight: "500" }}>{task}</span>); })}
                          </div>
                          <div style={{ fontSize: "12px", color: "#888" }}>要求：{vol.requirement}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
                {["提交申请", "资质审核", "线上培训", "参与项目"].map(function (step, index) {
                  return (<div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}><div style={{ padding: "4px 12px", borderRadius: "100px", background: "rgba(46,125,50,0.08)", color: COLOR.lifeGreen, fontSize: "12px", fontWeight: "600" }}>{step}</div>{index < 3 && <span style={{ color: "#ccc", fontSize: "12px" }}>→</span>}</div>);
                })}
              </div>

              <button className="cta-primary" onClick={function () { self.utils.toast({ title: "志愿者申请通道即将开放，敬请期待！", type: "success" }); }} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: COLOR.deepForest, color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>申请成为志愿者</button>
              <p style={{ fontSize: "11px", color: "#888", textAlign: "center", marginTop: "12px" }}>完成项目可获得志愿服务证书 · 年度志愿者聚会</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. 社区透明 ==================== */}
      <section id="transparency" data-animate="transparency" style={{ padding: "100px 24px", background: "linear-gradient(180deg, " + COLOR.paperWhite + " 0%, #f5f0e0 100%)" }}>
        <div style={Object.assign({ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }, animStyle("transparency", 0))}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ display: "inline-block", background: "rgba(2,136,209,0.08)", color: COLOR.skyBlue, fontSize: "13px", fontWeight: "600", padding: "6px 18px", borderRadius: "100px", marginBottom: "16px" }}>公开透明</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800", color: COLOR.earthBrown, fontFamily: fontTitle, marginBottom: "16px" }}>每一分钱，都经得起检验</h2>
          </div>

          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
            <div style={Object.assign({ flex: "1 1 400px", minWidth: "300px" }, animStyle("transparency", 0.2))}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLOR.earthBrown, marginBottom: "24px" }}>📡 实时动态</h3>
              <div style={{ position: "relative", paddingLeft: "24px" }}>
                <div style={{ position: "absolute", left: "7px", top: "8px", bottom: "8px", width: "2px", background: "linear-gradient(180deg, " + COLOR.lifeGreen + ", " + COLOR.sproutGreen + ")" }}></div>
                {timelineEvents.map(function (event, index) {
                  return (
                    <div key={index} style={{ marginBottom: "24px", position: "relative" }}>
                      <div style={{ position: "absolute", left: "-20px", top: "4px", width: "12px", height: "12px", borderRadius: "50%", background: COLOR.lifeGreen, border: "3px solid " + COLOR.paperWhite, boxShadow: "0 0 0 2px " + COLOR.lifeGreen }}></div>
                      <div style={{ padding: "16px 20px", borderRadius: "12px", background: "#fff", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          <span style={{ fontSize: "16px" }}>{event.icon}</span>
                          <span style={{ fontSize: "11px", color: "#999" }}>{event.date}</span>
                          <span style={{ padding: "2px 8px", borderRadius: "4px", background: "rgba(46,125,50,0.08)", color: COLOR.lifeGreen, fontSize: "10px", fontWeight: "600" }}>{event.type}</span>
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: COLOR.earthBrown }}>{event.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={Object.assign({ flex: "1 1 400px", minWidth: "300px" }, animStyle("transparency", 0.4))}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLOR.earthBrown, marginBottom: "24px" }}>💰 资金使用明细</h3>
              <div style={{ padding: "28px", borderRadius: "16px", background: "#fff", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap", justifyContent: "center" }}>
                  {renderPieChart(financialData, 160)}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {financialData.map(function (item) {
                      return (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}><div style={{ width: "10px", height: "10px", borderRadius: "3px", background: item.color }}></div><span style={{ fontSize: "13px", color: "#666" }}>{item.label}</span><span style={{ fontSize: "13px", fontWeight: "700", color: COLOR.earthBrown }}>{item.percent}%</span></div>);
                    })}
                  </div>
                </div>
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <button style={{ padding: "8px 20px", borderRadius: "8px", border: "1px solid " + COLOR.lifeGreen, background: "transparent", color: COLOR.lifeGreen, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>📄 下载2025年度审计报告</button>
                  <p style={{ fontSize: "11px", color: "#999", marginTop: "8px" }}>由德勤会计师事务所独立审计 · 第三方评估报告</p>
                </div>
              </div>

              <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLOR.earthBrown, marginBottom: "16px" }}>❓ 常见问题</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {accordionItems.map(function (item, index) {
                  var isExpanded = state.expandedAccordion === index;
                  return (
                    <div key={index} style={{ borderRadius: "12px", overflow: "hidden", background: "#fff", border: "1px solid rgba(0,0,0,0.04)" }}>
                      <div className="accordion-header" onClick={function () { self.toggleAccordion(index); }} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: COLOR.earthBrown }}>{item.title}</span>
                        <span style={{ fontSize: "18px", color: "#999", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>▾</span>
                      </div>
                      {isExpanded && (<div style={{ padding: "0 20px 16px", animation: "fadeIn 0.3s ease" }}><p style={{ fontSize: "13px", color: "#666", lineHeight: 1.8 }}>{item.content}</p></div>)}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: "24px", padding: "20px 24px", borderRadius: "14px", background: COLOR.mistBlue, border: "1px solid rgba(2,136,209,0.1)" }}>
                <h4 style={{ fontSize: "15px", fontWeight: "700", color: COLOR.skyBlue, marginBottom: "8px" }}>📬 订阅季度报告</h4>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>每季度收到项目进展、财务报告和影响力数据</p>
                {state.subscribeSubmitted ? (
                  <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(46,125,50,0.08)", textAlign: "center" }}><span style={{ fontSize: "14px", color: COLOR.lifeGreen, fontWeight: "600" }}>✅ 订阅成功！</span></div>
                ) : (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input id="subscribe-email-input" type="email" placeholder="输入邮箱地址" defaultValue="" onChange={function (e) { _customState.subscribeEmail = e.target.value; }} style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)", background: "#fff", fontSize: "13px", outline: "none" }} />
                    <button onClick={function () { self.handleSubscribe(); }} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: COLOR.skyBlue, color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>订阅</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. 结尾 ==================== */}
      <section data-animate="ending" style={{ padding: "120px 24px", background: "linear-gradient(160deg, #0d2b0d 0%, " + COLOR.deepForest + " 50%, " + COLOR.lifeGreen + " 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "20%", left: "10%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,230,201,0.1) 0%, transparent 70%)", animation: "float 8s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", bottom: "15%", right: "15%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,230,201,0.08) 0%, transparent 70%)", animation: "float 10s ease-in-out infinite 2s" }}></div>
        </div>

        <div style={Object.assign({ maxWidth: "700px", marginLeft: "auto", marginRight: "auto", textAlign: "center", position: "relative", zIndex: 2 }, animStyle("ending", 0))}>
          <div style={{ marginBottom: "48px" }}>
            <div style={{ fontSize: "72px", color: "rgba(200,230,201,0.15)", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: "-20px" }}>"</div>
            <p style={{ fontSize: "clamp(20px, 3.5vw, 28px)", color: "#fff", lineHeight: 1.8, fontFamily: fontHandwrite, marginBottom: "20px" }}>每一滴干净的水，都是一个孩子未来的可能性</p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>—— 绿源乡村创始人</p>
          </div>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
            <button className="cta-primary" onClick={function () { self.scrollToSection("action"); }} style={{ padding: "18px 48px", borderRadius: "100px", border: "none", background: "linear-gradient(135deg, " + COLOR.lifeGreen + ", #43A047)", color: "#fff", fontSize: "18px", fontWeight: "800", cursor: "pointer", animation: "pulse 2s ease-in-out infinite", letterSpacing: "2px" }}>💚 立即捐赠</button>
            <button className="cta-secondary" onClick={function () { self.scrollToSection("action"); }} style={{ padding: "18px 48px", borderRadius: "100px", border: "2px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", fontSize: "18px", fontWeight: "700", cursor: "pointer", letterSpacing: "2px" }}>🤝 加入志愿者</button>
          </div>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>已有 <strong style={{ color: COLOR.sproutGreen }}>12,847</strong> 人参与，共同守护清洁水源</p>
        </div>
      </section>

      {/* ==================== 页脚 ==================== */}
      <footer style={{ background: "#0a1f0a", padding: "80px 24px 40px", color: "#94A3B8" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "40px", marginBottom: "64px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, " + COLOR.lifeGreen + ", " + COLOR.sproutGreen + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>💧</div>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#fff", fontFamily: fontHandwrite }}>绿源乡村</span>
              </div>
              <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#64748B" }}>让每一个乡村都能喝上干净的水。我们相信，清洁水源是改变命运的起点。</p>
            </div>
            {footerLinks.map(function (column) {
              return (
                <div key={column.title}>
                  <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#E2E8F0", marginBottom: "16px", letterSpacing: "1px" }}>{column.title}</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {column.links.map(function (link) { return (<a key={link} className="footer-link" style={{ color: "#64748B", textDecoration: "none", fontSize: "13px", cursor: "pointer" }}>{link}</a>); })}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "32px" }}></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontSize: "12px", color: "#475569" }}>© 2026 绿源乡村公益基金会 · 京ICP备2026XXXXXX号 · 慈善组织公开募捐资格证书编号：53XXXXXXXX</p>
            <div style={{ display: "flex", gap: "12px" }}>
              {["微信", "微博", "抖音", "B站"].map(function (social) {
                return (<a key={social} style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontSize: "11px", fontWeight: "600", textDecoration: "none", cursor: "pointer", transition: "all 0.2s ease" }}>{social.charAt(0)}</a>);
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
