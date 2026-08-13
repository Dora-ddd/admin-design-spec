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

## 同步预览分支

在预览 Worktree 中执行：

```bash
git fetch origin
git merge --no-edit origin/main
pnpm install --frozen-lockfile
pnpm check
git push origin preview/showroom
```

如果合并发生冲突，只处理预览应用与公共包接口之间的冲突；不得把 `apps/preview` 带回 `main`。

## Pull Request 约束

- `feature/*`、`fix/*` 的目标分支是 `main`。
- `main` 的公共能力更新可合入 `preview/showroom`。
- 不创建 `preview/showroom` 指向 `main` 的 Pull Request。
- 合入前必须通过 `pnpm check` 和 GitHub Actions `CI`。
