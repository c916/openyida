# 个人薪资计算器 需求文档

## 应用配置

| 配置项 | 值 |
| --- | --- |
| appType | APP_X3Y0TVB8F106IL5FFN7K |
| corpId | ding8196cd9a2b2405da24f2f5cc6abecb85 |
| baseUrl | https://ding.aliwork.com |

> Schema ID（`formUuid`、`fieldId` 等）记录在 `.cache/salary-calculator-schema.json`

## 功能需求

专业级薪资结构分析工具，帮助职场人精准估算收入结构，包含：
- 智能输入区：月薪、城市、年终奖、社保公积金等参数
- 计算引擎：五险一金、个税累进税率、年终奖单独/合并计税
- 可视化结果：4宫格核心指标 + CSS 图表（环形图、柱状图、瀑布图）
- 结果操作：一键复制、保存方案、方案对比

## UI 设计

- 色彩：主绿#10B981、深绿#059669、浅绿#D1FAE5
- 布局：桌面左右分栏（输入40%+结果60%），移动端上下堆叠
- 字体：等宽数字、24-32px粗体绿色金额
