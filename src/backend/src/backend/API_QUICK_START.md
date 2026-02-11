# 🚀 API快速开始指南

## ⚡ 无需认证，直接使用！

所有API都已开放访问，不需要登录或token。

---

## 🌐 基础信息

```
后端地址: http://localhost:8080
API前缀: /api
示例: http://localhost:8080/api/ai/chat
```

---

## 📝 常用API速查

### 1. AI聊天 💬

**发送消息：**
```bash
POST /api/ai/chat
```

**请求示例：**
```bash
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "请分析存款业务趋势",
    "module": "deposit",
    "conversationId": null
  }'
```

**参数说明：**
- `query`: 用户问题（必填）
- `module`: 业务模块（选填）
  - `deposit` - 存款业务
  - `loan` - 贷款业务
  - `middle` - 中间业务
  - `customer` - 客户画像
  - `cockpit` - 经营驾驶舱
  - `knowledge` - 知识库
- `conversationId`: 对话ID（首次为null）

**返回示例：**
```json
{
  "messageId": "msg123",
  "conversationId": "conv456",
  "answer": "根据数据分析...",
  "intent": "data_analysis",
  "timestamp": "2026-02-06T15:30:00"
}
```

---

### 2. 对话管理 💭

**获取对话列表：**
```bash
GET /api/ai/conversations
```

```bash
curl http://localhost:8080/api/ai/conversations
```

**获取对话消息：**
```bash
GET /api/ai/messages/{conversationId}
```

```bash
curl http://localhost:8080/api/ai/messages/conv456
```

**删除对话：**
```bash
DELETE /api/ai/conversations/{conversationId}
```

```bash
curl -X DELETE http://localhost:8080/api/ai/conversations/conv456
```

---

### 3. 面板管理 📌

**获取所有面板项：**
```bash
GET /api/panel/items?category=deposit
```

```bash
curl "http://localhost:8080/api/panel/items?category=deposit"
```

**创建面板项（Pin功能）：**
```bash
POST /api/panel/items
```

```bash
curl -X POST http://localhost:8080/api/panel/items \
  -H "Content-Type: application/json" \
  -d '{
    "category": "deposit",
    "title": "存款分析结果",
    "content": "存款总额: 100亿元，增长率: 10%",
    "queryText": "分析存款业务",
    "positionX": 100,
    "positionY": 200,
    "width": 400,
    "height": 300
  }'
```

**更新面板项（拖拽位置）：**
```bash
PUT /api/panel/items/{id}
```

```bash
curl -X PUT http://localhost:8080/api/panel/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "positionX": 300,
    "positionY": 400,
    "width": 500,
    "height": 350
  }'
```

**删除面板项：**
```bash
DELETE /api/panel/items/{id}
```

```bash
curl -X DELETE http://localhost:8080/api/panel/items/1
```

---

### 4. 知识库 📚

**获取分类列表：**
```bash
GET /api/knowledge/categories
```

```bash
curl http://localhost:8080/api/knowledge/categories
```

**获取知识项：**
```bash
GET /api/knowledge/items?category=deposit
```

```bash
curl "http://localhost:8080/api/knowledge/items?category=deposit"
```

**搜索知识库：**
```bash
GET /api/knowledge/search?keyword=存款
```

```bash
curl "http://localhost:8080/api/knowledge/search?keyword=存款"
```

---

## 🎨 前端集成示例

### JavaScript/Fetch

```javascript
// AI聊天
async function chatWithAI(query, module) {
  const response = await fetch('http://localhost:8080/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      module: module,
      conversationId: null
    })
  });
  
  const data = await response.json();
  return data;
}

// 使用
chatWithAI('分析存款业务', 'deposit')
  .then(result => console.log(result));
```

### React

```jsx
import { useState } from 'react';

function ChatComponent() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  
  const handleSend = async () => {
    const res = await fetch('http://localhost:8080/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: message,
        module: 'deposit'
      })
    });
    
    const data = await res.json();
    setResponse(data.answer);
  };
  
  return (
    <div>
      <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>发送</button>
      {response && <div>{response}</div>}
    </div>
  );
}
```

