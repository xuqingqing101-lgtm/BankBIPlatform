import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Sparkles, BarChart3, FileText, AlertCircle, Shield, Loader2, PanelTopOpen, Pin } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { DataVisualization } from './DataVisualization';
import { QuickDashboard } from './QuickDashboard';
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
  { icon: Shield, text: '本月不良贷款率是多少？有哪些高风险客户？', category: '风险管理' },
  { icon: FileText, text: '帮我查看某企业客户的授信额度使用情况', category: '信贷查询' },
  { icon: BarChart3, text: '本月资本充足率是否达到监管要求？', category: '资本分析' },
  { icon: AlertCircle, text: '最近有哪些可疑的大额交易需要关注？', category: '反洗钱' },
  { icon: FileText, text: '帮我生成一份本月合规监管报告', category: '合规报告' },
  { icon: Shield, text: '逾期超过90天的贷款客户有哪些？', category: '风险预警' },
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
      content: '👋 您好！我是您的企业智能AI助手，已连接以下数据系统：\n\n🔗 **已接入数据源**\n• NC财务系统 - 实时财务数据、成本核算\n• 大宗贸易平台 - 客商信息、项目管理\n• OA办公系统 - 企业知识库、档案文件\n• 物流管理系统 - 运输调度、仓储数据\n• 合同管理系统 - 合同审核、风险分析\n\n✨ **我可以帮您**\n📊 智能问数 - 自然语言查询任何业务数据\n📈 数据分析 - 生成可视化图表和深度洞察\n📄 文档处理 - 生成报告、审核合同、检索档案\n⚠️ 风险预警 - 发现经营风险和异常情况\n💡 决策建议 - 基于数据给出优化建议\n\n请随时向我提问，我会从相关系统中为您查询和分析！',
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

    try {
      const response = await fetch('/api/ai/analyze-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentQuery })
      });

      const res = await response.json();

      if (res.code === 200) {
        const aiMessage: Message = {
          id: messages.length + 2,
          type: 'assistant',
          content: res.data.response,
          timestamp: new Date(),
          query: currentQuery,
          visualization: res.data.visualization,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        toast.error(res.message || '请求失败');
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'assistant',
          content: '抱歉，分析过程中遇到问题：' + (res.message || '未知错误'),
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('AI Request Error:', error);
      toast.error('网络连接失败');
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'assistant',
        content: '抱歉，网络连接失败，请检查您的网络设置。',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-900/50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth" ref={scrollRef}>
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.length === 1 && (
            <div className="mb-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Quick Dashboard */}
              <Card className="p-5 bg-slate-800/40 border-slate-700/50 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <PanelTopOpen className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white text-base font-medium">实时数据概览</h3>
                </div>
                <Tabs defaultValue="executive" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700/30 p-1 rounded-lg">
                    <TabsTrigger value="executive" className="text-xs text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all">风险</TabsTrigger>
                    <TabsTrigger value="finance" className="text-xs text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all">信贷</TabsTrigger>
                    <TabsTrigger value="trade" className="text-xs text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all">资产</TabsTrigger>
                    <TabsTrigger value="logistics" className="text-xs text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all">合规</TabsTrigger>
                  </TabsList>
                  <div className="mt-4 space-y-3">
                    <TabsContent value="executive" className="m-0 focus-visible:ring-0">
                      <QuickDashboard type="executive" />
                      <Button 
                        variant="ghost" 
                        className="w-full mt-3 bg-slate-700/20 border border-slate-600/50 text-slate-300 hover:bg-blue-600/20 hover:text-blue-200 hover:border-blue-500/50 text-sm transition-all"
                        onClick={() => onNavigate?.('dashboard')}
                      >
                        查看详细分析 →
                      </Button>
                    </TabsContent>
                    <TabsContent value="finance" className="m-0 focus-visible:ring-0">
                      <QuickDashboard type="finance" />
                      <Button 
                        variant="ghost" 
                        className="w-full mt-3 bg-slate-700/20 border border-slate-600/50 text-slate-300 hover:bg-blue-600/20 hover:text-blue-200 hover:border-blue-500/50 text-sm transition-all"
                        onClick={() => onNavigate?.('deposit')}
                      >
                        查看详细分析 →
                      </Button>
                    </TabsContent>
                    <TabsContent value="trade" className="m-0 focus-visible:ring-0">
                      <QuickDashboard type="trade" />
                      <Button 
                        variant="ghost" 
                        className="w-full mt-3 bg-slate-700/20 border border-slate-600/50 text-slate-300 hover:bg-blue-600/20 hover:text-blue-200 hover:border-blue-500/50 text-sm transition-all"
                        onClick={() => onNavigate?.('intermediate')}
                      >
                        查看详细分析 →
                      </Button>
                    </TabsContent>
                    <TabsContent value="logistics" className="m-0 focus-visible:ring-0">
                      <QuickDashboard type="logistics" />
                      <Button 
                        variant="ghost" 
                        className="w-full mt-3 bg-slate-700/20 border border-slate-600/50 text-slate-300 hover:bg-blue-600/20 hover:text-blue-200 hover:border-blue-500/50 text-sm transition-all"
                        onClick={() => onNavigate?.('dashboard')}
                      >
                        查看详细分析 →
                      </Button>
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>

              {/* Suggested Questions */}
              <div>
                <p className="text-slate-400 mb-4 text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  智能推荐提问
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedQuestions.map((question, index) => (
                    <Card
                      key={index}
                      className="p-4 bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/60 hover:border-blue-500/30 cursor-pointer transition-all group backdrop-blur-sm shadow-sm hover:shadow-md"
                      onClick={() => handleSuggestedQuestion(question.text)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors border border-blue-500/10 group-hover:border-blue-500/20">
                          <question.icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="text-xs border-slate-600/50 text-slate-400 mb-2 bg-slate-800/50">
                            {question.category}
                          </Badge>
                          <p className="text-sm text-slate-300 group-hover:text-white transition-colors break-words leading-relaxed">{question.text}</p>
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
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              {message.type === 'assistant' && (
                <div className="flex items-start gap-4 max-w-4xl w-full">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/20 ring-1 ring-white/10">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="group relative">
                      <Card className="p-5 bg-slate-800/80 border-slate-700/50 shadow-xl backdrop-blur-md rounded-2xl rounded-tl-none">
                        <div className="prose prose-invert max-w-none">
                           <p className="text-slate-200 whitespace-pre-line leading-7 text-base">{message.content}</p>
                        </div>
                      </Card>
                      {onPin && message.query && message.id !== 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePinMessage(message)}
                          className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 px-3 bg-slate-800 hover:bg-blue-600 border border-slate-600 hover:border-blue-500 shadow-lg rounded-full"
                          title="固定到我的面板"
                        >
                          <Pin className="w-3.5 h-3.5 mr-1.5 text-slate-300 group-hover:text-white" />
                          <span className="text-xs text-slate-300 group-hover:text-white">固定</span>
                        </Button>
                      )}
                    </div>
                    
                    {message.visualization && (
                      <div className="animate-in fade-in zoom-in-95 duration-500 delay-150">
                        <DataVisualization data={message.visualization} />
                      </div>
                    )}
                    
                    {message.insights && message.insights.length > 0 && (
                      <Card className="p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-500/20 shadow-lg animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                             <Sparkles className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-300 mb-2">AI 智能洞察</p>
                            <ul className="space-y-2">
                              {message.insights.map((insight, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                                  <span className="leading-relaxed">{insight}</span>
                                </li>
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
                <div className="flex items-end gap-3 max-w-2xl">
                   <Card className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/50 shadow-lg shadow-blue-900/20 rounded-2xl rounded-tr-none text-white">
                    <p className="leading-relaxed">{message.content}</p>
                  </Card>
                   <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-slate-400" />
                   </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg opacity-80">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <Card className="p-5 bg-slate-800/50 border-slate-700/50 rounded-2xl rounded-tl-none flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <span className="text-slate-400 text-sm font-medium">AI 正在深入分析数据...</span>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-md p-5 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.3)] z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
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
                className="relative min-h-[60px] max-h-[200px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none rounded-xl focus:ring-0 focus:border-slate-600 shadow-inner"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="h-[60px] px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center flex items-center justify-center gap-1">
             <Shield className="w-3 h-3" />
            AI助手基于Deepseek模型，仅供内部数据分析使用，请注意数据安全。
          </p>
        </div>
      </div>
    </div>
  );
}

function generateAIResponse(query: string): Message {
  const lowerQuery = query.toLowerCase();
  
  // 利润相关
  if (lowerQuery.includes('利润') || lowerQuery.includes('盈利')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '根据NC财务系统数据，我为您分析了本季度的利润情况：\n\n📈 **核心数据**\n• 本季度净利润：218万元\n• 环比增长：23.5%\n• 利润率：15.8%\n\n🎯 **主要贡献**\n华东玉米贸易项目表现突出，单项目利润率达到18.5%，贡献了总利润的35%。\n\n⚠️ **需要关注**\n西南大豆运输项目利润率仅9.8%，低于目标2.2个百分点，建议优化成本结构。',
      timestamp: new Date(),
      visualization: {
        type: 'chart',
        data: {
          chartType: 'line',
          title: '季度利润趋势',
          series: [
            { month: 'Q1', profit: 165 },
            { month: 'Q2', profit: 188 },
            { month: 'Q3', profit: 195 },
            { month: 'Q4', profit: 218 },
          ]
        }
      },
      insights: [
        '利润增长主要来自粮食贸易板块，建议继续加大该板块投入',
        '物流成本占比较高，可考虑优化运输���线降低成本',
        '应收账款周转天数缩短8天，现金流状况改善明显'
      ]
    };
  }
  
  // 客商相关
  if (lowerQuery.includes('客') || lowerQuery.includes('信用') || lowerQuery.includes('华东')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '已为您查询华东粮油集团的详细信息：\n\n🏢 **基本信息**\n• 客户编号：C001\n• 信用评级：AAA级\n• 合作时长：5年3个月\n\n💰 **信用额度**\n• 总额度：500万元\n• 已使用：320万元（64%）\n• 可用额度：180万元\n\n📊 **交易记录**\n• 累计交易：45笔\n• 交易总额：2850万元\n• 准时履约率：98%\n\n✅ **风险评估**\n该客户信用状况优秀，无逾期记录，建议可以继续深化合作。',
      timestamp: new Date(),
      visualization: {
        type: 'kpi',
        data: {
          items: [
            { label: '信用评级', value: 'AAA', status: 'excellent' },
            { label: '额度使用率', value: '64%', status: 'normal' },
            { label: '履约率', value: '98%', status: 'excellent' },
          ]
        }
      },
      insights: [
        '该客户是公司重要战略合作伙伴，可适当提升信用额度',
        '近三个月交易频次提升40%，业务关系不断加深',
        '建议安排高层拜访，探讨更深层次的合作机会'
      ]
    };
  }
  
  // 物流成本相关
  if (lowerQuery.includes('物流') || lowerQuery.includes('成本') || lowerQuery.includes('超预算')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '我帮您查询了物流板块的成本情况：\n\n⚠️ **超预算项目**\n检测到以下2个项目成本超预算：\n\n1️⃣ **华北小麦采购项目**\n   • 预算成本：295万\n   • 实际成本：319万\n   • 超支：8.1%\n   • 主要原因：运输成本上涨\n\n2️⃣ **西南物流专线**\n   • 预算成本：128万\n   • 实际成本：136万\n   • 超支：6.3%\n   • 主要原因：油价上涨\n\n💡 **优化建议**\n建议与主要运输供应商重新谈判运费，或考虑采用多式联运降低成本。',
      timestamp: new Date(),
      visualization: {
        type: 'table',
        data: {
          headers: ['项目名称', '预算', '实际', '偏差', '状态'],
          rows: [
            ['华北小麦采购', '295万', '319万', '+8.1%', 'warning'],
            ['西南物流专线', '128万', '136万', '+6.3%', 'warning'],
            ['华东运输', '218万', '208万', '-4.6%', 'good'],
            ['华中配送', '72万', '69万', '-4.2%', 'good'],
          ]
        }
      },
      insights: [
        '建议锁定长期运输价格，避免市场波动影响',
        '可以考虑自建部分运输能力，降低对外部供应商的依赖',
        '华东运输项目成本控制良好，可总结经验推广'
      ]
    };
  }
  
  // 合同风险相关
  if (lowerQuery.includes('合同') || lowerQuery.includes('风险')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '我已扫描了合同管理系统，发现以下风险点：\n\n🔴 **高风险（2项）**\n• 合同编号 HT-2024-089：违约责任条款不明确\n• 合同编号 HT-2024-102：未约定质量验收标准\n\n🟡 **中风险（3项）**\n• 合同编号 HT-2024-095：付款周期超标准（75天）\n• 合同编号 HT-2024-098：缺少不可抗力条款\n• 合同编号 HT-2024-105：价格调整机制不清晰\n\n📋 **建议处理**\n1. 高风险合同建议法务部门立即介入修订\n2. 中风险合同可在下次签约时优化条款\n3. 已为您生成《合同风险分析报告》',
      timestamp: new Date(),
      insights: [
        '建议建立合同条款标准化模板，从源头降低风险',
        '对重要供应商和客户的合同，建议每年至少审核一次',
        '可以引入电子签章和区块链技术，提升合同管理效率'
      ]
    };
  }
  
  // 报告生成相关
  if (lowerQuery.includes('报告') || lowerQuery.includes('生成')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '我已经为您生成了本月经营分析报告初稿：\n\n📄 **经营分析报告（2024年10月）**\n\n**一、整体经营情况**\n本月实现营收780万元，同比增长14.7%，环比增长8.5%。净利润218万元，利润率达到27.9%，经营状况良好。\n\n**二、业务板块分析**\n1. 粮食贸易：营收450万（占比57.7%），利润率18.5%\n2. 物流运输：营收280万（占比35.9%），利润率23.5%\n3. 仓储服务：营收50万（占比6.4%），利润率32.1%\n\n**三、重点关注事项**\n⚠️ 西南物流项目成本超预算6.3%，需加强成本控制\n⚠️ 应收账款逾期150万，建议加强催收\n\n**四、下月工作建议**\n✅ 继续深化与重点客户的合作关系\n✅ 优化运输路线，降低物流成本\n✅ 加强应收账款管理，改善现金流\n\n报告已保存至系统，您可以继续补充或修改。',
      timestamp: new Date(),
      insights: [
        '建议每月定期生成经营分析报告，及时发现问题',
        '可以将报告自动发送给相关领导和部门负责人',
        '系统已学习您的报告风格，下次生成会更贴合需求'
      ]
    };
  }

  // 应收账款相关
  if (lowerQuery.includes('应收') || lowerQuery.includes('逾期') || lowerQuery.includes('60天')) {
    return {
      id: Date.now(),
      type: 'assistant',
      content: '我已查询到逾期超过60天的应收账款情况：\n\n🔴 **严重逾期（≥60天）**\n\n1️⃣ **西部农产品公司**\n   • 逾期金额：150万元\n   • 逾期天数：62天\n   • 客户评级：A级\n   • 建议：立即启动法律催收程序\n\n2️⃣ **南方粮食贸易**\n   • 逾期金额：68万元\n   • 逾期天数：75天\n   • 客户评级：AA级\n   • 建议：高层介入协商还款计划\n\n📊 **统计数据**\n• 逾期60天以上总额：218万元\n• 占应收账款比例：18.3%\n• 涉及客户数：2家\n\n💡 **处理建议**\n已为您生成催收函模板，并推送给相关业务人员。建议本周内完成第一轮催收，必要时可考虑法律途径。',
      timestamp: new Date(),
      visualization: {
        type: 'table',
        data: {
          headers: ['客户名称', '逾期金额', '逾期天数', '风险等级', '建议措施'],
          rows: [
            ['西部农产品', '150万', '62天', 'warning', '法律催收'],
            ['南方粮食贸易', '68万', '75天', 'warning', '高层协商'],
          ]
        }
      },
      insights: [
        '建议建立应收账款预警机制，逾期30天即启动催收',
        '对高风险客户可考虑缩短账期或要求预付款',
        '已将逾期信息同步至客户信用系统，影响后续合作'
      ]
    };
  }

  // 默认响应
  return {
    id: Date.now(),
    type: 'assistant',
    content: `我理解您想了解"${query}"的相关信息。\n\n我可以帮您查询以下数据源：\n• 📊 NC财务系统（财务报表、成本数据）\n• 💼 大宗贸易平台（项目、客商信息）\n• 📁 OA系统（档案、制度文件）\n• 🚚 物流管理系统（运输、仓储数据）\n• 📄 合同管理系统（合同审核、风险分析）\n\n请您详细描述一下具体想了解什么信息，我会为您精准分析。或者您可以尝试：\n• "帮我查询某个客户的情况"\n• "分析某个项目的盈利状况"\n• "生成某类型的报告或文档"\n• "检查合同或档案中的问题"`,
    timestamp: new Date(),
  };
}