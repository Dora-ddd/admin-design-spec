import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Sender } from '@ant-design/x';
import { Button, Divider, Dropdown, Tooltip, Upload } from 'antd';
import type { MenuProps } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { SuperSenderFileIcon, inferSuperSenderFileType } from './SuperSenderFileIcon';
import type { SuperSenderFileType } from './SuperSenderFileIcon';
import './company-super-sender.css';

export type { SuperSenderFileType } from './SuperSenderFileIcon';

const mcpIconUrl = new URL('./assets/MCP.svg', import.meta.url).href;

export type SuperSenderOption = {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SuperSenderAttachmentStatus = 'done' | 'uploading' | 'error';

export type SuperSenderAttachment = {
  id: string;
  name: string;
  size?: string;
  status?: SuperSenderAttachmentStatus;
  progress?: number;
  fileType?: SuperSenderFileType;
};

export type SuperSenderQuote = {
  id?: string;
  text: string;
};

export type SuperSenderSkillSlot = {
  key: string;
  placeholder: string;
  defaultValue?: string;
  options?: SuperSenderOption[];
};

export type SuperSenderSkill = {
  key: string;
  label: string;
  prompt?: string;
  slots?: SuperSenderSkillSlot[];
};

export type SuperSenderFeatures = {
  searchEngine: boolean;
  agent: boolean;
  mcp: boolean;
  model: boolean;
  deepThinking: boolean;
  webSearch: boolean;
  maximize: boolean;
  knowledgeBase: boolean;
  screenshot: boolean;
  imageUpload: boolean;
  attachmentUpload: boolean;
  voice: boolean;
};

export type SuperSenderAction = 'maximize' | 'knowledgeBase' | 'screenshot' | 'imageUpload' | 'attachmentUpload' | 'voice';
type SuperSenderToggleKey = 'deepThinking' | 'webSearch' | 'knowledgeBase';
export type SuperSenderUploadKind = 'image' | 'attachment';

export type SuperSenderSubmitPayload = {
  value: string;
  agentKey: string;
  searchEngineKey: string;
  mcpKeys: string[];
  modelKey: string;
  deepThinking: boolean;
  webSearch: boolean;
  knowledgeBase: boolean;
  voice: boolean;
  quote?: SuperSenderQuote;
  attachments: SuperSenderAttachment[];
  skill?: SuperSenderSkill;
  skillValues: Record<string, string>;
};

export type CompanySuperSenderProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: CSSProperties;
  minRows?: number;
  maxRows?: number;
  quote?: SuperSenderQuote;
  attachments?: SuperSenderAttachment[];
  defaultAttachments?: SuperSenderAttachment[];
  features?: Partial<SuperSenderFeatures>;
  searchEngineOptions?: SuperSenderOption[];
  searchEngineKey?: string;
  defaultSearchEngineKey?: string;
  agentOptions?: SuperSenderOption[];
  agentKey?: string;
  defaultAgentKey?: string;
  mcpOptions?: SuperSenderOption[];
  mcpKeys?: string[];
  defaultMcpKeys?: string[];
  modelOptions?: SuperSenderOption[];
  modelKey?: string;
  defaultModelKey?: string;
  deepThinking?: boolean;
  defaultDeepThinking?: boolean;
  webSearch?: boolean;
  defaultWebSearch?: boolean;
  skill?: SuperSenderSkill;
  voiceIcon?: ReactNode;
  onChange?: (value: string) => void;
  onSubmit?: (payload: SuperSenderSubmitPayload) => void | Promise<void>;
  onStop?: () => void;
  onQuoteRemove?: (quote: SuperSenderQuote) => void;
  onAttachmentsChange?: (attachments: SuperSenderAttachment[]) => void;
  onRemoveAttachment?: (attachment: SuperSenderAttachment) => void;
  onRetryAttachment?: (attachment: SuperSenderAttachment) => SuperSenderAttachment | void | Promise<SuperSenderAttachment | void>;
  onUpload?: (file: File, kind: SuperSenderUploadKind) => SuperSenderAttachment | void | Promise<SuperSenderAttachment | void>;
  onSearchEngineChange?: (key: string) => void;
  onAgentChange?: (key: string) => void;
  onMcpChange?: (keys: string[]) => void;
  onModelChange?: (key: string) => void;
  onDeepThinkingChange?: (enabled: boolean) => void;
  onWebSearchChange?: (enabled: boolean) => void;
  onSkillRemove?: (skill: SuperSenderSkill) => void;
  onSkillSlotChange?: (key: string, value: string) => void;
  onAction?: (action: SuperSenderAction, enabled?: boolean) => void;
};

