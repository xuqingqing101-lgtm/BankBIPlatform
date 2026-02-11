import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp,
  Brain,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Insight {
  type: 'trend' | 'risk' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  impact?: 'high' | 'medium' | 'low';
  priority?: number;
}

interface AIInsightsProps {
  insights: Insight[];
  title?: string;
  description?: string;
}

const insightConfig = {
  trend: {
    icon: TrendingUp,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badge: '趋势分析',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  risk: {
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    badge: '风险提示',
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  },
  opportunity: {
    icon: Target,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    badge: '机会发现',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30'
  },
  recommendation: {
    icon: Lightbulb,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    badge: '优化建议',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }
};

const impactConfig = {
  high: { label: '高影响', color: 'text-red-400', bg: 'bg-red-500/20' },
  medium: { label: '中影响', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  low: { label: '低影响', color: 'text-blue-400', bg: 'bg-blue-500/20' }
};

export function AIInsights({ insights, title = 'AI智能洞察', description }: AIInsightsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredInsights = selectedType === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === selectedType);

  const insightCounts = {
    trend: insights.filter(i => i.type === 'trend').length,
    risk: insights.filter(i => i.type === 'risk').length,
    opportunity: insights.filter(i => i.type === 'opportunity').length,
    recommendation: insights.filter(i => i.type === 'recommendation').length
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-slate-100">{title}</CardTitle>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI驱动
                </Badge>
              </div>
              {description && (
                <p className="text-sm text-slate-400">{description}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {/* Filter Buttons */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedType('all')}
                  className={`${
                    selectedType === 'all'
                      ? 'bg-slate-700/50 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                  }`}
                >
                  <Zap className="w-4 h-4 mr-1.5" />
                  全部 ({insights.length})
                </Button>
                {Object.entries(insightConfig).map(([type, config]) => {
                  const Icon = config.icon;
                  const count = insightCounts[type as keyof typeof insightCounts];
                  if (count === 0) return null;
                  return (
                    <Button
                      key={type}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className={`${
                        selectedType === type
                          ? `${config.bgColor} ${config.color}`
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      {config.badge} ({count})
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-3">
              {filteredInsights.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暂无此类洞察</p>
                </div>
              ) : (
                filteredInsights.map((insight, index) => {
                  const config = insightConfig[insight.type];
                  const Icon = config.icon;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} hover:border-slate-600/50 transition-all`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge className={config.badgeColor}>
                              {config.badge}
                            </Badge>
                            {insight.impact && (
                              <Badge variant="outline" className={`${impactConfig[insight.impact].bg} ${impactConfig[insight.impact].color} border-slate-600`}>
                                {impactConfig[insight.impact].label}
                              </Badge>
                            )}
                            {insight.priority && (
                              <span className="text-xs text-slate-500">
                                优先级: {insight.priority}
                              </span>
                            )}
                          </div>
                          <h4 className={`text-slate-100 mb-1.5`}>
                            {insight.title}
                          </h4>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
