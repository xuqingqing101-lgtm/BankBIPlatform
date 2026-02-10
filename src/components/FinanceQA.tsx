import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MultiRoundAIQuery } from './MultiRoundAIQuery';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, Building2, Users, Wallet, PiggyBank, ChevronRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AIInsights, Insight } from './AIInsights';
import { getDepositData } from '../lib/api';
import { DrillDownConfig } from './DrillDownPage';

// 默认数据（用于初始化和Fallback）
const defaultDepositTrendData = [
  { month: '5月', corporate: 2750, retail: 1720, total: 4470 },
  { month: '6月', corporate: 2780, retail: 1735, total: 4515 },
  { month: '7月', corporate: 2810, retail: 1748, total: 4558 },
  { month: '8月', corporate: 2835, retail: 1760, total: 4595 },
  { month: '9月', corporate: 2865, retail: 1775, total: 4640 },
  { month: '10月', corporate: 2890, retail: 1790, total: 4680 },
];

const defaultCorporateDepositData = [
  { type: '活期存款', balance: 1210, proportion: 41.9, rate: 0.35 },
  { type: '定期存款', balance: 1380, proportion: 47.8, rate: 2.15 },
  { type: '协定存款', balance: 185, proportion: 6.4, rate: 1.15 },
  { type: '通知存款', balance: 115, proportion: 4.0, rate: 0.85 },
];

const defaultDepositStructureData = [
  { name: '对公存款', value: 61.8, color: '#3b82f6' },
  { name: '零售存款', value: 38.2, color: '#10b981' },
];

const defaultDepositProducts = [
  { name: '智能定期', balance: 285, customers: 8.5, avgAmount: 3.35, growth: 18.5 },
  { name: '大额存单', balance: 420, customers: 2.8, avgAmount: 15.0, growth: 12.3 },
  { name: '结构性存款', balance: 165, customers: 1.2, avgAmount: 13.75, growth: 8.8 },
  { name: '活期宝', balance: 128, customers: 15.6, avgAmount: 0.82, growth: 22.5 },
];

const defaultIndustryDepositData = [
  { industry: '制造业', balance: 685, proportion: 23.7, growth: 8.5, accounts: 8520 },
  { industry: '批发零售', balance: 520, proportion: 18.0, growth: 6.2, accounts: 6840 },
  { industry: '房地产', balance: 385, proportion: 13.3, growth: -2.5, accounts: 1280 },
  { industry: '建筑业', balance: 425, proportion: 14.7, growth: 10.2, accounts: 4560 },
  { industry: '其他', balance: 875, proportion: 30.3, growth: 5.8, accounts: 12980 },
];

const exampleQueries = [
  '本月存款增长了多少？',
  '对公存款的活期占比是多少？',
  '哪个行业的存款增长最快？',
  '大额存单的平均金额是多少？'
];

const depositInsights: Insight[] = [
  {
    type: 'trend',
    title: '存款总量稳步增长，10月突破4680亿',
    description: '近6个月存款从4470亿增至4680亿，增长210亿元（+4.7%）。对公存款增长5.1%，零售存款增长4.1%，增长结构健康。',
    impact: 'high',
    priority: 1
  },
  {
    type: 'opportunity',
    title: '活期宝产品增长迅速，建议加大推广',
    description: '活期宝产品余额128亿，增长22.5%，客户数15.6万户，显示零售客户对灵活存款产品需求旺盛。建议加大营销投入，提升市场份额。',
    impact: 'high',
    priority: 2
  },
  {
    type: 'risk',
    title: '房地产行业存款负增长，需关注行业风险',
    description: '房地产行业存款余额385亿，同比下降2.5%，反映行业景气度下滑。建议加强贷存联动监测，防范行业风险传导。',
    impact: 'high',
    priority: 3
  },
  {
    type: 'recommendation',
    title: '建议优化存款结构，提升活期占比',
    description: '目前活期存款占比42%，低于同业平均45%。活期存款成本低且稳定性好，建议推广智能结算产品，提升活期占比。',
    impact: 'medium',
    priority: 4
  },
  {
    type: 'trend',
    title: '建筑业存款增长强劲，可加强合作',
    description: '建筑业存款增长10.2%，为各行业最高。随着基建投资加码，该行业存款仍有增长空间，建议加强产业链金融服务。',
    impact: 'medium',
    priority: 5
  },
  {
    type: 'opportunity',
    title: '大额存单客户价值高，建议精细化运营',
    description: '大额存单客户人均15万元，是高价值客户群体。建议建立专属服务体系，交叉销售理财、保险等产品，提升客户综合贡献。',
    impact: 'medium',
    priority: 6
  }
];

