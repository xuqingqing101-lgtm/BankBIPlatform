# 🚀 完整启动指南

## 📋 前置检查

在开始之前，确保：

- ✅ JDK 17 已安装
- ✅ Maven 已安装
- ✅ 端口 8080 未被占用
- ✅ 端口 5173 未被占用（Figma Make）

---

## 🔧 第一步：修复并启动后端

### 1. 打开命令行

```bash
cd backend
```

### 2. 重新编译（必须！）

由于修改了Controller代码，必须重新编译：

```bash
REBUILD.bat
```

**这个脚本会：**
- 清理旧的编译文件
- 重新编译所有代码
- 启动Spring Boot应用

### 3. 等待启动完成

**成功标志：**

```
========================================
🏦 银行智能AI分析平台已启动
========================================
API地址: http://localhost:8080/api
H2控制台: http://localhost:8080/api/h2-console
========================================
```

### 4. ⚠️ 关键：检查Controller映射

**必须在日志中看到这些映射：**

```
Mapped "{[/],methods=[GET]}" onto com.bank.bi.controller.WelcomeController.welcome()
Mapped "{[/health],methods=[GET]}" onto com.bank.bi.controller.WelcomeController.health()
Mapped "{[/ai/chat],methods=[POST]}" onto ...
Mapped "{[/ai/conversations],methods=[GET]}" onto ...
Mapped "{[/panel/items],methods=[GET]}" onto ...
```

**如果没有看到这些映射，说明编译有问题，重新运行 `REBUILD.bat`！**

---

## ✅ 第二步：验证后端API

### 快速测试（使用测试脚本）

```bash
# 在backend目录下
quick-test.bat
```

### 手动测试

**测试1：欢迎页**
```bash
curl http://localhost:8080/api/
```

**应该返回：**
```json
{
  "application": "银行智能AI分析平台",
  "version": "1.0.0",
  "status": "running",
  ...
}
```

**测试2：健康检查**
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

**测试3：AI对话**
```bash
curl -X POST http://localhost:8080/api/ai/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"本月存款情况如何？\",\"module\":\"deposit\"}"
```

**应该返回：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "sessionId": "...",
    "response": "...",
    "conversationId": ...
  }
}
```

**测试4：Pin列表**
```bash
curl http://localhost:8080/api/panel/items
```

**应该返回：**
```json
{
  "code": 200,
  "message": "成功",
  "data": []
}
```

---

## 🎨 第三步：启动前端

前端应该已经在Figma Make环境中运行。

### 1. 在Figma Make预览窗口查看应用

或者访问：
```
http://localhost:5173
```

### 2. 测试前端功能

#### 测试AI对话
1. 进入任意业务模块（存款、贷款等）
2. 在AI聊天框输入问题，例如："本月存款情况如何？"
3. 点击发送
4. 应该看到AI回复

#### 测试Pin功能
1. 在AI回复上点击 "📌 Pin" 按钮
2. 应该弹出Pin选项
3. 选择"固定在此页"或其他位置
4. Pin应该出现在页面上
5. 可以拖拽Pin调整位置

---

## 🔍 第四步：验证前后端连接

### 1. 打开浏览器开发者工具

按 `F12` 打开开发者工具，切换到 **Network（网络）** 标签

### 2. 发送AI消息

在前端输入问题并发送，在Network标签应该看到：

**请求：**
```
POST http://localhost:8080/api/ai/chat
Status: 200 OK
```

**请求体：**
```json
{
  "query": "本月存款情况如何？",
  "module": "deposit"
}
```

**响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "sessionId": "...",
    "response": "...",
    ...
  }
}
```

### 3. 查看后端日志

在后端命令行窗口，应该看到：

```
INFO  用户1发送消息: 本月存款情况如何？
INFO  调用HiAgent API进行多轮对话
```

---

## 🎯 完整测试流程

### 场景1：存款业务分析

1. **进入存款模块**
2. **提问：** "本月存款余额是多少？"
3. **查看回复**
4. **Pin回复：** 点击📌按钮，固定在此页
5. **继续提问：** "哪个分行存款增长最快？"
6. **查看回复并Pin**
7. **拖拽排版：** 调整Pin的位置
8. **验证持久化：** 刷新页面，Pin应该还在

### 场景2：多模块联动

1. **在存款模块创建Pin**
2. **切换到贷款模块**
3. **在贷款模块创建Pin**
4. **切换到经营管理驾驶舱**
5. **应该看到所有模块的Pin**

---

## 📊 监控和调试

### 1. 后端日志

**正常日志：**
```
INFO  用户1发送消息: ...
INFO  调用HiAgent API进行多轮对话
INFO  AI响应成功，耗时: 1234ms
```

**错误日志：**
```
ERROR AI对话失败: ...
ERROR 获取Pin列表失败: ...
```

### 2. 前端控制台

**正常：**
```
API响应: {code: 200, message: "成功", data: {...}}
```

