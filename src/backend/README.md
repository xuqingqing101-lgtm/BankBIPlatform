# 🏦 银行智能AI分析平台 - 后端服务

## ⚡ 快速启动

### 1️⃣ 启动后端

**双击运行或在命令行执行：**

```bash
RUN.bat
```

### 2️⃣ 等待启动完成

**看到以下内容表示成功：**

```
🏦 银行智能AI分析平台已启动
Mapped "{[/health],methods=[GET]}" onto ...
```

✅ **保持窗口打开！**

### 3️⃣ 测试连接

**新开命令行窗口：**

```bash
curl http://localhost:8080/api/health
```

**应该返回：**
```json
{
  "status": "UP",
  "message": "银行智能AI分析平台运行正常"
}
```

### 4️⃣ 使用前端

- 打开前端页面
- 按 `Ctrl + Shift + R` 强制刷新
- 开始使用！

---

## 📋 所有脚本

| 脚本 | 功能 | 使用场景 |
|------|------|----------|
| `RUN.bat` | ⭐ 启动后端 | **日常启动** |
| `START-BACKEND.bat` | 清理+编译+启动 | 首次启动或代码修改后 |
| `TEST-CONNECTION.bat` | 测试所有API | 验证后端是否正常 |
| `FIX-CONNECTION.bat` | 自动修复 | 遇到问题时 |
| `diagnose-connection.bat` | 诊断工具 | 查找问题原因 |

---

## 🔧 常见问题

### ❌ 前端显示 "Failed to fetch"

**原因：** 后端没有启动

**解决：**
```bash
cd backend
RUN.bat
```

---

### ❌ 端口8080被占用

**自动解决：** `RUN.bat` 会自动释放端口

**手动解决：**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

### ❌ Java未安装

**下载JDK 17：**
- https://adoptium.net/
- 选择 JDK 17 (LTS)
- 安装后配置环境变量

---

### ❌ 编译失败

**完全清理：**
```bash
rmdir /s /q target
mvn clean compile
mvn spring-boot:run
```

---

## 🧪 测试工具

### 测试单个端点

```bash
# 健康检查
curl http://localhost:8080/api/health

# 欢迎页
curl http://localhost:8080/api/

# AI对话
curl -X POST http://localhost:8080/api/ai/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"测试\",\"module\":\"deposit\"}"
```

### 测试所有端点

```bash
TEST-CONNECTION.bat
```

---

## 📊 技术栈

- **框架：** Spring Boot 3.2.0
- **JDK：** 17
- **数据库：** H2 (内存数据库)
- **AI：** HiAgent (字节跳动)

---

## 🏗️ 项目结构

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/bank/bi/
│   │   │   ├── controller/      # API控制器
│   │   │   ├── service/         # 业务逻辑
│   │   │   ├── entity/          # 数据实体
│   │   │   ├── repository/      # 数据访问
│   │   │   ├── dto/             # 数据传输对象
│   │   │   └── config/          # 配置类
│   │   └── resources/
│   │       ├── application.yml  # 配置文件
│   │       └── data.sql         # 初始数据
│   └── test/                    # 测试代码
├── pom.xml                      # Maven配置
├── RUN.bat                      # 启动脚本
└── README.md                    # 本文档
```

---

## 🔌 API端点

### 基础

- `GET /api/` - 欢迎页
- `GET /api/health` - 健康检查

### 认证

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/health` - 认证服务健康检查

### AI对话

- `POST /api/ai/chat` - AI对话
- `GET /api/ai/conversations` - 获取对话列表
- `GET /api/ai/conversations/{id}` - 获取对话详情
- `DELETE /api/ai/conversations/{id}` - 删除对话

### Pin面板

- `GET /api/panel/items` - 获取所有Pin项
- `POST /api/panel/items` - 创建Pin项
- `PUT /api/panel/items/{id}` - 更新Pin项
- `DELETE /api/panel/items/{id}` - 删除Pin项

### 业务模块

#### 存款业务
- `GET /api/deposit/summary` - 存款概览
- `GET /api/deposit/trend` - 存款趋势
- `GET /api/deposit/structure` - 存款结构

#### 贷款业务
- `GET /api/loan/summary` - 贷款概览
- `GET /api/loan/quality` - 资产质量
- `GET /api/loan/risk` - 风险指标

#### 中间业务
- `GET /api/intermediate/summary` - 中间业务概览
- `GET /api/intermediate/income` - 收入分析

#### 客户画像
- `GET /api/customer/overview` - 客户概览
- `GET /api/customer/segments` - 客户分群
- `GET /api/customer/value` - 客户价值

#### 经营管理
- `GET /api/management/dashboard` - 管理驾驶舱
- `GET /api/management/kpi` - 关键指标

### 知识库
- `GET /api/knowledge/documents` - 获取文档列表
- `GET /api/knowledge/documents/{id}` - 获取文档详情
- `POST /api/knowledge/search` - 搜索文档

---

## 🔐 环境变量

### HiAgent配置

```bash
# 设置HiAgent API密钥
set HIAGENT_API_KEY=your-api-key-here

# 启动
RUN.bat
```

---

## 🐛 故障排查

### 1. 检查Java版本

```bash
java -version
```

应该显示 `17.x.x`

### 2. 检查端口

```bash
netstat -ano | findstr :8080
```

### 3. 查看日志

启动时查看命令行输出的错误信息

### 4. 运行诊断

```bash
diagnose-connection.bat
```

### 5. 完全重置

```bash
rmdir /s /q target
mvn clean
mvn compile
mvn spring-boot:run
```

---

## 📚 相关文档

- **启动指南：** `/HOW_TO_START.md`
- **快速修复：** `/QUICK_FIX.md`
- **故障排查：** `/FIX_FETCH_ERROR.md`

---

## 💡 开发提示

### 修改代码后

```bash
# 停止服务 (Ctrl+C)
# 重新启动
RUN.bat
```

### 清理编译缓存

```bash
mvn clean
```

### 跳过测试启动

```bash
mvn spring-boot:run -DskipTests
```

---

## ✅ 启动检查清单

- [ ] Java 17已安装
- [ ] Maven已安装
- [ ] 端口8080未被占用
- [ ] 运行 `RUN.bat`
- [ ] 看到 "银行智能AI分析平台已启动"
- [ ] 看到 "Mapped" 字样
- [ ] `curl http://localhost:8080/api/health` 成功
- [ ] 前端可以连接

---

**现在就启动：**

```bash
RUN.bat
```

**祝使用愉快！** 🎉
