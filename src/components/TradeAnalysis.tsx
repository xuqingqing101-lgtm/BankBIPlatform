import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { MultiRoundAIQuery } from './MultiRoundAIQuery';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Building2, Users, CreditCard, BarChart3, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AIInsights, Insight } from './AIInsights';
import { getLoanData } from '../lib/api';
import { DrillDownConfig } from './DrillDownPage';

// 对公贷款数据（单位：亿元）
const defaultCorporateLoanData = [
  { industry: '制造业', balance: 980, rate: 1.28, avgRate: 4.35, proportion: 25.6 },
  { industry: '批发零售', balance: 650, rate: 1.85, avgRate: 4.55, proportion: 17.0 },
  { industry: '房地产', balance: 580, rate: 3.28, avgRate: 4.75, proportion: 15.2 },
  { industry: '基础设施', balance: 520, rate: 0.65, avgRate: 4.15, proportion: 13.6 },
  { industry: '其他', balance: 790, rate: 1.15, avgRate: 4.45, proportion: 20.7 },
];

// 零售贷款数据（单位：亿元）
const defaultRetailLoanData = [
  { type: '个人住房贷款', balance: 850, rate: 0.85, avgRate: 4.10, proportion: 65.4 },
  { type: '消费贷款', balance: 280, rate: 2.15, avgRate: 6.50, proportion: 21.5 },
  { type: '信用卡透支', balance: 170, rate: 2.58, avgRate: 12.50, proportion: 13.1 },
];

// 贷款月度趋势（单位：亿元）
const defaultLoanTrendData = [
  { month: '5月', corporate: 2420, retail: 1250, total: 3670 },
  { month: '6月', corporate: 2485, retail: 1268, total: 3753 },
  { month: '7月', corporate: 2530, retail: 1285, total: 3815 },
  { month: '8月', corporate: 2595, retail: 1295, total: 3890 },
  { month: '9月', corporate: 2640, retail: 1310, total: 3950 },
  { month: '10月', corporate: 2680, retail: 1330, total: 4010 },
];

// 信贷审批数据
const defaultApprovalData = [
  { type: '对公流动资金贷款', applications: 156, approved: 132, rejected: 24, avgDays: 5.2, approvalRate: 84.6 },
  { type: '对公固定资产贷款', applications: 45, approved: 38, rejected: 7, avgDays: 12.5, approvalRate: 84.4 },
  { type: '个人住房贷款', applications: 892, approved: 758, rejected: 134, avgDays: 7.8, approvalRate: 85.0 },
  { type: '个人消费贷款', applications: 1256, approved: 1045, rejected: 211, avgDays: 2.3, approvalRate: 83.2 },
];

// 网点业务数据
const defaultBranchData = [
  { branch: '市中心支行', loanVolume: 285, deposits: 520, customers: 8560, efficiency: 95, rating: '优秀' },
  { branch: '高新区支行', loanVolume: 210, deposits: 380, customers: 6240, efficiency: 88, rating: '良好' },
  { branch: '开发区支行', loanVolume: 195, deposits: 420, customers: 5890, efficiency: 92, rating: '优秀' },
  { branch: '老城区支行', loanVolume: 165, deposits: 450, customers: 9320, efficiency: 85, rating: '良好' },
];

const exampleQueries = [
  '哪些行业的对公贷款不良率最高？',
  '个人住房贷款的平均审批时间是多少？',
  '本月零售贷款增长了多少？',
  '各网点的贷款投放量排名如何？'
];

const loanInsights: Insight[] = [
  {
    type: 'risk',
    title: '房地产行业不良率3.28%，需加强风险管控',
    description: '房地产行业对公贷款不良率达3.28%，远高于全行平均1.35%。建议收紧房地产授信政策，加强贷后管理，对高风险项目及时预警。',
    impact: 'high',
    priority: 1
  },
  {
    type: 'trend',
    title: '贷款规模稳步增长，10月突破4000亿大关',
    description: '近6个月贷款总额从3670亿增至4010亿，增长9.3%。对公贷款增长10.7%，零售贷款增长6.4%，结构合理，增长健康。',
    impact: 'high',
    priority: 2
  },
  {
    type: 'opportunity',
    title: '基础设施贷款质量优良，可适当扩大投放',
    description: '基础设施行业不良率仅0.65%，为所有行业最低，且利率水平适中。建议加大基建项目贷款投放，优化资产结构。',
    impact: 'high',
    priority: 3
  },
  {
    type: 'recommendation',
    title: '建议提升信贷审批效率，缩短审批周期',
    description: '对公固定资产贷款平均审批时间12.5天，略长。建议优化审批流程，引入智能风控模型，在风险可控前提下提升审批效率。',
    impact: 'medium',
    priority: 4
  },
  {
    type: 'trend',
    title: '个人消费贷款增长迅速，需关注风险',
    description: '消费贷款不良率2.15%，高于住房贷款0.85%。虽然利润贡献较高，但需加强反欺诈和风险定价能力，防范共债风险。',
    impact: 'medium',
    priority: 5
  },
  {
    type: 'opportunity',
    title: '市中心支行表现突出，可作为标杆推广',
    description: '市中心支行贷款投放285亿，客户满意度95%，评级优秀。建议总结经验，在其他网点推广高效服务模式。',
    impact: 'medium',
    priority: 6
  }
];

