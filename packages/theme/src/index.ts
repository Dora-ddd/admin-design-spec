import type { CSSProperties } from 'react';
import type { ThemeConfig } from 'antd';
import masterGoVariables from './mastergo-variables.json';

export const DEFAULT_MODE = '3.0-浅色绿' as const;

export const THEME_MODES = [
  '3.0-浅色绿',
  '2.6-浅色绿',
  '3.0-浅色蓝',
  '3.0-暗黑绿',
  '3.0-暗黑蓝',
  '2.6-浅色蓝',
  '2.6-暗黑蓝',
  '2.6-暗黑绿',
] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

export const DENSITY_MODES = ['compact', 'regular', 'loose'] as const;

export type DensityMode = (typeof DENSITY_MODES)[number];

export const DEFAULT_DENSITY: DensityMode = 'regular';

export const DENSITY_LABELS: Record<DensityMode, string> = {
  compact: '紧凑',
  regular: '常规',
  loose: '宽松',
};

export const DENSITY_COMPONENT_SIZES = {
  compact: 'small',
  regular: 'middle',
  loose: 'large',
} as const;

// MasterGo currently has no spacing collection, so the engineering layer owns
// this exact-pixel scale while radius values continue to come from MasterGo.
export const COMPANY_SPACE = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  12: 12,
  13: 13,
  14: 14,
  16: 16,
  18: 18,
  20: 20,
  22: 22,
  24: 24,
  28: 28,
  32: 32,
  40: 40,
  48: 48,
  52: 52,
  80: 80,
} as const;

type VariableValue = string | string[] | { floatData?: number[] } | Record<string, unknown>;
type MasterGoVariable = {
  name: string;
  type: string;
  mode: Array<{ name: string; value: VariableValue }>;
};

const variables = masterGoVariables as MasterGoVariable[];

function valueOf(name: string, mode: ThemeMode): VariableValue {
  const variable = variables.find((item) => item.name === name);
  const value = variable?.mode.find((item) => item.name === mode)?.value;

  if (value === undefined) {
    throw new Error(`MasterGo variable is missing: ${name} / ${mode}`);
  }

  return value;
}

function color(name: string, mode: ThemeMode): string {
  return valueOf(name, mode) as string;
}

function colorWithAlpha(name: string, opacity: number, mode: ThemeMode): string {
  const value = color(name, mode);
  const match = value.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);

  if (!match) return value;

  const [, red, green, blue] = match;
  return `rgba(${Number.parseInt(red, 16)}, ${Number.parseInt(green, 16)}, ${Number.parseInt(blue, 16)}, ${opacity})`;
}

function effect(name: string, mode: ThemeMode): string {
  return valueOf(name, mode) as string;
}

function radiusReferenceMode(mode: ThemeMode): ThemeMode {
  return mode.startsWith('2.6-') ? '2.6-浅色绿' : '3.0-浅色绿';
}

function radiusValues(name: string, mode: ThemeMode): number[] {
  const value = valueOf(name, radiusReferenceMode(mode)) as { floatData?: number[] };
  return value.floatData ?? [0, 0, 0, 0];
}

function radius(name: string, mode: ThemeMode): number {
  return radiusValues(name, mode)[0] ?? 0;
}

function radiusCorners(name: string, mode: ThemeMode): string {
  return radiusValues(name, mode).map((value) => `${value}px`).join(' ');
}

