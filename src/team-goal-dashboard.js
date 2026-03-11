// ============================================================
// 常量配置
// ============================================================

const APP_TYPE = 'APP_ENDO483NCM85G2ILCS0T';
const CORP_ID = 'ding8196cd9a2b2405da24f2f5cc6abecb85';
const BASE_URL = 'https://ding.aliwork.com';

const FORM = {
  teamInfo: 'FORM-7DB75FA20DB3442AAB4A5AF3BBCAF36CQ7XD',
  monthGoal: 'FORM-E04B2F57F50E45B4BB991480F7CA6427OIM9',
  weekGoal: 'FORM-BE8A5DC7D20B4AD6BA196A87A4C8683EU2QF',
  personGoal: 'FORM-70237549369D463094A692C487A1DCCESN7V',
};

// 小组信息表字段
const TEAM_INFO_FIELDS = {
  teamName: 'textField_0yye9b7l',
  teamNo: 'serialNumberField_0yye5ki8',
  members: 'employeeField_0yyeez6b',
  leader: 'employeeField_0yyfb6us',
};

// 小组月目标表字段
const MONTH_GOAL_FIELDS = {
  month: 'dateField_4uybwmg1',
  team: 'associationFormField_4uybyzng',
  goalTable: 'tableField_4uyb4tgw',
  goalContent: 'textareaField_4uyb12bm',
  teamNo: 'textField_4uybfn4t',
  monthGoalNo: 'serialNumberField_4uybf6ti',
};

// 小组周目标表字段
const WEEK_GOAL_FIELDS = {
  relatedMonth: 'associationFormField_8k1u8rbz',
  monthGoalNo: 'textField_8k1ugpoy',
  team: 'associationFormField_8k1uenhf',
  timePeriod: 'cascadeDateField_8k1u6sag',
  week: 'radioField_8k1uxqh0',
  goalBreakdownTable: 'tableField_8k1vx00m',
  goalTarget: 'textField_8k1vsizb',
  goalMetric: 'textareaField_8k1vbbqy',
  goalProgress: 'textareaField_8k1v36iu',
  taskTable: 'tableField_8k1vgp1h',
  taskType: 'textField_8k1vbbs9',
  taskDesc: 'textareaField_8k1vlh42',
  taskProgress: 'textField_8k1v6zcr',
  taskOwner: 'employeeField_8k1vigy3',
  taskDeadline: 'dateField_8k1vxazn',
  teamNo: 'textField_8k1vysjd',
  weekGoalNo: 'serialNumberField_8k1vmul8',
};

// 个人周目标表字段
const PERSON_GOAL_FIELDS = {
  relatedWeek: 'associationFormField_agno59jn',
  weekGoalNo: 'textField_agnocra8',
  monthGoalNo: 'textField_agnozzo4',
  team: 'associationFormField_agno9qdx',
  timePeriod: 'cascadeDateField_agno9ag6',
  employee: 'employeeField_agnovv1u',
  score: 'textField_agnok92o',
  goal1Table: 'tableField_agnolcql',
  goal1Task: 'textareaField_agnotytj',
  goal1Progress: 'textareaField_agno5xgz',
  goal1Time: 'numberField_agno404b',
  goal1Comment: 'textareaField_agnosdh5',
  goal2Table: 'tableField_agnoxoqu',
  goal2Task: 'textareaField_agnoogq0',
  goal2Progress: 'textareaField_agno6f1x',
  goal2Time: 'numberField_agnoa20q',
  goal2Comment: 'textareaField_agnops3l',
  goal3Table: 'tableField_agnos75r',
  goal3Task: 'textareaField_agnoiazb',
  goal3Progress: 'textareaField_agnour9m',
  goal3Time: 'numberField_agnocl39',
  goal3Comment: 'textareaField_agno8aq3',
  goal4Table: 'tableField_agno5dvv',
  goal4Task: 'textareaField_agnovfpc',
  goal4Progress: 'textareaField_agno4g70',
  goal4Time: 'numberField_agnoktpf',
  goal4Comment: 'textareaField_agno7tnn',
  goal5Table: 'tableField_agno6rtl',
  goal5Task: 'textareaField_agno19sy',
  goal5Progress: 'textareaField_agno6exo',
  goal5Time: 'numberField_agnp5ge3',
  goal5Comment: 'textareaField_agnp7hz0',
  teamNo: 'textField_agnp8dww',
  personGoalNo: 'serialNumberField_agnp7fox',
};

// 目标维度配置（5个目标子表）
const GOAL_DIMENSIONS = [
  {
    tableField: PERSON_GOAL_FIELDS.goal1Table,
    taskField: PERSON_GOAL_FIELDS.goal1Task,
    progressField: PERSON_GOAL_FIELDS.goal1Progress,
    timeField: PERSON_GOAL_FIELDS.goal1Time,
    commentField: PERSON_GOAL_FIELDS.goal1Comment,
  },
  {
    tableField: PERSON_GOAL_FIELDS.goal2Table,
    taskField: PERSON_GOAL_FIELDS.goal2Task,
    progressField: PERSON_GOAL_FIELDS.goal2Progress,
    timeField: PERSON_GOAL_FIELDS.goal2Time,
    commentField: PERSON_GOAL_FIELDS.goal2Comment,
  },
  {
    tableField: PERSON_GOAL_FIELDS.goal3Table,
    taskField: PERSON_GOAL_FIELDS.goal3Task,
    progressField: PERSON_GOAL_FIELDS.goal3Progress,
    timeField: PERSON_GOAL_FIELDS.goal3Time,
    commentField: PERSON_GOAL_FIELDS.goal3Comment,
  },
  {
    tableField: PERSON_GOAL_FIELDS.goal4Table,
    taskField: PERSON_GOAL_FIELDS.goal4Task,
    progressField: PERSON_GOAL_FIELDS.goal4Progress,
    timeField: PERSON_GOAL_FIELDS.goal4Time,
    commentField: PERSON_GOAL_FIELDS.goal4Comment,
  },
  {
    tableField: PERSON_GOAL_FIELDS.goal5Table,
    taskField: PERSON_GOAL_FIELDS.goal5Task,
    progressField: PERSON_GOAL_FIELDS.goal5Progress,
    timeField: PERSON_GOAL_FIELDS.goal5Time,
    commentField: PERSON_GOAL_FIELDS.goal5Comment,
  },
];

