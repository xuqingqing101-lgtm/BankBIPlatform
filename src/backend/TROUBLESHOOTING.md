# 🔧 故障排除指南

## 🚨 当前错误

```
Failed to execute goal org.springframework.boot:spring-boot-maven-plugin:3.2.2:run
Process terminated with exit code: 1
```

这个错误信息不够详细，需要进一步诊断。

---

## 🔍 快速诊断

### Step 1: 运行诊断工具

**Windows:**
```bash
cd backend
diagnose.bat
```

**Linux/Mac:**
```bash
cd backend
chmod +x diagnose.sh
./diagnose.sh
```

这将生成`compile-debug.log`文件，包含详细的错误信息。

---

## 💡 常见问题和解决方案

### 问题1: JDK版本不对

**症状:**
```
Unsupported class file major version
或
java.lang.ExceptionInInitializerError
```

**解决:**
```bash
# 确认使用JDK 17
java -version

# 应该显示: openjdk version "17.0.x" 或 java version "17.0.x"

# 如果不是17，请安装JDK 17
# 下载: https://adoptium.net/temurin/releases/?version=17
```

### 问题2: Lombok注解处理器错误

**症状:**
```
cannot find symbol
  symbol:   method builder()
或
lombok annotations are not processed
```

**解决方案1: 清理Lombok缓存**
```bash
mvn dependency:purge-local-repository -DmanualInclude="org.projectlombok:lombok"
mvn clean compile
```

**解决方案2: 重新生成项目**
```bash
mvn clean
rm -rf target/
rm -rf ~/.m2/repository/org/projectlombok/lombok/1.18.30/
mvn clean compile -U
```

### 问题3: 依赖下载失败

**症状:**
```
Could not resolve dependencies
或
Failed to read artifact descriptor
```

**解决方案1: 使用国内镜像**

编辑 `~/.m2/settings.xml` (如果不存在则创建):

```xml
<settings>
    <mirrors>
        <mirror>
            <id>aliyun</id>
            <name>Aliyun Maven</name>
            <url>https://maven.aliyun.com/repository/public</url>
            <mirrorOf>central</mirrorOf>
        </mirror>
    </mirrors>
</settings>
```

**解决方案2: 强制更新**
```bash
mvn clean compile -U
```

### 问题4: Redis连接失败

**症状:**
```
Unable to connect to Redis
或
RedisConnectionException
```

**已修复:** Redis已在代码中禁用
```java
@SpringBootApplication(exclude = {RedisAutoConfiguration.class})
```

如果仍有问题，确认`application.yml`中Redis配置已注释。

### 问题5: 端口被占用

**症状:**
```
Port 8080 already in use
或
Address already in use
```

**解决方案1: 更改端口**

编辑 `application.yml`:
```yaml
server:
  port: 8081  # 改为其他端口
```

**解决方案2: 结束占用进程**

Windows:
```bash
netstat -ano | findstr :8080
taskkill /PID [进程ID] /F
```

Linux/Mac:
```bash
lsof -ti:8080 | xargs kill -9
```

### 问题6: H2数据库错误

**症状:**
```
Schema-validation: missing table
或
Database "bank_bi" not found
```

**解决:**
```bash
# 删除临时文件重新创建
rm -rf ~/bank_bi.*
mvn spring-boot:run
```

或修改`application.yml`:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: create-drop  # 确保设置为create-drop
```

### 问题7: 编译时内存不足

**症状:**
```
OutOfMemoryError: Java heap space
```

**解决:**

设置Maven内存:

Windows (CMD):
```bash
set MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=256m
mvn clean compile
```

Linux/Mac:
```bash
export MAVEN_OPTS="-Xmx1024m -XX:MaxPermSize=256m"
mvn clean compile
```

### 问题8: 包不存在错误

**症状:**
```
package com.bank.bi.xxx does not exist
```

**检查清单:**
1. 确认文件存在于正确的目录
2. 确认package声明正确
3. 清理并重新编译

```bash
mvn clean
mvn compile
```

---

## 🛠️ 逐步诊断流程

### Step 1: 验证环境

```bash
# 检查Java版本
java -version
# 必须是: 17.0.x

# 检查Maven版本
mvn -v
# 推荐: 3.6.0+

# 检查JAVA_HOME
echo $JAVA_HOME    # Linux/Mac
echo %JAVA_HOME%   # Windows
```

### Step 2: 完全清理

```bash
cd backend

# 删除所有编译产物
rm -rf target/

# 清理Maven缓存（可选，仅在有问题时）
rm -rf ~/.m2/repository/com/bank/

# Maven清理
mvn clean
```

### Step 3: 重新编译

```bash
# 跳过测试，仅编译
mvn clean compile -DskipTests

# 如果成功，尝试打包
mvn clean package -DskipTests
```

### Step 4: 启动应用

```bash
# 方式1: Maven插件
mvn spring-boot:run

