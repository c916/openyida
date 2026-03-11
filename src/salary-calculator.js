// ============================================================
// 状态管理
// ============================================================

const _customState = {
  // 输入参数
  monthlySalary: '',        // 月薪
  city: 'shanghai',         // 城市（默认上海）
  annualBonus: '',          // 年终奖月数
  socialBase: '',           // 社保基数
  housingBase: '',          // 公积金基数
  housingRate: 7,           // 公积金缴纳比例（%）
  specialDeduction: '',     // 专项附加扣除
  
  // 计算结果
  result: null,
  
  // UI 状态
  loading: false,
  activeTab: 'monthly',     // monthly | annual
};

export function getCustomState(key) {
  if (key) {
    return _customState[key];
  }
  return { ..._customState };
}

export function setCustomState(newState) {
  Object.keys(newState).forEach(function(key) {
    _customState[key] = newState[key];
  });
  this.forceUpdate();
}

export function forceUpdate() {
  this.setState({ timestamp: new Date().getTime() });
}

// ============================================================
// 常量定义
// ============================================================

// 城市社保配置（2024年数据）
const CITY_CONFIG = {
  shanghai: {
    name: '上海',
    pensionRate: 8,           // 养老保险个人比例
    medicalRate: 2,           // 医疗保险个人比例
    unemploymentRate: 0.5,    // 失业保险个人比例
    maxSocialBase: 36549,     // 社保上限
    minSocialBase: 7310,      // 社保下限
    maxHousingBase: 36549,    // 公积金上限
    minHousingBase: 2590,     // 公积金下限
  },
  beijing: {
    name: '北京',
    pensionRate: 8,
    medicalRate: 2,
    unemploymentRate: 0.5,
    maxSocialBase: 33891,
    minSocialBase: 6326,
    maxHousingBase: 33891,
    minHousingBase: 2420,
  },
  shenzhen: {
    name: '深圳',
    pensionRate: 8,
    medicalRate: 2,
    unemploymentRate: 0.5,
    maxSocialBase: 26421,
    minSocialBase: 2360,
    maxHousingBase: 41190,
    minHousingBase: 2360,
  },
  hangzhou: {
    name: '杭州',
    pensionRate: 8,
    medicalRate: 2,
    unemploymentRate: 0.5,
    maxSocialBase: 24060,
    minSocialBase: 4462,
    maxHousingBase: 38390,
    minHousingBase: 2280,
  },
  guangzhou: {
    name: '广州',
    pensionRate: 8,
    medicalRate: 2,
    unemploymentRate: 0.5,
    maxSocialBase: 26421,
    minSocialBase: 5284,
    maxHousingBase: 33786,
    minHousingBase: 2300,
  },
  chengdu: {
    name: '成都',
    pensionRate: 8,
    medicalRate: 2,
    unemploymentRate: 0.4,
    maxSocialBase: 21228,
    minSocialBase: 4246,
    maxHousingBase: 29362,
    minHousingBase: 2100,
  },
};

// 个税起征点
const TAX_THRESHOLD = 5000;

// 个税累进税率表（年度）
const ANNUAL_TAX_BRACKETS = [
  { limit: 36000, rate: 0.03, deduction: 0 },
  { limit: 144000, rate: 0.10, deduction: 2520 },
  { limit: 300000, rate: 0.20, deduction: 16920 },
  { limit: 420000, rate: 0.25, deduction: 31920 },
  { limit: 660000, rate: 0.30, deduction: 52920 },
  { limit: 960000, rate: 0.35, deduction: 85920 },
  { limit: Infinity, rate: 0.45, deduction: 181920 },
];

// 年终奖单独计税税率表
const BONUS_TAX_BRACKETS = [
  { limit: 36000, rate: 0.03, deduction: 0 },
  { limit: 144000, rate: 0.10, deduction: 210 },
  { limit: 300000, rate: 0.20, deduction: 1410 },
  { limit: 420000, rate: 0.25, deduction: 2660 },
  { limit: 660000, rate: 0.30, deduction: 4410 },
  { limit: 960000, rate: 0.35, deduction: 7160 },
  { limit: Infinity, rate: 0.45, deduction: 15160 },
];

