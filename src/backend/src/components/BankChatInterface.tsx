import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Download, Send, Sparkles, BarChart3, FileText, AlertCircle, Shield, Loader2, PanelTopOpen, Pin } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { DataVisualization } from './DataVisualization';
import { QuickDashboard } from './BankQuickDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  query?: string; // 用于关联用户的问题
  visualization?: {
    type: 'chart' | 'table' | 'kpi';
    data: any;
  };
  insights?: string[];
}

const suggestedQuestions = [
  { icon: BarChart3, text: '全行本月经营业绩怎么样？', category: '经营管理' },
  { icon: Shield, text: '对公存款和零售存款的结构分析', category: '存款业务' },
  { icon: AlertCircle, text: '本月不良贷款率是多少？', category: '贷款业务' },
  { icon: FileText, text: '银行卡业务和理财产品销售情况', category: '中间业务' },
  { icon: FileText, text: '高净值客户画像分析', category: '客户画像' },
  { icon: Shield, text: '授信额度使用情况和逾期客户预警', category: '贷款业务' },
];

interface ChatInterfaceProps {
  onNavigate?: (view: 'dashboard' | 'deposit' | 'loan' | 'intermediate' | 'customer' | 'knowledge') => void;
  onPin?: (query: string, response: string, category: string) => void;
}

