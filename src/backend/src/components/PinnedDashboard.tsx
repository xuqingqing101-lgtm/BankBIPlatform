import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Pin, X, RefreshCw, GripVertical, Maximize2, Minimize2, Trash2, LayoutGrid } from 'lucide-react';
import { Badge } from './ui/badge';
import { Resizable } from 're-resizable';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ScrollArea } from './ui/scroll-area';

export interface PinnedItem {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  category: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  dataGenerator?: () => any;
}

interface PinnedDashboardProps {
  pinnedItems: PinnedItem[];
  onUnpin: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateSize: (id: string, size: { width: number; height: number }) => void;
  onClearAll?: () => void;
  onAutoArrange?: () => void;
}

const ItemTypes = {
  CARD: 'card',
};

interface DraggableCardProps {
  item: PinnedItem;
  onUnpin: (id: string) => void;
  onMove: (id: string, left: number, top: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onMaximize: (id: string) => void;
  isMaximized: boolean;
}

function DraggableCard({ item, onUnpin, onMove, onResize, onMaximize, isMaximized }: DraggableCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // 初始化实时数据
    if (item.dataGenerator) {
      setLiveData(item.dataGenerator());
    }
  }, [item]);

  const handleRefresh = () => {
    if (item.dataGenerator) {
      setIsRefreshing(true);
      setTimeout(() => {
        setLiveData(item.dataGenerator?.());
        setIsRefreshing(false);
      }, 800);
    }
  };

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: item.id, left: item.position.x, top: item.position.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const defaultWidth = 500;
  const defaultHeight = 400;

  // 如果被最大化，不显示在画布上
  if (isMaximized) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: item.position.x,
        top: item.position.y,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Resizable
        size={{
          width: item.size.width || defaultWidth,
          height: item.size.height || defaultHeight,
        }}
        onResizeStop={(e, direction, ref, d) => {
          onResize(
            item.id,
            (item.size.width || defaultWidth) + d.width,
            (item.size.height || defaultHeight) + d.height
          );
        }}
        minWidth={400}
        minHeight={300}
        maxWidth={1200}
        maxHeight={1000}
        enable={{
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
        handleStyles={{
          bottomRight: {
            cursor: 'se-resize',
            width: '20px',
            height: '20px',
          },
        }}
      >
        <Card className="h-full bg-slate-800/80 border-slate-700 shadow-2xl backdrop-blur-sm overflow-hidden flex flex-col">
          <CardHeader className="pb-4 flex-shrink-0 border-b border-slate-700/50">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  ref={drag as unknown as React.Ref<HTMLDivElement>}
                  className="cursor-move mt-1 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
                >
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Pin className="w-4 h-4 text-white flex-shrink-0" />
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {item.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-slate-200 break-words leading-relaxed text-sm">
                    {item.query}
                  </CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMaximize(item.id)}
                  className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30"
                  title="最大化到右侧"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
                  title="刷新数据"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUnpin(item.id)}
                  className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-slate-700/50"
                  title="取消固定"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-5">
            <div className="space-y-4 h-full">
              {/* 实时数据展示 */}
              {liveData && (
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 flex-shrink-0">
                  {Object.entries(liveData).map(([key, value]: [string, any]) => (
                    <div key={key} className="space-y-1.5">
                      <p className="text-xs text-slate-400">{key}</p>
                      <p className="text-slate-100 break-words">{value}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* AI回答内容 */}
              <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700/30 flex-shrink-0">
                <p className={`text-sm text-slate-300 leading-relaxed whitespace-pre-line break-words ${isExpanded ? '' : 'line-clamp-4'}`}>
                  {item.response}
                </p>
                {item.response.length > 150 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-400 hover:text-blue-300 text-xs mt-2 transition-colors"
                  >
                    {isExpanded ? '收起' : '展开更多...'}
                  </button>
                )}
              </div>

              {/* 时间戳 */}
              <p className="text-xs text-slate-500 text-right flex-shrink-0">
                固定时间: {item.timestamp.toLocaleString('zh-CN')}
              </p>
            </div>
          </CardContent>
        </Card>
      </Resizable>
    </div>
  );
}

interface DropAreaProps {
  children: React.ReactNode;
  onDrop: (id: string, left: number, top: number) => void;
}

function DropArea({ children, onDrop }: DropAreaProps) {
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: { id: string; left: number; top: number }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const left = Math.max(0, Math.round(item.left + delta.x));
        const top = Math.max(0, Math.round(item.top + delta.y));
        onDrop(item.id, left, top);
      }
    },
  });

  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className="w-full h-full">
      {children}
    </div>
  );
}

// 最大化视图组件
interface MaximizedViewProps {
  item: PinnedItem;
  onClose: () => void;
  onUnpin: (id: string) => void;
}

