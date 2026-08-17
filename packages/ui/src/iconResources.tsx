import type { CSSProperties } from 'react';

type CompanyIconProps = {
  type: string;
  className?: string;
  style?: CSSProperties;
};

export const companyIconfontProject = {
  provider: 'Alibaba Iconfont',
  projectId: '5177816',
  fontFamily: 'iconfont',
  cssHref: '//at.alicdn.com/t/c/font_5177816_g38ev2v9pfd.css',
  symbolHref: '//at.alicdn.com/t/c/font_5177816_g38ev2v9pfd.js',
  previewCssHref: '/assets/iconfont/company-iconfont.css',
} as const;

export function CompanyIcon({ type, className = '', style }: CompanyIconProps) {
  return <i className={`iconfont ${type} company-icon ${className}`.trim()} style={style} aria-hidden="true" />;
}

export const companyIcons = {
  add: 'icon-jia',
  aiAgent: 'icon-a-zhinengtizhinengtizhinengshitizhinengdailizhinengtixitongzhinengtichengxuzhinengtiruanjianzizhuzhinengtizhinengzhutizhinengti',
  aiChat: 'icon-a-AIduihuaAIjiaotanrengongzhinengduihuaAIduihuajiaohurengongzhinengjiaotanAIliaotianrengongzhinengliaotianAIduihuagoutong',
  aiOverview: 'icon-a-gailanAI',
  appFramework: 'icon-webyingyongkuangjia',
  applicationInfo: 'icon-webyingyongxinxi',
  attachment: 'icon-fujian',
  alertLevel: 'icon-a-biaoqianjingbaojingshibaojing',
  authorization: 'icon-shouquanguanli',
  center: 'icon-duojizhongxin',
  collapse: 'icon-xiangzuozhankai',
  component: 'icon-zujianxinxi',
  confirm: 'icon-dui',
  copy: 'icon-fuzhi',
  close: 'icon-guanbigaoliang',
  closeCircle: 'icon-a-cuoguanbi',
  delete: 'icon-shanchu',
  download: 'icon-xiazai',
  drag: 'icon-dianzhuangtuozhuai',
  deepThink: 'icon-a-shendusikaoshendusisuoshenrusikaoshencengsikaoshendukaoliangshendusilvshenrusisuoshencengsisuoshenduzhuomoshenruzhuomo',
  down: 'icon-xiajiantou',
  edit: 'icon-bianji',
  enable: 'icon-kaishi',
  expand: 'icon-xiajiantou',
  export: 'icon-a-daochutiaozhuan',
  filter: 'icon-shaixuan',
  failed: 'icon-a-cuowushibai',
  fullscreen: 'icon-quanping',
  knowledgeBase: 'icon-a-zhishikuzhishichubeikuxinxiziliaokuzhishijihexinxijihekuzhishicangkuxinxicangchuzhishidangankuxinxidanganzhishi',
  highConfidence: 'icon-gaozhixin',
  ignore: 'icon-hulve',
  importData: 'icon-daoru',
  inProgress: 'icon-lishijilu',
  lowConfidence: 'icon-dizhixin',
  maintenanceOrganization: 'icon-weihuzuzhi',
  menu: 'icon-caidan',
  message: 'icon-a-tixinglingdang',
  mute: 'icon-guanbishengyin',
  mediumConfidence: 'icon-zhongzhixin',
  product: 'icon-gongyechanpin',
  play: 'icon-bofang',
  refresh: 'icon-a-shuaxingengxinzhongzhi',
  riskAsset: 'icon-a-kehuduandiannao',
  sdk: 'icon-SDKwenjian',
  search: 'icon-a-sousuofangdajing',
  search360: 'icon-a-360qiyezhinao',
  screenshot: 'icon-jieping',
  send: 'icon-a-fasongfabufeiji',
  securityCenter: 'icon-anquanzhongxin',
  securityEvent: 'icon-gaojing',
  securityPolicy: 'icon-anquanpeizhi',
  setting: 'icon-a-shezhixitong',
  sort: 'icon-paixu',
  success: 'icon-a-tongguochenggong',
  stop: 'icon-tingzhi',
  task: 'icon-a-renwushiminggongzuozhizechashizhuananxiangmurenwuxiangshimingzhifenshiwuweipaizhutuozechengdandangshimingren',
  terminal: 'icon-zhongduanfuwuqi',
  terminalOnline: 'icon-zhongduanfuwuqi1',
  test: 'icon-a-pipeiceshi',
  time: 'icon-a-shijianriqizhongbiao',
  trendDown: 'icon-xiajiang',
  trendUp: 'icon-shangsheng',
  threatLevel: 'icon-eyilanjie',
  thumbsDown: 'icon-buxihuan',
  thumbsUp: 'icon-dianzan',
  upload: 'icon-shangchuan',
  uploadImage: 'icon-tupian1',
  user: 'icon-a-yonghuzhanghaoguanliyuan',
  visualization: 'icon-keshihua',
  voice: 'icon-maikefeng',
  volume: 'icon-kaiqishengyin',
  vulnerability: 'icon-loudong',
  waiting: 'icon-shalou',
  warning: 'icon-a-zhuyitishi',
  webSearch: 'icon-wangluo',
  visible: 'icon-a-kejianyanjing',
  hidden: 'icon-a-bukejianbiyan',
  help: 'icon-a-tishibangzhu',
} as const;

