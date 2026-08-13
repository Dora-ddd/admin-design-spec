import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Prompts } from '@ant-design/x';
import { App as AntdApp, Button, Tooltip, Typography } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { CompanyAIOutput } from '../ai-output';
import type { AIOutputMedia, AIOutputTag, AIOutputThought, AIOutputWorkflowStep } from '../ai-output';
import { CompanyLoadingRing } from '../loading';
import { CompanySentMessage } from '../sent-message';
import type { SentMessageFile } from '../sent-message';
import { CompanySuperSender, SuperSenderFileIcon } from '../super-sender';
import type { CompanySuperSenderProps, SuperSenderSubmitPayload } from '../super-sender';
import './company-ai-workspace.css';

const { Text, Title } = Typography;

export type AIWorkspaceGenerationStage = 'analyzing' | 'retrieving' | 'generating';

export type AIWorkspaceTask = AIOutputWorkflowStep;

export type AIWorkspaceGenerationProgress = {
  stage: AIWorkspaceGenerationStage;
  label: string;
  tasks: AIWorkspaceTask[];
  output?: AIWorkspaceOutput;
};

export type AIWorkspaceSummary = {
  title: string;
  description?: string;
  items?: Array<{
    key: string;
    label: string;
    value: ReactNode;
    tone?: 'default' | 'success' | 'warning' | 'danger';
  }>;
  progress?: {
    statusLabel?: string;
    steps: Array<{ id: string; title: string; status: 'done' | 'running' | 'pending' | 'error' }>;
  };
  findings?: Array<{
    id: string;
    title: string;
    meta?: string;
    tone?: 'default' | 'warning' | 'danger';
    detail?: ReactNode;
  }>;
  files?: SentMessageFile[];
};

export type AIWorkspaceOutput = {
  title?: ReactNode;
  lead?: ReactNode;
  content?: ReactNode;
  annotation?: ReactNode;
  tags?: AIOutputTag[];
  thought?: AIOutputThought;
  media?: AIOutputMedia;
  summary?: AIWorkspaceSummary;
};

export type AIWorkspaceUserMessage = {
  id: string;
  role: 'user';
  content: string;
  files?: SentMessageFile[];
  request?: SuperSenderSubmitPayload;
};

export type AIWorkspaceAssistantMessage = {
  id: string;
  role: 'assistant';
  status: 'queued' | 'generating' | 'ready' | 'stopped' | 'error';
  progress?: AIWorkspaceGenerationProgress;
  output?: AIWorkspaceOutput;
  errorText?: ReactNode;
};

export type AIWorkspaceMessage = AIWorkspaceUserMessage | AIWorkspaceAssistantMessage;

export type AIWorkspaceConversation = {
  id: string;
  title: string;
  steps?: string;
  tokens?: string;
  group?: string;
  messages: AIWorkspaceMessage[];
};

export type AIWorkspaceGenerator = (
  request: SuperSenderSubmitPayload,
  context: {
    signal: AbortSignal;
    onProgress: (progress: AIWorkspaceGenerationProgress) => void;
  },
) => Promise<AIWorkspaceOutput>;

export type CompanyAIWorkspaceProps = {
  title?: string;
  assistantName?: string;
  conversations?: AIWorkspaceConversation[];
  prompts?: Array<{ key: string; label: ReactNode; description?: ReactNode }>;
  generator?: AIWorkspaceGenerator;
  senderProps?: Omit<CompanySuperSenderProps, 'value' | 'onChange' | 'onSubmit' | 'loading' | 'onStop'>;
  initialMessages?: AIWorkspaceMessage[];
  defaultHistoryOpen?: boolean;
  defaultSummaryOpen?: boolean;
  className?: string;
  onConversationChange?: (conversation?: AIWorkspaceConversation) => void;
  onGenerationComplete?: (output: AIWorkspaceOutput) => void;
  onGenerationError?: (error: unknown) => void;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function waitFor(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      const error = new Error('Generation aborted');
      error.name = 'AbortError';
      reject(error);
      return;
    }
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer);
      const error = new Error('Generation aborted');
      error.name = 'AbortError';
      reject(error);
    }, { once: true });
  });
}

const TRACE_ALARM_ID = '019e44da-5312-79ab-b25e-3cd9fc64f357';

const entryAlarmInput = JSON.stringify({
  alarm_id: TRACE_ALARM_ID,
  fields: ['alarm_name', 'attack_result', 'src_address', 'dst_address', 'url', 'occur_time'],
}, null, 2);

const entryAlarmOutput = JSON.stringify({
  alarm_name: 'Linux 系统 passwd 密码文件传输行为',
  attack_result: true,
  src_address: '220.181.41.61',
  dst_address: '10.41.5.214',
  url: '/poc/PoseFlocController/filePosPic',
  occur_time: '2026-05-20 18:05:53',
  technique_id: 'T1190',
}, null, 2);

