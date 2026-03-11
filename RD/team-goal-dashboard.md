# 团队目标管理看板

## 应用配置

| 配置项 | 值 |
|--------|-----|
| appType | APP_ENDO483NCM85G2ILCS0T |
| corpId | ding8196cd9a2b2405da24f2f5cc6abecb85 |
| baseUrl | https://ding.aliwork.com |

> Schema ID（`formUuid`、`fieldId` 等）记录在 `.cache/team-goal-dashboard-schema.json`

---

## 页面与表单配置

### 团队目标看板（自定义页面）

展示团队月目标、周目标拆解进展，以及小组成员个人周目标明细矩阵，支持按小组和日期筛选。

### 小组信息表（表单页面）

| 字段名称 | 字段类型 | 说明 |
|----------|----------|------|
| 小组名称 | TextField / 单行文本 | 必填 |
| 小组编号 | SerialNumberField / 流水号 | 系统自动生成，默认隐藏 |
| 成员 | EmployeeField / 成员 | 多选，小组成员列表 |
| 组长 | EmployeeField / 成员 | 单选，必填 |

### 小组月目标表（表单页面）

| 字段名称 | 字段类型 | 说明 |
|----------|----------|------|
| 月份 | DateField / 日期 | 必填，**格式年 - 月（props.format = "YYYY-MM"** |
| 小组 | AssociationFormField / 关联表单 | 关联小组信息表，必填；主要信息展示「小组名称」，次要信息展示「小组编号」；选择后**自动回填小组编号** |
| 本月目标 | TableField / 子表 | 子表字段：目标（TextareaField / 多行文本） |
| 小组编号 | TextField / 单行文本 | 系统字段，自动回填，默认隐藏 |
| 月度目标编号 | SerialNumberField / 流水号 | 系统字段，默认隐藏 |

**小组自动填充规则（`dataFillingRules`）**：

选择小组后，宜搭自动将小组信息表的数据填充到月目标表对应字段：

- **主表填充**：
  - 小组编号（SerialNumberField）→ 小组编号（TextField）

```json
// associationFormField_4uybyzng 的 dataFillingRules 配置
"dataFillingRules": {
  "version": "v2",
  "mainRules": [
    {
      "sourceFieldId": "serialNumberField_0yye5ki8",
      "targetFieldId": "textField_4uybfn4t"
    }
  ],
  "tableRules": []
}
```

> ⚠️ **重要**：`dataFillingRules` 配置在关联表单字段的 props 中，`targetFieldId` 填写的是**当前表单（月目标表）的小组编号字段 fieldId**（`textField_4uybfn4t`），`sourceFieldId` 填写的是**源表单（小组信息表）的小组编号字段 fieldId**（`serialNumberField_0yye5ki8`）。

> ⚠️ **重要**：宜搭自动回填功能要求关联表单字段的组件节点**顶层必须有 `fieldId` 属性**（即 Schema 中节点对象的顶层，而非仅在 `props` 内）。若 `fieldId` 只存在于 `props` 中，`dataFillingRules` 将无法被识别，回填不会生效。通过 `create-form-page.js` 脚本创建或更新表单时，脚本已自动在节点顶层补充 `fieldId`，无需手动处理。

> ⚠️ **重要**：`dataFillingRules.mainRules`（及 `tableRules` 中的 `rules`）每条规则必须同时包含以下 6 个字段，缺少任意一个回填均不会生效：
> - `sourceFieldId`：源字段 ID（关联表单中的字段）
> - `targetFieldId`：目标字段 ID（当前表单中的字段）
> - `source`：同 `sourceFieldId`
> - `sourceType`：源字段的组件类型，如 `SerialNumberField`、`TextField`
> - `target`：同 `targetFieldId`
> - `targetType`：目标字段的组件类型，如 `TextField`
>
> `create-form-page.js` 脚本已内置 `normalizeFillingRules` 函数，会根据 `fieldId` 前缀自动推断组件类型并补全所有字段，无需手动填写 `source/sourceType/target/targetType`。

### 小组周目标表（表单页面）

