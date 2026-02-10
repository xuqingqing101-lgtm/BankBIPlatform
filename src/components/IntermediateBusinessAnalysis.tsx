import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { MultiRoundAIQuery } from './MultiRoundAIQuery';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, CreditCard, PiggyBank, Send, DollarSign, Users, ArrowUpRight, ChevronRight } from 'lucide-react';
import { AIInsights, Insight } from './AIInsights';
import { getIntermediateData } from '../lib/api';
import { DrillDownConfig } from './DrillDownPage';

// 中间业务收入趋势（单位：亿元）
const defaultIntermediateRevenueData = [
  { month: '5月', card: 4.2, wealth: 3.8, remittance: 2.5, agency: 1.8, total: 12.3 },
  { month: '6月', card: 4.5, wealth: 4.1, remittance: 2.6, agency: 1.9, total: 13.1 },
  { month: '7月', card: 4.8, wealth: 4.3, remittance: 2.8, agency: 2.0, total: 13.9 },
  { month: '8月', card: 5.1, wealth: 4.6, remittance: 2.9, agency: 2.1, total: 14.7 },
  { month: '9月', card: 5.4, wealth: 4.9, remittance: 3.1, agency: 2.2, total: 15.6 },
  { month: '10月', card: 5.8, wealth: 5.2, remittance: 3.3, agency: 2.3, total: 16.6 },
];

// 银行卡业务数据
const defaultCardBusinessData = [
  { type: '借记卡', issued: 485, active: 352, transactions: 1850, fee: 3.2 },
  { type: '信用卡', issued: 128, active: 95, transactions: 680, fee: 2.6 },
];

// 理财产品销售数据（单位：亿元）
const defaultWealthProductData = [
  { product: '稳健型理财', balance: 158, customers: 28500, avgAmount: 5.54, growth: 12.5 },
  { product: '平衡型理财', balance: 85, customers: 12800, avgAmount: 6.64, growth: 18.2 },
  { product: '进取型理财', balance: 42, customers: 5200, avgAmount: 8.08, growth: 22.8 },
  { product: '货币基金', balance: 68, customers: 45600, avgAmount: 1.49, growth: 8.5 },
];

// 汇款业务数据
const defaultRemittanceData = [
  { type: '国内汇款', volume: 152000, amount: 285, fee: 2.1, avgFee: 138 },
  { type: '国际汇款', volume: 8500, amount: 95, fee: 1.2, avgFee: 1412 },
];

// 中间业务收入结构
const defaultRevenueStructureData = [
  { name: '银行卡', value: 35.0, color: '#3b82f6' },
  { name: '理财产品', value: 31.3, color: '#10b981' },
  { name: '汇款结算', value: 19.9, color: '#f59e0b' },
  { name: '代理业务', value: 13.8, color: '#8b5cf6' },
];

// 代理业务数据
const defaultAgencyBusinessData = [
  { type: '代理保险', income: 0.85, growth: 15.2 },
  { type: '代理基金', income: 0.68, growth: 22.5 },
  { type: '代收代付', income: 0.52, growth: 8.8 },
  { type: '其他代理', income: 0.25, growth: 5.2 },
];

const exampleQueries = [
  '本月中间业务收入是多少？',
  '理财产品销售情况如何？',
  '银行卡手续费收入增长了多少？',
  '国际汇款业务的平均手续费是多少？'
];

const intermediateInsights: Insight[] = [
  {
    type: 'trend',
    title: '中间业务收入快速增长，10月突破16亿',
    description: '近6个月中间业务收入从12.3亿增至16.6亿，增长34.9%。银行卡、理财、汇款业务全面增长，收入结构持续优化。',
    impact: 'high',
    priority: 1
  },
  {
    type: 'opportunity',
    title: '理财产品增长强劲，建议加大产品创新',
    description: '理财产品收入增长36.8%，进取型产品增速最快达22.8%。客户风险偏好提升，建议丰富产品线，满足多元化需求。',
    impact: 'high',
    priority: 2
  },
  {
    type: 'trend',
    title: '银行卡业务贡献最大，活跃率持续提升',
    description: '银行卡收入占中间业务35%，借记卡活跃率72.6%，信用卡活跃率74.2%。交易笔数增长显著，建议优化积分权益体系。',
    impact: 'high',
    priority: 3
  },
  {
    type: 'recommendation',
    title: '建议拓展国际汇款业务，提升手续费收入',
    description: '国际汇款平均手续费1412元，远高于国内汇款138元。随着跨境贸易增长，建议加强外汇服务能力，拓展国际业务。',
    impact: 'medium',
    priority: 4
  },
  {
    type: 'opportunity',
    title: '代理基金业务增长迅速，可深化合作',
    description: '代理基金收入增长22.5%，为代理业务最高。建议与优质基金公司深化合作，推出专属产品，提升客户黏性。',
    impact: 'medium',
    priority: 5
  },
  {
    type: 'recommendation',
    title: '建议加强财富管理团队建设，提升专业能力',
    description: '理财产品销售额285亿，但人均产能偏低。建议加强理财经理培训，引入智能投顾系统，提升服务效率和质量。',
    impact: 'medium',
    priority: 6
  }
];

