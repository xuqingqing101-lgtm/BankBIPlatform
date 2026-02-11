import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Building2, Activity, Wallet, CreditCard, ChevronRight } from 'lucide-react';
import { MultiRoundAIQuery } from './MultiRoundAIQuery';
import { Badge } from './ui/badge';
import { AIInsights, Insight } from './AIInsights';
import { useState, useEffect } from 'react';
import { getManagementData } from '../lib/api';
import { DrillDownConfig } from './DrillDownPage';

// 银行营收数据（单位：亿元）
const defaultRevenueData = [
  { month: '1月', revenue: 48.2, cost: 28.5, profit: 19.7 },
  { month: '2月', revenue: 45.8, cost: 27.2, profit: 18.6 },
  { month: '3月', revenue: 52.1, cost: 30.8, profit: 21.3 },
  { month: '4月', revenue: 49.6, cost: 29.5, profit: 20.1 },
  { month: '5月', revenue: 55.3, cost: 32.1, profit: 23.2 },
  { month: '6月', revenue: 58.9, cost: 33.8, profit: 25.1 },
];

// 业务收入结构
const defaultBusinessData = [
  { name: '利息净收入', value: 68, color: '#3b82f6' },
  { name: '手续费收入', value: 18, color: '#10b981' },
  { name: '投资收益', value: 10, color: '#f59e0b' },
  { name: '其他收入', value: 4, color: '#8b5cf6' },
];

// 资产配置结构
const defaultAssetData = [
  { name: '贷款', value: 65, color: '#3b82f6' },
  { name: '债券投资', value: 20, color: '#10b981' },
  { name: '同业资产', value: 10, color: '#f59e0b' },
  { name: '现金及准备金', value: 5, color: '#8b5cf6' },
];

const defaultKpiData = [
  { title: '总资产', value: '¥5.89万亿', change: '+6.8%', trend: 'up', icon: 'Building2' },
  { title: '存款余额', value: '¥4.58万亿', change: '+8.5%', trend: 'up', icon: 'Wallet' },
  { title: '贷款余额', value: '¥3.82万亿', change: '+10.2%', trend: 'up', icon: 'CreditCard' },
  { title: '净利润', value: '¥138亿', change: '+12.3%', trend: 'up', icon: 'DollarSign' },
];

const iconMap: Record<string, any> = {
  Building2,
  Wallet,
  CreditCard,
  DollarSign,
  Users,
  Activity
};

const exampleQueries = [
  '本季度净息差是多少？',
  '中间业务收入占比如何变化？',
  '不良贷款率的变化趋势如何？',
  '资本充足率是否符合监管要求？'
];

const executiveInsights: Insight[] = [
  {
    type: 'trend',
    title: '存贷款规模稳步增长，盈利能力持续提升',
    description: '本年度存款余额增长8.5%，贷款余额增长10.2%，净利润同比增长12.3%。息差水平稳定在2.1%，资产质量保持良好。',
    impact: 'high',
    priority: 1
  },
  {
    type: 'opportunity',
    title: '零售业务增长迅速，建议加大投入',
    description: '零售存款增速达9.2%，零售贷款增速达12.5%，高于对公业务。建议加强零售客户获客和数字化建设，抢占市场份额。',
    impact: 'high',
    priority: 2
  },
  {
    type: 'risk',
    title: '不良率有所上升，需加强风险管控',
    description: '不良贷款率从1.28%上升至1.35%，主要集中在制造业和房地产行业。建议收紧高风险行业授信，加强贷后管理。',
    impact: 'high',
    priority: 3
  },
  {
    type: 'recommendation',
    title: '中间业务收入占比偏低，需拓展非息收入',
    description: '中间业务收入占比仅12.3%，低于行业平均15%。建议加强理财顾问、代理业务、投行业务拓展，提升收入多元化。',
    impact: 'medium',
    priority: 4
  },
  {
    type: 'trend',
    title: '数字化转型成效显著，客户体验提升',
    description: '手机银行用户增长18%，月活用户占比47%。数字渠道交易占比达82%，节约运营成本约8%。建议持续投入科技创新。',
    impact: 'medium',
    priority: 5
  }
];