| 字段名称 | 字段类型 | 说明 |
|----------|----------|------|
| 关联月份 | AssociationFormField / 关联表单 | 关联月目标表，必填；主要信息展示「月度目标编号」，次要信息显示「月份」；选择后**自动填充月度目标编号、小组编号，并将月度目标子表的「目标」填充到周目标拆解&进展子表** |
| 月度目标编号 | TextField / 单行文本 | 系统字段，自动回填，默认隐藏 |
| 小组 | AssociationFormField / 关联表单 | 关联小组信息表，必填；主要信息展示「小组名称」，次要信息展示「小组编号」；选择后**自动回填小组编号** |
| 时间周期 | CascadeDateField / 级联日期 | 必填，年月日范围 |
| 周 | RadioField / 单选 | 必填，选项：W1-W6 |
| 周目标拆解&进展 | TableField / 子表 | 子表字段：目标（TextField）、指标（TextareaField）、进展（TextareaField） |
| 本周任务 | TableField / 子表 | 子表字段：任务类型（TextField）、任务描述（TextareaField）、进展（TextField）、负责人（EmployeeField）、DeadLine（DateField） |
| 小组编号 | TextField / 单行文本 | 系统字段，自动回填，默认隐藏 |
| 周目标编号 | SerialNumberField / 流水号 | 默认隐藏 |

**关联周自动填充规则（`dataFillingRules`）**：

选择关联周后，宜搭自动将小组周目标表的数据填充到个人周目标表对应字段：

- **主表填充**：
  - 时间周期（CascadeDateField）→ 时间周期（CascadeDateField）
  - 周目标编号（SerialNumberField）→ 周目标编号文本（TextField）
  - 月度目标编号（TextField）→ 月度目标编号（TextField）

---

**关联月份自动填充规则（`dataFillingRules`）**：

选择月份后，宜搭自动将月度目标表的数据填充到周目标表对应字段：

### 个人周目标表（表单页面）

| 字段名称 | 字段类型 | 说明 |
|----------|----------|------|
| 关联周 | AssociationFormField / 关联表单 | 关联小组周目标，必填；主要信息显示「周目标编号」次要信息显示「时间周期」；选择后**自动回填时间周期、周目标编号、月度目标编号** |
| 周目标编号 | TextField / 单行文本 | 系统字段，自动回填，默认隐藏 |
| 月度目标编号 | TextField / 单行文本 | 系统字段，自动回填，默认隐藏 |
| 小组 | AssociationFormField / 关联表单 | 关联小组信息表，必填；主要信息展示「小组名称」，次要信息展示「小组编号」；选择后**自动回填小组编号** |
| 时间周期 | CascadeDateField / 级联日期 | 自动回填 |
| 员工 | EmployeeField / 成员 | 必填 |
| 评分 | TextField / 单行文本 | 评分文本，如 B、B+、A |
| 目标1 | TableField / 子表 | 子表字段：事项（TextareaField）、进展（TextareaField）、耗时（NumberField，`innerAfter: "H"`）、评语（TextareaField） |
| 目标2 | TableField / 子表 | 同目标1结构 |
| 目标3 | TableField / 子表 | 同目标1结构 |
| 目标4 | TableField / 子表 | 同目标1结构 |
| 目标5 | TableField / 子表 | 同目标1结构 |
| 小组编号 | TextField / 单行文本 | 系统字段，自动回填，默认隐藏 |
| 个人周目标编号 | SerialNumberField / 流水号 | 默认隐藏 |

---

## 页面结构
1. 概要与布局
● 业务目标: 用于展示团队周度目标的拆解进度、成员每日任务明细及工时统计，实现项目进度的透明化管理。
● 宏观布局: 顶部筛选区 + 蓝色状态信息条 + 左右分栏布局（左侧为目标统计侧边栏，右侧为成员任务明细矩阵）。
2. 页面结构拆解
区域 A: 顶部筛选区 (100%)
● 展示形式: 水平排列，白色背景。
● UI 元素:

    ○ 小组: 下拉选择器，支持搜索选择。
    ○ 日期: 日期选择器，展示当前选中的时间，显示年月日。