interface FinanceQAProps {
  onPin?: (query: string, response: string, category: string) => void;
  onDrillDown?: (config: DrillDownConfig) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function FinanceQA({ onPin, onDrillDown }: FinanceQAProps) {
  const [depositTrendData, setDepositTrendData] = useState(defaultDepositTrendData);
  const [corporateDepositData, setCorporateDepositData] = useState(defaultCorporateDepositData);
  const [depositStructureData, setDepositStructureData] = useState(defaultDepositStructureData);
  const [depositProducts, setDepositProducts] = useState(defaultDepositProducts);
  const [industryDepositData, setIndustryDepositData] = useState(defaultIndustryDepositData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDepositData();
        if (response.success && response.data) {
          // 如果后端返回了对应的数据字段，则更新状态
          if (response.data.trendData) setDepositTrendData(response.data.trendData);
          if (response.data.corporateData) setCorporateDepositData(response.data.corporateData);
          if (response.data.structureData) setDepositStructureData(response.data.structureData);
          if (response.data.productData) setDepositProducts(response.data.productData);
          if (response.data.industryData) setIndustryDepositData(response.data.industryData);
        }
      } catch (error) {
        console.error("Failed to fetch deposit data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <AIInsights 
        insights={depositInsights}
        title="AI存款业务洞察"
        description="实时分析存款规模、结构、成本和客户特征"
      />

      {/* AI Query Section */}
      <MultiRoundAIQuery 
        title="存款业务智能分析"
        placeholder="查询存款余额、增长趋势、产品结构等..."
        exampleQueries={exampleQueries}
        category="存款业务"
        onPin={onPin}
        backendModule="deposit"
        useDataAnalysisApi={true}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">存款总额</p>
                <p className="text-2xl font-semibold text-slate-100 mt-2">¥4,680亿</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">+40亿</span>
                </div>
              </div>
              <Wallet className="w-10 h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">对公存款</p>
                <p className="text-2xl font-semibold text-slate-100 mt-2">¥2,890亿</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-slate-400">占比 61.8%</span>
                </div>
              </div>
              <Building2 className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">零售存款</p>
                <p className="text-2xl font-semibold text-slate-100 mt-2">¥1,790亿</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-slate-400">占比 38.2%</span>
                </div>
              </div>
              <Users className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">综合成本率</p>
                <p className="text-2xl font-semibold text-slate-100 mt-2">1.58%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">-0.05pp</span>
                </div>
              </div>
              <PiggyBank className="w-10 h-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Trend */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">存款增长趋势</CardTitle>
            <CardDescription className="text-slate-400">近6个月对公和零售存款变化（单位：亿元）</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={depositTrendData}>
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
                <Line type="monotone" dataKey="corporate" stroke="#3b82f6" strokeWidth={2} name="对公存款" dot={{ fill: '#3b82f6', r: 4 }} />
                <Line type="monotone" dataKey="retail" stroke="#10b981" strokeWidth={2} name="零售存款" dot={{ fill: '#10b981', r: 4 }} />
                <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} name="存款总额" dot={{ fill: '#f59e0b', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deposit Structure */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">存款结构分布</CardTitle>
            <CardDescription className="text-slate-400">对公vs零售存款占比</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={depositStructureData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {depositStructureData.map((entry, index) => (
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

        {/* Industry Deposit Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">行业存款分布</CardTitle>
            <CardDescription className="text-slate-400">对公存款分行业分析（单位：亿元）</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={industryDepositData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="industry" 
                  stroke="#94a3b8" 
                  style={{ fontSize: '12px' }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Bar dataKey="balance" fill="#3b82f6" radius={[8, 8, 0, 0]} name="存款余额（亿元）" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deposit Products */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">存款产品分析</CardTitle>
            <CardDescription className="text-slate-400">各产品增长对比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {depositProducts.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{product.name}</span>
                    <span className="text-sm text-green-400">+{product.growth}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min(product.growth * 3, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>余额 ¥{product.balance}亿</span>
                    <span>{product.customers}万户 • 人均¥{product.avgAmount}万</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Corporate Deposit Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-100">对公存款结构明细</CardTitle>
              <CardDescription className="text-slate-400">基于核心银行系统数据</CardDescription>
            </div>
            {onDrillDown && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                onClick={() => onDrillDown({
                  type: 'deposit',
                  title: '对公存款明细',
                  description: '对公客户存款账户及交易明细查询',
                  category: '存款业务'
                })}
              >
                查看详情 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-300">存款类型</TableHead>
                <TableHead className="text-slate-300 text-right">余额</TableHead>
                <TableHead className="text-slate-300 text-right">占比</TableHead>
                <TableHead className="text-slate-300 text-right">利率</TableHead>
                <TableHead className="text-slate-300">特点</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {corporateDepositData.map((item, index) => (
                <TableRow key={index} className="border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="text-slate-200">{item.type}</TableCell>
                  <TableCell className="text-right text-slate-200">¥{item.balance}亿</TableCell>
                  <TableCell className="text-right text-slate-200">{item.proportion}%</TableCell>
                  <TableCell className="text-right text-slate-200">{item.rate}%</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={
                        item.type.includes('活期') ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-green-500/20 text-green-400 border-green-500/30'
                      }
                    >
                      {item.type.includes('活期') ? '低成本' : '稳定性强'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Industry Deposit Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">行业存款明细</CardTitle>
          <CardDescription className="text-slate-400">基于对公客户系统数据</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-300">行业</TableHead>
                <TableHead className="text-slate-300 text-right">存款余额</TableHead>
                <TableHead className="text-slate-300 text-right">占比</TableHead>
                <TableHead className="text-slate-300 text-right">增长率</TableHead>
                <TableHead className="text-slate-300 text-right">开户数</TableHead>
                <TableHead className="text-slate-300">趋势</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {industryDepositData.map((industry, index) => (
                <TableRow key={index} className="border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="text-slate-200">{industry.industry}</TableCell>
                  <TableCell className="text-right text-slate-200">¥{industry.balance}亿</TableCell>
                  <TableCell className="text-right text-slate-200">{industry.proportion}%</TableCell>
                  <TableCell className="text-right">
                    <span className={industry.growth >= 8 ? 'text-green-400' : industry.growth > 0 ? 'text-blue-400' : 'text-red-400'}>
                      {industry.growth > 0 ? '+' : ''}{industry.growth}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-slate-200">{industry.accounts.toLocaleString()}</TableCell>
                  <TableCell>
                    {industry.growth >= 8 ? (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-400">快速增长</span>
                      </div>
                    ) : industry.growth > 0 ? (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-blue-400">稳步增长</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-red-400">需关注</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
