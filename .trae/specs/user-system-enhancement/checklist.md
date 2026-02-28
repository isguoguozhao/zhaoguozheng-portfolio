# Checklist

## 后端数据库模型
- [x] User 模型包含：id, username, password_hash, email, avatar, points, created_at, updated_at
- [x] VisitLog 模型包含：id, ip_address, user_agent, visited_at
- [x] EmailVerification 模型包含：id, user_id, email, code, expires_at, created_at
- [x] CheckIn 模型包含：id, user_id, check_in_date, points_earned, created_at
- [x] Points 模型包含：id, user_id, points, reason, created_at

## 后端 API
- [x] POST /api/auth/register - 用户注册
- [x] POST /api/auth/login - 用户登录
- [x] POST /api/auth/logout - 用户登出
- [x] GET /api/stats/visits - 获取访问统计
- [x] POST /api/stats/visit - 记录访问
- [x] GET /api/user/profile - 获取用户信息
- [x] PUT /api/user/profile - 更新用户信息
- [x] POST /api/user/avatar - 上传头像
- [x] POST /api/email/send-code - 发送邮箱验证码
- [x] POST /api/email/verify - 验证并绑定邮箱
- [x] POST /api/checkin - 每日签到
- [x] GET /api/checkin/status - 获取签到状态
- [x] GET /api/points - 获取积分记录

## 前端组件
- [x] Header 组件显示用户头像入口（右上角）
- [x] 访问统计组件显示在首页左上角
- [x] 登录页面包含用户名、密码输入框
- [x] 注册页面包含用户名、密码、确认密码输入框
- [x] 用户信息页面显示头像、用户名、邮箱、积分
- [x] 用户信息页面支持编辑头像和用户名
- [x] 邮箱绑定组件包含邮箱输入和验证码输入
- [x] 签到组件显示今日签到状态和按钮
- [x] 积分组件显示当前积分
- [x] 管理系统入口按钮在用户信息页面底部居中

## 功能验证
- [ ] 未登录时点击头像进入登录页面
- [ ] 已登录时点击头像进入用户信息页面
- [ ] 注册功能正常工作（用户名唯一性检查）
- [ ] 登录功能正常工作（JWT token）
- [ ] 访问统计每次刷新页面增加
- [ ] 用户信息可以正常编辑和保存
- [ ] 邮箱验证码可以正常发送（6位中英文）
- [ ] 邮箱可以正常绑定
- [ ] 每日签到可以正常获取1-10随机积分
- [ ] 重复签到提示今日已签到
- [ ] 管理系统入口可以正常跳转到后台登录