### Vue 3

```vue
<template>
  <div>
    <input v-model="message" />
    <button @click="sendMessage">发送</button>
    <div v-if="response">{{ response }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('');
const response = ref('');

const sendMessage = async () => {
  const res = await fetch('http://localhost:8080/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: message.value,
      module: 'deposit'
    })
  });
  
  const data = await res.json();
  response.value = data.answer;
};
</script>
```

### Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// AI聊天
export const chatWithAI = (query, module) => {
  return api.post('/ai/chat', {
    query,
    module,
    conversationId: null
  });
};

// 获取对话列表
export const getConversations = () => {
  return api.get('/ai/conversations');
};

// 创建面板项
export const createPanelItem = (item) => {
  return api.post('/panel/items', item);
};

// 使用
chatWithAI('分析存款', 'deposit')
  .then(res => console.log(res.data));
```

---

## 🧪 快速测试

### 测试1: AI问答

```bash
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"你好","module":"deposit"}'
```

### 测试2: 创建Panel

```bash
curl -X POST http://localhost:8080/api/panel/items \
  -H "Content-Type: application/json" \
  -d '{
    "category":"deposit",
    "title":"测试",
    "content":"测试内容",
    "positionX":0,
    "positionY":0,
    "width":400,
    "height":300
  }'
```

### 测试3: 获取列表

```bash
curl http://localhost:8080/api/ai/conversations
curl http://localhost:8080/api/panel/items
curl http://localhost:8080/api/knowledge/categories
```

---

## 🎯 业务模块代码

```javascript
const MODULES = {
  DEPOSIT: 'deposit',      // 存款业务分析
  LOAN: 'loan',           // 贷款业务分析
  MIDDLE: 'middle',       // 中间业务分析
  CUSTOMER: 'customer',   // 客户画像分析
  COCKPIT: 'cockpit',     // 经营管理驾驶舱
  KNOWLEDGE: 'knowledge'  // 知识库档案
};

// 使用
fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: '分析存款趋势',
    module: MODULES.DEPOSIT
  })
});
```

---

## 📊 响应格式

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

### 错误响应

```json
{
  "success": false,
  "error": "错误信息",
  "code": "ERROR_CODE"
}
```

---

## 🔗 完整API文档

启动应用后访问：

- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **API Docs**: http://localhost:8080/api/v3/api-docs

---

## ⚠️ 重要提示

**当前配置：**
- ✅ 所有API都可以公开访问
- ✅ 不需要认证token
- ✅ CORS已开放

**仅用于开发测试！**
- ❌ 不要在生产环境使用
- ❌ 不要暴露到公网

---

## 🚀 启动应用

```bash
cd backend

# 使用Maven
mvn spring-boot:run

# 或使用Java
mvn package
java -jar target/bi-platform-0.0.1-SNAPSHOT.jar
```

**应用启动后：**
```
API地址: http://localhost:8080/api
H2控制台: http://localhost:8080/api/h2-console
Swagger文档: http://localhost:8080/api/swagger-ui.html
```

---

## 💡 提示

### 跨域问题

如果遇到CORS错误，确认：
1. 后端已启动在8080端口
2. CORS配置已允许所有来源（当前已配置）

### 连接问题

```bash
# 检查后端是否运行
curl http://localhost:8080/api/health

# 或
curl http://localhost:8080/actuator/health
```

### 数据库

```bash
# H2内存数据库控制台
访问: http://localhost:8080/api/h2-console

JDBC URL: jdbc:h2:mem:bank_bi
用户名: sa
密码: (留空)
```

---

## 📚 更多信息

- **安全配置说明**: `/backend/SECURITY_DISABLED.md`
- **JDK 17配置**: `/JDK17_SOLUTION.md`
- **完整解决方案**: `/FINAL_SOLUTION.md`

---

**开始使用吧！** 🎉

```bash
# 最简单的测试
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"你好","module":"deposit"}'
```
