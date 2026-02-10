# ⚡ 快速启动银行智能AI分析平台

## ❌ 看到 "Failed to fetch" 错误？

**这个错误表示后端没有启动！**

---

## ✅ 解决方法（1分钟）

### 🚀 启动后端

**打开命令行（Win+R，输入cmd），然后运行：**

```bash
cd backend
RUN.bat
```

**等待看到：**

```
🏦 银行智能AI分析平台已启动
Mapped "{[/health],methods=[GET]}" onto ...
```

✅ **看到这个就成功了！保持窗口打开！**

---

### 🔄 刷新前端

1. 回到前端页面
2. 按 `Ctrl + Shift + R` 强制刷新
3. 错误消失，可以使用了！

---

## 📋 完整步骤

### 第1步：打开命令行

**Windows：**
- 按 `Win + R`
- 输入 `cmd`
- 按回车

### 第2步：进入backend目录

```bash
cd 你的项目路径\backend
```

**例如：**
```bash
cd C:\Projects\bank-ai-platform\backend
```

### 第3步：运行启动脚本

```bash
RUN.bat
```

**或双击 `backend` 文件夹里的 `RUN.bat` 文件**

### 第4步：等待启动

**大约需要1-2分钟**

**成功标志：**
- ✅ 看到 "🏦 银行智能AI分析平台已启动"
- ✅ 看到多个 "Mapped" 字样

**⚠️ 不要关闭这个命令行窗口！**

### 第5步：刷新前端

**在浏览器中：**
- 按 `Ctrl + Shift + R`
- 或按 `F5`

**现在应该可以正常使用了！**

---

## 🧪 测试连接（可选）

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

## 🔧 还是失败？

### 自动修复

```bash
cd backend
FIX-CONNECTION.bat
```

### 诊断问题

```bash
cd backend
diagnose-connection.bat
```

---

## 📚 详细文档

| 文档 | 说明 |
|------|------|
| `START.md` | ⭐ 本文档 - 最简单的启动方式 |
| `HOW_TO_START.md` | 详细启动指南 |
| `QUICK_FIX.md` | 快速修复指南 |
| `backend/README.md` | 后端详细说明 |

---

## ❓ 常见问题

### Q: 没有Java？

**A:** 下载安装JDK 17
- https://adoptium.net/
- 选择 JDK 17 (LTS)

### Q: 端口8080被占用？

**A:** `RUN.bat` 会自动释放端口

### Q: Maven未安装？

**A:** 下载安装Maven
- https://maven.apache.org/download.cgi

---

## 🎯 成功标志

### 后端启动成功
- [x] 命令行显示 "🏦 银行智能AI分析平台已启动"
- [x] 看到 "Mapped" 字样
- [x] 窗口保持打开状态

### 前端连接成功
- [x] 页面没有错误提示
- [x] 右下角显示 "✅ 后端连接正常"
- [x] 可以使用AI对话功能

---

## 🚀 现在就开始！

```bash
cd backend
RUN.bat
```

**然后刷新前端页面！**

---

**如果有任何问题，查看详细文档：`HOW_TO_START.md`**

**或运行诊断工具：`backend/diagnose-connection.bat`**

**祝使用愉快！** 🎉
