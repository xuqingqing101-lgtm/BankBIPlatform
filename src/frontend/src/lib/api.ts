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
export async function sendChatMessage(message: string, module: string = 'general', conversationId?: number): Promise<ApiResponse<string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: message,
        module: module,
        conversationId: conversationId
      }),
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

/**
 * 获取存款业务数据
 */
export async function getDepositData(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/deposit`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Get deposit data failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get deposit data error:', error);
    throw error;
  }
}

/**
 * 获取贷款业务数据
 */
export async function getLoanData(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/loan`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Get loan data failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get loan data error:', error);
    throw error;
  }
}

/**
 * 获取中间业务数据
 */
export async function getIntermediateData(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/intermediate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Get intermediate data failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get intermediate data error:', error);
    throw error;
  }
}

/**
 * 获取客户画像数据
 */
export async function getCustomerData(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/customer`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Get customer data failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get customer data error:', error);
    throw error;
  }
}

/**
 * 获取经营管理数据
 */
export async function getManagementData(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/management`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Get management data failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get management data error:', error);
    throw error;
  }
}

/**
 * 搜索知识库
 */
export async function searchKnowledge(query: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Search knowledge failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search knowledge error:', error);
    throw error;
  }
}

/**
 * 获取AI分析结果
 */
export async function getAIAnalysis(category: string, query: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, query }),
    });

    if (!response.ok) {
      throw new Error(`Get AI analysis failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get AI analysis error:', error);
    throw error;
  }
}

// 导出所有API函数
export const api = {
  checkHealth,
  sendChatMessage,
  getDepositData,
  getLoanData,
  getIntermediateData,
  getCustomerData,
  getManagementData,
  searchKnowledge,
  getAIAnalysis,
};

export default api;
