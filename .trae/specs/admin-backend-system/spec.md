# 后端管理系统 Spec

## Why
为个人作品集网站设计一套完整的后端管理系统，使管理员能够通过可视化界面管理网站的所有内容，包括图片、文字、卡片样式、作品展示、经验背景、技能专长和社交联系方式等，实现网站内容的动态化和可配置化。

## What Changes
- **新增** FastAPI后端API，提供完整的CRUD接口
- **新增** 数据库模型设计（SQLAlchemy + SQLite/PostgreSQL）
- **新增** 图片上传和管理功能
- **新增** 卡片样式配置系统（尺寸、旋转方向）
- **新增** 作品类别管理系统
- **新增** 作品卡片管理系统（增删改查）
- **新增** 经验背景管理系统（教育/工作经历）
- **新增** 技能专长管理系统
- **新增** 社交联系方式管理系统
- **新增** 管理员认证系统（JWT）
- **修改** 前端静态数据改为动态API获取
- **修改** 前端组件支持动态渲染

## Impact
- Affected specs: 数据持久化、内容管理、用户认证
- Affected code:
  - portfolio-website/backend/main.py（扩展）
  - portfolio-website/backend/models/（新增）
  - portfolio-website/backend/routers/（新增）
  - portfolio-website/backend/schemas/（新增）
  - portfolio-website/backend/services/（新增）
  - portfolio-website/backend/admin/（新增管理后台）
  - portfolio-website/frontend/src/data/（修改为API调用）

## ADDED Requirements

### Requirement: 图片管理系统
The system SHALL provide a complete image management system that allows uploading, deleting, and organizing images.

#### Scenario: 图片上传
- **GIVEN** an admin user is authenticated
- **WHEN** they upload an image file
- **THEN** the system stores the image and returns a URL

#### Scenario: 图片删除
- **GIVEN** an admin user is authenticated
- **WHEN** they delete an image
- **THEN** the system removes the image from storage

#### Scenario: 图片列表
- **GIVEN** an admin user accesses the image management page
- **WHEN** the page loads
- **THEN** all uploaded images are displayed with thumbnails

### Requirement: 卡片样式配置系统
The system SHALL allow configuring card styles including dimensions, rotation, and image placement.

#### Scenario: 卡片尺寸配置
- **GIVEN** an admin edits a card
- **WHEN** they set width and height values
- **THEN** the card displays with the specified dimensions

#### Scenario: 卡片旋转配置
- **GIVEN** an admin edits a card
- **WHEN** they set a rotation angle
- **THEN** the card displays with the specified rotation

#### Scenario: 卡片图片配置
- **GIVEN** an admin edits a card
- **WHEN** they select an image from the image library
- **THEN** the card displays the selected image

### Requirement: 作品类别管理系统
The system SHALL provide CRUD operations for project categories.

#### Scenario: 创建类别
- **GIVEN** an admin creates a new category
- **WHEN** they provide category name and description
- **THEN** the category is saved and available for projects

#### Scenario: 更新类别
- **GIVEN** an admin edits an existing category
- **WHEN** they modify category details
- **THEN** the changes are persisted and reflected in the UI

#### Scenario: 删除类别
- **GIVEN** an admin deletes a category
- **WHEN** they confirm deletion
- **THEN** the category is removed (or marked as inactive if projects exist)

### Requirement: 作品卡片管理系统
The system SHALL provide comprehensive CRUD operations for project cards with all specified fields.

#### Scenario: 创建作品卡片
- **GIVEN** an admin creates a new project
- **WHEN** they fill in all fields (name, image, category, date, role, description, tech stack, achievements)
- **THEN** the project card is created and displayed

#### Scenario: 编辑作品卡片
- **GIVEN** an admin edits an existing project
- **WHEN** they modify any field
- **THEN** the changes are saved and the UI updates

#### Scenario: 删除作品卡片
- **GIVEN** an admin deletes a project
- **WHEN** they confirm deletion
- **THEN** the project is removed from the system

### Requirement: 经验背景管理系统
The system SHALL manage education and work experience entries with full editing capabilities.

#### Scenario: 管理教育经历
- **GIVEN** an admin manages education entries
- **WHEN** they add, edit, or delete entries
- **THEN** the timeline updates accordingly

#### Scenario: 管理工作经历
- **GIVEN** an admin manages work experience entries
- **WHEN** they add, edit, or delete entries
- **THEN** the timeline updates accordingly

### Requirement: 技能专长管理系统
The system SHALL manage skill categories and individual skills within each category.

#### Scenario: 管理技能类别
- **GIVEN** an admin manages skill categories
- **WHEN** they add, rename, or delete categories
- **THEN** the skills section updates

#### Scenario: 管理技能项
- **GIVEN** an admin manages individual skills
- **WHEN** they add, edit proficiency, or delete skills
- **THEN** the skill bars update

### Requirement: 社交联系方式管理系统
The system SHALL allow managing social contact icons and their links.

#### Scenario: 修改社交图标
- **GIVEN** an admin edits social links
- **WHEN** they change the icon type
- **THEN** the displayed icon updates

#### Scenario: 修改跳转链接
- **GIVEN** an admin edits social links
- **WHEN** they change the URL
- **THEN** the link destination updates

### Requirement: 管理员认证系统
The system SHALL provide secure authentication for admin users.

#### Scenario: 管理员登录
- **GIVEN** an admin provides credentials
- **WHEN** they submit the login form
- **THEN** they receive a JWT token for authenticated requests

#### Scenario: 访问保护
- **GIVEN** an unauthenticated user tries to access admin endpoints
- **WHEN** they make the request
- **THEN** the system returns 401 Unauthorized

## MODIFIED Requirements

### Requirement: 前端数据获取方式
The system SHALL fetch data dynamically from APIs instead of using static data files.

#### Scenario: 页面加载
- **GIVEN** a user visits the portfolio page
- **WHEN** the page loads
- **THEN** data is fetched from the backend API

#### Scenario: 内容更新
- **GIVEN** an admin updates content in the backend
- **WHEN** a user refreshes the page
- **THEN** the updated content is displayed

## REMOVED Requirements
### Requirement: 静态数据文件
**Reason**: Data will be managed through the backend database
**Migration**: Move static data from profile.ts to database via admin interface