const rawLogEvidence = [
  '2026-05-20T18:05:53+08:00',
  'src=220.181.41.61 dst=10.41.5.214',
  'POST /poc/PoseFlocController/filePosPic HTTP/1.1',
  'payload=path=/etc/passwd',
  'status=200 bytes=1842',
  'user_agent=python-requests/2.32.3',
].join('\n');

const taskTemplates: Array<Omit<AIOutputWorkflowStep, 'status'>> = [
  {
    id: 'target-analysis',
    title: '调查任务分析',
    runningTitle: '调查目标分析中',
    completedTitle: '已完成调查任务分析',
    sections: [{
      key: 'plan',
      content: '1. 获取入口告警与调查目标\n2. 平台关联攻击源与 RawLog\n3. 对攻击源及关联地址执行 IOC 情报研判\n4. 扩展查询攻击者构成与服务器安全基线\n5. 汇总结论、证据、处置建议并生成报告',
    }],
  },
  {
    id: 'entry-alert',
    title: '入口告警确认',
    runningTitle: '入口告警确认中',
    completedTitle: '已确认入口告警',
    sections: [
      { key: 'input', title: '输入', content: entryAlarmInput, kind: 'code' },
      { key: 'output', title: '输出', content: entryAlarmOutput, kind: 'code' },
    ],
  },
  {
    id: 'result-check',
    title: '攻击结果判定',
    runningTitle: '攻击结果判定中',
    completedTitle: '入口告警已经直接标记为攻击成功',
    badge: { label: '攻击成功', tone: 'danger' },
    sections: [{ key: 'result', content: '入口告警字段 attack_result=true，处置结论进入证据复核阶段。' }],
  },
  {
    id: 'request-recovery',
    title: '攻击请求还原',
    runningTitle: '攻击请求还原中',
    completedTitle: '还原攻击请求失败，已切换 RawLog 复核',
    badge: { label: '已降级', tone: 'warning' },
    sections: [{ key: 'fallback', content: '原始请求体已被网关采样策略截断，工作流自动降级为 RawLog、响应码和资产审计日志交叉验证。' }],
  },
  {
    id: 'rawlog',
    title: 'RawLog 证据核验',
    runningTitle: 'RawLog 证据核验中',
    completedTitle: 'RawLog 已经证明攻击请求返回 HTTP 200',
    sections: [{ key: 'rawlog', title: 'RawLog', content: rawLogEvidence, kind: 'code' }],
  },
  {
    id: 'source-ioc',
    title: '攻击源研判',
    runningTitle: '攻击源研判中',
    completedTitle: '已完成研判攻击源',
    sections: [{ key: 'ioc', content: '220.181.41.61 命中扫描探测与攻击基础设施标签；124.152.95.217 与其共享相同攻击载荷和请求指纹，判定为关联可疑主机。' }],
  },
  {
    id: 'baseline',
    title: '服务器安全基线检查',
    runningTitle: '安全基线检查中',
    completedTitle: '已检查加固基线',
    sections: [{ key: 'baseline', content: '受害资产未启用路径穿越规则，Web 服务账户存在敏感目录读取权限，需要立即收敛权限并补充 WAF 防护。' }],
  },
  {
    id: 'owner-notice',
    title: '责任人通知',
    runningTitle: '责任人通知中',
    completedTitle: '已通知负责人',
    sections: [{ key: 'notice', content: '已通知应用负责人和 SOC 值班人员，建议隔离 10.41.5.214、保全日志并冻结相关服务账户凭据。' }],
  },
  {
    id: 'evidence-review',
    title: '证据链复核',
    runningTitle: '证据链复核中',
    completedTitle: '已确认目前证据足够支撑攻击成功结论',
    sections: [{ key: 'evidence', content: '入口告警、HTTP 200 RawLog、IOC 情报和受害资产审计日志四类证据相互印证，结论置信度为高。' }],
  },
  {
    id: 'report',
    title: '调查报告生成',
    runningTitle: '威胁溯源报告生成中',
    completedTitle: '已生成并归档调查报告',
    sections: [{ key: 'report', content: '已完成摘要定性、调查范围、攻击路径、时间线、处置建议和证据附件归档。' }],
  },
];