export function getThemeTokens(mode: ThemeMode = DEFAULT_MODE) {
  return {
    colorPrimary: color('Brand 品牌/p6', mode),
    colorPrimaryHover: color('Brand 品牌/p5', mode),
    colorPrimaryActive: color('Brand 品牌/p7', mode),
    colorLink: color('text&iocn/P6', mode),
    colorLinkHover: color('text&iocn/P7', mode),
    colorText: color('text&iocn/gray-9', mode),
    colorTextSecondary: color('text&iocn/gray-8', mode),
    colorTextTertiary: color('text&iocn/gray-7', mode),
    colorTextQuaternary: color('text&iocn/gray-6', mode),
    colorBgBase: color('Gray 中性/gray-1', mode),
    colorBgLayout: color('Gray 中性/gray-3白背景hover', mode),
    colorBgContainer: color('Gray 中性/gray-1', mode),
    colorBgElevated: color('Gray 中性/gray-1', mode),
    colorFillSecondary: color('Gray 中性/gray-3白背景hover', mode),
    colorFillContentHover: color('Gray 中性/gray-3白背景hover', mode),
    colorFillAlter: color('Gray 中性/gray-2', mode),
    colorFillContent: color('Gray 中性/gray-2', mode),
    colorBgContainerDisabled: color('Gray 中性/gray-3白背景hover', mode),
    colorBgTextHover: color('Gray 中性/gray-3白背景hover', mode),
    colorBgTextActive: color('Gray 中性/gray-4-分割线', mode),
    colorBgMask: colorWithAlpha('Gray 中性/gray-10', 0.3, mode),
    colorBorder: color('Gray 中性/gray-5-边框', mode),
    colorBorderSecondary: color('Gray 中性/gray-4-分割线', mode),
    colorBorderBg: color('Gray 中性/gray-4-分割线', mode),
    colorSplit: color('Gray 中性/gray-4-分割线', mode),
    colorTextPlaceholder: color('text&iocn/gray-7', mode),
    colorTextDisabled: color('text&iocn/gray-6', mode),
    colorTextHeading: color('text&iocn/gray-9', mode),
    colorTextLabel: color('text&iocn/gray-8', mode),
    colorTextDescription: color('text&iocn/gray-7', mode),
    colorIcon: color('text&iocn/gray-7', mode),
    colorIconHover: color('text&iocn/gray-8', mode),
    colorSuccess: color('Success 安全/Green-6', mode),
    colorHighRisk: color('High risk 高危/Orange red-6', mode),
    colorWarning: color('Medium risk 警告/Orange-6', mode),
    colorLowRisk: color('Low risk 低危/Yellow-6', mode),
    colorError: color('Serious 严重/Red-6', mode),
    colorInfo: color('Reminder 提醒/Blue-6', mode),
    colorPrimaryBg: color('Brand 品牌/p1', mode),
    colorErrorBg: color('Serious 严重/Red-1', mode),
    colorWarningBg: color('Medium risk 警告/Orange-1', mode),
    colorSuccessBg: color('Success 安全/Green-1', mode),
    colorWarningOutline: color('Medium risk 警告/Orange-1', mode),
    colorErrorOutline: color('Serious 严重/Red-1', mode),
    controlItemBgHover: color('Gray 中性/gray-3白背景hover', mode),
    controlItemBgActive: color('Brand 品牌/p1', mode),
    controlItemBgActiveHover: color('Brand 品牌/p2', mode),
    controlHeight: 32,
    controlHeightSM: 24,
    controlHeightLG: 40,
    fontSizeIcon: 14,
    fontWeightStrong: 600,
    controlInteractiveSize: 16,
    fontFamily: 'PingFang SC, PingFangSC-Regular, Microsoft YaHei, sans-serif',
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    lineHeight: 22 / 14,
    lineHeightSM: 20 / 12,
    lineHeightLG: 24 / 16,
    borderRadius: radius('圆角6px', mode),
    borderRadiusSM: radius('圆角 4px', mode),
    borderRadiusLG: radius('圆角 8px', mode),
    borderRadiusXS: radius('圆角 2px', mode),
    boxShadow: effect('投影/投影-默认', mode),
    boxShadowSecondary: effect('投影/投影-悬停', mode),
    controlOutline: effect('Focus Shadow/Default 默认', mode),
    controlOutlineWidth: 2,
  };
}