// ============================================================
// 生命周期钩子
// ============================================================

export function didMount() {
  // 页面加载完成后的初始化逻辑
  console.log('薪资计算器已加载');
}

export function didUnmount() {
  // 页面卸载时的清理逻辑
  console.log('薪资计算器已卸载');
}

// ============================================================
// 计算函数
// ============================================================

/**
 * 计算五险一金
 */
function calculateInsurance(salary, city, housingRate) {
  const config = CITY_CONFIG[city];
  
  // 社保基数：工资在上下限之间取工资，否则取边界值
  let socialBase = salary;
  if (salary > config.maxSocialBase) {
    socialBase = config.maxSocialBase;
  } else if (salary < config.minSocialBase) {
    socialBase = config.minSocialBase;
  }
  
  // 公积金基数
  let housingBase = salary;
  if (salary > config.maxHousingBase) {
    housingBase = config.maxHousingBase;
  } else if (salary < config.minHousingBase) {
    housingBase = config.minHousingBase;
  }
  
  // 计算各项保险
  const pension = socialBase * config.pensionRate / 100;
  const medical = socialBase * config.medicalRate / 100;
  const unemployment = socialBase * config.unemploymentRate / 100;
  const housingFund = housingBase * housingRate / 100;
  
  const total = pension + medical + unemployment + housingFund;
  
  return {
    pension: Math.round(pension),
    medical: Math.round(medical),
    unemployment: Math.round(unemployment),
    housingFund: Math.round(housingFund),
    total: Math.round(total),
  };
}

/**
 * 计算月度个税
 */
function calculateMonthlyTax(taxableIncome) {
  if (taxableIncome <= 0) return 0;
  
  // 查找适用税率
  let tax = 0;
  for (let i = 0; i < ANNUAL_TAX_BRACKETS.length; i++) {
    const bracket = ANNUAL_TAX_BRACKETS[i];
    if (taxableIncome * 12 <= bracket.limit) {
      tax = taxableIncome * bracket.rate - bracket.deduction / 12;
      break;
    }
  }
  
  return Math.max(0, Math.round(tax));
}

/**
 * 计算年终奖个税（单独计税）
 */
function calculateBonusTax(bonus) {
  if (bonus <= 0) return 0;
  
  // 年终奖除以12找税率
  const monthlyBonus = bonus / 12;
  
  // 查找适用税率
  let rate = 0.03;
  let deduction = 0;
  for (let i = 0; i < BONUS_TAX_BRACKETS.length; i++) {
    const bracket = BONUS_TAX_BRACKETS[i];
    if (monthlyBonus <= bracket.limit / 12) {
      rate = bracket.rate;
      deduction = bracket.deduction;
      break;
    }
  }
  
  return Math.round(bonus * rate - deduction);
}

/**
 * 执行完整计算
 */
function doCalculate() {
  const state = _customState;
  const salary = parseFloat(state.monthlySalary) || 0;
  const bonusMonths = parseFloat(state.annualBonus) || 0;
  const specialDeduction = parseFloat(state.specialDeduction) || 0;
  
  if (salary <= 0) {
    return null;
  }
  
  // 计算五险一金
  const insurance = calculateInsurance(salary, state.city, state.housingRate);
  
  // 计算应纳税所得额（月度）
  const taxableIncome = salary - insurance.total - TAX_THRESHOLD - specialDeduction;
  
  // 计算月度个税
  const monthlyTax = calculateMonthlyTax(taxableIncome);
  
  // 月度实发工资
  const monthlyNet = salary - insurance.total - monthlyTax;
  
  // 年终奖计算
  const bonusGross = salary * bonusMonths;
  const bonusTax = calculateBonusTax(bonusGross);
  const bonusNet = bonusGross - bonusTax;
  
  // 年度汇总
  const annualGross = salary * 12 + bonusGross;
  const annualInsurance = insurance.total * 12;
  const annualTax = monthlyTax * 12 + bonusTax;
  const annualNet = monthlyNet * 12 + bonusNet;
  
  // 收入结构
  const salaryRatio = annualGross > 0 ? Math.round((salary * 12 / annualGross) * 100) : 0;
  const bonusRatio = annualGross > 0 ? Math.round((bonusGross / annualGross) * 100) : 0;
  
  return {
    monthly: {
      gross: salary,
      insurance: insurance.total,
      insuranceDetail: insurance,
      tax: monthlyTax,
      net: monthlyNet,
    },
    annual: {
      gross: annualGross,
      insurance: annualInsurance,
      tax: annualTax,
      net: annualNet,
    },
    bonus: {
      gross: bonusGross,
      tax: bonusTax,
      net: bonusNet,
    },
    structure: {
      salaryRatio: salaryRatio,
      bonusRatio: bonusRatio,
    },
  };
}

