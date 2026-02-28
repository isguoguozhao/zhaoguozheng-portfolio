# Tasks

- [x] Task 1: 后端数据库模型设计
  - [x] SubTask 1.1: 创建 User 模型（用户表）
  - [x] SubTask 1.2: 创建 VisitLog 模型（访问日志表）
  - [x] SubTask 1.3: 创建 EmailVerification 模型（邮箱验证码表）
  - [x] SubTask 1.4: 创建 CheckIn 模型（签到记录表）
  - [x] SubTask 1.5: 创建 Points 模型（积分记录表）

- [x] Task 2: 后端 API 开发
  - [x] SubTask 2.1: 实现用户注册 API
  - [x] SubTask 2.2: 实现用户登录 API
  - [x] SubTask 2.3: 实现访问统计 API（记录+查询浏览量）
  - [x] SubTask 2.4: 实现用户信息获取/更新 API
  - [x] SubTask 2.5: 实现邮箱验证码发送 API
  - [x] SubTask 2.6: 实现邮箱绑定验证 API
  - [x] SubTask 2.7: 实现每日签到 API
  - [x] SubTask 2.8: 实现积分查询 API

- [x] Task 3: 前端组件开发
  - [x] SubTask 3.1: 修改 Header 组件，添加用户头像入口
  - [x] SubTask 3.2: 创建访问统计组件（首页左上角显示）
  - [x] SubTask 3.3: 创建登录/注册页面
  - [x] SubTask 3.4: 创建用户信息页面
  - [x] SubTask 3.5: 创建邮箱绑定组件
  - [x] SubTask 3.6: 创建签到组件
  - [x] SubTask 3.7: 创建积分显示组件
  - [x] SubTask 3.8: 创建管理系统入口按钮

- [x] Task 4: 前端状态管理
  - [x] SubTask 4.1: 创建用户状态管理（登录状态、用户信息）
  - [x] SubTask 4.2: 实现登录状态持久化（localStorage）
  - [x] SubTask 4.3: 创建 API 服务层（用户相关接口）

- [x] Task 5: 集成与测试
  - [x] SubTask 5.1: 集成前端路由（登录/注册/用户信息页面）
  - [x] SubTask 5.2: 测试用户注册登录流程
  - [x] SubTask 5.3: 测试访问统计功能
  - [x] SubTask 5.4: 测试邮箱绑定功能
  - [x] SubTask 5.5: 测试签到功能
  - [x] SubTask 5.6: 测试管理系统入口

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 can be done in parallel with Task 3
- Task 5 depends on Task 3 and Task 4
