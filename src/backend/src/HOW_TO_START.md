# 🚀 如何启动系统

## ❌ 当前错误

```
健康检查失败: TypeError: Failed to fetch
```

**意思：** 前端无法连接到后端

---

## ✅ 解决方案（2步）

### 第1步：启动后端

**打开命令行，运行：**

```bash
cd backend
START-BACKEND.bat
```

**等待看到（大约1-2分钟）：**

```
========================================
🏦 银行智能AI分析平台已启动
========================================

Mapped "{[/],methods=[GET]}" onto com.bank.bi.controller.WelcomeController.welcome()
Mapped "{[/health],methods=[GET]}" onto com.bank.bi.controller.WelcomeController.health()
Mapped "{[/ai/chat],methods=[POST]}" onto com.bank.bi.controller.AiController.chat(...)
```

**✅ 看到 "Mapped" 就成功了！保持这个窗口打开！**

---

### 第2步：测试连接

**打开新的命令行窗口，运行：**

```bash
cd backend
TEST-CONNECTION.bat
```

**应该看到：**

```
✅ 欢迎页面连接成功
✅ 健康检查成功
✅ AI对话端点响应成功

✅ 所有测试通过！
```

**然后刷新前端页面（Ctrl+Shift+R）**

---

## 📋 详细步骤

### 1. 打开命令行

**Windows:**
- 按 `Win + R`
- 输入 `cmd`
- 按回车

---

### 2. 进入backend目录

```bash
cd 你的项目路径/backend
```

**例如：**
```bash
cd C:\Users\YourName\Projects\bank-ai-platform\backend
```

---

### 3. 运行启动脚本

```bash
START-BACKEND.bat
```

**会自动：**
- ✅ 检查Java环境
- ✅ 检查端口8080
- ✅ 清理旧文件
- ✅ 重新编译
- ✅ 启动服务

---

### 4. 等待启动完成

**成功标志：**

```
🏦 银行智能AI分析平台已启动
Mapped "{[/health],methods=[GET]}" onto ...
```

**⚠️ 保持这个窗口打开！不要关闭！**

---

### 5. 测试连接（新窗口）

**打开新的命令行窗口：**

```bash
cd backend
TEST-CONNECTION.bat
```

**或手动测试：**

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

---

### 6. 刷新前端

1. 回到前端页面
2. 按 `Ctrl + Shift + R` （强制刷新）
3. 右下角应该显示 "✅ 后端连接正常"

---

## 🔧 如果失败了

### 方案A：使用自动修复

```bash
cd backend
FIX-CONNECTION.bat
```

**等待完成后重新测试**

---

### 方案B：手动清理

```bash
cd backend

# 删除编译文件
rmdir /s /q target

# 重新编译
mvn clean compile

# 启动
mvn spring-boot:run
```

---

### 方案C：检查诊断

```bash
cd backend
diagnose-connection.bat
```

**会告诉你具体哪里出问题了**

---

## ✅ 成功标志

### 后端成功

- [ ] 命令行显示 "银行智能AI分析平台已启动"
- [ ] 看到 "Mapped" 字样
- [ ] `TEST-CONNECTION.bat` 全部通过
- [ ] `curl http://localhost:8080/api/health` 返回JSON

### 前端成功

- [ ] 页面右下角显示 "✅ 后端连接正常"
- [ ] 可以在AI聊天框发送消息
- [ ] 收到AI回复（不是"模拟数据"提示）
- [ ] Pin功能可以使用

---

## 📞 常见问题

### Q: Java未安装？

**A:** 下载安装JDK 17

**下载地址：**
- https://adoptium.net/
- 选择 JDK 17 (LTS)
- 安装后配置环境变量

---

### Q: Maven未安装？

**A:** 下载安装Maven

**下载地址：**
- https://maven.apache.org/download.cgi
- 解压后配置环境变量

---

### Q: 端口8080被占用？

**A:** 

```bash
# 查找占用进程
netstat -ano | findstr :8080

# 关闭进程
taskkill /PID <PID> /F
```

或者运行 `START-BACKEND.bat`，会自动关闭

---

### Q: 编译失败？

**A:** 检查：

1. Java版本是否是17
2. Maven是否正确安装
3. 网络是否正常（Maven需要下载依赖）

**查看Java版本：**
```bash
java -version
```

**应该显示：**
```
openjdk version "17.x.x"
```

---

### Q: 启动了但没有"Mapped"？

**A:** Controller没有注册

**解决：**
```bash
cd backend
FIX-CONNECTION.bat
```

**或：**
```bash
rmdir /s /q target
mvn clean compile
mvn spring-boot:run
```

---

## 🎯 快速命令参考

```bash
# 启动后端
cd backend
START-BACKEND.bat

# 测试连接（新窗口）
cd backend
TEST-CONNECTION.bat

# 自动修复
cd backend
FIX-CONNECTION.bat

# 诊断问题
cd backend
diagnose-connection.bat

# 手动测试
curl http://localhost:8080/api/health
```

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| `HOW_TO_START.md` | 本文档 - 启动指南 |
| `QUICK_FIX.md` | 快速修复指南 |
| `FIX_FETCH_ERROR.md` | 详细故障排查 |
| `START_HERE.md` | 完整启动流程 |

---

## 🚀 现在就开始！

```bash
cd backend
START-BACKEND.bat
```

**等待启动完成，然后：**

```bash
# 新窗口
cd backend
TEST-CONNECTION.bat
```

**最后刷新前端页面！**

---

**如果有任何问题，运行诊断工具：**

```bash
cd backend
diagnose-connection.bat
```

**祝使用愉快！** 🎉