function MaximizedView({ item, onClose, onUnpin }: MaximizedViewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    // 初始化实时数据
    if (item.dataGenerator) {
      setLiveData(item.dataGenerator());
    }

    // 设置自动刷新
    const interval = setInterval(() => {
      if (item.dataGenerator) {
        setLiveData(item.dataGenerator?.());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [item]);

  const handleRefresh = () => {
    if (item.dataGenerator) {
      setIsRefreshing(true);
      setTimeout(() => {
        setLiveData(item.dataGenerator?.());
        setIsRefreshing(false);
      }, 800);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-800/95 border-l border-slate-700 backdrop-blur-sm">
      {/* 头部 */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Pin className="w-5 h-5 text-white flex-shrink-0" />
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {item.category}
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                最大化视图
              </Badge>
            </div>
            <h2 className="text-white text-lg font-medium leading-relaxed break-words">
              {item.query}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-700/50"
              title="刷新数据"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUnpin(item.id)}
              className="h-9 w-9 text-slate-400 hover:text-red-400 hover:bg-slate-700/50"
              title="取消固定"
            >
              <X className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-700/50"
              title="关闭最大化"
            >
              <Minimize2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* 实时数据展示 - 更大的网格 */}
          {liveData && (
            <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-white text-base font-medium mb-4 flex items-center gap-2">
                📊 实时数据
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  自动刷新
                </Badge>
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(liveData).map(([key, value]: [string, any]) => (
                  <div key={key} className="space-y-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                    <p className="text-sm text-slate-400">{key}</p>
                    <p className="text-lg text-slate-100 break-words font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* AI回答内容 - 完整显示 */}
          <div className="bg-slate-900/30 rounded-xl border border-slate-700/30 p-6">
            <h3 className="text-white text-base font-medium mb-4">💬 AI 分析回答</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line break-words text-base">
                {item.response}
              </p>
            </div>
          </div>

          {/* 元数据 */}
          <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-700/30 pt-4">
            <span>固定时间: {item.timestamp.toLocaleString('zh-CN')}</span>
            <span>数据类别: {item.category}</span>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export function PinnedDashboard({
  pinnedItems,
  onUnpin,
  onUpdatePosition,
  onUpdateSize,
  onClearAll,
  onAutoArrange,
}: PinnedDashboardProps) {
  const [maximizedItemId, setMaximizedItemId] = useState<string | null>(null);

  const handleMove = (id: string, left: number, top: number) => {
    onUpdatePosition(id, { x: left, y: top });
  };

  const handleResize = (id: string, width: number, height: number) => {
    onUpdateSize(id, { width, height });
  };

  const handleMaximize = (id: string) => {
    setMaximizedItemId(id);
  };

  const handleCloseMaximized = () => {
    setMaximizedItemId(null);
  };

  const maximizedItem = pinnedItems.find(item => item.id === maximizedItemId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex">
        {/* 左侧：拖拽画布区域 */}
        <div className={`flex flex-col transition-all ${maximizedItemId ? 'w-1/2' : 'w-full'}`}>
          {/* 顶部提示 */}
          <div className="flex-shrink-0 px-8 py-5 bg-slate-800/30 border-b border-slate-700/50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-slate-300">
                  📌 已固定 {pinnedItems.length} 个数据卡片 · 🖱️ 拖拽移动 · 📏 调整大小 · ⛶ 右侧最大化
                </p>
              </div>
              {pinnedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
                    🔄 实时更新
                  </Badge>
                  {onAutoArrange && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onAutoArrange}
                      className="h-8 text-slate-300 hover:text-white hover:bg-slate-700/50"
                    >
                      <LayoutGrid className="w-4 h-4 mr-2" />
                      自动排列
                    </Button>
                  )}
                  {onClearAll && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearAll}
                      className="h-8 text-slate-300 hover:text-red-400 hover:bg-slate-700/50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      清空所有
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 可拖拽区域 */}
          <div className="flex-1 overflow-auto relative bg-slate-900/20">
            {pinnedItems.length === 0 ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center space-y-4 max-w-md">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
                    <Pin className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-300 mb-2">还没有固定任何内容</p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      在首页或各个模块的AI问答中，鼠标悬停在AI回答上，点击右上角的"固定"按钮即可将内容添加到这里
                    </p>
                  </div>
                  <div className="pt-4 space-y-2">
                    <p className="text-xs text-slate-500">💡 提示：固定的内容支持</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        🖱️ 拖拽移动
                      </Badge>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        📏 调整大小
                      </Badge>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        ⛶ 最大化
                      </Badge>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        🔄 实时数据
                      </Badge>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        💾 自动保存
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <DropArea onDrop={handleMove}>
                <div className="min-h-full p-8 relative" style={{ minWidth: '1400px', minHeight: '1000px' }}>
                  {pinnedItems.map((item) => (
                    <DraggableCard
                      key={item.id}
                      item={item}
                      onUnpin={onUnpin}
                      onMove={handleMove}
                      onResize={handleResize}
                      onMaximize={handleMaximize}
                      isMaximized={item.id === maximizedItemId}
                    />
                  ))}
                </div>
              </DropArea>
            )}
          </div>
        </div>

        {/* 右侧：最大化视图 */}
        {maximizedItem && (
          <div className="w-1/2 flex-shrink-0">
            <MaximizedView
              item={maximizedItem}
              onClose={handleCloseMaximized}
              onUnpin={onUnpin}
            />
          </div>
        )}
      </div>
    </DndProvider>
  );
}
