import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface AIQueryBoxProps {
  title: string;
  placeholder: string;
  exampleQueries: string[];
}

export function AIQueryBox({ title, placeholder, exampleQueries }: AIQueryBoxProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    // 模拟AI响应
    setTimeout(() => {
      const responses = {
        '本月利润': '根据财务系统数据，本月利润为218万元，较上月增长23.5%。主要增长来源于粮食贸易板块，华东玉米贸易项目表现突出，利润率达到18.5%。',
        '成本构成': '粮食贸易板块的成本主要包括：采购成本（占72%）、运输物流成本（占15%）、仓储成本（占8%）、人工及其他费用（占5%）。',
        '盈利项目': '前三大盈利项目为：1）华中仓储服务，利润率22.3%；2）华东玉米贸易，利润率18.5%；3）华北小麦采购，利润率15.2%。',
        '现金流': '今年上半年经营性现金流净额为680万元，同比增长15.3%。主要得益于应收账款回款加速和库存周转率提升。',
        default: `基于您的查询"${query}"，我已经分析了相关数据。根据NC财务系统和业务数据显示，相关指标表现良好，具体数据已在上方图表中展示。如需更详细的分析，请提供更具体的查询维度。`
      };

      let responseText = responses.default;
      for (const [key, value] of Object.entries(responses)) {
        if (query.includes(key)) {
          responseText = value;
          break;
        }
      }

      setResponse(responseText);
      setIsLoading(false);
    }, 1500);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <Card className="bg-white border-blue-100">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-slate-900">{title}</CardTitle>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {exampleQueries.map((example, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={() => handleExampleClick(example)}
            >
              {example}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Textarea 
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !query.trim()}
            className="px-6"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {response && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-slate-700 leading-relaxed">{response}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
