# 开始使用

## 环境

- Node.js 20 或更高版本
- pnpm 11.19.0

## 安装与构建

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm dev
```

## 创建业务 Worktree

```bash
pnpm worktree:create feature/example ../admin-example
cd ../admin-example
pnpm install --frozen-lockfile
pnpm dev -- --port 5174
```

脚本只接受 `feature/*`、`fix/*`、`demo/*` 和 `release/*` 分支，并始终从最新的 `origin/main` 创建。

## 使用预览 Worktree

预览分支不作为业务分支起点。首次检出：

```bash
git fetch origin
git worktree add ../admin-design-spec-preview preview/showroom
cd ../admin-design-spec-preview
pnpm install --frozen-lockfile
pnpm dev:preview
```

默认预览地址：

- 产品样板间：`http://localhost:5173/?page=showroom&sample=generic`
- AI 工作台：`http://localhost:5173/?page=workspace&sample=terminal`

## 提交前检查

```bash
pnpm check
git status --short
```