区域 B: 状态信息条 (100%)
● 展示形式: 水平排列，深蓝色背景，白色文字。
● UI 元素:

    ○ 目标数据范围: 文本，格式为“目标数据范围 (Wn)：YYYY-MM-DD ~ YYYY-MM-DD”。
    ○ Scrum信息: 文本，位于右侧，包含“Scrum(名称)”和“Scrum Master”。
区域 C: 左侧目标统计区 (20%)
● 展示形式: 垂直排列，浅灰色背景。
C-1: 本月目标模块
● UI 元素:

    ○ 模块标题: 文本，“本月目标”。
    ○ 目标内容: 垂直排列的文本块，包含目标描述及百分比进度序列。
C-2: 周目标拆解&进展模块
● UI 元素:

    ○ 模块标题: 文本，“周目标拆解&进展”。
    ○ 数据表格:

    ■ 表头：W1, W2, W3, W4。
    ■ 行内容：目标1/2/3的进展百分比，支持蓝色高亮显示。
C-3: 本周任务模块
● UI 元素:

    ○ 模块标题: 文本，“本周任务”。
    ○ 数据表格:

    ■ 表头：任务描述、进展、负责人、DDL。
    ■ 进展列：包含状态文本（如“进行中”）及百分比。
区域 D: 右侧成员明细矩阵 (80%)
● 展示形式: 大型网格数据表格。
● UI 元素:

    ○ 表头:

    ■ 成员 (周得分): 首列。
    ■ 日期列: 周一至周五，包含具体日期及“事项/耗时”副标题。
    ○ 单元格内容:

    ■ 成员列: 姓名（花名），下方带有得分标签组（如 B, B+, A 等蓝色方块标签）。
    ■ 任务明细:

    ● 状态标签：如“已完成”（蓝色）、“未完成”（红色）。
    ● 任务描述：文本内容。
    ● 耗时：文本，位于右侧，格式为“nh”（如 4h）。
    ● 进度百分比：蓝色文本（如 100%）。
    ■ 特殊标记: 截图中可见红色圈选及红色批注文字（如“加速”、“画你”），需支持批注图层。
3. 交互覆盖层
区域 X: 任务批注/异常标记
● 类型: 覆盖层标记
● 触发源: 针对特定任务单元格的异常状态标记
● 内容: 红色手绘风格圈选及红色提示文字
● 操作: 截图中未见具体操作按钮，推测为只读展示态或点击进入编辑模式

## 技术约束与最佳实践

### 宜搭 API 限制
| 约束项 | 限制值 | 说明 |
|--------|--------|------|
| `pageSize` 最大值 | **100** | `searchFormDatas` 等查询接口的 `pageSize` 参数不得超过 100，超出会被接口截断或报错 |
| `pageSize` 类型 | **Number** | 必须传数字类型（如 `100`），不能传字符串（如 `'100'`） |
| 分页查询 | 递归拉取 | 数据量可能超过 100 条时，需使用递归分页拉取所有数据 |

### 数据获取最佳实践
```javascript
// ✅ 正确：分页递归拉取所有数据（当数据可能超过100条时）
function fetchAllPages(page, accumulated) {
  return self.utils.yida.searchFormDatas({
    formUuid: FORM.personGoal,
    appType: APP_TYPE,
    searchFieldJson: JSON.stringify({ [PERSON_GOAL_FIELDS.teamNo]: teamNo }),
    currentPage: page,
    pageSize: 100,  // 最大100，且必须是数字
  }).then(function(res) {
    var pageData = res.data || [];
    var merged = accumulated.concat(pageData);
    // 如果本页满100条，继续拉取下一页
    if (pageData.length === 100) {
      return fetchAllPages(page + 1, merged);
    }
    return merged;
  });
}

// ❌ 错误：pageSize 超过100或传字符串
searchFormDatas({
  pageSize: 200,      // 错误：超过最大值100
  pageSize: '100',    // 错误：传了字符串
})
```

---

## 核心功能

### 1. 数据初始化
```javascript
didMount() {
  this.setWeekTimeLine();       // 渲染周时间轴
  this.getMyTeamList();         // 获取当前用户的小组列表
}
```