const generationStages: Array<{
  stage: AIWorkspaceGenerationStage;
  label: string;
  duration: number;
}> = [
  { stage: 'analyzing', label: '调查目标分析中', duration: 560 },
  { stage: 'retrieving', label: '入口告警确认中', duration: 620 },
  { stage: 'analyzing', label: '攻击结果判定中', duration: 520 },
  { stage: 'retrieving', label: '攻击请求还原中', duration: 580 },
  { stage: 'retrieving', label: 'RawLog 证据核验中', duration: 640 },
  { stage: 'analyzing', label: '攻击源研判中', duration: 620 },
  { stage: 'retrieving', label: '安全基线检查中', duration: 540 },
  { stage: 'generating', label: '责任人通知中', duration: 460 },
  { stage: 'analyzing', label: '证据链复核中', duration: 580 },
  { stage: 'generating', label: '威胁溯源报告生成中', duration: 720 },
];

function progressFor(activeIndex: number, stage: AIWorkspaceGenerationStage, label: string): AIWorkspaceGenerationProgress {
  return {
    stage,
    label,
    tasks: taskTemplates.map((task, index) => ({
      ...task,
      status: index < activeIndex ? 'done' : index === activeIndex ? 'running' : 'pending',
    })),
  };
}

function partialOutputFor(progress?: AIWorkspaceGenerationProgress): AIWorkspaceOutput | undefined {
  if (!progress) return undefined;
  if (progress.output) return progress.output;
  const completedTasks = progress.tasks.filter((task) => task.status === 'done');
  if (completedTasks.length === 0) return undefined;

  return {
    media: { type: 'workflow', steps: completedTasks },
    summary: {
      title: '任务执行进度',
      progress: {
        statusLabel: '已停止',
        steps: completedTasks.map((task) => ({
          id: task.id,
          title: task.completedTitle ?? task.title,
          status: 'done' as const,
        })),
      },
    },
  };
}

function ThreatTraceReport() {
  return <div className="company-ai-workspace__trace-report">
    <section>
      <h5>摘要与定性</h5>
      <p>结论类型：攻击成功。攻击者从 220.181.41.61 对受害资产 10.41.5.214 发起路径穿越请求，成功读取 <code>/etc/passwd</code>。入口告警、RawLog、IOC 情报和资产审计日志形成完整证据链。</p>
    </section>
    <section>
      <h5>调查范围</h5>
      <div className="company-ai-workspace__trace-table-wrap">
        <table>
          <tbody>
            <tr><th>入口告警 ID</th><td>{TRACE_ALARM_ID}</td></tr>
            <tr><th>时间范围</th><td>2026-05-20 18:05:00 - 18:24:00</td></tr>
            <tr><th>涉及数据源</th><td>threat_alarm、alarm_rawlog、asset_audit、IOC 情报</td></tr>
            <tr><th>攻击源</th><td>220.181.41.61</td></tr>
            <tr><th>受害资产</th><td>10.41.5.214</td></tr>
            <tr><th>攻击技术</th><td>T1190 - Exploit Public-Facing Application</td></tr>
          </tbody>
        </table>
      </div>
    </section>
    <section>
      <h5>攻击路径总览</h5>
      <div className="company-ai-workspace__attack-path" aria-label="攻击路径">
        <span><small>攻击源</small><strong>220.181.41.61</strong></span><i />
        <span><small>漏洞利用</small><strong>路径穿越 / T1190</strong></span><i />
        <span><small>受害资产</small><strong>10.41.5.214</strong></span><i />
        <span><small>攻击结果</small><strong>/etc/passwd 泄漏</strong></span>
      </div>
    </section>
    <section>
      <h5>关键时间线</h5>
      <ol className="company-ai-workspace__trace-timeline">
        <li><time>18:05:53</time><span>首次路径穿越请求命中，服务返回 HTTP 200。</span></li>
        <li><time>18:14:55</time><span>同源请求再次读取敏感文件，攻击特征保持一致。</span></li>
        <li><time>19:32:12</time><span>关联主机 124.152.95.217 复用相同载荷发起探测。</span></li>
        <li><time>19:34:35</time><span>SOC 完成证据链复核并确认攻击成功。</span></li>
      </ol>
    </section>
    <section>
      <h5>攻击步骤分析</h5>
      <p><strong>阶段一：漏洞利用与信息收集。</strong>攻击者使用自动化脚本向公网服务提交路径穿越载荷，绕过目录限制并读取系统账号文件。</p>
      <p><strong>阶段二：证据确认与影响评估。</strong>RawLog 返回码、响应字节数和资产审计日志均证明敏感文件被读取；未发现后续提权，但应立即隔离资产并轮换服务凭据。</p>
    </section>
  </div>;
}

