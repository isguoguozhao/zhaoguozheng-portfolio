# Tasks

- [ ] Task 1: 准备后端部署配置
  - [ ] SubTask 1.1: 创建 requirements.txt 依赖文件
  - [ ] SubTask 1.2: 创建 Procfile 启动脚本
  - [ ] SubTask 1.3: 创建 railway.toml 配置文件
  - [ ] SubTask 1.4: 修改 main.py 支持 Railway 环境变量
  - [ ] SubTask 1.5: 配置 CORS 允许 Railway 域名

- [ ] Task 2: 准备前端部署配置
  - [ ] SubTask 2.1: 创建 .env.production 生产环境配置
  - [ ] SubTask 2.2: 修改 API 服务层使用环境变量
  - [ ] SubTask 2.3: 配置前端构建输出目录

- [ ] Task 3: 创建 GitHub 仓库并推送代码
  - [ ] SubTask 3.1: 初始化 Git 仓库
  - [ ] SubTask 3.2: 创建 .gitignore 文件
  - [ ] SubTask 3.3: 提交所有代码
  - [ ] SubTask 3.4: 推送到 GitHub 仓库

- [ ] Task 4: 部署到 Railway
  - [ ] SubTask 4.1: 登录 Railway 并连接 GitHub
  - [ ] SubTask 4.2: 从 GitHub 导入项目
  - [ ] SubTask 4.3: 配置环境变量
  - [ ] SubTask 4.4: 部署后端服务
  - [ ] SubTask 4.5: 部署前端服务（或配置静态站点）
  - [ ] SubTask 4.6: 配置自定义域名（可选）

- [ ] Task 5: 验证部署
  - [ ] SubTask 5.1: 测试前端页面访问
  - [ ] SubTask 5.2: 测试后端 API 访问
  - [ ] SubTask 5.3: 测试管理后台登录
  - [ ] SubTask 5.4: 测试数据读写功能

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 3
- Task 5 depends on Task 4
