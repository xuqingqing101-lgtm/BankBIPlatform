# 🚀 后端完整设置指南

## ✅ 已创建的完整代码

### 1. 实体类（Entity）
```
✅ User.java - 用户实体
✅ Role.java - 角色实体
✅ Conversation.java - 对话实体
✅ Message.java - 消息实体
✅ PanelItem.java - Pin面板项目实体
```

### 2. 数据访问层（Repository）
```
✅ UserRepository.java
✅ RoleRepository.java
✅ ConversationRepository.java
✅ MessageRepository.java
✅ PanelItemRepository.java
```

### 3. DTO和VO
```
✅ LoginRequest.java - 登录请求
✅ ChatRequest.java - AI问答请求
✅ ChatResponse.java - AI问答响应
✅ PanelItemRequest.java - Pin项目请求
✅ UserInfoVO.java - 用户信息视图
✅ HiAgentRequest.java - HiAgent API请求
✅ HiAgentResponse.java - HiAgent API响应
```

### 4. 服务层（Service）
```
✅ HiAgentService.java - AI服务（多轮对话、上下文管理）
✅ AuthService.java - 认证服务
✅ PanelService.java - Pin面板服务
```

### 5. 控制器（Controller）
```
✅ AuthController.java - 认证接口
✅ AiController.java - AI问答接口
✅ PanelController.java - Pin面板接口
```

### 6. 安全配置（Security）
```
✅ SecurityConfig.java - Spring Security配置
✅ JwtTokenProvider.java - JWT工具类
✅ JwtAuthenticationFilter.java - JWT过滤器
✅ UserDetailsServiceImpl.java - 用户详情服务
```

### 7. 配置类（Config）
```
✅ HiAgentConfig.java - HiAgent配置
```

### 8. 工具类（Util）
```
✅ ResponseUtil.java - 统一响应工具
```

### 9. 配置文件
```
✅ pom.xml - Maven依赖
✅ application.yml - 应用配置
✅ data.sql - 初始化数据
```

### 10. 启动类
```
✅ BankBiApplication.java - Spring Boot启动类
```

---

## 📦 快速开始

### Step 1: 创建项目结构

在您的工作目录执行：

```bash
# 创建目录结构
mkdir -p backend/src/main/java/com/bank/bi/{config,controller,service,model/{entity,dto,vo},repository,security,util}
mkdir -p backend/src/main/resources
mkdir -p backend/src/test/java
```

### Step 2: 复制所有文件

将以下文件复制到对应位置：

```
backend/
├── pom.xml                                                        ✅
├── README.md                                                      ✅
├── SETUP_GUIDE.md                                                 ✅
└── src/main/
    ├── java/com/bank/bi/
    │   ├── BankBiApplication.java                                 ✅
    │   ├── config/
    │   │   ├── SecurityConfig.java                                ✅
    │   │   └── HiAgentConfig.java                                 ✅
    │   ├── controller/
    │   │   ├── AuthController.java                                ✅
    │   │   ├── AiController.java                                  ✅
    │   │   └── PanelController.java                               ✅
    │   ├── service/
    │   │   ├── HiAgentService.java                                ✅
    │   │   ├── AuthService.java                                   ✅
    │   │   └── PanelService.java                                  ✅
    │   ├── model/
    │   │   ├── entity/
    │   │   │   ├── User.java                                      ✅
    │   │   │   ├── Role.java                                      ✅
    │   │   │   ├── Conversation.java                              ✅
    │   │   │   ├── Message.java                                   ✅
    │   │   │   └── PanelItem.java                                 ✅
    │   │   ├── dto/
    │   │   │   ├── LoginRequest.java                              ✅
    │   │   │   ├── ChatRequest.java                               ✅
    │   │   │   ├── ChatResponse.java                              ✅
    │   │   │   ├── PanelItemRequest.java                          ✅
    │   │   │   ├── HiAgentRequest.java                            ✅
    │   │   │   └── HiAgentResponse.java                           ✅
    │   │   └── vo/
    │   │       └── UserInfoVO.java                                ✅
    │   ├── repository/
    │   │   ├── UserRepository.java                                ✅
    │   │   ├── RoleRepository.java                                ✅
    │   │   ├── ConversationRepository.java                        ✅
    │   │   ├── MessageRepository.java                             ✅
    │   │   └── PanelItemRepository.java                           ✅
    │   ├── security/
    │   │   ├── JwtTokenProvider.java                              ✅
    │   │   ├── JwtAuthenticationFilter.java                       ✅
    │   │   └── UserDetailsServiceImpl.java                        ✅
    │   └── util/
    │       └── ResponseUtil.java                                  ✅
    └── resources/
        ├── application.yml                                        ✅
        └── data.sql                                               ✅
```

### Step 3: 配置HiAgent API Key

**重要：** 您需要从字节跳动获取HiAgent API Key

```bash
# 方式1: 设置环境变量（推荐）
export HIAGENT_API_KEY="your-hiagent-api-key-here"

# 方式2: 修改application.yml
# 编辑 src/main/resources/application.yml
hiagent:
  api-key: your-hiagent-api-key-here
```

### Step 4: 编译和运行

```bash
cd backend

# 编译
mvn clean install

# 运行
mvn spring-boot:run
```

### Step 5: 验证启动

