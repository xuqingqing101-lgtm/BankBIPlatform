import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Shield, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileCheck,
  Landmark,
  HandCoins,
  PiggyBank
} from 'lucide-react';

interface DashboardProps {
  type: 'dashboard' | 'deposit' | 'loan' | 'intermediate' | 'customer';
}

export function QuickDashboard({ type }: DashboardProps) {
  if (type === 'dashboard') {
    // 经营管理驾驶舱
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">本月营收</p>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-xl mb-1">¥132亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+15.2%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">净利润</p>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl mb-1">¥42亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+18.5%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">资产总额</p>
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-white text-xl mb-1">¥5350亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+12.8%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">资产收益率</p>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl mb-1">0.95%</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+0.05pp</span>
            </div>
          </Card>
        </div>

        <Card className="p-3 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p className="text-xs text-blue-400 mb-1">经营状况优秀</p>
              <p className="text-xs text-slate-300">全行经营指标稳步增长，各项监管指标均达标</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (type === 'deposit') {
    // 存款业务分析
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">存款总额</p>
              <Landmark className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-xl mb-1">¥520亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+9.5%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">对公存款</p>
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-white text-xl mb-1">¥312亿</p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">占比60%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">零售存款</p>
              <Users className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl mb-1">¥208亿</p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">占比40%</span>
            </div>
          </Card>
        </div>

        <Card className="p-3 bg-green-500/10 border-green-500/20">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-xs text-green-400 mb-1">存款增长稳健</p>
              <p className="text-xs text-slate-300">对公零售结构合理，存款稳定性良好</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (type === 'loan') {
    // 贷款业务分析
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">贷款余额</p>
              <HandCoins className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-xl mb-1">¥380亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+12.3%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">不良贷款率</p>
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl mb-1">1.35%</p>
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">-0.08pp</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">拨备覆盖率</p>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl mb-1">185%</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+5.2pp</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">高风险客户</p>
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-white text-xl mb-1">15户</p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">涉及2.3亿</span>
            </div>
          </Card>
        </div>

        <Card className="p-3 bg-green-500/10 border-green-500/20">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-xs text-green-400 mb-1">风险可控</p>
              <p className="text-xs text-slate-300">贷款质量良好，风险指标持续优化</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (type === 'intermediate') {
    // 中间业务分析
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">手续费收入</p>
              <DollarSign className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-xl mb-1">¥18.5亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+22.5%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">理财规模</p>
              <PiggyBank className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-white text-xl mb-1">¥285亿</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+18.2%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">银行卡数量</p>
              <CreditCard className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl mb-1">528万张</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+12.8%</span>
            </div>
          </Card>
        </div>

        <Card className="p-3 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p className="text-xs text-blue-400 mb-1">中间业务增长强劲</p>
              <p className="text-xs text-slate-300">理财、银行卡、汇款业务全面增长</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (type === 'customer') {
    // 客户画像分析
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">总客户数</p>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-xl mb-1">285万户</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+8.5%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">对公客户</p>
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-white text-xl mb-1">3.8万户</p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">贡献65%收入</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">零售客户</p>
              <Users className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-xl mb-1">281万户</p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">活跃率72%</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">高净值客户</p>
              <DollarSign className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-white text-xl mb-1">2850户</p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">AUM 185亿</span>
            </div>
          </Card>
        </div>

        <Card className="p-3 bg-pink-500/10 border-pink-500/20">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-pink-400 mt-0.5" />
            <div>
              <p className="text-xs text-pink-400 mb-1">客户结构优质</p>
              <p className="text-xs text-slate-300">高净值客户增长迅速，客户活跃度高</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
