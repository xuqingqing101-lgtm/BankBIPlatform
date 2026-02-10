import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search, FileText, Tag, Sparkles, Download, Eye, FolderOpen, Users, Building2, 
  Shield, BookOpen, Star, Filter, Settings, Upload, Edit, Trash2, Plus, X,
  Check, AlertCircle, File, FileSpreadsheet, FileImage, Video, Music
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MultiRoundAIQuery } from './MultiRoundAIQuery';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';

// 知识库层级定义
const knowledgeLibraries = [
  { 
    id: 'all', 
    name: '全员知识库', 
    icon: Users, 
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    description: '面向全行员工的通用知识库',
    docCount: 1258
  },
  { 
    id: 'compliance', 
    name: '合规知识库', 
    icon: Shield, 
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    description: '监管政策、合规制度、反洗钱规范',
    docCount: 385
  },
  { 
    id: 'business', 
    name: '业务知识库', 
    icon: BookOpen, 
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    description: '存贷汇业务操作手册、产品说明',
    docCount: 542
  },
  { 
    id: 'branch', 
    name: '机构知识库', 
    icon: Building2, 
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    description: '按分支机构定制的本地化知识',
    docCount: 231
  },
];

// 角色定制知识库
const roleLibraries = [
  { role: '客户经理', count: 156, topics: ['营销话术', '产品推荐', '客户维护'] },
  { role: '风控专员', count: 98, topics: ['风险评估', '不良处置', '合规检查'] },
  { role: '柜员', count: 142, topics: ['柜面业务', '操作规范', '应急处理'] },
  { role: '信贷审批', count: 87, topics: ['授信政策', '尽调要点', '审批标准'] },
  { role: '网点负责人', count: 73, topics: ['经营管理', '团队管理', '考核指标'] },
];

// 分支机构知识库
const branchLibraries = [
  { branch: '华东分行', count: 68, topics: ['本地政策', '区域客户', '业务案例'] },
  { branch: '华南分行', count: 52, topics: ['本地政策', '区域客户', '业务案例'] },
  { branch: '华北分行', count: 45, topics: ['本地政策', '区域客户', '业务案例'] },
  { branch: '西南分行', count: 38, topics: ['本地政策', '区域客户', '业务案例'] },
];

// 全员知识库文档
const initialAllStaffDocuments = [
  { id: 1, name: '员工手册2024版', category: '制度规范', tags: ['入职', '培训'], date: '2024-01-15', library: 'all', views: 2850, size: '2.5 MB', type: 'pdf' },
  { id: 2, name: '银行业务基础知识', category: '培训教材', tags: ['基础', '培训'], date: '2024-02-20', library: 'all', views: 3200, size: '4.2 MB', type: 'pdf' },
  { id: 3, name: '信息安全管理规定', category: '制度规范', tags: ['安全', '保密'], date: '2024-03-10', library: 'all', views: 1950, size: '1.8 MB', type: 'docx' },
  { id: 4, name: '办公系统使用指南', category: '操作手册', tags: ['OA', '系统'], date: '2024-01-05', library: 'all', views: 4100, size: '3.6 MB', type: 'pdf' },
];

// 合规知识库文档
const initialComplianceDocuments = [
  { id: 11, name: '反洗钱管理办法', category: '监管政策', tags: ['反洗钱', 'AML'], date: '2024-03-15', library: 'compliance', views: 1580, size: '1.2 MB', type: 'pdf' },
  { id: 12, name: '银行业监督管理法', category: '法律法规', tags: ['监管', '法律'], date: '2024-01-20', library: 'compliance', views: 2150, size: '2.8 MB', type: 'pdf' },
  { id: 13, name: '客户身份识别指引', category: '操作指引', tags: ['KYC', '身份识别'], date: '2024-02-10', library: 'compliance', views: 1890, size: '1.5 MB', type: 'docx' },
  { id: 14, name: '大额交易报告制度', category: '监管政策', tags: ['大额', '报告'], date: '2024-03-25', library: 'compliance', views: 1650, size: '980 KB', type: 'pdf' },
  { id: 15, name: '合规案例汇编2024', category: '案例分析', tags: ['案例', '违规'], date: '2024-02-28', library: 'compliance', views: 2380, size: '5.2 MB', type: 'pdf' },
];

