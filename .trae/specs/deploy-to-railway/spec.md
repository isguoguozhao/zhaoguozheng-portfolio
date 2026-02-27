# 部署到 Railway PaaS Spec

## Why
将个人作品集网站部署到 Railway PaaS 平台，使其可以通过公网 URL 访问，无需购买服务器，零成本实现网站上线。

## What Changes
- **新增** Railway 部署配置文件（railway.toml, Procfile）
- **新增** 生产环境配置（CORS、API地址等）
- **修改** 后端配置支持 Railway 环境变量
- **修改** 前端 API 地址配置支持生产环境
- **新增** GitHub Actions 自动部署（可选）
- **新增** 部署文档

## Impact
- Affected specs: admin-backend-system, sync-frontend-data-to-backend
- Affected code:
  - portfolio-website/backend/main.py（环境变量配置）
  - portfolio-website/backend/Procfile（新增）
  - portfolio-website/backend/railway.toml（新增）
  - portfolio-website/backend/requirements.txt（新增/更新）
  - portfolio-website/frontend/.env.production（新增）
  - portfolio-website/frontend/package.json（构建脚本）

## ADDED Requirements

### Requirement: Railway 配置文件
The system SHALL provide Railway-specific configuration files for deployment.

#### Scenario: 后端服务配置
- **GIVEN** Railway platform requirements
- **WHEN** deploying the backend
- **THEN** railway.toml and Procfile configure the service correctly

#### Scenario: 依赖管理
- **GIVEN** Python dependencies
- **WHEN** Railway builds the service
- **THEN** requirements.txt lists all required packages

### Requirement: 生产环境配置
The system SHALL support production environment configuration.

#### Scenario: CORS 配置
- **GIVEN** the app runs on Railway
- **WHEN** frontend makes API requests
- **THEN** CORS allows the Railway domain

#### Scenario: API 地址配置
- **GIVEN** frontend is deployed
- **WHEN** making API calls
- **THEN** it uses the correct production API URL

### Requirement: 数据库持久化
The system SHALL ensure SQLite database persists on Railway.

#### Scenario: 数据持久化
- **GIVEN** Railway free tier with ephemeral filesystem
- **WHEN** service restarts
- **THEN** database data is preserved

### Requirement: GitHub 集成
The system SHALL integrate with GitHub for automatic deployments.

#### Scenario: 代码推送
- **GIVEN** code is pushed to GitHub
- **WHEN** Railway detects changes
- **THEN** automatic deployment is triggered

## MODIFIED Requirements

### Requirement: 后端环境适配
The system SHALL adapt to Railway environment variables.

#### Scenario: 端口配置
- **GIVEN** Railway provides PORT environment variable
- **WHEN** backend starts
- **THEN** it uses the provided port

#### Scenario: 静态文件服务
- **GIVEN** Railway deployment
- **WHEN** serving uploaded images
- **THEN** static files are accessible

## REMOVED Requirements
None
