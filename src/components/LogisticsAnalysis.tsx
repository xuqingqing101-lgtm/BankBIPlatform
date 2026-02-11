import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { MultiRoundAIQuery } from './MultiRoundAIQuery';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Building2, CreditCard, Activity, Smartphone, UserPlus, ChevronRight } from 'lucide-react';
import { AIInsights, Insight } from './AIInsights';
import { getCustomerData } from '../lib/api';
import { DrillDownConfig } from './DrillDownPage';

// 客户增长趋势数据（单位：万户）
const defaultCustomerGrowthData = [
  { month: '5月', corporate: 27.8, retail: 1820, total: 1847.8 },
  { month: '6月', corporate: 27.9, retail: 1828, total: 1855.9 },
  { month: '7月', corporate: 28.0, retail: 1835, total: 1863.0 },
  { month: '8月', corporate: 28.1, retail: 1842, total: 1870.1 },
  { month: '9月', corporate: 28.2, retail: 1849, total: 1877.2 },
  { month: '10月', corporate: 28.3, retail: 1856, total: 1884.3 },
];

// 对公客户分析（单位：万元）
const defaultCorporateCustomers = [
  { name: '某制造集团', industry: '制造业', deposits: 8520, loans: 12800, rating: 'AAA', relationship: 28 },
  { name: '某房地产公司', industry: '房地产', deposits: 6200, loans: 15600, rating: 'AA', relationship: 35 },
  { name: '某批发企业', industry: '批发零售', deposits: 4800, loans: 8500, rating: 'AAA', relationship: 42 },
  { name: '某基建集团', industry: '基础设施', deposits: 12500, loans: 28000, rating: 'AAA', relationship: 56 },
];

// 零售客户分析
const defaultRetailCustomerSegments = [
  { segment: '财富管理客户', count: 38, aum: 1850, contribution: 32.5, growth: 15.8 },
  { segment: '按揭客户', count: 156, aum: 850, contribution: 28.2, growth: 8.5 },
  { segment: '活跃储户', count: 580, aum: 680, contribution: 22.3, growth: 5.2 },
  { segment: '普通客户', count: 1082, aum: 180, contribution: 17.0, growth: 2.1 },
];

// 客户渠道分布
const defaultChannelData = [
  { name: '手机银行', value: 47.2, color: '#3b82f6' },
  { name: '网点柜面', value: 28.5, color: '#10b981' },
  { name: '网上银行', value: 18.8, color: '#f59e0b' },
  { name: '其他渠道', value: 5.5, color: '#8b5cf6' },
];

// 客户年龄分布
const defaultAgeDistribution = [
  { age: '18-30岁', count: 425, percentage: 23.0 },
  { age: '31-40岁', count: 558, percentage: 30.2 },
  { age: '41-50岁', count: 465, percentage: 25.1 },
  { age: '51-60岁', count: 285, percentage: 15.4 },
  { age: '60岁以上', count: 117, percentage: 6.3 },
];

const exampleQueries = [
  '本月新增了多少客户？',
  '财富管理客户的平均资产是多少？',
  '手机银行的活跃用户占比是多少？',
  '哪些对公客户的存贷比最高？'
];

const customerInsights: Insight[] = [
  {
    type: 'trend',
    title: '客户总量稳步增长，10月突破1880万户',
    description: '近6个月客户总数从1847.8万增至1884.3万，增长36.5万户。零售客户增长2.0%，对公客户增长1.8%，获客渠道健康。',
    impact: 'high',
    priority: 1
  },
  {
    type: 'opportunity',
    title: '财富管理客户价值高，建议加大拓展力度',
    description: '财富管理客户仅占2%，但贡献32.5%的零售收入，人均AUM达48.7万。建议加强高净值客户营销，提升财富管理渗透率。',
    impact: 'high',
    priority: 2
  },
  {
    type: 'trend',
    title: '数字化渠道占比提升，手机银行表现突出',
    description: '手机银行活跃用户占比47.2%，较去年提升8个百分点。建议持续优化数字体验，推动更多业务线上化办理。',
    impact: 'high',
    priority: 3
  },
  {
    type: 'recommendation',
    title: '建议加强中青年客户经营，优化产品结构',
    description: '31-40岁客户占比30.2%，是主力客群。建议针对性推出住房贷款、子女教育、健康保险等产品，提升客户黏性。',
    impact: 'medium',
    priority: 4
  },
  {
    type: 'opportunity',
    title: '对公客户深度经营空间大，可提升综合贡献',
    description: '优质对公客户存贷汇综合贡献高，但中间业务渗透率仅35%。建议推广现金管理、贸易融资、投行服务，提升综合收益。',
    impact: 'medium',
    priority: 5
  },
  {
    type: 'risk',
    title: '老年客户数字化接受度低，需提供差异化服务',
    description: '60岁以上客户占比6.3%，但手机银行使用率仅12%。建议保留传统渠道服务，同时开发适老化产品，满足老年客户需求。',
    impact: 'medium',
    priority: 6
  }
];

