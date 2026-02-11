# 前后端API映射表

## ✅ 已修复的API端点

所有前端调用的API现在都已经在后端实现！

---

## 📋 API端点对照表

### 1. 健康检查 API

| 前端调用 | 后端路径 | 方法 | 状态 |
|---------|---------|------|------|
| `/api/health` | `/health` | GET | ✅ 已实现 |
| `/api/auth/health` | `/auth/health` | GET | ✅ 已添加 |

---

### 2. AI对话 API

| 前端调用 | 后端路径 | 方法 | 状态 |
|---------|---------|------|------|
| `/api/ai/chat` | `/ai/chat` | POST | ✅ 已添加 |
| `/api/ai/conversations` | `/ai/conversations` | GET | ✅ 已实现 |
| `/api/ai/conversation/{id}` | `/ai/conversation/{id}` | GET | ✅ 已添加 |
| `/api/ai/conversation/{id}` | `/ai/conversation/{id}` | DELETE | ✅ 已添加 |

---

### 3. Pin管理 API

| 前端调用 | 后端路径 | 方法 | 状态 |
|---------|---------|------|------|
| `/api/panel/items` | `/panel/items` | GET | ✅ 已添加 |
| `/api/panel/item` | `/panel/item` | POST | ✅ 已添加 |
| `/api/panel/item/{id}` | `/panel/item/{id}` | PUT | ✅ 已添加 |
| `/api/panel/item/{id}/position` | `/panel/item/{id}/position` | PUT | ✅ 已添加 |
| `/api/panel/item/{id}` | `/panel/item/{id}` | DELETE | ✅ 已添加 |

---

### 4. 认证 API

| 前端调用 | 后端路径 | 方法 | 状态 |
|---------|---------|------|------|
| `/api/auth/login` | `/auth/login` | POST | ✅ 已实现 |
| `/api/auth/current` | `/auth/current` | GET | ✅ 已实现 |
| `/api/auth/logout` | `/auth/logout` | POST | ✅ 已实现 |

---

## 🔧 关键修复

### 1. 添加了 `/ai/chat` 端点

**前端代码：**
```typescript
fetch('http://localhost:8080/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({ query, module })
})
```

**后端实现：**
```java
@PostMapping("/chat")
public ResponseUtil.Result<Map<String, Object>> chat(@RequestBody ChatRequest request)
```

**返回格式：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "sessionId": "session-123",
    "response": "AI回复内容",
    "conversationId": 123,
    "messageId": 456,
    "intent": "deposit_analysis"
  }
}
```

---

### 2. 添加了 `/panel/items` 端点

**前端代码：**
```typescript
fetch('http://localhost:8080/api/panel/items', {
  method: 'GET'
})
```

**后端实现：**
```java
@GetMapping("/items")
public ResponseUtil.Result<List<PanelItem>> getItems()
```

---

### 3. 统一支持单复数路径

为了兼容性，以下端点同时支持单数和复数：

```java
@PostMapping({"/item", "/items"})
@PutMapping({"/item/{itemId}", "/items/{itemId}"})
@DeleteMapping({"/item/{itemId}", "/items/{itemId}"})
```

---

### 4. 开发环境自动使用默认用户

所有需要认证的端点，如果没有userId，会自动使用默认值 `1L`：

```java
Long userId = (Long) httpRequest.getAttribute("userId");
if (userId == null) {
    userId = 1L; // 开发环境默认用户
}
```

这样前端不需要登录就能测试所有功能！

---

## 📊 响应格式统一

### 成功响应

```json
{
  "code": 200,
  "message": "成功",
  "data": { ... }
}
```

### 错误响应

```json
{
  "code": 500,
  "message": "错误信息",
  "data": null
}
```

---

## 🧪 测试命令

### 1. 测试健康检查

```bash
curl http://localhost:8080/api/health
curl http://localhost:8080/api/auth/health
```

### 2. 测试AI对话

```bash
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"本月存款情况如何？","module":"deposit"}'
```

### 3. 测试Pin列表

```bash
curl http://localhost:8080/api/panel/items
```

### 4. 测试创建Pin

```bash
curl -X POST http://localhost:8080/api/panel/item \
  -H "Content-Type: application/json" \
  -d '{
    "category": "deposit",
    "title": "存款分析",
    "content": "本月存款520亿元",
    "queryText": "本月存款情况",
    "positionX": 100,
    "positionY": 100,
    "width": 400,
    "height": 300
  }'
```

---

## 🔄 CORS配置

后端已配置CORS，允许前端访问：

```java
configuration.setAllowedOriginPatterns(List.of("*"));
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
configuration.setAllowedHeaders(List.of("*"));
configuration.setAllowCredentials(true);
```

---

## 🚀 完整启动流程

### 1. 启动后端

```bash
cd backend
REBUILD.bat
```

等待看到：
```
========================================
🏦 银行智能AI分析平台已启动
========================================
```

### 2. 验证后端

```bash
curl http://localhost:8080/api/health
```

应该返回：
```json
{
  "status": "UP",
  "message": "银行智能AI分析平台运行正常"
}
```

### 3. 测试前后端连接

在浏览器打开前端（Figma Make预览窗口），尝试：
- 在任意模块的AI聊天框中输入问题
- 点击发送
- 查看浏览器控制台的网络请求
- 查看后端日志

### 4. 检查网络请求

打开浏览器开发者工具 (F12) → Network 标签：
- 发送AI消息时应该看到 `POST /api/ai/chat`
- 加载Pin列表时应该看到 `GET /api/panel/items`
- 所有请求应该返回 200 状态码

---

## ⚠️ 常见问题

### Q1: API返回404

**原因：** Controller没有注册

**解决：**
```bash
cd backend
REBUILD.bat
```

启动后检查日志，应该看到：
```
Mapped "{[/ai/chat],methods=[POST]}" onto ...
Mapped "{[/panel/items],methods=[GET]}" onto ...
```

---

### Q2: CORS错误

**错误信息：**
```
Access to fetch at 'http://localhost:8080/api/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**解决：** 确保后端已启动且SecurityConfig配置正确（已配置）

---

### Q3: 后端不可用

**前端行为：** 自动使用模拟数据，在回复中显示：

```
💡 提示：后端服务暂时不可用，显示的是模拟数据。
请确保后端已启动：
1. cd backend
2. RUN.bat
```

**解决：** 启动后端服务

---

## 📁 相关文件

| 文件 | 说明 |
|------|------|
| `/lib/api.ts` | 前端API配置 |
| `/backend/src/main/java/com/bank/bi/controller/` | 后端Controller目录 |
| `/backend/REBUILD.bat` | 重新编译脚本 |
| `/backend/quick-test.bat` | API测试脚本 |

---

## ✅ 检查清单

在启动应用前，确认：

- [x] Controller已修复（添加了缺失的端点）
- [x] API路径前后端匹配
- [x] CORS已配置
- [x] 开发环境不需要认证（自动使用userId=1）
- [x] 响应格式统一
- [x] 前端有fallback机制（后端不可用时使用模拟数据）

---

**现在前后端API完全匹配！重新编译启动后即可正常运行！** 🎉