// ============================================================
// 状态管理
// ============================================================

const _customState = {
  // 筛选状态
  myTeamList: [],
  selectedTeam: null,
  selectedTime: new Date().getTime(),

  // 数据状态
  teamMonthGoals: { formInstId: '', content: [] },
  teamWeeklyGoals: {
    formInstId: '',
    content: [],
    goalList: [],
    taskList: [],
  },
  personWeeklyGoals: { currentPage: 1, data: [], totalCount: 0 },
  myWeeklyGoal: null,

  // 加载状态
  getPersonWeeklyGoalsLoading: true,
  teamMonthGoalsLoading: true,
  teamWeeklyGoalsLoading: true,

  // 抽屉状态
  drawerVisible: false,
  drawerUrl: '',
  drawerClickType: '',

  // 评语弹窗状态
  commentDialogVisible: false,
  selectedGoal: null,
  commentText: '',

  // AI 总结弹窗状态
  aiSummaryVisible: false,
  aiSummaryText: '',
  aiSummaryName: '',
  aiSummaryLoading: false,

  // 周时间轴
  weekRange: { start: '', end: '' },
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
// 工具函数
// ============================================================

function getMonthStartAndEndTimestamps(time) {
  var date = new Date(time);
  var start = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  var end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
  return [start, end];
}

function formatDate(timestamp, format) {
  if (!timestamp) return '-';
  var date = new Date(Number(timestamp));
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');
  if (format === 'YYYY-MM') return year + '-' + month;
  return year + '-' + month + '-' + day;
}

function fetchAllPages(self, formUuid, searchFieldJson, page, accumulated) {
  return self.utils.yida.searchFormDatas({
    formUuid: formUuid,
    appType: APP_TYPE,
    searchFieldJson: JSON.stringify(searchFieldJson),
    currentPage: page,
    pageSize: 100,
  }).then(function(res) {
    var pageData = res.data || [];
    var merged = accumulated.concat(pageData);
    if (pageData.length === 100) {
      return fetchAllPages(self, formUuid, searchFieldJson, page + 1, merged);
    }
    return merged;
  });
}

// ============================================================
// 生命周期
// ============================================================

export function didMount() {
  var self = this;
  // 从 URL 参数读取日期
  var urlParams = this.state.urlParams || {};
  var dateParam = urlParams.date;
  if (dateParam) {
    _customState.selectedTime = new Date(dateParam).getTime();
  }
  self.setWeekTimeLine();
  self.getMyTeamList();
}

export function didUnmount() {
}

// ============================================================
// 数据获取方法
// ============================================================

export function setWeekTimeLine() {
  var weekRange = this.utils.getDateTimeRange(
    _customState.selectedTime,
    'week'
  );
  var startStr = formatDate(weekRange[0], 'YYYY-MM-DD');
  var endStr = formatDate(weekRange[1], 'YYYY-MM-DD');
  _customState.weekRange = { start: startStr, end: endStr };
}

export function getMyTeamList() {
  var self = this;
  self.utils.yida.searchFormDatas({
    formUuid: FORM.teamInfo,
    appType: APP_TYPE,
    searchFieldJson: JSON.stringify({
      [TEAM_INFO_FIELDS.members]: [window.loginUser.userId],
    }),
    currentPage: 1,
    pageSize: 100,
  }).then(function(res) {
    var data = res.data || [];
    if (data.length === 0) {
      self.utils.toast({ title: '未获取到我的小组', type: 'error' });
      self.setCustomState({ getPersonWeeklyGoalsLoading: false });
      return;
    }
    var myTeamList = data.map(function(item) {
      return {
        text: item.formData[TEAM_INFO_FIELDS.teamName],
        value: item.formData[TEAM_INFO_FIELDS.teamNo],
        customValue: item.formData,
      };
    });
    var selectedTeam = myTeamList[0];
    self.setCustomState({ myTeamList: myTeamList, selectedTeam: selectedTeam });
    self.getTeamMonthGoals();
    self.getTeamWeeklyGoals();
    self.getPersonWeeklyGoals();
    self.getMyWeeklyGoals();
  }).catch(function(err) {
    self.utils.toast({ title: err.message || '获取小组列表失败', type: 'error' });
    self.setCustomState({ getPersonWeeklyGoalsLoading: false });
  });
}

export function getTeamMonthGoals() {
  var self = this;
  var selectedTeam = _customState.selectedTeam;
  if (!selectedTeam) return;
  var monthRange = self.utils.getDateTimeRange(_customState.selectedTime, 'month');
  self.setCustomState({ teamMonthGoalsLoading: true });
  self.utils.yida.searchFormDatas({
    formUuid: FORM.monthGoal,
    appType: APP_TYPE,
    searchFieldJson: JSON.stringify({
      [MONTH_GOAL_FIELDS.teamNo]: selectedTeam.value,
      [MONTH_GOAL_FIELDS.month]: monthRange,
    }),
    currentPage: 1,
    pageSize: 10,
  }).then(function(res) {
    var data = res.data || [];
    var teamMonthGoals = { formInstId: '', content: [] };
    if (data.length > 0) {
      teamMonthGoals.formInstId = data[0].formInstId;
      teamMonthGoals.content = data[0].formData[MONTH_GOAL_FIELDS.goalTable] || [];
    }
    self.setCustomState({ teamMonthGoals: teamMonthGoals, teamMonthGoalsLoading: false });
  }).catch(function(err) {
    self.utils.toast({ title: err.message || '获取月目标失败', type: 'error' });
    self.setCustomState({ teamMonthGoalsLoading: false });
  });
}

export function getTeamWeeklyGoals() {
  var self = this;
  var selectedTeam = _customState.selectedTeam;
  if (!selectedTeam) return;
  var monthRange = self.utils.getDateTimeRange(_customState.selectedTime, 'month');
  var weekRange = self.utils.getDateTimeRange(_customState.selectedTime, 'week');
  self.setCustomState({ teamWeeklyGoalsLoading: true });
  fetchAllPages(self, FORM.weekGoal, {
    [WEEK_GOAL_FIELDS.teamNo]: selectedTeam.value,
  }, 1, []).then(function(allData) {
    // 客户端过滤：只取当月数据，并按周次（RadioField 文本）升序排列
    var monthData = allData.filter(function(item) {
      var timePeriod = item.formData[WEEK_GOAL_FIELDS.timePeriod];
      if (!timePeriod || !timePeriod[0]) return false;
      var startTs = Number(timePeriod[0]);
      return startTs >= monthRange[0] && startTs <= monthRange[1];
    });
    monthData.sort(function(a, b) {
      var weekA = a.formData[WEEK_GOAL_FIELDS.week] || '';
      var weekB = b.formData[WEEK_GOAL_FIELDS.week] || '';
      return weekA.localeCompare(weekB);
    });
    // 找当周数据
    var currentWeekData = monthData.filter(function(item) {
      var timePeriod = item.formData[WEEK_GOAL_FIELDS.timePeriod];
      if (!timePeriod || !timePeriod[0]) return false;
      var startTs = Number(timePeriod[0]);
      return startTs >= weekRange[0] && startTs <= weekRange[1];
    });
    var content = monthData.map(function(item) {
      return item.formData[WEEK_GOAL_FIELDS.week] || '';
    });
    var goalList = monthData.map(function(item) {
      return item.formData[WEEK_GOAL_FIELDS.goalBreakdownTable] || [];
    });
    var taskList = [];
    var formInstId = '';
    if (currentWeekData.length > 0) {
      taskList = currentWeekData[0].formData[WEEK_GOAL_FIELDS.taskTable] || [];
      formInstId = currentWeekData[0].formInstId;
    }
    self.setCustomState({
      teamWeeklyGoals: { formInstId: formInstId, content: content, goalList: goalList, taskList: taskList },
      teamWeeklyGoalsLoading: false,
    });
  }).catch(function(err) {
    self.utils.toast({ title: err.message || '获取周目标失败', type: 'error' });
    self.setCustomState({ teamWeeklyGoalsLoading: false });
  });
}

export function getPersonWeeklyScore() {
  var self = this;
  var selectedTeam = _customState.selectedTeam;
  if (!selectedTeam) return Promise.resolve({});
  var monthRange = self.utils.getDateTimeRange(_customState.selectedTime, 'month');
  return fetchAllPages(self, FORM.personGoal, {
    [PERSON_GOAL_FIELDS.teamNo]: selectedTeam.value,
  }, 1, []).then(function(allData) {
    // 客户端过滤当月数据
    var monthData = allData.filter(function(item) {
      var timePeriod = item.formData[PERSON_GOAL_FIELDS.timePeriod];
      if (!timePeriod || !timePeriod[0]) return false;
      var startTs = Number(timePeriod[0]);
      return startTs >= monthRange[0] && startTs <= monthRange[1];
    });
    // 按时间升序排列后聚合评分
    monthData.sort(function(a, b) {
      var aTs = Number((a.formData[PERSON_GOAL_FIELDS.timePeriod] || [])[0] || 0);
      var bTs = Number((b.formData[PERSON_GOAL_FIELDS.timePeriod] || [])[0] || 0);
      return aTs - bTs;
    });
    var personMap = {};
    monthData.forEach(function(item) {
      var userIdArr = item.formData[PERSON_GOAL_FIELDS.employee + '_id'];
      if (!userIdArr || !userIdArr[0]) return;
      var userId = userIdArr[0];
      if (!personMap[userId]) personMap[userId] = [];
      var scoreVal = item.formData[PERSON_GOAL_FIELDS.score];
      if (scoreVal) personMap[userId].push(scoreVal);
    });
    return personMap;
  });
}

export function getPersonWeeklyGoals() {
  var self = this;
  var selectedTeam = _customState.selectedTeam;
  if (!selectedTeam) return;
  self.setCustomState({ getPersonWeeklyGoalsLoading: true });
  var weekRange = self.utils.getDateTimeRange(_customState.selectedTime, 'week');
  var currentPage = _customState.personWeeklyGoals.currentPage || 1;
  self.getPersonWeeklyScore().then(function(personMap) {
    return fetchAllPages(self, FORM.personGoal, {
      [PERSON_GOAL_FIELDS.teamNo]: selectedTeam.value,
    }, 1, []).then(function(allData) {
      // 客户端过滤当周数据
      var weekData = allData.filter(function(item) {
        var timePeriod = item.formData[PERSON_GOAL_FIELDS.timePeriod];
        if (!timePeriod || !timePeriod[0]) return false;
        var startTs = Number(timePeriod[0]);
        return startTs >= weekRange[0] && startTs <= weekRange[1];
      });
      // 按员工姓名排序
      weekData.sort(function(a, b) {
        var nameA = (a.formData[PERSON_GOAL_FIELDS.employee] || [''])[0];
        var nameB = (b.formData[PERSON_GOAL_FIELDS.employee] || [''])[0];
        return nameA.localeCompare(nameB);
      });
      var personWeeklyGoals = weekData.map(function(item) {
        var fd = item.formData;
        var userIdArr = fd[PERSON_GOAL_FIELDS.employee + '_id'] || [];
        var userId = userIdArr[0] || '';
        var weeklyGoals = GOAL_DIMENSIONS.map(function(dim) {
          var rows = fd[dim.tableField] || [];
          return rows.map(function(row) {
            return {
              tableField: dim.tableField,
              goalFieldId: dim.taskField,
              commendableFieldId: dim.commentField,
              score: row[dim.taskField] || '',
              progress: row[dim.progressField] || '',
              time: row[dim.timeField] || 0,
              commendable: row[dim.commentField] || '',
            };
          });
        });
        return {
          formInstId: item.formInstId,
          name: (fd[PERSON_GOAL_FIELDS.employee] || [''])[0],
          userId: userId,
          scoreList: personMap[userId] || [],
          weeklyGoals: weeklyGoals,
        };
      });
      self.setCustomState({
        personWeeklyGoals: {
          currentPage: currentPage,
          data: personWeeklyGoals,
          totalCount: weekData.length,
        },
        getPersonWeeklyGoalsLoading: false,
      });
    });
  }).catch(function(err) {
    self.utils.toast({ title: err.message || '获取成员周目标失败', type: 'error' });
    self.setCustomState({ getPersonWeeklyGoalsLoading: false });
  });
}

export function getMyWeeklyGoals() {
  var self = this;
  var selectedTeam = _customState.selectedTeam;
  if (!selectedTeam) return;
  var weekRange = self.utils.getDateTimeRange(_customState.selectedTime, 'week');
  fetchAllPages(self, FORM.personGoal, {
    [PERSON_GOAL_FIELDS.teamNo]: selectedTeam.value,
    [PERSON_GOAL_FIELDS.employee]: [window.loginUser.userId],
  }, 1, []).then(function(allData) {
    var weekData = allData.filter(function(item) {
      var timePeriod = item.formData[PERSON_GOAL_FIELDS.timePeriod];
      if (!timePeriod || !timePeriod[0]) return false;
      var startTs = Number(timePeriod[0]);
      return startTs >= weekRange[0] && startTs <= weekRange[1];
    });
    self.setCustomState({ myWeeklyGoal: weekData.length > 0 ? weekData[0] : null });
  }).catch(function() {
    self.setCustomState({ myWeeklyGoal: null });
  });
}

// ============================================================
// 事件处理
// ============================================================

export function onTeamChange(value) {
  var self = this;
  var myTeamList = _customState.myTeamList;
  var selectedTeam = myTeamList.find(function(t) { return t.value === value; });
  if (!selectedTeam) return;
  self.setCustomState({
    selectedTeam: selectedTeam,
    personWeeklyGoals: { currentPage: 1, data: [], totalCount: 0 },
  });
  self.getTeamMonthGoals();
  self.getTeamWeeklyGoals();
  self.getPersonWeeklyGoals();
  self.getMyWeeklyGoals();
}

export function onDateChange(value) {
  var self = this;
  if (!value) return;
  var ts = typeof value === 'number' ? value : new Date(value).getTime();
  _customState.selectedTime = ts;
  self.setWeekTimeLine();
  // 将日期写入 URL 参数
  var dateStr = formatDate(ts, 'YYYY-MM-DD');
  var newUrl = window.location.pathname + '?date=' + dateStr;
  window.history.replaceState(null, '', newUrl);
  self.setCustomState({
    personWeeklyGoals: { currentPage: 1, data: [], totalCount: 0 },
  });
  self.getTeamMonthGoals();
  self.getTeamWeeklyGoals();
  self.getPersonWeeklyGoals();
  self.getMyWeeklyGoals();
}

export function onGoalClick(clickType, formInstId, formUuid) {
  if (!formInstId) return;
  var url = BASE_URL + '/' + APP_TYPE + '/formDetail/' + formUuid
    + '?formInstId=' + formInstId + '&navConfig.layout=1180';
  window.open(url, '_blank');
}

export function addGoal(clickType) {
  var self = this;
  var selectedTeam = _customState.selectedTeam;
  if (!selectedTeam) return;
  var formUuidMap = {
    teamMonthGoalClick: FORM.monthGoal,
    teamWeeklyGoalClick: FORM.weekGoal,
    personWeeklyGoalClick: FORM.personGoal,
    addTeam: FORM.teamInfo,
  };
  var formUuid = formUuidMap[clickType];
  if (!formUuid) return;
  var dateStr = formatDate(_customState.selectedTime, 'YYYY-MM-DD');
  var iframeUrl = BASE_URL + '/' + APP_TYPE + '/submission/' + formUuid
    + '?teamId=' + selectedTeam.value
    + '&goalTime=' + dateStr
    + '&corpid=' + CORP_ID
    + '&isRenderNav=false';
  self.setCustomState({
    drawerVisible: true,
    drawerUrl: iframeUrl,
    drawerClickType: clickType,
  });
}

export function onDrawerClose() {
  var self = this;
  var clickType = _customState.drawerClickType;
  self.setCustomState({ drawerVisible: false, drawerUrl: '', drawerClickType: '' });
  // 关闭后刷新对应数据
  if (clickType === 'teamMonthGoalClick') {
    self.getTeamMonthGoals();
  } else if (clickType === 'teamWeeklyGoalClick') {
    self.getTeamWeeklyGoals();
  } else if (clickType === 'personWeeklyGoalClick') {
    self.getPersonWeeklyGoals();
    self.getMyWeeklyGoals();
  } else if (clickType === 'addTeam') {
    self.getMyTeamList();
  }
}

export function onGoalItemClick(item, subItem, goalDimIndex) {
  var self = this;
  self.setCustomState({
    commentDialogVisible: true,
    selectedGoal: { item: item, subItem: subItem, goalDimIndex: goalDimIndex },
    commentText: subItem.commendable || '',
  });
}

export function onCommentConfirm() {
  var self = this;
  var selectedGoal = _customState.selectedGoal;
  if (!selectedGoal) return;
  var formInstId = selectedGoal.item.formInstId;
  var subItem = selectedGoal.subItem;
  var commentText = _customState.commentText;
  // 先获取最新数据，防止并发覆盖
  self.utils.yida.getFormDataById({ formInstId: formInstId }).then(function(res) {
    var fd = res.formData || {};
    var dim = GOAL_DIMENSIONS[selectedGoal.goalDimIndex];
    var tableData = (fd[dim.tableField] || []).map(function(row) {
      if (row[dim.taskField] === subItem.score) {
        var updated = Object.assign({}, row);
        updated[dim.commentField] = commentText;
        return updated;
      }
      return row;
    });
    var updateData = {};
    updateData[dim.tableField] = tableData;
    return self.utils.yida.updateFormData({
      formInstId: formInstId,
      updateFormDataJson: JSON.stringify(updateData),
    });
  }).then(function() {
    self.utils.toast({ title: '评语已保存', type: 'success' });
    self.setCustomState({ commentDialogVisible: false, selectedGoal: null, commentText: '' });
    self.getPersonWeeklyGoals();
  }).catch(function(err) {
    self.utils.toast({ title: err.message || '保存失败', type: 'error' });
  });
}

export function onClickPersonName(item) {
  var self = this;
  // 提取所有非空任务事项
  var tasks = [];
  (item.weeklyGoals || []).forEach(function(goalRows, dimIdx) {
    goalRows.forEach(function(row) {
      if (row.score && row.score.trim()) {
        tasks.push('目标' + (dimIdx + 1) + ': ' + row.score.trim());
      }
    });
  });
  if (tasks.length === 0) {
    self.utils.toast({ title: '该人员当周暂无任务记录', type: 'error' });
    return;
  }
  self.setCustomState({ aiSummaryVisible: true, aiSummaryLoading: true, aiSummaryName: item.name, aiSummaryText: '' });
  var tasksText = tasks.join('；');
  self.callAIModelForSummary(item.name, tasksText);
}

export function callAIModelForSummary(personName, tasksText) {
  var self = this;
  var prompt = '请根据以下工作任务，为"' + personName + '"生成一份简洁的本周工作总结（100字以内，突出重点，语言流畅）：\n' + tasksText;
  var formData = new URLSearchParams();
  formData.append('_csrf_token', window.g_config._csrf_token);
  formData.append('prompt', prompt);
  formData.append('maxTokens', '500');
  formData.append('skill', 'ToText');
  fetch('/query/intelligent/txtFromAI.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  }).then(function(res) { return res.json(); }).then(function(result) {
    if (result.success && result.content && result.content.content) {
      self.setCustomState({ aiSummaryText: result.content.content, aiSummaryLoading: false });
    } else {
      self.setCustomState({ aiSummaryText: self.generateLocalSummary(personName, tasksText), aiSummaryLoading: false });
    }
  }).catch(function() {
    self.setCustomState({ aiSummaryText: self.generateLocalSummary(personName, tasksText), aiSummaryLoading: false });
  });
}