### 2. 顶部筛选
从小组信息中获取数据，小组名称，默认选中第一个小组
日期：默认是今天
目标数据范围，根据选择的「日期」，使用 this.utils.getDateTimeRange(selectedTime, 'week')
scrum名称、scrum master 从小组信息中获取数据，对应小组信息中的小组名称、组长

### 3. 获取小组列表（`getMyTeamList`）

**表单**：小组信息表

**查询条件**：`员工字段` = 当前登录用户 ID（`window.loginUser.userId`），即筛选出当前用户所在的所有小组

**返回数据映射**：
```javascript
myTeamList = data.map(item => ({
  text: item.formData.小组名称字段,       // 小组显示名称
  value: item.formData.小组编号字段,      // 小组唯一编号（流水号），后续所有查询的关联 key
  customValue: item.formData,             // 完整表单数据
}))
```

**成功后**：
- 默认选中 `myTeamList[0]`（第一个小组）
- 并行触发以下四个数据加载（顺序调用，但互不依赖）：
  1. `getPersonWeeklyGoals()` — 组员周目标（含前置评分查询）
  2. `getTeamMonthGoals()` — 小组月目标
  3. `getTeamWeeklyGoals()` — 小组周目标
  4. `getMyWeeklyGoals()` — 我的周目标

**失败处理**：若未查到任何小组，toast 提示"未获取到我的小组"，并将 `getPersonWeeklyGoalsLoading` 置为 `false`

---

### 4. 获取小组月目标（`getTeamMonthGoals`）

**表单**：小组月目标表

**查询条件**：
- `小组编号字段` = `selectedTeam.value`（当前选中小组的流水号）
- `月份字段` = `getDateTimeRange(selectedTime, 'month')`（当月时间戳范围）

**返回数据结构**：
```javascript
// 取第一条记录（每个小组每月只有一条月目标）
teamMonthGoals = {
  formInstId: data[0].formInstId,          // 表单实例 ID，用于编辑跳转
  content: data[0].formData.目标列表字段,   // 月目标内容数组（tableField）
}
```

**无数据时**：`content` 置为空数组，`formInstId` 置为空字符串

---

### 5. 获取小组周目标&进展（`getTeamWeeklyGoals`）

**表单**：小组周目标表

**查询条件**：
- `小组编号字段` = `selectedTeam.value`
- 排序：`周次单选字段`（`radioField_34opqbby`）升序（W1/W2/...）

> ⚠️ 注意：查询范围是**整月**，不是当周。`cascadeDateField` 不支持服务端范围查询，客户端按月份过滤后，再用范围匹配找当周数据。

**返回数据结构**：
```javascript
teamWeeklyGoals = {
  formInstId: '当前周实例ID',           // 用于编辑跳转（当周记录）
  content: ['W1', 'W2', 'W3', ...],    // 本月所有周的周次标签（radioField 值）
  goalList: [[...], [...], ...],        // 每周的 goalBreakdownTable 子表数组
  taskList: [...],                      // 当前周任务列表（C-3 本周任务数据源）
  currentWeekGoalList: [...],           // 当前周目标列表（已废弃，由 goalList 替代）
  titleList: [...],                     // 动态表头（已废弃）
}
```

**区域 C-2 展示逻辑（横向矩阵表格）**：

展示本月所有周的目标拆解与进展，格式如下：

```
         | W1      | W2      | W3      | W4      | W5
目标1    | 目标值   | 目标值   | 目标值   | 目标值   | 目标值
进展     | 进展值   | 进展值   | 进展值   | 进展值   | 进展值
─────────────────────────────────────────────────────
目标2    | 目标值   | ...
进展     | 进展值   | ...
─────────────────────────────────────────────────────
目标3    | 目标值   | ...
进展     | 进展值   | ...
```

**渲染规则**：
- **列数（周次）**：取 `content.length`，最少展示 4 列，不足时补空列（`W1`/`W2`/...）
- **行数（目标数）**：取所有周中 `goalBreakdownTable` 的最大行数（通常 3 个目标），每个目标占两行（目标行 + 进展行）
- **目标行**：左侧标签"目标N"，每列展示对应周 `goalList[weekIdx][goalIdx][goalMetric]`（指标字段）
- **进展行**：左侧标签"进展"（蓝色），每列展示对应周 `goalList[weekIdx][goalIdx][goalProgress]`，有值时蓝色，无值时灰色"-"
- **目标间分隔**：每组目标之间插入 4px 蓝色分隔行，视觉上区分不同目标
- **无数据时**：展示"暂无本月目标数据"占位文案