export function ChatInterface({ onNavigate, onPin }: ChatInterfaceProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: '👋 您好！我是您的银行智能AI助手，已连接以下核心数据系统：\n\n🔗 **已接入数据源**\n• 📊 核心银行系统 - 账户管理、交易流水\n• 💼 信贷管理系统 - 贷款审批、授信管理\n• 📁 客户关系管理 - 客户信息、风险评级\n• 💰 资产管理系统 - 资产负债、流动性管理\n• 📄 合规监管平台 - 监管报送、反洗钱监控\n\n✨ **我可以帮您**\n📊 智能查询 - 自然语言查询任何银行业务数据\n📈 风险分析 - 不良资产、信用风险智能预警\n📄 报告生成 - 合规报告、监管报表自动生成\n⚠️ 反洗钱 - 可疑交易识别和大额交易监控\n💡 决策支持 - 基于数据提供业务优化建议\n\n请随时向我提问，我会从相关系统中为您查询和分析！',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentQuery = input;
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: currentQuery,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentQuery);
      // 保存对应的问题
      aiResponse.query = currentQuery;
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handlePinMessage = (message: Message) => {
    if (onPin && message.query) {
      onPin(message.query, message.content, '首页问答');
      toast.success('已固定到我的面板', {
        description: '可在主页查看固定的内容',
      });
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const handleExport = () => {
    const exportData = messages.map(m => `[${m.timestamp.toLocaleString()}] ${m.type === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([exportData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('聊天记录已导出');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
        <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="text-slate-400 hover:text-white"
              title="导出聊天记录"
            >
              <Download className="w-4 h-4 mr-2" />
              导出记录
            </Button>
          </div>
          {messages.length === 1 && (
            <div className="mb-6 md:mb-8 space-y-4 md:space-y-6">
              {/* Quick Dashboard */}
              <Card className="p-4 md:p-5 bg-slate-800/30 border-slate-700/50">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <PanelTopOpen className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  <h3 className="text-white text-sm md:text-base">实时数据概览</h3>
                </div>
                <Tabs defaultValue="dashboard" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700/30">
                    <TabsTrigger value="dashboard" className="text-xs text-slate-300 data-[state=active]:bg-slate-600/50 data-[state=active]:text-white">经营</TabsTrigger>
                    <TabsTrigger value="deposit" className="text-xs text-slate-300 data-[state=active]:bg-slate-600/50 data-[state=active]:text-white">存款</TabsTrigger>
                    <TabsTrigger value="loan" className="text-xs text-slate-300 data-[state=active]:bg-slate-600/50 data-[state=active]:text-white">贷款</TabsTrigger>
                    <TabsTrigger value="intermediate" className="text-xs text-slate-300 data-[state=active]:bg-slate-600/50 data-[state=active]:text-white">中间</TabsTrigger>
                  </TabsList>
                  <div className="mt-3 md:mt-4 space-y-3">
                    <TabsContent value="dashboard" className="m-0">
                      <QuickDashboard type="dashboard" />
                      <Button 
                        variant="outline" 
                        className="w-full mt-3 bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white text-sm"
                        onClick={() => onNavigate?.('dashboard')}
                      >
                        查看详细分析 →
                      </Button>
                    </TabsContent>
                    <TabsContent value="deposit" className="m-0">
                      <QuickDashboard type="deposit" />
                      <Button 
                        variant="outline" 
                        className="w-full mt-3 bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white text-sm"
                        onClick={() => onNavigate?.('deposit')}
                      >
                        查看详细分析 →
                      </Button>
                    </TabsContent>
                    <TabsContent value="loan" className="m-0">
                      <QuickDashboard type="loan" />
                      <Button 
                        variant="outline" 
                        className="w-full mt-3 bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white text-sm"
                        onClick={() => onNavigate?.('loan')}
                      >
                        查看详细分析 →
                      </Button>
                    </TabsContent>
                    <TabsContent value="intermediate" className="m-0">
                      <QuickDashboard type="intermediate" />
                      <Button 
                        variant="outline" 
                        className="w-full mt-3 bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white text-sm"
                        onClick={() => onNavigate?.('intermediate')}
                      >
                        查看详细分析 →
                      </Button>
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>

              {/* Suggested Questions */}
              <div>
                <p className="text-slate-400 mb-3 md:mb-4 text-sm">💬 或者试试问我这些问题：</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {suggestedQuestions.map((question, index) => (
                    <Card
                      key={index}
                      className="p-3 md:p-4 bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-blue-500/50 cursor-pointer transition-all group"
                      onClick={() => handleSuggestedQuestion(question.text)}
                    >
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                          <question.icon className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 mb-1.5 md:mb-2">
                            {question.category}
                          </Badge>
                          <p className="text-xs md:text-sm text-slate-300 group-hover:text-white transition-colors break-words">{question.text}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'assistant' && (
                <div className="flex items-start gap-3 max-w-3xl">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="group relative">
                      <Card className="p-4 bg-slate-800/50 border-slate-700/50">
                        <p className="text-slate-200 whitespace-pre-line leading-relaxed">{message.content}</p>
                      </Card>
                      {onPin && message.query && message.id !== 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePinMessage(message)}
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-600"
                          title="固定到我的面板"
                        >
                          <Pin className="w-3 h-3 mr-1 text-white" />
                          <span className="text-xs text-white">固定</span>
                        </Button>
                      )}
                    </div>
                    
                    {message.visualization && (
                      <DataVisualization data={message.visualization} />
                    )}
                    
                    {message.insights && message.insights.length > 0 && (
                      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-blue-300 mb-2">💡 AI洞察</p>
                            <ul className="space-y-1">
                              {message.insights.map((insight, i) => (
                                <li key={i} className="text-sm text-slate-300">• {insight}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {message.type === 'user' && (
                <Card className="p-4 bg-blue-600 border-blue-500 max-w-2xl">
                  <p className="text-white">{message.content}</p>
                </Card>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <Card className="p-4 bg-slate-800/50 border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  <p className="text-slate-400">正在分析数据...</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="输入您的问题... (Shift + Enter 换行)"
                className="min-h-[60px] max-h-[200px] bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-500 resize-none"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="h-[60px] px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            AI助手基于Deepseek模型，可能会出错。请验证重要信息。
          </p>
        </div>
      </div>
    </div>
  );
}

function generateAIResponse(query: string): Message {
  const lowerQuery = query.toLowerCase();
  
  // 不良贷款/风险相关
  if (lowerQuery.includes('不良') || lowerQuery.includes('风险') || lowerQuery.includes('高风险')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '根据核心银行系统数据，我为您分析了本月的不良贷款情况：\n\n📈 **核心指标**\n• 本月不良贷款率：1.35%\n• 环比下降：0.08个百分点\n• 不良贷款余额：8.52亿元\n\n🎯 **主要分布**\n制造业贷款不良率3.2%，房地产行业2.8%，是重点关注领域。零售贷款不良率0.6%，表现优异。\n\n⚠️ **高风险客户**\n检测到15家企业客户风险评级下调，涉及授信余额2.3亿元，建议加强贷后管理。',
      timestamp: new Date(),
      visualization: {
        type: 'chart',
        data: {
          chartType: 'line',
          title: '不良贷款率趋势',
          series: [
            { month: '1月', profit: 1.65 },
            { month: '2月', profit: 1.52 },
            { month: '3月', profit: 1.43 },
            { month: '4月', profit: 1.35 },
          ]
        }
      },
      insights: [
        '不良贷款率持续改善，风险管控措施有效',
        '制造业和房地产行业需重点关注，建议加强贷前调查',
        '零售贷款质量优秀，可适当扩大该业务规模'
      ]
    };
  }
  
  // 授信/客户相关
  if (lowerQuery.includes('客户') || lowerQuery.includes('授信') || lowerQuery.includes('企业')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '已为您查询某企业客户的详细信息：\n\n🏢 **基本信息**\n• 客户编号：EN20230001\n• 信用评级：AA级\n• 合作时长：3年8个月\n• 所属行业：制造业\n\n💰 **授信额度**\n• 总授信额度：5000万元\n• 已用额度：3200万元（64%）\n• 可用额度：1800万元\n\n📊 **贷款记录**\n• 在贷笔数：3笔\n• 贷款余额：3200万元\n• 还款记录：正常，无逾期\n\n✅ **风险评估**\n该客户信用状况良好，财务指标健康，资产负债率52%，流动比率1.8，建议可以继续开展业务合作。',
      timestamp: new Date(),
      visualization: {
        type: 'kpi',
        data: {
          items: [
            { label: '信用评级', value: 'AA', status: 'excellent' },
            { label: '额度使用率', value: '64%', status: 'normal' },
            { label: '还款记录', value: '正常', status: 'excellent' },
          ]
        }
      },
      insights: [
        '该客户是我行重要对公客户，可适当提升授信额度',
        '近半年营收增长25%，经营状况良好',
        '建议拓展其上下游企业，形成产业链金融服务'
      ]
    };
  }
  
  // 资本充足率/监管指标
  if (lowerQuery.includes('资本') || lowerQuery.includes('充足率') || lowerQuery.includes('监管')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '我帮您查询了资本充足率及监管指标达标情况：\n\n✅ **核心监管指标**\n\n📊 **资本充足率**\n• 资本充足率：13.85%\n• 监管要求：≥10.5%\n• 达标情况：✅ 超出3.35个百分点\n\n💼 **流动性指标**\n• 流动性覆盖率（LCR）：125%\n• 监管要求：≥100%\n• 达标情况：✅ 达标\n\n📈 **资产质量**\n• 不良贷款率：1.35%\n• 拨备覆盖率：185%\n• 监管要求：≥150%\n• 达标情况：✅ 达标\n\n💡 **总体评估**\n所有监管指标均达标，且有较好的安全边际。资本实力充足，可支持业务稳健增长。',
      timestamp: new Date(),
      visualization: {
        type: 'table',
        data: {
          headers: ['监管指标', '实际值', '监管要求', '达标情况', '备注'],
          rows: [
            ['资本充足率', '13.85%', '≥10.5%', 'good', '超出3.35pp'],
            ['流动性覆盖率', '125%', '≥100%', 'good', '达标'],
            ['不良贷款率', '1.35%', '监控指标', 'good', '优秀'],
            ['拨备覆盖率', '185%', '≥150%', 'good', '超出35pp'],
          ]
        }
      },
      insights: [
        '资本充足率保持在较高水平，可支持业务扩张',
        '流动性管理良好，建议继续保持',
        '资产质量优秀，风险抵御能力强'
      ]
    };
  }
  
  // 可疑交易/反洗钱
  if (lowerQuery.includes('可疑') || lowerQuery.includes('洗钱') || lowerQuery.includes('大额')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '我已扫描了反洗钱监控系统，发现以下需要关注的交易：\n\n🔴 **可疑交易（2笔）**\n\n1️⃣ **个人客户 - 李某某**\n   • 交易金额：500万元\n   • 交易类型：大额现金存款\n   • 异常特征：与日常交易模式不符\n   • 建议：提交可疑交易报告\n\n2️⃣ **企业客户 - XX贸易公司**\n   • 交易金额：1200万元\n   • 交易类型：境外汇款\n   • 异常特征：与经营范围不符\n   • 建议：开展尽职调查\n\n🟡 **关注类交易（5笔）**\n• 大额现金交易：3笔\n• 频繁转账：2笔\n\n📋 **处理建议**\n1. 对可疑交易立即启动调查程序\n2. 必要时向反洗钱中心报送\n3. 加强客户身份识别和尽职调查',
      timestamp: new Date(),
      visualization: {
        type: 'table',
        data: {
          headers: ['客户名称', '交易金额', '交易类型', '风险等级', '处理状态'],
          rows: [
            ['李某某', '500万', '现金存款', 'warning', '待调查'],
            ['XX贸易公司', '1200万', '境外汇款', 'warning', '待调查'],
          ]
        }
      },
      insights: [
        '建议加强对大额现金交易的监控力度',
        '对境外汇款业务要严格审查贸易背景真实性',
        '已将预警信息推送给合规部门和相关客户经理'
      ]
    };
  }
  
  // 报告生成相关
  if (lowerQuery.includes('报告') || lowerQuery.includes('生成')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '我已经为您生成了本月合规监管报告初稿：\n\n📄 **合规监管月度报告（2026年2月）**\n\n**一、监管指标达标情况**\n本月所有监管指标均达标。资本充足率13.85%，流动性覆盖率125%，不良贷款率1.35%，拨备覆盖率185%，各项指标符合监管要求。\n\n**二、风险管控情况**\n1. 信用风险：不良贷款余额8.52亿元，环比下降2.3%\n2. 流动性风险：流动性指标充足，资金调度平稳\n3. 操作风险：本月无重大操作风险事件\n\n**三、合规事件**\n⚠️ 发现可疑交易2笔，已按规定启动调查程序\n✅ 反洗钱培训覆盖率100%\n\n**四、下月工作重点**\n✅ 继续加强信贷资产质量管理\n✅ 深化反洗钱系统建设\n✅ 完善内部控制制度\n\n报告已保存至系统，您可以继续补充或修改。',
      timestamp: new Date(),
      insights: [
        '建议每月定期生成合规报告，及时向监管部门报送',
        '可以将报告自动推送给分管领导和相关部门',
        '系统已学习您的报告风格，下次生成会更精准'
      ]
    };
  }

  // 逾期贷款相关
  if (lowerQuery.includes('逾期') || lowerQuery.includes('90天')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '我已查询到逾期超过90天的贷款客户情况：\n\n🔴 **严重逾期（≥90天）**\n\n1️⃣ **某建材公司**\n   • 贷款余额：800万元\n   • 逾期天数：95天\n   • 客户评级：B级（已下调）\n   • 建议：启动不良资产处置程序\n\n2️⃣ **某餐饮连锁企业**\n   • 贷款余额：320万元\n   • 逾期天数：102天\n   • 客户评级：C级\n   • 建议：加快抵押物处置\n\n📊 **统计数据**\n• 逾期90天以上总额：1.12亿元\n• 占贷款总额比例：1.35%\n• 涉及客户数：8家\n\n💡 **处理建议**\n已为您生成催收方案，并推送给资产保全部门。建议本周内完成风险评估，必要时启动法律诉讼程序。',
      timestamp: new Date(),
      visualization: {
        type: 'table',
        data: {
          headers: ['客户名称', '贷款余额', '逾期天数', '风险等级', '建议措施'],
          rows: [
            ['某建材公司', '800万', '95天', 'warning', '资产处置'],
            ['某餐饮企业', '320万', '102天', 'warning', '抵押处置'],
          ]
        }
      },
      insights: [
        '建议建立贷款预警机制，逾期30天即启动催收',
        '对高风险行业客户要加强贷后管理',
        '已将逾期信息同步至征信系统'
      ]
    };
  }

  // 默认响应
  return {
    id: Date.now(),
    type: 'assistant',
    content: `我理解您想了解"${query}"的相关信息。\n\n我可以帮您查询以下数据源：\n• 📊 核心银行系统（账户、交易流水）\n• 💼 信贷管理系统（贷款、授信信息）\n• 📁 客户关系管理（客户信息、风险评级）\n• 💰 资产管理系统（资产负债、流动性）\n• 📄 合规监管平台（监管报送、反洗钱）\n\n请您详细描述一下具体想了解什么信息，我会为您精准分析。或者您可以尝试：\n• "帮我查询某个客户的授信情况"\n• "分析某类贷款的风险状况"\n• "生成某类型的合规报告"\n• "检查可疑交易或反洗钱预警"`,
    timestamp: new Date(),
  };
}