export function generateLocalSummary(personName, tasksText) {
  var taskList = tasksText.split('；').filter(function(t) { return t.trim(); });
  var count = taskList.length;
  var preview = taskList.slice(0, 4).map(function(t, i) {
    return (i + 1) + '.' + t.substring(0, 15);
  }).join('、');
  return personName + '本周共完成' + count + '项工作：' + preview + (count > 4 ? '等' : '');
}

export function copyAISummary() {
  var text = _customState.aiSummaryText;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      // 成功
    }).catch(function() {
      var el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
  } else {
    var el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  this.utils.toast({ title: '已复制到剪贴板', type: 'success' });
}

// ============================================================
// 渲染
// ============================================================

export function renderJsx() {
  var self = this;
  var { timestamp } = this.state;
  var state = _customState;

  var styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f5f6fa',
      minHeight: '100vh',
      fontSize: '13px',
      color: '#333',
    },
    // 顶部筛选区
    filterBar: {
      background: '#fff',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      borderBottom: '1px solid #e8e8e8',
      flexWrap: 'wrap',
    },
    filterLabel: { color: '#666', marginRight: '6px', fontSize: '13px' },
    filterSelect: {
      padding: '5px 10px',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
      fontSize: '13px',
      cursor: 'pointer',
      minWidth: '120px',
    },
    filterInput: {
      padding: '5px 10px',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
      fontSize: '13px',
      width: '130px',
    },
    // 状态信息条
    statusBar: {
      background: '#1a3a6b',
      color: '#fff',
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '13px',
    },
    // 主体布局
    mainLayout: {
      display: 'flex',
      gap: '0',
      minHeight: 'calc(100vh - 90px)',
    },
    // 左侧边栏
    sidebar: {
      width: '22%',
      minWidth: '220px',
      background: '#f0f2f5',
      borderRight: '1px solid #e0e0e0',
      padding: '0',
      overflowY: 'auto',
    },
    sidebarSection: {
      borderBottom: '1px solid #e0e0e0',
      padding: '12px 14px',
    },
    sidebarTitle: {
      fontWeight: '600',
      fontSize: '13px',
      color: '#1a3a6b',
      marginBottom: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    // 右侧矩阵
    matrixArea: {
      flex: 1,
      overflowX: 'auto',
      background: '#fff',
    },
    matrixTable: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '800px',
    },
    matrixTh: {
      background: '#1a3a6b',
      color: '#fff',
      padding: '8px 10px',
      textAlign: 'center',
      fontWeight: '600',
      fontSize: '12px',
      border: '1px solid #2a4a8b',
      whiteSpace: 'nowrap',
    },
    matrixTd: {
      border: '1px solid #e8e8e8',
      padding: '6px 8px',
      verticalAlign: 'top',
      fontSize: '12px',
    },
    // 按钮
    btnPrimary: {
      background: '#1a3a6b',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '5px 12px',
      cursor: 'pointer',
      fontSize: '12px',
    },
    btnSmall: {
      background: '#e8f0fe',
      color: '#1a3a6b',
      border: 'none',
      borderRadius: '3px',
      padding: '2px 8px',
      cursor: 'pointer',
      fontSize: '11px',
      marginLeft: '4px',
    },
    // 标签
    tagBlue: {
      display: 'inline-block',
      background: '#1a3a6b',
      color: '#fff',
      borderRadius: '3px',
      padding: '1px 6px',
      fontSize: '11px',
      margin: '1px 2px',
    },
    tagGray: {
      display: 'inline-block',
      background: '#e0e0e0',
      color: '#666',
      borderRadius: '3px',
      padding: '1px 6px',
      fontSize: '11px',
      margin: '1px 2px',
    },
    // 加载占位
    loadingText: { color: '#999', fontSize: '12px', padding: '8px 0' },
    emptyText: { color: '#bbb', fontSize: '12px', padding: '8px 0' },
    // 弹窗遮罩
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.45)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    dialogBox: {
      background: '#fff', borderRadius: '8px', padding: '24px',
      minWidth: '360px', maxWidth: '520px', width: '90%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    },
    dialogTitle: { fontWeight: '600', fontSize: '15px', marginBottom: '16px', color: '#1a3a6b' },
    dialogFooter: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' },
    // 抽屉
    drawerOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.35)', zIndex: 1000,
    },
    drawerPanel: {
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: '60%', minWidth: '480px',
      background: '#fff', boxShadow: '-4px 0 16px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', zIndex: 1001,
    },
    drawerHeader: {
      padding: '14px 20px', borderBottom: '1px solid #e8e8e8',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
  };

  // ---- 顶部筛选区 ----
  var filterBarEl = (
    <div style={styles.filterBar}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={styles.filterLabel}>小组</span>
        <select
          style={styles.filterSelect}
          value={state.selectedTeam ? state.selectedTeam.value : ''}
          onChange={function(e) { self.onTeamChange(e.target.value); }}
        >
          {state.myTeamList.map(function(team) {
            return <option key={team.value} value={team.value}>{team.text}</option>;
          })}
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={styles.filterLabel}>日期</span>
        <input
          type="date"
          style={styles.filterInput}
          defaultValue={formatDate(state.selectedTime, 'YYYY-MM-DD')}
          onChange={function(e) { self.onDateChange(e.target.value); }}
        />
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
        <button style={styles.btnPrimary} onClick={function() { self.addGoal('personWeeklyGoalClick'); }}>
          {state.myWeeklyGoal ? '编辑我的周目标' : '+ 新增我的周目标'}
        </button>
        <button style={styles.btnSmall} onClick={function() { self.addGoal('teamWeeklyGoalClick'); }}>+ 周目标</button>
        <button style={styles.btnSmall} onClick={function() { self.addGoal('teamMonthGoalClick'); }}>+ 月目标</button>
        <button style={styles.btnSmall} onClick={function() { self.addGoal('addTeam'); }}>+ 小组</button>
      </div>
    </div>
  );

  // ---- 状态信息条 ----
  var selectedTeam = state.selectedTeam;
  var leaderName = selectedTeam && selectedTeam.customValue
    ? (selectedTeam.customValue[TEAM_INFO_FIELDS.leader] || [''])[0]
    : '-';
  var weekLabel = '';
  var teamWeeklyGoals = state.teamWeeklyGoals;
  // 找当前周的周次标签
  var weekRange = self.utils.getDateTimeRange(state.selectedTime, 'week');
  var statusBarEl = (
    <div style={styles.statusBar}>
      <span>
        目标数据范围：{state.weekRange.start} ~ {state.weekRange.end}
      </span>
      <span>
        Scrum({selectedTeam ? selectedTeam.text : '-'}) &nbsp;|&nbsp; Scrum Master: {leaderName}
      </span>
    </div>
  );

  // ---- 左侧 C-1 本月目标 ----
  var monthGoalsEl;
  if (state.teamMonthGoalsLoading) {
    monthGoalsEl = <div style={styles.loadingText}>加载中...</div>;
  } else if (!state.teamMonthGoals.content || state.teamMonthGoals.content.length === 0) {
    monthGoalsEl = <div style={styles.emptyText}>暂无本月目标</div>;
  } else {
    monthGoalsEl = state.teamMonthGoals.content.map(function(row, idx) {
      return (
        <div key={idx} style={{ marginBottom: '6px', padding: '6px', background: '#fff', borderRadius: '4px', fontSize: '12px' }}>
          <div style={{ color: '#333', lineHeight: '1.5' }}>{row[MONTH_GOAL_FIELDS.goalContent] || '-'}</div>
        </div>
      );
    });
  }

  // ---- 左侧 C-2 周目标拆解&进展矩阵 ----
  var weekGoalMatrixEl;
  if (state.teamWeeklyGoalsLoading) {
    weekGoalMatrixEl = <div style={styles.loadingText}>加载中...</div>;
  } else {
    var weekContent = teamWeeklyGoals.content || [];
    var goalList = teamWeeklyGoals.goalList || [];
    var colCount = Math.max(weekContent.length, 4);
    var colHeaders = [];
    for (var ci = 0; ci < colCount; ci++) {
      colHeaders.push(weekContent[ci] || ('W' + (ci + 1)));
    }
    // 计算最大目标行数
    var maxGoalRows = 0;
    goalList.forEach(function(weekGoals) {
      if (weekGoals.length > maxGoalRows) maxGoalRows = weekGoals.length;
    });
    if (maxGoalRows === 0 && weekContent.length === 0) {
      weekGoalMatrixEl = <div style={styles.emptyText}>暂无本月目标数据</div>;
    } else {
      var tableRows = [];
      // 表头
      tableRows.push(
        <tr key="header">
          <td style={{ ...styles.matrixTd, background: '#f0f2f5', fontWeight: '600', width: '48px', textAlign: 'center' }}></td>
          {colHeaders.map(function(col, ci) {
            return (
              <td key={ci} style={{ ...styles.matrixTd, background: '#1a3a6b', color: '#fff', textAlign: 'center', fontWeight: '600' }}>
                {col}
              </td>
            );
          })}
        </tr>
      );
      // 目标行
      for (var gi = 0; gi < Math.max(maxGoalRows, 1); gi++) {
        var goalIdx = gi;
        // 分隔行
        if (gi > 0) {
          tableRows.push(
            <tr key={'sep-' + gi}>
              <td colSpan={colCount + 1} style={{ height: '4px', background: '#1a3a6b', padding: 0 }}></td>
            </tr>
          );
        }
        // 目标行
        tableRows.push(
          <tr key={'goal-' + gi}>
            <td style={{ ...styles.matrixTd, background: '#e8f0fe', fontWeight: '600', textAlign: 'center', color: '#1a3a6b', fontSize: '11px' }}>
              目标{gi + 1}
            </td>
            {colHeaders.map(function(col, ci) {
              var weekGoals = goalList[ci] || [];
              var goalRow = weekGoals[goalIdx];
              return (
                <td key={ci} style={{ ...styles.matrixTd, fontSize: '11px' }}>
                  {goalRow ? (goalRow[WEEK_GOAL_FIELDS.goalMetric] || '-') : '-'}
                </td>
              );
            })}
          </tr>
        );
        // 进展行
        tableRows.push(
          <tr key={'progress-' + gi}>
            <td style={{ ...styles.matrixTd, background: '#e8f0fe', textAlign: 'center', color: '#1a3a6b', fontSize: '11px' }}>进展</td>
            {colHeaders.map(function(col, ci) {
              var weekGoals = goalList[ci] || [];
              var goalRow = weekGoals[goalIdx];
              var progressVal = goalRow ? (goalRow[WEEK_GOAL_FIELDS.goalProgress] || '') : '';
              return (
                <td key={ci} style={{ ...styles.matrixTd, fontSize: '11px', color: progressVal ? '#1a3a6b' : '#bbb' }}>
                  {progressVal || '-'}
                </td>
              );
            })}
          </tr>
        );
      }
      weekGoalMatrixEl = (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ ...styles.matrixTable, minWidth: 'unset' }}>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      );
    }
  }

  // ---- 左侧 C-3 本周任务 ----
  var taskListEl;
  if (state.teamWeeklyGoalsLoading) {
    taskListEl = <div style={styles.loadingText}>加载中...</div>;
  } else {
    var taskList = teamWeeklyGoals.taskList || [];
    if (taskList.length === 0) {
      taskListEl = <div style={styles.emptyText}>暂无本周任务</div>;
    } else {
      taskListEl = (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr>
              <th style={{ padding: '4px 6px', background: '#e8f0fe', color: '#1a3a6b', textAlign: 'left', fontWeight: '600' }}>类型</th>
              <th style={{ padding: '4px 6px', background: '#e8f0fe', color: '#1a3a6b', textAlign: 'left', fontWeight: '600' }}>任务描述</th>
              <th style={{ padding: '4px 6px', background: '#e8f0fe', color: '#1a3a6b', textAlign: 'left', fontWeight: '600' }}>进展</th>
              <th style={{ padding: '4px 6px', background: '#e8f0fe', color: '#1a3a6b', textAlign: 'left', fontWeight: '600' }}>负责人</th>
              <th style={{ padding: '4px 6px', background: '#e8f0fe', color: '#1a3a6b', textAlign: 'left', fontWeight: '600' }}>DDL</th>
            </tr>
          </thead>
          <tbody>
            {taskList.map(function(task, idx) {
              var ownerNames = (task[WEEK_GOAL_FIELDS.taskOwner] || []).join('、');
              var deadlineTs = task[WEEK_GOAL_FIELDS.taskDeadline];
              var deadlineStr = deadlineTs ? formatDate(deadlineTs, 'YYYY-MM-DD') : '-';
              var progressVal = task[WEEK_GOAL_FIELDS.taskProgress] || '';
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '4px 6px', color: '#666' }}>{task[WEEK_GOAL_FIELDS.taskType] || '-'}</td>
                  <td style={{ padding: '4px 6px', maxWidth: '120px', wordBreak: 'break-all' }}>{task[WEEK_GOAL_FIELDS.taskDesc] || '-'}</td>
                  <td style={{ padding: '4px 6px', color: progressVal ? '#1a3a6b' : '#bbb' }}>{progressVal || '-'}</td>
                  <td style={{ padding: '4px 6px', color: '#666' }}>{ownerNames || '-'}</td>
                  <td style={{ padding: '4px 6px', color: '#fa8c16' }}>{deadlineStr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
  }

  // ---- 右侧成员明细矩阵 ----
  var weekDays = ['周一', '周二', '周三', '周四', '周五'];
  var weekDayDates = [];
  for (var di = 0; di < 5; di++) {
    var dayTs = weekRange[0] + di * 24 * 3600 * 1000;
    weekDayDates.push(formatDate(dayTs, 'YYYY-MM-DD'));
  }

  var matrixHeaderEl = (
    <tr>
      <th style={{ ...styles.matrixTh, width: '120px', minWidth: '100px' }}>成员 (周得分)</th>
      {weekDays.map(function(day, di) {
        return (
          <th key={di} style={{ ...styles.matrixTh, minWidth: '160px' }}>
            <div>{day}</div>
            <div style={{ fontSize: '11px', fontWeight: 'normal', opacity: 0.8 }}>{weekDayDates[di]}</div>
            <div style={{ fontSize: '10px', fontWeight: 'normal', opacity: 0.7 }}>事项 / 耗时</div>
          </th>
        );
      })}
    </tr>
  );

  var matrixBodyEl;
  if (state.getPersonWeeklyGoalsLoading) {
    matrixBodyEl = (
      <tr>
        <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#999' }}>加载中...</td>
      </tr>
    );
  } else if (state.personWeeklyGoals.data.length === 0) {
    matrixBodyEl = (
      <tr>
        <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#bbb' }}>暂无成员周目标数据</td>
      </tr>
    );
  } else {
    matrixBodyEl = state.personWeeklyGoals.data.map(function(personItem) {
      // 将所有目标行按日期分配到周一~周五（按任务顺序分配，每天最多显示所有目标）
      // 实际上个人周目标没有按天拆分，将所有目标平铺展示在矩阵中
      // 每个目标维度对应一列（目标1~5），按行展示在矩阵中
      // 这里将所有目标行合并，按目标维度顺序分配到5天
      var allGoalRows = [];
      personItem.weeklyGoals.forEach(function(dimRows, dimIdx) {
        dimRows.forEach(function(row) {
          allGoalRows.push({ dimIdx: dimIdx, row: row });
        });
      });

      // 将目标行按5天分配（循环分配）
      var dayGoals = [[], [], [], [], []];
      allGoalRows.forEach(function(goalItem, idx) {
        dayGoals[idx % 5].push(goalItem);
      });

      return (
        <tr key={personItem.formInstId || personItem.name} style={{ borderBottom: '2px solid #e8e8e8' }}>
          {/* 成员列 */}
          <td style={{ ...styles.matrixTd, background: '#f8f9fc', verticalAlign: 'top', minWidth: '100px' }}>
            <div
              style={{ fontWeight: '600', color: '#1a3a6b', cursor: 'pointer', marginBottom: '4px' }}
              onClick={function() { self.onClickPersonName(personItem); }}
            >
              {personItem.name}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
              {(personItem.scoreList || []).map(function(scoreVal, si) {
                return <span key={si} style={styles.tagBlue}>{scoreVal}</span>;
              })}
            </div>
            <div style={{ marginTop: '6px' }}>
              <button
                style={styles.btnSmall}
                onClick={function() { self.onGoalClick('personWeeklyGoalClick', personItem.formInstId, FORM.personGoal); }}
              >查看</button>
            </div>
          </td>
          {/* 5天任务列 */}
          {dayGoals.map(function(dayItems, di) {
            return (
              <td key={di} style={{ ...styles.matrixTd, verticalAlign: 'top', minWidth: '160px' }}>
                {dayItems.length === 0
                  ? <span style={{ color: '#ddd', fontSize: '11px' }}>-</span>
                  : dayItems.map(function(goalItem, gi) {
                    var row = goalItem.row;
                    var hasProgress = row.progress && row.progress.trim();
                    return (
                      <div
                        key={gi}
                        style={{ marginBottom: '6px', cursor: 'pointer', padding: '4px', borderRadius: '3px', background: '#f8f9fc', border: '1px solid #e8e8e8' }}
                        onClick={function() { self.onGoalItemClick(personItem, row, goalItem.dimIdx); }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                          <span style={{
                            display: 'inline-block',
                            background: hasProgress ? '#1a3a6b' : '#ff4d4f',
                            color: '#fff',
                            borderRadius: '2px',
                            padding: '0 4px',
                            fontSize: '10px',
                            marginRight: '4px',
                            flexShrink: 0,
                          }}>
                            {hasProgress ? '已完成' : '未完成'}
                          </span>
                          {row.time ? <span style={{ color: '#999', fontSize: '10px' }}>{row.time}h</span> : null}
                        </div>
                        <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.4', wordBreak: 'break-all' }}>
                          {row.score || '-'}
                        </div>
                        {hasProgress && (
                          <div style={{ fontSize: '10px', color: '#1a3a6b', marginTop: '2px' }}>{row.progress}</div>
                        )}
                        {row.commendable && (
                          <div style={{ fontSize: '10px', color: '#fa8c16', marginTop: '2px', fontStyle: 'italic' }}>
                            💬 {row.commendable}
                          </div>
                        )}
                      </div>
                    );
                  })
                }
              </td>
            );
          })}
        </tr>
      );
    });
  }

  // ---- 评语弹窗 ----
  var commentDialogEl = null;
  if (state.commentDialogVisible) {
    commentDialogEl = (
      <div style={styles.overlay} onClick={function(e) { if (e.target === e.currentTarget) self.setCustomState({ commentDialogVisible: false }); }}>
        <div style={styles.dialogBox}>
          <div style={styles.dialogTitle}>💬 点赞 / 评语</div>
          <textarea
            style={{ width: '100%', minHeight: '80px', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }}
            defaultValue={state.commentText}
            onChange={function(e) { _customState.commentText = e.target.value; }}
            placeholder="请输入评语..."
          />
          <div style={styles.dialogFooter}>
            <button style={{ ...styles.btnSmall, padding: '6px 16px' }} onClick={function() { self.setCustomState({ commentDialogVisible: false }); }}>取消</button>
            <button style={{ ...styles.btnPrimary, padding: '6px 16px' }} onClick={function() { self.onCommentConfirm(); }}>确认</button>
          </div>
        </div>
      </div>
    );
  }

  // ---- AI 总结弹窗 ----
  var aiSummaryEl = null;
  if (state.aiSummaryVisible) {
    aiSummaryEl = (
      <div style={styles.overlay} onClick={function(e) { if (e.target === e.currentTarget) self.setCustomState({ aiSummaryVisible: false }); }}>
        <div style={styles.dialogBox}>
          <div style={styles.dialogTitle}>🤖 AI 工作总结 - {state.aiSummaryName}</div>
          {state.aiSummaryLoading
            ? <div style={{ color: '#999', textAlign: 'center', padding: '24px' }}>AI 生成中...</div>
            : <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#333', background: '#f8f9fc', padding: '12px', borderRadius: '4px', minHeight: '60px' }}>
                {state.aiSummaryText}
              </div>
          }
          <div style={styles.dialogFooter}>
            {!state.aiSummaryLoading && (
              <button style={{ ...styles.btnSmall, padding: '6px 16px' }} onClick={function() { self.copyAISummary(); }}>复制</button>
            )}
            <button style={{ ...styles.btnPrimary, padding: '6px 16px' }} onClick={function() { self.setCustomState({ aiSummaryVisible: false }); }}>关闭</button>
          </div>
        </div>
      </div>
    );
  }

  // ---- 抽屉 ----
  var drawerEl = null;
  if (state.drawerVisible) {
    drawerEl = (
      <div>
        <div style={styles.drawerOverlay} onClick={function() { self.onDrawerClose(); }} />
        <div style={styles.drawerPanel}>
          <div style={styles.drawerHeader}>
            <span style={{ fontWeight: '600', color: '#1a3a6b' }}>表单</span>
            <button style={{ ...styles.btnSmall, padding: '4px 12px' }} onClick={function() { self.onDrawerClose(); }}>关闭</button>
          </div>
          <iframe
            src={state.drawerUrl}
            style={{ flex: 1, border: 'none', width: '100%' }}
            title="yida-form"
          />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 隐藏 timestamp 触发重渲染 */}
      <div style={{ display: 'none' }}>{timestamp}</div>

      {filterBarEl}
      {statusBarEl}

      <div style={styles.mainLayout}>
        {/* 左侧边栏 */}
        <div style={styles.sidebar}>
          {/* C-1 本月目标 */}
          <div style={styles.sidebarSection}>
            <div
              style={styles.sidebarTitle}
              onClick={function() { self.onGoalClick('teamMonthGoalClick', state.teamMonthGoals.formInstId, FORM.monthGoal); }}
            >
              <span>📋 本月目标</span>
              <span style={{ fontSize: '11px', color: '#999' }}>点击编辑 →</span>
            </div>
            {monthGoalsEl}
          </div>

          {/* C-2 周目标拆解&进展 */}
          <div style={styles.sidebarSection}>
            <div
              style={styles.sidebarTitle}
              onClick={function() { self.onGoalClick('teamWeeklyGoalClick', state.teamWeeklyGoals.formInstId, FORM.weekGoal); }}
            >
              <span>📊 周目标拆解&进展</span>
              <span style={{ fontSize: '11px', color: '#999' }}>点击编辑 →</span>
            </div>
            {weekGoalMatrixEl}
          </div>

          {/* C-3 本周任务 */}
          <div style={styles.sidebarSection}>
            <div
              style={styles.sidebarTitle}
              onClick={function() { self.onGoalClick('teamWeeklyGoalClick', state.teamWeeklyGoals.formInstId, FORM.weekGoal); }}
            >
              <span>✅ 本周任务</span>
              <span style={{ fontSize: '11px', color: '#999' }}>点击编辑 →</span>
            </div>
            {taskListEl}
          </div>
        </div>

        {/* 右侧成员明细矩阵 */}
        <div style={styles.matrixArea}>
          <table style={styles.matrixTable}>
            <thead>{matrixHeaderEl}</thead>
            <tbody>{matrixBodyEl}</tbody>
          </table>
        </div>
      </div>

      {commentDialogEl}
      {aiSummaryEl}
      {drawerEl}
    </div>
  );
}
