import { useState } from 'react';
import { Button } from './ui/button';
import { checkHealth } from '../lib/api';

/**
 * 连接测试工具 - 用于诊断前后端连接问题
 */
export function ConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);
    setError(null);

    try {
      const response = await checkHealth();
      setResult(response);
      
      if (response.status === 'UP') {
        console.log('✅ 后端连接成功！', response);
      } else {
        console.error('❌ 后端连接失败', response);
        setError(response.message || '后端服务不可用');
      }
    } catch (err: any) {
      console.error('❌ 连接测试失败:', err);
      setError(err.message || '无法连接到后端');
    } finally {
      setTesting(false);
    }
  };

  const testEndpoints = async () => {
    setTesting(true);
    setResult(null);
    setError(null);

    const API_BASE_URL = 'http://localhost:8080/api';
    const endpoints = [
      { name: '欢迎页', url: '/', method: 'GET' },
      { name: '健康检查', url: '/health', method: 'GET' },
      { name: '认证健康', url: '/auth/health', method: 'GET' },
      { name: 'AI对话', url: '/ai/chat', method: 'POST', body: { query: '测试', module: 'deposit' } },
      { name: 'Pin列表', url: '/panel/items', method: 'GET' },
    ];

    const results: any = {};
    
    for (const endpoint of endpoints) {
      try {
        const options: RequestInit = {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' },
        };
        
        if (endpoint.body) {
          options.body = JSON.stringify(endpoint.body);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint.url}`, options);
        results[endpoint.name] = {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
        };
      } catch (err: any) {
        results[endpoint.name] = {
          status: 'ERROR',
          ok: false,
          error: err.message,
        };
      }
    }

    setResult(results);
    setTesting(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4">
      <h3 className="text-white font-semibold mb-3">🔧 连接测试工具</h3>
      
      <div className="space-y-2 mb-3">
        <Button
          onClick={testConnection}
          disabled={testing}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          {testing ? '测试中...' : '测试后端连接'}
        </Button>
        
        <Button
          onClick={testEndpoints}
          disabled={testing}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="sm"
        >
          {testing ? '测试中...' : '测试所有端点'}
        </Button>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs">
          <p className="text-red-400 font-semibold">❌ 错误</p>
          <p className="text-red-300">{error}</p>
          <div className="mt-2 text-red-200 text-xs">
            <p>请检查：</p>
            <ul className="list-disc list-inside ml-2">
              <li>后端是否已启动</li>
              <li>端口8080是否正确</li>
              <li>运行: backend/REBUILD.bat</li>
            </ul>
          </div>
        </div>
      )}

      {result && (
        <div className="p-2 bg-slate-700/50 rounded text-xs max-h-60 overflow-y-auto">
          {typeof result === 'object' && result.status === 'UP' ? (
            <div className="text-green-400">
              <p className="font-semibold">✅ 连接成功</p>
              <pre className="mt-1 text-xs text-slate-300">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ) : typeof result === 'object' && result.status === 'DOWN' ? (
            <div className="text-red-400">
              <p className="font-semibold">❌ 连接失败</p>
              <p className="mt-1">{result.message}</p>
            </div>
          ) : (
            <div className="text-white">
              <p className="font-semibold mb-2">测试结果：</p>
              {Object.entries(result).map(([name, data]: [string, any]) => (
                <div key={name} className="mb-2 pb-2 border-b border-slate-600 last:border-0">
                  <p className="font-semibold">
                    {data.ok ? '✅' : '❌'} {name}
                  </p>
                  <p className="text-slate-400">
                    状态: {data.status} {data.statusText || data.error || ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-400">
        <p>目标: http://localhost:8080/api</p>
        <p className="mt-1">
          如果测试失败，请运行：
        </p>
        <pre className="mt-1 text-xs bg-slate-900 p-2 rounded">
          cd backend{'\n'}
          REBUILD.bat
        </pre>
      </div>
    </div>
  );
}
