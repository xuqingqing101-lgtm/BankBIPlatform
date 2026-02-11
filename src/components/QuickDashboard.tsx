import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  Wallet,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  CreditCard,
  Building2,
  Shield,
  FileText
} from 'lucide-react';

interface DashboardProps {
  type: 'dashboard' | 'deposit' | 'loan' | 'intermediate' | 'customer' | 'executive' | 'finance' | 'trade' | 'logistics';
}

export function QuickDashboard({ type }: DashboardProps) {
  if (type === 'executive') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">总资产</p>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-xl mb-1">¥5.89万亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+6.8%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">存款余额</p>
              <Wallet className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl mb-1">¥4.58万亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+8.5%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">贷款余额</p>
              <CreditCard className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-white text-xl mb-1">¥3.82万亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+10.2%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">不良率</p>
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-white text-xl mb-1">1.35%</p>
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">-0.08pp</span>
            </div>
          </Card>
        </div>

        <Card className="p-3 bg-green-500/10 border-green-500/20">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-xs text-green-400 mb-1">经营健康</p>
              <p className="text-xs text-slate-300">资本充足率13.68%，拨备覆盖率188.5%，监管指标全部达标</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (type === 'deposit') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2">对公存款</p>
            <p className="text-white text-xl mb-2">¥2.79万亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+2.1%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2">零售存款</p>
            <p className="text-white text-xl mb-2">¥1.79万亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+1.9%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2">活期占比</p>
            <p className="text-white text-xl mb-2">42%</p>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">正常</Badge>
          </Card>
        </div>

        <Card className="p-3 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-start gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p className="text-xs text-blue-400 mb-1">业务建议</p>
              <p className="text-xs text-slate-300">对公存款增速快于零售，建议加强零售客户获客营销</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (type === 'loan') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">对公贷款</p>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-xl mb-1">¥2.52万亿</p>
            <p className="text-xs text-slate-400">不良率: 1.28%</p>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">零售贷款</p>
              <Users className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl mb-1">¥1.30万亿</p>
            <p className="text-xs text-slate-400">不良率: 1.42%</p>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3 bg-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-400 mb-1">房贷</p>
            <p className="text-white text-base">¥0.85万亿</p>
          </Card>
          <Card className="p-3 bg-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-400 mb-1">消费贷</p>
            <p className="text-white text-base">¥0.28万亿</p>
          </Card>
          <Card className="p-3 bg-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-400 mb-1">信用卡</p>
            <p className="text-white text-base">¥0.17万亿</p>
          </Card>
        </div>

        <Card className="p-3 bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-xs text-yellow-400 mb-1">风险关注</p>
              <p className="text-xs text-slate-300">零售贷款不良率偏高，需加强消费贷和信用卡风控</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (type === 'customer') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">对公客户</p>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-xl">28.2万</p>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">零售客户</p>
              <Users className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl">1850万</p>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">手机银行</p>
              <CreditCard className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-white text-xl">892万</p>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">月活</p>
              <BarChart3 className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-white text-xl">685万</p>
          </Card>
        </div>

        <Card className="p-3 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-start gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p className="text-xs text-blue-400 mb-1">数字化建议</p>
              <p className="text-xs text-slate-300">手机银行渗透率48%，建议加大APP推广力度提升至60%</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (type === 'finance') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">授信总额</p>
              <CreditCard className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-xl">¥8.5万亿</p>
             <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+5.2%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">已用额度</p>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl">¥5.2万亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+3.8%</span>
            </div>
          </Card>

           <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">普惠金融</p>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-white text-xl">¥1.2万亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+12.5%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">绿色信贷</p>
              <Package className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-white text-xl">¥0.8万亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+15.2%</span>
            </div>
          </Card>
        </div>

        <Card className="p-3 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-start gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p className="text-xs text-blue-400 mb-1">信贷结构优化</p>
              <p className="text-xs text-slate-300">绿色信贷和普惠金融增速显著高于平均水平，信贷结构持续优化</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (type === 'trade') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">理财规模</p>
              <Wallet className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-xl">¥2.1万亿</p>
             <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+4.5%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">代销基金</p>
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-white text-xl">¥8500亿</p>
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400">-2.1%</span>
            </div>
          </Card>

           <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">贵金属交易</p>
              <Package className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-white text-xl">¥320亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+8.9%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">托管资产</p>
              <Building2 className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl">¥12.5万亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+6.2%</span>
            </div>
          </Card>
        </div>

        <Card className="p-3 bg-purple-500/10 border-purple-500/20">
          <div className="flex items-start gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400 mt-0.5" />
            <div>
              <p className="text-xs text-purple-400 mb-1">财富管理建议</p>
              <p className="text-xs text-slate-300">基金销售受市场波动影响下滑，建议加大低风险理财产品营销</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (type === 'logistics') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">合规风险事件</p>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-white text-xl">0</p>
             <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">运行平稳</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">反洗钱预警</p>
              <Shield className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-white text-xl">12</p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">待处理: 5</span>
            </div>
          </Card>

           <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">系统可用率</p>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-xl">99.99%</p>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">达标</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">监管报送</p>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-white text-xl">100%</p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">无逾期</span>
            </div>
          </Card>
        </div>

        <Card className="p-3 bg-green-500/10 border-green-500/20">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-xs text-green-400 mb-1">合规态势</p>
              <p className="text-xs text-slate-300">本月未发生重大合规风险事件，反洗钱系统运行正常</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
