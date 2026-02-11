import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface VisualizationData {
  type: 'chart' | 'table' | 'kpi';
  data: any;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function DataVisualization({ data }: { data: VisualizationData }) {
  if (data.type === 'chart') {
    const { chartType, title, series } = data.data;

    return (
      <Card className="p-4 bg-slate-800/50 border-slate-700/50 mt-4">
        <h4 className="text-slate-200 mb-4">{title}</h4>
        <ResponsiveContainer width="100%" height={280}>
          {chartType === 'line' ? (
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569', 
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                name="数值"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          ) : chartType === 'bar' ? (
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis 
                dataKey="category" 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569', 
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
                formatter={(value: any) => {
                  if (typeof value === 'number') {
                    return value >= 1000 ? `${(value / 1000).toFixed(1)}千亿` : `${value}亿`;
                  }
                  return value;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Bar 
                dataKey="amount" 
                fill="#3b82f6" 
                name="金额（亿元）"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          ) : chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={series}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {series.map((entry: any, index: number) => (
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
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
            </PieChart>
          ) : (
            // 默认柱状图
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569', 
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="value" fill="#3b82f6" name="数值" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Card>
    );
  }

  if (data.type === 'kpi') {
    return (
      <div className="grid grid-cols-3 gap-3 mt-4">
        {data.data.items.map((item: any, index: number) => (
          <Card key={index} className="p-4 bg-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2">{item.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-white text-xl font-medium">{item.value}</p>
              {item.status === 'excellent' && <CheckCircle className="w-5 h-5 text-green-400" />}
              {item.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
              {item.status === 'normal' && <TrendingUp className="w-5 h-5 text-blue-400" />}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (data.type === 'table') {
    return (
      <Card className="p-4 bg-slate-800/50 border-slate-700/50 overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                {data.data.headers.map((header: string, index: number) => (
                  <TableHead key={index} className="text-slate-300 font-medium">{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.rows.map((row: any[], rowIndex: number) => (
                <TableRow key={rowIndex} className="border-slate-700/50 hover:bg-slate-700/30">
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="text-slate-200">
                      {cellIndex === row.length - 1 && typeof cell === 'string' && ['warning', 'good', 'normal'].includes(cell) ? (
                        <Badge 
                          variant="secondary"
                          className={
                            cell === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            cell === 'good' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            'bg-slate-500/20 text-slate-400 border-slate-500/30'
                          }
                        >
                          {cell === 'warning' ? '预警' : cell === 'good' ? '良好' : '正常'}
                        </Badge>
                      ) : (
                        cell
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  }

  return null;
}
