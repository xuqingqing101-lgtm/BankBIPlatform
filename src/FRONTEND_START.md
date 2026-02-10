# 🎨 前端访问指南

## ✅ 好消息！

**前端已经在Figma Make中运行！**

这是一个基于Figma Make的项目，前端代码已经完全准备好了，你现在就可以访问！

---

## 🚀 如何访问前端

### 方法1: Figma Make自动运行 ⭐ **最简单**

**前端已经在运行了！**

1. 如果你在Figma Make环境中：
   - 前端应该已经自动启动
   - 查看Figma Make的预览窗口

2. 或者点击Figma Make的"预览"按钮

---

## 🔌 连接后端API

前端需要连接到后端API（http://localhost:8080/api）

### 创建API配置文件

我将创建一个API配置文件来连接后端。

---

## 📋 前端功能清单

### ✅ 已实现的功能

1. **AI聊天界面**
   - 多轮对话支持
   - 实时响应
   - 字节HiAgent集成

2. **5+1业务模块**
   - 存款业务分析
   - 贷款业务分析
   - 中间业务分析
   - 客户画像分析
   - 经营管理驾驶舱
   - 知识库档案管理

3. **Pin功能**
   - 固定答案到面板
   - 拖拽排版
   - 实时数据更新
   - 可调整大小

4. **三栏布局**
   - 左侧：导航栏
   - 中间：主内容区
   - 右侧：固定面板

5. **响应式设计**
   - 支持桌面端
   - 深色主题
   - 现代化AI助手界面

---

## 🎯 前端主要文件

| 文件 | 说明 |
|------|------|
| `/App.tsx` | 主应用入口 |
| `/components/BankChatInterface.tsx` | AI聊天界面 |
| `/components/PinnedDashboard.tsx` | Pin面板 |
| `/components/AssistantSidebar.tsx` | 侧边栏导航 |
| `/components/ThreeColumnLayout.tsx` | 三栏布局 |
| `/components/ModuleLayout.tsx` | 模块布局 |

---

## 📡 API连接配置

前端将连接到：

```
后端地址: http://localhost:8080/api
```

**主要API端点：**
- POST `/api/ai/chat` - AI聊天
- GET `/api/ai/conversations` - 获取对话列表
- POST `/api/panel/item` - 创建Pin
- GET `/api/panel/items` - 获取Pin列表

---

## 🧪 测试前端

### 1. 查看预览

在Figma Make中查看应用预览

### 2. 测试功能

1. **测试AI聊天**
   - 在首页输入问题
   - 查看AI回复

2. **测试模块导航**
   - 点击左侧导航栏
   - 访问各个业务模块

3. **测试Pin功能**
   - 在AI回答中点击"Pin"按钮
   - 查看右侧固定面板
   - 点击"我的面板"查看全屏

4. **测试拖拽**
   - 在固定面板中拖拽卡片
   - 调整卡片大小

---

## 🔧 如果前端无法连接后端

### 检查1: 后端是否运行

```bash
curl http://localhost:8080/api/health
```

应该返回：
```json
{"status":"UP","message":"银行智能AI分析平台运行正常"}
```

### 检查2: CORS配置

后端已经配置了CORS，允许跨域访问。

### 检查3: API地址

确保API_BASE_URL正确配置为 `http://localhost:8080/api`

---

## 📱 前端界面预览

### 首页 - AI聊天界面
- 深色主题
- AI聊天输入框
- 多轮对话支持
- Pin按钮

### 业务模块页面
- 存款业务分析
- 贷款业务分析
- 中间业务分析
- 客户画像分析
- 经营管理驾驶舱
- 知识库档案管理

### 我的面板
- 固定的数据卡片
- 可拖拽排版
- 实时数据更新
- 可调整大小

---

## 🎨 前端技术栈

- **框架**: React + TypeScript
- **UI库**: shadcn/ui
- **样式**: Tailwind CSS v4
- **图标**: Lucide React
- **图表**: Recharts
- **状态**: React Hooks + localStorage

---

## 🆘 常见问题

### Q: 前端在哪里？
**A:** 前端已经在Figma Make环境中运行，查看预览窗口。

### Q: 如何启动前端？
**A:** 前端自动运行，无需手动启动。

### Q: API连接失败怎么办？
**A:** 
1. 确保后端运行：`cd backend && RUN.bat`
2. 检查后端地址：`http://localhost:8080/api/health`
3. 查看浏览器控制台错误信息

### Q: 如何查看前端代码？
**A:** 所有前端文件在项目根目录：
- `/App.tsx` - 主入口
- `/components/` - 组件目录
- `/styles/globals.css` - 全局样式

---

## ✨ 下一步

1. ✅ **后端已启动** - 完成
2. ✅ **前端已存在** - 完成
3. 🔜 **连接API** - 即将完成
4. 🔜 **测试功能** - 准备开始

---

**前端已准备就绪！** 🎉

**查看Figma Make预览窗口即可使用！** 🚀
