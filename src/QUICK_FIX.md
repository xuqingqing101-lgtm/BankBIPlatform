# ⚡ 快速修复 "Failed to fetch" 错误

## ❌ 错误

```
健康检查失败: TypeError: Failed to fetch
```

---

## ✅ 3步快速修复

### 1️⃣ 启动后端

```bash
cd backend
FIX-CONNECTION.bat
```

**这个脚本会自动：**
- 关闭占用8080端口的进程
- 清理编译文件
- 重新编译项目
- 启动后端服务

**等待看到：**
```
========================================
🏦 银行智能AI分析平台已启动
========================================

Mapped "{[/health],methods=[GET]}" onto ...
```

**✅ 看到 "Mapped" 就成功了！**

---

### 2️⃣ 测试连接

**打开新的命令行窗口：**

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

**✅ 如果看到这个JSON，后端就OK了！**

---

### 3️⃣ 刷新前端

1. 回到前端页面
2. 按 `Ctrl + Shift + R` （强制刷新）
3. 查看右下角

**应该显示：**
```
✅ 后端连接正常
```

---

## 🧪 完整测试

```bash
cd backend
test-all-apis.bat
```

**应该看到：**
```
✅ 通过 - 欢迎页
✅ 通过 - 健康检查
✅ 通过 - AI对话
✅ 通过 - Pin列表
```

---

## 🔍 还是失败？

### 运行诊断工具

```bash
cd backend
diagnose-connection.bat
```

**会自动检查：**
- Java版本
- Maven版本
- 端口占用
- 后端连接
- Controller文件
- 编译文件

---

## 📋 检查清单

- [ ] 运行了 `FIX-CONNECTION.bat`
- [ ] 看到了 "银行智能AI分析平台已启动"
- [ ] 看到了 "Mapped" 字样
- [ ] `curl http://localhost:8080/api/health` 返回JSON
- [ ] 刷新了前端页面

**如果以上都完成，问题应该解决了！**

---

## 💡 常见问题

### Q: 端口8080被占用

**A:** `FIX-CONNECTION.bat` 会自动关闭占用的进程

**或手动关闭：**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Q: Controller没有注册

**A:** 重新编译：
```bash
cd backend
REBUILD.bat
```

查看启动日志，确保看到 "Mapped" 字样

### Q: curl测试成功但前端还是失败

**A:** 清除浏览器缓存：
1. 按 `Ctrl + Shift + Delete`
2. 清除缓存
3. 或使用隐私/无痕模式

---

## 🚀 一键解决

```bash
cd backend
FIX-CONNECTION.bat
```

**等待启动完成，然后刷新前端！**

---

**还有问题？查看详细文档：`FIX_FETCH_ERROR.md`**