interface LogisticsAnalysisProps {
  onPin?: (query: string, response: string, category: string) => void;
  onDrillDown?: (config: DrillDownConfig) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function LogisticsAnalysis({ onPin, onDrillDown }: LogisticsAnalysisProps) {
  const [customerGrowthData, setCustomerGrowthData] = useState(defaultCustomerGrowthData);
  const [corporateCustomers, setCorporateCustomers] = useState(defaultCorporateCustomers);
  const [retailCustomerSegments, setRetailCustomerSegments] = useState(defaultRetailCustomerSegments);
  const [channelData, setChannelData] = useState(defaultChannelData);
  const [ageDistribution, setAgeDistribution] = useState(defaultAgeDistribution);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCustomerData();
        if (response.success && response.data) {
          if (response.data.growthData) setCustomerGrowthData(response.data.growthData);
          if (response.data.corporateData) setCorporateCustomers(response.data.corporateData);
          if (response.data.segmentData) setRetailCustomerSegments(response.data.segmentData);
          if (response.data.channelData) setChannelData(response.data.channelData);
          if (response.data.ageData) setAgeDistribution(response.data.ageData);
        }
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
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
        insights={customerInsights}
        title="AI客户洞察分析"
        description="全方位分析客户结构、价值贡献和增长潜力"
      />

      {/* AI Query Section */}
      <MultiRoundAIQuery 
        title="客户管理智能分析"
        placeholder="查询客户数量、资产规模、活跃度等..."
        exampleQueries={exampleQueries}
        category="客户管理"
        onPin={onPin}
        backendModule="customer"
        useDataAnalysisApi={true}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">客户总数</p>
                <p className="text-2xl font-semibold text-slate-100 mt-2">1,884万</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">+7.1万</span>
                </div>
              </div>
              <Users className="w-10 h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">对公客户</p>
                <p className="text-2xl font-semibold text-slate-100 mt-2">28.3万</p>
                <div className="flex items-center gap-1 mt-2">
                  <Building2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-400">VIP 3200户</span>
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
                <p className="text-sm text-slate-400">零售客户</p>
                <p className="text-2xl font-semibold text-slate-100 mt-2">1,856万</p>
                <div className="flex items-center gap-1 mt-2">
                  <UserPlus className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">+7万</span>
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
                <p className="text-sm text-slate-400">手机银行用户</p>
                <p className="text-2xl font-semibold text-slate-100 mt-2">892万</p>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-400">活跃47%</span>
                </div>
              </div>
              <Smartphone className="w-10 h-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth Trend */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">客户增长趋势</CardTitle>
            <CardDescription className="text-slate-400">近6个月对公和零售客户变化（单位：万户）</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={customerGrowthData}>
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
                <Line type="monotone" dataKey="retail" stroke="#3b82f6" strokeWidth={2} name="零售客户" dot={{ fill: '#3b82f6', r: 4 }} />
                <Line type="monotone" dataKey="corporate" stroke="#10b981" strokeWidth={2} name="对公客户" dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">客户渠道分布</CardTitle>
            <CardDescription className="text-slate-400">各渠道活跃用户占比</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
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

        {/* Age Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">客户年龄分布</CardTitle>
            <CardDescription className="text-slate-400">零售客户年龄结构（单位：万户）</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="age" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} name="客户数（万户）" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Retail Customer Segments */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">零售客户分层价值</CardTitle>
            <CardDescription className="text-slate-400">各层级客户贡献度</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {retailCustomerSegments.map((segment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{segment.segment}</span>
                    <span className="text-sm text-slate-400">{segment.count}万户 • 贡献{segment.contribution}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${segment.contribution}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>AUM: ¥{segment.aum}亿</span>
                    <span className="text-green-400">增长 +{segment.growth}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Corporate Customer Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">重点对公客户分析</CardTitle>
          <CardDescription className="text-slate-400">基于对公客户管理系统数据</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-300">客户名称</TableHead>
                <TableHead className="text-slate-300">所属行业</TableHead>
                <TableHead className="text-slate-300 text-right">存款余额</TableHead>
                <TableHead className="text-slate-300 text-right">贷款余额</TableHead>
                <TableHead className="text-slate-300">信用评级</TableHead>
                <TableHead className="text-slate-300 text-right">合作年限</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {corporateCustomers.map((customer, index) => (
                <TableRow key={index} className="border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="text-slate-200">{customer.name}</TableCell>
                  <TableCell className="text-slate-200">{customer.industry}</TableCell>
                  <TableCell className="text-right text-slate-200">¥{customer.deposits}万</TableCell>
                  <TableCell className="text-right text-slate-200">¥{customer.loans}万</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={
                        customer.rating === 'AAA' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        customer.rating === 'AA' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }
                    >
                      {customer.rating}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-200">{customer.relationship}年</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Retail Customer Segments Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-100">零售客户分层明细</CardTitle>
              <CardDescription className="text-slate-400">基于财富管理系统数据</CardDescription>
            </div>
            {onDrillDown && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                onClick={() => onDrillDown({
                  type: 'customer',
                  title: '零售客户分层',
                  description: '零售客户分层管理、价值贡献及提升策略',
                  category: '客户管理'
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
                <TableHead className="text-slate-300">客户层级</TableHead>
                <TableHead className="text-slate-300 text-right">客户数量</TableHead>
                <TableHead className="text-slate-300 text-right">资产规模</TableHead>
                <TableHead className="text-slate-300 text-right">收入贡献</TableHead>
                <TableHead className="text-slate-300 text-right">同比增长</TableHead>
                <TableHead className="text-slate-300">战略定位</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retailCustomerSegments.map((segment, index) => (
                <TableRow key={index} className="border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="text-slate-200">{segment.segment}</TableCell>
                  <TableCell className="text-right text-slate-200">{segment.count}万户</TableCell>
                  <TableCell className="text-right text-slate-200">¥{segment.aum}亿</TableCell>
                  <TableCell className="text-right text-slate-200">{segment.contribution}%</TableCell>
                  <TableCell className="text-right">
                    <span className={segment.growth >= 10 ? 'text-green-400' : segment.growth >= 5 ? 'text-blue-400' : 'text-yellow-400'}>
                      +{segment.growth}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={
                        segment.growth >= 10 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        segment.growth >= 5 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }
                    >
                      {segment.growth >= 10 ? '重点发展' : segment.growth >= 5 ? '稳健经营' : '维护保有'}
                    </Badge>
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