// 业务知识库文档
const initialBusinessDocuments = [
  { id: 21, name: '对公存款业务手册', category: '业务指南', tags: ['对公', '存款'], date: '2024-03-05', library: 'business', views: 2250, size: '3.2 MB', type: 'pdf' },
  { id: 22, name: '零售贷款操作流程', category: '业务指南', tags: ['零售', '贷款'], date: '2024-02-15', library: 'business', views: 3100, size: '2.8 MB', type: 'docx' },
  { id: 23, name: '个人住房贷款产品说明书', category: '产品文档', tags: ['房贷', '产品'], date: '2024-01-10', library: 'business', views: 2890, size: '1.8 MB', type: 'pdf' },
  { id: 24, name: '授信审批标准V3.0', category: '业务指南', tags: ['授信', '审批'], date: '2024-03-20', library: 'business', views: 1950, size: '2.2 MB', type: 'xlsx' },
  { id: 25, name: '中间业务收费标准', category: '价格政策', tags: ['收费', '中间业务'], date: '2024-02-05', library: 'business', views: 1780, size: '1.5 MB', type: 'xlsx' },
];

// 机构知识库文档
const initialBranchDocuments = [
  { id: 31, name: '华东分行业务案例集', category: '案例分析', tags: ['案例', '华东'], date: '2024-03-01', library: 'branch', branch: '华东分行', views: 850, size: '4.5 MB', type: 'pdf' },
  { id: 32, name: '华南分行客户营销方案', category: '营销方案', tags: ['营销', '华南'], date: '2024-02-20', library: 'branch', branch: '华南分行', views: 720, size: '2.1 MB', type: 'pptx' },
  { id: 33, name: '华北分行本地化政策汇编', category: '政策文件', tags: ['政策', '华北'], date: '2024-01-25', library: 'branch', branch: '华北分行', views: 680, size: '1.9 MB', type: 'docx' },
];

const exampleQueries = [
  '如何办理对公账户开户？',
  '个人住房贷款的审批流程是什么？',
  '反洗钱可疑交易的识别标准？',
  '大额现金存取需要注意什么？',
  '信用卡分期业务的操作规范？',
];

// 文件类型图标
const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <File className="w-4 h-4 text-red-400" />;
    case 'docx':
    case 'doc':
      return <FileText className="w-4 h-4 text-blue-400" />;
    case 'xlsx':
    case 'xls':
      return <FileSpreadsheet className="w-4 h-4 text-green-400" />;
    case 'pptx':
    case 'ppt':
      return <FileImage className="w-4 h-4 text-orange-400" />;
    case 'mp4':
    case 'avi':
      return <Video className="w-4 h-4 text-purple-400" />;
    case 'mp3':
    case 'wav':
      return <Music className="w-4 h-4 text-pink-400" />;
    default:
      return <FileText className="w-4 h-4 text-slate-400" />;
  }
};

interface KnowledgeBaseProps {
  onPin?: (query: string, response: string, category: string) => void;
}