const defaultFeatures: SuperSenderFeatures = {
  searchEngine: false,
  agent: true,
  mcp: true,
  model: false,
  deepThinking: true,
  webSearch: true,
  maximize: false,
  knowledgeBase: true,
  screenshot: true,
  imageUpload: true,
  attachmentUpload: true,
  voice: false,
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function useControllableState<T>(controlled: T | undefined, initialValue: T, onChange?: (value: T) => void) {
  const [internal, setInternal] = useState(initialValue);
  const value = controlled === undefined ? internal : controlled;
  const update = (next: T) => {
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
  };
  return [value, update] as const;
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))}KB`;
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

export function CompanySuperSender({
  value: controlledValue,
  defaultValue = '',
  placeholder = '请输入...',
  disabled = false,
  loading,
  className,
  style,
  minRows = 2,
  maxRows = 12,
  quote,
  attachments: controlledAttachments,
  defaultAttachments = [],
  features: featureOverrides,
  searchEngineOptions = [],
  searchEngineKey,
  defaultSearchEngineKey,
  agentOptions = [],
  agentKey,
  defaultAgentKey,
  mcpOptions = [],
  mcpKeys,
  defaultMcpKeys = [],
  modelOptions = [],
  modelKey,
  defaultModelKey,
  deepThinking,
  defaultDeepThinking = false,
  webSearch,
  defaultWebSearch = false,
  skill,
  voiceIcon,
  onChange,
  onSubmit,
  onStop,
  onQuoteRemove,
  onAttachmentsChange,
  onRemoveAttachment,
  onRetryAttachment,
  onUpload,
  onSearchEngineChange,
  onAgentChange,
  onMcpChange,
  onModelChange,
  onDeepThinkingChange,
  onWebSearchChange,
  onSkillRemove,
  onSkillSlotChange,
  onAction,
}: CompanySuperSenderProps) {
  const features = useMemo(() => ({ ...defaultFeatures, ...featureOverrides }), [featureOverrides]);
  const [senderValue, setSenderValue] = useControllableState(controlledValue, defaultValue, onChange);
  const [attachments, setAttachments] = useControllableState(controlledAttachments, defaultAttachments, onAttachmentsChange);
  const [selectedSearchEngine, setSelectedSearchEngine] = useControllableState(searchEngineKey, defaultSearchEngineKey ?? searchEngineOptions[0]?.key ?? '', onSearchEngineChange);
  const [selectedAgent, setSelectedAgent] = useControllableState(agentKey, defaultAgentKey ?? agentOptions[0]?.key ?? '', onAgentChange);
  const [selectedMcpKeys, setSelectedMcpKeys] = useControllableState(mcpKeys, defaultMcpKeys, onMcpChange);
  const [selectedModel, setSelectedModel] = useControllableState(modelKey, defaultModelKey ?? modelOptions[0]?.key ?? '', onModelChange);
  const [deepThinkingEnabled, setDeepThinkingEnabled] = useControllableState(deepThinking, defaultDeepThinking, onDeepThinkingChange);
  const [webSearchEnabled, setWebSearchEnabled] = useControllableState(webSearch, defaultWebSearch, onWebSearchChange);
  const [quoteVisible, setQuoteVisible] = useState(Boolean(quote));
  const [skillVisible, setSkillVisible] = useState(Boolean(skill));
  const [skillValues, setSkillValues] = useState<Record<string, string>>(() => Object.fromEntries(skill?.slots?.map((slot) => [slot.key, slot.defaultValue ?? '']) ?? []));
  const [knowledgeBaseEnabled, setKnowledgeBaseEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [hoverSuppressedToggle, setHoverSuppressedToggle] = useState<SuperSenderToggleKey | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [canScrollAttachments, setCanScrollAttachments] = useState(false);
  const [attachmentScrollEnd, setAttachmentScrollEnd] = useState(false);
  const attachmentListRef = useRef<HTMLDivElement>(null);
  const attachmentsRef = useRef(attachments);
  const isLoading = loading ?? submitting;

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => setQuoteVisible(Boolean(quote)), [quote?.id, quote?.text]);
  useEffect(() => {
    setSkillVisible(Boolean(skill));
    setSkillValues(Object.fromEntries(skill?.slots?.map((slot) => [slot.key, slot.defaultValue ?? '']) ?? []));
  }, [skill?.key]);

  useEffect(() => {
    if (!fullscreen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [fullscreen]);

  useEffect(() => {
    const element = attachmentListRef.current;
    if (!element) return undefined;
    const update = () => {
      setCanScrollAttachments(element.scrollWidth > element.clientWidth + 2);
      setAttachmentScrollEnd(element.scrollLeft + element.clientWidth >= element.scrollWidth - 2);
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [attachments.length, quoteVisible, fullscreen]);

  const selectedAgentOption = agentOptions.find(({ key }) => key === selectedAgent);
  const selectedSearchOption = searchEngineOptions.find(({ key }) => key === selectedSearchEngine);
  const selectedModelOption = modelOptions.find(({ key }) => key === selectedModel);
  const selectedMcpOptions = selectedMcpKeys.map((key) => mcpOptions.find((option) => option.key === key)).filter((option): option is SuperSenderOption => Boolean(option));
  const mcpLabel = selectedMcpOptions.length === 0 ? 'MCP' : selectedMcpOptions.length === 1 ? selectedMcpOptions[0].label : `${selectedMcpOptions.length}个MCP`;

  const optionMenuItems = (options: SuperSenderOption[]): MenuProps['items'] => options.map((option) => ({
    key: option.key,
    disabled: option.disabled,
    label: <span className="company-super-sender-menu-option">{option.icon}<span>{option.label}</span></span>,
  }));

  const toggleMcp = (key: string) => {
    const next = selectedMcpKeys.includes(key) ? selectedMcpKeys.filter((item) => item !== key) : [...selectedMcpKeys, key];
    setSelectedMcpKeys(next);
  };

  const updateAttachments = (next: SuperSenderAttachment[]) => {
    attachmentsRef.current = next;
    setAttachments(next);
  };
  const updateAttachment = (id: string, patch: Partial<SuperSenderAttachment>) => updateAttachments(attachmentsRef.current.map((item) => item.id === id ? { ...item, ...patch } : item));

  const removeAttachment = (attachment: SuperSenderAttachment) => {
    updateAttachments(attachmentsRef.current.filter((item) => item.id !== attachment.id));
    onRemoveAttachment?.(attachment);
  };

  const retryAttachment = async (attachment: SuperSenderAttachment) => {
    updateAttachment(attachment.id, { status: 'uploading', progress: 0 });
    try {
      const next = await onRetryAttachment?.(attachment);
      updateAttachment(attachment.id, next ?? { status: 'done', progress: 100 });
    } catch {
      updateAttachment(attachment.id, { status: 'error' });
    }
  };

  const uploadFile = async (file: File, kind: SuperSenderUploadKind) => {
    const pending: SuperSenderAttachment = {
      id: `${kind}-${Date.now()}-${file.name}`,
      name: file.name,
      size: formatFileSize(file.size),
      status: 'uploading',
      progress: 0,
      fileType: inferSuperSenderFileType(file.name),
    };
    updateAttachments([...attachmentsRef.current, pending]);
    onAction?.(kind === 'image' ? 'imageUpload' : 'attachmentUpload');
    try {
      const uploaded = await onUpload?.(file, kind);
      const completed = uploaded ?? { ...pending, status: 'done' as const, progress: 100 };
      updateAttachments(attachmentsRef.current.map((item) => item.id === pending.id ? completed : item));
    } catch {
      updateAttachments(attachmentsRef.current.map((item) => item.id === pending.id ? { ...pending, status: 'error' } : item));
    }
  };

  const selectSkillSlot = (key: string, value: string) => {
    setSkillValues((current) => ({ ...current, [key]: value }));
    onSkillSlotChange?.(key, value);
  };

  const removeQuote = () => {
    if (!quote) return;
    setQuoteVisible(false);
    onQuoteRemove?.(quote);
  };

  const removeSkill = () => {
    if (!skill) return;
    setSkillVisible(false);
    onSkillRemove?.(skill);
  };

  const toggleAction = (action: 'knowledgeBase' | 'voice', current: boolean, update: (value: boolean) => void) => {
    const next = !current;
    update(next);
    onAction?.(action, next);
  };

  const toggleCapability = (key: SuperSenderToggleKey, current: boolean, update: (value: boolean) => void, pointerClick: boolean) => {
    const next = !current;
    update(next);
    setHoverSuppressedToggle(!next && pointerClick ? key : null);
    if (key === 'knowledgeBase') onAction?.('knowledgeBase', next);
  };

  const toggleCapabilityClass = (key: SuperSenderToggleKey, selected: boolean) => classes(
    'company-super-sender-toggle',
    selected && 'is-selected',
    hoverSuppressedToggle === key && 'is-hover-suppressed',
  );

  const releaseToggleHover = (key: SuperSenderToggleKey) => {
    setHoverSuppressedToggle((current) => current === key ? null : current);
  };

  const toggleFullscreen = () => {
    const next = !fullscreen;
    setFullscreen(next);
    onAction?.('maximize', next);
  };

  const submit = async (text = senderValue) => {
    const content = text.trim();
    if (!content || disabled || isLoading) return;
    const payload: SuperSenderSubmitPayload = {
      value: content,
      agentKey: selectedAgent,
      searchEngineKey: selectedSearchEngine,
      mcpKeys: selectedMcpKeys,
      modelKey: selectedModel,
      deepThinking: deepThinkingEnabled,
      webSearch: webSearchEnabled,
      knowledgeBase: knowledgeBaseEnabled,
      voice: voiceEnabled,
      quote: quoteVisible ? quote : undefined,
      attachments,
      skill: skillVisible ? skill : undefined,
      skillValues,
    };
    try {
      const result = onSubmit?.(payload);
      if (result && typeof result.then === 'function') {
        setSubmitting(true);
        await result;
      }
      setSenderValue('');
    } finally {
      setSubmitting(false);
    }
  };

  const stop = () => {
    setSubmitting(false);
    onStop?.();
  };

  const header = quoteVisible || attachments.length > 0 || (skill && skillVisible) ? <div className="company-super-sender-header">
    {quoteVisible && quote && <div className="company-super-sender-quote">
      <span title={quote.text}>{quote.text}</span>
      <Tooltip title="移除引用"><Button type="text" aria-label="移除引用" icon={<CompanyIcon type={companyIcons.closeCircle} />} onClick={removeQuote} /></Tooltip>
    </div>}
    {attachments.length > 0 && <div className="company-super-sender-attachments" aria-label="已添加附件">
      <div ref={attachmentListRef} className="company-super-sender-attachment-list" role="list">
        {attachments.map((attachment) => {
          const status = attachment.status ?? 'done';
          return <div className={`company-super-sender-attachment status-${status}`} role="listitem" key={attachment.id}>
            <SuperSenderFileIcon type={attachment.fileType ?? inferSuperSenderFileType(attachment.name)} />
            <div className="company-super-sender-attachment-copy">
              <span className="company-super-sender-attachment-name" title={attachment.name}>{attachment.name}</span>
              {status === 'error' ? <span className="company-super-sender-attachment-error"><span>上传失败</span><button type="button" disabled={disabled} onClick={() => void retryAttachment(attachment)}>重试</button></span>
                : <span className="company-super-sender-attachment-meta">{status === 'uploading' ? `上传中...${attachment.progress ?? 0}%` : attachment.size}</span>}
            </div>
            <button type="button" className="company-super-sender-attachment-remove" disabled={disabled} aria-label={`移除附件 ${attachment.name}`} onClick={() => removeAttachment(attachment)}><CompanyIcon type={companyIcons.closeCircle} /></button>
          </div>;
        })}
      </div>
      {canScrollAttachments && !attachmentScrollEnd && <div className="company-super-sender-attachment-more">
        <button type="button" aria-label="查看更多附件" onClick={() => attachmentListRef.current?.scrollBy({ left: 208, behavior: 'smooth' })}><CompanyIcon type={companyIcons.down} /></button>
      </div>}
    </div>}
    {skill && skillVisible && <div className="company-super-sender-skill">
      <span className="company-super-sender-skill-chip"><CompanyIcon type={companyIcons.aiAgent} /><strong>{skill.label}</strong><button type="button" aria-label={`移除${skill.label}`} onClick={removeSkill}><CompanyIcon type={companyIcons.closeCircle} /></button></span>
      {(skill.prompt || skill.slots?.length) && <div className="company-super-sender-skill-prompt">
        {skill.prompt && <span>{skill.prompt}</span>}
        {skill.slots?.map((slot) => {
          const selected = skillValues[slot.key];
          return slot.options?.length ? <Dropdown key={slot.key} trigger={['click']} menu={{ items: optionMenuItems(slot.options), selectedKeys: selected ? [selected] : [], selectable: true, onClick: ({ key }) => selectSkillSlot(slot.key, key) }}>
            <Button type="text" className={classes('company-super-sender-slot', selected && 'selected')}>{slot.options.find(({ key }) => key === selected)?.label ?? slot.placeholder}<CompanyIcon className="company-super-sender-arrow" type={companyIcons.down} /></Button>
          </Dropdown> : <span className="company-super-sender-slot-input" key={slot.key}>{selected || slot.placeholder}</span>;
        })}
      </div>}
    </div>}
  </div> : undefined;

  return <Sender
    className={classes('company-super-sender', quoteVisible && 'has-quote', attachments.length > 0 && 'has-attachments', skillVisible && skill && 'has-skill', fullscreen && 'is-fullscreen', className)}
    style={style}
    value={senderValue}
    disabled={disabled}
    onChange={setSenderValue}
    onSubmit={submit}
    autoSize={{ minRows, maxRows }}
    suffix={false}
    header={header}
    footer={() => <div className="company-super-sender-footer">
      <div className="company-super-sender-tools">
        {features.searchEngine && searchEngineOptions.length > 0 && <Tooltip title={selectedSearchOption?.label ?? '搜索引擎'}><Dropdown trigger={['click']} menu={{ items: optionMenuItems(searchEngineOptions), selectedKeys: [selectedSearchEngine], selectable: true, onClick: ({ key }) => setSelectedSearchEngine(key) }}>
          <Button className="company-super-sender-tool tool-search" type="text" disabled={disabled} aria-label={`当前搜索引擎：${selectedSearchOption?.label ?? '未选择'}`}><span className="company-super-sender-leading-icon">{selectedSearchOption?.icon ?? <CompanyIcon type={companyIcons.search} />}</span><span className="company-super-sender-tool-label">{selectedSearchOption?.label ?? '搜索引擎'}</span><CompanyIcon className="company-super-sender-arrow" type={companyIcons.down} /></Button>
        </Dropdown></Tooltip>}
        {features.agent && agentOptions.length > 0 && <Tooltip title={selectedAgentOption?.label ?? '智能体'}><Dropdown trigger={['click']} menu={{ items: optionMenuItems(agentOptions), selectedKeys: [selectedAgent], selectable: true, onClick: ({ key }) => setSelectedAgent(key) }}>
          <Button className="company-super-sender-tool tool-agent" type="text" disabled={disabled} aria-label={`当前智能体：${selectedAgentOption?.label ?? '未选择'}`} icon={selectedAgentOption?.icon ?? <CompanyIcon type={companyIcons.aiAgent} />}><span className="company-super-sender-tool-label">{selectedAgentOption?.label ?? '智能体'}</span><CompanyIcon className="company-super-sender-arrow" type={companyIcons.down} /></Button>
        </Dropdown></Tooltip>}
        {features.mcp && mcpOptions.length > 0 && <Tooltip title={mcpLabel}><Dropdown trigger={['click']} menu={{ items: optionMenuItems(mcpOptions), selectedKeys: selectedMcpKeys, selectable: true, multiple: true, onClick: ({ key }) => toggleMcp(key) }}>
          <Button className="company-super-sender-tool tool-mcp" type="text" disabled={disabled} aria-label={`当前 MCP：${mcpLabel}`}>
            {selectedMcpOptions.some(({ icon }) => icon)
              ? <span className="company-super-sender-mcp-icons">{selectedMcpOptions.filter(({ icon }) => icon).slice(0, 3).map((option) => <span key={option.key}>{option.icon}</span>)}</span>
              : <span className="company-super-sender-leading-icon company-super-sender-mcp-mark" style={{ '--company-super-sender-mcp-icon': `url("${mcpIconUrl}")` } as CSSProperties} />}
            <span className="company-super-sender-tool-label">{mcpLabel}</span><CompanyIcon className="company-super-sender-arrow" type={companyIcons.down} />
          </Button>
        </Dropdown></Tooltip>}
        {features.model && modelOptions.length > 0 && <Tooltip title={selectedModelOption?.label ?? '选择大模型'}><Dropdown trigger={['click']} menu={{ items: optionMenuItems(modelOptions), selectedKeys: [selectedModel], selectable: true, onClick: ({ key }) => setSelectedModel(key) }}>
          <Button className="company-super-sender-tool tool-model" type="text" disabled={disabled} aria-label={`当前模型：${selectedModelOption?.label ?? '未选择'}`}>{selectedModelOption?.icon ?? <span className="company-super-sender-model-mark">AI</span>}<span className="company-super-sender-tool-label">{selectedModelOption?.label ?? '选择大模型'}</span><CompanyIcon className="company-super-sender-arrow" type={companyIcons.down} /></Button>
        </Dropdown></Tooltip>}
        {features.deepThinking && <Tooltip title="深度思考"><Button type="text" disabled={disabled} icon={<CompanyIcon type={companyIcons.deepThink} />} className={classes('company-super-sender-tool', 'tool-deep-thinking', toggleCapabilityClass('deepThinking', deepThinkingEnabled))} aria-label={`${deepThinkingEnabled ? '关闭' : '开启'}深度思考`} aria-pressed={deepThinkingEnabled} onMouseLeave={() => releaseToggleHover('deepThinking')} onClick={(event) => toggleCapability('deepThinking', deepThinkingEnabled, setDeepThinkingEnabled, event.detail > 0)}><span className="company-super-sender-tool-label">深度思考</span></Button></Tooltip>}
        {features.webSearch && <Tooltip title="联网搜索"><Button type="text" disabled={disabled} icon={<CompanyIcon type={companyIcons.webSearch} />} className={classes('company-super-sender-tool', 'tool-web-search', toggleCapabilityClass('webSearch', webSearchEnabled))} aria-label={`${webSearchEnabled ? '关闭' : '开启'}联网搜索`} aria-pressed={webSearchEnabled} onMouseLeave={() => releaseToggleHover('webSearch')} onClick={(event) => toggleCapability('webSearch', webSearchEnabled, setWebSearchEnabled, event.detail > 0)}><span className="company-super-sender-tool-label">联网搜索</span></Button></Tooltip>}
      </div>
      <div className="company-super-sender-actions">
        {features.maximize && <Tooltip title={fullscreen ? '退出最大化' : '最大化'}><Button type="text" disabled={disabled} className={classes('company-super-sender-action-maximize', fullscreen && 'active')} aria-label={fullscreen ? '退出最大化' : '最大化'} aria-pressed={fullscreen} icon={<CompanyIcon type={companyIcons.fullscreen} />} onClick={toggleFullscreen} /></Tooltip>}
        {features.knowledgeBase && <Tooltip title="知识库"><Button type="text" disabled={disabled} className={classes('company-super-sender-action-knowledge', toggleCapabilityClass('knowledgeBase', knowledgeBaseEnabled))} aria-label={`${knowledgeBaseEnabled ? '关闭' : '开启'}知识库`} aria-pressed={knowledgeBaseEnabled} icon={<CompanyIcon type={companyIcons.knowledgeBase} />} onMouseLeave={() => releaseToggleHover('knowledgeBase')} onClick={(event) => toggleCapability('knowledgeBase', knowledgeBaseEnabled, setKnowledgeBaseEnabled, event.detail > 0)} /></Tooltip>}
        {features.screenshot && <Tooltip title="截图"><Button className="company-super-sender-action-screenshot" type="text" disabled={disabled} aria-label="截图" icon={<CompanyIcon type={companyIcons.screenshot} />} onClick={() => onAction?.('screenshot')} /></Tooltip>}
        {features.imageUpload && <Upload className="company-super-sender-upload-image" showUploadList={false} accept="image/*" beforeUpload={(file) => { void uploadFile(file, 'image'); return false; }}><Tooltip title="上传图片"><Button type="text" disabled={disabled} aria-label="上传图片" icon={<CompanyIcon type={companyIcons.uploadImage} />} /></Tooltip></Upload>}
        {features.attachmentUpload && <Upload className="company-super-sender-upload-attachment" showUploadList={false} beforeUpload={(file) => { void uploadFile(file, 'attachment'); return false; }}><Tooltip title="上传附件"><Button type="text" disabled={disabled} aria-label="上传附件" icon={<CompanyIcon type={companyIcons.attachment} />} /></Tooltip></Upload>}
        {features.voice && <Tooltip title="语音输入"><Button type="text" disabled={disabled} className={classes('company-super-sender-voice', 'company-super-sender-action-voice', voiceEnabled && 'active')} aria-label="语音输入" aria-pressed={voiceEnabled} icon={voiceIcon ?? <CompanyIcon type={companyIcons.voice} />} onClick={() => toggleAction('voice', voiceEnabled, setVoiceEnabled)} /></Tooltip>}
        <Divider orientation="vertical" />
        {isLoading ? <Tooltip title="停止回答"><Button className="company-super-sender-stop" type="text" aria-label="停止回答" onClick={stop}><span /></Button></Tooltip>
          : <Tooltip title={senderValue.trim() ? '发送' : '请输入内容'}><Button className="company-super-sender-send" type="text" aria-label="发送" disabled={disabled || !senderValue.trim()} icon={<span className="company-super-sender-send-visual" aria-hidden="true" />} onClick={() => void submit()} /></Tooltip>}
      </div>
    </div>}
    placeholder={placeholder}
  />;
}
