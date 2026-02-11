import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  MessageSquare, 
  Plus, 
  History, 
  Building2, 
  FileText, 
  Package, 
  Truck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  LayoutDashboard,
  Landmark,
  HandCoins,
  CreditCard,
  Users,
  FolderOpen,
  Database
} from 'lucide-react';
import { Card } from './ui/card';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  onNavigate?: (view: 'dashboard' | 'deposit' | 'loan' | 'intermediate' | 'customer' | 'knowledge') => void;
  onNewChat?: () => void;
}

const recentChats = [
  { id: 1, title: '本月全行营收情况分析', time: '10分钟前', category: '经营' },
  { id: 2, title: '对公存款结构查询', time: '1小时前', category: '存款' },
  { id: 3, title: '不良贷款率走势分析', time: '今天', category: '贷款' },
  { id: 4, title: '理财产品销售情况', time: '昨天', category: '中间业务' },
  { id: 5, title: '高净值客户画像分析', time: '2天前', category: '客户' },
];

const quickActions = [
  { icon: LayoutDashboard, label: '经营管理', description: '行长视角', color: 'text-blue-400', bg: 'bg-blue-500/10', view: 'dashboard' as const },
  { icon: Landmark, label: '存款业务', description: '对公零售', color: 'text-green-400', bg: 'bg-green-500/10', view: 'deposit' as const },
  { icon: HandCoins, label: '贷款业务', description: '信贷风控', color: 'text-purple-400', bg: 'bg-purple-500/10', view: 'loan' as const },
  { icon: CreditCard, label: '中间业务', description: '汇款理财', color: 'text-orange-400', bg: 'bg-orange-500/10', view: 'intermediate' as const },
  { icon: Users, label: '客户画像', description: '精准营销', color: 'text-pink-400', bg: 'bg-pink-500/10', view: 'customer' as const },
  { icon: FolderOpen, label: '知识库', description: '文档管理', color: 'text-cyan-400', bg: 'bg-cyan-500/10', view: 'knowledge' as const },
  { icon: Database, label: '数据管理', description: '导入清洗', color: 'text-blue-400', bg: 'bg-blue-500/10', view: 'data-manager' as const },
];

export function Sidebar({ open, onToggle, onNavigate, onNewChat }: SidebarProps) {
  // 在三栏布局中，我们总是显示完整的侧边栏
  return (
    <div className="h-full bg-slate-800/30 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-700/50 flex-shrink-0">
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          onClick={onNewChat}
        >
          <Plus className="w-4 h-4 mr-2" />
          新建对话
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-slate-700/50 flex-shrink-0">
        <p className="text-xs text-slate-400 mb-3">快捷功能</p>
        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="p-3 bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50 cursor-pointer transition-colors group"
              onClick={() => onNavigate?.(action.view)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${action.bg} flex items-center justify-center flex-shrink-0`}>
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 group-hover:text-white font-medium">{action.label}</p>
                  <p className="text-xs text-slate-500 group-hover:text-slate-400">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <p className="text-xs text-slate-400 mb-3">最近对话</p>
          {recentChats.map((chat) => (
            <button
              key={chat.id}
              className="w-full p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 transition-all text-left group"
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 group-hover:text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 group-hover:text-white line-clamp-1" title={chat.title}>{chat.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {chat.category}
                    </Badge>
                    <span className="text-xs text-slate-500">{chat.time}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 space-y-3 flex-shrink-0">
        <Card className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-200 mb-1">💡 使用提示</p>
              <p className="text-xs text-slate-400">直接询问银行业务问题，我会从核心系统为您查询分析。</p>
            </div>
          </div>
        </Card>
        
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Powered by Deepseek</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span>在线</span>
          </div>
        </div>
      </div>
    </div>
  );
}