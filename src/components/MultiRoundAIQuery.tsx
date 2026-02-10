import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Sparkles, Loader2, X, Pin, MessageSquare, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { sendChatMessage, askKnowledge, analyzeData } from '../lib/api';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  query?: string; // 用于关联用户的问题
  sources?: any[]; // 引用来源
}

interface MultiRoundAIQueryProps {
  title: string;
  description?: string;
  placeholder?: string;
  exampleQueries: string[];
  onQuery?: (query: string, history: Message[]) => string | Promise<string>;
  category?: string;
  onPin?: (query: string, response: string, category: string) => void;
  responseGenerator?: (query: string, history: Message[]) => string | Promise<string>;
  backendModule?: string;
  useKnowledgeApi?: boolean;
  useDataAnalysisApi?: boolean;
}

export function MultiRoundAIQuery({ 
  title,
  description, 
  placeholder = '请输入您的问题...',
  exampleQueries,
  onQuery,
  responseGenerator,
  category = '通用',
  onPin,
  backendModule,
  useKnowledgeApi,
  useDataAnalysisApi
}: MultiRoundAIQueryProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 滚动到底部 - 只在对话框内部滚动，不影响页面
    if (scrollContainerRef.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);

  const defaultResponseGenerator = (query: string, history: Message[]): string => {
    const responses: Record<string, string> = {
      '净利润': '根据财务系统数据，本季度净利润为138亿元，同比增长12.3%。主要增长来源于利息净收入增加和中间业务收入提升。',
      '存款': '当前存款余额4.58万亿元，本月新增850亿元，环比增长1.9%。对公存款占比61%，零售存款占比39%，结构合理。',
      '贷款': '当前贷款余额3.82万亿元，本月新增680亿元，环比增长1.8%。对公贷款占比66%，零售贷款占比34%，不良率1.35%。',
      '不良率': '全行不良贷款率1.35%，拨备覆盖率188.5%，资产质量保持稳定。制造业和房地产行业需重点关注。',
      '客户': '客户总数1878万户，本月新增15.8万户。对公客户28.2万户，零售客户1849.8万户，手机银行用户892万户。',
      '中间业务': '本月中间业务收入15.8亿元，环比增长8.5%。结算清算业务占35%，银行卡业务占28%，代理业务占22%。',
      '资本充足率': '资本充足率13.68%，一级资本充足率11.25%，核心一级资本充足率10.18%，各项指标均符合监管要求。',
      '手机银行': '手机银行用户892万户，月活跃用户420万户，月活率47.1%。本月交易笔数3250万笔，渠道替代率82%。',
      '风险': '本月风险预警127笔，其中高风险15笔，中风险38笔。主要集中在信贷风险和反洗钱预警，已生成处置工作单。',
      '知识库': '已在全行知识库中检索到相关制度。《信贷业务管理办法》规定：客户申请→贷前调查→授信审批→合同签订→贷款发放→贷后管理。',
    };

    for (const [key, value] of Object.entries(responses)) {
      if (query.includes(key)) {
        return value;
      }
    }

    // 根据对话历史生成更智能的回复
    if (history.length > 0) {
      const lastUserMessage = history.filter(m => m.type === 'user').pop();
      if (lastUserMessage) {
        return `关于"${query}"，我已经根据之前的对话上下文为您分析。基于您之前询问的"${lastUserMessage.content}"，我建议您关注相关联的数据指标。如需更详细的信息，请告诉我具体想了解的维度。`;
      }
    }

    return `基于您的查询"${query}"，我已经分析了相关数据。根据NC财务系统和业务数据显示，相关指标表现良好。如需更详细的分析，请提供更具体的查询维度。`;
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    const currentQuery = query;
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: currentQuery,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      let responseText = '';
      let sources: any[] | undefined;
      const historyWithCurrentMessage = [...messages, userMessage];

      if (useKnowledgeApi) {
        const res = await askKnowledge(currentQuery);
        if (res.success && res.data) {
          responseText = res.data.answer;
          sources = res.data.sources;
        } else {
          throw new Error(res.message || 'Knowledge request failed');
        }
      } else if (useDataAnalysisApi) {
        const res = await analyzeData(currentQuery);
        if (res.success && res.data) {
          responseText = res.data.response;
          // 可以在这里处理 res.data.sql 和 res.data.data
        } else {
          throw new Error(res.message || 'Data analysis request failed');
        }
      } else if (backendModule) {
        const res = await sendChatMessage(currentQuery, backendModule, conversationId);
        if (res.success && res.data) {
          responseText = res.data.response;
          if (res.data.conversationId) {
            setConversationId(res.data.conversationId);
          }
        } else {
          throw new Error(res.message || 'AI request failed');
        }
      } else if (onQuery) {
        // onQuery signature is (query, history) => string | Promise<string>
        const result = onQuery(currentQuery, historyWithCurrentMessage);
        responseText = result instanceof Promise ? await result : result;
      } else if (responseGenerator) {
        const result = responseGenerator(currentQuery, historyWithCurrentMessage);
        responseText = result instanceof Promise ? await result : result;
      } else {
        responseText = defaultResponseGenerator(currentQuery, historyWithCurrentMessage);
      }
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: responseText,
        timestamp: new Date(),
        query: currentQuery, // 保存对应的问题
        sources,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI response error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "抱歉，AI服务暂时不可用，请稍后再试。",
        timestamp: new Date(),
        query: currentQuery,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinMessage = (message: Message) => {
    if (onPin && message.query) {
      onPin(message.query, message.content, category);
      toast.success('已固定到我的面板', {
        description: '可在主页查看固定的内容',
      });
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const handleClear = () => {
    setMessages([]);
  };

  const conversationRound = Math.floor(messages.length / 2);

  return (
    <Card className="bg-slate-800/50 border-slate-700 flex flex-col h-[600px]">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
            <div className="min-w-0">
              <CardTitle className="text-slate-100 text-sm md:text-base">{title}</CardTitle>
              {description && (
                <p className="text-xs text-slate-400 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {conversationRound}轮对话
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-slate-400 hover:text-white hover:bg-slate-700 h-7 md:h-8"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="text-xs">清空</span>
                </Button>
              </>
            )}
          </div>
        </div>
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {exampleQueries.map((example, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-blue-500/20 hover:border-blue-500/50 transition-colors text-slate-300 border-slate-600 text-xs"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col min-h-0 pt-0 space-y-3">
        {/* Messages History */}
        {messages.length > 0 && (
          <div 
            ref={scrollContainerRef} 
            className="flex-1 overflow-y-auto pr-2 md:pr-4"
            style={{
              scrollBehavior: 'smooth'
            }}
          >
            <div className="space-y-4 md:space-y-5">
              {messages.map((message, index) => {
                const roundNumber = Math.floor(index / 2) + 1;
                const isFirstInRound = index % 2 === 0;
                
                return (
                  <div key={message.id}>
                    {/* 轮次分隔线 */}
                    {isFirstInRound && index > 0 && (
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-slate-700/50"></div>
                        <span className="text-xs text-slate-500">第 {roundNumber} 轮</span>
                        <div className="flex-1 h-px bg-slate-700/50"></div>
                      </div>
                    )}
                    
                    <div
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'assistant' && (
                        <div className="flex items-start gap-2 md:gap-3 max-w-[90%]">
                          <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="group relative">
                              <div className="p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                                {/* 问题标题 */}
                                {message.query && (
                                  <div className="mb-3 pb-2.5 border-b border-slate-700/50">
                                    <div className="flex items-start gap-2">
                                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-400 mb-1">您的提问：</p>
                                        <p className="text-xs md:text-sm text-blue-300 font-medium break-words">{message.query}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {/* AI回复内容 */}
                                <div className="max-h-[400px] overflow-y-auto pr-2">
                                  <p className="text-slate-200 text-xs md:text-sm leading-relaxed whitespace-pre-line break-words">
                                    {message.content}
                                  </p>
                                  {/* 引用来源 */}
                                  {message.sources && message.sources.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                                      <p className="text-xs text-slate-400 mb-2">参考文档：</p>
                                      <div className="space-y-1">
                                        {message.sources.map((source, i) => (
                                          <div key={i} className="flex items-center gap-2 p-1.5 bg-slate-800/50 rounded hover:bg-slate-800 transition-colors cursor-pointer">
                                            <FileText className="w-3 h-3 text-blue-400" />
                                            <p className="text-xs text-blue-300 line-clamp-1" title={source.snippet}>{source.title}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {onPin && message.query && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePinMessage(message)}
                                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 md:h-7 px-1.5 md:px-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 shadow-lg"
                                  title="固定到我的面板"
                                >
                                  <Pin className="w-3 h-3 mr-0.5 md:mr-1 text-white" />
                                  <span className="text-xs text-white">固定</span>
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1.5 ml-1">
                              {message.timestamp.toLocaleTimeString('zh-CN', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {message.type === 'user' && (
                        <div className="max-w-[80%]">
                          <div className="p-2.5 md:p-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-lg">
                            <p className="text-white text-xs md:text-sm break-words leading-relaxed">{message.content}</p>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 text-right mr-1">
                            {message.timestamp.toLocaleTimeString('zh-CN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <div className="p-2.5 md:p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 md:w-4 md:h-4 text-blue-400 animate-spin" />
                      <p className="text-slate-400 text-xs md:text-sm">正在分析...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex-shrink-0 space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={placeholder}
              className="flex-1 min-h-[80px] max-h-[120px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 text-xs md:text-sm resize-none"
            />
            <Button
              onClick={handleSubmit}
              disabled={!query.trim() || isLoading}
              className="h-[80px] px-3 md:px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            Shift + Enter 换行 · Enter 发送{messages.length > 0 && ` · 已对话${conversationRound}轮`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