interface TradeAnalysisProps {
  onPin?: (query: string, response: string, category: string) => void;
  onDrillDown?: (config: DrillDownConfig) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function TradeAnalysis({ onPin, onDrillDown }: TradeAnalysisProps) {
  const [corporateLoanData, setCorporateLoanData] = useState(defaultCorporateLoanData);
  const [retailLoanData, setRetailLoanData] = useState(defaultRetailLoanData);
  const [loanTrendData, setLoanTrendData] = useState(defaultLoanTrendData);
  const [approvalData, setApprovalData] = useState(defaultApprovalData);
  const [branchData, setBranchData] = useState(defaultBranchData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLoanData();
        if (response.success && response.data) {
          if (response.data.corporateData) setCorporateLoanData(response.data.corporateData);
          if (response.data.retailData) setRetailLoanData(response.data.retailData);
          if (response.data.trendData) setLoanTrendData(response.data.trendData);
          if (response.data.approvalData) setApprovalData(response.data.approvalData);
          if (response.data.branchData) setBranchData(response.data.branchData);
        }
      } catch (error) {
        console.error("Failed to fetch loan data:", error);
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
        insights={loanInsights}
        title="AI贷款风险分析"
        description="实时监控对公贷款、零售贷款质量和审批效率"
      />

      <Tabs defaultValue="corporate" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="corporate">对公贷款</TabsTrigger>
          <TabsTrigger value="retail">零售贷款</TabsTrigger>
          <TabsTrigger value="approval">信贷审批</TabsTrigger>
          <TabsTrigger value="branch">网点运营</TabsTrigger>
        </TabsList>

        {/* 对公贷款 */}
        <TabsContent value="corporate" className="space-y-6">
          <MultiRoundAIQuery 
            title="对公贷款智能分析"
            placeholder="查询对公贷款余额、行业分布、不良率等..."
            exampleQueries={exampleQueries}
            category="贷款业务"
            onPin={onPin}
            backendModule="loan"
            useDataAnalysisApi={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">对公贷款余额</p>
                    <p className="text-2xl font-semibold text-slate-100 mt-2">¥2,680亿</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">+10.7%</span>
                    </div>
                  </div>
                  <Building2 className="w-10 h-10 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">平均不良率</p>
                    <p className="text-2xl font-semibold text-slate-100 mt-2">1.28%</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-sm text-slate-400">行业平均</span>
                    </div>
                  </div>
                  <BarChart3 className="w-10 h-10 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">授信客户数</p>
                    <p className="text-2xl font-semibold text-slate-100 mt-2">8.5万户</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">+3.2%</span>
                    </div>
                  </div>
                  <Users className="w-10 h-10 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">平均利率</p>
                    <p className="text-2xl font-semibold text-slate-100 mt-2">4.45%</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-sm text-slate-400">加权平均</span>
                    </div>
                  </div>
                  <CreditCard className="w-10 h-10 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100">分行业贷款分析</CardTitle>
                  <CardDescription className="text-slate-400">基于信贷系统的对公贷款数据</CardDescription>
                </div>
                {onDrillDown && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    onClick={() => onDrillDown({
                      type: 'loan',
                      title: '对公贷款行业分析',
                      description: '分行业贷款余额、不良率及风险状况深度分析',
                      category: '贷款业务'
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
                    <TableHead className="text-slate-300">行业</TableHead>
                    <TableHead className="text-slate-300 text-right">贷款余额</TableHead>
                    <TableHead className="text-slate-300 text-right">占比</TableHead>
                    <TableHead className="text-slate-300 text-right">不良率</TableHead>
                    <TableHead className="text-slate-300 text-right">平均利率</TableHead>
                    <TableHead className="text-slate-300">风险等级</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {corporateLoanData.map((item, index) => (
                    <TableRow key={index} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="text-slate-200">{item.industry}</TableCell>
                      <TableCell className="text-right text-slate-200">¥{item.balance}亿</TableCell>
                      <TableCell className="text-right text-slate-200">{item.proportion}%</TableCell>
                      <TableCell className="text-right">
                        <span className={item.rate > 2.5 ? 'text-red-400' : item.rate > 1.5 ? 'text-yellow-400' : 'text-green-400'}>
                          {item.rate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-slate-200">{item.avgRate}%</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={
                            item.rate > 2.5 ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            item.rate > 1.5 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            'bg-green-500/20 text-green-400 border-green-500/30'
                          }
                        >
                          {item.rate > 2.5 ? '高风险' : item.rate > 1.5 ? '中风险' : '低风险'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 零售贷款 */}
        <TabsContent value="retail" className="space-y-6">
          <MultiRoundAIQuery 
            title="零售贷款智能分析"
            placeholder="查询个人住房贷款、消费贷款、信用卡等..."
            exampleQueries={['个人住房贷款不良率是多少？', '消费贷款增长趋势如何？']}
            category="贷款业务"
            onPin={onPin}
            backendModule="loan"
            useDataAnalysisApi={true}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">零售贷款结构</CardTitle>
                <CardDescription className="text-slate-400">各产品余额占比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={retailLoanData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ type, proportion }) => `${type.replace('个人', '').replace('贷款', '')} ${proportion}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="proportion"
                    >
                      {retailLoanData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">零售贷款质量分析</CardTitle>
                <CardDescription className="text-slate-400">分产品不良率对比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {retailLoanData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{item.type}</span>
                        <span className={`text-sm font-medium ${
                          item.rate > 2 ? 'text-red-400' : 
                          item.rate > 1 ? 'text-yellow-400' : 
                          'text-green-400'
                        }`}>
                          不良率 {item.rate}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.rate > 2 ? 'bg-red-500' : 
                            item.rate > 1 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${(item.rate / 3) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>余额 ¥{item.balance}亿</span>
                        <span>利率 {item.avgRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">零售贷款产品明细</CardTitle>
              <CardDescription className="text-slate-400">基于零售信贷系统数据</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/50">
                    <TableHead className="text-slate-300">产品类型</TableHead>
                    <TableHead className="text-slate-300 text-right">贷款余额</TableHead>
                    <TableHead className="text-slate-300 text-right">占比</TableHead>
                    <TableHead className="text-slate-300 text-right">不良率</TableHead>
                    <TableHead className="text-slate-300 text-right">平均利率</TableHead>
                    <TableHead className="text-slate-300">质量评级</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retailLoanData.map((item, index) => (
                    <TableRow key={index} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="text-slate-200">{item.type}</TableCell>
                      <TableCell className="text-right text-slate-200">¥{item.balance}亿</TableCell>
                      <TableCell className="text-right text-slate-200">{item.proportion}%</TableCell>
                      <TableCell className="text-right">
                        <span className={item.rate > 2 ? 'text-red-400' : item.rate > 1 ? 'text-yellow-400' : 'text-green-400'}>
                          {item.rate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-slate-200">{item.avgRate}%</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={
                            item.rate > 2 ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            item.rate > 1 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            'bg-green-500/20 text-green-400 border-green-500/30'
                          }
                        >
                          {item.rate > 2 ? '需关注' : item.rate > 1 ? '良好' : '优秀'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 信贷审批 */}
        <TabsContent value="approval" className="space-y-6">
          <MultiRoundAIQuery 
            title="信贷审批智能分析"
            placeholder="查询审批效率、通过率、平均时长等..."
            exampleQueries={['本月个人住房贷款审批通过率是多少？', '哪类贷款审批时间最长？']}
            category="贷款业务"
            onPin={onPin}
            backendModule="loan"
            useDataAnalysisApi={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: '本月申请', value: '2,349笔', change: '+8.5%', trend: 'up' },
              { label: '审批通过', value: '1,973笔', change: '+7.2%', trend: 'up' },
              { label: '平均通过率', value: '84.0%', change: '-0.5%', trend: 'down' },
              { label: '平均审批时长', value: '5.8天', change: '-0.3天', trend: 'up' },
            ].map((kpi, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <p className="text-sm text-slate-400">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-slate-100 mt-2">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {kpi.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">审批效率分析</CardTitle>
              <CardDescription className="text-slate-400">基于信贷审批系统数据</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/50">
                    <TableHead className="text-slate-300">贷款类型</TableHead>
                    <TableHead className="text-slate-300 text-right">申请笔数</TableHead>
                    <TableHead className="text-slate-300 text-right">通过笔数</TableHead>
                    <TableHead className="text-slate-300 text-right">拒绝笔数</TableHead>
                    <TableHead className="text-slate-300 text-right">通过率</TableHead>
                    <TableHead className="text-slate-300 text-right">平均时长</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalData.map((item, index) => (
                    <TableRow key={index} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="text-slate-200">{item.type}</TableCell>
                      <TableCell className="text-right text-slate-200">{item.applications}</TableCell>
                      <TableCell className="text-right text-green-400">{item.approved}</TableCell>
                      <TableCell className="text-right text-red-400">{item.rejected}</TableCell>
                      <TableCell className="text-right">
                        <span className={item.approvalRate >= 85 ? 'text-green-400' : 'text-yellow-400'}>
                          {item.approvalRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-slate-200">{item.avgDays}天</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">审批流程优化建议</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-slate-100 text-sm font-medium">个人消费贷款效率高</p>
                      <p className="text-xs text-slate-400 mt-1">平均2.3天完成审批，建议作为标杆推广智能化审批经验</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-slate-100 text-sm font-medium">固定资产贷款审批慢</p>
                      <p className="text-xs text-slate-400 mt-1">平均12.5天，建议优化尽调流程，引入在线评估工具</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-slate-100 text-sm font-medium">整体通过率稳定</p>
                      <p className="text-xs text-slate-400 mt-1">平均通过率84%，风控标准把握合理，业务质量良好</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">审批拒绝原因分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { reason: '征信不良', count: 128, percentage: 34.0 },
                    { reason: '收入不足', count: 95, percentage: 25.2 },
                    { reason: '负债率过高', count: 76, percentage: 20.2 },
                    { reason: '材料不全', count: 48, percentage: 12.7 },
                    { reason: '其他原因', count: 29, percentage: 7.9 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{item.reason}</span>
                        <span className="text-sm text-slate-400">{item.count}笔 ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 网点运营 */}
        <TabsContent value="branch" className="space-y-6">
          <MultiRoundAIQuery 
            title="网点运营智能分析"
            placeholder="查询网点贷款投放、存款余额、客户数等..."
            exampleQueries={['哪个网点的贷款投放量最大？', '各网点的客户满意度排名如何？']}
            category="贷款业务"
            onPin={onPin}
            backendModule="loan"
            useDataAnalysisApi={true}
          />

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100">网点月度趋势</CardTitle>
                  <CardDescription className="text-slate-400">对公和零售贷款投放趋势</CardDescription>
                </div>
                {onDrillDown && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    onClick={() => onDrillDown({
                      type: 'loan',
                      title: '贷款投放趋势',
                      description: '全行及各网点贷款投放月度变化趋势',
                      category: '贷款业务'
                    })}
                  >
                    查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={loanTrendData}>
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
                  <Line type="monotone" dataKey="corporate" stroke="#3b82f6" strokeWidth={2} name="对公贷款（亿元）" dot={{ fill: '#3b82f6', r: 4 }} />
                  <Line type="monotone" dataKey="retail" stroke="#10b981" strokeWidth={2} name="零售贷款（亿元）" dot={{ fill: '#10b981', r: 4 }} />
                  <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} name="贷款总额（亿元）" dot={{ fill: '#f59e0b', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">网点业绩排名</CardTitle>
              <CardDescription className="text-slate-400">基于核心银行系统数据</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/50">
                    <TableHead className="text-slate-300">网点名称</TableHead>
                    <TableHead className="text-slate-300 text-right">贷款投放</TableHead>
                    <TableHead className="text-slate-300 text-right">存款余额</TableHead>
                    <TableHead className="text-slate-300 text-right">客户数</TableHead>
                    <TableHead className="text-slate-300 text-right">满意度</TableHead>
                    <TableHead className="text-slate-300">综合评级</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branchData.map((branch, index) => (
                    <TableRow key={index} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="text-slate-200">{branch.branch}</TableCell>
                      <TableCell className="text-right text-slate-200">¥{branch.loanVolume}亿</TableCell>
                      <TableCell className="text-right text-slate-200">¥{branch.deposits}亿</TableCell>
                      <TableCell className="text-right text-slate-200">{branch.customers.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={branch.efficiency >= 90 ? 'text-green-400' : 'text-yellow-400'}>
                          {branch.efficiency}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={
                            branch.rating === '优秀' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }
                        >
                          {branch.rating}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