访问以下URL验证：

```
✅ API服务: http://localhost:8080/api
✅ H2控制台: http://localhost:8080/api/h2-console
   JDBC URL: jdbc:h2:mem:bank_bi
   Username: sa
   Password: (留空)
```

---

## 🧪 测试接口

### 1. 用户登录

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "userInfo": {
      "userId": 1,
      "username": "admin",
      "realName": "管理员",
      "roles": ["ADMIN"]
    }
  }
}
```

### 2. AI问答

```bash
# 保存token
TOKEN="your-token-here"

curl -X POST http://localhost:8080/api/ai/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "本月存款增长情况如何？",
    "module": "deposit"
  }'
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "messageId": 5,
    "conversationId": 2,
    "content": "根据财务系统数据，本月存款增长850亿元...",
    "timestamp": 1706745600000
  }
}
```

### 3. 获取Pin面板

```bash
curl -X GET http://localhost:8080/api/panel/my \
  -H "Authorization: Bearer $TOKEN"
```

### 4. 添加Pin项目

```bash
curl -X POST http://localhost:8080/api/panel/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "存款业务",
    "title": "本月存款增长情况",
    "content": "本月存款增长850亿元，环比增长1.9%...",
    "queryText": "本月存款增长情况如何？"
  }'
```

---

## 📝 测试账号

```yaml
用户1:
  用户名: admin
  密码: admin123
  角色: 系统管理员
  
用户2:
  用户名: zhangsan
  密码: admin123
  角色: 分析师
  
用户3:
  用户名: lisi
  密码: admin123
  角色: 业务人员
```

---

## 🔧 开发建议

### 添加新的业务模块

1. **创建实体类**
```java
@Entity
@Table(name = "your_table")
public class YourEntity {
    // 字段定义
}
```

2. **创建Repository**
```java
public interface YourRepository extends JpaRepository<YourEntity, Long> {
    // 自定义查询方法
}
```

3. **创建Service**
```java
@Service
public class YourService {
    // 业务逻辑
}
```

4. **创建Controller**
```java
@RestController
@RequestMapping("/your-path")
public class YourController {
    // API接口
}
```

### 调试技巧

```yaml
日志级别调整:
  # application.yml
  logging:
    level:
      com.bank.bi: DEBUG  # 查看详细日志
      
H2控制台:
  URL: http://localhost:8080/api/h2-console
  用途: 查看数据库数据、执行SQL

Postman/Insomnia:
  推荐使用API测试工具
  导入接口文档进行测试
```

---

## 🚀 生产部署

### 切换到PostgreSQL

1. **修改application.yml**
```yaml
spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://localhost:5432/bank_bi
    username: postgres
    password: your_password
```

2. **执行数据库初始化**
```bash
# 连接PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE bank_bi;

# 执行schema（JPA会自动创建表）
# 或手动执行建表脚本
```

### Docker部署

```dockerfile
# Dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/bi-platform-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
# 构建
docker build -t bank-bi:1.0.0 .

# 运行
docker run -d -p 8080:8080 \
  -e HIAGENT_API_KEY=your-key \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/bank_bi \
  bank-bi:1.0.0
```

---

## ⚠️ 常见问题

### 1. 编译错误

**问题：** `cannot find symbol`

**解决：**
```bash
# 确保Lombok已安装
# IntelliJ IDEA: Settings -> Plugins -> 安装Lombok
# 启用注解处理: Settings -> Build -> Compiler -> Annotation Processors -> Enable

mvn clean install -DskipTests
```

### 2. HiAgent调用失败

**问题：** `AI服务调用失败`

**检查：**
- API Key是否正确
- 网络是否通畅
- HiAgent服务是否可用

```bash
# 测试HiAgent连接
curl -X POST https://api.hiagent.bytedance.com/v1/chat/completions \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"model":"hiagent-pro","messages":[{"role":"user","content":"测试"}]}'
```

### 3. JWT认证失败

**问题：** `401 Unauthorized`

**检查：**
- Token是否正确携带在Header中
- Token是否已过期
- JWT secret是否配置正确

---

## 📚 下一步

### 可以添加的功能

1. **业务数据API**（对接真实数据源）
2. **知识库功能**（文档检索）
3. **数据可视化API**（返回图表数据）
4. **审计日志**（记录所有操作）
5. **权限管理**（更细粒度的权限控制）
6. **缓存优化**（Redis集成）
7. **性能监控**（Actuator + Prometheus）

### 推荐学习资源

- Spring Boot官方文档: https://spring.io/projects/spring-boot
- Spring Security文档: https://spring.io/projects/spring-security
- JPA/Hibernate文档: https://hibernate.org/orm/documentation
- HiAgent文档: https://www.hiagent.com/docs

---

## 🎉 完成！

您现在拥有一个完整的、可运行的Spring Boot后端项目，包括：

✅ **完整的实体模型**  
✅ **JWT认证授权**  
✅ **HiAgent AI集成**  
✅ **多轮对话功能**  
✅ **Pin面板功能**  
✅ **测试数据和账号**  
✅ **详细的API文档**

**可以开始与前端集成了！** 🚀

---

**有问题？** 查看 `/backend/README.md` 或参考 `/HIAGENT_IMPLEMENTATION_GUIDE.md`
