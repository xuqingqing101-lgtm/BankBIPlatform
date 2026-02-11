# ⚡ 快速启动

## 🎯 3步启动应用

### 1️⃣ 启动后端

```bash
cd backend
REBUILD.bat
```

**等待看到：**
```
========================================
🏦 银行智能AI分析平台已启动
========================================
```

**并且日志中有：**
```
Mapped "{[/ai/chat],methods=[POST]}" onto ...
Mapped "{[/panel/items],methods=[GET]}" onto ...
```

---

### 2️⃣ 测试后端

```bash
# 在backend目录下
quick-test.bat
```

**应该看到JSON数据而不是404！**

---

### 3️⃣ 访问前端

在Figma Make预览窗口查看，或访问：
```
http://localhost:5173
```

---

## ✅ 验证成功

### 后端
```bash
curl http://localhost:8080/api/health
```
返回：`{"status":"UP",...}`

### 前端
1. 输入问题并发送
2. 看到AI回复（不是"模拟数据"提示）
3. 点击Pin按钮可以固定回复

---

## 📚 详细文档

| 文档 | 说明 |
|------|------|
| `COMPLETE_STARTUP_GUIDE.md` | 📖 完整启动和测试指南 |
| `API_MAPPING.md` | 🔗 API端点对照表 |
| `FIX_NOW.md` | 🔧 快速修复指南 |

---

## ⚠️ 如果遇到问题

### 后端404
```bash
cd backend
REBUILD.bat
# 查看日志，确认看到Controller映射
```

### 前端显示"模拟数据"
```bash
# 测试后端是否可用
curl http://localhost:8080/api/health
```

---

**现在就开始：`cd backend && REBUILD.bat`** 🚀