### 6. 小组本周任务展示（区域 C-3）

本周任务数据来源于 `getTeamWeeklyGoals` 中提取的 `taskList`（`WEEK_GOAL_FIELDS.taskTable` 子表），无需单独发起查询，复用周目标查询结果即可。

**数据来源**：`teamWeeklyGoals.taskList`（当周 `taskTable` 子表数据）

**展示位置**：左侧边栏，位于"周目标拆解&进展"下方（C-3 区域）

**展示表格列**：

| 列名 | 字段 | 说明 |
|------|------|------|
| 类型 | `taskType`（`textField_34opsupk`） | 任务类型，仅展示字段值，不显示 title |
| 任务描述 | `taskDesc`（`textareaField_34opamw3`） | 任务描述文本 |
| 进展 | `taskProgress`（`textField_34oppg65`） | 进展文本，有值时蓝色高亮 |
| 负责人 | `taskOwner`（`employeeField_34opiyvr`） | 员工姓名数组，多人用「、」拼接 |
| DDL | `taskDeadline`（`dateField_34opv0ca`） | 截止日期时间戳，格式化为 `YYYY-MM-DD`，橙色展示 |

**渲染逻辑**：
- `taskList` 为空时展示"暂无本周任务"占位文案
- 加载中（`teamWeeklyGoalsLoading`）时展示"加载中..."
- 点击区块标题可跳转编辑当周周目标表单（同 C-2 区域）

### 7. 获取成员月度评分历史（`getPersonWeeklyScore`）

这是 `getPersonWeeklyGoals` 的**前置查询**，用于构建每个成员的月度评分历史 map（`personMap`），供后续渲染"可圈可点"标签使用。

**查询条件**：
- `小组编号字段`（`textField_56akas0l`）= `selectedTeam.value`
- `月度编号字段` = `月目标的返回值`
- 排序：`日期字段` 降序
- `pageSize: 100`（固定，拉取整月所有周的记录）

**数据处理逻辑**：
```javascript
// 按人员聚合月度评分（reverse 后从旧到新排列）
const personMap = {}
personMonthlyList.reverse().forEach(item => {
  const userId = item.formData.员工字段_id[0]  // employeeField_56aiejpc_id
  personMap[userId] = personMap[userId] || []
  personMap[userId].push(item.formData.评分文本字段)  // score: textField_56ajnzm1
})
// 结果：{ userId: ['B', 'B+', 'A'], ... }
```

> ⚠️ **当前表约束**：（CascadeDateField），**不支持作为 searchFieldJson 的查询条件**。因此需客户端过滤：拉取该小组所有数据后，按 `cascadeDateField[0]` 时间戳是否在当月范围内筛选。

### 8. 获取成员周目标明细（`getPersonWeeklyGoals`）

这是页面**最核心的数据查询**，分两步执行：

#### 第一步：调用 `getPersonWeeklyScore` 获取月度评分历史

构建 `personMap`（key 为 userId，value 为该成员本月各周评分数组），用于渲染成员列的"可圈可点"标签。

#### 第二步：查询当周目标明细

**查询条件**：
- `小组编号字段`（`textField_56akas0l`）= `selectedTeam.value`
- 日期过滤：由于 `cascadeDateField_56ai7dos` 不支持查询，需**客户端过滤**——拉取所有数据后，按 `cascadeDateField[0]` 时间戳是否在 `getDateTimeRange(selectedTime, 'week')` 范围内筛选
- 排序：`员工字段`（`employeeField_56aiejpc`）升序
- 支持分页：`currentPage` + `pageSize`