// ============================================================
// 事件处理函数
// ============================================================

function handleInputChange(field, value) {
  _customState[field] = value;
}

function handleCityChange(city) {
  this.setCustomState({ city: city });
}

function handleHousingRateChange(rate) {
  this.setCustomState({ housingRate: rate });
}

function handleCalculate() {
  const result = doCalculate();
  this.setCustomState({ result: result });
}

function handleReset() {
  this.setCustomState({
    monthlySalary: '',
    city: 'shanghai',
    annualBonus: '',
    socialBase: '',
    housingBase: '',
    housingRate: 7,
    specialDeduction: '',
    result: null,
    activeTab: 'monthly',
  });
  
  // 清空输入框
  const inputs = ['salary-input', 'bonus-input', 'special-input'];
  inputs.forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function handleTabChange(tab) {
  this.setCustomState({ activeTab: tab });
}

// ============================================================
// 工具函数
// ============================================================

function formatMoney(amount) {
  if (amount === undefined || amount === null) return '¥0.00';
  return '¥' + amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatMoneyInt(amount) {
  if (amount === undefined || amount === null) return '¥0';
  return '¥' + Math.round(amount).toLocaleString('zh-CN');
}

// ============================================================
// 渲染函数
// ============================================================

export function renderJsx() {
  const self = this;
  const state = _customState;
  const { timestamp } = this.state;
  
  const city = state.city;
  const housingRate = state.housingRate;
  const result = state.result;
  const activeTab = state.activeTab;
  
  // 样式定义
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    card: {
      maxWidth: '900px',
      margin: '0 auto',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      overflow: 'hidden',
    },
    header: {
      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
      color: '#ffffff',
      padding: '30px',
      textAlign: 'center',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '14px',
      opacity: 0.9,
      margin: 0,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      padding: '30px',
    },
    inputSection: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '24px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px',
    },
    required: {
      color: '#ef4444',
      marginLeft: '4px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '15px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    cityGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
    },
    cityButton: {
      padding: '10px',
      fontSize: '14px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      background: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    cityButtonActive: {
      borderColor: '#4f46e5',
      background: '#eef2ff',
      color: '#4f46e5',
      fontWeight: '600',
    },
    rateGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '8px',
    },
    rateButton: {
      padding: '8px',
      fontSize: '13px',
      border: '2px solid #e5e7eb',
      borderRadius: '6px',
      background: '#ffffff',
      cursor: 'pointer',
    },
    rateButtonActive: {
      borderColor: '#4f46e5',
      background: '#eef2ff',
      color: '#4f46e5',
      fontWeight: '600',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    primaryButton: {
      flex: '1',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    secondaryButton: {
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#64748b',
      background: '#f1f5f9',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
    },
    resultSection: {
      background: '#ffffff',
      borderRadius: '12px',
      minHeight: '400px',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      color: '#94a3b8',
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '16px',
    },
    emptyText: {
      fontSize: '15px',
      textAlign: 'center',
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '12px',
    },
    tab: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#64748b',
      background: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    tabActive: {
      color: '#4f46e5',
      background: '#eef2ff',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      marginBottom: '20px',
    },
    metricCard: {
      background: '#f8fafc',
      borderRadius: '10px',
      padding: '16px',
      textAlign: 'center',
    },
    metricLabel: {
      fontSize: '13px',
      color: '#64748b',
      margin: '0 0 6px 0',
    },
    metricValue: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      fontFamily: '"SF Mono", Monaco, monospace',
    },
    metricValuePositive: {
      color: '#10b981',
    },
    metricValueNegative: {
      color: '#ef4444',
    },
    detailCard: {
      background: '#f8fafc',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '16px',
    },
    detailTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      margin: '0 0 16px 0',
      paddingBottom: '12px',
      borderBottom: '1px solid #e5e7eb',
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #f3f4f6',
    },
    detailRowLast: {
      borderBottom: 'none',
    },
    detailLabel: {
      fontSize: '14px',
      color: '#6b7280',
    },
    detailValue: {
      fontSize: '15px',
      fontWeight: '500',
      color: '#111827',
      fontFamily: '"SF Mono", Monaco, monospace',
    },
    chartContainer: {
      marginTop: '20px',
    },
    chartTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      margin: '0 0 16px 0',
    },
    barChart: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    barItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    barLabel: {
      width: '80px',
      fontSize: '13px',
      color: '#6b7280',
    },
    barTrack: {
      flex: '1',
      height: '24px',
      background: '#e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      borderRadius: '12px',
      transition: 'width 0.5s ease',
    },
    barValue: {
      width: '100px',
      fontSize: '13px',
      fontWeight: '500',
      color: '#374151',
      textAlign: 'right',
      fontFamily: '"SF Mono", Monaco, monospace',
    },
    tipBox: {
      background: '#ecfdf5',
      border: '1px solid #a7f3d0',
      borderRadius: '8px',
      padding: '12px 16px',
      marginTop: '20px',
    },
    tipText: {
      fontSize: '13px',
      color: '#065f46',
      margin: 0,
    },
  };
  
  // 城市选项
  const cities = [
    { key: 'shanghai', name: '上海' },
    { key: 'beijing', name: '北京' },
    { key: 'shenzhen', name: '深圳' },
    { key: 'hangzhou', name: '杭州' },
    { key: 'guangzhou', name: '广州' },
    { key: 'chengdu', name: '成都' },
  ];
  
  // 公积金比例选项
  const rates = [5, 6, 7, 8, 12];
  
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>💰 个人薪资计算器</h1>
          <p style={styles.subtitle}>精准估算您的收入结构，智能计算五险一金与个税</p>
        </div>
        
        {/* Content */}
        <div style={styles.content}>
          {/* Input Section */}
          <div style={styles.inputSection}>
            <h2 style={styles.sectionTitle}>
              <span>📝</span> 收入信息
            </h2>
            
            {/* 月薪 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                税前月薪<span style={styles.required}>*</span>
              </label>
              <input
                id="salary-input"
                type="number"
                placeholder="例如：20000"
                defaultValue={state.monthlySalary}
                onChange={function(e) { handleInputChange.call(self, 'monthlySalary', e.target.value); }}
                style={styles.input}
              />
            </div>
            
            {/* 城市选择 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>工作城市</label>
              <div style={styles.cityGrid}>
                {cities.map(function(c) {
                  const isActive = city === c.key;
                  const btnStyle = isActive 
                    ? { ...styles.cityButton, ...styles.cityButtonActive }
                    : styles.cityButton;
                  return (
                    <button
                      key={c.key}
                      onClick={function() { handleCityChange.call(self, c.key); }}
                      style={btnStyle}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* 年终奖 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>年终奖（月）</label>
              <input
                id="bonus-input"
                type="number"
                placeholder="例如：2（表示2个月）"
                defaultValue={state.annualBonus}
                onChange={function(e) { handleInputChange.call(self, 'annualBonus', e.target.value); }}
                style={styles.input}
              />
            </div>
            
            {/* 公积金比例 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>公积金缴纳比例</label>
              <div style={styles.rateGrid}>
                {rates.map(function(r) {
                  const isActive = housingRate === r;
                  const btnStyle = isActive
                    ? { ...styles.rateButton, ...styles.rateButtonActive }
                    : styles.rateButton;
                  return (
                    <button
                      key={r}
                      onClick={function() { handleHousingRateChange.call(self, r); }}
                      style={btnStyle}
                    >
                      {r}%
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* 专项附加扣除 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>月度专项附加扣除</label>
              <input
                id="special-input"
                type="number"
                placeholder="例如：2000（子女教育、房贷等）"
                defaultValue={state.specialDeduction}
                onChange={function(e) { handleInputChange.call(self, 'specialDeduction', e.target.value); }}
                style={styles.input}
              />
            </div>
            
            {/* 按钮组 */}
            <div style={styles.buttonGroup}>
              <button
                onClick={function() { handleCalculate.call(self); }}
                style={styles.primaryButton}
              >
                🚀 开始计算
              </button>
              <button
                onClick={function() { handleReset.call(self); }}
                style={styles.secondaryButton}
              >
                重置
              </button>
            </div>
          </div>
          
          {/* Result Section */}
          <div style={styles.resultSection}>
            {!result ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📊</div>
                <p style={styles.emptyText}>填写左侧信息后点击计算，查看您的薪资详情</p>
              </div>
            ) : (
              <div>
                {/* Tabs */}
                <div style={styles.tabs}>
                  <button
                    onClick={function() { handleTabChange.call(self, 'monthly'); }}
                    style={activeTab === 'monthly' ? { ...styles.tab, ...styles.tabActive } : styles.tab}
                  >
                    📅 月度明细
                  </button>
                  <button
                    onClick={function() { handleTabChange.call(self, 'annual'); }}
                    style={activeTab === 'annual' ? { ...styles.tab, ...styles.tabActive } : styles.tab}
                  >
                    📈 年度汇总
                  </button>
                </div>
                
                {activeTab === 'monthly' ? (
                  <div>
                    {/* 月度核心指标 */}
                    <div style={styles.metricsGrid}>
                      <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>税前月薪</p>
                        <p style={styles.metricValue}>{formatMoney(result.monthly.gross)}</p>
                      </div>
                      <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>实发工资</p>
                        <p style={{ ...styles.metricValue, color: '#10b981' }}>{formatMoney(result.monthly.net)}</p>
                      </div>
                      <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>五险一金</p>
                        <p style={{ ...styles.metricValue, ...styles.metricValueNegative }}>-{formatMoney(result.monthly.insurance)}</p>
                      </div>
                      <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>个人所得税</p>
                        <p style={{ ...styles.metricValue, ...styles.metricValueNegative }}>-{formatMoney(result.monthly.tax)}</p>
                      </div>
                    </div>
                    
                    {/* 五险一金明细 */}
                    <div style={styles.detailCard}>
                      <h3 style={styles.detailTitle}>🏥 五险一金明细</h3>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>养老保险（{CITY_CONFIG[city].pensionRate}%）</span>
                        <span style={styles.detailValue}>{formatMoney(result.monthly.insuranceDetail.pension)}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>医疗保险（{CITY_CONFIG[city].medicalRate}%）</span>
                        <span style={styles.detailValue}>{formatMoney(result.monthly.insuranceDetail.medical)}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>失业保险（{CITY_CONFIG[city].unemploymentRate}%）</span>
                        <span style={styles.detailValue}>{formatMoney(result.monthly.insuranceDetail.unemployment)}</span>
                      </div>
                      <div style={{ ...styles.detailRow, ...styles.detailRowLast }}>
                        <span style={styles.detailLabel}>住房公积金（{housingRate}%）</span>
                        <span style={styles.detailValue}>{formatMoney(result.monthly.insuranceDetail.housingFund)}</span>
                      </div>
                    </div>
                    
                    {/* 到手工资构成 */}
                    <div style={styles.chartContainer}>
                      <h4 style={styles.chartTitle}>💵 到手工资构成</h4>
                      <div style={styles.barChart}>
                        <div style={styles.barItem}>
                          <span style={styles.barLabel}>到手工资</span>
                          <div style={styles.barTrack}>
                            <div style={{
                              ...styles.barFill,
                              width: (result.monthly.net / result.monthly.gross * 100) + '%',
                              background: '#10b981',
                            }}></div>
                          </div>
                          <span style={styles.barValue}>{(result.monthly.net / result.monthly.gross * 100).toFixed(1)}%</span>
                        </div>
                        <div style={styles.barItem}>
                          <span style={styles.barLabel}>五险一金</span>
                          <div style={styles.barTrack}>
                            <div style={{
                              ...styles.barFill,
                              width: (result.monthly.insurance / result.monthly.gross * 100) + '%',
                              background: '#f59e0b',
                            }}></div>
                          </div>
                          <span style={styles.barValue}>{(result.monthly.insurance / result.monthly.gross * 100).toFixed(1)}%</span>
                        </div>
                        <div style={styles.barItem}>
                          <span style={styles.barLabel}>个人所得税</span>
                          <div style={styles.barTrack}>
                            <div style={{
                              ...styles.barFill,
                              width: (result.monthly.tax / result.monthly.gross * 100) + '%',
                              background: '#ef4444',
                            }}></div>
                          </div>
                          <span style={styles.barValue}>{(result.monthly.tax / result.monthly.gross * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* 年度核心指标 */}
                    <div style={styles.metricsGrid}>
                      <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>年度总收入</p>
                        <p style={styles.metricValue}>{formatMoney(result.annual.gross)}</p>
                      </div>
                      <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>年度净收入</p>
                        <p style={{ ...styles.metricValue, color: '#10b981' }}>{formatMoney(result.annual.net)}</p>
                      </div>
                      <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>年度缴税总额</p>
                        <p style={{ ...styles.metricValue, ...styles.metricValueNegative }}>{formatMoney(result.annual.tax)}</p>
                      </div>
                      <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>平均月收入</p>
                        <p style={styles.metricValue}>{formatMoney(result.annual.net / 12)}</p>
                      </div>
                    </div>
                    
                    {/* 年终奖明细 */}
                    {result.bonus.gross > 0 && (
                      <div style={styles.detailCard}>
                        <h3 style={styles.detailTitle}>🎁 年终奖明细</h3>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>税前年终奖</span>
                          <span style={styles.detailValue}>{formatMoney(result.bonus.gross)}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>年终奖个税</span>
                          <span style={{ ...styles.detailValue, color: '#ef4444' }}>-{formatMoney(result.bonus.tax)}</span>
                        </div>
                        <div style={{ ...styles.detailRow, ...styles.detailRowLast }}>
                          <span style={styles.detailLabel}>税后年终奖</span>
                          <span style={{ ...styles.detailValue, color: '#10b981' }}>{formatMoney(result.bonus.net)}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* 年度收支瀑布图 */}
                    <div style={styles.chartContainer}>
                      <h4 style={styles.chartTitle}>💧 年度收支流向</h4>
                      <div style={styles.barChart}>
                        <div style={styles.barItem}>
                          <span style={styles.barLabel}>税前年薪</span>
                          <div style={styles.barTrack}>
                            <div style={{
                              ...styles.barFill,
                              width: '100%',
                              background: '#3b82f6',
                            }}></div>
                          </div>
                          <span style={styles.barValue}>{formatMoneyInt(result.annual.gross)}</span>
                        </div>
                        <div style={styles.barItem}>
                          <span style={styles.barLabel}>五险一金</span>
                          <div style={styles.barTrack}>
                            <div style={{
                              ...styles.barFill,
                              width: (result.annual.insurance / result.annual.gross * 100) + '%',
                              background: '#f59e0b',
                            }}></div>
                          </div>
                          <span style={styles.barValue}>-{formatMoneyInt(result.annual.insurance)}</span>
                        </div>
                        <div style={styles.barItem}>
                          <span style={styles.barLabel}>个人所得税</span>
                          <div style={styles.barTrack}>
                            <div style={{
                              ...styles.barFill,
                              width: (result.annual.tax / result.annual.gross * 100) + '%',
                              background: '#ef4444',
                            }}></div>
                          </div>
                          <span style={styles.barValue}>-{formatMoneyInt(result.annual.tax)}</span>
                        </div>
                        <div style={styles.barItem}>
                          <span style={styles.barLabel}>实际到手</span>
                          <div style={styles.barTrack}>
                            <div style={{
                              ...styles.barFill,
                              width: (result.annual.net / result.annual.gross * 100) + '%',
                              background: '#10b981',
                            }}></div>
                          </div>
                          <span style={styles.barValue}>{formatMoneyInt(result.annual.net)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 提示 */}
                <div style={styles.tipBox}>
                  <p style={styles.tipText}>
                    💡 提示：以上计算结果仅供参考，实际金额以工资条为准。公积金可用于租房提取或购房贷款。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden timestamp for forceUpdate */}
      <div style={{ display: 'none' }}>{timestamp}</div>
    </div>
  );
}
