# 银行智能AI助手 - 响应式设计文档

## 概述

本系统已全面优化响应式设计，确保在不同设备和屏幕尺寸上都能提供良好的用户体验。

## 响应式断点

### Tailwind CSS 断点
- **sm**: 640px+ (小型设备 - 手机横屏)
- **md**: 768px+ (平板设备)
- **lg**: 1024px+ (笔记本电脑)
- **xl**: 1280px+ (桌面显示器)
- **2xl**: 1536px+ (大屏显示器)

## 核心组件响应式优化

### 1. 三栏布局 (ThreeColumnLayout)

**移动端 (< 768px)**
- 侧边栏和固定面板改为抽屉式设计
- 顶部显示菜单按钮和固定面板按钮
- 点击遮罩层关闭抽屉
- 主内容区占据全部宽度

**平板端 (768px - 1024px)**
- 保持三栏布局
- 可通过收起按钮隐藏侧栏
- 列宽适配屏幕尺寸

**桌面端 (> 1024px)**
- 完整三栏布局
- 支持拖拽调整列宽
- 侧边栏: 200-400px
- 固定面板: 280-600px

### 2. 页面头部 (Header)

**移动端优化**
- 缩小Logo和图标尺寸
- 隐藏副标题文字
- 压缩按钮间距
- 隐藏"系统在线"状态

**平板/桌面端**
- 显示完整标题和描述
- 显示系统状态指示器
- 更宽松的间距

### 3. KPI卡片

**响应式网格**
```tsx
// 移动端: 1列
// 小屏设备: 2列
// 大屏设备: 4列
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
```

**文字和图标大小**
- 移动端: text-xs, w-3 h-3
- 桌面端: text-sm, w-5 h-5

### 4. 图表组件

**自适应高度**
```css
.recharts-responsive-container {
  min-height: 250px; /* 桌面端 */
}

@media (max-width: 640px) {
  .recharts-responsive-container {
    min-height: 200px; /* 移动端 */
  }
}
```

**图表容器**
- 使用 ResponsiveContainer 确保宽度自适应
- 移动端适当减小高度节省空间
- 字体和标签自动缩放

### 5. 表格组件

**移动端策略**

方案1: 横向滚动
```tsx
<ResponsiveTable>
  {/* 表格内容 */}
</ResponsiveTable>
```

方案2: 卡片列表
```tsx
<ResponsiveCardList
  data={items}
  renderCard={(item) => (
    {/* 卡片内容 */}
  )}
/>
```

**平板/桌面端**
- 正常表格显示
- 固定表头
- 悬停高亮行

### 6. AI问答界面

**移动端优化**
- 减小输入框最小高度
- 调整发送按钮尺寸
- 压缩卡片内边距
- 示例问题采用单列布局

**桌面端**
- 两列示例问题布局
- 更大的输入框和按钮
- 更宽松的间距

### 7. 固定面板

**移动端**
- 全屏抽屉
- 最大宽度90vw
- 从右侧滑入
- 半透明遮罩

**桌面端**
- 侧栏形式
- 可调整宽度
- 支持收起/展开

## 触摸优化

### 触摸目标尺寸
```css
@media (hover: none) and (pointer: coarse) {
  .touch-larger {
    min-height: 44px !important;
    min-width: 44px !important;
  }
}
```

### 交互优化
- 所有可点击元素至少44x44px
- 增加按钮间距避免误触
- 使用更大的拖拽手柄

## 字体和间距

### 响应式文字大小
- 标题: text-sm sm:text-base lg:text-lg
- 正文: text-xs sm:text-sm
- 数值: text-lg sm:text-xl lg:text-2xl

### 响应式间距
- 内边距: p-3 sm:p-4 lg:p-6
- 外边距: gap-3 sm:gap-4 lg:gap-6
- 卡片间距: space-y-3 sm:space-y-4 lg:space-y-6

## 测试设备建议

### 移动设备
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- Samsung Galaxy S21 (360x800)

### 平板设备
- iPad (768x1024)
- iPad Pro 11" (834x1194)

### 桌面设备
- MacBook Air 13" (1440x900)
- 1080p显示器 (1920x1080)
- 4K显示器 (3840x2160)

## 性能优化

### 图片和图标
- 使用SVG图标
- 懒加载大图
- 响应式图片尺寸

### 渲染优化
- 虚拟滚动长列表
- 条件渲染隐藏组件
- 防抖滚动事件

### 网络优化
- 移动端减少数据请求
- 压缩传输数据
- 使用缓存策略

## 浏览器兼容性

### 现代浏览器
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 移动浏览器
- iOS Safari 14+
- Chrome Mobile
- Samsung Internet

## 可访问性

### 屏幕阅读器
- 语义化HTML标签
- ARIA标签
- 焦点管理

### 键盘导航
- Tab键导航
- 快捷键支持
- 焦点可见性

### 颜色对比
- WCAG AA标准
- 至少4.5:1对比度
- 色盲友好配色

## 开发建议

### 移动优先
```tsx
// ❌ 错误
className="w-full lg:w-1/2"

// ✅ 正确
className="w-full lg:w-1/2"
```

### 使用断点
```tsx
// 使用Tailwind断点
className="text-sm md:text-base lg:text-lg"

// 避免固定尺寸
// ❌ width="300px"
// ✅ className="w-full max-w-md"
```

### 测试
- 开发时使用浏览器DevTools移动视图
- 定期在真机上测试
- 使用Lighthouse检查性能

## 未来改进

### 计划中的优化
- [ ] PWA支持
- [ ] 离线功能
- [ ] 手势操作
- [ ] 深色/浅色主题切换
- [ ] 字体大小调节
- [ ] 高对比度模式

### 持续监控
- 页面加载时间
- 首次内容绘制(FCP)
- 最大内容绘制(LCP)
- 累积布局偏移(CLS)
