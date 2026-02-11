import { useState, useEffect } from 'react';
import { Sidebar } from './components/AssistantSidebar';
import { ChatInterface } from './components/BankChatInterface';
import { DrillDownPage, DrillDownConfig } from './components/DrillDownPage';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { FinanceQA } from './components/FinanceQA';
import { TradeAnalysis } from './components/TradeAnalysis';
import { LogisticsAnalysis } from './components/LogisticsAnalysis';
import { IntermediateBusinessAnalysis } from './components/IntermediateBusinessAnalysis';
import { DataManager } from './components/DataManager';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ModuleLayout } from './components/ModuleLayout';
import { PinnedDashboard, PinnedItem } from './components/PinnedDashboard';
import { ThreeColumnLayout } from './components/ThreeColumnLayout';
import { BackendStatus } from './components/backend-status';
import { BackendErrorBanner } from './components/backend-error-banner';
import { Sparkles, Menu, LayoutDashboard, Landmark, HandCoins, CreditCard, Users, FolderOpen, Pin, Database } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import { checkHealth } from './lib/api';

type ViewType = 'chat' | 'dashboard' | 'deposit' | 'loan' | 'intermediate' | 'customer' | 'knowledge' | 'pinned' | 'drilldown' | 'data-manager';

// 根据类别和查询创建实时数据生成器
function createDataGenerator(category: string, query: string) {
  return () => {
    const now = new Date();
    const baseData: Record<string, any> = {
      '更新时间': now.toLocaleTimeString('zh-CN'),
    };

    // 经营管理
    if (category === '经营管理' || query.includes('经营') || query.includes('利润') || query.includes('营收')) {
      return {
        ...baseData,
        '本月营收': `¥${(125 + Math.random() * 20).toFixed(1)}亿`,
        '净利润': `¥${(38 + Math.random() * 8).toFixed(1)}亿`,
        '资产总额': `¥${(5200 + Math.random() * 300).toFixed(0)}亿`,
        '资产收益率': `${(0.8 + Math.random() * 0.3).toFixed(2)}%`,
      };
    }

    // 存款业务
    if (category === '存款业务' || query.includes('存款')) {
      return {
        ...baseData,
        '存款余额': `¥${(520 + Math.random() * 50).toFixed(0)}亿`,
        '对公存款': `¥${(312 + Math.random() * 30).toFixed(0)}亿`,
        '零售存款': `¥${(208 + Math.random() * 20).toFixed(0)}亿`,
        '存款增长率': `${(8 + Math.random() * 3).toFixed(1)}%`,
      };
    }

    // 贷款业务
    if (category === '贷款业务' || query.includes('贷款') || query.includes('授信') || query.includes('风险') || query.includes('不良')) {
      return {
        ...baseData,
        '贷款余额': `¥${(380 + Math.random() * 40).toFixed(0)}亿`,
        '不良贷款率': `${(1.2 + Math.random() * 0.3).toFixed(2)}%`,
        '拨备覆盖率': `${(180 + Math.random() * 20).toFixed(1)}%`,
        '高风险客户': `${Math.floor(12 + Math.random() * 6)}户`,
      };
    }

    // 中间业务
    if (category === '中间业务' || query.includes('汇款') || query.includes('理财') || query.includes('银行卡') || query.includes('手续费')) {
      return {
        ...baseData,
        '手续费收入': `¥${(18 + Math.random() * 5).toFixed(1)}亿`,
        '理财规模': `¥${(280 + Math.random() * 30).toFixed(0)}亿`,
        '银行卡数量': `${(520 + Math.random() * 50).toFixed(0)}万张`,
        '结算笔数': `${(90 + Math.random() * 15).toFixed(0)}万笔`,
      };
    }

    // 客户画像
    if (category === '客户画像' || query.includes('客户')) {
      return {
        ...baseData,
        '总客户数': `${(285 + Math.random() * 20).toFixed(0)}万户`,
        '对公客户': `${(3.8 + Math.random() * 0.5).toFixed(1)}万户`,
        '零售客户': `${(281 + Math.random() * 20).toFixed(0)}万户`,
        '高净值客户': `${(2800 + Math.random() * 200).toFixed(0)}户`,
      };
    }

    return {
      ...baseData,
      '状态': '系统正常',
    };
  };
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [drillDownConfig, setDrillDownConfig] = useState<DrillDownConfig | null>(null);
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);
  const [chatSessionId, setChatSessionId] = useState(Date.now());
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  // 检查后端连接
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await checkHealth();
        setBackendConnected(response.status === 'UP');
      } catch (error) {
        setBackendConnected(false);
      }
    };

    checkBackend();
    // 每30秒检查一次
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // 从localStorage加载固定的项目
  useEffect(() => {
    const saved = localStorage.getItem('pinnedItems');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 重新构建Date对象和函数
        const items = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          dataGenerator: createDataGenerator(item.category, item.query),
        }));
        setPinnedItems(items);
      } catch (e) {
        console.error('Failed to load pinned items:', e);
      }
    }
  }, []);

  // 保存到localStorage
  useEffect(() => {
    if (pinnedItems.length > 0) {
      const toSave = pinnedItems.map(({ dataGenerator, ...item }: PinnedItem) => item);
      localStorage.setItem('pinnedItems', JSON.stringify(toSave));
    }
  }, [pinnedItems]);

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleDrillDown = (config: DrillDownConfig) => {
    setDrillDownConfig(config);
    setCurrentView('drilldown');
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  const handlePin = (query: string, response: string, category: string) => {
    const newItem: PinnedItem = {
      id: `pin-${Date.now()}`,
      query,
      response,
      timestamp: new Date(),
      category,
      position: { 
        x: 30 + (pinnedItems.length % 2) * 580, 
        y: 30 + Math.floor(pinnedItems.length / 2) * 430 
      },
      size: { width: 550, height: 400 },
      dataGenerator: createDataGenerator(category, query),
    };
    setPinnedItems((prev: PinnedItem[]) => [...prev, newItem]);
  };

  const handleUnpin = (id: string) => {
    setPinnedItems((prev: PinnedItem[]) => prev.filter((item: PinnedItem) => item.id !== id));
    if (pinnedItems.length === 1) {
      localStorage.removeItem('pinnedItems');
    }
  };

  const handleUpdatePosition = (id: string, position: { x: number; y: number }) => {
    setPinnedItems((prev: PinnedItem[]) =>
      prev.map((item: PinnedItem) => (item.id === id ? { ...item, position } : item))
    );
  };

  const handleUpdateSize = (id: string, size: { width: number; height: number }) => {
    setPinnedItems((prev: PinnedItem[]) =>
      prev.map((item: PinnedItem) => (item.id === id ? { ...item, size } : item))
    );
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有固定项目吗？')) {
      setPinnedItems([]);
      localStorage.removeItem('pinnedItems');
    }
  };

  const handleAutoArrange = () => {
    setPinnedItems((prev: PinnedItem[]) => 
      prev.map((item: PinnedItem, index: number) => ({
        ...item,
        position: {
          x: 30 + (index % 2) * 580,
          y: 30 + Math.floor(index / 2) * 430
        }
      }))
    );
  };

  const handleNewChat = () => {
    setChatSessionId(Date.now());
    setCurrentView('chat');
  };

  const renderContent = () => {
    // 如果是pinned视图，仍然使用全屏展示
    if (currentView === 'pinned') {
      return (
        <div className="flex-1 flex overflow-hidden">
          <ModuleLayout
            title="我的固定面板"
            description="查看和管理已固定的数据卡片"
            icon={<Pin className="w-6 h-6 text-white" />}
            onBack={handleBackToChat}
            fullWidth={true}
          >
            <PinnedDashboard
              pinnedItems={pinnedItems}
              onUnpin={handleUnpin}
              onUpdatePosition={handleUpdatePosition}
              onUpdateSize={handleUpdateSize}
              onClearAll={handleClearAll}
              onAutoArrange={handleAutoArrange}
            />
          </ModuleLayout>
        </div>
      );
    }

    // 其他视图使用三栏布局
    const mainContent = (() => {
      switch (currentView) {
        case 'dashboard':
          return (
            <ModuleLayout
              title="经营管理驾驶舱"
              description="全行经营指标、分支机构对比、战略目标达成情况"
              icon={<LayoutDashboard className="w-6 h-6 text-white" />}
              onBack={handleBackToChat}
            >
              <ExecutiveDashboard onPin={handlePin} onDrillDown={handleDrillDown} />
            </ModuleLayout>
          );
        case 'deposit':
          return (
            <ModuleLayout
              title="存款业务分析"
              description="对公存款、零售存款监控、存款结构优化"
              icon={<Landmark className="w-6 h-6 text-white" />}
              onBack={handleBackToChat}
            >
              <FinanceQA onPin={handlePin} onDrillDown={handleDrillDown} />
            </ModuleLayout>
          );
        case 'loan':
          return (
            <ModuleLayout
              title="贷款业务分析"
              description="授信管理、贷款质量、风险预警、不良资产监控"
              icon={<HandCoins className="w-6 h-6 text-white" />}
              onBack={handleBackToChat}
            >
              <TradeAnalysis onPin={handlePin} onDrillDown={handleDrillDown} />
            </ModuleLayout>
          );
        case 'intermediate':
          return (
            <ModuleLayout
              title="中间业务分析"
              description="汇款结算、银行卡业务、理财产品销售"
              icon={<CreditCard className="w-6 h-6 text-white" />}
              onBack={handleBackToChat}
            >
              <IntermediateBusinessAnalysis onPin={handlePin} onDrillDown={handleDrillDown} />
            </ModuleLayout>
          );
        case 'customer':
          return (
            <ModuleLayout
              title="客户画像分析"
              description="对公客户、零售客户深度分析、精准营销支持"
              icon={<Users className="w-6 h-6 text-white" />}
              onBack={handleBackToChat}
            >
              <LogisticsAnalysis onPin={handlePin} onDrillDown={handleDrillDown} />
            </ModuleLayout>
          );
        case 'knowledge':
          return (
            <ModuleLayout
              title="知识库档案管理"
              description="智能检索、政策文档、合规资料管理"
              icon={<FolderOpen className="w-6 h-6 text-white" />}
              onBack={handleBackToChat}
            >
              <KnowledgeBase onPin={handlePin} />
            </ModuleLayout>
          );
        case 'data-manager':
          return (
            <ModuleLayout
              title="数据管理中心"
              description="一站式完成数据导入、清洗、建模与指标定义"
              icon={<Database className="w-6 h-6 text-white" />}
              onBack={handleBackToChat}
            >
              <DataManager />
            </ModuleLayout>
          );
        default:
          return <ChatInterface key={chatSessionId} onNavigate={handleNavigate} onPin={handlePin} />;
      }
    })();

    return (
      <ThreeColumnLayout
        sidebar={
          <Sidebar 
            open={true} 
            onToggle={() => {}}
            onNavigate={handleNavigate}
            onNewChat={handleNewChat}
          />
        }
        pinnedItems={pinnedItems}
        onUnpin={handleUnpin}
        onUpdatePosition={handleUpdatePosition}
        onUpdateSize={handleUpdateSize}
      >
        {mainContent}
      </ThreeColumnLayout>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0" onClick={handleBackToChat}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 relative flex-shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur opacity-50" />
              </div>
              <div className="min-w-0">
                <h1 className="text-white text-sm sm:text-base line-clamp-1" title="银行智能AI助手">银行智能AI助手</h1>
                <p className="text-xs text-slate-400 hidden sm:block line-clamp-1" title="全行BI问数平台 · 支持权限管理和个性化看板">全行BI问数平台 · 支持权限管理和个性化看板</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {pinnedItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate('pinned')}
                className="flex items-center gap-1 sm:gap-2 text-white hover:text-white hover:bg-slate-700/50 relative h-8 px-2 sm:px-3"
                title="查看您的专属数据看板"
              >
                <Pin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                <span className="hidden sm:inline text-white text-sm">我的面板</span>
                <Badge className="bg-blue-500 text-white border-0 h-4 sm:h-5 min-w-4 sm:min-w-5 flex items-center justify-center p-0 px-1 sm:px-1.5 text-xs">
                  {pinnedItems.length}
                </Badge>
              </Button>
            )}
            <div className="hidden lg:flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">系统在线</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {renderContent()}
      </div>

      {/* Toast notifications */}
      <Toaster />
      
      {/* Backend connection status */}
      <BackendStatus />
    </div>
  );
}