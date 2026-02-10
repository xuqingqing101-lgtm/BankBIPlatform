# 🏦 银行智能AI分析平台

> 基于 Spring Boot + React + HiAgent 的智能银行业务分析系统

---

## ❌ 看到 "No plugin found for prefix 'spring-boot'" 错误？

### 🎯 原因：你在错误的目录运行了命令！

**立即解决（3选1）：**

1. **双击运行：** `智能启动.bat` ⭐ 推荐
2. **查看说明：** [错误说明.html](错误说明.html) 📖 图文详解
3. **手动操作：** `cd backend && mvn spring-boot:run`

---

## 🚀 快速开始

### 🎯 方式1：仅使用前端（推荐新手）

**✅ 当前已可用！无需任何配置！**

- 所有界面功能完全可用
- 使用模拟数据展示业务逻辑
- 支持完整的交互和可视化
- 零配置即用

💡 右下角显示"演示模式"是正常的，直接使用即可！

---

### 🎯 方式2：启动完整项目（前端+后端）

如需连接真实AI服务：

#### ⚡ 一键启动（最简单）

**双击运行：**
```
后端快速启动.bat
```

**或命令行：**
```bash
cd backend
fix-and-run.bat
```

#### ✅ 启动成功后

1. 保持后端窗口打开
2. 刷新前端页面（Ctrl + Shift + R）
3. 右下角显示 "🟢 AI服务已连接"

---

## 📚 完整文档

| 文档 | 说明 |
|------|------|
| **[启动中心.html](启动中心.html)** | 🎨 图形化启动指南（推荐） |
| **[开始使用.md](开始使用.md)** | 🚀 快速上手指南 |
| **[本地运行指南.md](本地运行指南.md)** | 📖 完整的本地运行说明 |
| **[编译错误已修复.md](编译错误已修复.md)** | 🔧 编译问题解决方案 |
| **[当前状态说明.md](当前状态说明.md)** | 📊 项目当前状态 |
| **[backend/README.md](backend/README.md)** | 🏗️ 后端详细文档 |

---

## 🎨 功能特性

### ✅ 5+1 业务模块架构

1. **存款业务分析** - 对公存款、零售存款数据分析
2. **贷款业务分析** - 贷款数据、风险指标、资产质量
3. **中间业务分析** - 中间业务收入、结构分析
4. **客户画像分析** - 客户分群、价值分析、行为洞察
5. **经营管理驾驶舱** - 综合业务仪表盘、KPI监控
6. **知识库档案管理** - 文档管理、知识搜索

### 🤖 AI智能问答系统

- ✅ 多轮对话支持
- ✅ 上下文记忆
- ✅ 实时AI响应（需后端）
- ✅ 模块化问答

### 📌 Pin面板系统

- ✅ 固定重要数据卡片
- ✅ 拖拽自由排版
- ✅ 持久化存储
- ✅ 灵活布局

### 🎨 现代化UI

- ✅ 深色主题设计
- ✅ AI助手风格界面
- ✅ 流畅动画效果
- ✅ 响应式布局

### 📊 数据可视化

- ✅ 实时更新图表
- ✅ 多种图表类型（折线、柱状、饼图等）
- ✅ 交互式仪表盘
- ✅ 数据卡片系统

---

## 🛠️ 技术栈

### 前端
- **框架：** React 18
- **样式：** Tailwind CSS v4
- **图表：** Recharts
- **状态管理：** React Hooks
- **动画：** Motion (Framer Motion)
- **图标：** Lucide React

### 后端
- **框架：** Spring Boot 3.2.2
- **JDK：** 17
- **数据库：** H2（开发）/ PostgreSQL（生产）
- **认证：** JWT
- **AI服务：** HiAgent（字节跳动）
- **工具库：** Lombok, Hutool

---

## 📋 前提条件

### 仅使用前端
- ✅ **无需任何条件**，直接使用即可

### 使用完整项目
- ☑️ **JDK 17**：https://adoptium.net/
- ☑️ **Maven**：https://maven.apache.org/download.cgi
- ☑️ **HiAgent API Key**（可选）：用于真实AI服务

**验证安装：**
```bash
java -version    # 应显示 17.x.x
mvn -version     # 应显示 Maven 版本
```

---

## 🚦 启动方式对比

| 方式 | 优点 | 适用场景 |
|------|------|----------|
| **仅前端** | 零配置、立即可用 | 演示、测试UI、快速预览 |
| **完整项目** | 真实AI、完整功能 | 开发、完整体验、生产环境 |

---

## 🔧 常用脚本

### 一键启动

```bash
# 方式1：双击文件
后端快速启动.bat

# 方式2：命令行
cd backend
fix-and-run.bat
```

### 标准启动

```bash
cd backend
RUN.bat
```

### 诊断问题

```bash
cd backend
diagnose-connection.bat
```

### 测试API

```bash
cd backend
TEST-CONNECTION.bat
```

---

## 🆘 遇到问题？

### 🎨 图形化帮助（推荐）
- **[快速帮助.html](快速帮助.html)** - 根据错误类型快速找到解决方案

### 📝 文档帮助
- **[快速帮助.md](快速帮助.md)** - 常见问题和解决方案
- **[Maven插件错误解决方案.md](Maven插件错误解决方案.md)** - Maven相关问题

### 🔧 自动诊断
```bash
# 双击运行
环境诊断.bat
```

---

### Q: 右下角显示"演示模式"？

**A:** 这是正常的！表示前端在使用模拟数据运行。

- ✅ 所有功能都可以正常使用
- ✅ 适合演示和测试
- 🔧 如需真实AI服务，启动后端即可

---

### Q: 遇到编译错误？

**A:** 使用一键启动脚本自动修复：

```bash
后端快速启动.bat
```

