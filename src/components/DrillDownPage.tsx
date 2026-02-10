import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { MultiRoundAIQuery } from './MultiRoundAIQuery';

export interface DrillDownConfig {
  type: 'asset' | 'deposit' | 'loan' | 'profit' | 'risk' | 'business' | 'customer';
  title: string;
  description: string;
  category: string;
}

interface DrillDownPageProps {
  config: DrillDownConfig;
  onBack: () => void;
  onPin?: (query: string, response: string, category: string) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

// 资产详细数据
const assetDetailData = {
  trend: [
    { month: '1月', 贷款: 3.65, 债券: 0.98, 同业: 0.52, 现金: 0.28, 总资产: 5.43 },
    { month: '2月', 贷款: 3.68, 债券: 0.99, 同业: 0.51, 现金: 0.29, 总资产: 5.47 },
    { month: '3月', 贷款: 3.72, 债券: 1.01, 同业: 0.53, 现金: 0.27, 总资产: 5.53 },
    { month: '4月', 贷款: 3.75, 债券: 1.02, 同业: 0.54, 现金: 0.28, 总资产: 5.59 },
    { month: '5月', 贷款: 3.78, 债券: 1.05, 同业: 0.52, 现金: 0.29, 总资产: 5.64 },
    { month: '6月', 贷款: 3.82, 债券: 1.18, 同业: 0.59, 现金: 0.30, 总资产: 5.89 },
  ],
  distribution: [
    { name: '对公贷款', value: 55.2, color: '#3b82f6' },
    { name: '零售贷款', value: 30.5, color: '#10b981' },
    { name: '票据贴现', value: 14.3, color: '#f59e0b' },
  ],
  industry: [
    { name: '制造业', amount: 8520, ratio: 22.3, npl: 1.45, id: 'manufacturing' },
    { name: '房地产', amount: 7680, ratio: 20.1, npl: 2.18, id: 'realestate' },
    { name: '批发零售', amount: 5430, ratio: 14.2, npl: 1.32, id: 'wholesale' },
    { name: '基础设施', amount: 4890, ratio: 12.8, npl: 0.89, id: 'infrastructure' },
    { name: '个人住房', amount: 6520, ratio: 17.1, npl: 0.52, id: 'housing' },
    { name: '消费贷款', amount: 3210, ratio: 8.4, npl: 1.68, id: 'consumer' },
    { name: '其他', amount: 1850, ratio: 4.8, npl: 1.15, id: 'others' },
  ],
  quality: [
    { level: '正常', amount: 37580, ratio: 98.35 },
    { level: '关注', amount: 345, ratio: 0.90 },
    { level: '次级', amount: 168, ratio: 0.44 },
    { level: '可疑', amount: 95, ratio: 0.25 },
    { level: '损失', amount: 12, ratio: 0.03 },
  ],
  kpis: [
    { label: '总资产', value: '5.89万亿', change: '+6.8%', trend: 'up' },
    { label: '贷款总额', value: '3.82万亿', change: '+10.2%', trend: 'up' },
    { label: '不良率', value: '1.35%', change: '+0.07%', trend: 'down' },
    { label: '拨备覆盖率', value: '285%', change: '+12%', trend: 'up' },
  ]
};

// 存款详细数据
const depositDetailData = {
  trend: [
    { month: '1月', 对公: 2.85, 零售: 1.48, 总存款: 4.33 },
    { month: '2月', 对公: 2.82, 零售: 1.51, 总存款: 4.33 },
    { month: '3月', 对公: 2.91, 零售: 1.53, 总存款: 4.44 },
    { month: '4月', 对公: 2.88, 零售: 1.55, 总存款: 4.43 },
    { month: '5月', 对公: 2.95, 零售: 1.58, 总存款: 4.53 },
    { month: '6月', 对公: 3.02, 零售: 1.56, 总存款: 4.58 },
  ],
  distribution: [
    { name: '对公活期', value: 32.5, color: '#3b82f6' },
    { name: '对公定期', value: 33.4, color: '#10b981' },
    { name: '零售活期', value: 18.2, color: '#f59e0b' },
    { name: '零售定期', value: 15.9, color: '#8b5cf6' },
  ],
  topDepositors: [
    { name: '某国有企业集团', amount: 856, type: '对公', duration: '3个月', id: 'corp1' },
    { name: '某市政府财政账户', amount: 723, type: '对公', duration: '活期', id: 'corp2' },
    { name: '某上市公司', amount: 645, type: '对公', duration: '6个月', id: 'corp3' },
    { name: '某投资基金', amount: 512, type: '对公', duration: '1个月', id: 'corp4' },
    { name: '高净值客户群体', amount: 389, type: '零售', duration: '1年', id: 'retail1' },
  ],
  kpis: [
    { label: '存款总额', value: '4.58万亿', change: '+8.5%', trend: 'up' },
    { label: '对公存款', value: '3.02万亿', change: '+7.2%', trend: 'up' },
    { label: '零售存款', value: '1.56万亿', change: '+11.8%', trend: 'up' },
    { label: '存贷比', value: '83.4%', change: '+1.2%', trend: 'up' },
  ]
};

// 贷款详细数据
const loanDetailData = {
  trend: [
    { month: '1月', 对公: 2.42, 零售: 1.23, 总贷款: 3.65 },
    { month: '2月', 对公: 2.45, 零售: 1.23, 总贷款: 3.68 },
    { month: '3月', 对公: 2.48, 零售: 1.24, 总贷款: 3.72 },
    { month: '4月', 对公: 2.50, 零售: 1.25, 总贷款: 3.75 },
    { month: '5月', 对公: 2.52, 零售: 1.26, 总贷款: 3.78 },
    { month: '6月', 对公: 2.55, 零售: 1.27, 总贷款: 3.82 },
  ],
  riskDistribution: [
    { rating: 'AAA', amount: 15200, ratio: 39.8, npl: 0.12, id: 'aaa' },
    { rating: 'AA', amount: 11400, ratio: 29.8, npl: 0.35, id: 'aa' },
    { rating: 'A', amount: 7650, ratio: 20.0, npl: 0.89, id: 'a' },
    { rating: 'BBB', amount: 2890, ratio: 7.6, npl: 2.45, id: 'bbb' },
    { rating: 'BB及以下', amount: 1060, ratio: 2.8, npl: 8.52, id: 'bb' },
  ],
  maturity: [
    { period: '1年以内', amount: 12500, ratio: 32.7 },
    { period: '1-3年', amount: 14800, ratio: 38.7 },
    { period: '3-5年', amount: 7200, ratio: 18.8 },
    { period: '5年以上', amount: 3700, ratio: 9.7 },
  ],
  kpis: [
    { label: '贷款总额', value: '3.82万亿', change: '+10.2%', trend: 'up' },
    { label: '新增贷款', value: '2850亿', change: '+15.3%', trend: 'up' },
    { label: '不良贷款', value: '516亿', change: '+8.5%', trend: 'down' },
    { label: '拨备余额', value: '1470亿', change: '+18.2%', trend: 'up' },
  ]
};

// 利润详细数据
const profitDetailData = {
  trend: [
    { month: '1月', 利息收入: 42.5, 手续费: 8.2, 投资收益: 4.5, 成本: 28.5, 净利润: 19.7 },
    { month: '2月', 利息收入: 40.8, 手续费: 7.8, 投资收益: 4.2, 成本: 27.2, 净利润: 18.6 },
    { month: '3月', 利息收入: 46.2, 手续费: 8.9, 投资收益: 5.0, 成本: 30.8, 净利润: 21.3 },
    { month: '4月', 利息收入: 44.1, 手续费: 8.5, 投资收益: 4.5, 成本: 29.5, 净利润: 20.1 },
    { month: '5月', 利息收入: 49.2, 手续费: 9.2, 投资收益: 5.5, 成本: 32.1, 净利润: 23.2 },
    { month: '6月', 利息收入: 52.5, 手续费: 10.1, 投资收益: 6.0, 成本: 33.8, 净利润: 25.1 },
  ],
  costBreakdown: [
    { name: '人工成本', value: 42.3, color: '#3b82f6' },
    { name: '业务及管理费', value: 28.5, color: '#10b981' },
    { name: '信用减值损失', value: 18.2, color: '#f59e0b' },
    { name: '其他成本', value: 11.0, color: '#8b5cf6' },
  ],
  profitability: [
    { metric: 'ROE（净资产收益率）', value: '14.52%', target: '14.00%', status: 'good' },
    { metric: 'ROA（总资产收益率）', value: '0.96%', target: '0.90%', status: 'good' },
    { metric: '净息差', value: '2.08%', target: '2.00%', status: 'good' },
    { metric: '成本收入比', value: '32.5%', target: '35.00%', status: 'good' },
    { metric: '拨备覆盖率', value: '285%', target: '150%', status: 'good' },
  ],
  kpis: [
    { label: '净利润', value: '138亿', change: '+12.3%', trend: 'up' },
    { label: '���业收入', value: '325亿', change: '+9.8%', trend: 'up' },
    { label: 'ROE', value: '14.52%', change: '+0.85%', trend: 'up' },
    { label: '成本收入比', value: '32.5%', change: '-2.3%', trend: 'up' },
  ]
};

// 客户详细数据
const customerOverviewData = {
  trend: [
    { month: '1月', 对公: 28.5, 零售: 1820, 总客户: 1848.5 },
    { month: '2月', 对公: 28.8, 零售: 1828, 总客户: 1856.8 },
    { month: '3月', 对公: 29.1, 零售: 1835, 总客户: 1864.1 },
    { month: '4月', 对公: 29.3, 零售: 1842, 总客户: 1871.3 },
    { month: '5月', 对公: 29.6, 零售: 1849, 总客户: 1878.6 },
    { month: '6月', 对公: 29.8, 零售: 1856, 总客户: 1885.8 },
  ],
  distribution: [
    { name: '财富客户', value: 2.5, color: '#3b82f6' },
    { name: '价值客户', value: 15.8, color: '#10b981' },
    { name: '基础客户', value: 45.2, color: '#f59e0b' },
    { name: '长尾客户', value: 36.5, color: '#8b5cf6' },
  ],
  topClients: [
    { name: '某大型国有集团', amount: 850, industry: '制造业', rating: 'AAA' },
    { name: '某互联网巨头', amount: 620, industry: '信息技术', rating: 'AAA' },
    { name: '某房地产龙头', amount: 480, industry: '房地产', rating: 'AA+' },
    { name: '某能源化工集团', amount: 350, industry: '能源化工', rating: 'AAA' },
    { name: '某物流运输公司', amount: 280, industry: '交通运输', rating: 'AA' },
  ],
  kpis: [
    { label: '客户总数', value: '1,885万', change: '+2.1%', trend: 'up' },
    { label: '对公客户', value: '29.8万', change: '+4.5%', trend: 'up' },
    { label: '零售客户', value: '1,856万', change: '+2.0%', trend: 'up' },
    { label: '活跃客户', value: '892万', change: '+8.5%', trend: 'up' },
  ]
};

// 中间业务详细数据
const businessDetailData = {
  trend: [
    { month: '1月', 银行卡: 4.2, 理财: 3.5, 汇款: 2.1, 代理: 1.5, 总收入: 11.3 },
    { month: '2月', 银行卡: 4.3, 理财: 3.6, 汇款: 2.2, 代理: 1.6, 总收入: 11.7 },
    { month: '3月', 银行卡: 4.5, 理财: 3.8, 汇款: 2.3, 代理: 1.7, 总收入: 12.3 },
    { month: '4月', 银行卡: 4.6, 理财: 4.0, 汇款: 2.4, 代理: 1.8, 总收入: 12.8 },
    { month: '5月', 银行卡: 4.8, 理财: 4.2, 汇款: 2.5, 代理: 1.9, 总收入: 13.4 },
    { month: '6月', 银行卡: 5.1, 理财: 4.5, 汇款: 2.6, 代理: 2.0, 总收入: 14.2 },
  ],
  distribution: [
    { name: '银行卡', value: 35.9, color: '#3b82f6' },
    { name: '理财产品', value: 31.7, color: '#10b981' },
    { name: '汇款结算', value: 18.3, color: '#f59e0b' },
    { name: '代理业务', value: 14.1, color: '#8b5cf6' },
  ],
  kpis: [
    { label: '中间业务收入', value: '14.2亿', change: '+6.0%', trend: 'up' },
    { label: '理财销售额', value: '285亿', change: '+12.5%', trend: 'up' },
    { label: '信用卡发卡', value: '128万张', change: '+5.2%', trend: 'up' },
    { label: '国际汇款', value: '95亿', change: '+32.0%', trend: 'up' },
  ],
  products: [
    { name: '稳健型理财', balance: 158, rate: '3.5%', status: '热销' },
    { name: '进取型理财', balance: 42, rate: '5.2%', status: '增长快' },
    { name: '信用卡分期', balance: 85, rate: '12.0%', status: '稳定' },
    { name: '代理基金', balance: 68, rate: '-', status: '波动' },
  ]
};

// 行业详细下钻数据
const industryDrillDownData: Record<string, any> = {
  manufacturing: {
    title: '制造业贷款详情',
    kpis: [
      { label: '贷款余额', value: '8520亿', change: '+12.5%', trend: 'up' },
      { label: '不良率', value: '1.45%', change: '+0.15%', trend: 'down' },
      { label: '客户数量', value: '1,258户', change: '+85户', trend: 'up' },
      { label: '平均利率', value: '4.35%', change: '-0.10%', trend: 'up' },
    ],
    subIndustries: [
      { name: '高端装备制造', amount: 2850, ratio: 33.5, npl: 0.85, growth: 18.5 },
      { name: '新能源汽车', amount: 2120, ratio: 24.9, npl: 1.12, growth: 25.3 },
      { name: '电子信息', amount: 1680, ratio: 19.7, npl: 1.35, growth: 15.2 },
      { name: '传统制造', amount: 1250, ratio: 14.7, npl: 2.45, growth: 5.8 },
      { name: '其他', amount: 620, ratio: 7.3, npl: 1.88, growth: 8.6 },
    ],
    topClients: [
      { name: '某新能源科技公司', amount: 125, rating: 'AAA', industry: '新能源汽车' },
      { name: '某智能制造企业', amount: 98, rating: 'AA+', industry: '高端装备' },
      { name: '某半导体公司', amount: 87, rating: 'AA', industry: '电子信息' },
      { name: '某机械制造集团', amount: 76, rating: 'AA-', industry: '传统制造' },
      { name: '某精密仪器公司', amount: 65, rating: 'A+', industry: '高端装备' },
    ],
    riskAnalysis: '制造业整体风险可控，新能源和高端制造领域发展迅速，传统制造业需关注产能过剩和转型升级风险。'
  },
  realestate: {
    title: '房地产贷款详情',
    kpis: [
      { label: '贷款余额', value: '7680亿', change: '+3.2%', trend: 'up' },
      { label: '不良率', value: '2.18%', change: '+0.35%', trend: 'down' },
      { label: '客户数量', value: '387户', change: '-12户', trend: 'down' },
      { label: '平均利率', value: '5.15%', change: '+0.25%', trend: 'up' },
    ],
    subIndustries: [
      { name: '优质房企', amount: 4992, ratio: 65.0, npl: 0.85, growth: 5.2 },
      { name: '区域性房企', amount: 1843, ratio: 24.0, npl: 3.25, growth: -2.5 },
      { name: '城市更新', amount: 614, ratio: 8.0, npl: 1.15, growth: 15.8 },
      { name: '其他', amount: 230, ratio: 3.0, npl: 5.85, growth: -8.2 },
    ],
    topClients: [
      { name: '某头部房地产集团', amount: 285, rating: 'AAA', industry: '优质房企' },
      { name: '某国企房地产公司', amount: 198, rating: 'AA+', industry: '优质房企' },
      { name: '某城市运营商', amount: 156, rating: 'AA', industry: '城市更新' },
      { name: '某区域龙头房企', amount: 125, rating: 'A', industry: '区域性房企' },
      { name: '某产业园区开发商', amount: 98, rating: 'A-', industry: '其他' },
    ],
    riskAnalysis: '房地产行业整体承压，需严控风险敞口，重点支持优质房企和城市更新项目，警惕区域性房企流动性风险。'
  },
  housing: {
    title: '个人住房贷款详情',
    kpis: [
      { label: '贷款余额', value: '6520亿', change: '+8.9%', trend: 'up' },
      { label: '不良率', value: '0.52%', change: '+0.02%', trend: 'up' },
      { label: '客户数量', value: '128.5万户', change: '+8.2万户', trend: 'up' },
      { label: '平均利率', value: '4.75%', change: '-0.15%', trend: 'down' },
    ],
    cityDistribution: [
      { city: '一线城市', amount: 3260, ratio: 50.0, npl: 0.35, avgLoan: 285 },
      { city: '二线城市', amount: 2280, ratio: 35.0, npl: 0.58, avgLoan: 165 },
      { city: '三四线城市', amount: 980, ratio: 15.0, npl: 0.85, avgLoan: 95 },
    ],
    ageDistribution: [
      { age: '25-30岁', amount: 1565, ratio: 24.0, npl: 0.45 },
      { age: '31-40岁', amount: 3260, ratio: 50.0, npl: 0.38 },
      { age: '41-50岁', amount: 1304, ratio: 20.0, npl: 0.62 },
      { age: '50岁以上', amount: 391, ratio: 6.0, npl: 0.95 },
    ],
    riskAnalysis: '个人住房贷款是优质资产，不良率低，一线城市风险最低，需关注三四线城市房价下行风险。'
  }
};

// 客户详细下钻数据
const customerDrillDownData: Record<string, any> = {
  corp1: {
    title: '某国有企业集团',
    overview: {
      totalDeposit: '856亿',
      depositType: '对公定期',
      duration: '3个月',
      rating: 'AAA',
      relationship: '15年'
    },
    depositTrend: [
      { month: '1月', 活期: 245, 定期: 598, 总额: 843 },
      { month: '2月', 活期: 238, 定期: 605, 总额: 843 },
      { month: '3月', 活期: 252, 定期: 595, 总额: 847 },
      { month: '4月', 活期: 248, 定期: 602, 总额: 850 },
      { month: '5月', 活期: 255, 定期: 598, 总额: 853 },
      { month: '6月', 活期: 262, 定期: 594, 总额: 856 },
    ],
    products: [
      { product: '对公定期存款', balance: 594, rate: '2.85%' },
      { product: '对公活期存款', balance: 262, rate: '0.35%' },
      { product: '结构性存款', balance: 0, rate: '-' },
      { product: '协议存款', balance: 0, rate: '-' },
    ],
    analysis: '该客户为优质国企客户，存款规模大且稳定，以定期存款为主，可以进一步营销结构性存款等高收益产品。'
  }
};

// 信用等级详细下钻数据
const ratingDrillDownData: Record<string, any> = {
  aaa: {
    title: 'AAA级客户群体分析',
    kpis: [
      { label: '贷款余额', value: '15,200亿', change: '+8.5%', trend: 'up' },
      { label: '客户数量', value: '856户', change: '+45户', trend: 'up' },
      { label: '不良率', value: '0.12%', change: '+0.01%', trend: 'up' },
      { label: '平均利率', value: '3.85%', change: '-0.05%', trend: 'down' },
    ],
    industryDistribution: [
      { industry: '基础设施', amount: 4560, ratio: 30.0, clients: 125 },
      { industry: '制造业', amount: 3800, ratio: 25.0, clients: 215 },
      { industry: '金融服务', amount: 2736, ratio: 18.0, clients: 78 },
      { industry: '能源电力', amount: 2280, ratio: 15.0, clients: 95 },
      { industry: '其他', amount: 1824, ratio: 12.0, clients: 343 },
    ],
    topClients: [
      { name: '某中央企业集团', amount: 850, industry: '基础设施', exposure: '高' },
      { name: '某国有银行', amount: 680, industry: '金融服务', exposure: '中' },
      { name: '某电力集团', amount: 520, industry: '能源电力', exposure: '中' },
      { name: '某通信运营商', amount: 450, industry: '基础设施', exposure: '中' },
      { name: '某汽车制造集团', amount: 380, industry: '制造业', exposure: '低' },
    ],
    analysis: 'AAA级客户是银行最优质的客户群体，违约风险极低，但利率水平也相对较低，需要通过综合金融服务提升收益。'
  },
  bbb: {
    title: 'BBB级客户群体分析',
    kpis: [
      { label: '贷款余额', value: '2,890亿', change: '+5.2%', trend: 'up' },
      { label: '客户数量', value: '425户', change: '-18户', trend: 'down' },
      { label: '不良率', value: '2.45%', change: '+0.35%', trend: 'down' },
      { label: '平均利率', value: '5.65%', change: '+0.25%', trend: 'up' },
    ],
    industryDistribution: [
      { industry: '批发零售', amount: 1012, ratio: 35.0, clients: 145 },
      { industry: '制造业', amount: 867, ratio: 30.0, clients: 128 },
      { industry: '房地产', amount: 578, ratio: 20.0, clients: 65 },
      { industry: '其他', amount: 433, ratio: 15.0, clients: 87 },
    ],
    riskClients: [
      { name: '某传统制造企业', amount: 85, industry: '制造业', risk: '关注类', reason: '市场需求下滑' },
      { name: '某批发贸易公司', amount: 68, industry: '批发零售', risk: '关注类', reason: '现金流紧张' },
      { name: '某区域房企', amount: 52, industry: '房地产', risk: '次级', reason: '债务重组中' },
    ],
    analysis: 'BBB级客户风险相对较高，需加强贷后管理和风险监控，适当提高利率水平以覆盖风险成本。'
  }
};

// 类型守卫函数
const isLoanData = (d: any): d is typeof loanDetailData => 'riskDistribution' in d;
const isBusinessData = (d: any): d is typeof businessDetailData => 'products' in d;
const isDepositData = (d: any): d is typeof depositDetailData => 'topDepositors' in d;
const isProfitData = (d: any): d is typeof profitDetailData => 'costBreakdown' in d;
const isCustomerData = (d: any): d is typeof customerOverviewData => 'topClients' in d && !('riskDistribution' in d); // 区分loanData
const isAssetData = (d: any): d is typeof assetDetailData => 'industry' in d && !('riskDistribution' in d); // 区分loanData

// 子页面组件
interface SubPageProps {
  data: any;
  onBack: () => void;
  onPin?: (query: string, response: string, category: string) => void;
}

function SubPage({ data, onBack, onPin }: SubPageProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 子页面头部 */}
      <div className="flex-shrink-0 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-white text-base md:text-lg font-medium">{data.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">下钻分析详情</p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs ml-2">
            深度分析
          </Badge>
        </div>
      </div>

      {/* 子页面内容 */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-6">
          {/* KPI 指标 */}
          {data.kpis && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {data.kpis.map((kpi: any, index: number) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-slate-400 mb-2">{kpi.label}</p>
                    <div className="flex items-end justify-between">
                      <p className="text-xl md:text-2xl font-semibold text-white">{kpi.value}</p>
                      <div className={`flex items-center gap-1 text-xs ${
                        kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {kpi.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{kpi.change}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 子行业分布 */}
          {data.subIndustries && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  细分领域分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.subIndustries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="amount" fill="#3b82f6" name="金额(亿)" />
                      <Bar dataKey="growth" fill="#10b981" name="增长率(%)" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                          <TableHead className="text-slate-300">细分领域</TableHead>
                          <TableHead className="text-slate-300">余额(亿)</TableHead>
                          <TableHead className="text-slate-300">占比</TableHead>
                          <TableHead className="text-slate-300">不良率</TableHead>
                          <TableHead className="text-slate-300">增长率</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.subIndustries.map((item: any, index: number) => (
                          <TableRow key={index} className="border-slate-700/50 hover:bg-slate-700/30">
                            <TableCell className="text-slate-200">{item.name}</TableCell>
                            <TableCell className="text-slate-200">{item.amount}</TableCell>
                            <TableCell className="text-slate-200">{item.ratio}%</TableCell>
                            <TableCell>
                              <Badge variant={item.npl > 2 ? 'destructive' : item.npl > 1 ? 'secondary' : 'default'}>
                                {item.npl}%
                              </Badge>
                            </TableCell>
                            <TableCell className={item.growth > 10 ? 'text-green-400' : item.growth > 0 ? 'text-slate-200' : 'text-red-400'}>
                              {item.growth > 0 ? '+' : ''}{item.growth}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 行业分布（信用等级页面） */}
          {data.industryDistribution && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-green-400" />
                  行业分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={data.industryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ industry, ratio }: { industry: string; ratio: number }) => `${industry} ${ratio}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {data.industryDistribution.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '8px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700/50">
                          <TableHead className="text-slate-300">行业</TableHead>
                          <TableHead className="text-slate-300">余额(亿)</TableHead>
                          <TableHead className="text-slate-300">客户数</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.industryDistribution.map((item: any, index: number) => (
                          <TableRow key={index} className="border-slate-700/50 hover:bg-slate-700/30">
                            <TableCell className="text-slate-200">{item.industry}</TableCell>
                            <TableCell className="text-slate-200">{item.amount}</TableCell>
                            <TableCell className="text-slate-200">{item.clients}户</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 重点客户 */}
          {data.topClients && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-orange-400" />
                  重点客户列表
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                        <TableHead className="text-slate-300">客户名称</TableHead>
                        <TableHead className="text-slate-300">余额(亿)</TableHead>
                        {data.topClients[0].rating && <TableHead className="text-slate-300">评级</TableHead>}
                        <TableHead className="text-slate-300">行业</TableHead>
                        {data.topClients[0].exposure && <TableHead className="text-slate-300">风险敞口</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.topClients.map((client: any, index: number) => (
                        <TableRow key={index} className="border-slate-700/50 hover:bg-slate-700/30">
                          <TableCell className="text-slate-200">{client.name}</TableCell>
                          <TableCell className="text-slate-200">{client.amount}</TableCell>
                          {client.rating && (
                            <TableCell>
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                {client.rating}
                              </Badge>
                            </TableCell>
                          )}
                          <TableCell className="text-slate-200">{client.industry}</TableCell>
                          {client.exposure && (
                            <TableCell>
                              <Badge variant={
                                client.exposure === '高' ? 'destructive' : 
                                client.exposure === '中' ? 'secondary' : 'default'
                              }>
                                {client.exposure}
                              </Badge>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 风险客户（BBB等级特有） */}
          {data.riskClients && (
            <Card className="bg-slate-800/50 border-slate-700/50 border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  重点关注客户
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50">
                        <TableHead className="text-slate-300">客户名称</TableHead>
                        <TableHead className="text-slate-300">余额(亿)</TableHead>
                        <TableHead className="text-slate-300">行业</TableHead>
                        <TableHead className="text-slate-300">风险分类</TableHead>
                        <TableHead className="text-slate-300">关注原因</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.riskClients.map((client: any, index: number) => (
                        <TableRow key={index} className="border-slate-700/50 hover:bg-slate-700/30">
                          <TableCell className="text-slate-200">{client.name}</TableCell>
                          <TableCell className="text-slate-200">{client.amount}</TableCell>
                          <TableCell className="text-slate-200">{client.industry}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">{client.risk}</Badge>
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">{client.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 客户存款趋势（客户详情特有） */}
          {data.depositTrend && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5 text-blue-400" />
                  存款变化趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={data.depositTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Area type="monotone" dataKey="总额" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.3} />
                    <Bar dataKey="活期" fill="#10b981" />
                    <Bar dataKey="定期" fill="#f59e0b" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* 产品明细（客户详情特有） */}
          {data.products && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  产品持有情况
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50">
                        <TableHead className="text-slate-300">产品名称</TableHead>
                        <TableHead className="text-slate-300">余额(亿)</TableHead>
                        <TableHead className="text-slate-300">利率</TableHead>
                        <TableHead className="text-slate-300">状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.products.map((product: any, index: number) => (
                        <TableRow key={index} className="border-slate-700/50 hover:bg-slate-700/30">
                          <TableCell className="text-slate-200">{product.product}</TableCell>
                          <TableCell className="text-slate-200">{product.balance}</TableCell>
                          <TableCell className="text-slate-200">{product.rate}</TableCell>
                          <TableCell>
                            <Badge variant={product.balance > 0 ? 'default' : 'secondary'}>
                              {product.balance > 0 ? '持有中' : '未持有'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 城市分布（住房贷款特有） */}
          {data.cityDistribution && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-purple-400" />
                  城市分布情况
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.cityDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="city" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="amount" fill="#8b5cf6" name="余额(亿)" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.cityDistribution.map((city: any, index: number) => (
                      <Card key={index} className="bg-slate-900/50 border-slate-700/50">
                        <CardContent className="p-4">
                          <h4 className="text-white font-medium mb-3">{city.city}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">余额</span>
                              <span className="text-slate-200">{city.amount}亿</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">占比</span>
                              <span className="text-slate-200">{city.ratio}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">不良率</span>
                              <Badge variant={city.npl > 0.7 ? 'secondary' : 'default'}>
                                {city.npl}%
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">户均</span>
                              <span className="text-slate-200">{city.avgLoan}万</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 年龄分布（住房贷款特有） */}
          {data.ageDistribution && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  客户年龄分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="age" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="amount" fill="#06b6d4" name="余额(亿)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* 风险分析 */}
          {data.riskAnalysis && (
            <Card className="bg-slate-800/50 border-slate-700/50 border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  综合分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">{data.riskAnalysis}</p>
              </CardContent>
            </Card>
          )}

          {data.analysis && (
            <Card className="bg-slate-800/50 border-slate-700/50 border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  客户分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">{data.analysis}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export function DrillDownPage({ config, onBack, onPin }: DrillDownPageProps) {
  const [timeRange, setTimeRange] = useState('6M');
  const [subPage, setSubPage] = useState<any>(null);

  // 根据类型获取数据
  const getData = () => {
    switch (config.type) {
      case 'asset':
      case 'loan':
        return assetDetailData;
      case 'deposit':
        return depositDetailData;
      case 'profit':
        return profitDetailData;
      case 'customer':
        return customerOverviewData;
      case 'business':
        return businessDetailData;
      default:
        return assetDetailData;
    }
  };

  const data = getData();

  // 处理行业/客户点击
  const handleItemClick = (itemId: string, type: 'industry' | 'customer' | 'rating') => {
    if (type === 'industry') {
      const drillData = industryDrillDownData[itemId];
      if (drillData) {
        setSubPage(drillData);
      }
    } else if (type === 'customer') {
      const drillData = customerDrillDownData[itemId];
      if (drillData) {
        setSubPage(drillData);
      }
    } else if (type === 'rating') {
      const drillData = ratingDrillDownData[itemId];
      if (drillData) {
        setSubPage(drillData);
      }
    }
  };

  // 如果在子页面，显示子页面
  if (subPage) {
    return <SubPage data={subPage} onBack={() => setSubPage(null)} onPin={onPin} />;
  }

  // 生成AI回答
  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (config.type === 'asset' || config.type === 'loan') {
      if (lowerQuery.includes('不良') || lowerQuery.includes('风险')) {
        return `根据最新数据分析：

📊 不良贷款情况：
• 不良贷款余额：516亿元
• 不良贷款率：1.35%，环比上升0.07个百分点
• 关注类贷款：345亿元，占比0.90%

🏭 行业分布：
• 房地产行业不良率最高：2.18%
• 制造业不良率：1.45%
• 个人住房贷款不良率最低：0.52%

💰 拨备情况：
• 拨备覆盖率：285%，高于监管要求150%
• 拨备余额：1470亿元，同比增长18.2%

⚠️ 风险提示：
建议重点关注房地产和制造业的贷款质量，加强贷后管理和风险预警机制。`;
      }
      
      if (lowerQuery.includes('行业') || lowerQuery.includes('结构')) {
        return `资产行业分布分析：

🏭 制造业：8520亿元（22.3%）
• 主要集中在高端制造和新能源领域
• 不良率1.45%，处于可控范围
• 💡 点击表格中的行业可查看更详细的细分领域分析

🏗️ 房地产：7680亿元（20.1%）
• 优质房企占比65%
• 不良率2.18%，需重点监控

🏪 批发零售：5430亿元（14.2%）
• 主要支持供应链金融
• 不良率1.32%

🏠 个人住房：6520亿元（17.1%）
• 优质抵押贷款
• 不良率仅0.52%

💡 建议：保持制造业和基建领域投放力度，审慎控制房地产风险敞口。`;
      }
    }
    
    if (config.type === 'deposit') {
      if (lowerQuery.includes('结构') || lowerQuery.includes('分布')) {
        return `存款结构分析：

💼 对公存款：3.02万亿（65.9%）
• 对公活期：32.5%
• 对公定期：33.4%
• 同比增长7.2%

👥 零售存款：1.56万亿（34.1%）
• 零售活期：18.2%
• 零售定期：15.9%
• 同比增长11.8%

📈 增长亮点：
• 零售存款增速明显高于对公
• 活期存款占比提升，降低了资金成本
• 核心存款（活期+定期1年以内）占比达78%

💡 提示：点击表格中的客户名称可查看该客户的详细情况和存款趋势。`;
      }
    }

    if (config.type === 'customer') {
      return `客户概况分析：

👥 客户总量：1,885万户（+2.1%）
• 对公客户：29.8万户，增长较快
• 零售客户：1,856万户，基础稳固

📊 客户结构：
• 财富客户：占比2.5%，贡献度高
• 价值客户：占比15.8%，潜力大
• 基础与长尾客户：占比80%以上，需提升活跃度

💡 建议：重点挖掘价值客户潜力，提升长尾客户向价值客户转化率。`;
    }
    
    if (config.type === 'profit') {
      if (lowerQuery.includes('收入') || lowerQuery.includes('利润')) {
        return `利润构成分析：

💰 营业收入：325亿元（+9.8%）
• 利息净收入：220亿元（67.7%）
• 手续费收入：58亿元（17.8%）
• 投资收益：32亿元（9.8%）
• 其他收入：15亿元（4.6%）

📊 成本支出：187亿元
• 人工成本：79亿元（42.3%）
• 业务及管理费：53亿元（28.5%）
• 信用减值损失：34亿元（18.2%）

✅ 净利润：138亿元（+12.3%）
• ROE：14.52%
• ROA：0.96%
• 成本收入比：32.5%

💡 建议：继续优化收入结构，提升中间业务收入占比，控制成本支出增长。`;
      }
    }
    
    if (config.type === 'business') {
      return `中间业务分析：

💰 收入情况：14.2亿元（+6.0%）
• 银行卡：5.1亿，占比35.9%
• 理财：4.5亿，占比31.7%

📈 业务亮点：
• 理财产品销售额增长12.5%，进取型产品受欢迎
• 国际汇款业务增长32.0%，成为新增长点

💡 建议：持续优化理财产品线，抓住跨境业务机遇。`;
    }

    return `根据您的问题，我为您分析${config.title}的相关数据：

当前${config.title}总体运行平稳，主要指标符合预期。详细数据请查看上方的图表和表格。

💡 下钻分析提示：
• 点击表格中的行业名称，可查看该行业的细分领域分布和重点客户
• 点击客户名称，可查看该客户的详细信息和业务往来历史
• 点击信用等级，可查看该等级下的客户分布和风险分析

如需了解更多细节，可以继续提问：
• 具体指标的变化趋势
• 行业或客户结构分布
• 风险状况评估
• 未来发展建议`;
  };

  const exampleQueries = config.type === 'asset' ? [
    '贷款行业分布情况如何？',
    '不良贷款主要集中在哪些行业？',
    '资产质量五级分类情况？',
    '拨备覆盖率是否充足？'
  ] : config.type === 'deposit' ? [
    '存款结构分布如何？',
    '对公和零售存款占比？',
    '主要存款来源有哪些？',
    '存款成本率是多少？'
  ] : config.type === 'customer' ? [
    '客户增长趋势如何？',
    '高价值客户占比多少？',
    '对公客户主要分布在哪些行业？',
    '如何提升客户活跃度？'
  ] : config.type === 'business' ? [
    '中间业务收入构成如何？',
    '理财产品销售情况？',
    '哪项业务增长最快？',
    '信用卡业务表现如何？'
  ] : config.type === 'profit' ? [
    '利润主要来源是什么？',
    '成本支出构成如何？',
    '盈利能力指标如何？',
    '如何提升净息差？'
  ] : [
    `${config.title}的整体情况如何？`,
    '主要风险点在哪里？',
    '未来发展趋势如何？',
    '有什么优化建议？'
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 页头 */}
      <div className="flex-shrink-0 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50 flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white text-base md:text-lg font-medium">{config.title}</h2>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  详细分析
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-slate-400 line-clamp-1" title={config.description}>
                {config.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="text-slate-300 border-slate-600 hover:bg-slate-700/50">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
            <Button variant="outline" size="sm" className="text-slate-300 border-slate-600 hover:bg-slate-700/50">
              <Calendar className="w-4 h-4 mr-2" />
              {timeRange === '6M' ? '近6个月' : timeRange === '1Y' ? '近1年' : '近3个月'}
            </Button>
            <Button variant="outline" size="sm" className="text-slate-300 border-slate-600 hover:bg-slate-700/50">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-6">
          {/* 下钻提示卡片 */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                  <ChevronRight className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">💡 下钻分析提示</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    点击下方表格中的<span className="text-blue-400 font-medium">行业名称</span>、
                    <span className="text-green-400 font-medium">客户名称</span>或
                    <span className="text-purple-400 font-medium">信用等级</span>，
                    可查看更详细的细分数据、客户分析和风险评估。支持多层级下钻，深入了解业务细节。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 指标卡片 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {data.kpis.map((kpi, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600 transition-colors">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-400 mb-2">{kpi.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-xl md:text-2xl font-semibold text-white">{kpi.value}</p>
                    <div className={`flex items-center gap-1 text-xs ${
                      kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{kpi.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 趋势图表 */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <LineChartIcon className="w-5 h-5 text-blue-400" />
                    趋势分析
                  </CardTitle>
                  <p className="text-sm text-slate-400 mt-1">近6个月变化趋势</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.trend}>
                  <defs>
                    <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  {Object.keys(data.trend[0])
                    .filter(key => key !== 'month')
                    .map((key, index) => (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={COLORS[index % COLORS.length]}
                        fill={`url(#colorValue${(index % 2) + 1})`}
                        strokeWidth={2}
                      />
                    ))}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 分布图表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-green-400" />
                  结构分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={(data as any).distribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {((data as any).distribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 详细数据表格 - 添加点击功能 */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  {config.type === 'asset' || config.type === 'loan' ? '行业分布' : 
                   config.type === 'deposit' ? '主要来源' :
                    config.type === 'customer' ? '重点客户' :
                    config.type === 'business' ? '重点产品' :
                    config.type === 'profit' ? '成本构成' : '详细数据'}
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs ml-2">
                    可下钻
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                        {config.type === 'asset' || config.type === 'loan' ? (
                          <>
                            <TableHead className="text-slate-300">行业</TableHead>
                            <TableHead className="text-slate-300">金额(亿)</TableHead>
                            <TableHead className="text-slate-300">占比</TableHead>
                            <TableHead className="text-slate-300">不良率</TableHead>
                            <TableHead className="text-slate-300">操作</TableHead>
                          </>
                        ) : config.type === 'deposit' ? (
                          <>
                            <TableHead className="text-slate-300">来源</TableHead>
                            <TableHead className="text-slate-300">金额(亿)</TableHead>
                            <TableHead className="text-slate-300">类型</TableHead>
                            <TableHead className="text-slate-300">期限</TableHead>
                            <TableHead className="text-slate-300">操作</TableHead>
                          </>
                        ) : config.type === 'business' ? (
                          <>
                            <TableHead className="text-slate-300">产品名称</TableHead>
                            <TableHead className="text-slate-300">余额(亿)</TableHead>
                            <TableHead className="text-slate-300">收益率/费率</TableHead>
                            <TableHead className="text-slate-300">状态</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead className="text-slate-300">类别</TableHead>
                            <TableHead className="text-slate-300">占比</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(config.type === 'asset' || config.type === 'loan' ? 
                        (data as typeof assetDetailData).industry.slice(0, 5) :
                        config.type === 'deposit' ?
                        (data as typeof depositDetailData).topDepositors.slice(0, 5) :
                        (data as typeof profitDetailData).costBreakdown
                      ).map((row: any, index: number) => (
                        <TableRow 
                          key={index} 
                          className="border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors"
                        >
                          {config.type === 'asset' || config.type === 'loan' ? (
                            <>
                              <TableCell className="text-slate-200">{row.name}</TableCell>
                              <TableCell className="text-slate-200">{row.amount}</TableCell>
                              <TableCell className="text-slate-200">{row.ratio}%</TableCell>
                              <TableCell>
                                <Badge variant={row.npl > 2 ? 'destructive' : row.npl > 1 ? 'secondary' : 'default'}>
                                  {row.npl}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {row.id && industryDrillDownData[row.id] && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleItemClick(row.id, 'industry')}
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8"
                                  >
                                    查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                                  </Button>
                                )}
                              </TableCell>
                            </>
                          ) : config.type === 'deposit' ? (
                            <>
                              <TableCell className="text-slate-200">{row.name}</TableCell>
                              <TableCell className="text-slate-200">{row.amount}</TableCell>
                              <TableCell>
                                <Badge variant={row.type === '对公' ? 'default' : 'secondary'}>
                                  {row.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-200">{row.duration}</TableCell>
                              <TableCell>
                                {row.id && customerDrillDownData[row.id] && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleItemClick(row.id, 'customer')}
                                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10 h-8"
                                  >
                                    查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                                  </Button>
                                )}
                              </TableCell>
                            </>
                          ) : config.type === 'customer' ? (
                            <>
                              <TableCell className="text-slate-200">{row.name}</TableCell>
                              <TableCell className="text-slate-200">{row.industry}</TableCell>
                              <TableCell className="text-slate-200">{row.amount}</TableCell>
                              <TableCell>
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                  {row.rating}
                                </Badge>
                              </TableCell>
                              </>
                            ) : config.type === 'business' ? (
                              <>
                                <TableCell className="text-slate-200">{row.name}</TableCell>
                                <TableCell className="text-slate-200">{row.balance}</TableCell>
                                <TableCell className="text-slate-200">{row.rate}</TableCell>
                                <TableCell>
                                  <Badge variant={row.status === '热销' || row.status === '增长快' ? 'default' : 'secondary'}>
                                    {row.status}
                                  </Badge>
                                </TableCell>
                              </>
                            ) : (
                              <>
                              <TableCell className="text-slate-200">{row.name}</TableCell>
                              <TableCell className="text-slate-200">{row.value}%</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 信用等级分布（贷款页面特有）- 添加点击功能 */}
          {config.type === 'loan' && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  信用等级分布
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs ml-2">
                    可下钻
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                        <TableHead className="text-slate-300">评级</TableHead>
                        <TableHead className="text-slate-300">金额(亿)</TableHead>
                        <TableHead className="text-slate-300">占比</TableHead>
                        <TableHead className="text-slate-300">不良率</TableHead>
                        <TableHead className="text-slate-300">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        if (isLoanData(data)) return data.riskDistribution.map((row: any, index: number) => (
                          <TableRow 
                            key={index} 
                            className="border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors"
                          >
                            <TableCell>
                              <Badge className={
                                row.rating === 'AAA' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                row.rating === 'AA' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                row.rating === 'A' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                row.rating === 'BBB' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                'bg-red-500/20 text-red-400 border-red-500/30'
                              }>
                                {row.rating}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-200">{row.amount}</TableCell>
                            <TableCell className="text-slate-200">{row.ratio}%</TableCell>
                            <TableCell>
                              <Badge variant={row.npl > 2 ? 'destructive' : row.npl > 1 ? 'secondary' : 'default'}>
                                {row.npl}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {row.id && ratingDrillDownData[row.id] && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleItemClick(row.id, 'rating')}
                                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-8"
                                >
                                  查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ));
                        return null;
                      })()}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI 智能问答 */}
          <MultiRoundAIQuery
            title="深度分析助手"
            placeholder={`询��${config.title}的详细信息...`}
            exampleQueries={exampleQueries}
            category={config.category}
            onPin={onPin}
            responseGenerator={generateResponse}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
