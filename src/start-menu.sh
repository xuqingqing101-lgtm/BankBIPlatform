#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

clear

echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║       🏦 银行智能AI分析平台 - 启动中心             ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${WHITE}           请选择要启动的服务${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}[1]${NC} 🚀 启动后端服务 ${CYAN}(Spring Boot - 8080端口)${NC}"
echo ""

echo -e "${GREEN}[2]${NC} 🌐 启动前端服务 ${CYAN}(React + Vite - 3000端口)${NC}"
echo ""

echo -e "${GREEN}[3]${NC} 🔧 首次部署前端 ${YELLOW}(需要10分钟，只运行一次)${NC}"
echo ""

echo -e "${GREEN}[4]${NC} 📊 同时启动前后端 ${CYAN}(在后台运行后端)${NC}"
echo ""

echo -e "${GREEN}[5]${NC} 🧪 测试API接口 ${CYAN}(健康检查)${NC}"
echo ""

echo -e "${GREEN}[6]${NC} 📚 查看帮助文档"
echo ""

echo -e "${GREEN}[0]${NC} 🚪 退出"
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""

read -p "$(echo -e ${WHITE}请输入选项 [0-6]: ${NC})" choice

case $choice in
    1)
        clear
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo -e "${WHITE}         正在启动后端服务...${NC}"
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo ""
        
        # 检查脚本是否有执行权限
        if [ ! -x "backend-start.sh" ]; then
            echo -e "${YELLOW}⚠️  添加执行权限...${NC}"
            chmod +x backend-start.sh
        fi
        
        ./backend-start.sh
        ;;
        
    2)
        clear
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo -e "${WHITE}         正在启动前端服务...${NC}"
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo ""
        
        if [ ! -d "frontend" ]; then
            echo -e "${RED}❌ frontend 目录不存在！${NC}"
            echo ""
            echo -e "${YELLOW}💡 请先运行选项 [3] 首次部署前端${NC}"
            echo ""
            read -p "按 Enter 返回主菜单..."
            exec bash "$0"
            exit 0
        fi
        
        if [ ! -x "frontend-start.sh" ]; then
            chmod +x frontend-start.sh
        fi
        
        ./frontend-start.sh
        ;;
        
    3)
        clear
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo -e "${WHITE}         前端首次部署...${NC}"
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo ""
        
        if [ -d "frontend" ]; then
            echo -e "${YELLOW}⚠️  检测到 frontend 目录已存在${NC}"
            echo ""
            read -p "是否重新部署？[y/N]: " confirm
            
            if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
                echo -e "${CYAN}已取消部署${NC}"
                read -p "按 Enter 返回主菜单..."
                exec bash "$0"
                exit 0
            fi
        fi
        
        if [ ! -x "frontend-deploy.sh" ]; then
            chmod +x frontend-deploy.sh
        fi
        
        ./frontend-deploy.sh
        ;;
        
    4)
        clear
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo -e "${WHITE}         同时启动前后端...${NC}"
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo ""
        
        echo -e "${YELLOW}💡 后端将在后台运行，前端在前台运行${NC}"
        echo ""
        read -p "按 Enter 继续..."
        
        # 启动后端到后台
        echo -e "${CYAN}[1/2] 启动后端（后台）...${NC}"
        if [ ! -x "backend-start.sh" ]; then
            chmod +x backend-start.sh
        fi
        ./backend-start.sh > backend.log 2>&1 &
        BACKEND_PID=$!
        
        echo -e "${GREEN}✅ 后端已启动 (PID: $BACKEND_PID)${NC}"
        echo -e "${CYAN}📝 日志文件: backend.log${NC}"
        echo ""
        
        # 等待后端启动
        echo -e "${YELLOW}⏳ 等待后端启动（30秒）...${NC}"
        sleep 30
        
        # 启动前端
        echo ""
        echo -e "${CYAN}[2/2] 启动前端...${NC}"
        
        if [ ! -d "frontend" ]; then
            echo -e "${RED}❌ frontend 目录不存在！${NC}"
            echo -e "${YELLOW}💡 请先运行选项 [3] 首次部署前端${NC}"
            
            # 停止后端
            echo -e "${YELLOW}正在停止后端...${NC}"
            kill $BACKEND_PID 2>/dev/null
            
            read -p "按 Enter 返回主菜单..."
            exec bash "$0"
            exit 0
        fi
        
        if [ ! -x "frontend-start.sh" ]; then
            chmod +x frontend-start.sh
        fi
        
        ./frontend-start.sh
        
        # 前端停止后，也停止后端
        echo ""
        echo -e "${YELLOW}前端已停止，正在停止后端...${NC}"
        kill $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✅ 后端已停止${NC}"
        ;;
        
    5)
        clear
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo -e "${WHITE}         API 接口测试${NC}"
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo ""
        
        echo -e "${CYAN}[测试] 后端健康检查...${NC}"
        echo ""
        
        if command -v curl &> /dev/null; then
            response=$(curl -s http://localhost:8080/api/health)
            
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ 后端服务正常运行${NC}"
                echo ""
                echo -e "${CYAN}响应内容：${NC}"
                echo "$response" | python -m json.tool 2>/dev/null || echo "$response"
            else
                echo -e "${RED}❌ 无法连接到后端服务${NC}"
                echo ""
                echo -e "${YELLOW}💡 请确保后端已启动：${NC}"
                echo "   ./backend-start.sh"
            fi
        else
            echo -e "${YELLOW}⚠️  未安装 curl 工具${NC}"
            echo ""
            echo -e "${CYAN}请在浏览器访问：${NC}"
            echo "   http://localhost:8080/api/health"
        fi
        
        echo ""
        echo -e "${CYAN}─────────────────────────────────────────────────────${NC}"
        echo ""
        
        echo -e "${CYAN}[测试] 前端服务...${NC}"
        echo ""
        
        if command -v curl &> /dev/null; then
            status_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
            
            if [ "$status_code" = "200" ]; then
                echo -e "${GREEN}✅ 前端服务正常运行${NC}"
                echo ""
                echo -e "${CYAN}访问地址：${NC}"
                echo "   http://localhost:3000"
            else
                echo -e "${RED}❌ 前端服务未运行${NC}"
                echo ""
                echo -e "${YELLOW}💡 请先启动前端：${NC}"
                echo "   ./frontend-start.sh"
            fi
        fi
        
        echo ""
        read -p "按 Enter 返回主菜单..."
        exec bash "$0"
        ;;
        
    6)
        clear
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo -e "${WHITE}         帮助文档${NC}"
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo ""
        
        echo -e "${GREEN}📚 可用文档：${NC}"
        echo ""
        echo "  1. Git_Bash运行指南.md      - 完整使用指南"
        echo "  2. Git_Bash速查.md          - 快速参考"
        echo "  3. 前端本地运行完整指南.md  - 前端部署详解"
        echo "  4. 本地运行指南.md          - 后端运行指南"
        echo "  5. API测试工具.html         - API 可视化测试"
        echo ""
        
        echo -e "${CYAN}💡 快速帮助：${NC}"
        echo ""
        echo -e "${YELLOW}查看文档：${NC}"
        echo "  cat Git_Bash速查.md"
        echo ""
        echo -e "${YELLOW}在浏览器打开：${NC}"
        echo "  start API测试工具.html"
        echo ""
        
        echo -e "${CYAN}📞 常见问题：${NC}"
        echo ""
        echo -e "${YELLOW}Q: Permission denied${NC}"
        echo "A: chmod +x *.sh"
        echo ""
        echo -e "${YELLOW}Q: 前端目录不存在${NC}"
        echo "A: 先运行选项 [3] 部署前端"
        echo ""
        echo -e "${YELLOW}Q: 端口被占用${NC}"
        echo "A: 关闭占用端口的程序"
        echo "   - 后端: 8080"
        echo "   - 前端: 3000"
        echo ""
        
        read -p "按 Enter 返回主菜单..."
        exec bash "$0"
        ;;
        
    0)
        clear
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo -e "${WHITE}         👋 谢谢使用！${NC}"
        echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
        echo ""
        exit 0
        ;;
        
    *)
        echo ""
        echo -e "${RED}❌ 无效选项！${NC}"
        echo ""
        read -p "按 Enter 返回主菜单..."
        exec bash "$0"
        ;;
esac
