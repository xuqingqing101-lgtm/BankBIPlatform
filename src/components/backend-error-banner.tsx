import { AlertCircle, Terminal, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface BackendErrorBannerProps {
  onRetry: () => void;
}

export function BackendErrorBanner({ onRetry }: BackendErrorBannerProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [commandCopied, setCommandCopied] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry();
    setTimeout(() => setIsRetrying(false), 2000);
  };

  const copyCommand = () => {
    navigator.clipboard.writeText('cd backend\nRUN.bat');
    setCommandCopied(true);
    setTimeout(() => setCommandCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
      <div className="max-w-3xl mx-4 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-red-500/50 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-700">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/30 flex items-center justify-center ring-4 ring-red-500/20 animate-pulse">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">后端服务未启动</h2>
              <p className="text-sm text-red-300">Backend Service Not Running</p>
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="px-8 py-6 space-y-6">
          {/* 状态说明 */}
          <div className="bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-lg p-4">
            <p className="text-base text-yellow-200 font-semibold mb-2">
              ⚠️ 这是正常的！不要担心！
            </p>
            <p className="text-sm text-slate-300">
              前端正在尝试连接后端API（<code className="text-yellow-300">http://localhost:8080</code>），但连接失败了。
              <br />
              <span className="text-slate-400">原因：后端 Spring Boot 服务还没有在本地启动。</span>
            </p>
          </div>

          {/* 解决方案 */}
          <div className="bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg p-4">
            <p className="text-base text-blue-200 font-semibold mb-2">
              💡 你需要做什么？
            </p>
            <p className="text-sm text-slate-300">
              在你的本地电脑上启动后端服务，然后刷新此页面。
            </p>
          </div>

          {/* 启动步骤 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              快速启动（3步，1分钟）
            </h3>

            <div className="space-y-4">
              {/* 步骤1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-4 ring-blue-500/20">
                  <span className="text-base font-bold text-white">1</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-base font-semibold text-white mb-1">打开命令行</p>
                  <p className="text-sm text-slate-400">
                    按 <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Win + R</kbd>，
                    输入 <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">cmd</kbd>，
                    按回车
                  </p>
                </div>
              </div>

              {/* 步骤2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-4 ring-blue-500/20">
                  <span className="text-base font-bold text-white">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-white mb-3">复制并运行这些命令</p>
                  <div className="bg-slate-950 border-2 border-slate-700 rounded-lg p-4 font-mono">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 select-none">#</span>
                        <span className="text-slate-400 text-sm">进入backend目录</span>
                      </div>
                      <div className="text-green-400 text-base font-semibold">cd backend</div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-slate-500 select-none">#</span>
                        <span className="text-slate-400 text-sm">启动后端服务</span>
                      </div>
                      <div className="text-green-400 text-base font-semibold">RUN.bat</div>
                    </div>
                  </div>
                  <button
                    onClick={copyCommand}
                    className={`mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      commandCopied
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {commandCopied ? '✅ 已复制！粘贴到命令行并回车' : '📋 复制命令到剪贴板'}
                  </button>
                </div>
              </div>

              {/* 步骤3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-4 ring-blue-500/20">
                  <span className="text-base font-bold text-white">3</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-base font-semibold text-white mb-2">等待启动完成（1-2分钟）</p>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 space-y-1">
                    <p className="text-sm font-semibold text-green-300 mb-2">✅ 成功标志：</p>
                    <p className="text-sm text-slate-300">• 显示 "🏦 银行智能AI分析平台已启动"</p>
                    <p className="text-sm text-slate-300">• 看到多个 "Mapped" 字样</p>
                    <p className="text-sm text-slate-300">• 没有红色错误信息</p>
                  </div>
                  <div className="mt-2 bg-orange-500/10 border border-orange-500/30 rounded p-2">
                    <p className="text-xs text-orange-200">
                      ⚠️ <strong>重要：</strong> 启动成功后，保持命令行窗口打开！
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 替代方案 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-sm font-semibold text-slate-300 mb-2">
              🎯 更简单的方式：
            </p>
            <p className="text-sm text-slate-400 mb-2">
              在项目根目录找到 <code className="text-blue-300">启动后端.bat</code> 文件，双击运行即可。
            </p>
            <p className="text-xs text-slate-500">
              或查看 <code className="text-blue-400">index.html</code> 获取详细的可视化指南。
            </p>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="bg-slate-900 border-t border-slate-700 px-8 py-4 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            启动后端后，点击右侧按钮重新连接 →
          </div>
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                检测中...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                重新连接
              </>
            )}
          </Button>
        </div>

        {/* 帮助链接 */}
        <div className="bg-slate-950/50 px-8 py-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">💁 需要帮助？</span>
            <div className="flex gap-4">
              <a
                href="/index.html"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                📖 启动中心
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="/立即修复.html"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                🔧 可视化指南
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
