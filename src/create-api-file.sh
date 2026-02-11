#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║    🔧 立即创建 lib/api.ts 文件            ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 检查 frontend 目录
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ 错误：找不到 frontend 目录${NC}"
    echo ""
    echo -e "${YELLOW}💡 请确保在项目根目录运行此脚本${NC}"
    exit 1
fi

cd frontend

echo -e "${CYAN}[Step 1/3] 创建 lib 目录...${NC}"
echo "────────────────────────────────────────────"

mkdir -p src/lib
echo -e "${GREEN}✅ 目录已创建${NC}"

echo ""
echo -e "${CYAN}[Step 2/3] 创建 api.ts 文件...${NC}"
echo "────────────────────────────────────────────"

cat > src/lib/api.ts << 'EOF'
/**
 * API 客户端
 * 封装所有后端API调用
 */

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8080/api';

// API 响应类型
export interface HealthResponse {
  status: 'UP' | 'DOWN';
  timestamp: string;
  version?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * 健康检查
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
}

/**
 * 发送聊天消息
 */
export async function sendChatMessage(message: string): Promise<ApiResponse<string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Chat request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}

// 导出所有API函数
export const api = {
  checkHealth,
  sendChatMessage,
};

export default api;
EOF

echo -e "${GREEN}✅ api.ts 已创建${NC}"

echo ""
echo -e "${CYAN}[Step 3/3] 创建 .env 文件...${NC}"
echo "────────────────────────────────────────────"

if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# 环境变量配置
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=银行智能AI分析平台
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
EOF
    echo -e "${GREEN}✅ .env 已创建${NC}"
else
    echo -e "${GREEN}✅ .env 已存在${NC}"
fi

echo ""
echo "══════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ 文件创建完成！${NC}"
echo ""
echo -e "${CYAN}📁 已创建：${NC}"
echo "   frontend/src/lib/api.ts      ✅"
echo "   frontend/.env                ✅"
echo ""
echo -e "${CYAN}💡 下一步：${NC}"
echo "   1. 如果前端正在运行，按 Ctrl+C 停止"
echo "   2. 重新启动：npm run dev"
echo "   3. 或者运行：./frontend-start.sh"
echo ""
echo "══════════════════════════════════════════════"
echo ""

read -p "按 Enter 退出..."
