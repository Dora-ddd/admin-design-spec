# 页面开发

业务页面放在 `apps/admin/src/pages/<module>/`，模块内维护页面组件、类型、服务和 Mock 数据。

```text
pages/example/
├── index.tsx
├── components/
├── service.ts
├── types.ts
├── constants.ts
└── mock.ts
```

页面优先调用 `@company/ui`、`@company/theme` 和 `@company/charts` 的公共接口，不复制公共组件样式。
