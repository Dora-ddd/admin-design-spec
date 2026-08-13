import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Button, Tooltip } from 'antd';
import { ChartRenderer, type ChartSpec } from '@company/charts';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { CompanyLoadingRing } from '../loading';
import { SuperSenderFileIcon, inferSuperSenderFileType } from '../super-sender/SuperSenderFileIcon';
import type { SuperSenderFileType } from '../super-sender/SuperSenderFileIcon';
import './company-ai-output.css';

export type AIOutputStatus = 'ready' | 'loading' | 'error' | 'stopped';
export type AIOutputFeedback = 'like' | 'dislike' | null;

export type AIOutputWorkflowSection = {
  key: string;
  title?: string;
  content: ReactNode;
  kind?: 'text' | 'code';
};

export type AIOutputWorkflowStep = {
  id: string;
  title: string;
  runningTitle?: string;
  completedTitle?: string;
  status: 'done' | 'running' | 'pending' | 'error';
  badge?: { label: string; tone?: 'default' | 'success' | 'warning' | 'danger' };
  sections?: AIOutputWorkflowSection[];
};

export type AIOutputMedia =
  | { type: 'file'; name: string; size?: string; fileType?: SuperSenderFileType }
  | { type: 'audio'; name: string; duration?: string }
  | { type: 'image'; images: Array<{ id: string; src: string; alt: string }> }
  | { type: 'video'; poster: string; duration?: string }
  | { type: 'table'; columns: string[]; rows: Array<Array<string | number>> }
  | { type: 'chart'; spec: ChartSpec }
  | { type: 'chart'; title?: string; values: Array<{ label: string; value: number; secondary?: number }> }
  | { type: 'code'; language: string; code: string }
  | {
    type: 'task';
    title?: string;
    tasks: Array<{
      id: string;
      title: string;
      kind?: 'tool' | 'process' | 'complete';
      toolName?: string;
      detail?: string;
      tags?: AIOutputTag[];
      status: 'done' | 'running' | 'pending' | 'error';
    }>;
  }
  | {
    type: 'workflow';
    steps: AIOutputWorkflowStep[];
  };

export type AIOutputTag = {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
};

export type AIOutputThought = {
  title?: string;
  content: ReactNode;
  status?: 'thinking' | 'complete';
  defaultExpanded?: boolean;
};