**数据处理逻辑**：
```javascript
// 过滤当周数据
const [weekStart, weekEnd] = getDateTimeRange(selectedTime, 'week')
const weekData = allData.filter(item => {
  const startTs = Number(item.formData.cascadeDateField_56ai7dos?.[0])
  return startTs >= weekStart && startTs <= weekEnd
})

// 构建每人的 weeklyGoals（5个目标子表）
const personWeeklyGoals = weekData.map(item => ({
  formInstId: item.formInstId,
  name: item.formData.employeeField_56aiejpc[0],
  scoreList: personMap[item.formData.employeeField_56aiejpc_id[0]] || [],
  weeklyGoals: [
    // 目标1~5 各子表，每行包含：事项(task)、进展(progress)、耗时(time)、评语(comment)
    item.formData.tableField_56ajezxl?.map(row => ({ score: row.textareaField_56aj7j88, progress: row.textareaField_56aj1ltd, time: row.numberField_56ajw7vf, commendable: row.textareaField_56aj6eqp })) || [],
    // ... 目标2~5 类似
  ]
}))
```

**返回数据结构**：
```javascript
teamWeeklyGoals = {
  currentWeek: '进行中/已完成',  // 当前周状态（radioField）
  formInstId: '当前周实例ID',    // 用于编辑跳转
  content: ['第1周', '第2周', ...],  // 本月所有周的周次文本
  taskList: [...],               // 当前周任务列表（区域C-3"本周任务"数据源）
  goalList: [[...], [...], ...], // 每周的目标数组（区域C-2"周目标拆解&进展"数据源）
  titleList: [{a:'目标1', b:'进展'}, ...],  // 动态表头
}
```

---

### 5. 获取组员周目标（`getPersonWeeklyGoals`）

这是页面**最核心的数据查询**，分两步执行：

#### 第一步：获取月度评分历史（`getPersonWeeklyScore`）

**表单**：个人周目标表（同主查询表单）

**查询条件**：
- `小组编号字段` = `selectedTeam.value`
- `月度编号字段` = `月目标的返回值`（**当月**范围，拉取整月所有周的评分记录）
- 排序：`日期字段` 降序

**目的**：构建 `personMap`，key 为成员 userId，value 为该成员本月所有周的评分数组（`scoreList`）

```javascript
// 数据处理：按人员聚合评分
const personMap = {}
personMonthlyList.reverse().forEach(item => {
  const userId = item.formData.员工字段_id[0]
  personMap[userId] = personMap[userId] || []
  personMap[userId].push(item.formData.评分文本字段)  // 如 'B', 'B+', 'A'
})
```

#### 第二步：获取本周目标明细

**查询条件**：
- `小组编号字段` = `selectedTeam.value`
- `日期字段（周维度）` = `getDateTimeRange(selectedTime, 'week')`（**当周**时间范围）
- 排序：`员工字段` 升序（按姓名排序）
- 支持分页：`currentPage` + `pageSize`

**数据处理**：每条记录对应一名成员的本周目标，包含最多 **5 个目标维度**，每个维度对应一个 `tableField`：

```javascript
personWeeklyGoals = data.map(item => ({
  formInstId: item.formInstId,
  name: item.formData.员工字段[0],                          // 成员姓名（花名）
  scoreList: personMap[item.formData.员工字段_id[0]],       // 关联第一步的月度评分历史

  // 5个目标维度，每个维度是一个 tableField，每行对应一条任务
  weeklyGoals: [
    // 目标1（tableField）
    item.formData.目标1表格字段?.map(row => ({
      fieldId: '目标1表格字段ID',           // 用于后续更新时定位表格
      goalFieldId: '目标1事项字段ID',       // 任务事项（score 字段存的是事项内容）
      commendableFieldId: '目标1评语字段ID',// 点赞/评语字段
      score: row.事项字段,                  // 任务事项内容（注意：变量名叫 score，实为事项文本）
      progress: row.进展字段,               // 进展描述文本
      time: row.耗时字段,                   // 耗时（数字，单位：小时）
      commendable: row.评语字段,            // 评语内容
    })) || [],
    // 目标2 ~ 目标5 结构相同，字段 ID 不同
    [...], [...], [...], [...]
  ]
}))
```

> ⚠️ **字段命名说明**：`weeklyGoals` 中每个 item 的 `score` 字段存储的是**任务事项文本**（对应表单中的"事项"列），并非评分数字。历史遗留命名，注意区分。

