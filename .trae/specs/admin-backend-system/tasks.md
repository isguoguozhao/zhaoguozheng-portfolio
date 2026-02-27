# Tasks

- [x] Task 1: 设计数据库模型
  - [x] SubTask 1.1: 设计Image模型（图片上传记录）
  - [x] SubTask 1.2: 设计CardStyle模型（卡片样式配置）
  - [x] SubTask 1.3: 设计ProjectCategory模型（作品类别）
  - [x] SubTask 1.4: 设计Project模型（作品卡片）
  - [x] SubTask 1.5: 设计Experience模型（经验背景）
  - [x] SubTask 1.6: 设计SkillCategory和Skill模型（技能专长）
  - [x] SubTask 1.7: 设计SocialLink模型（社交联系方式）
  - [x] SubTask 1.8: 设计AdminUser模型（管理员用户）

- [x] Task 2: 搭建后端基础架构
  - [x] SubTask 2.1: 配置SQLAlchemy数据库连接
  - [x] SubTask 2.2: 创建数据库迁移脚本（Alembic）
  - [x] SubTask 2.3: 设置项目目录结构（models, routers, schemas, services）
  - [x] SubTask 2.4: 配置CORS和中间件

- [x] Task 3: 实现管理员认证系统
  - [x] SubTask 3.1: 实现JWT token生成和验证
  - [x] SubTask 3.2: 创建登录/登出API
  - [x] SubTask 3.3: 实现密码哈希（bcrypt）
  - [x] SubTask 3.4: 添加认证依赖注入

- [x] Task 4: 实现图片管理系统
  - [x] SubTask 4.1: 实现图片上传API（支持多格式）
  - [x] SubTask 4.2: 实现图片删除API
  - [x] SubTask 4.3: 实现图片列表查询API
  - [x] SubTask 4.4: 配置静态文件服务
  - [x] SubTask 4.5: 添加图片压缩和缩略图生成

- [ ] Task 5: 实现卡片样式配置系统
  - [ ] SubTask 5.1: 创建CardStyle CRUD API
  - [ ] SubTask 5.2: 支持尺寸配置（width, height）
  - [ ] SubTask 5.3: 支持旋转角度配置（rotation）
  - [ ] SubTask 5.4: 支持图片关联配置

- [x] Task 6: 实现作品类别管理系统
  - [x] SubTask 6.1: 创建ProjectCategory CRUD API
  - [x] SubTask 6.2: 实现类别排序功能
  - [x] SubTask 6.3: 处理类别删除时的关联项目

- [x] Task 7: 实现作品卡片管理系统
  - [x] SubTask 7.1: 创建Project CRUD API
  - [x] SubTask 7.2: 实现项目字段管理（名称、图片、类别、日期、角色、简介、技术栈、成果）
  - [x] SubTask 7.3: 实现项目与类别的关联
  - [x] SubTask 7.4: 实现项目排序功能
  - [x] SubTask 7.5: 添加项目详情富文本支持

- [x] Task 8: 实现经验背景管理系统
  - [x] SubTask 8.1: 创建Experience CRUD API
  - [x] SubTask 8.2: 支持教育经历和工作经历类型
  - [x] SubTask 8.3: 实现时间线排序
  - [x] SubTask 8.4: 支持图片上传（公司/学校logo）

- [x] Task 9: 实现技能专长管理系统
  - [x] SubTask 9.1: 创建SkillCategory CRUD API
  - [x] SubTask 9.2: 创建Skill CRUD API
  - [x] SubTask 9.3: 实现技能熟练度配置（0-100）
  - [x] SubTask 9.4: 实现技能排序

- [x] Task 10: 实现社交联系方式管理系统
  - [x] SubTask 10.1: 创建SocialLink CRUD API
  - [x] SubTask 10.2: 支持图标类型选择（预设图标库）
  - [x] SubTask 10.3: 支持URL链接配置
  - [x] SubTask 10.4: 实现排序功能

- [x] Task 11: 实现前端数据获取
  - [x] SubTask 11.1: 创建API服务层（axios封装）
  - [x] SubTask 11.2: 修改Profile组件使用API数据
  - [x] SubTask 11.3: 修改Projects组件使用API数据
  - [x] SubTask 11.4: 修改Experience组件使用API数据
  - [x] SubTask 11.5: 修改About组件使用API数据
  - [x] SubTask 11.6: 修改Contact/Footer组件使用API数据

- [x] Task 12: 创建管理后台界面
  - [x] SubTask 12.1: 创建登录页面
  - [x] SubTask 12.2: 创建Dashboard首页
  - [x] SubTask 12.3: 创建图片管理页面
  - [x] SubTask 12.4: 创建卡片样式管理页面
  - [x] SubTask 12.5: 创建作品类别管理页面
  - [x] SubTask 12.6: 创建作品卡片管理页面
  - [x] SubTask 12.7: 创建经验背景管理页面
  - [x] SubTask 12.8: 创建技能专长管理页面
  - [x] SubTask 12.9: 创建社交联系方式管理页面

- [ ] Task 13: 测试与部署
  - [ ] SubTask 13.1: 编写API单元测试
  - [ ] SubTask 13.2: 集成测试
  - [ ] SubTask 13.3: 性能测试
  - [ ] SubTask 13.4: 编写部署文档

# Task Dependencies
- Task 2 depends on Task 1
- Task 3-10 can be executed in parallel after Task 2
- Task 11 depends on Task 3-10
- Task 12 depends on Task 11
- Task 13 depends on Task 12
