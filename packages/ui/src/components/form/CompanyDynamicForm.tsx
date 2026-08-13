import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CompanyButton } from '../button';
import { CompanyCheckbox } from '../checkbox';
import { CompanyInput } from '../input';
import { EditableTagGroup } from '../tags';
import type { EditableTagItem } from '../tags';
import './company-form.css';

export type CompanyFormTableRow = {
  id: string;
  name: string;
  value: string;
};

export type CompanyFormTableProps = {
  rows: CompanyFormTableRow[];
  selectedRowIds?: string[];
  emptyText?: ReactNode;
  disabled?: boolean;
  className?: string;
  onSelectionChange?: (ids: string[]) => void;
  onEdit?: (row: CompanyFormTableRow) => void;
};

export function CompanyFormTable({
  rows,
  selectedRowIds = [],
  emptyText = '暂无数据',
  disabled = false,
  className,
  onSelectionChange,
  onEdit,
}: CompanyFormTableProps) {
  const allSelected = rows.length > 0 && selectedRowIds.length === rows.length;
  const partiallySelected = selectedRowIds.length > 0 && !allSelected;

  const toggleAll = (checked: boolean) => {
    onSelectionChange?.(checked ? rows.map((row) => row.id) : []);
  };

  const toggleRow = (id: string, checked: boolean) => {
    onSelectionChange?.(checked ? [...selectedRowIds, id] : selectedRowIds.filter((rowId) => rowId !== id));
  };

  return (
    <div className={['company-form-table', className].filter(Boolean).join(' ')}>
      <table>
        <thead>
          <tr>
            <th className="company-form-table__check">
              <CompanyCheckbox
                checked={allSelected}
                indeterminate={partiallySelected}
                disabled={disabled || rows.length === 0}
                aria-label="选择全部"
                onChange={(event) => toggleAll(event.target.checked)}
              />
            </th>
            <th>字段名称1</th>
            <th>字段名称2</th>
            <th className="company-form-table__action">操作</th>
          </tr>
        </thead>
        {rows.length ? (
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="company-form-table__check">
                  <CompanyCheckbox
                    checked={selectedRowIds.includes(row.id)}
                    disabled={disabled}
                    aria-label={`选择${row.name}`}
                    onChange={(event) => toggleRow(row.id, event.target.checked)}
                  />
                </td>
                <td>{row.name}</td>
                <td>{row.value}</td>
                <td className="company-form-table__action">
                  <CompanyButton variant="text" disabled={disabled} onClick={() => onEdit?.(row)}>编辑</CompanyButton>
                </td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
      {!rows.length ? (
        <div className="company-form-table__empty">
          <img src="/assets/visual/empty-general.svg" alt="" />
          <span>{emptyText}</span>
        </div>
      ) : null}
    </div>
  );
}

export type CompanyDynamicFormProps = {
  variant?: 'table' | 'tags';
  disabled?: boolean;
  defaultRows?: CompanyFormTableRow[];
  defaultTags?: EditableTagItem[];
  className?: string;
  onRowsChange?: (rows: CompanyFormTableRow[]) => void;
  onTagsChange?: (tags: EditableTagItem[]) => void;
};

const defaultDynamicRows: CompanyFormTableRow[] = Array.from({ length: 5 }, (_, index) => ({
  id: `field-${index + 1}`,
  name: '单元格',
  value: '单元格',
}));

const defaultDynamicTags: EditableTagItem[] = [
  { id: 'tag-1', value: '360极速浏览器1' },
  { id: 'tag-2', value: '极速浏览器2' },
  { id: 'tag-3', value: '360极速' },
  { id: 'tag-4', value: '360极速浏览器2' },
];

export function CompanyDynamicForm({
  variant = 'table',
  disabled = false,
  defaultRows = defaultDynamicRows,
  defaultTags = defaultDynamicTags,
  className,
  onRowsChange,
  onTagsChange,
}: CompanyDynamicFormProps) {
  const [rows, setRows] = useState(defaultRows);
  const [tags, setTags] = useState(defaultTags);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const selectedRows = useMemo(() => new Set(selectedRowIds), [selectedRowIds]);

  const updateRows = (nextRows: CompanyFormTableRow[]) => {
    setRows(nextRows);
    onRowsChange?.(nextRows);
  };

  const addRow = () => {
    if (!name.trim() && !value.trim()) return;
    updateRows([...rows, { id: `field-${Date.now()}`, name: name.trim() || '未命名字段', value: value.trim() || '未填写' }]);
    setName('');
    setValue('');
  };

  const deleteRows = () => {
    updateRows(rows.filter((row) => !selectedRows.has(row.id)));
    setSelectedRowIds([]);
  };

  if (variant === 'tags') {
    return (
      <section className={['company-dynamic-form', 'company-dynamic-form--tags', className].filter(Boolean).join(' ')}>
        <div className="company-dynamic-form__tag-entry">
          <CompanyInput maxLength={50} placeholder="字段名称（必填），多条数据用‘,’隔开" disabled={disabled} />
        </div>
        <EditableTagGroup
          value={tags}
          addText="添加"
          disabled={disabled}
          onChange={(nextTags) => {
            setTags(nextTags);
            onTagsChange?.(nextTags);
          }}
        />
      </section>
    );
  }

  return (
    <section className={['company-dynamic-form', 'company-dynamic-form--table', className].filter(Boolean).join(' ')}>
      <div className="company-dynamic-form__entry">
        <CompanyInput value={name} maxLength={20} placeholder="不超过18个字符" disabled={disabled} onChange={(event) => setName(event.target.value)} />
        <CompanyInput value={value} maxLength={50} placeholder="不超过50个字符" disabled={disabled} onChange={(event) => setValue(event.target.value)} />
        <CompanyButton variant="secondary" disabled={disabled || (!name.trim() && !value.trim())} onClick={addRow}>添加</CompanyButton>
        <CompanyButton variant="secondary" disabled={disabled}>导入</CompanyButton>
      </div>
      <CompanyButton variant="auxiliary" disabled={disabled || selectedRowIds.length === 0} onClick={deleteRows}>删除</CompanyButton>
      <CompanyFormTable
        rows={rows}
        selectedRowIds={selectedRowIds}
        disabled={disabled}
        onSelectionChange={setSelectedRowIds}
        onEdit={(row) => {
          setName(row.name);
          setValue(row.value);
        }}
      />
    </section>
  );
}
