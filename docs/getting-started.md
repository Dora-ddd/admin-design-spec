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
git fetch origin
git worktree add -b feature/example ../admin-example origin/main
cd ../admin-example
pnpm install
pnpm dev -- --port 5174
```
