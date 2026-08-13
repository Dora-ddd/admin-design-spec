# 分支约定

## 长期分支

- `main`：稳定、可运行、可作为业务分支起点。
- `preview/showroom`：仅承载规范和产品预览应用，定期合并 `main`。

## 临时分支

- `feature/*`：业务功能。
- `fix/*`：缺陷修复。
- `demo/*`：客户或场景演示。
- `release/*`：对外交付版本。

公共组件和主题修改必须先通过独立分支合入 `main`，再由 `preview/showroom` 合并 `main`。禁止将整个预览分支反向合并到 `main`。
