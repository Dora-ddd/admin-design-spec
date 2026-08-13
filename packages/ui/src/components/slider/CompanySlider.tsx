import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Slider } from 'antd';
import { CompanyInputNumber } from '../input-number';
import './company-slider.css';

export type CompanySliderVisualState = 'default' | 'hover' | 'disabled';
export type CompanySliderValue = number | [number, number];

export type CompanySliderProps = {
  range?: boolean;
  value?: CompanySliderValue;
  defaultValue?: CompanySliderValue;
  min?: number;
  max?: number;
  step?: number | null;
  disabled?: boolean;
  included?: boolean;
  vertical?: boolean;
  reverse?: boolean;
  visualState?: CompanySliderVisualState;
  showInput?: boolean;
  showMarks?: boolean;
  markValues?: number[];
  markFormatter?: (value: number) => ReactNode;
  className?: string;
  onChange?: (value: CompanySliderValue) => void;
};

function normalizeRange(value: CompanySliderValue | undefined, min: number, max: number): [number, number] {
  if (Array.isArray(value)) return value;
  const midpoint = typeof value === 'number' ? value : Math.round((min + max) / 2);
  return [Math.max(min, midpoint - 8), Math.min(max, midpoint + 8)];
}

function normalizeSingle(value: CompanySliderValue | undefined, min: number, max: number) {
  if (Array.isArray(value)) return value[0];
  return value ?? Math.round((min + max) / 2);
}

export function CompanySlider({
  range = false,
  value,
  defaultValue,
  min = 0,
  max = 100,
  visualState = 'default',
  disabled = false,
  showInput = false,
  showMarks = false,
  markValues,
  markFormatter = (mark) => String(mark),
  className,
  onChange,
  step,
  included,
  vertical,
  reverse,
}: CompanySliderProps) {
  const controlled = value !== undefined;
  const disabledState = Boolean(disabled || visualState === 'disabled');
  const initialValue = range
    ? normalizeRange(defaultValue ?? value, min, max)
    : normalizeSingle(defaultValue ?? value, min, max);
  const [internalValue, setInternalValue] = useState<CompanySliderValue>(initialValue);
  const resolvedValue = controlled
    ? range ? normalizeRange(value, min, max) : normalizeSingle(value, min, max)
    : internalValue;
  const marks = useMemo(() => {
    if (!showMarks) return undefined;
    const resolvedMarkValues = markValues ?? [min, Math.round(min + (max - min) * 0.25), Math.round(min + (max - min) * 0.5), Math.round(min + (max - min) * 0.75), max];
    return Object.fromEntries(resolvedMarkValues.map((mark) => [mark, markFormatter(mark)]));
  }, [markFormatter, markValues, max, min, showMarks]);

  useEffect(() => {
    if (!controlled) {
      setInternalValue(range
        ? normalizeRange(defaultValue, min, max)
        : normalizeSingle(defaultValue, min, max));
    }
  }, [controlled, defaultValue, max, min, range]);

  const updateValue = (nextValue: CompanySliderValue) => {
    if (!controlled) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  const updateRangeEndpoint = (index: 0 | 1, nextValue: number | null) => {
    if (nextValue === null) return;
    const current = normalizeRange(resolvedValue, min, max);
    const nextRange: [number, number] = index === 0
      ? [Math.min(nextValue, current[1]), current[1]]
      : [current[0], Math.max(nextValue, current[0])];
    updateValue(nextRange);
  };

  const classes = [
    'company-slider',
    range && 'company-slider--range',
    showMarks && 'company-slider--marks',
    showInput && 'company-slider--input',
    `is-${visualState}`,
    disabledState && 'is-disabled',
    className,
  ].filter(Boolean).join(' ');
  const sharedSliderProps = {
    min,
    max,
    step,
    included,
    vertical,
    reverse,
    marks,
    disabled: disabledState,
    tooltip: { open: false as const },
  };

  return (
    <div className={classes}>
      <div className="company-slider__track-wrap">
        {range ? (
          <Slider
            {...sharedSliderProps}
            range
            value={normalizeRange(resolvedValue, min, max)}
            onChange={(nextValue: number[]) => updateValue([nextValue[0], nextValue[1]])}
          />
        ) : (
          <Slider
            {...sharedSliderProps}
            value={normalizeSingle(resolvedValue, min, max)}
            onChange={(nextValue: number) => updateValue(nextValue)}
          />
        )}
      </div>
      {showInput ? (
        range ? (
          <div className="company-slider__range-inputs">
            <CompanyInputNumber
              value={normalizeRange(resolvedValue, min, max)[0]}
              min={min}
              max={normalizeRange(resolvedValue, min, max)[1]}
              disabled={disabledState}
              onChange={(nextValue) => updateRangeEndpoint(0, nextValue as number | null)}
            />
            <span aria-hidden="true">-</span>
            <CompanyInputNumber
              value={normalizeRange(resolvedValue, min, max)[1]}
              min={normalizeRange(resolvedValue, min, max)[0]}
              max={max}
              disabled={disabledState}
              onChange={(nextValue) => updateRangeEndpoint(1, nextValue as number | null)}
            />
          </div>
        ) : (
          <div className="company-slider__single-input-wrap">
            <CompanyInputNumber
              value={normalizeSingle(resolvedValue, min, max)}
              min={min}
              max={max}
              disabled={disabledState}
              onChange={(nextValue) => nextValue !== null && updateValue(nextValue as number)}
            />
          </div>
        )
      ) : null}
    </div>
  );
}