# 方式2: 直接运行jar
java -jar target/bi-platform-1.0.0.jar
```

---

## 📋 详细错误日志

### 生成完整日志

```bash
# 生成详细编译日志
mvn clean compile -X > compile-full.log 2>&1

# 查看最后100行
tail -100 compile-full.log

# 搜索ERROR
grep "ERROR" compile-full.log

# 搜索异常
grep "Exception" compile-full.log
```

### 常见错误模式

#### 模式1: cannot find symbol
```
[ERROR] /path/to/file.java:[行号,列号] cannot find symbol
  symbol:   method xxx()
  location: class Xxx
```

**原因:** Lombok没有生成方法
**解决:** 重新编译，确保Lombok注解处理器配置正确

#### 模式2: package does not exist
```
[ERROR] /path/to/file.java:[行号,列号] package xxx does not exist
```

**原因:** 依赖缺失或路径错误
**解决:** 检查pom.xml依赖，mvn clean compile -U

#### 模式3: 类找不到
```
java.lang.ClassNotFoundException: xxx
```

**原因:** 类路径问题
**解决:** mvn clean package重新打包

---

## 🔬 高级诊断

### 检查Lombok是否工作

创建测试类:

```java
package com.bank.bi.test;

import lombok.Data;

@Data
public class TestLombok {
    private String name;
    private Integer age;
}
```

编译:
```bash
mvn clean compile
```

检查生成的class文件:
```bash
javap target/classes/com/bank/bi/test/TestLombok.class
```

应该能看到自动生成的getter/setter方法。

### 检查依赖树

```bash
# 查看完整依赖
mvn dependency:tree

# 查看特定依赖
mvn dependency:tree -Dincludes=org.projectlombok

# 检查依赖冲突
mvn dependency:tree -Dverbose
```

### 强制重新下载依赖

```bash
# 删除本地仓库中的项目依赖
rm -rf ~/.m2/repository/org/springframework/boot/
rm -rf ~/.m2/repository/org/projectlombok/

# 重新下载
mvn clean compile -U
```

---

## 🎯 快速修复方案

### 方案1: 完全重置（推荐）

```bash
cd backend

# 1. 清理所有
mvn clean
rm -rf target/

# 2. 清理Lombok缓存
mvn dependency:purge-local-repository -DmanualInclude="org.projectlombok:lombok"

# 3. 重新编译
mvn clean compile -DskipTests

# 4. 启动
mvn spring-boot:run
```

### 方案2: 使用快速启动脚本

```bash
cd backend

# Windows
START.bat

# Linux/Mac
chmod +x START.sh
./START.sh
```

### 方案3: 使用诊断工具

```bash
cd backend

# Windows
diagnose.bat

# Linux/Mac
chmod +x diagnose.sh
./diagnose.sh
```

---

## 📊 成功标志

### 编译成功
```
[INFO] --- maven-compiler-plugin:3.11.0:compile (default-compile) @ bi-platform ---
[INFO] Compiling 30 source files to target/classes
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

### 启动成功
```
========================================
🏦 银行智能AI分析平台已启动
========================================
API地址: http://localhost:8080/api
H2控制台: http://localhost:8080/api/h2-console
Swagger文档: http://localhost:8080/api/swagger-ui.html
========================================
AI服务: 字节HiAgent
数据库: H2 (开发环境)
⚠️  Redis: 已禁用（开发环境）
🔓 安全: 已禁用认证（开发环境）
========================================
```

### 测试API
```bash
curl http://localhost:8080/api/health

# 或
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"你好"}'
```

---

## 🆘 仍然无法解决？

### 提供以下信息以便诊断

1. **环境信息**
```bash
java -version
mvn -v
echo $JAVA_HOME  # 或 echo %JAVA_HOME%
```

2. **完整错误日志**
```bash
mvn clean compile -X > full-error.log 2>&1
```
提供`full-error.log`文件内容

3. **依赖树**
```bash
mvn dependency:tree > dependencies.txt
```
提供`dependencies.txt`文件

4. **系统信息**
- 操作系统版本
- 是否使用代理
- 防火墙/杀毒软件

---

## 💡 预防措施

### 开发环境配置

1. **使用JDK 17 LTS版本**
   - 稳定、兼容性好
   - 企业级应用的标准选择

2. **配置Maven镜像**
   - 使用国内镜像加速下载
   - 减少网络问题

3. **定期清理**
```bash
# 每周清理一次
mvn clean
rm -rf target/
```

4. **IDE配置**
   - IntelliJ IDEA: 安装Lombok插件
   - Eclipse: 安装Lombok agent
   - VSCode: 安装Java扩展包

---

## 📚 相关文档

- **JDK 17配置**: `/JDK17_SOLUTION.md`
- **API快速开始**: `/backend/API_QUICK_START.md`
- **安全配置**: `/backend/SECURITY_DISABLED.md`
- **完整方案**: `/FINAL_SOLUTION.md`

---

**需要帮助？运行诊断工具！**

```bash
cd backend
./diagnose.sh    # Linux/Mac
diagnose.bat     # Windows
```
