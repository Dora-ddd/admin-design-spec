# 发布

1. 从已验收的 `main` 创建 `release/<version>`。
2. 执行 `pnpm install --frozen-lockfile`、`pnpm typecheck` 和 `pnpm build`。
3. 只接收发布阻断修复。
4. 验收完成后打版本标签并保留发布分支。