export function KnowledgeBase({ onPin }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLibrary, setActiveLibrary] = useState('all');
  const [selectedRole, setSelectedRole] = useState('客户经理');
  const [selectedBranch, setSelectedBranch] = useState('华东分行');
  
  // 文档管理状态
  const [allStaffDocs, setAllStaffDocs] = useState(initialAllStaffDocuments);
  const [complianceDocs, setComplianceDocs] = useState(initialComplianceDocuments);
  const [businessDocs, setBusinessDocs] = useState(initialBusinessDocuments);
  const [branchDocs, setBranchDocs] = useState(initialBranchDocuments);
  
  // 对话框状态
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<any>(null);
  
  // 上传表单状态
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: '制度规范',
    tags: '',
    description: '',
    file: null as File | null
  });

  const getDocsForLibrary = (libId: string) => {
    switch (libId) {
      case 'all':
        return allStaffDocs;
      case 'compliance':
        return complianceDocs;
      case 'business':
        return businessDocs;
      case 'branch':
        return branchDocs;
      default:
        return allStaffDocs;
    }
  };

  const setDocumentsByLibrary = (docs: any[]) => {
    switch (activeLibrary) {
      case 'all':
        setAllStaffDocs(docs);
        break;
      case 'compliance':
        setComplianceDocs(docs);
        break;
      case 'business':
        setBusinessDocs(docs);
        break;
      case 'branch':
        setBranchDocs(docs);
        break;
    }
  };

  const currentDocs = getDocsForLibrary(activeLibrary).filter(doc => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(query) || 
      doc.category.toLowerCase().includes(query) ||
      doc.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  });

  // 上传文档
  const handleUpload = () => {
    if (!uploadForm.name || !uploadForm.category) {
      alert('请填写文档名称和分类');
      return;
    }

    const newDoc = {
      id: Date.now(),
      name: uploadForm.name,
      category: uploadForm.category,
      tags: uploadForm.tags.split(',').map(t => t.trim()).filter(t => t),
      date: new Date().toISOString().split('T')[0],
      library: activeLibrary,
      views: 0,
      size: uploadForm.file ? `${(uploadForm.file.size / 1024 / 1024).toFixed(1)} MB` : '1.0 MB',
      type: uploadForm.file?.name.split('.').pop() || 'pdf'
    };

    setDocumentsByLibrary([newDoc, ...currentDocs]);
    setUploadDialogOpen(false);
    setUploadForm({ name: '', category: '制度规范', tags: '', description: '', file: null });
  };

  // 编辑文档
  const handleEdit = (doc: any) => {
    setCurrentDoc(doc);
    setUploadForm({
      name: doc.name,
      category: doc.category,
      tags: doc.tags.join(', '),
      description: '',
      file: null
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentDoc) return;

    const updatedDocs = currentDocs.map(doc => 
      doc.id === currentDoc.id 
        ? {
            ...doc,
            name: uploadForm.name,
            category: uploadForm.category,
            tags: uploadForm.tags.split(',').map(t => t.trim()).filter(t => t)
          }
        : doc
    );

    setDocumentsByLibrary(updatedDocs);
    setEditDialogOpen(false);
    setCurrentDoc(null);
    setUploadForm({ name: '', category: '制度规范', tags: '', description: '', file: null });
  };

  // 删除文档
  const handleDelete = (docId: number) => {
    if (confirm('确定要删除这个文档吗？')) {
      setDocumentsByLibrary(currentDocs.filter(doc => doc.id !== docId));
    }
  };

  // 打标签
  const handleTag = (doc: any) => {
    setCurrentDoc(doc);
    setUploadForm({
      ...uploadForm,
      tags: doc.tags.join(', ')
    });
    setTagDialogOpen(true);
  };

  const handleSaveTags = () => {
    if (!currentDoc) return;

    const updatedDocs = currentDocs.map(doc =>
      doc.id === currentDoc.id
        ? {
            ...doc,
            tags: uploadForm.tags.split(',').map(t => t.trim()).filter(t => t)
          }
        : doc
    );

    setDocumentsByLibrary(updatedDocs);
    setTagDialogOpen(false);
    setCurrentDoc(null);
    setUploadForm({ name: '', category: '制度规范', tags: '', description: '', file: null });
  };

  // 获取分类选项
  const getCategoryOptions = () => {
    switch (activeLibrary) {
      case 'all':
        return ['制度规范', '培训教材', '操作手册', '通知公告'];
      case 'compliance':
        return ['监管政策', '法律法规', '操作指引', '案例分析'];
      case 'business':
        return ['业务指南', '产品文档', '价格政策', '营销方案'];
      case 'branch':
        return ['案例分析', '营销方案', '政策文件', '本地规范'];
      default:
        return ['其他'];
    }
  };

  return (
    <div className="space-y-6">
      {/* 知识库层级选择 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {knowledgeLibraries.map((lib) => {
          const Icon = lib.icon;
          const isActive = activeLibrary === lib.id;
          return (
            <Card 
              key={lib.id}
              className={`cursor-pointer transition-all ${
                isActive 
                  ? 'bg-slate-700/50 border-blue-500 ring-2 ring-blue-500/50' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => setActiveLibrary(lib.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${lib.bg}`}>
                    <Icon className={`w-5 h-5 ${lib.color}`} />
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {getDocsForLibrary(lib.id).length}
                  </Badge>
                </div>
                <h3 className="text-slate-100 font-medium mb-1">{lib.name}</h3>
                <p className="text-xs text-slate-400">{lib.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-700/30">
          <TabsTrigger value="search" className="text-slate-300 data-[state=active]:bg-slate-600/50 data-[state=active]:text-white">智能检索</TabsTrigger>
          <TabsTrigger value="manage" className="text-slate-300 data-[state=active]:bg-slate-600/50 data-[state=active]:text-white">文档管理</TabsTrigger>
          <TabsTrigger value="role" className="text-slate-300 data-[state=active]:bg-slate-600/50 data-[state=active]:text-white">角色定制</TabsTrigger>
          <TabsTrigger value="branch" className="text-slate-300 data-[state=active]:bg-slate-600/50 data-[state=active]:text-white">机构定制</TabsTrigger>
          <TabsTrigger value="favorite" className="text-slate-300 data-[state=active]:bg-slate-600/50 data-[state=active]:text-white">我的收藏</TabsTrigger>
        </TabsList>

        {/* 智能检索 */}
        <TabsContent value="search" className="space-y-6">
          {/* Search Bar */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    placeholder={`在${knowledgeLibraries.find(l => l.id === activeLibrary)?.name}中搜索...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4 mr-2" />
                  搜索
                </Button>
              </div>

              {/* 快速分类 */}
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">快速筛选：</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getCategoryOptions().map((cat, i) => (
                  <Badge key={i} variant="secondary" className={`${
                    activeLibrary === 'all' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    activeLibrary === 'compliance' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    activeLibrary === 'business' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  } cursor-pointer hover:opacity-80`}>
                    {cat}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI智能问答 */}
          <MultiRoundAIQuery 
            title="知识库智能问答"
            placeholder="向我提问任何业务、合规、操作相关的问题..."
            exampleQueries={exampleQueries}
            category="知识库"
            onPin={onPin}
            backendModule="knowledge"
            useKnowledgeApi={true}
          />


          {/* 文档列表（精简版） */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100">最近文档</CardTitle>
                  <CardDescription className="text-slate-400">最近更新的 {Math.min(5, currentDocs.length)} 个文档</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => document.querySelector('[value="manage"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
                >
                  查看全部 →
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentDocs.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      {getFileIcon(doc.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {doc.category}
                          </Badge>
                          <span className="text-xs text-slate-500">{doc.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="hover:bg-slate-700 text-slate-400">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-slate-700 text-slate-400">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 文档管理 */}
        <TabsContent value="manage" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100">文档管理</CardTitle>
                  <CardDescription className="text-slate-400">
                    共 {currentDocs.length} 个文档 · 上传、编辑、打标、删除
                  </CardDescription>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  上传文档
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">文档名称</TableHead>
                      <TableHead className="text-slate-300">分类</TableHead>
                      <TableHead className="text-slate-300">标签</TableHead>
                      <TableHead className="text-slate-300">大小</TableHead>
                      <TableHead className="text-slate-300">更新日期</TableHead>
                      <TableHead className="text-slate-300">浏览量</TableHead>
                      <TableHead className="text-right text-slate-300">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentDocs.map((doc) => (
                      <TableRow key={doc.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell>
                          <div className="flex items-center gap-2 text-slate-200">
                            {getFileIcon(doc.type)}
                            <span className="max-w-[200px] truncate">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {doc.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap max-w-[200px]">
                            {doc.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">{doc.size}</TableCell>
                        <TableCell className="text-slate-400">{doc.date}</TableCell>
                        <TableCell className="text-slate-400">{doc.views}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-slate-700 text-slate-400 h-8 w-8 p-0"
                              title="查看"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-slate-700 text-slate-400 h-8 w-8 p-0"
                              onClick={() => handleTag(doc)}
                              title="打标签"
                            >
                              <Tag className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-slate-700 text-slate-400 h-8 w-8 p-0"
                              onClick={() => handleEdit(doc)}
                              title="编辑"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-slate-700 text-red-400 h-8 w-8 p-0"
                              onClick={() => handleDelete(doc.id)}
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-slate-700 text-slate-400 h-8 w-8 p-0"
                              title="下载"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 角色定制 */}
        <TabsContent value="role" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">按角色定制知识库</CardTitle>
              <CardDescription className="text-slate-400">
                根据您的岗位角色，为您推荐最相关的业务知识和操作手册
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">选择您的角色</label>
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-3 border border-slate-600 rounded-lg bg-slate-900/50 text-slate-200"
                >
                  {roleLibraries.map((role) => (
                    <option key={role.role} value={role.role}>{role.role}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {roleLibraries.map((role) => (
                  <Card 
                    key={role.role}
                    className={`cursor-pointer transition-all ${
                      selectedRole === role.role
                        ? 'bg-slate-700/50 border-blue-500 ring-2 ring-blue-500/50'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => setSelectedRole(role.role)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-slate-100 font-medium">{role.role}</h3>
                        <Badge className="bg-blue-500/20 text-blue-400">{role.count}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.topics.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 角色定制内容展示 */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">{selectedRole} - 推荐文档</CardTitle>
              <CardDescription className="text-slate-400">
                为 {selectedRole} 量身定制的业务知识库
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedRole === '客户经理' && [
                  { name: '客户营销话术技巧', category: '营销指南', hot: true },
                  { name: '理财产品推荐策略', category: '产品手册', hot: true },
                  { name: 'VIP客户维护方案', category: '客户管理', hot: false },
                  { name: '异议处理100问', category: '技能培训', hot: true },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-200">{doc.name}</p>
                          {doc.hot && <Badge className="bg-red-500/20 text-red-400 text-xs">热门</Badge>}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{doc.category}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      查看 →
                    </Button>
                  </div>
                ))}
                {selectedRole === '风控专员' && [
                  { name: '信贷风险评估模型', category: '风控工具', hot: true },
                  { name: '不良资产处置实操', category: '业务指南', hot: true },
                  { name: '合规检查清单2024', category: '合规文档', hot: false },
                  { name: '反欺诈案例汇编', category: '案例分析', hot: true },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-200">{doc.name}</p>
                          {doc.hot && <Badge className="bg-red-500/20 text-red-400 text-xs">热门</Badge>}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{doc.category}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      查看 →
                    </Button>
                  </div>
                ))}
                {selectedRole === '柜员' && [
                  { name: '柜面业务操作手册', category: '操作指南', hot: true },
                  { name: '常见问题快速处理', category: '应急手册', hot: true },
                  { name: '客户服务礼仪规范', category: '服务标准', hot: false },
                  { name: '业务差错防范要点', category: '风险管理', hot: true },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-200">{doc.name}</p>
                          {doc.hot && <Badge className="bg-red-500/20 text-red-400 text-xs">热门</Badge>}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{doc.category}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      查看 →
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 机构定制 */}
        <TabsContent value="branch" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">按机构定制知识库</CardTitle>
              <CardDescription className="text-slate-400">
                根据您所在的分支机构，提供本地化的政策、案例和业务指引
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">选择您的分支机构</label>
                <select 
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full p-3 border border-slate-600 rounded-lg bg-slate-900/50 text-slate-200"
                >
                  {branchLibraries.map((branch) => (
                    <option key={branch.branch} value={branch.branch}>{branch.branch}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {branchLibraries.map((branch) => (
                  <Card 
                    key={branch.branch}
                    className={`cursor-pointer transition-all ${
                      selectedBranch === branch.branch
                        ? 'bg-slate-700/50 border-purple-500 ring-2 ring-purple-500/50'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => setSelectedBranch(branch.branch)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-400" />
                          <h3 className="text-slate-100 font-medium">{branch.branch}</h3>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-400">{branch.count}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {branch.topics.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 机构定制内容展示 */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">{selectedBranch} - 本地化知识库</CardTitle>
              <CardDescription className="text-slate-400">
                {selectedBranch}专属的政策文件和业务案例
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: `${selectedBranch}2024年业务案例集`, category: '案例分析', date: '2024-03-01', isNew: true },
                  { name: `${selectedBranch}本地化客户营销方案`, category: '营销方案', date: '2024-02-15', isNew: true },
                  { name: `${selectedBranch}区域政策汇编`, category: '政策文件', date: '2024-01-20', isNew: false },
                  { name: `${selectedBranch}重点客户名录`, category: '客户资料', date: '2024-02-28', isNew: false },
                  { name: `${selectedBranch}网点分布与特色`, category: '机构信息', date: '2024-01-05', isNew: false },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-purple-500/50 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-200">{doc.name}</p>
                          {doc.isNew && <Badge className="bg-green-500/20 text-green-400 text-xs">新</Badge>}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">{doc.category}</Badge>
                          <span className="text-xs text-slate-500">{doc.date}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      查看 →
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 我的收藏 */}
        <TabsContent value="favorite" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                我的收藏
              </CardTitle>
              <CardDescription className="text-slate-400">
                您收藏的常用文档和知识库内容
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: '个人住房贷款产品说明书', library: '业务知识库', category: '产品文档', star: true },
                  { name: '反洗钱管理办法', library: '合规知识库', category: '监管政策', star: true },
                  { name: '客户营销话术技巧', library: '角色定制', category: '营销指南', star: true },
                  { name: '对公存款业务手册', library: '业务知识库', category: '业务指南', star: true },
                  { name: '华东分行业务案例集', library: '机构知识库', category: '案例分析', star: true },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-yellow-500/50 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <div>
                        <p className="text-slate-200">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">{doc.library}</Badge>
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">{doc.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300">
                        <Star className="w-4 h-4 fill-yellow-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 上传文档对话框 */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              上传文档到 {knowledgeLibraries.find(l => l.id === activeLibrary)?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              上传新文档并设置分类和标签
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">文档名称 *</Label>
              <Input
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                placeholder="例如：对公存款业务手册"
                className="bg-slate-900/50 border-slate-600 text-slate-100"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">选择文件</Label>
              <Input
                type="file"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                className="bg-slate-900/50 border-slate-600 text-slate-100"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              />
              <p className="text-xs text-slate-500">支持 PDF、Word、Excel、PowerPoint 格式，最大 50MB</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">分类 *</Label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                className="w-full p-2.5 bg-slate-900/50 border border-slate-600 rounded-md text-slate-100"
              >
                {getCategoryOptions().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">标签</Label>
              <Input
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                placeholder="多个标签用逗号分隔，例如：对公,存款,开户"
                className="bg-slate-900/50 border-slate-600 text-slate-100"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">描述</Label>
              <Textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="简要描述文档内容..."
                className="bg-slate-900/50 border-slate-600 text-slate-100 min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setUploadDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              取消
            </Button>
            <Button
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="w-4 h-4 mr-2" />
              上传
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑文档对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-100 flex items-center gap-2">
              <Edit className="w-5 h-5 text-blue-400" />
              编辑文档信息
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              修改文档的名称、分类和标签
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">文档名称 *</Label>
              <Input
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                className="bg-slate-900/50 border-slate-600 text-slate-100"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">分类 *</Label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                className="w-full p-2.5 bg-slate-900/50 border border-slate-600 rounded-md text-slate-100"
              >
                {getCategoryOptions().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">标签</Label>
              <Input
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                className="bg-slate-900/50 border-slate-600 text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              取消
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 打标签对话框 */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-slate-100 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-400" />
              编辑标签
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              为文档添加或修改标签，用逗号分隔
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">标签</Label>
              <Input
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                placeholder="例如：对公,存款,开户"
                className="bg-slate-900/50 border-slate-600 text-slate-100"
              />
              <p className="text-xs text-slate-500">多个标签用逗号分隔</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">常用标签：</Label>
              <div className="flex flex-wrap gap-2">
                {['对公', '零售', '贷款', '存款', '反洗钱', '合规', '风控', '营销', '产品', '培训'].map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => {
                      const tags = uploadForm.tags ? uploadForm.tags.split(',').map(t => t.trim()) : [];
                      if (!tags.includes(tag)) {
                        setUploadForm({ ...uploadForm, tags: [...tags, tag].join(', ') });
                      }
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {uploadForm.tags && (
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">当前标签：</Label>
                <div className="flex flex-wrap gap-2">
                  {uploadForm.tags.split(',').map(t => t.trim()).filter(t => t).map((tag, i) => (
                    <Badge
                      key={i}
                      className="bg-blue-500/20 text-blue-400 border-blue-500/30 pr-1"
                    >
                      {tag}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400"
                        onClick={() => {
                          const tags = uploadForm.tags.split(',').map(t => t.trim()).filter(t => t !== tag);
                          setUploadForm({ ...uploadForm, tags: tags.join(', ') });
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setTagDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              取消
            </Button>
            <Button
              onClick={handleSaveTags}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