**错误（后端不可用）：**
```
AI聊天请求失败: Failed to fetch
使用模拟数据
```

### 3. 网络请求

**所有请求应该：**
- Status: 200 OK
- Type: fetch
- Size: 合理的数据大小
- Time: < 5s（AI请求可能较慢）

---

## ⚠️ 常见问题排查

### 问题1：后端404错误

**症状：**
```
GET http://localhost:8080/api/health → 404
```

**原因：** Controller没有注册

**解决：**
```bash
cd backend
# 停止服务 (Ctrl+C)
REBUILD.bat
# 查看启动日志，确认看到Controller映射
```

---

### 问题2：CORS错误

**症状：**
```
Access-Control-Allow-Origin 错误
```

**原因：** 
- 后端没有启动
- SecurityConfig配置问题（已修复）

**解决：**
1. 确认后端已启动
2. 检查后端日志是否有CORS相关错误

---

### 问题3：前端显示模拟数据

**症状：**
AI回复中显示：
```
💡 提示：后端服务暂时不可用，显示的是模拟数据。
```

**原因：** 前端无法连接到后端

**检查：**
1. 后端是否启动：`curl http://localhost:8080/api/health`
2. 端口是否正确：8080
3. 网络请求是否被阻止：查看浏览器控制台

**解决：** 启动后端或检查网络连接

---

### 问题4：Pin不显示

**可能原因：**
1. 后端API返回错误
2. 数据格式不匹配
3. 前端渲染错误

**调试步骤：**
1. 检查 `GET /api/panel/items` 是否返回200
2. 查看返回的数据格式
3. 检查浏览器控制台是否有JavaScript错误

---

### 问题5：AI不回复

**可能原因：**
1. HiAgent配置错误（API Key等）
2. 网络问题
3. 服务异常

**调试：**
1. 查看后端日志的错误信息
2. 检查HiAgent配置（`application.properties`）
3. 如果HiAgent不可用，系统应该返回错误信息

---

## 📁 关键文件位置

### 后端
```
backend/
├── src/main/java/com/bank/bi/
│   ├── controller/
│   │   ├── WelcomeController.java   ← 欢迎页和健康检查
│   │   ├── AuthController.java      ← 认证API
│   │   ├── AiController.java        ← AI对话API
│   │   └── PanelController.java     ← Pin管理API
│   ├── config/
│   │   └── SecurityConfig.java      ← CORS和安全配置
│   └── service/
│       ├── HiAgentService.java      ← AI服务
│       └── PanelService.java        ← Pin服务
├── REBUILD.bat                       ← 重新编译脚本
└── quick-test.bat                    ← API测试脚本
```

### 前端
```
/
├── App.tsx                          ← 主应用组件
├── lib/
│   └── api.ts                       ← API配置和请求函数
└── components/
    ├── ai-chat-interface.tsx        ← AI聊天组件
    └── pin-panel.tsx                ← Pin面板组件
```

---

## ���� 成功标志

**后端成功：**
- ✅ 启动日志显示Controller映射
- ✅ `curl http://localhost:8080/api/health` 返回200
- ✅ `curl http://localhost:8080/api/panel/items` 返回200

**前端成功：**
- ✅ 页面正常显示
- ✅ AI聊天可以发送消息
- ✅ 收到AI回复（不是模拟数据）
- ✅ Pin功能正常工作

**前后端连接成功：**
- ✅ 浏览器Network标签显示所有API请求都是200
- ✅ 后端日志显示收到前端请求
- ✅ AI回复不包含"模拟数据"提示
- ✅ Pin可以保存和加载

---

## 📞 下一步

### 1. 测试所有业务模块

- [ ] 存款业务分析
- [ ] 贷款业务分析
- [ ] 中间业务分析
- [ ] 客户画像分析
- [ ] 经营管理驾驶舱
- [ ] 知识库档案管理

### 2. 测试Pin功能

- [ ] 创建Pin
- [ ] 拖拽Pin
- [ ] 调整Pin大小
- [ ] 删除Pin
- [ ] 刷新后Pin还在

### 3. 测试多轮对话

- [ ] 在同一对话中提多个问题
- [ ] 查看对话历史
- [ ] 删除对话

---

## 🆘 需要帮助？

### 检查清单

1. [ ] 后端已重新编译（`REBUILD.bat`）
2. [ ] 启动日志显示Controller映射
3. [ ] `curl http://localhost:8080/api/health` 返回200
4. [ ] 浏览器可以访问前端
5. [ ] 浏览器开发者工具Network标签显示API请求

### 诊断工具

```bash
# 检查Controller文件
cd backend
diagnose-controllers.bat

# 测试API
quick-test.bat

# 查看API映射
# 启动日志中搜索 "Mapped"
```

---

**现在开始启动吧！** 🚀

**记住：第一步最重要 - 必须运行 `REBUILD.bat` 重新编译！**
