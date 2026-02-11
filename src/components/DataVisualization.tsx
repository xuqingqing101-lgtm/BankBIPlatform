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
import { TrendingUp, AlertTriangle, CheckCircle, BarChart3, FileText } from 'lucide-react';

interface VisualizationData {
  type: 'chart' | 'table' | 'kpi';
  data: any;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function DataVisualization({ data }: { data: VisualizationData }) {
  if (data.type === 'chart') {
    const { chartType, title, series, xAxisKey = 'name', yAxisKey = 'value', yAxisKeys } = data.data;
    const keys = yAxisKeys || [yAxisKey];

    return (
      <Card className="p-4 bg-slate-800/50 border-slate-700/50 mt-4 shadow-lg">
        {title && <h4 className="text-slate-200 mb-4 font-medium flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-400"/>{title}</h4>}
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'line' ? (
            <LineChart data={series} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid #334155', 
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: '#e2e8f0' }}
                cursor={{ stroke: '#475569', strokeWidth: 1 }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {keys.map((key: string, index: number) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]} 
                  strokeWidth={3} 
                  name={key}
                  dot={{ fill: COLORS[index % COLORS.length], r: 4, strokeWidth: 2, stroke: '#1e293b' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          ) : chartType === 'bar' ? (
            <BarChart data={series} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: '#334155', opacity: 0.2 }}
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid #334155', 
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {keys.map((key: string, index: number) => (
                <Bar 
                  key={key}
                  dataKey={key}
                  fill={COLORS[index % COLORS.length]} 
                  name={key}
                  radius={[4, 4, 0, 0]}
                  barSize={keys.length > 1 ? undefined : 40}
                >
                  {keys.length === 1 && series.map((entry: any, i: number) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={series}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey={yAxisKey}
                nameKey={xAxisKey}
              >
                {series.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid #334155', 
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          )}
        </ResponsiveContainer>
      </Card>
    );
  }

  if (data.type === 'table') {
    const { headers, rows } = data.data;
    
    return (
      <Card className="p-4 bg-slate-800/50 border-slate-700/50 mt-4 shadow-lg overflow-hidden">
        <h4 className="text-slate-200 mb-4 font-medium flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400"/>数据详情</h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                {headers.map((header: string, i: number) => (
                  <TableHead key={i} className="text-slate-300 font-medium">{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any[], i: number) => (
                <TableRow key={i} className="border-slate-700 hover:bg-slate-700/50">
                  {row.map((cell: any, j: number) => (
                    <TableCell key={j} className="text-slate-300">
                      {typeof cell === 'number' ? cell.toLocaleString() : cell}
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

  if (data.type === 'kpi') {
    const { items } = data.data;
    
    return (
      <div className="grid grid-cols-3 gap-4 mt-4">
        {items.map((item: any, i: number) => (
          <Card key={i} className="p-3 bg-slate-800/50 border-slate-700/50 shadow-lg">
            <p className="text-xs text-slate-400 mb-1">{item.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-lg font-bold text-white">{item.value}</span>
              {item.status === 'excellent' && <CheckCircle className="w-4 h-4 text-green-500 mb-1" />}
              {item.status === 'good' && <TrendingUp className="w-4 h-4 text-blue-500 mb-1" />}
              {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 mb-1" />}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return null;
}
