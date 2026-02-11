# 恒丰银行智能问数平台 (Evergrowing Bank Intelligent Data Query Platform)

## 1. 产品简介
本平台是专为银行打造的智能数据分析解决方案，通过 **AI对话 (Text-to-SQL)** 和 **知识库问答 (RAG)** 技术，帮助银行高管和业务人员轻松查询核心系统数据，实现从"看数据"到"问数据"到"AI洞察"的三级递进能力。

## 2. 核心功能

### 2.1 智能问数 (Text-to-SQL)
- **自然语言查询**: 支持如 "查询北京分行去年的存款总额"、"统计各分行不良贷款率" 等复杂业务问题。
- **安全可控机制**: 
  - **JSON 中间层**: AI 不直接生成 SQL，而是输出结构化 JSON 参数，由后端 `SafeQueryBuilder` 构建 SQL，杜绝注入风险。
  - **白名单校验**: 严格限制表名、列名和操作符。
  - **只读保护**: 仅允许 `SELECT` 查询，禁止任何 DML (UPDATE/DELETE) 操作。
- **权限隔离**: 基于用户的 `DataScope` (如 "Beijing Branch") 自动在 SQL 中注入过滤条件，确保用户只能查看权限内的数据。

### 2.2 知识库 (RAG)
- **多格式支持**: 支持上传 PPT, Excel, CSV, TXT, PDF, Word 及图片文件。
- **智能解析**: 内置 OCR 和文本提取 (Apache Tika)，支持中英文混合文档。
- **角色权限**: 文档上传时可指定可见角色 (如 ADMIN, BUSINESS)，检索时自动过滤无权文档。
- **编码自适应**: 自动检测文件编码 (UTF-8/GBK)，完美解决中文乱码问题。

### 2.3 仪表盘 (Pin)
- **个性化看板**: 支持创建 "个人看板" 和 "团队看板"。
- **一键固定**: 将 AI 分析生成的图表或数据表格 "Pin" 到指定看板，形成固定的日报/周报视图。

### 2.4 数据管理
- **自动预置**: 系统启动时自动扫描 `preload/data` (CSV) 和 `preload/knowledge` (文档) 目录，实现开箱即用。
- **动态建模**: 上传 CSV 文件后，系统自动推断列类型 (Int/Double/Date/String) 并创建数据库表。
- **元数据管理**: 自动维护表结构和业务字段描述，辅助 AI 理解数据。

### 2.5 安全合规
- **数据脱敏**: 依照银行合规要求，对姓名 (张**)、手机号 (138****5678)、身份证 (前3后4)、银行卡号进行自动脱敏。
- **审计日志**: 记录每一次 AI 查询的 提问者、原始问题、生成SQL、执行耗时、结果行数，满足审计溯源需求。

## 3. 系统架构
- **后端**: Java 17, Spring Boot 3, Spring Data JPA
- **数据库**: H2 Database (嵌入式，可配置为 MySQL/Oracle)
- **AI 引擎**: 集成大模型 API，支持 Function Calling 和 Context Learning
- **文档处理**: Apache Tika, PDFBox
- **安全**: Spring Security, JWT Token

## 4. 快速开始

### 4.1 环境要求
- JDK 17 或更高版本
- Maven 3.6+

### 4.2 启动步骤
1. 进入后端目录:
   ```bash
   cd src/backend
   ```
2. 编译打包:
   ```bash
   mvn clean package
   ```
3. 启动服务:
   ```bash
   java -jar target/bi-platform-1.0.0.jar
   ```
   *注: 服务启动时会自动加载 `preload/` 目录下的演示数据，耗时约 5-10 秒。*

### 4.3 验证功能
服务启动后，后端运行在 `http://localhost:8080`。
您可以使用 Postman 或前端界面进行测试。

**演示数据预置**:
系统已自动加载以下 5 大核心业务数据表：
- `operation_metrics` (经营指标)
- `deposit_data` (存款数据)
- `loan_data` (贷款数据)
- `intermediate_business` (中间业务)
- `customer_profile` (客户画像)

### 4.4 典型提问示例
您可以尝试问 AI 以下问题：
1. **经营分析**: "2023年全行营业收入是多少？与去年相比如何？"
2. **存款业务**: "统计各分行的存款余额排名，并用柱状图展示。"
3. **风险管理**: "查询不良贷款率最高的 3 个行业。"
4. **客户营销**: "列出资产超过 500 万且风险等级为 Low 的客户名单。"

## 5. 目录结构说明
```
AIboard/
├── preload/                # 预置数据目录
│   ├── data/               # CSV 数据文件 (自动建表)
│   └── knowledge/          # 知识库文档 (自动入库)
├── src/
│   ├── backend/            # Java Spring Boot 后端
│   │   ├── src/main/java/com/bank/bi/
│   │   │   ├── service/    # 核心业务逻辑 (HiAgentService, KnowledgeService)
│   │   │   ├── util/       # 工具类 (SafeQueryBuilder, DataMaskingUtil)
│   │   │   └── ...
│   └── frontend/           # (可选) 前端工程
└── README.md               # 项目说明文档
```

---
*Evergrowing Bank Intelligent Data Query Platform - Internal Release*
