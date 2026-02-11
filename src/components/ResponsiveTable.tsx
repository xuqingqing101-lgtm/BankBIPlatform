import { ReactNode } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className = '' }: ResponsiveTableProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* 桌面端 - 正常表格 */}
      <div className="hidden md:block">
        {children}
      </div>
      
      {/* 移动端 - 可滚动表格 */}
      <div className="block md:hidden">
        <ScrollArea className="w-full">
          <div className="min-w-[600px]">
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

interface ResponsiveCardListProps {
  data: any[];
  renderCard: (item: any, index: number) => ReactNode;
  className?: string;
}

// 移动端卡片列表视图（替代表格）
export function ResponsiveCardList({ data, renderCard, className = '' }: ResponsiveCardListProps) {
  return (
    <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${className}`}>
      {data.map((item, index) => (
        <Card key={index} className="bg-slate-800/50 border-slate-700/50 p-3 sm:p-4">
          {renderCard(item, index)}
        </Card>
      ))}
    </div>
  );
}
