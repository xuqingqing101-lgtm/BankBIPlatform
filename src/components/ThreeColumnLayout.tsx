import { ReactNode } from 'react';
import { PinnedItem } from './PinnedDashboard';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Pin, X, RefreshCw, GripVertical, ChevronLeft, ChevronRight, Menu, Maximize2, ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';
import { Resizable } from 're-resizable';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState, useEffect } from 'react';
import { ScrollArea } from './ui/scroll-area';

interface ThreeColumnLayoutProps {
  sidebar: ReactNode;
  pinnedItems: PinnedItem[];
  onUnpin: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateSize: (id: string, size: { width: number; height: number }) => void;
  children: ReactNode;
}

const ItemTypes = {
  CARD: 'card',
};

interface CompactPinnedCardProps {
  item: PinnedItem;
  onUnpin: (id: string) => void;
  index: number;
}

function CompactPinnedCard({ item, onUnpin, index }: CompactPinnedCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (item.dataGenerator) {
      setLiveData(item.dataGenerator());
    }
  }, [item]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      if (item.dataGenerator) {
        setLiveData(item.dataGenerator());
      }
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm overflow-hidden">
      <div className="p-2 sm:p-3 border-b border-slate-700/50">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
              <Pin className="w-3 h-3 text-white flex-shrink-0" />
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-1 sm:px-1.5 py-0">
                {item.category}
              </Badge>
            </div>
            <h3 className="text-slate-200 break-words text-xs leading-relaxed line-clamp-2">
              {item.query}
            </h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-700/50"
              title="刷新数据"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUnpin(item.id)}
              className="h-6 w-6 text-slate-400 hover:text-red-400 hover:bg-slate-700/50"
              title="取消固定"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-2 sm:p-3 space-y-2">
        {/* 实时数据 */}
        {liveData && (
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-2 bg-slate-900/50 rounded border border-slate-700/50">
            {Object.entries(liveData).slice(0, 4).map(([key, value]: [string, any]) => (
              <div key={key} className="space-y-0.5">
                <p className="text-xs text-slate-400 truncate" title={key}>{key}</p>
                <p className="text-xs text-slate-100 break-words truncate" title={String(value)}>{value}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* AI回答内容 */}
        <div className={`p-2 bg-slate-900/30 rounded border border-slate-700/30 ${isExpanded ? 'max-h-none' : 'max-h-20 sm:max-h-24'} overflow-hidden transition-all`}>
          <p className={`text-xs text-slate-300 leading-relaxed whitespace-pre-line break-words ${isExpanded ? '' : 'line-clamp-3 sm:line-clamp-4'}`}>
            {item.response}
          </p>
        </div>

        {/* 展开/收起按钮 */}
        {item.response.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isExpanded ? '收起' : '展开更多'}
          </button>
        )}

        {/* 时间戳 */}
        <p className="text-xs text-slate-500">
          {new Date(item.timestamp).toLocaleString('zh-CN', { 
            month: 'numeric', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </Card>
  );
}

export function ThreeColumnLayout({
  sidebar,
  pinnedItems,
  onUnpin,
  onUpdatePosition,
  onUpdateSize,
  children,
}: ThreeColumnLayoutProps) {
  const [middleCollapsed, setMiddleCollapsed] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [leftWidth, setLeftWidth] = useState(256); // 默认 w-64 = 256px
  const [middleWidth, setMiddleWidth] = useState(320); // 默认 w-80 = 320px
  const [isMobile, setIsMobile] = useState(false);
  const [isLeftMaximized, setIsLeftMaximized] = useState(false); // 左侧最大化（隐藏左侧栏）
  const [isRightMaximized, setIsRightMaximized] = useState(false); // 右侧最大化（隐藏右侧栏）

  // 检测屏幕尺寸
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setLeftCollapsed(true);
        setMiddleCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 移动端布局
  if (isMobile) {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 移动端顶部栏 */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/50 bg-slate-800/30 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              className="h-8 w-8 text-slate-400 hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </Button>
            {pinnedItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMiddleCollapsed(!middleCollapsed)}
                className="text-slate-400 hover:text-white h-8 px-2"
              >
                <Pin className="w-3 h-3 mr-1" />
                <span className="text-xs">固定({pinnedItems.length})</span>
              </Button>
            )}
          </div>

          {/* 侧边栏抽屉 */}
          {!leftCollapsed && (
            <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setLeftCollapsed(true)}>
              <div 
                className="absolute left-0 top-0 bottom-0 w-64 bg-slate-800 border-r border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                <ScrollArea className="h-full">
                  {sidebar}
                </ScrollArea>
              </div>
            </div>
          )}

          {/* 固定面板抽屉 */}
          {pinnedItems.length > 0 && !middleCollapsed && (
            <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setMiddleCollapsed(true)}>
              <div 
                className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-slate-800 border-l border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-full flex flex-col">
                  <div className="px-3 py-2 border-b border-slate-700/50 bg-slate-800/30 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Pin className="w-4 h-4 text-white" />
                      <span className="text-sm text-slate-200">我的面板</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs h-5">
                        {pinnedItems.length}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMiddleCollapsed(true)}
                      className="h-7 w-7 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-3 space-y-3">
                      {pinnedItems.map((item, index) => (
                        <CompactPinnedCard
                          key={item.id}
                          item={item}
                          onUnpin={onUnpin}
                          index={index}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}

          {/* 主内容区 */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </DndProvider>
    );
  }

  // 桌面端布局
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-full flex overflow-hidden">
        {/* 左侧栏 - 导航 */}
        {!leftCollapsed && !isLeftMaximized && !isRightMaximized && (
          <Resizable
            size={{ width: leftWidth, height: '100%' }}
            onResizeStop={(e, direction, ref, d) => {
              setLeftWidth(leftWidth + d.width);
            }}
            minWidth={200}
            maxWidth={400}
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            handleComponent={{
              right: <div className="resize-handle-vertical" />,
            }}
            className="flex-shrink-0 border-r border-slate-700/50 bg-slate-800/30 relative overflow-hidden"
          >
            <ScrollArea className="h-full">
              <div className="h-full">
                {sidebar}
              </div>
            </ScrollArea>
          </Resizable>
        )}

        {/* 左侧栏收起时的展开按钮 */}
        {(leftCollapsed || isLeftMaximized || isRightMaximized) && pinnedItems.length === 0 && (
          <div className="w-10 flex-shrink-0 border-r border-slate-700/50 bg-slate-800/20 flex flex-col items-center py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setLeftCollapsed(false);
                setIsLeftMaximized(false);
                setIsRightMaximized(false);
              }}
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
              title="展开导航"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* 中间栏 - Pin内容 */}
        {pinnedItems.length > 0 && !middleCollapsed && (
          <Resizable
            size={{ width: middleWidth, height: '100%' }}
            onResizeStop={(e, direction, ref, d) => {
              setMiddleWidth(middleWidth + d.width);
            }}
            minWidth={280}
            maxWidth={600}
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            handleComponent={{
              right: <div className="resize-handle-vertical" />,
            }}
            className="flex-shrink-0 border-r border-slate-700/50 bg-slate-800/20 relative"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/30 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Pin className="w-4 h-4 text-white" />
                  <span className="text-sm text-slate-200">我的面板</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs h-5">
                    {pinnedItems.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {/* 左侧最大化按钮 */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsLeftMaximized(!isLeftMaximized);
                      setIsRightMaximized(false);
                    }}
                    className={`h-7 w-7 hover:bg-slate-700/50 ${isLeftMaximized ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                    title={isLeftMaximized ? "恢复左侧栏" : "左侧最大化（隐藏左侧栏）"}
                  >
                    <ArrowLeftToLine className="w-4 h-4" />
                  </Button>
                  {/* 右侧最大化按钮 */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsRightMaximized(!isRightMaximized);
                      setIsLeftMaximized(false);
                    }}
                    className={`h-7 w-7 hover:bg-slate-700/50 ${isRightMaximized ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                    title={isRightMaximized ? "恢复主内容区" : "右侧最大化（隐藏主内容区）"}
                  >
                    <ArrowRightToLine className="w-4 h-4" />
                  </Button>
                  {/* 收起按钮 */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMiddleCollapsed(true)}
                    className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700/50"
                    title="收起面板"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Pinned Items List */}
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-3">
                    {pinnedItems.map((item, index) => (
                      <CompactPinnedCard
                        key={item.id}
                        item={item}
                        onUnpin={onUnpin}
                        index={index}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Footer Tip */}
              <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-800/30 flex-shrink-0">
                <p className="text-xs text-slate-500">
                  💡 悬停AI回答时点击固定按钮
                </p>
              </div>
            </div>
          </Resizable>
        )}

        {/* 中间栏收起时的展开按钮 */}
        {pinnedItems.length > 0 && middleCollapsed && (
          <div className="w-10 flex-shrink-0 border-r border-slate-700/50 bg-slate-800/20 flex flex-col items-center py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMiddleCollapsed(false)}
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50 mb-2"
              title="展开固定面板"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="writing-mode-vertical text-xs text-slate-500 mt-4">
              我的面板
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs h-5 mt-2">
              {pinnedItems.length}
            </Badge>
          </div>
        )}

        {/* 右侧栏 - 主内容区 */}
        {!isRightMaximized && (
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            {children}
          </div>
        )}
      </div>
    </DndProvider>
  );
}