interface ExecutiveDashboardProps {
  onPin?: (query: string, response: string, category: string) => void;
  onDrillDown?: (config: DrillDownConfig) => void;
}

export function ExecutiveDashboard({ onPin, onDrillDown }: ExecutiveDashboardProps) {
  const [revenueData, setRevenueData] = useState(defaultRevenueData);
  const [businessData, setBusinessData] = useState(defaultBusinessData);
  const [assetData, setAssetData] = useState(defaultAssetData);
  const [kpiData, setKpiData] = useState(defaultKpiData);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getManagementData();
        if (response.success && response.data) {
          const { revenueData, businessData, assetData, kpiData } = response.data;
          if (revenueData) setRevenueData(revenueData);
          if (businessData) setBusinessData(businessData);
          if (assetData) setAssetData(assetData);
          
          if (kpiData) {
            // Map icons for KPI data
            const mappedKpiData = kpiData.map((item: any, index: number) => ({
              ...item,
              icon: index === 0 ? 'Building2' : 
                    index === 1 ? 'Wallet' : 
                    index === 2 ? 'CreditCard' : 'DollarSign' 
            }));
            setKpiData(mappedKpiData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data, using defaults", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <AIInsights 
        insights={executiveInsights}
        title="AI智能经营洞察"
        description="基于全行实时数据分析的战略建议和风险提示"
      />

      {/* AI Query Section */}
      <MultiRoundAIQuery 
        title="智能问数助手"
        placeholder="输入您的问题，例如：本季度净息差是多少？"
        exampleQueries={exampleQueries}
        category="高管驾驶舱"
        onPin={onPin}
        backendModule="dashboard"
        useDataAnalysisApi={true}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = iconMap[kpi.icon] || Building2;
          return (
            <Card key={index} className="bg-gradient-to-br from-slate-800/90 to-slate-800/50 border-slate-700/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-slate-400 text-xs sm:text-sm">{kpi.title}</span>
                  <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white text-xl sm:text-2xl font-semibold mb-1">{kpi.value}</p>
                    <div className="flex items-center gap-1">
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                      )}
                      <span className={`text-xs sm:text-sm ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Trend */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-100">营收趋势分析</CardTitle>
                <CardDescription className="text-slate-400">近半年营收与利润趋势</CardDescription>
              </div>
              {onDrillDown && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => onDrillDown({
                    type: 'profit', // Changed from 'revenue' to 'profit' as 'revenue' is not a valid DrillDownConfig type
                    title: '营收趋势分析',
                    description: '收入、成本与利润的详细趋势分析',
                    category: '经营管理'
                  })}
                >
                  查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="营收" dot={{ fill: '#3b82f6', r: 4 }} />
                <Line type="monotone" dataKey="cost" stroke="#f43f5e" strokeWidth={2} name="成本" dot={{ fill: '#f43f5e', r: 4 }} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="利润" dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Business Structure */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-100">业务收入结构</CardTitle>
                <CardDescription className="text-slate-400">各业务线收入占比</CardDescription>
              </div>
              {onDrillDown && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => onDrillDown({
                    type: 'profit', // Changed from 'business' to 'profit' as 'business' is not a valid DrillDownConfig type for this context or use 'business' if defined
                    title: '业务结构分析',
                    description: '各业务线收入贡献分析及增长潜力评估',
                    category: '经营管理'
                  })}
                >
                  查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={businessData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {businessData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: any) => `${value}%`}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-100">资产配置结构</CardTitle>
                <CardDescription className="text-slate-400">各类资产占比</CardDescription>
              </div>
              {onDrillDown && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => onDrillDown({
                    type: 'asset',
                    title: '资产负债分析',
                    description: '资产配置结构、负债情况及流动性风险分析',
                    category: '经营管理'
                  })}
                >
                  查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: any) => `${value}%`}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Key Metrics Bar Chart */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-100">核心指标对比</CardTitle>
            <CardDescription className="text-slate-400">关键经营指标同比变化</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[
                { name: '资产增速', value: 6.8 },
                { name: '存款增速', value: 8.5 },
                { name: '贷款增速', value: 10.2 },
                { name: '利润增速', value: 12.3 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: any) => `${value}%`}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} name="增长率(%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