export function getCompanyTheme(mode: ThemeMode = DEFAULT_MODE): ThemeConfig {
  const token = getThemeTokens(mode);

  return {
    cssVar: {},
    token,
    components: {
      Checkbox: {
        colorPrimary: token.colorPrimary,
        colorPrimaryHover: token.colorPrimaryHover,
        colorBorder: token.colorBorder,
        colorText: token.colorText,
        colorTextDisabled: token.colorTextTertiary,
        colorBgContainer: token.colorBgContainer,
        colorBgContainerDisabled: token.colorFillSecondary,
        borderRadiusSM: radius('圆角 4px', mode),
        controlInteractiveSize: 16,
      },
      Button: {
        borderRadius: radius('圆角6px', mode),
        controlHeight: 32,
        controlHeightSM: 24,
        controlHeightLG: 40,
        fontWeight: 400,
        iconGap: COMPANY_SPACE[4],
        defaultShadow: 'none',
        primaryShadow: 'none',
        dangerShadow: 'none',
        primaryColor: '#fff',
        defaultColor: token.colorText,
        defaultBg: token.colorBgContainer,
        defaultBorderColor: token.colorBorder,
        dangerColor: token.colorError,
        defaultHoverBg: token.colorBgContainer,
        defaultHoverColor: token.colorPrimary,
        defaultHoverBorderColor: token.colorPrimary,
        defaultActiveBg: token.colorFillSecondary,
        defaultActiveColor: token.colorPrimaryActive,
        defaultActiveBorderColor: token.colorPrimaryActive,
        defaultBgDisabled: token.colorBgContainerDisabled,
        dashedBgDisabled: token.colorBgContainerDisabled,
        borderColorDisabled: token.colorBorderSecondary,
        solidTextColor: '#fff',
        textTextColor: token.colorTextSecondary,
        textTextHoverColor: token.colorPrimary,
        textTextActiveColor: token.colorPrimaryActive,
        textHoverBg: token.colorFillContentHover,
        linkHoverBg: token.colorFillContentHover,
        contentFontSize: 14,
        contentFontSizeSM: 12,
        contentFontSizeLG: 16,
        onlyIconSize: 16,
        onlyIconSizeSM: 14,
        onlyIconSizeLG: 20,
        paddingInline: COMPANY_SPACE[16],
        paddingInlineSM: COMPANY_SPACE[8],
        paddingInlineLG: COMPANY_SPACE[24],
      },
      Card: {
        borderRadiusLG: radius('圆角 8px', mode),
        headerBg: token.colorBgContainer,
        headerFontSize: 16,
        headerFontSizeSM: 14,
        headerHeight: 48,
        headerHeightSM: 40,
        bodyPadding: COMPANY_SPACE[24],
        bodyPaddingSM: COMPANY_SPACE[12],
        headerPadding: COMPANY_SPACE[24],
        headerPaddingSM: COMPANY_SPACE[12],
        actionsBg: token.colorBgContainer,
        extraColor: token.colorTextSecondary,
      },
      Input: {
        paddingInline: COMPANY_SPACE[12],
        paddingInlineSM: COMPANY_SPACE[8],
        paddingInlineLG: COMPANY_SPACE[12],
        paddingBlock: COMPANY_SPACE[5],
        paddingBlockSM: COMPANY_SPACE[2],
        paddingBlockLG: COMPANY_SPACE[7],
        addonBg: token.colorFillAlter,
        hoverBorderColor: token.colorPrimaryHover,
        activeBorderColor: token.colorPrimary,
        activeShadow: effect('Focus Shadow/Default 默认', mode),
        errorActiveShadow: effect('Focus Shadow/Error 错误', mode),
        warningActiveShadow: effect('Focus Shadow/Warning警告', mode),
        hoverBg: token.colorBgContainer,
        activeBg: token.colorBgContainer,
        inputFontSize: 14,
        inputFontSizeSM: 12,
        inputFontSizeLG: 16,
      },
      Select: {
        optionSelectedColor: token.colorText,
        optionSelectedFontWeight: 500,
        optionSelectedBg: color('Brand 品牌/p1', mode),
        optionActiveBg: token.colorFillContentHover,
        optionPadding: `${COMPANY_SPACE[5]}px ${COMPANY_SPACE[12]}px`,
        optionFontSize: 14,
        optionLineHeight: 22 / 14,
        optionHeight: 32,
        selectorBg: token.colorBgContainer,
        clearBg: token.colorBgContainer,
        hoverBorderColor: token.colorPrimaryHover,
        activeBorderColor: token.colorPrimary,
        activeOutlineColor: token.colorPrimaryBg,
      },
      DatePicker: {
        activeShadow: effect('Focus Shadow/Default 默认', mode),
        activeBorderColor: token.colorPrimary,
        hoverBorderColor: token.colorPrimaryHover,
        cellHoverBg: token.colorFillContentHover,
        cellActiveWithRangeBg: token.colorPrimaryBg,
        cellHoverWithRangeBg: token.colorPrimaryBg,
        cellRangeBorderColor: token.colorPrimary,
      },
      Dropdown: {
        paddingBlock: COMPANY_SPACE[4],
        controlItemBgHover: token.colorFillContentHover,
        controlItemBgActive: token.colorPrimaryBg,
        zIndexPopup: 1050,
      },
      Menu: {
        itemColor: token.colorTextSecondary,
        itemHoverColor: token.colorPrimary,
        itemSelectedColor: token.colorPrimary,
        itemDisabledColor: token.colorTextDisabled,
        itemBg: 'transparent',
        itemHoverBg: token.colorFillContentHover,
        itemActiveBg: token.colorFillContentHover,
        itemSelectedBg: token.colorPrimaryBg,
        itemBorderRadius: radius('圆角6px', mode),
        subMenuItemBorderRadius: radius('圆角6px', mode),
        itemHeight: 40,
        itemMarginBlock: COMPANY_SPACE[4],
        itemPaddingInline: COMPANY_SPACE[16],
      },
      Modal: {
        headerBg: token.colorBgContainer,
        contentBg: token.colorBgContainer,
        footerBg: token.colorBgContainer,
        titleLineHeight: 24,
        titleFontSize: 16,
        titleColor: token.colorTextHeading,
      },
      Drawer: {
        zIndexPopup: 1050,
        footerPaddingBlock: COMPANY_SPACE[12],
        footerPaddingInline: COMPANY_SPACE[24],
      },
      Pagination: {
        itemBg: token.colorBgContainer,
        itemSize: 32,
        itemSizeSM: 24,
        itemSizeLG: 40,
        itemActiveBg: token.colorPrimaryBg,
        itemActiveColor: token.colorPrimary,
        itemActiveColorHover: token.colorPrimaryHover,
        itemLinkBg: token.colorBgContainer,
        itemActiveBgDisabled: token.colorFillAlter,
        itemActiveColorDisabled: token.colorTextDisabled,
        itemInputBg: token.colorBgContainer,
      },
      Tag: {
        defaultBg: token.colorFillAlter,
        defaultColor: token.colorText,
        solidTextColor: '#fff',
      },
      Progress: {
        defaultColor: token.colorPrimary,
        remainingColor: token.colorBorderSecondary,
        lineBorderRadius: radius('圆角 4px', mode),
        circleTextColor: token.colorText,
      },
      Radio: {
        dotColorDisabled: token.colorTextDisabled,
        buttonBg: token.colorBgContainer,
        buttonCheckedBg: token.colorPrimaryBg,
        buttonColor: token.colorText,
        buttonPaddingInline: COMPANY_SPACE[12],
        buttonCheckedBgDisabled: token.colorFillAlter,
        buttonCheckedColorDisabled: token.colorTextDisabled,
        buttonSolidCheckedColor: '#fff',
        buttonSolidCheckedBg: token.colorPrimary,
        buttonSolidCheckedHoverBg: token.colorPrimaryHover,
        buttonSolidCheckedActiveBg: token.colorPrimaryActive,
      },
      Segmented: {
        itemColor: token.colorTextSecondary,
        itemHoverColor: token.colorText,
        itemHoverBg: token.colorFillContentHover,
        itemActiveBg: token.colorFillSecondary,
        itemSelectedBg: token.colorBgContainer,
        itemSelectedColor: token.colorPrimary,
        trackPadding: COMPANY_SPACE[2],
        trackBg: token.colorFillAlter,
      },
      Switch: {
        trackHeight: 20,
        trackHeightSM: 16,
        trackMinWidth: 36,
        trackMinWidthSM: 28,
        trackPadding: COMPANY_SPACE[2],
        handleBg: token.colorBgContainer,
        handleShadow: '0 2px 4px rgba(0, 0, 0, 0.16)',
        handleSize: 16,
        handleSizeSM: 12,
      },
      Steps: {
        iconSize: 32,
        iconFontSize: 16,
        iconSizeSM: 24,
        navArrowColor: token.colorTextTertiary,
      },
      Tabs: {
        cardBg: token.colorBgContainer,
        cardHeight: 40,
        cardHeightSM: 32,
        cardHeightLG: 48,
        titleFontSize: 14,
        titleFontSizeSM: 12,
        titleFontSizeLG: 16,
        inkBarColor: token.colorPrimary,
        itemColor: token.colorTextSecondary,
        itemActiveColor: token.colorPrimary,
        itemSelectedColor: color('Brand 品牌/p6', mode),
        itemHoverColor: color('Brand 品牌/p5', mode),
        horizontalItemPadding: `${COMPANY_SPACE[12]}px 0`,
        horizontalItemPaddingSM: `${COMPANY_SPACE[8]}px 0`,
        horizontalItemPaddingLG: `${COMPANY_SPACE[16]}px 0`,
      },
      Table: {
        headerBg: color('Gray 中性/gray-3白背景hover', mode),
        headerColor: token.colorText,
        headerSortActiveBg: color('Gray 中性/gray-3白背景hover', mode),
        headerSortHoverBg: color('Gray 中性/gray-3白背景hover', mode),
        bodySortBg: 'transparent',
        rowHoverBg: token.colorFillContentHover,
        rowSelectedBg: token.colorPrimaryBg,
        rowSelectedHoverBg: color('Brand 品牌/p2', mode),
        rowExpandedBg: token.colorFillAlter,
        cellPaddingBlock: COMPANY_SPACE[12],
        cellPaddingInline: COMPANY_SPACE[16],
        cellPaddingBlockMD: COMPANY_SPACE[10],
        cellPaddingInlineMD: COMPANY_SPACE[12],
        cellPaddingBlockSM: COMPANY_SPACE[8],
        cellPaddingInlineSM: COMPANY_SPACE[12],
        borderColor: color('Gray 中性/gray-4-分割线', mode),
        headerBorderRadius: radius('圆角6px', mode),
        footerBg: token.colorBgContainer,
        footerColor: token.colorTextSecondary,
        cellFontSize: 14,
        cellFontSizeMD: 14,
        cellFontSizeSM: 12,
        headerSplitColor: token.colorBorderSecondary,
        fixedHeaderSortActiveBg: token.colorPrimaryBg,
        headerFilterHoverBg: token.colorFillContentHover,
        filterDropdownMenuBg: token.colorBgContainer,
        filterDropdownBg: token.colorBgContainer,
        expandIconBg: token.colorBgContainer,
        selectionColumnWidth: 48,
        stickyScrollBarBg: 'rgba(138, 144, 153, 0.18)',
        stickyScrollBarBorderRadius: radius('圆角 4px', mode),
      },
      Avatar: {
        containerSize: 32,
        containerSizeLG: 40,
        containerSizeSM: 24,
        textFontSize: 14,
        textFontSizeLG: 16,
        textFontSizeSM: 12,
        iconFontSize: 16,
        iconFontSizeLG: 20,
        iconFontSizeSM: 12,
        groupBorderColor: token.colorBgContainer,
      },
      Breadcrumb: {
        itemColor: token.colorTextTertiary,
        linkColor: token.colorTextSecondary,
        linkHoverColor: token.colorPrimary,
        lastItemColor: token.colorText,
        separatorColor: token.colorTextTertiary,
      },
      Descriptions: {
        labelBg: token.colorFillAlter,
        labelColor: token.colorTextSecondary,
        titleColor: token.colorTextHeading,
        contentColor: token.colorText,
        extraColor: token.colorTextSecondary,
        itemPaddingBottom: COMPANY_SPACE[12],
      },
      Divider: {
        verticalMarginInline: COMPANY_SPACE[12],
      },
      Form: {
        labelRequiredMarkColor: token.colorError,
        labelColor: token.colorTextLabel,
        labelFontSize: 14,
        labelHeight: 22,
        verticalLabelPadding: `0 0 ${COMPANY_SPACE[8]}px`,
        verticalLabelMargin: 0,
        itemMarginBottom: COMPANY_SPACE[16],
      },
      Statistic: {
        titleFontSize: 14,
        contentFontSize: 24,
      },
      Timeline: {
        tailColor: token.colorBorderSecondary,
        tailWidth: 1,
        dotBorderWidth: 2,
        dotSize: 8,
        itemPaddingBottom: COMPANY_SPACE[16],
      },
      Tooltip: {
        maxWidth: 240,
        zIndexPopup: 1070,
      },
      Alert: {
        defaultPadding: `${COMPANY_SPACE[9]}px ${COMPANY_SPACE[12]}px`,
        withDescriptionPadding: `${COMPANY_SPACE[16]}px`,
        withDescriptionIconSize: 20,
      },
      Upload: {
        actionsColor: token.colorPrimary,
      },
    },
  };
}

