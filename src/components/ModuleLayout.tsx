import { ReactNode } from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface ModuleLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  onBack: () => void;
  children: ReactNode;
  fullWidth?: boolean; // 添加全宽选项
}

export function ModuleLayout({ title, description, icon, onBack, children, fullWidth = false }: ModuleLayoutProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Module Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
        <div className={fullWidth ? 'flex items-center gap-3 md:gap-4' : 'max-w-7xl mx-auto flex items-center gap-3 md:gap-4'}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 h-8 w-8 md:h-10 md:w-10"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-white text-sm md:text-lg line-clamp-1" title={title}>{title}</h2>
              <p className="text-xs text-slate-400 line-clamp-1" title={description}>{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Module Content */}
      <div className={`flex-1 overflow-y-auto ${fullWidth ? '' : 'p-4 md:p-6'}`}>
        {fullWidth ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}