**状态更新**：
```javascript
this.setState({
  personWeeklyGoals: { currentPage, data: personWeeklyGoals, totalCount },
  getPersonWeeklyGoalsLoading: false,
})
```

---

### 6. 获取我的周目标（`getMyWeeklyGoals`）

**表单**：个人周目标表（同上）

**查询条件**（在组员周目标基础上增加人员筛选）：
- `小组编号字段` = `selectedTeam.value`
- `日期字段（周维度）` = `getDateTimeRange(selectedTime, 'week')`
- `员工字段` = `[window.loginUser.userId]`（仅查当前登录用户）

**用途**：判断当前用户本周是否已填写目标，用于控制"新增/编辑"按钮的显示状态

---

### 7. 事件处理

#### 小组切换 `onTeamChange`
```javascript
// 重置分页到第1页，开启 loading
// 重新加载全部数据：
getPersonWeeklyGoals() + getTeamMonthGoals() + getTeamWeeklyGoals() + getMyWeeklyGoals()
```

#### 时间切换 `onMonthChange`
```javascript
// 1. 将选中日期写入 URL 参数（?date=YYYY-MM-DD），支持分享/刷新保持状态
// 2. 重置分页到第1页，重置周时间轴
// 3. 重新加载全部数据（同小组切换）
```

#### 分页切换 `onPaginationChange`
```javascript
// 仅更新 currentPage，重新加载组员周目标（getPersonWeeklyGoals）
// 不影响月目标、周目标等其他数据
```

---

### 8. 目标编辑功能

#### 点击目标卡片 `onGoalClick`

根据 `clickType` 参数判断点击来源，**直接新窗口打开宜搭表单详情页**（不再使用内嵌 dialog）：

| `clickType` | 对应表单 | 用途 |
|-------------|---------|------|
| `teamMonthGoalClick` | 小组月目标表 | 查看/编辑小组月目标 |
| `teamWeeklyGoalClick` | 小组周目标表 | 查看/编辑小组周目标 |
| `personWeeklyGoalClick` | 个人周目标表 | 查看/编辑个人周目标 |

跳转 URL 格式：
```
https://ding.aliwork.com/{appType}/formDetail/{formUuid}?formInstId={formInstId}&navConfig.layout=1180
```

#### 编辑小组目标弹窗 `onEditTeamGoalOk`（保留备用）

更新小组月目标/周目标表单中的**进展说明字段**（单个 textareaField）

#### 编辑个人目标弹窗 `onEditPersonGoalOk`（保留备用）

批量更新个人周目标表单中的 **10 个字段**：
- 5 个目标维度的**事项字段**（每个目标一个 textareaField）
- 5 个目标维度的**进展百分比字段**（每个目标一个 textareaField）

---

### 9. 新增目标 `addGoal`

打开抽屉（drawer），内嵌 iframe 加载宜搭表单提交页：

| `clickType` | 表单用途 |
|-------------|---------|
| `teamMonthGoalClick` | 新增小组月目标 |
| `teamWeeklyGoalClick` | 新增小组周目标 |
| `personWeeklyGoalClick` | 新增个人周目标 |
| `addTeam` | 新增小组 |

**iframe URL 参数**：
```
/{appType}/submission/{formUuid}?teamId={小组编号}&goalTime={选中日期}&corpid={corpId}&isRenderNav=false
```

**抽屉关闭后（`afterClose`）**：根据 `clickType` 刷新对应数据：
- `teamMonthGoalClick` → `getTeamMonthGoals()`
- `teamWeeklyGoalClick` → `getTeamWeeklyGoals()`
- `personWeeklyGoalClick` → `getPersonWeeklyGoals()` + `getMyWeeklyGoals()`
- `addTeam` → `getMyTeamList()`（重新拉取小组列表）

---

### 10. 点赞/评语功能 `onGoalItemClick`

**触发**：点击右侧成员明细矩阵中的某条任务事项

**流程**：
1. 记录 `selectedGoal`（含 `formInstId`、`subItem` 目标行数据、`item` 成员数据）
2. 弹出 dialog，回显已有评语（`subItem.commendable`）
3. 用户编辑后点击确认：
   - 先调用 `getFormDataById` 获取最新表单数据（防止并发覆盖）
   - 在对应 `tableField` 数组中找到匹配行（通过 `goalFieldId` 字段值 === `score` 定位）
   - 更新该行的 `commendableFieldId` 字段值
   - 调用 `updateFormData` 提交整个 tableField 数组
