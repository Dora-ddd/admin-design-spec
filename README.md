# admin-design-spec

后台工程底座与设计规范组件仓库。

## 仓库边界

- `main`：稳定后台底座和公共包，不包含规范预览页面。
- `preview/showroom`：产品样板间、AI 工作台和组件规范预览。
- `feature/*`：从 `main` 创建的业务功能分支。

## 本地启动

```bash
pnpm install
pnpm dev
```

默认地址：`http://localhost:4173/`。

## 创建业务分支

不要在 `main` 或预览 Worktree 中直接开发业务页面。执行：

```bash
pnpm worktree:create feature/asset-config ../admin-asset-config
```

脚本会以最新的 `origin/main` 创建独立分支和目录。进入新目录后运行：

```bash
pnpm install --frozen-lockfile
pnpm dev
```

现有 Worktree 可通过 `pnpm worktree:list` 查看。

## 目录

```text
apps/admin       后台应用底座
packages/ui      可复用组件
packages/theme   MasterGo 主题变量与 Ant Design Token
packages/charts  图表组件
scripts          Worktree 与仓库协作脚本
docs             开发与分支约定
```

预览和业务分支使用方法见 `docs/getting-started.md` 与 `docs/branch-policy.md`。
