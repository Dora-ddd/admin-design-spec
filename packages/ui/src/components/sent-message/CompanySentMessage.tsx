import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Button, Input, Tooltip } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { CompanyLoadingRing } from '../loading';
import { SuperSenderFileIcon, inferSuperSenderFileType } from '../super-sender/SuperSenderFileIcon';
import type { SuperSenderFileType } from '../super-sender/SuperSenderFileIcon';
import './company-sent-message.css';

export type SentMessageStatus = 'default' | 'sending' | 'error';

export type SentMessageFile = {
  id: string;
  name: string;
  size?: string;
  fileType?: SuperSenderFileType;
};

export type CompanySentMessageProps = {
  value?: string;
  defaultValue?: string;
  files?: SentMessageFile[];
  status?: SentMessageStatus;
  showActions?: boolean;
  disabled?: boolean;
  editing?: boolean;
  defaultEditing?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  defaultHistory?: string[];
  className?: string;
  style?: CSSProperties;
  onChange?: (value: string) => void;
  onCopy?: (value: string) => void;
  onSave?: (value: string) => void;
  onRetry?: () => void;
  onEditingChange?: (editing: boolean) => void;
  onExpandedChange?: (expanded: boolean) => void;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function useControllableState<T>(controlled: T | undefined, initialValue: T, onChange?: (value: T) => void) {
  const [internalValue, setInternalValue] = useState(initialValue);
  const value = controlled === undefined ? internalValue : controlled;
  const update = (next: T) => {
    if (controlled === undefined) setInternalValue(next);
    onChange?.(next);
  };
  return [value, update] as const;
}

function SentFileCard({ file, stacked = false }: { file: SentMessageFile; stacked?: boolean }) {
  return <div className={classes('company-sent-file', stacked && 'is-stacked')}>
    <SuperSenderFileIcon type={file.fileType ?? inferSuperSenderFileType(file.name)} />
    <span className="company-sent-file__copy">
      <span className="company-sent-file__name" title={file.name}>{file.name}</span>
      {file.size && <span className="company-sent-file__size">{file.size}</span>}
    </span>
  </div>;
}

export function CompanySentMessage({
  value: controlledValue,
  defaultValue = '',
  files = [],
  status = 'default',
  showActions = true,
  disabled = false,
  editing: controlledEditing,
  defaultEditing = false,
  expanded: controlledExpanded,
  defaultExpanded = false,
  defaultHistory = [],
  className,
  style,
  onChange,
  onCopy,
  onSave,
  onRetry,
  onEditingChange,
  onExpandedChange,
}: CompanySentMessageProps) {
  const initialHistory = useMemo(() => {
    const history = defaultHistory.filter(Boolean);
    if (defaultValue && history.at(-1) !== defaultValue) history.push(defaultValue);
    return history.length > 0 ? history : defaultValue ? [defaultValue] : [];
  }, []);
  const [messageValue, setMessageValue] = useControllableState(controlledValue, defaultValue, onChange);
  const [editing, setEditing] = useControllableState(controlledEditing, defaultEditing, onEditingChange);
  const [expanded, setExpanded] = useControllableState(controlledExpanded, defaultExpanded, onExpandedChange);
  const [draft, setDraft] = useState(messageValue);
  const [history, setHistory] = useState(initialHistory);
  const [historyIndex, setHistoryIndex] = useState(Math.max(0, initialHistory.length - 1));

  const displayedValue = history.length > 0 ? history[historyIndex] : messageValue;
  const canSave = draft.trim().length > 0 && draft.trim() !== displayedValue.trim();
  const stackCount = Math.min(files.length, 3);
  const stackFiles = files.slice(0, stackCount);

  useEffect(() => {
    if (!editing) setDraft(displayedValue);
  }, [displayedValue, editing]);

  useEffect(() => {
    if (controlledValue === undefined || !controlledValue) return;
    setHistory((current) => {
      if (current.at(-1) === controlledValue) return current;
      const updated = [...current, controlledValue];
      setHistoryIndex(updated.length - 1);
      return updated;
    });
  }, [controlledValue]);

  const beginEditing = () => {
    setDraft(displayedValue);
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft(displayedValue);
    setEditing(false);
  };

  const saveEditing = () => {
    const next = draft.trim();
    if (!next || !canSave) return;
    setMessageValue(next);
    setHistory((current) => {
      const updated = current.at(-1) === next ? current : [...current, next];
      setHistoryIndex(updated.length - 1);
      return updated;
    });
    setEditing(false);
    onSave?.(next);
  };

  const copyMessage = async () => {
    if (!displayedValue) return;
    try {
      if (typeof navigator !== 'undefined') await navigator.clipboard?.writeText(displayedValue);
    } catch {
      // Clipboard access can be unavailable in embedded previews; the callback still reports the action.
    }
    onCopy?.(displayedValue);
  };

  const statusControl = status === 'error'
    ? <Tooltip title="发送失败，点击重新发送"><button type="button" className="company-sent-message__status is-error" aria-label="重新发送" disabled={disabled || !onRetry} onClick={onRetry}><CompanyIcon type={companyIcons.warning} /></button></Tooltip>
    : status === 'sending'
      ? <span className="company-sent-message__status is-sending"><CompanyLoadingRing ariaLabel="发送中" /></span>
      : null;

  return <article className={classes('company-sent-message', `status-${status}`, editing && 'is-editing', className)} style={style}>
    <div className="company-sent-message__content-row">
      {statusControl}
      <div className="company-sent-message__main">
        {files.length > 0 && <section className="company-sent-message__files" aria-label={`已发送 ${files.length} 个文件`}>
          {files.length > 1 && <Button type="text" size="small" className="company-sent-message__file-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
            {expanded ? `收起文件 (${files.length})` : `显示全部 (${files.length})`}
            <CompanyIcon type={expanded ? companyIcons.hidden : companyIcons.visible} />
          </Button>}
          {files.length === 1 ? <SentFileCard file={files[0]} /> : expanded
            ? <div className="company-sent-message__file-grid">{files.map((file) => <SentFileCard key={file.id} file={file} />)}</div>
            : <div
              className="company-sent-message__file-stack"
              style={{ '--company-sent-message-stack-offset': `${(stackCount - 1) * 32}px` } as CSSProperties}
            >
              {stackFiles.map((file, index) => {
                const depth = stackCount - index - 1;
                const layer = index === stackCount - 1 ? 'front' : index === 0 ? 'back' : 'middle';
                return <div
                  className="company-sent-message__stack-item"
                  data-layer={layer}
                  key={file.id}
                  style={{
                    width: `${240 - depth * 20}px`,
                    top: `${index * 32}px`,
                    zIndex: index + 1,
                    '--company-sent-message-stack-rotation': `${depth * 2}deg`,
                  } as CSSProperties}
                >
                  <SentFileCard file={file} stacked />
                </div>;
              })}
            </div>}
        </section>}

        {editing ? <section className="company-sent-message__editor">
          <Input.TextArea value={draft} disabled={disabled} autoSize={{ minRows: 2, maxRows: 4 }} aria-label="编辑发送内容" onChange={(event) => setDraft(event.target.value)} />
          <div className="company-sent-message__editor-actions">
            <Button size="small" disabled={disabled} onClick={cancelEditing}>取消</Button>
            <Button size="small" type="primary" className="ai-gradient-button company-sent-message__save" disabled={disabled || !canSave} onClick={saveEditing}>保存</Button>
          </div>
        </section> : displayedValue && <div className="company-sent-message__bubble">{displayedValue}</div>}
      </div>
    </div>

    {!editing && (showActions || history.length > 1 || status !== 'default') && <footer className="company-sent-message__footer">
      {history.length > 1 && <div className="company-sent-message__history" aria-label="编辑历史">
        <Button type="text" size="small" disabled={historyIndex === 0} onClick={() => setHistoryIndex((index) => Math.max(0, index - 1))}>上一版</Button>
        <span>{historyIndex + 1}/{history.length}</span>
        <Button type="text" size="small" disabled={historyIndex === history.length - 1} onClick={() => setHistoryIndex((index) => Math.min(history.length - 1, index + 1))}>下一版</Button>
      </div>}
      {showActions && <div className="company-sent-message__actions">
        <Tooltip title="重新编辑">
          <Button type="text" size="small" aria-label="重新编辑" disabled={disabled || !displayedValue} icon={<CompanyIcon type={companyIcons.edit} />} onClick={beginEditing} />
        </Tooltip>
        <Tooltip title="复制">
          <Button type="text" size="small" aria-label="复制" disabled={disabled || !displayedValue} icon={<CompanyIcon type={companyIcons.copy} />} onClick={() => void copyMessage()} />
        </Tooltip>
      </div>}
    </footer>}
  </article>;
}
