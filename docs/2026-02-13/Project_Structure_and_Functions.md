# 项目结构与功能汇总

**文档日期**: 2026-02-13

本文档详细梳理了 **BankBIPlatform**（银行智能BI平台）的项目文件结构、各模块用途以及核心业务功能流程。

## 1. 项目结构全览

项目采用前后端分离但代码共存的结构。

- **根目录**: 前端工程 (React + Vite + TypeScript)
- **src/backend**: 后端工程 (Spring Boot + Java)

### 1.1 前端结构 (`src/`)

#### 核心组件 (`src/components/`)
位于 `src/components/` 目录下，分为通用 UI 组件和业务功能组件。

**业务功能组件:**
| 文件名 | 用途描述 |
| :--- | :--- |
| **DataManager.tsx** | **数据管理中心**。负责数据源的接入与管理。包含表结构(Schema)导入、数据导入(覆盖/追加模式)、数据清洗（模拟）、字段打标等功能。 |
| **BankChatInterface.tsx** | **智能对话主界面**。集成了 AI 助手对话框、业务导航、快速指令等功能，是用户与系统交互的主要入口。 |
| **ExecutiveDashboard.tsx** | **行长/高管驾驶舱**。展示全行核心指标（存款、贷款、营收等）的宏观视图。 |
| **BankQuickDashboard.tsx** | **快速经营看板**。提供分行或部门级别的关键业绩指标(KPI)概览。 |
| **KnowledgeBase.tsx** | **知识库管理**。用于上传、索引和检索银行内部文档（如政策文件、操作手册），支持 RAG（检索增强生成）问答。 |
| **DataVisualization.tsx** | **通用图表组件**。封装了 ECharts 或 Recharts，用于在对话或看板中动态渲染图表。 |
| **IntermediateBusinessAnalysis.tsx** | **中间业务分析**。专门针对理财、代销等中间业务的深度分析页面。 |
| **TradeAnalysis.tsx** | **交易分析**。针对交易流水数据的多维分析。 |
| **LogisticsAnalysis.tsx** | **后勤/运营分析**。网点运营效率与后勤保障数据的分析。 |
| **AssistantSidebar.tsx** | **侧边导航栏**。提供模块切换功能。 |

**通用 UI 组件 (`src/components/ui/`):**
包含 `button.tsx`, `card.tsx`, `dialog.tsx`, `table.tsx` 等基础原子组件，基于 shadcn/ui 设计体系。

#### API 交互 (`src/lib/`)
| 文件名 | 用途描述 |
| :--- | :--- |
| **api.ts** | **前端 API 客户端**。封装了所有与后端交互的 HTTP 请求函数（如 `importSchema`, `importData`, `sendChatMessage` 等）。 |
| **utils.ts** | 通用工具函数（如 CSS 类名合并等）。 |

### 1.2 后端结构 (`src/backend/`)

基于 Spring Boot 的标准分层架构。

**核心代码 (`src/main/java/com/bank/bi/`):**

| 包名/类名 | 用途描述 |
| :--- | :--- |
| **controller/** | **控制层**。接收前端请求。 |
| ├─ `DataManagementController.java` | 处理 Schema 导入、数据上传、列信息管理等请求。 |
| ├─ `AiController.java` | 处理 AI 对话、Text-to-SQL 分析请求。 |
| ├─ `KnowledgeController.java` | 处理知识库文档上传与检索请求。 |
| ├─ `MetricController.java` | 处理业务指标的定义与查询（原子指标/衍生指标）。 |
| **service/** | **业务逻辑层**。 |
| ├─ `DataManagementService.java` | **核心服务**。实现了动态 DDL（建表/修表）、数据解析（Excel/CSV）、数据导入（覆盖/追加）逻辑。 |
| ├─ `HiAgentService.java` | AI 智能体编排服务，集成 LLM 调用与工具分发。 |
| ├─ `KnowledgeService.java` | 知识库服务，负责文档向量化与相似度检索。 |
| **repository/** | **数据访问层**。JPA 接口，负责与数据库交互。 |
| ├─ `DataTableRepository.java` | 数据表元数据存取。 |
| ├─ `DataColumnRepository.java` | 字段元数据存取。 |
| **model/** | **实体类**。定义数据库表对应的 Java 对象。 |

**配置与资源 (`src/main/resources/`):**
- `application.yml`: 后端核心配置（端口、数据库连接、日志级别等）。
- `skills/`: AI 技能配置文件（如数据查询、报表生成的 Prompt 模板）。

---

## 2. 功能汇总与工作流

### 2.1 数据管理工作流 (Data Management)
这是平台的基础，实现了从 Excel/CSV 到数据库的自动化流程。

1.  **Schema 定义与导入**:
    *   用户上传包含表结构定义的 Excel 文件。
    *   **文件格式**: 包含 `数据表英文名`, `数据表中文名`, `字段英文名`, `数据类型`, `操作类型` 等列。
    *   **后端逻辑**: 解析 Excel -> 根据 `操作类型` (`新增`/`修改`/`删除`) 动态生成并执行 SQL DDL 语句 -> 更新元数据表。
2.  **业务数据导入**:
    *   用户选择已定义的表，上传对应的数据文件 (CSV/Excel)。
    *   **模式选择**:
        *   🔴 **全表覆盖 (Overwrite)**: 系统执行 `TRUNCATE` 清空表 -> 批量插入新数据。
        *   🟢 **新增数据 (Append)**: 系统保留旧数据 -> 追加插入新数据。
3.  **数据清洗与打标**:
    *   用户可手动触发清洗任务（模拟）。
    *   用户可在界面上为字段添加业务标签（维度、指标、时间），辅助 AI 理解数据。

### 2.2 智能问数工作流 (Text-to-SQL)
通过自然语言查询数据库中的业务数据。

1.  **用户提问**: 在对话框输入 "查询上个月存款余额大于 50 万的客户"。
2.  **意图识别**: AI 分析用户意图，识别为 "数据查询"。
3.  **Schema 检索**: 系统检索相关表的 Schema 和业务标签。
4.  **SQL 生成**: LLM 结合问题与 Schema 生成 SQL 语句。
5.  **执行与反馈**: 后端执行 SQL -> 返回结果集 -> 前端自动选择合适的图表（柱状图/表格）进行渲染。

### 2.3 知识库问答工作流 (RAG)
利用非结构化文档辅助决策。

1.  **文档入库**: 管理员上传 PDF/Word/TXT 文档（如《信贷审批指引》）。
2.  **向量化**: 后端将文档切片并转化为向量存储。
3.  **语义检索**: 用户提问 "小微企业贷款的准入条件是什么？" -> 系统检索最相关的文档片段。
4.  **生成回答**: LLM 基于检索到的上下文生成准确答案，并标注来源。

### 2.4 经营看板 (Dashboards)
多维度的数据可视化展示。

*   **数据来源**: 直接读取数据库中的业务表（如 `account_deposit`, `transaction_log`）。
*   **交互**: 支持下钻（Drill-down）和联动分析。

---

## 3. 测试数据说明

为了方便演示与测试，系统预置了以下数据文件（位于 `preload/data/new_v2/`）：

*   **schema_all.csv**: 包含 5 张核心表的完整结构定义。
*   **customer_info.csv**: 客户基础信息数据。
*   **account_deposit.csv**: 存款账户数据。
*   **account_loan.csv**: 贷款账户数据。
*   **transaction_log.csv**: 交易流水数据。
*   **branch_info.csv**: 银行网点数据。
