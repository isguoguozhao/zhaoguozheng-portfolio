# 个人简历作品集网站

一个基于 React + TypeScript + FastAPI 构建的现代化个人简历作品集网站，用于全面展示信息管理与信息系统专业大学生的学术背景、专业能力、项目经验及设计成果。

## 技术栈

### 前端
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 构建工具
- **GSAP** - 动画库（含 ScrollTrigger 插件）
- **Lucide React** - 图标库
- **CSS3** - 样式（CSS Variables、Flexbox、Grid）

### 后端
- **FastAPI** - Python Web 框架
- **Uvicorn** - ASGI 服务器
- **Pydantic** - 数据验证

## 项目结构

```
portfolio-website/
├── frontend/                 # React 前端项目
│   ├── src/
│   │   ├── components/      # 组件
│   │   │   ├── Navbar.tsx   # 导航栏
│   │   │   ├── Hero.tsx     # 首页 Hero 区域
│   │   │   ├── Projects.tsx # 作品展示
│   │   │   ├── Experience.tsx # 经验背景
│   │   │   ├── About.tsx    # 关于我
│   │   │   ├── Contact.tsx  # 联系方式
│   │   │   └── Footer.tsx   # 页脚
│   │   ├── data/            # 数据文件
│   │   │   └── profile.ts   # 个人资料数据
│   │   ├── styles/          # 样式文件
│   │   │   └── global.css   # 全局样式
│   │   ├── types/           # TypeScript 类型
│   │   ├── App.tsx          # 主应用组件
│   │   └── main.tsx         # 入口文件
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                  # FastAPI 后端项目
│   ├── main.py              # 主应用
│   └── requirements.txt     # Python 依赖
├── docs/                     # 文档
│   └── README.md
└── assets/                   # 静态资源
    └── images/              # 图片资源
```

## 功能特性

### 导航系统
- 固定顶部导航栏，滚动时背景模糊效果
- 当前页面位置高亮显示
- 平滑滚动到对应板块（0.5-0.8秒过渡）
- 移动端汉堡菜单适配

### 首页 Hero 区
- 分层排版设计
- GSAP 入场动画
- 社交链接
- 向下滚动指示器

### 作品展示区
- 响应式网格画廊布局
- 分类筛选功能
- 作品详情模态框
- 悬停放大效果（1.05倍）

### 经验背景区
- 时间线布局
- 教育经历和工作经历展示
- 详细成就列表

### 关于我
- 个人简介
- 技能专长展示
- 技能进度条动画

### 联系方式
- 联系表单
- 联系信息展示
- 社交媒体链接

### 其他功能
- 返回顶部按钮（滚动超过500px显示）
- 页面加载动画
- 滚动触发动画
- 响应式设计（桌面/平板/移动端）

## 安装与运行

### 环境要求
- Node.js >= 18.0.0
- Python >= 3.8
- npm 或 yarn

### 前端安装

```bash
cd frontend

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

前端开发服务器默认运行在 http://localhost:5173

### 后端安装

```bash
cd backend

# 创建虚拟环境（推荐）
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 运行开发服务器
python main.py

# 或使用 uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

后端 API 默认运行在 http://localhost:8000

API 文档地址：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 部署说明

### 前端部署

#### 构建生产版本
```bash
cd frontend
npm run build
```

构建后的文件位于 `frontend/dist` 目录。

#### 部署到静态托管服务
可以将 `dist` 目录部署到以下服务：
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- 阿里云 OSS

### 后端部署

#### 使用 Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

构建并运行：
```bash
docker build -t portfolio-backend .
docker run -d -p 8000:8000 portfolio-backend
```

#### 使用 Gunicorn 部署
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 环境变量

后端支持以下环境变量：

```env
# .env
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-password
```

## 图片资源替换说明

项目中的图片使用占位符显示。如需替换为实际图片：

1. 将图片文件放入 `frontend/public/assets/images/` 目录
2. 支持的图片格式：JPG、PNG、WebP
3. 建议尺寸：
   - 项目缩略图：800x500px（16:10 比例）
   - 头像：400x400px（1:1 比例）
4. 在 `frontend/src/data/profile.ts` 中更新图片路径

## 自定义配置

### 修改个人信息
编辑 `frontend/src/data/profile.ts` 文件：

```typescript
export const profile: Profile = {
  name: '您的姓名',
  title: '您的专业',
  subtitle: '您的职位',
  bio: '您的个人简介',
  email: 'your.email@example.com',
  phone: '+86 123-4567-8900',
  location: '您的城市',
  // ...
};
```

### 添加/修改项目
在 `frontend/src/data/profile.ts` 的 `projects` 数组中添加：

```typescript
{
  id: 'unique-id',
  title: '项目名称',
  category: '项目分类',
  description: '简短描述',
  fullDescription: '详细描述',
  thumbnail: '/assets/images/project-image.jpg',
  images: [],
  technologies: ['技术1', '技术2'],
  role: '担任角色',
  duration: '项目时间',
  achievements: ['成果1', '成果2'],
}
```

### 修改主题颜色
编辑 `frontend/src/styles/global.css` 中的 CSS 变量：

```css
:root {
  --color-accent: #4A90A4;        /* 主题色 */
  --color-accent-light: #6BA3B5;  /* 浅色主题 */
  /* ... */
}
```

## API 接口说明

### 获取个人资料
```http
GET /api/profile
```

### 获取项目列表
```http
GET /api/projects
```

### 获取单个项目
```http
GET /api/projects/{project_id}
```

### 获取经历列表
```http
GET /api/experiences
```

### 获取技能列表
```http
GET /api/skills
```

### 发送联系消息
```http
POST /api/contact
Content-Type: application/json

{
  "name": "姓名",
  "email": "email@example.com",
  "message": "消息内容"
}
```

## 浏览器兼容性

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 性能优化

- 图片懒加载
- 组件按需加载
- CSS 变量减少重复代码
- GSAP 动画优化
- 响应式图片

## 许可证

MIT License

## 作者

赵国政 - 信息管理与信息系统专业

## 联系方式

- 邮箱: g3258968947@outlook.com
- 电话: +86 152-3424-0469
