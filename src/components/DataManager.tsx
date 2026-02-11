import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Upload, FileSpreadsheet, Trash2, Plus, Save, Play, CheckCircle2, AlertCircle, RefreshCw, Database, Tag, BarChart2, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadData, getDataTables, getTableColumns, updateColumn, cleanTable, getMetrics, createMetric, deleteMetric } from '../lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface TableData {
  id: string;
  name: string;
  size: string;
  date: string;
  status: string;
  rows: number;
}

interface ColumnData {
  id: number;
  columnName: string;
  displayName: string;
  dataType: string;
  columnRole: string;
}

interface MetricData {
  id: number;
  name: string;
  code: string;
  formula: string;
  type: string;
}

export function DataManager() {
  const [activeTab, setActiveTab] = useState('import');
  const [tables, setTables] = useState<TableData[]>([]);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [cleaning, setCleaning] = useState<string | null>(null);

  // Label Tab State
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [loadingColumns, setLoadingColumns] = useState(false);

  // Metrics Tab State
  const [isMetricDialogOpen, setIsMetricDialogOpen] = useState(false);
  const [newMetric, setNewMetric] = useState({ name: '', code: '', formula: '', type: '原子指标' });

  // 加载数据表
  useEffect(() => {
    loadTables();
  }, []);

  // 加载指标
  useEffect(() => {
    if (activeTab === 'metrics') {
      loadMetrics();
    }
  }, [activeTab]);

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
        if (mappedTables.length > 0 && !selectedTableId) {
            setSelectedTableId(mappedTables[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load tables', error);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await getMetrics();
      if (response.success) {
        setMetrics(response.data);
      }
    } catch (error) {
      console.error('Failed to load metrics', error);
    }
  }

  // 加载列信息
  useEffect(() => {
    if (selectedTableId && activeTab === 'label') {
      loadColumns(selectedTableId);
    }
  }, [selectedTableId, activeTab]);

  const loadColumns = async (tableId: string) => {
    setLoadingColumns(true);
    try {
      const response = await getTableColumns(tableId);
      if (response.success) {
        setColumns(response.data);
      }
    } catch (error) {
      toast.error('加载列信息失败');
    } finally {
      setLoadingColumns(false);
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

  // 处理清洗
  const handleClean = async (id: string) => {
    setCleaning(id);
    try {
      const response = await cleanTable(id);
      if (response.success) {
        toast.success('清洗完成', { description: response.data });
      } else {
        toast.error('清洗失败');
      }
    } catch (error) {
      toast.error('清洗出错');
    } finally {
      setCleaning(null);
    }
  };

  // 处理列修改
  const handleColumnChange = (index: number, field: keyof ColumnData, value: string) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setColumns(newColumns);
  };

  // 保存列配置
  const handleSaveColumns = async () => {
    try {
      // 串行更新，实际项目中应使用批量更新接口
      for (const col of columns) {
        await updateColumn(col.id, {
          displayName: col.displayName,
          role: col.columnRole,
          dataType: col.dataType
        });
      }
      toast.success('配置已保存');
    } catch (error) {
      toast.error('保存失败');
    }
  };

  // 处理新增指标
  const handleCreateMetric = async () => {
    try {
      const response = await createMetric(newMetric);
      if (response.success) {
        toast.success('指标创建成功');
        setIsMetricDialogOpen(false);
        loadMetrics();
        setNewMetric({ name: '', code: '', formula: '', type: '原子指标' });
      }
    } catch (error) {
      toast.error('创建失败');
    }
  };

  // 处理删除指标
  const handleDeleteMetric = async (id: number) => {
      if (confirm('确定要删除这个指标吗？')) {
        try {
            const response = await deleteMetric(id);
            if (response.success) {
                toast.success('指标已删除');
                loadMetrics();
            }
        } catch (error) {
            toast.error('删除失败');
        }
      }
  }

  return (
    <div className="space-y-6 p-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">数据管理中心</h2>
          <p className="text-slate-400 mt-1">一站式完成数据导入、清洗、建模与指标定义</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-300" onClick={loadTables}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新数据
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
              <CardTitle className="text-white">数据清洗任务</CardTitle>
              <CardDescription className="text-slate-400">对已上传的数据表执行清洗规则，提升数据质量</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/50">
                    <TableHead className="text-slate-300">数据表</TableHead>
                    <TableHead className="text-slate-300">状态</TableHead>
                    <TableHead className="text-slate-300">上次处理时间</TableHead>
                    <TableHead className="text-right text-slate-300">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.map(table => (
                    <TableRow key={table.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="font-medium text-white">{table.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-green-400 border-green-500/30">就绪</Badge></TableCell>
                      <TableCell className="text-slate-400">{table.date}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                            size="sm" 
                            onClick={() => handleClean(table.id)} 
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={cleaning === table.id}
                        >
                          {cleaning === table.id ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                清洗中...
                            </>
                          ) : '重新清洗'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                      <div 
                        key={table.id} 
                        className={`p-3 rounded border cursor-pointer flex items-center gap-2 transition-colors ${selectedTableId === table.id ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-900/50 border-slate-700 hover:border-blue-500'}`}
                        onClick={() => setSelectedTableId(table.id)}
                      >
                        <Database className={`w-4 h-4 ${selectedTableId === table.id ? 'text-blue-400' : 'text-slate-400'}`} />
                        <span className={`text-sm truncate ${selectedTableId === table.id ? 'text-white' : 'text-slate-200'}`}>{table.name}</span>
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
                  {loadingColumns ? (
                      <div className="flex justify-center py-10">
                          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      </div>
                  ) : (
                    <>
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
                        {columns.map((col, i) => (
                            <TableRow key={col.id} className="border-slate-700 hover:bg-slate-700/50">
                            <TableCell className="font-mono text-slate-300">{col.columnName}</TableCell>
                            <TableCell>
                                <select 
                                    value={col.dataType} 
                                    onChange={(e) => handleColumnChange(i, 'dataType', e.target.value)}
                                    className="h-8 bg-slate-800 border border-slate-600 rounded text-sm text-white px-2 cursor-pointer hover:bg-slate-700 focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors"
                                >
                                <option value="VARCHAR">VARCHAR (文本)</option>
                                <option value="INT">INT (整数)</option>
                                <option value="DOUBLE">DOUBLE (小数)</option>
                                <option value="DATE">DATE (日期)</option>
                                </select>
                            </TableCell>
                            <TableCell>
                                <Input 
                                    value={col.displayName || ''} 
                                    onChange={(e) => handleColumnChange(i, 'displayName', e.target.value)}
                                    className="h-8 bg-slate-900 border-slate-600 text-white" 
                                />
                            </TableCell>
                            <TableCell>
                                <select 
                                    value={col.columnRole} 
                                    onChange={(e) => handleColumnChange(i, 'columnRole', e.target.value)}
                                    className="h-8 bg-slate-800 border border-slate-600 rounded text-sm text-white px-2 cursor-pointer hover:bg-slate-700 focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors"
                                >
                                <option value="DIMENSION">维度</option>
                                <option value="METRIC">指标</option>
                                <option value="TIME">时间</option>
                                </select>
                            </TableCell>
                            </TableRow>
                        ))}
                        {columns.length === 0 && (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center text-slate-500 py-8">请选择左侧数据表以加载字段</TableCell>
                             </TableRow>
                        )}
                        </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-end">
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveColumns} disabled={columns.length === 0}>
                        <Save className="w-4 h-4 mr-2" />
                        保存配置
                        </Button>
                    </div>
                    </>
                  )}
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
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsMetricDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  新增指标
              </Button>
              <Dialog open={isMetricDialogOpen} onOpenChange={setIsMetricDialogOpen}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle>新增业务指标</DialogTitle>
                        <DialogDescription>
                            添加新的业务指标定义，以便在智能问数中引用。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">指标名称</Label>
                            <Input id="name" value={newMetric.name} onChange={(e) => setNewMetric({...newMetric, name: e.target.value})} className="col-span-3 bg-slate-900 border-slate-600" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">指标代码</Label>
                            <Input id="code" value={newMetric.code} onChange={(e) => setNewMetric({...newMetric, code: e.target.value})} className="col-span-3 bg-slate-900 border-slate-600" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="formula" className="text-right">计算公式</Label>
                            <Input id="formula" value={newMetric.formula} onChange={(e) => setNewMetric({...newMetric, formula: e.target.value})} className="col-span-3 bg-slate-900 border-slate-600" placeholder="e.g. sum(balance)" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">指标类型</Label>
                            <select 
                                id="type" 
                                value={newMetric.type} 
                                onChange={(e) => setNewMetric({...newMetric, type: e.target.value})} 
                                className="col-span-3 h-10 bg-slate-900 border border-slate-600 rounded-md px-3 text-sm"
                            >
                                <option value="原子指标">原子指标</option>
                                <option value="衍生指标">衍生指标</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleCreateMetric}>保存指标</Button>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
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
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => handleDeleteMetric(metric.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {metrics.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500 py-8">暂无指标定义</TableCell>
                     </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