export type CompanyIconSemanticCategory = 'button' | 'tag' | 'status' | 'common';

export type CompanyIconSemanticResource = {
  category: CompanyIconSemanticCategory;
  name: string;
  synonyms: readonly string[];
  icon: string;
};

export const companyIconSemanticResources: readonly CompanyIconSemanticResource[] = [
  { category: 'button', name: '新增', synonyms: ['新建', '添加', '创建', '录入', '增加'], icon: companyIcons.add },
  { category: 'button', name: '导入', synonyms: ['上传', '批量导入', '导入数据', '载入'], icon: companyIcons.importData },
  { category: 'button', name: '导出', synonyms: ['下载', '批量导出', '导出数据', '生成文件'], icon: companyIcons.export },
  { category: 'button', name: '启用', synonyms: ['开启', '启动', '激活', '生效'], icon: companyIcons.enable },
  { category: 'button', name: '停用', synonyms: ['禁用', '关闭', '暂停', '失效'], icon: companyIcons.failed },
  { category: 'button', name: '删除', synonyms: ['移除', '清除', '作废', '销毁'], icon: companyIcons.delete },
  { category: 'button', name: '设置', synonyms: ['配置', '参数设置', '选项', '规则设置'], icon: companyIcons.setting },
  { category: 'button', name: '测试', synonyms: ['试运行', '检测', '校验', '连通性测试'], icon: companyIcons.test },
  { category: 'button', name: '搜索', synonyms: ['查询', '检索', '筛选', '查找'], icon: companyIcons.search },
  { category: 'button', name: '上传', synonyms: ['提交文件', '上传文件', '文件上传', '提交', '传输'], icon: companyIcons.upload },
  { category: 'tag', name: '告警级别', synonyms: ['告警等级', '告警严重度', '报警级别', '预警级别', '告警优先级'], icon: companyIcons.alertLevel },
  { category: 'tag', name: '安全事件', synonyms: ['安全告警', '异常事件', '攻击事件', '威胁事件', '风险事件'], icon: companyIcons.securityEvent },
  { category: 'tag', name: '威胁等级', synonyms: ['威胁级别', '威胁严重度', '危险等级', '攻击等级', '威胁优先级'], icon: companyIcons.threatLevel },
  { category: 'tag', name: '漏洞等级', synonyms: ['漏洞级别', '漏洞严重度', '漏洞风险等级', '缺陷等级', '漏洞优先级'], icon: companyIcons.vulnerability },
  { category: 'tag', name: '风险资产', synonyms: ['高危资产', '受影响资产', '风险对象', '问题资产', '暴露资产'], icon: companyIcons.riskAsset },
  { category: 'status', name: '成功', synonyms: ['已成功', '完成', '通过', '正常', '已完成'], icon: companyIcons.success },
  { category: 'status', name: '失败', synonyms: ['未成功', '失败状态', '执行失败', '未通过', '处理失败'], icon: companyIcons.failed },
  { category: 'status', name: '异常', synonyms: ['异常状态', '错误', '故障', '异常告警', '不可用'], icon: companyIcons.warning },
  { category: 'status', name: '待处置', synonyms: ['待处理', '待办', '未处置', '待响应', '待跟进'], icon: companyIcons.waiting },
  { category: 'status', name: '处置中', synonyms: ['处理中', '执行中', '进行中', '响应中', '跟进中'], icon: companyIcons.inProgress },
  { category: 'status', name: '忽略', synonyms: ['已忽略', '跳过', '不处理', '排除', '无需处理'], icon: companyIcons.ignore },
  { category: 'status', name: '高置信度', synonyms: ['高可信', '高确信'], icon: companyIcons.highConfidence },
  { category: 'status', name: '中置信度', synonyms: ['中可信', '中等确信'], icon: companyIcons.mediumConfidence },
  { category: 'status', name: '低置信度', synonyms: ['低可信', '低确信'], icon: companyIcons.lowConfidence },
  { category: 'common', name: '排序', synonyms: ['排列', '排序规则', '升序', '降序', '优先级排序'], icon: companyIcons.sort },
  { category: 'common', name: '筛选', synonyms: ['过滤', '条件筛选', '过滤条件', '高级筛选', '筛查'], icon: companyIcons.filter },
  { category: 'common', name: '拖拽', synonyms: ['拖动', '拖放', '移动', '调整顺序', '拖拽排序'], icon: companyIcons.drag },
  { category: 'common', name: '隐藏', synonyms: ['收起', '不可见', '隐藏字段', '折叠', '关闭显示'], icon: companyIcons.hidden },
  { category: 'common', name: '显示', synonyms: ['展开', '可见', '显示字段', '展示', '开启显示'], icon: companyIcons.visible },
  { category: 'common', name: '消息', synonyms: ['通知', '提醒', '站内信', '消息中心', '公告'], icon: companyIcons.message },
  { category: 'common', name: '用户', synonyms: ['账号', '成员', '人员', '用户信息', '使用者'], icon: companyIcons.user },
  { category: 'common', name: '系统设置', synonyms: ['系统配置', '全局设置', '平台设置', '基础配置', '系统参数'], icon: companyIcons.setting },
] as const;