interface IntermediateBusinessAnalysisProps {
  onPin?: (query: string, response: string, category: string) => void;
  onDrillDown?: (config: DrillDownConfig) => void;
}

export function IntermediateBusinessAnalysis({ onPin, onDrillDown }: IntermediateBusinessAnalysisProps) {
  const [intermediateRevenueData, setIntermediateRevenueData] = useState(defaultIntermediateRevenueData);
  const [cardBusinessData, setCardBusinessData] = useState(defaultCardBusinessData);
  const [wealthProductData, setWealthProductData] = useState(defaultWealthProductData);
  const [remittanceData, setRemittanceData] = useState(defaultRemittanceData);
  const [revenueStructureData, setRevenueStructureData] = useState(defaultRevenueStructureData);
  const [agencyBusinessData, setAgencyBusinessData] = useState(defaultAgencyBusinessData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getIntermediateData();
        if (response.success && response.data) {
          if (response.data.revenueData) setIntermediateRevenueData(response.data.revenueData);
          if (response.data.cardData) setCardBusinessData(response.data.cardData);
          if (response.data.wealthData) setWealthProductData(response.data.wealthData);
          if (response.data.remittanceData) setRemittanceData(response.data.remittanceData);
          if (response.data.structureData) setRevenueStructureData(response.data.structureData);
          if (response.data.agencyData) setAgencyBusinessData(response.data.agencyData);
        }
      } catch (error) {
        console.error("Failed to fetch intermediate data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleQuery = (query: string): string => {

    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('收入') || lowerQuery.includes('手续费')) {
      return `根据中间业务系统数据，本月中间业务收入情况如下：\n\n💰 **总体收入**\n\n• 中间业务总收入：16.6亿元\n• 环比增长：6.4%\n• 同比增长：34.9%\n• 占营业收入比：12.6%\n\n📊 **收入结构**\n\n1️⃣ 银行卡业务：5.8亿（35.0%）\n2️⃣ 理财产品：5.2亿（31.3%）\n3️⃣ 汇款结算：3.3亿（19.9%）\n4️⃣ 代理业务：2.3亿（13.8%）\n\n📈 **增长亮点**\n\n• 银行卡收入增长38.1%\n• 理财产品增长36.8%\n• 国际汇款增长32.0%\n• 代理基金增长22.5%\n\n💡 **业务建议**\n中间业务收入快速增长，建议持续优化产品结构，加强财富管理和国际业务拓展，提升非息收入占比。`;
    }
    
    if (lowerQuery.includes('理财') || lowerQuery.includes('财富')) {
      return `根据财富管理系统数据，理财产品销售情况如下：\n\n💼 **理财规模**\n\n• 理财总规模：285亿元\n• 环比增长：6.5%\n• 客户总数：9.21万户\n• 人均持有：30.9万元\n\n📊 **产品结构**\n\n1️⃣ 稳健型理财：158亿（55.4%）\n   • 客户：2.85万户\n   • 增长率：12.5%\n\n2️⃣ 平衡型理财：85亿（29.8%）\n   • 客户：1.28万户\n   • 增长率：18.2%\n\n3️⃣ 进取型理财：42亿（14.7%）\n   • 客户：0.52万户\n   • 增长率：22.8%\n\n4️⃣ 货币基金：68亿\n   • 客户：4.56万户\n   • 增长率：8.5%\n\n💡 **客户偏好**\n\n• 稳健型产品占比最高，适合大众客户\n• 进取型产品增速最快，高净值客户需求旺盛\n• 建议丰富产品线，满足不同风险偏好\n\n🎯 **营销建议**\n加强财富管理团队建设，推出差异化产品，提升客户理财渗透率。`;
    }
    
    if (lowerQuery.includes('银行卡') || lowerQuery.includes('信用卡') || lowerQuery.includes('借记卡')) {
      return `根据银行卡系统数据，银行卡业务情况如下：\n\n💳 **发卡情况**\n\n• 借记卡发卡量：485万张\n   • 活跃卡数：352万张\n   • 活跃率：72.6%\n\n• 信用卡发卡量：128万张\n   • 活跃卡数：95万张\n   • 活跃率：74.2%\n\n📊 **交易数据**\n\n• 借记卡交易笔数：1850万笔\n• 信用卡交易笔数：680万笔\n• 合计交易笔数：2530万笔\n• 环比增长：8.2%\n\n💰 **手续费收入**\n\n• 借记卡手续费：3.2亿元\n• 信用卡手续费：2.6亿元\n• 合计收入：5.8亿元\n• 同比增长：38.1%\n\n🎯 **业务特点**\n\n• 信用卡活跃率略高于借记卡\n• 交易笔数持续增长，客户活跃度高\n• 手续费收入增长显著\n\n💡 **优化建议**\n建议优化积分权益体系，推出联名卡产品，提升客户使用频次和黏性。`;
    }
    
    if (lowerQuery.includes('汇款') || lowerQuery.includes('结算')) {
      return `根据结算系统数据，汇款业务情况如下：\n\n🌏 **国内汇款**\n\n• 交易笔数：15.2万笔\n• 交易金额：285亿元\n• 手续费收入：2.1亿元\n• 平均手续费：138元/笔\n\n✈️ **国际汇款**\n\n• 交易笔数：0.85万笔\n• 交易金额：95亿元\n• 手续费收入：1.2亿元\n• 平均手续费：1412元/笔\n\n📊 **业务对比**\n\n• 国际汇款手续费单价是国内的10.2倍\n• 国际汇款收入占比36.4%\n• 跨境业务增长空间大\n\n💰 **收入贡献**\n\n• 汇款总收入：3.3亿元\n• 环比增长：6.5%\n• 占中间业务收入：19.9%\n\n💡 **业务建议**\n国际汇款单价高、利润贡献大，建议加强外汇服务能力，拓展跨境电商、留学等场景，提升国际业务占比。`;
    }
    
    if (lowerQuery.includes('代理') || lowerQuery.includes('保险') || lowerQuery.includes('基金')) {
      return `根据代理业务系统数据，代理业务情况如下：\n\n📋 **代理业务收入**\n\n• 总收入：2.3亿元\n• 环比增长：4.5%\n• 占中间业务收入：13.8%\n\n💼 **业务明细**\n\n1️⃣ 代理保险\n   • 收入：0.85亿元\n   • 增长率：15.2%\n   • 占比：37.0%\n\n2️⃣ 代理基金\n   • 收入：0.68亿元\n   • 增长率：22.5%（最高）\n   • 占比：29.6%\n\n3️⃣ 代收代付\n   • 收入：0.52亿元\n   • 增长率：8.8%\n   • 占比：22.6%\n\n4️⃣ 其他代理\n   • 收入：0.25亿元\n   • 增长率：5.2%\n   • 占比：10.9%\n\n📈 **增长亮点**\n\n• 代理基金增长最快，达22.5%\n• 代理保险收入规模最大\n• 代收代付业务稳定\n\n💡 **发展建议**\n建议与优质基金、保险公司深化合作，推出专属产品，加强交叉销售，提升代理业务收入占比。`;
    }
    
    return `我可以帮您查询以下中间业务相关信息：\n\n💳 **银行卡业务**\n• 发卡量、活跃率、交易笔数\n• 手续费收入情况\n• 信用卡、借记卡对比分析\n\n💼 **理财产品**\n• 理财规模、客户数量\n• 产品结构、收益情况\n• 各类型产品增长趋势\n\n🌏 **汇款结算**\n• 国内汇款、国际汇款\n• 交易笔数、手续费收入\n• 跨境业务发展情况\n\n📋 **代理业务**\n• 代理保险、代理基金\n• 代收代付、其他代理\n• 各业务线收入贡献\n\n请告诉我您想了解哪方面的详细信息！`;
  };

  return (
    <div className="space-y-6">
      {/* AI洞察 */}
      <AIInsights insights={intermediateInsights} />

      {/* AI智能问答 */}
      <MultiRoundAIQuery
        title="中间业务智能分析"
        description="询问银行卡、理财、汇款、代理等中间业务相关问题"
        category="中间业务"
        exampleQueries={exampleQueries}
        onPin={onPin}
        backendModule="intermediate"
        useDataAnalysisApi={true}
      />

      {/* 中间业务收入趋势 */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">中间业务收入趋势</CardTitle>
              <CardDescription>近6个月各业务线收入变化（单位：亿元）</CardDescription>
            </div>
            {onDrillDown && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                onClick={() => onDrillDown({
                  type: 'business',
                  title: '中间业务收入分析',
                  description: '中间业务各板块收入增长趋势及结构分析',
                  category: '中间业务'
                })}
              >
                查看详情 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={intermediateRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="card" stroke="#3b82f6" name="银行卡" strokeWidth={2} />
              <Line type="monotone" dataKey="wealth" stroke="#10b981" name="理财产品" strokeWidth={2} />
              <Line type="monotone" dataKey="remittance" stroke="#f59e0b" name="汇款结算" strokeWidth={2} />
              <Line type="monotone" dataKey="agency" stroke="#8b5cf6" name="代理业务" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 收入结构和银行卡业务 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 中间业务收入结构 */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">收入结构</CardTitle>
                <CardDescription>本月中间业务收入构成</CardDescription>
              </div>
              {onDrillDown && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => onDrillDown({
                    type: 'business',
                    title: '收入结构分析',
                    description: '中间业务收入贡献占比及变化分析',
                    category: '中间业务'
                  })}
                >
                  查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueStructureData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueStructureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 银行卡业务 */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  银行卡业务
                </CardTitle>
                <CardDescription>发卡量和活跃度情况</CardDescription>
              </div>
              {onDrillDown && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => onDrillDown({
                    type: 'business',
                    title: '银行卡业务分析',
                    description: '信用卡、借记卡发卡及交易情况分析',
                    category: '中间业务'
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
                <TableRow className="border-slate-700 hover:bg-slate-700/30">
                  <TableHead className="text-slate-300">卡类型</TableHead>
                  <TableHead className="text-slate-300 text-right">发卡量(万)</TableHead>
                  <TableHead className="text-slate-300 text-right">活跃率</TableHead>
                  <TableHead className="text-slate-300 text-right">手续费(亿)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cardBusinessData.map((card) => (
                  <TableRow key={card.type} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="text-white">{card.type}</TableCell>
                    <TableCell className="text-right text-slate-300">{card.issued}</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {((card.active / card.issued) * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-slate-300">¥{card.fee}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 理财产品销售 */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-green-400" />
            理财产品销售
          </CardTitle>
          <CardDescription>各类型理财产品销售情况</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/30">
                <TableHead className="text-slate-300">产品名称</TableHead>
                <TableHead className="text-slate-300 text-right">余额(亿)</TableHead>
                <TableHead className="text-slate-300 text-right">客户数</TableHead>
                <TableHead className="text-slate-300 text-right">人均(万)</TableHead>
                <TableHead className="text-slate-300 text-right">增长率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wealthProductData.map((product) => (
                <TableRow key={product.product} className="border-slate-700 hover:bg-slate-700/30">
                  <TableCell className="text-white">{product.product}</TableCell>
                  <TableCell className="text-right text-slate-300">¥{product.balance}</TableCell>
                  <TableCell className="text-right text-slate-300">{product.customers.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-slate-300">{product.avgAmount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">{product.growth}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 汇款业务和代理业务 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 汇款业务 */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-orange-400" />
              汇款业务
            </CardTitle>
            <CardDescription>国内和国际汇款情况</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-700/30">
                  <TableHead className="text-slate-300">类型</TableHead>
                  <TableHead className="text-slate-300 text-right">笔数</TableHead>
                  <TableHead className="text-slate-300 text-right">金额(亿)</TableHead>
                  <TableHead className="text-slate-300 text-right">手续费(亿)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {remittanceData.map((item) => (
                  <TableRow key={item.type} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="text-white">{item.type}</TableCell>
                    <TableCell className="text-right text-slate-300">{item.volume.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-slate-300">¥{item.amount}</TableCell>
                    <TableCell className="text-right text-slate-300">¥{item.fee}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 代理业务 */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  代理业务
                </CardTitle>
                <CardDescription>各类代理业务收入情况</CardDescription>
              </div>
              {onDrillDown && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => onDrillDown({
                    type: 'business',
                    title: '代理业务分析',
                    description: '保险、基金等代理业务收入增长分析',
                    category: '中间业务'
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
                <TableRow className="border-slate-700 hover:bg-slate-700/30">
                  <TableHead className="text-slate-300">业务类型</TableHead>
                  <TableHead className="text-slate-300 text-right">收入(亿)</TableHead>
                  <TableHead className="text-slate-300 text-right">增长率</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agencyBusinessData.map((item) => (
                  <TableRow key={item.type} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="text-white">{item.type}</TableCell>
                    <TableCell className="text-right text-slate-300">¥{item.income}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">{item.growth}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
