import { useEffect, useState } from 'react';
import { checkHealth } from '../lib/api';
import { Wifi, WifiOff, Info, X } from 'lucide-react';

/**
 * 后端连接状态指示器 - 友好的、非侵入式的提示
 */
export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [showDetails, setShowDetails] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkHealth();
        if (result.status === 'UP') {
          setStatus('connected');
        } else {
          setStatus('disconnected');
        }
      } catch (error) {
        setStatus('disconnected');
      }
    };
    
    checkStatus();
    
    // 每30秒检查一次
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // 如果已关闭提示，不显示
  if (isDismissed) {
    return null;
  }
  
  // 如果已连接，只显示一个小的绿色指示器
  if (status === 'connected') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/20 border border-green-500/30 shadow-lg backdrop-blur-sm">
          <Wifi className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-300 font-medium">AI服务已连接</span>
        </div>
      </div>
    );
  }
  
  // 如果未连接，显示友好的提示
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-500/10 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
            <span className="text-sm text-slate-300 font-medium">演示模式</span>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* 内容 */}
        <div className="px-4 py-3">
          <div className="flex items-start gap-3">
            <WifiOff className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-slate-200 mb-1">
                当前使用<strong className="text-blue-400">模拟数据</strong>
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                所有功能正常运行。如需连接真实AI服务，请启动后端。
              </p>
            </div>
          </div>
          
          {/* 可展开的详情 */}
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <p className="text-xs text-slate-400 mb-2">启动后端服务：</p>
              <div className="bg-slate-950 border border-slate-700 rounded p-2 font-mono text-xs text-green-400">
                cd backend<br />
                RUN.bat
              </div>
              <p className="text-xs text-slate-500 mt-2">
                启动后刷新页面即可连接AI服务
              </p>
            </div>
          )}
          
          {/* 展开/收起按钮 */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            {showDetails ? '收起' : '如何启动后端？'}
          </button>
        </div>
      </div>
    </div>
  );
}