详见：[编译错误已修复.md](编译错误已修复.md)

---

### Q: 端口8080被占用？

**A:** 一键启动脚本会自动释放端口

或手动释放：
```bash
netstat -ano | findstr :8080
taskkill /PID <PID号> /F
```

---

### Q: 我需要启动后端吗？

**A:** **不需要！** 除非你想：

- ✅ 使用真实的 HiAgent AI 服务
- ✅ 连接真实的数据库
- ✅ 测试完整的前后端集成
- ✅ 开发和调试后端API

演示和测试前端功能只需前端即可。

---

## 📁 项目结构

```
银行智能AI分析平台/
├── components/              # React 组件
│   ├── AIQueryBox.tsx       # AI问答组件
│   ├── PinnedDashboard.tsx  # Pin面板
│   ├── ExecutiveDashboard.tsx  # 经营管理驾驶舱
│   └── ...                  # 其他业务组件
│
├── lib/
│   ├── api.ts               # API调用（自动降级）
│   └── utils.ts             # 工具函数
│
├── styles/
│   └── globals.css          # 全局样式
│
├── App.tsx                  # 主应用入口
├── 启动中心.html            # 图形化启动指南 ⭐
├── 开始使用.md              # 快速上手指南 ⭐
├── 本地运行指南.md          # 完整运行说明 ⭐
├── 后端快速启动.bat         # 一键启动脚本 ⭐
│
└── backend/                 # 后端服务（可选）
    ├── src/
    │   ├── main/
    │   │   ├── java/com/bank/bi/
    │   │   │   ├── controller/      # API控制器
    │   │   │   ├── service/         # 业务逻辑
    │   │   │   ├── model/           # 数据模型
    │   │   │   └── config/          # 配置
    │   │   └── resources/
    │   │       ├── application.yml  # 配置文件
    │   │       └── data.sql         # 初始数据
    │   └── test/
    │
    ├── pom.xml              # Maven配置
    ├── fix-and-run.bat      # 修复并启动 ⭐
    ├── RUN.bat              # 快速启动
    └── README.md            # 后端文档
```

---

## 🎯 API端点

后端启动后可访问以下API：

### 基础
- `GET /api/` - 欢迎页
- `GET /api/health` - 健康检查

### AI对话
- `POST /api/ai/chat` - AI对话
- `GET /api/ai/conversations` - 获取对话列表

### Pin面板
- `GET /api/panel/items` - 获取Pin项
- `POST /api/panel/items` - 创建Pin项

### 业务模块
- 存款业务：`/api/deposit/*`
- 贷款业务：`/api/loan/*`
- 中间业务：`/api/intermediate/*`
- 客户画像：`/api/customer/*`
- 经营管理：`/api/management/*`
- 知识库：`/api/knowledge/*`

详见：[API_MAPPING.md](API_MAPPING.md)

---

## 🚀 部署

### 前端部署

前端可部署到任何静态托管服务：
- Vercel
- Netlify
- GitHub Pages
- 自建 Nginx

### 后端部署

```bash
# 1. 打包
cd backend
mvn clean package -DskipTests

# 2. 运行
java -jar target/bi-platform-1.0.0.jar

# 3. 配置环境变量
export SPRING_PROFILES_ACTIVE=prod
export HIAGENT_API_KEY=your-key
```

---

## 🎓 学习资源

### 新手入门
1. 打开 [启动中心.html](启动中心.html) - 图形化指南
2. 阅读 [开始使用.md](开始使用.md) - 快速上手
3. 直接使用前端体验功能

### 开发者
1. 阅读 [本地运行指南.md](本地运行指南.md) - 完整说明
2. 查看 [backend/README.md](backend/README.md) - 后端文档
3. 参考 [API_MAPPING.md](API_MAPPING.md) - API文档

---

## 📞 获取帮助

### 🔍 查找问题

| 问题类型 | 查看文档 |
|---------|----------|
| 启动问题 | [本地运行指南.md](本地运行指南.md) |
| 编译错误 | [编译错误已修复.md](编译错误已修复.md) |
| 后端问题 | [backend/README.md](backend/README.md) |
| 功能说明 | [当前状态说明.md](当前状态说明.md) |

### 🛠️ 自动诊断

```bash
cd backend
diagnose-connection.bat
```

---

## ✅ 总结

### 最简单的使用方式

**前端已配置好自动降级机制：**

- ✅ 无需安装任何依赖
- ✅ 无需启动后端
- ✅ 所有功能都可用
- ✅ 使用模拟数据展示

**现在就可以使用！**

---

### 完整体验（可选）

如需真实AI服务：

1. 双击 `后端快速启动.bat`
2. 等待启动完成
3. 刷新前端页面

**3步完成！**

---

## 🎉 开始使用

### 新手推荐路径

1. **直接使用前端** - 无需任何操作
2. **体验所有功能** - 使用模拟数据
3. **需要AI时** - 双击 `后端快速启动.bat`

### 开发者路径

1. **查看** [启动中心.html](启动中心.html)
2. **阅读** [本地运行指南.md](本地运行指南.md)
3. **启动** 完整项目

---

## 📄 许可证

本项目仅供学习和演示使用。

---

## 🙏 致谢

- Spring Boot Team
- React Team
- 字节跳动 HiAgent
- 所有开源贡献者

---

**祝使用愉快！** 🎉

*最后更新：2026-02-09*

---

## 🔗 快速链接

- 🎨 [启动中心（图形化）](启动中心.html)
- 🚀 [开始使用](开始使用.md)
- 📖 [完整运行指南](本地运行指南.md)
- 🔧 [编译问题解决](编译错误已修复.md)
- 📊 [当前状态](当前状态说明.md)
- 🏗️ [后端文档](backend/README.md)
