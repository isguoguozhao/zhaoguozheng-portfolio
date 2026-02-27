# 同步前端数据到后端 Spec

## Why
前端页面已经包含了完整的个人资料、作品、经验、技能等数据，但后端数据库是空的。为了让后台管理系统能够正常使用并管理这些数据，需要将前端现有的静态数据导入到后端数据库中，实现前后端数据同步。

## What Changes
- **新增** 后端数据初始化脚本，自动导入前端静态数据
- **新增** 数据迁移工具，将 profile.ts 中的数据转换为数据库记录
- **新增** 图片资源复制功能，将前端图片复制到后端上传目录
- **修改** 后端启动时自动检查并初始化数据
- **修改** 前端数据文件作为数据迁移的源文件

## Impact
- Affected specs: admin-backend-system
- Affected code:
  - portfolio-website/backend/main.py（添加数据初始化逻辑）
  - portfolio-website/backend/init_data.py（新增）
  - portfolio-website/frontend/src/data/profile.ts（作为数据源）

## ADDED Requirements

### Requirement: 个人资料数据同步
The system SHALL import profile data from frontend to backend database on first startup.

#### Scenario: 个人资料初始化
- **GIVEN** the backend starts for the first time
- **WHEN** the database is empty
- **THEN** the system imports profile data (name, title, bio, email, phone, location) from profile.ts

### Requirement: 作品数据同步
The system SHALL import all project data from frontend to backend database.

#### Scenario: 作品类别初始化
- **GIVEN** the backend starts with empty categories
- **WHEN** checking project categories from profile.ts
- **THEN** the system creates unique categories (小程序开发, 人工智能, Web应用, 数据可视化)

#### Scenario: 作品项目初始化
- **GIVEN** the backend starts with empty projects
- **WHEN** importing projects from profile.ts
- **THEN** all 6 projects are created with their details (title, category, description, technologies, role, duration, achievements)

### Requirement: 经验背景数据同步
The system SHALL import experience data from frontend to backend database.

#### Scenario: 教育经历初始化
- **GIVEN** the backend starts with empty experiences
- **WHEN** importing education entries from profile.ts
- **THEN** the education experience is created (成都东软学院)

#### Scenario: 工作经历初始化
- **GIVEN** the backend starts with empty experiences
- **WHEN** importing work entries from profile.ts
- **THEN** the work experiences are created (太原市文庙街道办事处, 四川奥古斯塔科技有限公司)

### Requirement: 技能数据同步
The system SHALL import skill data from frontend to backend database.

#### Scenario: 技能类别初始化
- **GIVEN** the backend starts with empty skill categories
- **WHEN** importing skills from profile.ts
- **THEN** unique categories are created (编程语言, 移动开发, 前端框架, 后端框架, 数据库, 数据科学, 人工智能)

#### Scenario: 技能项初始化
- **GIVEN** skill categories exist
- **WHEN** importing individual skills from profile.ts
- **THEN** all 12 skills are created with their proficiency levels

### Requirement: 社交链接数据同步
The system SHALL import social link data from frontend to backend database.

#### Scenario: 社交链接初始化
- **GIVEN** the backend starts with empty social links
- **WHEN** importing social data from profile.ts
- **THEN** social links are created (GitHub, LinkedIn, WeChat)

### Requirement: 图片资源同步
The system SHALL handle image references from frontend data.

#### Scenario: 图片路径处理
- **GIVEN** projects have image references in profile.ts
- **WHEN** importing project data
- **THEN** image URLs are stored and can be resolved by the backend

## MODIFIED Requirements

### Requirement: 后端启动流程
The system SHALL check and initialize data on startup if database is empty.

#### Scenario: 首次启动
- **GIVEN** the backend starts
- **WHEN** the database tables are empty
- **THEN** the system automatically imports all data from frontend

#### Scenario: 非首次启动
- **GIVEN** the backend starts
- **WHEN** the database already has data
- **THEN** the system skips initialization to avoid duplicates

## REMOVED Requirements
None
