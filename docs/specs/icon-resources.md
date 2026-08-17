# 图标资源与调用约束

## 1. 任务目标

本规范用于约束 AI 在生成 B 端页面、组件、按钮、菜单项、表格操作、列表操作和状态提示时对图标资源的选择与调用。

AI 必须在指定 Iconfont 图标资源范围内选择图标，并优先按照高频操作图标映射关系进行匹配。

当操作语义命中本规范中的高频操作映射时，AI 应直接使用对应图标 class；当未命中时，应按“4.3 未命中图标时的处理规则”处理。

## 2. 图标资源唯一来源

本 skill 使用下方阿里巴巴 Iconfont 线上 CSS 作为公共图标语义来源。静态 HTML 示例可直接调用该线上 CSS；Vue 工程实现必须遵循工程底座的固定加载方式，使用同版本 Symbol JS 写入 `engineering-foundation/static/iconfont-common.js`。

| 项目 | 值 |
|---|---|
| 图标服务商 | Alibaba Iconfont |
| 项目 ID | 5177816 |
| 字体族 | `iconfont` |
| 线上 CSS 地址 | `//at.alicdn.com/t/c/font_5177816_g38ev2v9pfd.css` |
| 协议相对地址 | `//at.alicdn.com/t/c/font_5177816_g38ev2v9pfd.css` |
| 工程 Symbol JS | `//at.alicdn.com/t/c/font_5177816_g38ev2v9pfd.js` |
| 工程本地文件 | `engineering-foundation/static/iconfont-common.js` |

该线上 CSS 链接是图标 class 与语义映射的有效来源。平台提示线上服务主要用于体验和调试，不保证稳定性；本设计系统仍按当前产品决策保留线上资源说明，同时在 Vue 工程底座中落地为本地 `iconfont-common.js`。

## 3. 图标调用方式

HTML 类输出可使用：

```html
<link rel="stylesheet" href="//at.alicdn.com/t/c/font_5177816_g38ev2v9pfd.css">
```

单个图标实例可使用：

```html
<i class="iconfont icon-a-shuaxingengxinzhongzhi" aria-hidden="true"></i>
```

如果工程底座已有固定的资源加载约定，应遵循该约定，同时保持使用同一个线上 CSS 地址。

Vue 工程底座已在 `engineering-foundation/src/main.ts` 中注册 `CommonFont`，页面代码应使用：

```vue
<common-font type="icon-a-shuaxingengxinzhongzhi" />
```

公共图标更新时，从同一 Iconfont 项目下载 Symbol JS，替换 `engineering-foundation/static/iconfont-common.js`；不要把 font class CSS 文件直接改名为 `iconfont-common.js`。

## 4. 图标 class 使用规则

### 4.1 使用规则

- 静态 HTML 示例可加载线上 CSS，并使用 `iconfont` 加图标 class 调用图标；Vue 工程实现使用 `<common-font type="icon-xxx" />`。
- 图标语义应保持稳定，例如刷新、设置、删除、导出、展开、收起、通知和状态。
- 纯图标按钮需提供 Tooltip 或 aria-label；删除、禁用、覆盖、停止等风险操作需配合文字说明或确认机制。
- 图标资源展示与图标语义映射演示应直接保留 Iconfont class 的源色值，不得通过 `filter`、统一灰度或强制 `color` 覆盖重绘。
- 状态、风险和结果类图标必须遵循 `references/design-system-spec.md` 中的语义色规则。

### 4.2 禁止行为

- 禁止将字体二进制文件或下载后的图标资产复制、存储到本 skill 中；Vue 工程底座只维护同版本 Symbol JS 到 `engineering-foundation/static/iconfont-common.js`。
- 除非工程底座已有要求，否则禁止内联 `@font-face` 或图标 class 定义。
- 禁止随机选择、联想替代、强行匹配近似图标，或使用与操作语义不匹配的图标。
- 禁止编造、推断不存在或未知的图标 class。

### 4.3 未命中图标时的处理规则

- 当操作语义未命中本规范映射，或需要的图标 class 未知时，应以上线 CSS 来源或用户提供的 class 名为准；仍无法确认时，输出“无明确推荐图标”或请求补充图标 class。

## 5. 图标映射规则

### 5.1 按钮图标映射

| 操作名称 | 同义词 | 推荐图标 class |
|---|---|---|
| 新增 | 新建、添加、创建、录入、增加 | `icon-jia` |
| 导入 | 上传、批量导入、导入数据、载入 | `icon-daoru` |
| 导出 | 下载、批量导出、导出数据、生成文件 | `icon-a-daochutiaozhuan` |
| 启用 | 开启、启动、激活、生效 | `icon-kaishi` |
| 停用 | 禁用、关闭、暂停、失效 | `icon-a-cuowushibai` |
| 删除 | 移除、清除、作废、销毁 | `icon-shanchu` |
| 设置 | 配置、参数设置、选项、规则设置 | `icon-a-shezhixitong` |
| 测试 | 试运行、检测、校验、连通性测试 | `icon-a-pipeiceshi` |
| 搜索 | 查询、检索、筛选、查找 | `icon-a-sousuofangdajing` |
| 上传 | 提交文件、上传文件、文件上传、提交、传输 | `icon-shangchuan` |