export function getCompanyCssVariables(mode: ThemeMode = DEFAULT_MODE) {
  return {
    ...Object.fromEntries(Object.values(COMPANY_SPACE).map((value) => [`--company-space-${value}px`, `${value}px`])),
    '--company-ai-color': color('AI配色/AI 默认', mode),
    '--company-ai-soft': color('Reminder 提醒/Blue-1', mode),
    '--company-ai-border': color('Reminder 提醒/Blue-3', mode),
    '--company-page-bg': color('Gray 中性/gray-3白背景hover', mode),
    '--company-surface': color('Gray 中性/gray-1', mode),
    '--company-surface-muted': color('Gray 中性/gray-2', mode),
    '--company-fill': color('Gray 中性/gray-3白背景hover', mode),
    '--company-text': color('text&iocn/gray-9', mode),
    '--company-text-secondary': color('text&iocn/gray-8', mode),
    '--company-text-tertiary': color('text&iocn/gray-7', mode),
    '--company-text-disabled': color('text&iocn/gray-6', mode),
    '--company-bg-hover': color('Gray 中性/gray-3白背景hover', mode),
    '--company-border': color('Gray 中性/gray-5-边框', mode),
    '--company-divider': color('Gray 中性/gray-4-分割线', mode),
    '--company-brand': color('Brand 品牌/p6', mode),
    '--company-brand-soft': color('Brand 品牌/p1', mode),
    '--company-brand-light': color('Brand 品牌/p2', mode),
    '--company-brand-hover': color('Brand 品牌/p5', mode),
    '--company-brand-active': color('Brand 品牌/p7', mode),
    '--company-brand-mid': color('Brand 品牌/p4', mode),
    '--company-success': color('Success 安全/Green-6', mode),
    '--company-success-soft': color('Success 安全/Green-1', mode),
    '--company-success-text': color('Success 安全/Green-7', mode),
    '--company-high-risk': color('High risk 高危/Orange red-6', mode),
    '--company-warning': color('Medium risk 警告/Orange-6', mode),
    '--company-warning-soft': color('Medium risk 警告/Orange-1', mode),
    '--company-warning-text': color('Medium risk 警告/Orange-7', mode),
    '--company-low-risk': color('Low risk 低危/Yellow-6', mode),
    '--company-info': color('Reminder 提醒/Blue-6', mode),
    '--company-info-soft': color('Reminder 提醒/Blue-1', mode),
    '--company-info-text': color('Reminder 提醒/Blue-7', mode),
    '--company-danger': color('Serious 严重/Red-6', mode),
    '--company-danger-soft': color('Serious 严重/Red-1', mode),
    '--company-danger-text': color('Serious 严重/Red-7', mode),
    '--company-dark': color('text&iocn/gray-9', mode),
    '--company-focus-shadow': effect('Focus Shadow/Default 默认', mode),
    '--company-card-shadow': effect('投影/投影-默认', mode),
    '--company-super-sender-shadow': effect('投影/超级框hover阴影', mode),
    '--company-search-bar-shadow': '0 9px 28px 8px rgba(0, 58, 112, 0.05), 0 6px 16px rgba(0, 58, 112, 0.08), 0 3px 6px -4px rgba(0, 58, 112, 0.12)',
    '--company-mask': colorWithAlpha('Gray 中性/gray-10', 0.3, mode),
    '--company-radius-2': `${radius('圆角 2px', mode)}px`,
    '--company-radius-4': `${radius('圆角 4px', mode)}px`,
    '--company-radius-6': `${radius('圆角6px', mode)}px`,
    '--company-radius-8': `${radius('圆角 8px', mode)}px`,
    '--company-radius-12': `${radius('圆角 12px', mode)}px`,
    '--company-radius-16': `${radius('圆角 16px', mode)}px`,
    '--company-radius-20': `${radius('圆角 20px', mode)}px`,
    '--company-radius-left': radiusCorners('左侧圆角 6px', mode),
    '--company-radius-right': radiusCorners('右侧圆角 6px', mode),
    '--company-radius-xs': `${radius('圆角 2px', mode)}px`,
    '--company-radius-sm': `${radius('圆角 4px', mode)}px`,
    '--company-radius-md': `${radius('圆角6px', mode)}px`,
    '--company-radius-lg': `${radius('圆角 8px', mode)}px`,
    '--company-radius-xl': `${radius('圆角 12px', mode)}px`,
    '--company-radius-2xl': `${radius('圆角 16px', mode)}px`,
    '--company-radius-3xl': `${radius('圆角 20px', mode)}px`,
    '--company-radius-full': `${radius('圆角 全圆角 256000', mode)}px`,
    '--company-radius-circle': '50%',
    '--company-container-radius': `${radius('圆角 8px', mode)}px`,
    '--company-card-radius': `${radius('圆角 8px', mode)}px`,
  } as CSSProperties;
}
