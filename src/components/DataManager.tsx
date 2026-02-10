import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Upload, FileSpreadsheet, Trash2, Plus, Save, Play, CheckCircle2, AlertCircle, RefreshCw, Database, Tag, BarChart2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { uploadData, getDataTables } from '../lib/api';

interface TableData {
  id: string;
  name: string;
  size: string;
  date: string;
  status: string;
  rows: number;
}

// 模拟的指标定义
const initialMetrics = [
  { id: 1, name: '存款余额', code: 'DEPOSIT_BAL', formula: 'sum(balance)', type: '原子指标' },
  { id: 2, name: '存款日均', code: 'DEPOSIT_AVG', formula: 'sum(daily_balance)/days', type: '衍生指标' },
];

export function DataManager() {
  const [activeTab, setActiveTab] = useState('import');
  const [tables, setTables] = useState<TableData[]>([]);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [uploading, setUploading] = useState(false);
  
  // 加载数据表
  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const response = await getDataTables();
      if (response.success) {
        const mappedTables = response.data.map((t: any) => ({
          id: t.id,
          name: t.displayName,
          size: '-',
          date: t.createdTime?.split('T')[0] || '-',
          status: '已清洗', // 后端直接存库，视为已处理
          rows: t.rowCount
        }));
        setTables(mappedTables);
      }
    } catch (error) {
      console.error('Failed to load tables', error);
    }
  };
  
  // 处理上传
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const response = await uploadData(file);
        if (response.success) {
          toast.success('文件上传成功', { description: '数据已自动清洗并存入数据库' });
          await loadTables();
        } else {
          toast.error('上传失败', { description: response.message });
        }
      } catch (error) {
        toast.error('上传出错', { description: String(error) });
      } finally {
        setUploading(false);
      }
    }
  };

  // 模拟清洗 (已废弃，后端自动处理)
  const handleClean = (id: string) => {
    toast.info('数据已由后端自动清洗');
  };

  // 模拟字段 (实际应从后端获取列信息)
  const mockFields = [
    { name: 'cust_id', type: 'VARCHAR', label: '客户号', category: '维度' },
    { name: 'org_code', type: 'VARCHAR', label: '机构代码', category: '维度' },
    { name: 'balance', type: 'DOUBLE', label: '余额', category: '指标' },
    { name: 'open_date', type: 'DATE', label: '开户日期', category: '时间' },
    { name: 'age', type: 'INT', label: '年龄', category: '维度' },
  ];

  return (
    <div className="space-y-6 p-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">数据管理中心</h2>
          <p className="text-slate-400 mt-1">一站式完成数据导入、清洗、建模与指标定义</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            同步元数据
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Play className="w-4 h-4 mr-2" />
            自动处理任务
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="import" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">
            <Upload className="w-4 h-4 mr-2" />
            数据导入
          </TabsTrigger>
          <TabsTrigger value="clean" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">
            <Settings className="w-4 h-4 mr-2" />
            数据清洗
          </TabsTrigger>
          <TabsTrigger value="label" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">
            <Tag className="w-4 h-4 mr-2" />
            数据分类与打标
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">
            <BarChart2 className="w-4 h-4 mr-2" />
            指标设置
          </TabsTrigger>
        </TabsList>

        {/* 数据导入 Tab */}
        <TabsContent value="import" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">已上传数据表</CardTitle>
                <CardDescription className="text-slate-400">管理已上传到系统的源数据文件</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">文件名</TableHead>
                      <TableHead className="text-slate-300">大小</TableHead>
                      <TableHead className="text-slate-300">上传日期</TableHead>
                      <TableHead className="text-slate-300">状态</TableHead>
                      <TableHead className="text-slate-300">行数</TableHead>
                      <TableHead className="text-right text-slate-300">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tables.map(table => (
                      <TableRow key={table.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell className="font-medium text-white flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-green-400" />
                          {table.name}
                        </TableCell>
                        <TableCell className="text-slate-400">{table.size}</TableCell>
                        <TableCell className="text-slate-400">{table.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            table.status === '已清洗' 
                              ? 'border-green-500/30 text-green-400 bg-green-500/10' 
                              : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                          }>
                            {table.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">{table.rows.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">上传新数据</CardTitle>
                <CardDescription className="text-slate-400">支持 .xlsx, .csv 格式</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors bg-slate-900/50">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-300 mb-2">拖拽文件到此处 或</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleUpload}
                      disabled={uploading}
                    />
                    <Button disabled={uploading} className="bg-blue-600 hover:bg-blue-700">
                      {uploading ? '上传中...' : '选择文件'}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-4">单次最大支持 100MB</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 数据清洗 Tab */}
        <TabsContent value="clean" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">数据清洗规则配置</CardTitle>
              <CardDescription className="text-slate-400">配置自动化清洗策略，提升数据质量</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    <h3 className="font-medium text-white">缺失值处理</h3>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">数值型字段</Label>
                    <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white">
                      <option>填充为 0</option>
                      <option>填充为平均值</option>
                      <option>丢弃该行</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">文本型字段</Label>
                    <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white">
                      <option>填充为 "未知"</option>
                      <option>填充为空字符串</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    <h3 className="font-medium text-white">异常值检测</h3>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">检测标准</Label>
                    <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white">
                      <option>3倍标准差 (3-Sigma)</option>
                      <option>箱线图 (IQR)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" className="rounded border-slate-600 bg-slate-800" id="auto-fix" />
                    <Label htmlFor="auto-fix" className="text-slate-300 text-sm">自动修正异常值</Label>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    <h3 className="font-medium text-white">数据格式化</h3>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">日期格式</Label>
                    <Input defaultValue="YYYY-MM-DD" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">金额单位</Label>
                    <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white">
                      <option>保持原样</option>
                      <option>统一转换为"元"</option>
                      <option>统一转换为"万元"</option>
                    </select>
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/50">
                    <TableHead className="text-slate-300">待处理文件</TableHead>
                    <TableHead className="text-slate-300">状态</TableHead>
                    <TableHead className="text-slate-300">预估耗时</TableHead>
                    <TableHead className="text-right text-slate-300">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.filter(t => t.status === '待处理').map(table => (
                    <TableRow key={table.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="font-medium text-white">{table.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-yellow-400 border-yellow-500/30">待清洗</Badge></TableCell>
                      <TableCell className="text-slate-400">约 30 秒</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleClean(table.id)} className="bg-blue-600 hover:bg-blue-700">
                          执行清洗
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tables.filter(t => t.status === '待处理').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-500 py-8">没有待清洗的数据</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 数据打标 Tab */}
        <TabsContent value="label" className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/4">
              <Card className="bg-slate-800/50 border-slate-700 h-full">
                <CardHeader>
                  <CardTitle className="text-white text-base">选择数据表</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tables.map(table => (
                      <div key={table.id} className="p-3 rounded bg-slate-900/50 border border-slate-700 hover:border-blue-500 cursor-pointer flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-200 truncate">{table.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex-1">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">字段打标</CardTitle>
                  <CardDescription className="text-slate-400">为字段添加业务含义，帮助AI更准确地理解数据</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700 hover:bg-slate-700/50">
                        <TableHead className="text-slate-300">字段名</TableHead>
                        <TableHead className="text-slate-300">数据类型</TableHead>
                        <TableHead className="text-slate-300">业务标签 (Label)</TableHead>
                        <TableHead className="text-slate-300">字段分类</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockFields.map((field, i) => (
                        <TableRow key={i} className="border-slate-700 hover:bg-slate-700/50">
                          <TableCell className="font-mono text-slate-300">{field.name}</TableCell>
                          <TableCell>
                            <select defaultValue={field.type} className="h-8 bg-slate-800 border border-slate-600 rounded text-sm text-white px-2 cursor-pointer hover:bg-slate-700 focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors">
                              <option value="VARCHAR" className="bg-slate-800">VARCHAR (文本)</option>
                              <option value="INT" className="bg-slate-800">INT (整数)</option>
                              <option value="DOUBLE" className="bg-slate-800">DOUBLE (小数)</option>
                              <option value="DATE" className="bg-slate-800">DATE (日期)</option>
                            </select>
                          </TableCell>
                          <TableCell>
                            <Input defaultValue={field.label} className="h-8 bg-slate-900 border-slate-600 text-white" />
                          </TableCell>
                          <TableCell>
                            <select defaultValue={field.category} className="h-8 bg-slate-800 border border-slate-600 rounded text-sm text-white px-2 cursor-pointer hover:bg-slate-700 focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors">
                              <option className="bg-slate-800">维度</option>
                              <option className="bg-slate-800">指标</option>
                              <option className="bg-slate-800">时间</option>
                              <option className="bg-slate-800">其他</option>
                            </select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 flex justify-end">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      保存配置
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 指标设置 Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">业务指标定义</CardTitle>
                <CardDescription className="text-slate-400">定义原子指标和衍生指标，构建统一的指标体系</CardDescription>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                新增指标
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/50">
                    <TableHead className="text-slate-300">指标名称</TableHead>
                    <TableHead className="text-slate-300">指标代码</TableHead>
                    <TableHead className="text-slate-300">计算公式 / 来源</TableHead>
                    <TableHead className="text-slate-300">类型</TableHead>
                    <TableHead className="text-right text-slate-300">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map(metric => (
                    <TableRow key={metric.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="font-medium text-white">{metric.name}</TableCell>
                      <TableCell className="font-mono text-slate-400">{metric.code}</TableCell>
                      <TableCell className="font-mono text-blue-300 bg-blue-900/20 px-2 py-1 rounded inline-block text-xs">
                        {metric.formula}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={metric.type === '原子指标' ? 'text-purple-400 border-purple-500/30' : 'text-orange-400 border-orange-500/30'}>
                          {metric.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Settings className="w-4 h-4" />
                        </Button>
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