export const defaultAIWorkspaceGenerator: AIWorkspaceGenerator = async (request, { signal, onProgress }) => {
  for (const [index, item] of generationStages.entries()) {
    onProgress(progressFor(index, item.stage, item.label));
    await waitFor(item.duration, signal);
  }

  const enabledCapabilities = [
    request.deepThinking ? '深度思考' : '',
    request.webSearch ? '联网搜索' : '',
    request.knowledgeBase ? '知识库' : '',
  ].filter(Boolean);

  return {
    title: '威胁溯源报告 · 攻击成功',
    lead: '告警已完成证据复核，确认攻击成功并形成处置结论',
    content: <ThreatTraceReport />,
    annotation: '本回答由 AI 生成，内容仅供参考，请结合实际安全策略确认。',
    tags: [
      { key: 'result', label: '攻击成功' },
      { key: 'technique', label: '路径穿越 / T1190' },
      ...(enabledCapabilities.length > 0 ? [{ key: 'capabilities', label: enabledCapabilities.join(' / ') }] : []),
    ],
    thought: {
      title: '已完成调查推理',
      content: '已按调查目标、入口告警、原始日志、IOC 情报、资产基线和证据完整性完成交叉验证。',
      status: 'complete',
    },
    media: {
      type: 'workflow',
      steps: taskTemplates.map((task) => ({ ...task, status: 'done' as const })),
    },
    summary: {
      title: '路径穿越攻击威胁溯源',
      description: `调查任务：${request.value}`,
      items: [
        { key: 'alerts', label: '入口告警', value: '1 条', tone: 'danger' },
        { key: 'ioc', label: '关联 IOC', value: '2 个', tone: 'warning' },
        { key: 'assets', label: '受害资产', value: '1 台', tone: 'danger' },
      ],
      progress: {
        statusLabel: '已完成',
        steps: taskTemplates.map((task) => ({ ...task, status: 'done' as const })),
      },
      findings: [
        { id: 'source', title: '220.181.41.61', meta: '攻击源', tone: 'warning', detail: '扫描探测 / Attacker.Scanning' },
        { id: 'asset', title: '10.41.5.214', meta: '受害资产', tone: 'danger' },
        { id: 'result', title: '攻击成功', meta: '攻击结果', tone: 'danger' },
        { id: 'risk', title: '/etc/passwd 泄漏', meta: '风险', tone: 'danger' },
      ],
      files: [
        { id: 'trace-report', name: '告警威胁溯源调查报告.doc', size: '152KB', fileType: 'word' },
        { id: 'evidence', name: '攻击证据链与时间线.doc', size: '96KB', fileType: 'word' },
        { id: 'actions', name: '受害资产处置建议.doc', size: '88KB', fileType: 'word' },
      ],
    },
  };
};

function requestFiles(request: SuperSenderSubmitPayload): SentMessageFile[] {
  return request.attachments.map((file) => ({ id: file.id, name: file.name, size: file.size, fileType: file.fileType }));
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError';
}

