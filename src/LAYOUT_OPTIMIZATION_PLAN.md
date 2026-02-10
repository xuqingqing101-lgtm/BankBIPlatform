# 页面布局优化方案

## 问题分析

当前页面结构：
```tsx
<ModuleLayout>  // 有 overflow-y-auto
  <div className="space-y-6">  // 普通div，无高度限制
    <AIInsights />
    <MultiRoundAIQuery max-h-[800px] />  // 对话框
    <KPI Cards />
    <Charts />
  </div>
</ModuleLayout>
```

**问题：** 
- 多轮对话后，MultiRoundAIQuery会变高（最高800px）
- 其他组件会被推到下方
- 页面需要滚动很长才能看到所有内容
- 用户体验不佳

## 优化方案

### 方案1：调整MultiRoundAIQuery最大高度（推荐）✅

将MultiRoundAIQuery的max-h从800px降低到600px，确保：
1. 对话框不会占据过多屏幕空间
2. 其他组件更容易被看到
3. 页面滚动距离合理

### 方案2：优化页面布局顺序

考虑将MultiRoundAIQuery放在页面底部：
```tsx
<div className="space-y-6">
  <AIInsights />
  <KPI Cards />
  <Charts />
  <MultiRoundAIQuery />  // 放最后
</div>
```

好处：
- 用户首先看到数据和图表
- 问数框在底部，不影响数据查看
- 符合"先看数据，后问问题"的逻辑

### 方案3：使用固定布局（不推荐）

使用Grid布局将对话框固定在右侧：
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    <AIInsights />
    <KPI Cards />
    <Charts />
  </div>
  <div className="lg:col-span-1">
    <MultiRoundAIQuery />
  </div>
</div>
```

缺点：
- 对话框空间太小
- 移动端体验不好
- 复杂度增加

## 最终方案

采用 **方案1 + 方案2 的组合**：

1. ✅ 降低MultiRoundAIQuery最大高度：800px → 600px
2. ✅ 调整页面组件顺序，将MultiRoundAIQuery放在更合适的位置
3. ✅ 保持现有的overflow-y-auto滚动机制

这样既保证了对话框的可用性，又确保了其他组件的可见性。
