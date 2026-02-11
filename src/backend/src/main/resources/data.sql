-- 初始化数据脚本

-- 插入角色
INSERT INTO sys_role (role_code, role_name, description, status) VALUES
('ADMIN', '系统管理员', '拥有所有权限', 1),
('EXEC', '高管', '查看全行数据，无敏感客户信息', 1),
('ANALYST', '分析师', '查看指定模块数据', 1),
('BUSINESS', '业务人员', '查看本人业务数据', 1);

-- 插入测试用户（密码都是: admin123）
-- BCrypt加密后的密码: $2a$10$xYp5gqKZZqw5YwF5Q5VF8ORvE6qVLx8J6xYvB5Rq4V8xYZ5Q5VF8O
INSERT INTO sys_user (username, password, real_name, department, position, email, status) VALUES
('admin', '$2a$10$xYp5gqKZZqw5YwF5Q5VF8ORvE6qVLx8J6xYvB5Rq4V8xYZ5Q5VF8O', '管理员', '信息科技部', '系统管理员', 'admin@bank.com', 1),
('zhangsan', '$2a$10$xYp5gqKZZqw5YwF5Q5VF8ORvE6qVLx8J6xYvB5Rq4V8xYZ5Q5VF8O', '张三', '风险管理部', '高级分析师', 'zhangsan@bank.com', 1),
('lisi', '$2a$10$xYp5gqKZZqw5YwF5Q5VF8ORvE6qVLx8J6xYvB5Rq4V8xYZ5Q5VF8O', '李四', '营业部', '客户经理', 'lisi@bank.com', 1);

-- 分配角色
INSERT INTO sys_user_role (user_id, role_id) VALUES
(1, 1),
(2, 3),
(3, 4);

-- 插入测试对话
INSERT INTO ai_conversation (user_id, session_id, module, title, status, message_count, started_time) VALUES
(1, 'test-session-1', 'deposit', '本月存款增长情况如何？', 1, 4, CURRENT_TIMESTAMP);

-- 插入测试消息
INSERT INTO ai_message (conversation_id, message_type, content, created_time) VALUES
(1, 'user', '本月存款增长情况如何？', CURRENT_TIMESTAMP),
(1, 'assistant', '根据财务系统数据，本月存款增长850亿元，环比增长1.9%。其中：\n- 对公存款增长520亿元（61%）\n- 零售存款增长330亿元（39%）\n\n主要增长来自北京分行和上海分行，合计贡献了65%的增量。', CURRENT_TIMESTAMP),
(1, 'user', '哪些行业贡献最大？', CURRENT_TIMESTAMP),
(1, 'assistant', '从行业分布来看，本月存款增长主要来自：\n1. 制造业：280亿元（33%）\n2. 房地产：180亿元（21%）\n3. 金融业：140亿元（16%）\n4. 批发零售：120亿元（14%）\n5. 其他行业：130亿元（16%）\n\n制造业增长主要受到政府产业政策支持和企业投资需求增加的推动。', CURRENT_TIMESTAMP);

-- 插入测试Pin项目
-- 先插入 Panel (id=1)
INSERT INTO bi_panels (name, user_id, type, created_time) VALUES ('My Dashboard', 1, 'PERSONAL', CURRENT_TIMESTAMP);

-- 再插入 PanelItem (关联 panel_id=1)
INSERT INTO bi_panel_items (panel_id, question, chart_type, layout_config, created_time) VALUES
(1, '本月存款增长情况如何？', 'card', '{"x":0,"y":0,"w":2,"h":1}', CURRENT_TIMESTAMP),
(1, '当前不良率是多少？', 'line', '{"x":2,"y":0,"w":2,"h":1}', CURRENT_TIMESTAMP),
(1, '高价值客户有多少？', 'pie', '{"x":0,"y":1,"w":2,"h":1}', CURRENT_TIMESTAMP);