### 5.2 标签图标映射

| 操作名称 | 同义词 | 推荐图标 class |
|---|---|---|
| 告警级别 | 告警等级、告警严重度、报警级别、预警级别、告警优先级 | `icon-a-biaoqianjingbaojingshibaojing` |
| 安全事件 | 安全告警、异常事件、攻击事件、威胁事件、风险事件 | `icon-gaojing` |
| 威胁等级 | 威胁级别、威胁严重度、危险等级、攻击等级、威胁优先级 | `icon-eyilanjie` |
| 漏洞等级 | 漏洞级别、漏洞严重度、漏洞风险等级、缺陷等级、漏洞优先级 | `icon-loudong` |
| 风险资产 | 高危资产、受影响资产、风险对象、问题资产、暴露资产 | `icon-a-kehuduandiannao` |

### 5.3 状态类图标映射

| 操作名称 | 同义词 | 推荐图标 class |
|---|---|---|
| 成功 | 已成功、完成、通过、正常、已完成 | `icon-a-tongguochenggong` |
| 失败 | 未成功、失败状态、执行失败、未通过、处理失败 | `icon-a-cuowushibai` |
| 异常 | 异常状态、错误、故障、异常告警、不可用 | `icon-a-zhuyitishi` |
| 待处置 | 待处理、待办、未处置、待响应、待跟进 | `icon-shalou` |
| 处置中 | 处理中、执行中、进行中、响应中、跟进中 | `icon-lishijilu` |
| 忽略 | 已忽略、跳过、不处理、排除、无需处理 | `icon-hulve` |
| 高置信度 | 高可信、高确信 | `icon-gaozhixin` |
| 中置信度 | 中可信、中等确信 | `icon-zhongzhixin` |
| 低置信度 | 低可信、低确信 | `icon-dizhixin` |

### 5.4 其他图标映射

| 操作名称 | 同义词 | 推荐图标 class |
|---|---|---|
| 排序 | 排列、排序规则、升序、降序、优先级排序 | `icon-paixu` |
| 筛选 | 过滤、条件筛选、过滤条件、高级筛选、筛查 | `icon-shaixuan` |
| 拖拽 | 拖动、拖放、移动、调整顺序、拖拽排序 | `icon-dianzhuangtuozhuai` |
| 隐藏 | 收起、不可见、隐藏字段、折叠、关闭显示 | `icon-a-bukejianbiyan` |
| 显示 | 展开、可见、显示字段、展示、开启显示 | `icon-a-kejianyanjing` |
| 消息 | 通知、提醒、站内信、消息中心、公告 | `icon-a-tixinglingdang` |
| 用户 | 账号、成员、人员、用户信息、使用者 | `icon-a-yonghuzhanghaoguanliyuan` |
| 系统设置 | 系统配置、全局设置、平台设置、基础配置、系统参数 | `icon-a-shezhixitong` |

### 5.5 相似语义区分规则

| 易混语义 | 区分规则 | 推荐使用 |
|---|---|---|
| 导入 / 上传 | 导入强调将外部数据批量写入系统；上传强调提交文件或附件到系统。 | 导入用 `icon-daoru`；上传用 `icon-shangchuan` |
| 搜索 / 筛选 | 搜索强调关键词查找；筛选强调按条件过滤结果集。 | 搜索用 `icon-a-sousuofangdajing`；筛选用 `icon-shaixuan` |
| 设置 / 系统设置 | 设置用于局部配置、单个模块配置；系统设置用于全局、平台级配置。 | 均可用 `icon-a-shezhixitong`，文案语义优先区分 |
| 停用 / 失败 / 异常 | 停用是主动关闭能力；失败是执行结果未成功；异常是系统、状态或数据出现错误提示。 | 停用/失败用 `icon-a-cuowushibai`；异常用 `icon-a-zhuyitishi` |
| 告警级别 / 安全事件 | 告警级别是等级或严重度标签；安全事件是具体事件对象。 | 告警级别用 `icon-a-biaoqianjingbaojingshibaojing`；安全事件用 `icon-gaojing` |
| 威胁等级 / 漏洞等级 | 威胁等级描述攻击、威胁或恶意行为强度；漏洞等级描述漏洞、缺陷或风险严重度。 | 威胁等级用 `icon-eyilanjie`；漏洞等级用 `icon-loudong` |
| 成功 / 高置信度 | 成功表示任务或流程结果；高置信度表示判断可信程度。 | 成功用 `icon-a-tongguochenggong`；高置信度用 `icon-gaozhixin` |
| 待处置 / 处置中 | 待处置表示尚未开始处理；处置中表示流程正在进行。 | 待处置用 `icon-shalou`；处置中用 `icon-lishijilu` |
| 隐藏 / 显示 | 隐藏表示内容不可见或关闭展示；显示表示内容可见或开启展示。 | 隐藏用 `icon-a-bukejianbiyan`；显示用 `icon-a-kejianyanjing` |
| 消息 / 告警 | 消息用于普通通知、提醒、公告；告警用于安全、风险、异常类提示。 | 消息用 `icon-a-tixinglingdang`；告警类按标签或状态语义匹配 |