export type CompanyAIOutputProps = {
  title?: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  annotation?: ReactNode;
  tags?: AIOutputTag[];
  thought?: AIOutputThought;
  media?: AIOutputMedia;
  status?: AIOutputStatus;
  errorText?: ReactNode;
  stoppedText?: ReactNode;
  showAvatar?: boolean;
  agentName?: ReactNode;
  showActions?: boolean;
  className?: string;
  style?: CSSProperties;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onFeedback?: (feedback: AIOutputFeedback) => void;
  onDownload?: (name: string) => void;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

async function writeClipboard(value: string) {
  try {
    await navigator.clipboard?.writeText(value);
  } catch {
    // Embedded previews can deny clipboard access; callbacks still report the action.
  }
}

function IconAction({ label, icon, active = false, onClick }: { label: string; icon: string; active?: boolean; onClick?: () => void }) {
  return <Tooltip title={label}>
    <Button
      type="text"
      className={classes('company-ai-output__icon-action', active && 'is-active')}
      aria-label={label}
      icon={<CompanyIcon type={icon} />}
      onClick={onClick}
    />
  </Tooltip>;
}

function AIOutputFile({ media, onDownload }: { media: Extract<AIOutputMedia, { type: 'file' }>; onDownload?: (name: string) => void }) {
  return <div className="company-ai-output__file">
    <SuperSenderFileIcon type={media.fileType ?? inferSuperSenderFileType(media.name)} />
    <span className="company-ai-output__file-copy">
      <span className="company-ai-output__file-name" title={media.name}>{media.name}</span>
      {media.size && <span className="company-ai-output__file-size">{media.size}</span>}
    </span>
    <IconAction label="下载" icon={companyIcons.download} onClick={() => onDownload?.(media.name)} />
  </div>;
}

function AIOutputAudio({ media, onDownload }: { media: Extract<AIOutputMedia, { type: 'audio' }>; onDownload?: (name: string) => void }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(12);

  return <div className="company-ai-output__audio">
    <div className="company-ai-output__media-title-row">
      <div className="company-ai-output__media-title">
        <SuperSenderFileIcon type="audio" />
        <span title={media.name}>{media.name}</span>
      </div>
      <IconAction label="下载音频" icon={companyIcons.download} onClick={() => onDownload?.(media.name)} />
    </div>
    <div className="company-ai-output__audio-player">
      <IconAction label={playing ? '停止' : '播放'} icon={playing ? companyIcons.stop : companyIcons.play} onClick={() => setPlaying(!playing)} />
      <span className="company-ai-output__audio-time"><strong>0:18</strong>/{media.duration ?? '02:30'}</span>
      <input aria-label="音频播放进度" type="range" min={0} max={100} value={progress} onChange={(event) => setProgress(Number(event.target.value))} />
      <IconAction label={muted ? '开启声音' : '关闭声音'} icon={muted ? companyIcons.volume : companyIcons.mute} onClick={() => setMuted(!muted)} />
    </div>
  </div>;
}

function AIOutputImages({ media, onDownload }: { media: Extract<AIOutputMedia, { type: 'image' }>; onDownload?: (name: string) => void }) {
  return <div className="company-ai-output__images">
    {media.images.map((item) => <figure key={item.id}>
      <img src={item.src} alt={item.alt} />
      <IconAction label="下载图片" icon={companyIcons.download} onClick={() => onDownload?.(item.alt)} />
    </figure>)}
  </div>;
}

function AIOutputVideo({ media }: { media: Extract<AIOutputMedia, { type: 'video' }> }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  return <div className="company-ai-output__video" style={{ backgroundImage: `url(${media.poster})` }}>
    <button type="button" className="company-ai-output__video-toggle" aria-label={playing ? '停止视频' : '播放视频'} onClick={() => setPlaying(!playing)}>
      <CompanyIcon type={playing ? companyIcons.stop : companyIcons.play} />
    </button>
    <div className="company-ai-output__video-controls">
      <span>{playing ? '0:18' : '0:01'}/{media.duration ?? '02:30'}</span>
      <span className="company-ai-output__video-progress"><i style={{ width: playing ? '24%' : '4%' }} /></span>
      <IconAction label={muted ? '开启声音' : '关闭声音'} icon={muted ? companyIcons.volume : companyIcons.mute} onClick={() => setMuted(!muted)} />
      <IconAction label="全屏" icon={companyIcons.fullscreen} />
    </div>
  </div>;
}

function AIOutputTable({ media }: { media: Extract<AIOutputMedia, { type: 'table' }> }) {
  return <div className="company-ai-output__table-wrap">
    <table>
      <thead><tr>{media.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
      <tbody>{media.rows.map((row, index) => <tr key={`${index}-${row.join('-')}`}>{row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function AIOutputChart({ media }: { media: Extract<AIOutputMedia, { type: 'chart' }> }) {
  const spec: ChartSpec = 'spec' in media ? media.spec : {
    type: 'grouped-column',
    title: media.title ?? '风险事件趋势',
    height: 280,
    data: media.values.flatMap((item) => [
      { label: item.label, category: '高危事件', value: item.value },
      { label: item.label, category: '已处置', value: item.secondary ?? 0 },
    ]),
    xField: 'label',
    yField: 'value',
    seriesField: 'category',
  };

  return <div className="company-ai-output__chart"><ChartRenderer spec={spec} /></div>;
}

function AIOutputCode({ media }: { media: Extract<AIOutputMedia, { type: 'code' }> }) {
  return <div className="company-ai-output__code">
    <div className="company-ai-output__code-head">
      <strong>{media.language}</strong>
      <IconAction label="复制代码" icon={companyIcons.copy} onClick={() => void writeClipboard(media.code)} />
    </div>
    <pre><code>{media.code}</code></pre>
  </div>;
}

function AIOutputTask({ media }: { media: Extract<AIOutputMedia, { type: 'task' }> }) {
  const completed = media.tasks.every((task) => task.status === 'done');
  const running = media.tasks.some((task) => task.status === 'running');
  const [expanded, setExpanded] = useState(!completed);
  const visible = !completed || expanded;

  useEffect(() => {
    if (completed) setExpanded(false);
    else if (running) setExpanded(true);
  }, [completed, running]);

  return <div className={classes('company-ai-output__task', running && 'is-running', completed && !expanded && 'is-collapsed')}>
    {completed ? <button type="button" className="company-ai-output__task-heading" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
      <span className="company-ai-output__task-heading-title"><CompanyIcon type={companyIcons.task} />已完成任务</span>
      <span className="company-ai-output__task-heading-action">{expanded ? '收起' : null}<CompanyIcon type={companyIcons.down} className={expanded ? 'is-expanded' : ''} /></span>
    </button> : <div className="company-ai-output__task-heading">
      <span className="company-ai-output__task-heading-title"><CompanyIcon type={companyIcons.task} />{media.title ?? '任务执行中...'}</span>
    </div>}
    {visible && <ol className="company-ai-output__task-list">
      {media.tasks.map((task, index) => <li key={task.id} data-kind={task.kind ?? 'process'} data-status={task.status} data-last={index === media.tasks.length - 1 || undefined}>
        <span className="company-ai-output__task-rail">
          <span className="company-ai-output__task-status">
            {task.status === 'running' ? <CompanyLoadingRing size={18} color="var(--company-text-tertiary, #8a9099)" />
              : task.status === 'error' ? <CompanyIcon type={companyIcons.warning} />
                : task.status === 'pending' ? <span className="company-ai-output__task-pending-dot" />
                : task.kind === 'process' ? <span className="company-ai-output__task-process-dot" />
                  : <CompanyIcon type={companyIcons.success} />}
          </span>
        </span>
        <span className="company-ai-output__task-copy">
          <span className="company-ai-output__task-line"><span>{task.title}</span>{task.toolName && <strong>{task.toolName}</strong>}</span>
          {task.tags && task.tags.length > 0 && <span className="company-ai-output__task-tags">{task.tags.map((tag) => <span key={tag.key}>{tag.icon}{tag.label}</span>)}</span>}
          {task.detail && <small>{task.detail}</small>}
        </span>
      </li>)}
    </ol>}
    {running && <span className="company-ai-output__task-fade" aria-hidden="true" />}
  </div>;
}

function AIOutputWorkflowStepCard({ step }: { step: AIOutputWorkflowStep }) {
  const [expanded, setExpanded] = useState(step.status === 'running');
  const running = step.status === 'running';
  const completed = step.status === 'done';
  const title = running ? step.runningTitle ?? `${step.title}中`
    : completed ? step.completedTitle ?? `已完成${step.title}`
      : step.title;

  useEffect(() => {
    setExpanded(running);
  }, [running]);

  return <section className={classes(
    'company-ai-output__workflow-step',
    expanded && 'is-expanded',
    running && 'is-running',
    completed && 'is-complete',
    step.status === 'error' && 'is-error',
  )}>
    <button
      type="button"
      className="company-ai-output__workflow-heading"
      aria-expanded={expanded}
      onClick={() => setExpanded((current) => !current)}
    >
      <span className="company-ai-output__workflow-title">
        {running ? <CompanyLoadingRing size={18} />
          : step.status === 'error' ? <CompanyIcon type={companyIcons.warning} />
            : <CompanyIcon type={companyIcons.deepThink} />}
        <strong>{title}</strong>
        {step.badge && <small data-tone={step.badge.tone ?? 'default'}>{step.badge.label}</small>}
      </span>
      <span className="company-ai-output__task-heading-action">
        {expanded ? '收起' : null}
        <CompanyIcon type={companyIcons.down} className={expanded ? 'is-expanded' : ''} />
      </span>
    </button>
    {expanded && step.sections && step.sections.length > 0 && <div className="company-ai-output__workflow-content">
      {step.sections.map((section) => {
        const plainText = section.kind !== 'code' && !section.title;
        return <section className={classes('company-ai-output__workflow-section', plainText && 'is-plain')} key={section.key}>
          {section.title && <div className="company-ai-output__workflow-section-title"><strong>{section.title}</strong></div>}
          {section.kind === 'code'
            ? <pre><code>{section.content}</code></pre>
            : <div className="company-ai-output__workflow-section-copy">{section.content}</div>}
        </section>;
      })}
    </div>}
  </section>;
}

function AIOutputWorkflow({ media }: { media: Extract<AIOutputMedia, { type: 'workflow' }> }) {
  const visibleSteps = media.steps.filter((step) => step.status !== 'pending');
  return <div className="company-ai-output__workflow">
    {visibleSteps.map((step) => <AIOutputWorkflowStepCard key={step.id} step={step} />)}
  </div>;
}

function AIOutputMediaRenderer({ media, onDownload }: { media: AIOutputMedia; onDownload?: (name: string) => void }) {
  switch (media.type) {
    case 'file': return <AIOutputFile media={media} onDownload={onDownload} />;
    case 'audio': return <AIOutputAudio media={media} onDownload={onDownload} />;
    case 'image': return <AIOutputImages media={media} onDownload={onDownload} />;
    case 'video': return <AIOutputVideo media={media} />;
    case 'table': return <AIOutputTable media={media} />;
    case 'chart': return <AIOutputChart media={media} />;
    case 'code': return <AIOutputCode media={media} />;
    case 'task': return <AIOutputTask media={media} />;
    case 'workflow': return <AIOutputWorkflow media={media} />;
  }
}

export function CompanyAIOutput({
  title,
  lead,
  children,
  annotation,
  tags = [],
  thought,
  media,
  status = 'ready',
  errorText = '加载失败，请重试',
  stoppedText = '已停止生成，可重新生成。',
  showAvatar = true,
  agentName = '中枢专家',
  showActions = true,
  className,
  style,
  onCopy,
  onRegenerate,
  onFeedback,
  onDownload,
}: CompanyAIOutputProps) {
  const [thoughtExpanded, setThoughtExpanded] = useState(thought?.defaultExpanded ?? false);
  const [feedback, setFeedback] = useState<AIOutputFeedback>(null);
  const thoughtThinking = thought?.status === 'thinking';
  const thoughtVisible = Boolean(thought && (thoughtThinking || thoughtExpanded));
  const processMedia = media && (media.type === 'task' || media.type === 'workflow');
  const hasGeneratedContent = title !== undefined || lead !== undefined || children !== undefined
    || annotation !== undefined || tags.length > 0 || thought !== undefined || media !== undefined;
  const showGeneratedContent = status === 'ready' || (status === 'stopped' && hasGeneratedContent);
  const showOutputActions = showActions && status !== 'loading';

  const setOutputFeedback = (next: Exclude<AIOutputFeedback, null>) => {
    const value = feedback === next ? null : next;
    setFeedback(value);
    onFeedback?.(value);
  };

  const copyOutput = async () => {
    const copyText = [title, lead, typeof children === 'string' ? children : ''].filter((value): value is string => typeof value === 'string').join('\n');
    if (copyText) await writeClipboard(copyText);
    onCopy?.();
  };

  return <article className={classes('company-ai-output', `status-${status}`, className)} style={style}>
    {showAvatar && <header className="company-ai-output__identity">
      <span className="company-ai-output__avatar">AI</span>
      <strong>{agentName}</strong>
    </header>}

    {thought && <section className={classes('company-ai-output__thought', thoughtThinking && 'is-thinking', !thoughtThinking && thoughtExpanded && 'is-expanded')}>
      {thoughtThinking ? <div className="company-ai-output__panel-toggle is-static">
        <span className="company-ai-output__thought-title"><CompanyIcon type={companyIcons.deepThink} />深度思考中...</span>
      </div> : <button type="button" className="company-ai-output__panel-toggle" aria-expanded={thoughtExpanded} onClick={() => setThoughtExpanded(!thoughtExpanded)}>
        <span className="company-ai-output__thought-title"><CompanyIcon type={companyIcons.deepThink} />{thought.title ?? '已完成思考'}</span>
        <span className="company-ai-output__thought-action">{thoughtExpanded ? '收起' : null}<CompanyIcon type={companyIcons.down} className={thoughtExpanded ? 'is-expanded' : ''} /></span>
      </button>}
      {thoughtVisible && <div className="company-ai-output__thought-copy">{thought.content}</div>}
      {thoughtThinking && <span className="company-ai-output__thought-fade" aria-hidden="true" />}
    </section>}

    {showGeneratedContent && processMedia && <section className={`company-ai-output__media type-${media.type}`}>
      <AIOutputMediaRenderer media={media} onDownload={onDownload} />
    </section>}

    <div className="company-ai-output__body">
      {status === 'loading' ? <div className="company-ai-output__loading"><CompanyLoadingRing size={20} strokeWidth={2} /><span>正在生成内容...</span></div>
        : status === 'error' ? <div className="company-ai-output__error">{errorText}</div>
          : status === 'stopped' && !hasGeneratedContent ? <div className="company-ai-output__stopped">{stoppedText}</div>
          : <>
            {(title || lead || children || annotation) && <section className="company-ai-output__copy">
              {title && <h3>{title}</h3>}
              {lead && <h4>{lead}</h4>}
              {children && <div className="company-ai-output__paragraph">{children}</div>}
              {annotation && <small>{annotation}</small>}
            </section>}
            {tags.length > 0 && <div className="company-ai-output__tags">{tags.map((tag) => <span key={tag.key}>{tag.icon}{tag.label}</span>)}</div>}
            {media && media.type !== 'task' && media.type !== 'workflow' && <section className={`company-ai-output__media type-${media.type}`}><AIOutputMediaRenderer media={media} onDownload={onDownload} /></section>}
          </>}
      {showOutputActions && <footer className="company-ai-output__actions">
        <div>{hasGeneratedContent && <IconAction label="复制" icon={companyIcons.copy} onClick={() => void copyOutput()} />}<IconAction label="重新生成" icon={companyIcons.refresh} onClick={onRegenerate} /></div>
        {hasGeneratedContent && <><i /><div><IconAction label="喜欢" icon={companyIcons.thumbsUp} active={feedback === 'like'} onClick={() => setOutputFeedback('like')} /><IconAction label="不喜欢" icon={companyIcons.thumbsDown} active={feedback === 'dislike'} onClick={() => setOutputFeedback('dislike')} /></div></>}
      </footer>}
    </div>
  </article>;
}
