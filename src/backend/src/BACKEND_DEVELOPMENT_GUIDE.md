# 🏦 银行智能AI分析平台 - 后端开发完整方案

**项目名称：** 银行"存贷汇"智能BI问数平台  
**目标：** 从前端Demo升级为全行生产级系统  
**日期：** 2026年2月5日

---

## 📋 目录

1. [系统架构设计](#系统架构设计)
2. [技术栈选型](#技术栈选型)
3. [数据库设计](#数据库设计)
4. [API接口设计](#api接口设计)
5. [安全与权限](#安全与权限)
6. [AI模型集成](#ai模型集成)
7. [数据对接方案](#数据对接方案)
8. [部署方案](#部署方案)
9. [开发步骤](#开发步骤)
10. [监管合规](#监管合规)

---

## 🏗️ 系统架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 高管PC端 │  │ 分析师端 │  │ 业务人员 │  │ 移动端   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────┼────────────────────────────────────┐
│                    前端应用层                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React + TypeScript + Tailwind CSS                     │ │
│  │  - 6个业务模块（存款、贷款、中间业务、客户、驾驶舱等） │ │
│  │  - 多轮对话组件、数据可视化、Pin功能                   │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API / WebSocket
┌────────────────────────┼────────────────────────────────────┐
│                    API网关层                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Kong / Nginx + JWT认证 + 限流 + 日志                  │ │
│  │  - 统一认证鉴权                                         │ │
│  │  - API限流与熔断                                        │ │
│  │  - 访问日志记录                                         │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                    应用服务层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 用户服务     │  │ 业务服务     │  │ AI问答服务   │      │
│  │ - 登录认证   │  │ - 存款分析   │  │ - 多轮对话   │      │
│  │ - 权限管理   │  │ - 贷款分析   │  │ - 上下文理解 │      │
│  │ - 角色管理   │  │ - 中间业务   │  │ - 意图识别   │      │
│  └──────────────┘  │ - 客户画像   │  └──────────────┘      │
│                     │ - 经营驾驶舱 │                         │
│  ┌──────────────┐  └──────────────┘  ┌──────────────┐      │
│  │ 数据服务     │                     │ 知识库服务   │      │
│  │ - 数据查询   │  ┌──────────────┐  │ - 制度检索   │      │
│  │ - 数据聚合   │  │ 面板服务     │  │ - 流程查询   │      │
│  │ - 缓存管理   │  │ - Pin管理    │  │ - 文档管理   │      │
│  └──────────────┘  │ - 看板定制   │  └──────────────┘      │
│                     └──────────────┘                         │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                    数据访问层                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ORM (MyBatis Plus / TypeORM) + 数据库连接池           │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                    数据存储层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │ Redis        │  │ Elasticsearch│      │
│  │ - 业务数据   │  │ - 会话缓存   │  │ - 知识库检索 │      │
│  │ - 用户权限   │  │ - 数据缓存   │  │ - 全文搜索   │      │
│  │ - 审计日志   │  │ - 分布式锁   │  │ - 日志分析   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                  数据源对接层                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  数据中台 / ETL / 实时数据同步                          │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ NC财务   │  │ 核心系统 │  │ 信贷系统 │  │ 客户系统 │   │
│  │ 系统     │  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 技术栈选型

### 后端技术栈（推荐方案1：Java生态）

适合大型银行，监管合规要求高，团队熟悉Java

```yaml
语言框架:
  - Java 17 / 21 (LTS版本)
  - Spring Boot 3.2+
  - Spring Cloud (微服务，可选)

数据访问:
  - MyBatis Plus (ORM)
  - Spring Data JPA (可选)
  - HikariCP (连接池)

数据库:
  - PostgreSQL 15+ (主数据库)
  - Redis 7+ (缓存)
  - Elasticsearch 8+ (搜索、日志)

安全认证:
  - Spring Security
  - JWT (无状态认证)
  - OAuth2 (统一认证，可选)

AI集成:
  - LangChain4j (Java版LangChain)
  - Spring AI (OpenAI/本地大模型)
  - HuggingFace Transformers

消息队列:
  - Kafka (大数据场景)
  - RabbitMQ (通用场景)

监控运维:
  - Prometheus + Grafana
  - ELK Stack (日志)
  - Spring Boot Actuator

API文档:
  - Knife4j (Swagger增强)
  - Spring REST Docs
```

### 后端技术栈（推荐方案2：Node.js生态）

适合快速开发，前后端技术栈统一

```yaml
语言框架:
  - Node.js 20 LTS
  - NestJS (企业级框架)
  - TypeScript

数据访问:
  - TypeORM / Prisma
  - Redis Client

数据库:
  - 同方案1

安全认证:
  - Passport.js
  - JWT
  - bcrypt (密码加密)

AI集成:
  - LangChain.js
  - OpenAI SDK
  - @huggingface/inference

消息队列:
  - Bull (Redis-based)
  - Kafka.js

API文档:
  - Swagger (NestJS集成)
```

### 推荐选择

**生产环境推荐：Java + Spring Boot**
- ✅ 银行业主流技术栈
- ✅ 生态成熟，组件丰富
- ✅ 性能优秀，易于扩展
- ✅ 安全合规工具完善
- ✅ 团队技能匹配度高

---

## 🗄️ 数据库设计

### 核心表结构

#### 1. 用户与权限

```sql
-- 用户表
CREATE TABLE sys_user (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- BCrypt加密
    real_name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) UNIQUE,  -- 工号
    department VARCHAR(100),
    position VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    status SMALLINT DEFAULT 1,  -- 1启用 0禁用
    last_login_time TIMESTAMP,
    last_login_ip VARCHAR(50),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

-- 角色表
CREATE TABLE sys_role (
    role_id BIGSERIAL PRIMARY KEY,
    role_code VARCHAR(50) UNIQUE NOT NULL,  -- EXEC, ANALYST, BUSINESS
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    data_scope SMALLINT DEFAULT 1,  -- 数据权限范围：1全行 2本部门 3本人
    status SMALLINT DEFAULT 1,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户角色关联表
CREATE TABLE sys_user_role (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES sys_user(user_id),
    FOREIGN KEY (role_id) REFERENCES sys_role(role_id),
    UNIQUE(user_id, role_id)
);

-- 权限表
CREATE TABLE sys_permission (
    permission_id BIGSERIAL PRIMARY KEY,
    permission_code VARCHAR(100) UNIQUE NOT NULL,  -- deposit:view, loan:edit
    permission_name VARCHAR(100) NOT NULL,
    module VARCHAR(50),  -- deposit, loan, intermediate, customer, dashboard, knowledge
    resource_type VARCHAR(20),  -- menu, button, api, data
    parent_id BIGINT,
    sort_order INT DEFAULT 0,
    status SMALLINT DEFAULT 1,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 角色权限关联表
CREATE TABLE sys_role_permission (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES sys_role(role_id),
    FOREIGN KEY (permission_id) REFERENCES sys_permission(permission_id),
    UNIQUE(role_id, permission_id)
);

-- 创建索引
CREATE INDEX idx_user_username ON sys_user(username);
CREATE INDEX idx_user_employee_id ON sys_user(employee_id);
CREATE INDEX idx_user_status ON sys_user(status);
```

#### 2. AI对话历史

```sql
-- 对话会话表
CREATE TABLE ai_conversation (
    conversation_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(100) UNIQUE NOT NULL,  -- UUID
    module VARCHAR(50) NOT NULL,  -- deposit, loan, etc.
    title VARCHAR(200),  -- 会话标题（首个问题）
    status SMALLINT DEFAULT 1,  -- 1进行中 2已结束
    message_count INT DEFAULT 0,
    started_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_time TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES sys_user(user_id)
);

-- 对话消息表
CREATE TABLE ai_message (
    message_id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    message_type VARCHAR(20) NOT NULL,  -- user, assistant
    content TEXT NOT NULL,
    query_text TEXT,  -- 用户问题（assistant消息关联）
    intent VARCHAR(50),  -- 意图识别结果
    entities JSONB,  -- 实体提取结果
    context JSONB,  -- 上下文信息
    model_name VARCHAR(50),  -- 使用的AI模型
    tokens_used INT,  -- token使用量
    response_time INT,  -- 响应时间(ms)
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES ai_conversation(conversation_id)
);

-- 创建索引
CREATE INDEX idx_conv_user_id ON ai_conversation(user_id);
CREATE INDEX idx_conv_session_id ON ai_conversation(session_id);
CREATE INDEX idx_conv_module ON ai_conversation(module);
CREATE INDEX idx_msg_conv_id ON ai_message(conversation_id);
CREATE INDEX idx_msg_created_time ON ai_message(created_time);
```

#### 3. Pin面板

```sql
-- 用户面板表
CREATE TABLE user_panel (
    panel_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    panel_name VARCHAR(100) DEFAULT '我的面板',
    layout_config JSONB,  -- 布局配置（GridLayout positions）
    is_default BOOLEAN DEFAULT TRUE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES sys_user(user_id)
);

-- Pin项目表
CREATE TABLE panel_item (
    item_id BIGSERIAL PRIMARY KEY,
    panel_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,  -- 业务模块
    item_type VARCHAR(20) DEFAULT 'qa',  -- qa, chart, metric
    title VARCHAR(200) NOT NULL,  -- 问题
    content TEXT NOT NULL,  -- 答案/内容
    query_text TEXT,  -- 原始查询
    metadata JSONB,  -- 额外信息（图表配置等）
    position_x INT DEFAULT 0,
    position_y INT DEFAULT 0,
    width INT DEFAULT 1,
    height INT DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (panel_id) REFERENCES user_panel(panel_id),
    FOREIGN KEY (user_id) REFERENCES sys_user(user_id)
);

-- 创建索引
CREATE INDEX idx_panel_user_id ON user_panel(user_id);
CREATE INDEX idx_item_panel_id ON panel_item(panel_id);
CREATE INDEX idx_item_user_id ON panel_item(user_id);
```

#### 4. 知识库

```sql
-- 知识库文档表
CREATE TABLE knowledge_document (
    doc_id BIGSERIAL PRIMARY KEY,
    doc_code VARCHAR(100) UNIQUE NOT NULL,  -- 制度编号
    doc_name VARCHAR(200) NOT NULL,
    doc_type VARCHAR(50) NOT NULL,  -- 制度、流程、操作手册
    category VARCHAR(50),  -- 信贷、财务、风险等
    version VARCHAR(20) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'active',  -- active, archived, deprecated
    content TEXT,  -- 文档内容
    file_path VARCHAR(500),  -- 文件存储路径
    file_size BIGINT,
    keywords TEXT[],  -- 关键词数组
    effective_date DATE,  -- 生效日期
    expiry_date DATE,  -- 失效日期
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

-- 文档权限表（哪些角色可以访问）
CREATE TABLE knowledge_permission (
    id BIGSERIAL PRIMARY KEY,
    doc_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    permission_type VARCHAR(20) DEFAULT 'view',  -- view, download
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doc_id) REFERENCES knowledge_document(doc_id),
    FOREIGN KEY (role_id) REFERENCES sys_role(role_id),
    UNIQUE(doc_id, role_id)
);

-- 知识库向量表（用于语义检索）
CREATE TABLE knowledge_vector (
    vector_id BIGSERIAL PRIMARY KEY,
    doc_id BIGINT NOT NULL,
    chunk_index INT NOT NULL,  -- 文档分块索引
    chunk_text TEXT NOT NULL,  -- 分块文本
    embedding vector(1536),  -- 向量嵌入（使用pgvector扩展）
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doc_id) REFERENCES knowledge_document(doc_id)
);

-- 创建向量索引（需要安装pgvector扩展）
-- CREATE EXTENSION IF NOT EXISTS vector;
-- CREATE INDEX idx_vector_embedding ON knowledge_vector USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX idx_doc_code ON knowledge_document(doc_code);
CREATE INDEX idx_doc_type ON knowledge_document(doc_type);
CREATE INDEX idx_doc_category ON knowledge_document(category);
CREATE INDEX idx_doc_status ON knowledge_document(status);
```

#### 5. 业务数据（视图/聚合表）

```sql
-- 业务数据视图（从数据中台同步）
-- 存款业务汇总表
CREATE TABLE biz_deposit_summary (
    id BIGSERIAL PRIMARY KEY,
    stat_date DATE NOT NULL,  -- 统计日期
    branch_code VARCHAR(50),  -- 机构代码
    branch_name VARCHAR(100),  -- 机构名称
    
    -- 存款余额
    total_balance DECIMAL(20, 2),  -- 总余额
    corporate_balance DECIMAL(20, 2),  -- 对公余额
    retail_balance DECIMAL(20, 2),  -- 零售余额
    
    -- 存款增量
    total_increase DECIMAL(20, 2),  -- 总增量
    daily_increase DECIMAL(20, 2),  -- 日增量
    monthly_increase DECIMAL(20, 2),  -- 月增量
    
    -- 客户数
    customer_count INT,
    new_customer_count INT,
    
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stat_date, branch_code)
);

-- 贷款业务汇总表
CREATE TABLE biz_loan_summary (
    id BIGSERIAL PRIMARY KEY,
    stat_date DATE NOT NULL,
    branch_code VARCHAR(50),
    branch_name VARCHAR(100),
    
    -- 贷款余额
    total_balance DECIMAL(20, 2),
    corporate_balance DECIMAL(20, 2),
    retail_balance DECIMAL(20, 2),
    
    -- 资产质量
    npl_balance DECIMAL(20, 2),  -- 不良贷款余额
    npl_ratio DECIMAL(5, 4),  -- 不良率
    overdue_balance DECIMAL(20, 2),  -- 逾期余额
    
    -- 行业分布
    industry_distribution JSONB,  -- {"制造业": 980, "房地产": 580, ...}
    
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stat_date, branch_code)
);

-- 中间业务汇总表
CREATE TABLE biz_intermediate_summary (
    id BIGSERIAL PRIMARY KEY,
    stat_date DATE NOT NULL,
    branch_code VARCHAR(50),
    branch_name VARCHAR(100),
    
    -- 中间业务收入
    total_income DECIMAL(20, 2),
    card_income DECIMAL(20, 2),  -- 银行卡
    wealth_income DECIMAL(20, 2),  -- 财富管理
    remittance_income DECIMAL(20, 2),  -- 汇款
    agency_income DECIMAL(20, 2),  -- 代理
    
    -- 交易量
    transaction_count INT,
    transaction_amount DECIMAL(20, 2),
    
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stat_date, branch_code)
);

-- 客户画像汇总表
CREATE TABLE biz_customer_summary (
    id BIGSERIAL PRIMARY KEY,
    stat_date DATE NOT NULL,
    
    -- 客户总数
    total_customers INT,
    corporate_customers INT,
    retail_customers INT,
    
    -- 客户分层
    vip_customers INT,
    high_value_customers INT,
    medium_value_customers INT,
    normal_customers INT,
    
    -- AUM (资产管理规模)
    total_aum DECIMAL(20, 2),
    
    -- 活跃度
    active_customers INT,
    mobile_banking_users INT,
    
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stat_date)
);

-- 创建索引
CREATE INDEX idx_deposit_stat_date ON biz_deposit_summary(stat_date);
CREATE INDEX idx_loan_stat_date ON biz_loan_summary(stat_date);
CREATE INDEX idx_intermediate_stat_date ON biz_intermediate_summary(stat_date);
CREATE INDEX idx_customer_stat_date ON biz_customer_summary(stat_date);
```

#### 6. 审计日志

```sql
-- 操作审计日志表
CREATE TABLE sys_audit_log (
    log_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(50),
    operation VARCHAR(50) NOT NULL,  -- login, query, export, pin, etc.
    module VARCHAR(50),  -- deposit, loan, etc.
    method VARCHAR(10),  -- GET, POST, PUT, DELETE
    request_url VARCHAR(500),
    request_params TEXT,
    response_status INT,
    response_time INT,  -- ms
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    error_msg TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 数据访问日志表（敏感数据访问记录）
CREATE TABLE sys_data_access_log (
    log_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    data_type VARCHAR(50) NOT NULL,  -- customer, transaction, loan
    data_id VARCHAR(100),  -- 访问的数据ID
    access_type VARCHAR(20),  -- view, export, download
    data_scope VARCHAR(100),  -- 数据范围描述
    reason TEXT,  -- 访问原因
    ip_address VARCHAR(50),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES sys_user(user_id)
);

-- 创建索引（分区表，按月分区）
CREATE INDEX idx_audit_user_id ON sys_audit_log(user_id);
CREATE INDEX idx_audit_operation ON sys_audit_log(operation);
CREATE INDEX idx_audit_created_time ON sys_audit_log(created_time);
CREATE INDEX idx_data_access_user_id ON sys_data_access_log(user_id);
CREATE INDEX idx_data_access_created_time ON sys_data_access_log(created_time);
```

---

## 🔌 API接口设计

### API设计规范

```
基础URL: https://api.your-bank.com/bi/v1

认证方式: Bearer Token (JWT)

请求头:
  Authorization: Bearer {token}
  Content-Type: application/json

响应格式:
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": 1706745600000
}

错误响应:
{
  "code": 401,
  "message": "未授权访问",
  "error": "UNAUTHORIZED",
  "timestamp": 1706745600000
}
```

### 核心API接口列表

#### 1. 用户认证

```yaml
# 登录
POST /auth/login
Request:
  {
    "username": "zhangsan",
    "password": "encrypted_password",
    "captcha": "1234"
  }
Response:
  {
    "code": 200,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "refresh_token_here",
      "expiresIn": 7200,
      "userInfo": {
        "userId": 1001,
        "username": "zhangsan",
        "realName": "张三",
        "department": "风险管理部",
        "roles": ["ANALYST"],
        "permissions": ["deposit:view", "loan:view"]
      }
    }
  }

# 登出
POST /auth/logout
Request: {}
Response: { "code": 200, "message": "登出成功" }

# 刷新Token
POST /auth/refresh
Request:
  {
    "refreshToken": "refresh_token_here"
  }
Response:
  {
    "code": 200,
    "data": {
      "token": "new_token_here",
      "expiresIn": 7200
    }
  }

# 获取当前用户信息
GET /auth/me
Response:
  {
    "code": 200,
    "data": {
      "userId": 1001,
      "username": "zhangsan",
      "realName": "张三",
      "department": "风险管理部",
      "position": "高级分析师",
      "roles": ["ANALYST"],
      "permissions": ["deposit:view", "loan:view", "customer:view"],
      "dataScope": 1
    }
  }
```

#### 2. AI问答接口

```yaml
# 创建对话会话
POST /ai/conversation
Request:
  {
    "module": "deposit"  # deposit, loan, intermediate, customer, dashboard, knowledge
  }
Response:
  {
    "code": 200,
    "data": {
      "sessionId": "uuid-here",
      "conversationId": 12345
    }
  }

# 发送消息（支持多轮对话）
POST /ai/conversation/{sessionId}/message
Request:
  {
    "query": "本月存款增长情况如何？",
    "context": {  # 可选，前端传递的上下文
      "previousQuery": "净利润是多少？"
    }
  }
Response:
  {
    "code": 200,
    "data": {
      "messageId": 67890,
      "content": "根据财务系统数据，本月存款增长850亿元...",
      "intent": "deposit_growth_query",
      "entities": {
        "timeRange": "本月",
        "metric": "存款增长"
      },
      "suggestions": [  # 智能追问建议
        "为什么会增长这么多？",
        "哪个部门贡献最大？",
        "对公和零售占比如何？"
      ],
      "relatedData": {  # 相关数据（可选）
        "charts": [...],
        "metrics": [...]
      }
    }
  }

# 获取对话历史
GET /ai/conversation/{sessionId}/history
Query: ?page=1&size=20
Response:
  {
    "code": 200,
    "data": {
      "total": 45,
      "messages": [
        {
          "messageId": 1,
          "type": "user",
          "content": "本月存款是多少？",
          "createdTime": "2026-02-05T10:00:00Z"
        },
        {
          "messageId": 2,
          "type": "assistant",
          "content": "本月存款余额4.58万亿元...",
          "queryText": "本月存款是多少？",
          "createdTime": "2026-02-05T10:00:02Z"
        }
      ]
    }
  }

# 结束对话
POST /ai/conversation/{sessionId}/end
Request: {}
Response: { "code": 200, "message": "对话已结束" }

# WebSocket实时对话（可选，更好的用户体验）
WebSocket: wss://api.your-bank.com/bi/v1/ai/ws/{sessionId}
Message Format:
  Client -> Server:
    {
      "type": "message",
      "query": "本月存款是多少？"
    }
  Server -> Client:
    {
      "type": "message",
      "messageId": 123,
      "content": "本月存款余额...",
      "streaming": false  # 是否流式返回
    }
  Server -> Client (流式):
    {
      "type": "stream",
      "delta": "本月",
      "done": false
    }
```

#### 3. 业务数据接口

```yaml
# 存款业务分析
GET /business/deposit/summary
Query:
  ?startDate=2026-01-01
  &endDate=2026-02-05
  &branchCode=HEAD  # 可选，机构代码
  &dimension=branch  # branch, product, customer_type
Response:
  {
    "code": 200,
    "data": {
      "totalBalance": 45800000000,  # 总余额（单位：元）
      "monthlyIncrease": 85000000000,
      "corporateBalance": 27938000000,
      "retailBalance": 17862000000,
      "trend": [  # 趋势数据
        { "date": "2026-01-01", "balance": 44950000000 },
        { "date": "2026-02-01", "balance": 45800000000 }
      ],
      "distribution": {  # 分布数据
        "byBranch": [...],
        "byProduct": [...],
        "byCustomerType": [...]
      }
    }
  }

# 贷款业务分析
GET /business/loan/summary
Query: 同存款接口
Response:
  {
    "code": 200,
    "data": {
      "totalBalance": 38200000000,
      "nplRatio": 0.0135,
      "nplBalance": 515700000,
      "industryDistribution": [
        { "industry": "制造业", "balance": 9800000000, "ratio": 0.256 },
        ...
      ],
      "riskLevel": {
        "normal": 36500000000,
        "attention": 1185000000,
        "secondary": 380000000,
        "doubtful": 95000000,
        "loss": 40700000
      }
    }
  }

# 中间业务分析
GET /business/intermediate/summary
Query: 同存款接口
Response:
  {
    "code": 200,
    "data": {
      "totalIncome": 158000000,
      "cardIncome": 55300000,
      "wealthIncome": 44240000,
      "remittanceIncome": 33490000,
      "agencyIncome": 24970000,
      "trend": [...],
      "comparison": {  # 同比环比
        "yoy": 0.123,  # 同比增长12.3%
        "mom": 0.085   # 环比增长8.5%
      }
    }
  }

# 客户画像分析
GET /business/customer/summary
Query: 同存款接口
Response:
  {
    "code": 200,
    "data": {
      "totalCustomers": 18780000,
      "corporateCustomers": 282000,
      "retailCustomers": 18498000,
      "segmentation": {
        "vip": 15600,
        "highValue": 156000,
        "mediumValue": 935000,
        "normal": 17673400
      },
      "totalAum": 125000000000,
      "mobileUsers": 8920000,
      "activeRate": 0.471
    }
  }

# 经营管理驾驶舱
GET /business/dashboard/executive
Query: ?date=2026-02-05
Response:
  {
    "code": 200,
    "data": {
      "kpi": {
        "netProfit": 13800000000,
        "nim": 0.0218,  # 净息差
        "nplRatio": 0.0135,
        "roe": 0.128,  # ROE
        "capitalAdequacyRatio": 0.1368
      },
      "trends": {
        "profit": [...],
        "assets": [...],
        "customers": [...]
      },
      "alerts": [  # 风险预警
        {
          "level": "high",
          "type": "npl",
          "message": "制造业不良率上升至2.1%",
          "count": 15
        }
      ]
    }
  }

# 数据下钻
GET /business/drilldown/{module}/{metric}
Query:
  ?dimension=branch  # 下钻维度
  &branchCode=HEAD
  &date=2026-02-05
Response:
  {
    "code": 200,
    "data": {
      "metric": "deposit_balance",
      "dimension": "branch",
      "items": [
        {
          "dimensionValue": "北京分行",
          "dimensionCode": "BJ001",
          "value": 5800000000,
          "ratio": 0.127,
          "trend": "up",
          "children": [...]  # 支持多级下钻
        },
        ...
      ]
    }
  }
```

#### 4. Pin面板接口

```yaml
# 获取用户面板
GET /panel/my
Response:
  {
    "code": 200,
    "data": {
      "panelId": 1,
      "panelName": "我的面板",
      "items": [
        {
          "itemId": 101,
          "category": "存款业务",
          "title": "本月存款增长情况",
          "content": "本月存款增长850亿元...",
          "position": { "x": 0, "y": 0, "w": 2, "h": 1 },
          "createdTime": "2026-02-05T10:00:00Z"
        },
        ...
      ],
      "layoutConfig": {
        "cols": 12,
        "rowHeight": 100
      }
    }
  }

# Pin新项目
POST /panel/items
Request:
  {
    "category": "存款业务",
    "title": "本月存款增长情况",
    "content": "本月存款增长850亿元...",
    "queryText": "本月存款增长情况如何？",
    "metadata": {
      "messageId": 12345,
      "sessionId": "uuid-here"
    }
  }
Response:
  {
    "code": 200,
    "data": {
      "itemId": 102,
      "position": { "x": 0, "y": 1, "w": 2, "h": 1 }
    }
  }

# 更新Pin项目位置/内容
PUT /panel/items/{itemId}
Request:
  {
    "position": { "x": 2, "y": 0, "w": 2, "h": 1 },
    "title": "更新后的标题",  # 可选
    "content": "更新后的内容"  # 可选
  }
Response:
  {
    "code": 200,
    "message": "更新成功"
  }

# 删除Pin项目
DELETE /panel/items/{itemId}
Response:
  {
    "code": 200,
    "message": "删除成功"
  }

# 批量更新布局
PUT /panel/layout
Request:
  {
    "items": [
      { "itemId": 101, "position": { "x": 0, "y": 0, "w": 2, "h": 1 } },
      { "itemId": 102, "position": { "x": 2, "y": 0, "w": 2, "h": 1 } }
    ]
  }
Response:
  {
    "code": 200,
    "message": "布局已保存"
  }
```

#### 5. 知识库接口

```yaml
# 搜索知识库
GET /knowledge/search
Query:
  ?q=信贷业务流程
  &type=制度  # 可选：制度、流程、手册
  &category=信贷  # 可选
  &page=1
  &size=10
Response:
  {
    "code": 200,
    "data": {
      "total": 25,
      "documents": [
        {
          "docId": 1001,
          "docCode": "ZD-XD-001",
          "docName": "信贷业务管理办法",
          "docType": "制度",
          "category": "信贷",
          "version": "2.0",
          "effectiveDate": "2025-01-01",
          "summary": "本制度规定了信贷业务的...",
          "relevanceScore": 0.95  # 相关度分数
        },
        ...
      ]
    }
  }

# 获取文档详情
GET /knowledge/documents/{docId}
Response:
  {
    "code": 200,
    "data": {
      "docId": 1001,
      "docCode": "ZD-XD-001",
      "docName": "信贷业务管理办法",
      "docType": "制度",
      "category": "信贷",
      "version": "2.0",
      "content": "第一章 总则...",  # 完整内容
      "filePath": "/knowledge/credit/ZD-XD-001_v2.pdf",
      "keywords": ["信贷", "贷款", "审批", "风险控制"],
      "effectiveDate": "2025-01-01",
      "viewCount": 1250,
      "relatedDocs": [  # 相关文档
        { "docId": 1002, "docName": "贷款操作手册" }
      ]
    }
  }

# 下载文档
GET /knowledge/documents/{docId}/download
Response: File Stream (PDF/Word)

# 智能问答（基于知识库）
POST /knowledge/qa
Request:
  {
    "question": "如何办理对公开户？",
    "context": {  # 可选，限定搜索范围
      "docType": "操作手册",
      "category": "对公业务"
    }
  }
Response:
  {
    "code": 200,
    "data": {
      "answer": "对公开户流程包括：1. 客户申请...",
      "sources": [  # 答案来源
        {
          "docId": 1005,
          "docName": "对公业务操作手册",
          "chunkText": "对公开户流程：客户申请→贷前调查...",
          "relevance": 0.92
        }
      ],
      "relatedQuestions": [  # 相关问题
        "对公开户需要哪些材料？",
        "对公账户审批流程是什么？"
      ]
    }
  }
```

#### 6. 系统管理接口

```yaml
# 用户管理
GET /system/users
POST /system/users
PUT /system/users/{userId}
DELETE /system/users/{userId}

# 角色管理
GET /system/roles
POST /system/roles
PUT /system/roles/{roleId}
DELETE /system/roles/{roleId}

# 权限管理
GET /system/permissions
POST /system/permissions
PUT /system/permissions/{permissionId}

# 审计日志查询
GET /system/audit-logs
Query:
  ?userId=1001
  &operation=query
  &module=deposit
  &startDate=2026-02-01
  &endDate=2026-02-05
  &page=1
  &size=20
Response:
  {
    "code": 200,
    "data": {
      "total": 1250,
      "logs": [
        {
          "logId": 123456,
          "userId": 1001,
          "username": "zhangsan",
          "operation": "query",
          "module": "deposit",
          "requestUrl": "/business/deposit/summary",
          "ipAddress": "10.0.1.100",
          "createdTime": "2026-02-05T10:00:00Z"
        },
        ...
      ]
    }
  }

# 数据访问日志
GET /system/data-access-logs
# 格式同审计日志
```

---

## 🔐 安全与权限

### 1. 认证机制

```yaml
认证方式: JWT (JSON Web Token)

Token结构:
  Header:
    {
      "alg": "HS256",
      "typ": "JWT"
    }
  Payload:
    {
      "userId": 1001,
      "username": "zhangsan",
      "roles": ["ANALYST"],
      "dataScope": 1,
      "iat": 1706745600,  # 签发时间
      "exp": 1706753000   # 过期时间（2小时）
    }
  Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)

Token存储:
  - 前端：localStorage（或httpOnly cookie更安全）
  - 后端：Redis（用于刷新和撤销）

Token刷新机制:
  - Access Token有效期：2小时
  - Refresh Token有效期：7天
  - Access Token过期前5分钟自动刷新
```

### 2. 权限控制模型（RBAC）

```yaml
权限模型: Role-Based Access Control (RBAC)

角色定义:
  - SUPER_ADMIN: 超级管理员（全部权限）
  - ADMIN: 系统管理员（用户、角色管理）
  - EXEC: 高管（全行数据查看，无敏感客户信息）
  - DEPT_MANAGER: 部门经理（本部门数据）
  - ANALYST: 分析师（指定模块数据查看）
  - BUSINESS: 业务人员（本人业务数据）
  - VIEWER: 访客（只读权限）

权限粒度:
  - 模块权限: deposit:*, loan:*, customer:*, etc.
  - 操作权限: view, edit, export, delete
  - 数据权限: 全行、本部门、本人

权限示例:
  EXEC:
    - dashboard:view  # 查看驾驶舱
    - deposit:view    # 查看存款数据
    - deposit:export  # 导出存款数据
    - loan:view
    - intermediate:view
    - customer:view_summary  # 只能查看客户汇总，不能查看明细
    
  ANALYST:
    - deposit:view
    - deposit:export
    - loan:view
    - knowledge:view
    - knowledge:download
    
  BUSINESS:
    - customer:view_own  # 只能查看本人客户
    - loan:view_own      # 只能查看本人贷款

数据权限实现:
  SQL层面:
    -- 全行数据
    SELECT * FROM biz_deposit_summary;
    
    -- 本部门数据
    SELECT * FROM biz_deposit_summary 
    WHERE branch_code IN (SELECT branch_code FROM user_branch WHERE user_id = #{userId});
    
    -- 本人数据
    SELECT * FROM biz_loan_summary 
    WHERE manager_id = #{userId};
```

### 3. 数据安全

```yaml
敏感数据加密:
  - 密码: BCrypt (不可逆)
  - 客户姓名: AES-256-GCM
  - 身份证号: AES-256-GCM
  - 手机号: AES-256-GCM
  - 银行卡号: 部分脱敏显示 (6222 **** **** 1234)

传输安全:
  - HTTPS (TLS 1.3)
  - API签名（可选，关键接口）

数据脱敏:
  - 客户姓名: 张*三
  - 身份证号: 110101****1234
  - 手机号: 138****5678
  - 账号: 6222****1234

SQL注入防护:
  - 使用参数化查询（PreparedStatement）
  - ORM框架自动防护
  - 输入验证

XSS防护:
  - 输入过滤
  - 输出转义
  - CSP (Content Security Policy)

CSRF防护:
  - CSRF Token
  - SameSite Cookie
  - 双重Cookie验证
```

### 4. 审计与日志

```yaml
审计要求:
  - 所有数据访问必须记录
  - 所有敏感操作必须记录
  - 日志保留期：至少3年
  - 支持按用户、时间、操作类型查询

记录内容:
  - 谁（userId, username）
  - 什么时间（timestamp）
  - 做了什么（operation）
  - 访问了什么数据（dataType, dataId）
  - 结果如何（success/fail）
  - IP地址、User-Agent

日志级别:
  - INFO: 一般操作（登录、查询）
  - WARN: 可疑操作（频繁查询、导出大量数据）
  - ERROR: 失败操作（权限不足、SQL错误）
  - CRITICAL: 严重操作（数据泄露、非法访问）

告警机制:
  - 异常登录（非办公时间、非办公地点）
  - 频繁查询（1分钟超过100次）
  - 批量导出（单次导出超过10000条）
  - 权限提升尝试
  - 敏感数据访问（客户明细）
```

---

## 🤖 AI模型集成

### 1. AI架构选择

```yaml
方案A: 调用外部大模型API（快速上线）
  模型选择:
    - OpenAI GPT-4 (通用能力强)
    - 文心一言 (中文优化，合规)
    - 通义千问 (阿里云，国产)
  
  优点:
    - 快速集成，开发成本低
    - 能力强大，持续更新
    - 无需GPU资源
  
  缺点:
    - 数据需要外传（合规风险）
    - 按调用次数收费
    - 依赖外部服务

方案B: 部署本地大模型（推荐）
  模型选择:
    - ChatGLM3-6B (清华，轻量级)
    - Baichuan2-13B (百川，中文优化)
    - Qwen-14B (阿里，通用能力强)
    - Llama2-13B (Meta，开源)
  
  优点:
    - 数据不出行，安全合规
    - 可微调，适配银行场景
    - 长期成本低
  
  缺点:
    - 需要GPU服务器
    - 需要模型微调
    - 部署运维成本高

方案C: 混合方案（灵活）
  - 本地模型: 处理敏感数据查询
  - 外部模型: 处理通用知识问答
  - 根据数据敏感度自动路由

推荐: 方案B（本地大模型）
  理由: 银行数据敏感，合规要求高
```

### 2. 本地大模型部署

```yaml
硬件要求:
  CPU: 32核+
  内存: 128GB+
  GPU: NVIDIA A100 (40GB) x 2 或 4090 x 4
  存储: 2TB SSD

软件栈:
  框架: vLLM / TGI (Text Generation Inference)
  模型: ChatGLM3-6B 或 Qwen-14B
  推理优化: Flash Attention 2, Int8量化

部署步骤:
  1. 下载预训练模型
     huggingface-cli download THUDM/chatglm3-6b
  
  2. 启动推理服务
     python -m vllm.entrypoints.openai.api_server \
       --model /models/chatglm3-6b \
       --gpu-memory-utilization 0.9 \
       --max-model-len 8192
  
  3. API调用
     POST http://localhost:8000/v1/chat/completions
     {
       "model": "chatglm3-6b",
       "messages": [
         {"role": "user", "content": "本月存款是多少？"}
       ],
       "temperature": 0.7,
       "stream": true
     }

性能优化:
  - 量化: Int8/Int4量化，减少显存
  - 批处理: 合并多个请求
  - 缓存: KV Cache复用
  - 负载均衡: 多GPU并行
```

### 3. RAG（检索增强生成）

```yaml
架构:
  问题 -> 意图识别 -> 知识检索 -> 上下文构建 -> LLM生成 -> 答案

组件:
  1. 向量数据库: PostgreSQL + pgvector / Milvus
  2. Embedding模型: text-embedding-ada-002 / bge-large-zh
  3. 检索器: 语义检索 + 关键词检索
  4. 重排序: Cross-Encoder重排序
  5. 生成器: ChatGLM3 / Qwen

流程:
  1. 问题编码
     query_embedding = embed_model.encode("本月存款是多少？")
  
  2. 向量检索（Top-K）
     SELECT doc_id, chunk_text, 1 - (embedding <=> query_embedding) as score
     FROM knowledge_vector
     ORDER BY embedding <=> query_embedding
     LIMIT 5;
  
  3. 重排序
     cross_encoder.rank(query, [chunk1, chunk2, chunk3, ...])
  
  4. 构建Prompt
     context = "\n".join([chunk.text for chunk in top_chunks])
     prompt = f"""
     你是银行AI助手。根据以下信息回答问题。
     
     背景信息：
     {context}
     
     问题：{query}
     
     回答：
     """
  
  5. LLM生成
     response = llm.generate(prompt)

优化:
  - 混合检索: 向量 + BM25
  - 动态Top-K: 根据查询复杂度调整
  - 多轮对话: 维护对话历史，理解上下文
  - 结果验证: 检查生成内容与检索结果的一致性
```

### 4. 意图识别与实体提取

```yaml
意图分类:
  - deposit_query: 存款查询
  - loan_query: 贷款查询
  - customer_query: 客户查询
  - trend_analysis: 趋势分析
  - comparison: 对比分析
  - why_question: 原因分析
  - how_to: 流程咨询
  - knowledge_search: 知识检索

实体提取:
  - 时间: "本月", "今年", "2026年1月"
  - 指标: "存款余额", "不良率", "净利润"
  - 维度: "对公", "零售", "制造业"
  - 机构: "北京分行", "上海分行"

实现方式:
  方案A: 规则匹配（快速）
    if "本月" in query and "存款" in query:
        intent = "deposit_query"
        entities = {"time": "本月", "metric": "存款"}
  
  方案B: NER模型（准确）
    from transformers import pipeline
    ner = pipeline("ner", model="bert-base-chinese-ner")
    entities = ner("本月存款增长850亿元")
    # [{'entity': 'TIME', 'word': '本月'}, ...]
  
  方案C: LLM提取（灵活）
    prompt = f"""
    从以下问题中提取意图和实体。
    
    问题：{query}
    
    输出JSON格式：
    {{
      "intent": "...",
      "entities": {{
        "time": "...",
        "metric": "...",
        "dimension": "..."
      }}
    }}
    """
    result = llm.generate(prompt)
    parsed = json.loads(result)

推荐: 混合方案
  - 简单查询: 规则匹配
  - 复杂查询: LLM提取
  - 实体识别: NER模型
```

---

## 🔄 数据对接方案

### 1. 数据源清单

```yaml
核心系统:
  - NC财务系统: 财务数据（利润、资产、负债）
  - 核心业务系统: 存款、贷款、账户数据
  - 信贷系统: 贷款申请、审批、不良数据
  - 客户系统: 客户信息、分层、AUM
  - 渠道系统: 手机银行、网银交易数据
  - 中间业务系统: 银行卡、理财、汇款数据

外部数据:
  - 人民银行: 征信数据
  - 银保监: 监管报表数据
  - 市场数据: 利率、汇率、股票

文档数据:
  - 制度文档: Word/PDF
  - 流程图: Visio/PPT
  - 操作手册: PDF
```

### 2. 数据同步策略

```yaml
实时同步（WebSocket/消息队列）:
  场景: 交易数据、余额变动
  技术: Kafka、RabbitMQ
  延迟: < 1秒
  
  示例:
    核心系统 -> Kafka -> BI平台
    Topic: deposit_transaction, loan_approval

准实时同步（定时任务）:
  场景: 业务汇总数据
  技术: Spring Scheduler、Quartz
  频率: 每15分钟
  
  示例:
    Cron: 0 */15 * * * ?
    Task: 从核心系统同步最近15分钟的汇总数据

批量同步（ETL）:
  场景: 历史数据、大批量数据
  技术: Kettle、DataX、Flink
  频率: 每天凌晨
  
  示例:
    时间: 02:00 AM
    Task: 全量同步昨日业务数据
    
增量同步（CDC）:
  场景: 数据库变更捕获
  技术: Debezium、Canal
  延迟: < 5秒
  
  示例:
    Source: Oracle/MySQL binlog
    Sink: PostgreSQL
```

### 3. 数据治理

```yaml
数据质量检查:
  - 完整性: 必填字段非空
  - 准确性: 数据格式正确
  - 一致性: 跨系统数据一致
  - 及时性: 数据延迟监控

数据清洗:
  - 去重: 删除重复记录
  - 补全: 填充缺失值
  - 转换: 统一单位、格式
  - 校验: 业务规则校验

数据血缘:
  - 记录数据来源
  - 追踪数据加工过程
  - 支持问题排查

元数据管理:
  - 数据字典
  - 表结构
  - 数据说明
  - 更新频率
```

### 4. 接口规范

```yaml
接口类型:
  1. REST API
     - 适用: 查询类接口
     - 示例: GET /api/deposit/balance?date=2026-02-05
  
  2. WebService (SOAP)
     - 适用: 遗留系统对接
     - 示例: <depositQuery>...</depositQuery>
  
  3. 消息队列
     - 适用: 异步、高并发
     - 示例: Kafka Topic: deposit.transaction
  
  4. 数据库直连（只读）
     - 适用: 实时查询
     - 限制: 只读权限，视图隔离

数据格式:
  {
    "code": "SUCCESS",
    "message": "查询成功",
    "data": {
      "statDate": "2026-02-05",
      "totalBalance": 45800000000,
      "currency": "CNY",
      "unit": "元"
    },
    "timestamp": 1706745600000,
    "traceId": "uuid-here"
  }

错误处理:
  {
    "code": "DATA_NOT_FOUND",
    "message": "未找到指定日期的数据",
    "timestamp": 1706745600000,
    "traceId": "uuid-here"
  }
```

---

## 🚀 部署方案

### 1. 部署架构

```yaml
环境划分:
  - 开发环境 (DEV): 开发测试
  - 测试环境 (UAT): 用户验收测试
  - 预生产环境 (PRE): 压力测试、演练
  - 生产环境 (PROD): 正式使用

部署方式:
  传统部署:
    - 应用服务器: Tomcat / Jetty
    - Web服务器: Nginx
    - 负载均衡: F5 / Nginx
  
  容器化部署（推荐）:
    - 容器: Docker
    - 编排: Kubernetes
    - 镜像仓库: Harbor
    - CI/CD: Jenkins / GitLab CI

高可用架构:
  ┌─────────────┐
  │   负载均衡   │  (Nginx / F5)
  │  (主 + 备)   │
  └──────┬──────┘
         │
    ┌────┴────┐
    │         │
  ┌─▼──┐   ┌─▼──┐   ┌────┐
  │ App│   │ App│   │ App│  (应用服务，3节点+)
  │  1 │   │  2 │   │  3 │
  └─┬──┘   └─┬──┘   └─┬──┘
    │        │        │
    └────┬───┴────┬───┘
         │        │
    ┌────▼────┐  ┌▼────────┐
    │   PG    │  │  Redis  │
    │ 主 + 从 │  │ 哨兵模式 │
    └─────────┘  └─────────┘
```

### 2. Kubernetes部署配置

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bi-platform-backend
  namespace: bank-bi
spec:
  replicas: 3
  selector:
    matchLabels:
      app: bi-backend
  template:
    metadata:
      labels:
        app: bi-backend
    spec:
      containers:
      - name: backend
        image: harbor.your-bank.com/bi/backend:v1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: bi-backend-service
  namespace: bank-bi
spec:
  type: ClusterIP
  selector:
    app: bi-backend
  ports:
  - port: 80
    targetPort: 8080

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: bi-backend-ingress
  namespace: bank-bi
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.bi.your-bank.com
    secretName: bi-tls-secret
  rules:
  - host: api.bi.your-bank.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: bi-backend-service
            port:
              number: 80
```

### 3. 前端部署

```yaml
# Nginx配置
server {
    listen 443 ssl http2;
    server_name bi.your-bank.com;
    
    ssl_certificate /etc/nginx/ssl/bi.crt;
    ssl_certificate_key /etc/nginx/ssl/bi.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    root /var/www/bi-platform;
    index index.html;
    
    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://bi-backend-service/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket
    location /ws/ {
        proxy_pass http://bi-backend-service/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
}

# Dockerfile (前端)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /var/www/bi-platform
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
```

### 4. 数据库部署

```yaml
PostgreSQL主从复制:
  主节点 (Master):
    - 负责写操作
    - 实时同步到从节点
  
  从节点 (Slave):
    - 负责读操作
    - 自动故障转移
  
  配置:
    # postgresql.conf (Master)
    wal_level = replica
    max_wal_senders = 5
    wal_keep_size = 1GB
    
    # recovery.conf (Slave)
    standby_mode = 'on'
    primary_conninfo = 'host=master port=5432 user=replicator'
    trigger_file = '/tmp/postgresql.trigger.5432'

Redis哨兵模式:
  哨兵节点: 3个
  主节点: 1个
  从节点: 2个
  
  配置:
    # sentinel.conf
    sentinel monitor mymaster 10.0.1.100 6379 2
    sentinel down-after-milliseconds mymaster 5000
    sentinel parallel-syncs mymaster 1
    sentinel failover-timeout mymaster 10000

备份策略:
  全量备份: 每周日凌晨
  增量备份: 每天凌晨
  归档日志: WAL归档
  保留期限: 90天
  
  备份脚本:
    pg_basebackup -h master -U backup -D /backup/$(date +%Y%m%d) -Ft -z -P
```

---

## 📝 开发步骤

### Phase 1: 基础设施（2周）

```yaml
Week 1: 环境搭建
  - [ ] 服务器申请（开发、测试、生产）
  - [ ] 数据库安装（PostgreSQL、Redis）
  - [ ] 中间件安装（Nginx、Kafka可选）
  - [ ] 开发工具配置（IDE、Git、Maven/npm）
  - [ ] CI/CD流水线搭建（Jenkins/GitLab CI）

Week 2: 数据库设计
  - [ ] 创建数据库表结构
  - [ ] 初始化基础数据（角色、权限）
  - [ ] 测试数据导入
  - [ ] 数据备份策略
  - [ ] 性能基线测试
```

### Phase 2: 后端核心（4周）

```yaml
Week 3: 用户认证
  - [ ] 用户登录/登出API
  - [ ] JWT生成与验证
  - [ ] 权限拦截器
  - [ ] Session管理（Redis）
  - [ ] 单元测试

Week 4: 业务数据API
  - [ ] 存款业务API（4个接口）
  - [ ] 贷款业务API（4个接口）
  - [ ] 中间业务API（4个接口）
  - [ ] 客户业务API（4个接口）
  - [ ] 集成测试

Week 5: AI问答服务
  - [ ] 本地大模型部署（ChatGLM3）
  - [ ] API封装（对话接口）
  - [ ] 多轮对话管理
  - [ ] 意图识别
  - [ ] 性能优化

Week 6: Pin面板 & 知识库
  - [ ] Pin面板CRUD API
  - [ ] 布局保存/恢复
  - [ ] 知识库检索API（Elasticsearch）
  - [ ] 文档上传/下载
  - [ ] RAG集成
```

### Phase 3: 数据对接（3周）

```yaml
Week 7-8: 核心系统对接
  - [ ] NC财务系统接口调研
  - [ ] 核心业务系统数据同步
  - [ ] 信贷系统数据同步
  - [ ] 客户系统数据同步
  - [ ] ETL任务开发

Week 9: 数据治理
  - [ ] 数据质量检查
  - [ ] 数据清洗规则
  - [ ] 异常数据告警
  - [ ] 数据血缘记录
  - [ ] 测试验证
```

### Phase 4: 前后端联调（2周）

```yaml
Week 10: 接口联调
  - [ ] 登录认证联调
  - [ ] 业务数据展示联调
  - [ ] AI问答联调
  - [ ] Pin面板联调
  - [ ] 知识库联调

Week 11: 功能完善
  - [ ] 错误处理优化
  - [ ] Loading状态完善
  - [ ] 权限控制验证
  - [ ] 性能优化
  - [ ] 兼容性测试
```

### Phase 5: 测试与优化（3周）

```yaml
Week 12: 功能测试
  - [ ] 用户验收测试（UAT）
  - [ ] 权限测试
  - [ ] 业务场景测试
  - [ ] 兼容性测试
  - [ ] Bug修复

Week 13: 性能测试
  - [ ] 压力测试（JMeter）
  - [ ] 并发测试
  - [ ] 数据库优化
  - [ ] 缓存优化
  - [ ] 接口响应时间优化

Week 14: 安全测试
  - [ ] 渗透测试
  - [ ] SQL注入测试
  - [ ] XSS/CSRF测试
  - [ ] 权限绕过测试
  - [ ] 安全加固
```

### Phase 6: 上线准备（1周）

```yaml
Week 15: 上线准备
  - [ ] 生产环境部署
  - [ ] 数据迁移
  - [ ] 监控配置
  - [ ] 应急预案
  - [ ] 用户培训
  - [ ] 文档编写（用户手册、运维手册）
  - [ ] 上线评审
  - [ ] 正式发布
```

---

## 📊 监管合规

### 1. 等保要求

```yaml
等级保护三级（银行系统通常要求）:

物理安全:
  - 机房门禁
  - 视频监控
  - 设备防盗

网络安全:
  - 边界防护（防火墙）
  - 访问控制（ACL）
  - 入侵检测（IDS）
  - 流量监控

主机安全:
  - 操作系统加固
  - 补丁管理
  - 病毒防护
  - 日志审计

应用安全:
  - 身份认证（双因素认证）
  - 访问控制（RBAC）
  - 数据加密（传输+存储）
  - 安全审计

数据安全:
  - 数据备份（3-2-1原则）
  - 数据恢复演练
  - 数据销毁管理
  - 敏感数据保护
```

### 2. 银保监合规

```yaml
数据安全:
  - 客户数据加密存储
  - 敏感信息脱敏
  - 数据访问审计
  - 数据导出管控

权限管理:
  - 最小权限原则
  - 权限审批流程
  - 定期权限复核
  - 离职权限回收

审计要求:
  - 操作日志完整
  - 日志不可篡改
  - 日志保留3年+
  - 支持监管检查

业务连续性:
  - RTO < 4小时
  - RPO < 1小时
  - 灾难恢复预案
  - 定期演练
```

### 3. 个人信息保护法

```yaml
数据采集:
  - 明确告知用户
  - 获得用户授权
  - 最小必要原则

数据使用:
  - 用途限制
  - 不得超范围使用
  - 禁止非法买卖

数据保护:
  - 技术措施（加密）
  - 管理措施（权限）
  - 安全评估

用户权利:
  - 知情权
  - 查询权
  - 更正权
  - 删除权
```

---

## 📚 附录

### A. 技术选型对比

| 技术 | 方案A | 方案B | 推荐 |
|------|-------|-------|------|
| 后端语言 | Java | Node.js | Java |
| Web框架 | Spring Boot | NestJS | Spring Boot |
| ORM | MyBatis Plus | TypeORM | MyBatis Plus |
| 数据库 | PostgreSQL | MySQL | PostgreSQL |
| 缓存 | Redis | Redis | Redis |
| 搜索 | Elasticsearch | Elasticsearch | Elasticsearch |
| AI模型 | 本地ChatGLM | OpenAI API | 本地ChatGLM |
| 部署 | Kubernetes | Docker Compose | Kubernetes |

### B. 成本估算

```yaml
服务器成本:
  应用服务器: 8核32G x 3台 = 3万元/年
  数据库服务器: 16核64G x 2台 = 5万元/年
  GPU服务器: A100 40G x 2卡 = 15万元/年
  小计: 23万元/年

软件成本:
  数据库License: 开源PostgreSQL = 0元
  操作系统: Linux = 0元
  中间件: 开源 = 0元
  AI模型: 开源 = 0元
  小计: 0元

人力成本:
  后端开发: 2人 x 6个月 = 12人月
  前端开发: 1人 x 3个月 = 3人月
  测试: 1人 x 2个月 = 2人月
  运维: 1人 x 1个月 = 1人月
  小计: 18人月 (按每人月2万元计算 = 36万元)

总成本: 约60万元（首年）
```

### C. 项目风险

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|----------|
| 数据对接困难 | 中 | 高 | 提前调研，准备备用方案 |
| AI效果不佳 | 中 | 中 | 模型微调，优化Prompt |
| 性能不达标 | 低 | 高 | 压测验证，预留优化时间 |
| 安全合规问题 | 低 | 高 | 提前咨询合规部门 |
| 上线延期 | 中 | 中 | 敏捷开发，MVP优先 |

### D. 参考资料

```yaml
技术文档:
  - Spring Boot官方文档
  - PostgreSQL官方文档
  - Redis官方文档
  - ChatGLM项目地址
  - LangChain文档

行业标准:
  - 等保2.0标准
  - 银保监数据安全规范
  - 个人信息保护法

开源项目:
  - Jeecg-Boot (后台管理系统)
  - RuoYi (权限管理)
  - FastGPT (知识库+RAG)
  - Dify (LLM应用开发)
```

---

## 🎯 总结

本方案提供了从前端Demo到生产级系统的完整路径，覆盖：

✅ **架构设计** - 分层清晰，易于扩展  
✅ **技术选型** - 成熟稳定，符合银行要求  
✅ **数据库设计** - 完整的表结构和索引  
✅ **API设计** - RESTful规范，文档完善  
✅ **安全合规** - 满足等保和监管要求  
✅ **AI集成** - 本地部署，数据安全  
✅ **部署方案** - 容器化，高可用  
✅ **开发计划** - 15周完成，分阶段交付  

**建议：**
1. 先从MVP开始，核心功能优先
2. 数据对接提前规划，分批实施
3. 安全合规从设计开始，不是事后补救
4. 用户反馈驱动迭代，持续优化

**下一步：**
1. 组建项目团队
2. 环境申请与采购
3. 详细设计评审
4. 启动开发

---

**文档版本：** v1.0  
**更新日期：** 2026-02-05  
**联系人：** [您的名字]
