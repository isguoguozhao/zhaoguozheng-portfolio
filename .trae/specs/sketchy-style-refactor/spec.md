# 手绘涂鸦风格重构 Spec

## Why
将现有的极简主义作品集网站全面重构为手绘涂鸦风格（Sketchy Style），以增强视觉个性和艺术感，使网站更具创意和亲和力，符合设计师作品集的定位。

## What Changes
- **新增** sketchy-style.css 核心样式文件，定义手绘风格CSS变量和基础类
- **新增** 纸张纹理背景图案
- **修改** 全局背景色为米白色（#fffdf5）
- **修改** 所有组件边框为2px黑色实线+不规则虚线混合风格
- **修改** 按钮组件添加手绘风格类（tpe-btn-sketchy）和hover旋转效果
- **修改** 卡片组件添加手绘风格类（tpe-card-sketchy）和轻微旋转效果
- **修改** 阴影效果为45度角硬朗阴影（box-shadow: 4px 4px 0px rgba(0,0,0,0.2)）
- **修改** 字体排版为粗体大写无衬线字体
- **修改** 强调色为橙色（#db7c00）
- **修改** 导航栏、Hero、Projects、Experience、About、Contact、Footer各组件样式

## Impact
- Affected specs: 全局视觉风格、组件交互效果
- Affected code: 
  - portfolio-website/frontend/src/styles/global.css
  - portfolio-website/frontend/src/styles/sketchy-style.css（新增）
  - portfolio-website/frontend/src/components/*.css（全部修改）

## ADDED Requirements

### Requirement: 手绘风格CSS系统
The system SHALL provide a comprehensive sketchy-style CSS system that defines all visual styles for the hand-drawn aesthetic.

#### Scenario: CSS变量定义
- **GIVEN** the sketchy-style.css file exists
- **WHEN** the system loads the stylesheet
- **THEN** all CSS variables for colors, borders, shadows are defined and accessible

#### Scenario: 组件样式类
- **GIVEN** a component needs sketchy styling
- **WHEN** applying tpe-btn-sketchy or tpe-card-sketchy classes
- **THEN** the component renders with hand-drawn borders, shadows, and hover effects

### Requirement: 纸张质感背景
The system SHALL provide a paper-texture background that creates a sketchbook aesthetic.

#### Scenario: 背景渲染
- **GIVEN** the global background is configured
- **WHEN** the page loads
- **THEN** the background displays cream color (#fffdf5) with subtle paper texture

### Requirement: 交互元素手绘效果
The system SHALL provide interactive elements with hand-drawn hover effects.

#### Scenario: 按钮hover效果
- **GIVEN** a button with tpe-btn-sketchy class
- **WHEN** user hovers over the button
- **THEN** the button rotates slightly (1deg) and translates (1px, 1px) with smooth transition

#### Scenario: 卡片hover效果
- **GIVEN** a card with tpe-card-sketchy class
- **WHEN** user hovers over the card
- **THEN** the card shadow deepens or changes color with smooth transition

## MODIFIED Requirements

### Requirement: 全局样式变量
The system SHALL use CSS custom properties for consistent theming across all components.

#### Scenario: 颜色系统
- **GIVEN** the color variables are defined
- **WHEN** any component uses colors
- **THEN** it uses the defined CSS variables:
  - --sketchy-bg: #fffdf5 (米白背景)
  - --sketchy-black: #000000 (黑色边框)
  - --sketchy-accent: #db7c00 (橙色强调)
  - --sketchy-shadow: rgba(0,0,0,0.2) (阴影色)

#### Scenario: 边框系统
- **GIVEN** the border variables are defined
- **WHEN** any component renders borders
- **THEN** it uses:
  - --sketchy-border-width: 2px
  - --sketchy-border-style: solid
  - --sketchy-border-color: #000000

#### Scenario: 阴影系统
- **GIVEN** the shadow variables are defined
- **WHEN** any component renders shadows
- **THEN** it uses:
  - --sketchy-shadow-offset: 4px
  - --sketchy-shadow-blur: 0px
  - --sketchy-shadow-color: rgba(0,0,0,0.2)

### Requirement: 响应式手绘风格
The system SHALL maintain sketchy style consistency across all screen sizes.

#### Scenario: 移动端适配
- **GIVEN** the viewport width is less than 768px
- **WHEN** the page renders
- **THEN** all sketchy style elements scale appropriately while maintaining the hand-drawn aesthetic

## REMOVED Requirements
### Requirement: 极简主义风格
**Reason**: Replaced by sketchy style for more creative and personalized visual identity
**Migration**: All minimal style CSS will be replaced with sketchy-style equivalents