export function CompanyAIWorkspace({
  title = '你好，我是中枢专家',
  assistantName = '中枢专家',
  conversations = [],
  prompts = [],
  generator = defaultAIWorkspaceGenerator,
  senderProps,
  initialMessages = [],
  defaultHistoryOpen = true,
  defaultSummaryOpen = true,
  className,
  onConversationChange,
  onGenerationComplete,
  onGenerationError,
}: CompanyAIWorkspaceProps) {
  const { message: appMessage } = AntdApp.useApp();
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<AIWorkspaceMessage[]>(initialMessages);
  const [activeConversationId, setActiveConversationId] = useState('');
  const [historyOpen, setHistoryOpen] = useState(defaultHistoryOpen);
  const [summaryOpen, setSummaryOpen] = useState(defaultSummaryOpen);
  const [generating, setGenerating] = useState(false);
  const [viewState, setViewState] = useState<'welcome' | 'leaving' | 'conversation'>(initialMessages.length > 0 ? 'conversation' : 'welcome');
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const welcomeTransitionRef = useRef<{
    timer: number;
    resolve: (shouldContinue: boolean) => void;
  } | null>(null);

  const latestAssistant = useMemo(
    () => [...messages].reverse().find((message): message is AIWorkspaceAssistantMessage => message.role === 'assistant'),
    [messages],
  );
  const todayConversations = useMemo(() => conversations.filter((item) => item.group === 'today'), [conversations]);
  const historyConversations = useMemo(() => conversations.filter((item) => item.group !== 'today'), [conversations]);

  const finishWelcomeTransition = useCallback((shouldContinue: boolean) => {
    const pending = welcomeTransitionRef.current;
    if (!pending) return;
    window.clearTimeout(pending.timer);
    welcomeTransitionRef.current = null;
    pending.resolve(shouldContinue);
  }, []);

  const waitForWelcomeTransition = useCallback(() => new Promise<boolean>((resolve) => {
    const timer = window.setTimeout(() => finishWelcomeTransition(true), 680);
    welcomeTransitionRef.current = { timer, resolve };
  }), [finishWelcomeTransition]);

  useEffect(() => () => {
    abortRef.current?.abort();
    finishWelcomeTransition(false);
  }, [finishWelcomeTransition]);

  useEffect(() => {
    const element = messagesRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages]);

  const updateAssistant = useCallback((id: string, patch: Partial<AIWorkspaceAssistantMessage>) => {
    setMessages((current) => current.map((message) => message.id === id && message.role === 'assistant' ? { ...message, ...patch } : message));
  }, []);

  const createRequest = useCallback((content: string): SuperSenderSubmitPayload => ({
    value: content,
    agentKey: senderProps?.agentKey ?? senderProps?.defaultAgentKey ?? senderProps?.agentOptions?.[0]?.key ?? '',
    searchEngineKey: senderProps?.searchEngineKey ?? senderProps?.defaultSearchEngineKey ?? senderProps?.searchEngineOptions?.[0]?.key ?? '',
    mcpKeys: senderProps?.mcpKeys ?? senderProps?.defaultMcpKeys ?? [],
    modelKey: senderProps?.modelKey ?? senderProps?.defaultModelKey ?? senderProps?.modelOptions?.[0]?.key ?? '',
    deepThinking: senderProps?.deepThinking ?? senderProps?.defaultDeepThinking ?? false,
    webSearch: senderProps?.webSearch ?? senderProps?.defaultWebSearch ?? false,
    knowledgeBase: false,
    voice: false,
    quote: senderProps?.quote,
    attachments: senderProps?.attachments ?? senderProps?.defaultAttachments ?? [],
    skill: senderProps?.skill,
    skillValues: Object.fromEntries(senderProps?.skill?.slots?.map((slot) => [slot.key, slot.defaultValue ?? '']) ?? []),
  }), [senderProps]);

  const runGeneration = useCallback(async (request: SuperSenderSubmitPayload, assistantId: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setGenerating(true);
    let latestProgress = progressFor(0, generationStages[0].stage, generationStages[0].label);
    updateAssistant(assistantId, {
      status: 'generating',
      errorText: undefined,
      output: undefined,
      progress: latestProgress,
    });

    try {
      const output = await generator(request, {
        signal: controller.signal,
        onProgress: (progress) => {
          latestProgress = progress;
          updateAssistant(assistantId, {
            status: 'generating',
            progress,
            ...(progress.output ? { output: progress.output } : {}),
          });
        },
      });
      updateAssistant(assistantId, { status: 'ready', output, progress: undefined });
      onGenerationComplete?.(output);
    } catch (error) {
      const aborted = isAbortError(error);
      const partialOutput = aborted ? partialOutputFor(latestProgress) : undefined;
      updateAssistant(assistantId, aborted ? {
        status: 'stopped',
        progress: undefined,
        output: partialOutput,
        errorText: undefined,
      } : {
        status: 'error',
        progress: undefined,
        errorText: '生成失败，请重试。',
      });
      if (!aborted) onGenerationError?.(error);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setGenerating(false);
      }
    }
  }, [generator, onGenerationComplete, onGenerationError, updateAssistant]);

  const submit = useCallback(async (request: SuperSenderSubmitPayload) => {
    const trimmed = request.value.trim();
    if (!trimmed) return;
    const isFirstSubmission = viewState === 'welcome' && messages.length === 0;
    const id = `${Date.now()}`;
    const normalizedRequest = { ...request, value: trimmed };
    setActiveConversationId('');
    onConversationChange?.();
    setMessages((current) => [
      ...current,
      { id: `${id}-user`, role: 'user', content: trimmed, files: requestFiles(request), request: normalizedRequest },
      {
        id: `${id}-assistant`,
        role: 'assistant',
        status: isFirstSubmission ? 'queued' : 'generating',
        progress: isFirstSubmission ? undefined : progressFor(0, 'analyzing', generationStages[0].label),
      },
    ]);
    setValue('');
    if (isFirstSubmission) {
      setViewState('leaving');
      const shouldContinue = await waitForWelcomeTransition();
      if (!shouldContinue) return;
      setViewState('conversation');
    }
    await runGeneration(normalizedRequest, `${id}-assistant`);
  }, [messages.length, onConversationChange, runGeneration, viewState, waitForWelcomeTransition]);

  const regenerate = useCallback((assistantId: string) => {
    const assistantIndex = messages.findIndex((message) => message.id === assistantId);
    const userMessage = [...messages.slice(0, assistantIndex)].reverse().find((message): message is AIWorkspaceUserMessage => message.role === 'user');
    if (!userMessage) return;
    void runGeneration(userMessage.request ?? createRequest(userMessage.content), assistantId);
  }, [createRequest, messages, runGeneration]);

  const createConversation = () => {
    abortRef.current?.abort();
    finishWelcomeTransition(false);
    abortRef.current = null;
    setGenerating(false);
    setMessages([]);
    setViewState('welcome');
    setActiveConversationId('');
    setValue('');
    onConversationChange?.();
  };

  const openConversation = (conversation: AIWorkspaceConversation) => {
    abortRef.current?.abort();
    finishWelcomeTransition(false);
    abortRef.current = null;
    setGenerating(false);
    setActiveConversationId(conversation.id);
    setMessages(conversation.messages);
    setViewState('conversation');
    setValue('');
    onConversationChange?.(conversation);
  };

  const stopGeneration = () => abortRef.current?.abort();

  const summary = latestAssistant && (latestAssistant.status === 'ready' || latestAssistant.status === 'stopped') ? latestAssistant.output?.summary : undefined;
  const firstUserMessage = messages.find((message): message is AIWorkspaceUserMessage => message.role === 'user');

  return <div className={classes(
    'company-ai-workspace',
    historyOpen ? 'is-history-open' : 'is-history-collapsed',
    summaryOpen ? 'is-summary-open' : 'is-summary-collapsed',
    className,
  )}>
    <header className="company-ai-workspace__toolbar">
      <div className="company-ai-workspace__toolbar-group">
        <Tooltip title={historyOpen ? '收起历史对话' : '展开历史对话'}>
          <Button
            type="text"
            aria-label={historyOpen ? '收起历史对话' : '展开历史对话'}
            className={classes(!historyOpen && 'is-reversed')}
            icon={<CompanyIcon type={companyIcons.collapse} />}
            onClick={() => setHistoryOpen((open) => !open)}
          />
        </Tooltip>
        <Tooltip title="新建 AI 任务">
          <Button type="text" aria-label="新建 AI 任务" icon={<CompanyIcon type={companyIcons.aiChat} />} onClick={createConversation} />
        </Tooltip>
      </div>
      <Text strong className="company-ai-workspace__toolbar-title">
        {activeConversationId
          ? conversations.find((item) => item.id === activeConversationId)?.title
          : messages.find((message): message is AIWorkspaceUserMessage => message.role === 'user')?.content ?? 'AI 工作台'}
      </Text>
      <div className="company-ai-workspace__toolbar-group">
        <Tooltip title="任务统计">
          <Button type="text" aria-label="任务统计" icon={<CompanyIcon type={companyIcons.visualization} />} onClick={() => appMessage.info(`当前会话共 ${messages.length} 条消息`)} />
        </Tooltip>
        <Tooltip title={summaryOpen ? '收起智能摘要' : '展开智能摘要'}>
          <Button type="text" aria-label={summaryOpen ? '收起智能摘要' : '展开智能摘要'} icon={<CompanyIcon type={companyIcons.aiOverview} />} onClick={() => setSummaryOpen((open) => !open)} />
        </Tooltip>
      </div>
    </header>

    <div className="company-ai-workspace__body">
      <aside className="company-ai-workspace__history" aria-label="对话历史">
        <div className="company-ai-workspace__history-block">
          <Text className="company-ai-workspace__section-label">今天</Text>
          {messages.length > 0 && !activeConversationId
            ? <button type="button" className="company-ai-workspace__history-item is-active" onClick={() => undefined}>
              <span className="company-ai-workspace__history-title">{messages.find((message) => message.role === 'user')?.content ?? '新任务'}</span>
              <span className="company-ai-workspace__history-meta"><span>{messages.length} 条消息</span></span>
            </button>
            : todayConversations.length === 0 && <Text type="secondary" className="company-ai-workspace__history-empty">暂无对话</Text>}
          <div className="company-ai-workspace__history-list">
            {todayConversations.map((item) => <button
              type="button"
              className={classes('company-ai-workspace__history-item', activeConversationId === item.id && 'is-active')}
              key={item.id}
              onClick={() => openConversation(item)}
            >
              <span className="company-ai-workspace__history-title">{item.title}</span>
              <span className="company-ai-workspace__history-meta">
                {item.steps && <span>{item.steps}</span>}
                {item.steps && item.tokens && <i />}
                {item.tokens && <span>{item.tokens}</span>}
              </span>
            </button>)}
          </div>
        </div>
        <div className="company-ai-workspace__history-block">
          <Text className="company-ai-workspace__section-label">历史对话</Text>
          <div className="company-ai-workspace__history-list">
            {historyConversations.map((item) => <button
              type="button"
              className={classes('company-ai-workspace__history-item', activeConversationId === item.id && 'is-active')}
              key={item.id}
              onClick={() => openConversation(item)}
            >
              <span className="company-ai-workspace__history-title">{item.title}</span>
              <span className="company-ai-workspace__history-meta">
                {item.steps && <span>{item.steps}</span>}
                {item.steps && item.tokens && <i />}
                {item.tokens && <span>{item.tokens}</span>}
              </span>
            </button>)}
          </div>
        </div>
      </aside>

      <main className="company-ai-workspace__chat">
        {viewState === 'welcome' ? <div className="company-ai-workspace__welcome">
          <div className="company-ai-workspace__welcome-ambient" aria-hidden="true" />
          <div className="company-ai-workspace__welcome-content">
            <div className="company-ai-workspace__welcome-mark"><span>AI</span></div>
            <Title level={2}>{title}</Title>
            <Prompts className="company-ai-workspace__prompts" items={prompts} wrap onItemClick={({ data }) => setValue(String(data.label))} />
          </div>
        </div> : viewState === 'leaving' ? <div
          className="company-ai-workspace__welcome-transition"
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) finishWelcomeTransition(true);
          }}
        >
          <div className="company-ai-workspace__welcome company-ai-workspace__welcome-copy">
            <div className="company-ai-workspace__welcome-ambient" aria-hidden="true" />
            <div className="company-ai-workspace__welcome-content">
              <div className="company-ai-workspace__welcome-mark"><span>AI</span></div>
              <Title level={2}>{title}</Title>
              <Prompts className="company-ai-workspace__prompts" items={prompts} wrap />
            </div>
          </div>
          {firstUserMessage && <div className="company-ai-workspace__transition-message">
            <CompanySentMessage value={firstUserMessage.content} files={firstUserMessage.files} />
          </div>}
        </div> : <div ref={messagesRef} className="company-ai-workspace__messages">
          <div className="company-ai-workspace__message-list">
            {messages.map((message) => message.role === 'user'
              ? <CompanySentMessage
                key={message.id}
                value={message.content}
                files={message.files}
                onCopy={() => appMessage.success('已复制发送内容')}
                onSave={(content) => setMessages((current) => current.map((item) => item.id === message.id && item.role === 'user' ? {
                  ...item,
                  content,
                  request: item.request ? { ...item.request, value: content } : createRequest(content),
                } : item))}
              />
              : message.status === 'queued'
                ? <CompanyAIOutput
                  key={message.id}
                  agentName={assistantName}
                  thought={{ status: 'thinking', content: '任务已接收，准备开始分析' }}
                  showActions={false}
                />
                : message.status === 'generating'
                ? <CompanyAIOutput
                  key={message.id}
                  agentName={assistantName}
                  title={message.output?.title}
                  lead={message.output?.lead}
                  annotation={message.output?.annotation}
                  tags={message.output?.tags}
                  thought={message.output?.thought}
                  media={message.output?.media ?? {
                    type: 'workflow',
                    steps: message.progress?.tasks ?? progressFor(0, generationStages[0].stage, generationStages[0].label).tasks,
                  }}
                  showActions={false}
                >{message.output?.content}</CompanyAIOutput>
                : message.status === 'stopped'
                  ? <CompanyAIOutput
                    key={message.id}
                    agentName={assistantName}
                    status="stopped"
                    title={message.output?.title}
                    lead={message.output?.lead}
                    annotation={message.output?.annotation}
                    tags={message.output?.tags}
                    thought={message.output?.thought}
                    media={message.output?.media}
                    onCopy={() => appMessage.success('已复制智能体结果')}
                    onRegenerate={() => regenerate(message.id)}
                    onFeedback={(feedback) => feedback && appMessage.success(feedback === 'like' ? '已标记为有帮助' : '已提交改进反馈')}
                  >{message.output?.content}</CompanyAIOutput>
                : message.status === 'error'
                  ? <CompanyAIOutput key={message.id} agentName={assistantName} status="error" errorText={message.errorText} onRegenerate={() => regenerate(message.id)} />
                  : <CompanyAIOutput
                    key={message.id}
                    agentName={assistantName}
                    title={message.output?.title}
                    lead={message.output?.lead}
                    annotation={message.output?.annotation}
                    tags={message.output?.tags}
                    thought={message.output?.thought}
                    media={message.output?.media}
                    onCopy={() => appMessage.success('已复制智能体结果')}
                    onRegenerate={() => regenerate(message.id)}
                    onFeedback={(feedback) => feedback && appMessage.success(feedback === 'like' ? '已标记为有帮助' : '已提交改进反馈')}
                  >{message.output?.content}</CompanyAIOutput>)}
          </div>
        </div>}

        <div className="company-ai-workspace__sender">
          <CompanySuperSender
            {...senderProps}
            value={value}
            loading={generating}
            onChange={setValue}
            onSubmit={submit}
            onStop={stopGeneration}
          />
        </div>
      </main>

      <aside className="company-ai-workspace__summary" aria-label="任务详情">
        {!latestAssistant ? <div className="company-ai-workspace__summary-empty">
          <div className="company-ai-workspace__summary-visual"><CompanyIcon type={companyIcons.aiChat} /></div>
          <Text type="secondary">暂无任务信息，请开始任务</Text>
        </div> : latestAssistant.status === 'queued' ? <div className="company-ai-workspace__summary-empty">
          <CompanyLoadingRing size={24} />
          <Text type="secondary">任务已接收，正在进入对话</Text>
        </div> : latestAssistant.status === 'generating' ? <div className="company-ai-workspace__summary-progress">
          <section className="company-ai-workspace__inspector-section">
            <div className="company-ai-workspace__summary-heading"><Text strong>进度</Text></div>
            <div className="company-ai-workspace__progress-title"><CompanyIcon type={companyIcons.task} /><Text strong>{messages.find((message) => message.role === 'user')?.content ?? '任务执行中'}</Text><span>进行中</span></div>
            <ol className="company-ai-workspace__progress-steps">
              {(latestAssistant.progress?.tasks ?? []).map((task) => <li key={task.id} data-status={task.status}>
                <span className="company-ai-workspace__step-status">{task.status === 'running' ? <CompanyLoadingRing size={18} /> : task.status === 'done' ? <CompanyIcon type={companyIcons.success} /> : <i />}</span>
                <span>{task.status === 'running' ? task.runningTitle ?? task.title : task.status === 'done' ? task.completedTitle ?? task.title : task.title}</span>
              </li>)}
            </ol>
          </section>
        </div> : latestAssistant.status === 'stopped' ? <div className="company-ai-workspace__summary-progress">
          <section className="company-ai-workspace__inspector-section">
            <div className="company-ai-workspace__summary-heading"><Text strong>进度</Text></div>
            <div className="company-ai-workspace__progress-title"><CompanyIcon type={companyIcons.task} /><Text strong>{summary?.title ?? '任务已停止'}</Text><span>已停止</span></div>
            <ol className="company-ai-workspace__progress-steps">
              {summary?.progress?.steps.map((step) => <li key={step.id} data-status={step.status}>
                <span className="company-ai-workspace__step-status"><CompanyIcon type={companyIcons.success} /></span>
                <span>{step.title}</span>
              </li>)}
            </ol>
          </section>
        </div> : latestAssistant.status === 'error' ? <div className="company-ai-workspace__summary-empty">
          <CompanyIcon type={companyIcons.warning} />
          <Text type="secondary">任务未完成，暂未生成详情</Text>
        </div> : <div className="company-ai-workspace__summary-content">
          <section className="company-ai-workspace__inspector-section">
            <div className="company-ai-workspace__summary-heading"><Text strong>进度</Text></div>
            <div className="company-ai-workspace__progress-title"><CompanyIcon type={companyIcons.task} /><Text strong>{summary?.title ?? '任务已完成'}</Text><span>{summary?.progress?.statusLabel ?? '已完成'}</span></div>
            <ol className="company-ai-workspace__progress-steps">
              {summary?.progress?.steps.map((step) => <li key={step.id} data-status={step.status}>
                <span className="company-ai-workspace__step-status">{step.status === 'running' ? <CompanyLoadingRing size={18} /> : step.status === 'error' ? <CompanyIcon type={companyIcons.warning} /> : step.status === 'done' ? <CompanyIcon type={companyIcons.success} /> : <i />}</span>
                <span>{step.title}</span>
              </li>)}
            </ol>
            {summary?.items && <dl>{summary.items.map((item) => <div key={item.key} data-tone={item.tone ?? 'default'}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>)}</dl>}
          </section>
          {summary?.findings && summary.findings.length > 0 && <section className="company-ai-workspace__inspector-section">
            <div className="company-ai-workspace__summary-heading"><Text strong>发现</Text></div>
            <ol className="company-ai-workspace__findings">
              {summary.findings.map((finding) => <li key={finding.id} data-tone={finding.tone ?? 'default'}>
                <i />
                <div><span><strong>{finding.title}</strong>{finding.meta && <small>（{finding.meta}）</small>}</span>{finding.detail && <p>{finding.detail}</p>}</div>
              </li>)}
            </ol>
          </section>}
          {summary?.files && summary.files.length > 0 && <section className="company-ai-workspace__inspector-section">
            <div className="company-ai-workspace__summary-heading"><Text strong>文件</Text></div>
            <div className="company-ai-workspace__files">{summary.files.map((file) => <div className="company-ai-workspace__file" key={file.id}>
              <SuperSenderFileIcon type={file.fileType ?? 'unknown'} />
              <span><strong title={file.name}>{file.name}</strong>{file.size && <small>{file.size}</small>}</span>
              <Tooltip title="下载"><Button type="text" aria-label={`下载 ${file.name}`} icon={<CompanyIcon type={companyIcons.download} />} /></Tooltip>
            </div>)}</div>
          </section>}
        </div>}
      </aside>
    </div>
  </div>;
}