4. 成功后刷新 `getPersonWeeklyGoals()`

**5个目标维度的评语字段**（每个 tableField 内的子字段）：

| 目标维度 | 表格字段（tableField） | 事项字段（用于定位行） | 评语字段（commendableFieldId） |
|---------|----------------------|---------------------|-------------------------------|
| 目标1 | 目标1表格 | 目标1事项字段 | 目标1评语字段 |
| 目标2 | 目标2表格 | 目标2事项字段 | 目标2评语字段 |
| 目标3 | 目标3表格 | 目标3事项字段 | 目标3评语字段 |
| 目标4 | 目标4表格 | 目标4事项字段 | 目标4评语字段 |
| 目标5 | 目标5表格 | 目标5事项字段 | 目标5评语字段 |

---

### 11. AI 智能工作总结 `onClickPersonName`

**触发**：点击右侧成员明细矩阵中的**人员姓名**

**完整流程**：
```
点击姓名
  → 从 this.item.weeklyGoals 提取所有非空任务事项（score 字段）
  → 若无任务 → toast 提示"该人员当周暂无任务记录"，终止
  → 显示 loading toast
  → 调用 callAIModelForSummary(personName, tasksText)
      → 拼接 Prompt，POST 到 /query/intelligent/txtFromAI.json
      → 成功 → 取 result.content.content 作为总结文本
      → 失败/异常 → 降级调用 generateLocalSummary()（本地规则生成）
  → 弹出 dialog 展示总结，支持"复制"按钮（navigator.clipboard + execCommand 降级）
```

**AI 接口**：`POST /query/intelligent/txtFromAI.json`

```javascript
// 请求参数（application/x-www-form-urlencoded）
{
  _csrf_token: window.g_config._csrf_token,
  prompt: `请根据以下工作任务，为"${personName}"生成一份简洁的本周工作总结...`,
  maxTokens: '500',
  skill: 'ToText',
}

// 响应结构
{
  success: true,
  content: {
    content: '生成的总结文本',
  }
}
```

**本地降级方案（`generateLocalSummary`）**：
- 按 `；` 分割任务列表，取前4条各截取15字
- 拼接为固定格式：`${personName}本周共完成${n}项工作：1.xxx、2.xxx...`

---

## 工具函数

### getMonthStartAndEndTimestamps(time)
获取指定时间的月初和月末时间戳（毫秒）

```javascript
// 返回：[月初时间戳, 月末时间戳]
getMonthStartAndEndTimestamps(Date.now());
```

---


## 使用的宜搭 API

| API | 用途 |
|-----|------|
| `this.utils.yida.searchFormDatas` | 查询表单数据列表 |
| `this.utils.yida.updateFormData` | 更新表单数据 |
| `this.utils.yida.getFormDataById` | 根据ID查询单条数据 |
| `this.utils.toast` | 消息提示 |
| `this.utils.dialog` | 对话框展示 |
| `this.utils.formatter('date', value, 'YYYY-MM-DD');` | 日期格式化 |
| `this.utils.getDateTimeRange` | 获取时间范围 |

### AI 大模型接口

| 接口 | 用途 | 说明 |
|-----|------|------|
| `/query/intelligent/txtFromAI.json` | AI 文本生成 | 宜搭内置大模型接口，用于生成工作总结 |

**请求参数**：
```javascript
{
  _csrf_token: window.g_config._csrf_token,  // CSRF Token
  prompt: '提示词内容',                       // 生成提示
  maxTokens: '500',                          // 最大返回token数
  skill: 'ToText',                           // 技能类型
}
```

**响应结构**：
```javascript
{
  success: true,
  content: {
    content: '生成的文本内容',
    damo_requestId: '请求ID',
    usage: { input_tokens: 100, onput_tokens: 50 }
  }
}
```

---

## UI 适配要求
- 兼容 Web 端和移动端
- 使用宜搭标准组件库
- 支持响应式布局
