"""
数据初始化脚本
将前端静态数据导入到后端数据库
"""
import os
import sys

# 添加当前目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session

# 延迟导入，避免循环导入
def get_models():
    from main import (
        Profile, ProjectCategory, Project, Experience,
        SkillCategory, Skill, SocialLink, SessionLocal
    )
    return Profile, ProjectCategory, Project, Experience, SkillCategory, Skill, SocialLink, SessionLocal

# 前端静态数据（从 profile.ts 提取）
FRONTEND_DATA = {
    "profile": {
        "name": "赵国政",
        "title": "信息管理与信息系统",
        "subtitle": "全栈开发工程师 / 数据分析师",
        "bio": "成都东软学院信息管理与信息系统专业大三在读学生，具备扎实的编程基础和丰富的项目实践经验。专注于Web开发、数据分析与人工智能应用，拥有多项国家级竞赛获奖经历。热爱技术，善于学习，具备良好的团队协作能力和项目管理经验。",
        "email": "g3258968947@outlook.com",
        "phone": "+86 152-3424-0469",
        "location": "成都市",
    },
    "projects": [
        {
            "title": "租房小程序平台",
            "category": "小程序开发",
            "description": "专为快递员、外卖员、大学生等就业群体设计的租房小程序，提供商圈浏览、小区浏览、房源浏览、在线预约等功能。",
            "full_description": "本项目是为新就业群体打造的租房服务平台，采用微信小程序原生框架开发，结合云开发模式实现后端逻辑。项目实现了模块化架构设计，将项目清晰分为miniprogram（前端页面）、cloudfunctions（云函数）、components（组件库），提升了代码的可维护性和复用性。",
            "image_url": "/assets/images/project-rental.jpg",
            "technologies": ["微信小程序", "JavaScript", "WXSS", "云开发", "CloudBase"],
            "role": "全栈开发",
            "duration": "2025年8月 - 2025年9月",
            "achievements": [
                "采用微信原生框架进行前端开发，结合云开发模式实现后端逻辑",
                "设计了基于OpenID的身份验证机制，实现普通用户与管理员权限分离",
                "为管理员开发功能完备的后台，实现房源、商圈、小区等内容的可视化管理",
            ],
        },
        {
            "title": "本地化AI对话系统",
            "category": "人工智能",
            "description": "基于Streamlit和Ollama构建的本地化AI对话系统，支持多种大语言模型的本地部署和交互。",
            "full_description": "本项目是一个本地化AI对话系统，使用Streamlit构建用户界面，Ollama作为本地大语言模型运行环境，支持在本地服务器上部署和运行多种开源大语言模型，保护数据隐私的同时提供强大的AI对话能力。",
            "image_url": "/assets/images/project-ai-chat.jpg",
            "technologies": ["Python", "Streamlit", "Ollama", "Linux", "Docker"],
            "role": "项目负责人",
            "duration": "2025年6月 - 2025年8月",
            "achievements": [
                "完成本地化AI对话系统的架构设计和开发",
                "实现多模型切换和管理功能",
                "部署于Linux服务器，支持远程访问",
            ],
        },
        {
            "title": "图书管理系统",
            "category": "Web应用",
            "description": "基于SpringBoot和Vue 3开发的全栈图书管理系统，实现图书增删改查、用户权限管理、借阅记录追踪等核心功能。",
            "full_description": "本项目是一个完整的图书管理系统，前端采用Vue 3 + Element Plus + Axios，后端使用SpringBoot + MySQL。系统实现了图书的增删改查、用户权限管理、借阅记录追踪等核心功能，前端采用组件化开发，后端通过SpringBoot提供API支持。",
            "image_url": "/assets/images/project-library.jpg",
            "technologies": ["Vue 3", "Element Plus", "SpringBoot", "MySQL", "Axios"],
            "role": "项目负责人",
            "duration": "2025年4月 - 2025年6月",
            "achievements": [
                "独立开发前后端分离的图书管理系统",
                "前端采用组件化开发，后端使用MySQL存储图书、用户及借阅信息",
                "实现图书损毁赔偿功能对接微信支付沙箱环境",
            ],
        },
        {
            "title": "高仿网易云音乐Web项目",
            "category": "Web应用",
            "description": "基于React和TypeScript开发的高仿网易云音乐Web应用，实现音乐播放、歌单推荐、用户系统等功能。",
            "full_description": "本项目是一个高仿网易云音乐的Web应用，前端使用React + TypeScript，后端采用Spring Cloud Alibaba微服务架构。实现了高并发播放服务、歌单推荐引擎、歌词同步等核心功能。",
            "image_url": "/assets/images/project-music.jpg",
            "technologies": ["React", "TypeScript", "SpringBoot", "Spring Cloud", "MySQL", "Redis", "RocketMQ"],
            "role": "项目负责人",
            "duration": "2025年3月 - 2025年5月",
            "achievements": [
                "基于Spring Cloud Gateway构建API网关，采用令牌桶算法实现接口限流",
                "使用Redis分布式锁保证播放状态同步一致性，错误率降至0.1%以下",
                "歌词同步采用WebSocket长连接+消息推送，延迟<200ms",
            ],
        },
        {
            "title": "成语词卡AI智能体",
            "category": "人工智能",
            "description": "基于字节跳动扣子Coze平台开发的面向儿童的成语词卡生成智能体及工作流。",
            "full_description": "本项目基于字节跳动扣子Coze平台，开发面向儿童的成语词卡生成智能体及工作流，聚焦3-10岁儿童字词学习教育场景。对接儿童语言学习需求，设计以AI智能体为核心的解决方案，将项目拆分为风格适配模块、内容生成模块、插画匹配模块等独立部分。",
            "image_url": "/assets/images/project-idiom.jpg",
            "technologies": ["Coze平台", "AI智能体", "工作流设计"],
            "role": "项目负责人",
            "duration": "2025年1月 - 2025年2月",
            "achievements": [
                "通过Coze平台完成各模块搭建与整合",
                "过程中快速掌握Coze平台的智能体开发与工作流搭建逻辑",
                "强化将教育需求转化为AI解决方案的能力",
            ],
        },
        {
            "title": "台风路径可视化与预测系统",
            "category": "数据可视化",
            "description": "基于Python的台风路径可视化与预测系统，整合多源气象数据进行台风路径分析和预测。",
            "full_description": "本项目基于Python技术栈，整合了CMA台风历史数据、NOAA海温数据、ERA5再分析风场数据，处理1949-2023年1800+台风记录。实现了台风路径可视化、强度分析、移动速度预测等功能。",
            "image_url": "/assets/images/project-typhoon.jpg",
            "technologies": ["Python", "Pandas", "GeoPandas", "Plotly", "NumPy"],
            "role": "项目负责人",
            "duration": "2024年6月 - 2024年7月",
            "achievements": [
                "构建时空轨迹可视化引擎",
                "整合CMA台风历史数据、NOAA海温数据、ERA5再分析风场数据",
                "成果获校级社区150+浏览，公开数据获2000+浏览，100+下载",
            ],
        },
    ],
    "experiences": [
        {
            "type": "education",
            "title": "信息管理与信息系统 本科",
            "organization": "成都东软学院 信息与商务管理学院",
            "location": "成都",
            "start_date": "2023年9月",
            "end_date": "2027年6月",
            "description": "专业排名前5%/第3名",
            "highlights": [
                "荣誉：东软睿新一等奖学金；逐梦奖学金（2024）；2024年秋季四川省综合素质A证书",
                "奖项：华为DevRun AI应用开发比赛银奖；海峡两岸暨港澳地区大学生计算机创新作品赛国家级二等奖",
                "论文：CONF-CDS 2025；ICMNWC-2025；探索科学（国家级期刊）",
                "相关课程：大学计算机基础、轻量化软件开发基础、程序设计基础、数据分析与处理、数据结构、数据库原理与应用",
            ],
        },
        {
            "type": "work",
            "title": "办公室科员",
            "organization": "太原市文庙街道办事处",
            "location": "太原市",
            "start_date": "2024年1月",
            "end_date": "2024年2月",
            "description": "基层走访与需求调研，文书处理与简报撰写，社区活动组织与执行",
            "highlights": [
                "定期协同网格员深入社区基层，与居民进行面对面交流，系统记录居民需求与反馈",
                "负责撰写多篇社区工作简报，优化信息流转流程，提升了社区内外部宣传的效率与质量",
                "协助策划并执行了社区新春写春联活动及温暖腊八送粥活动",
            ],
        },
        {
            "type": "work",
            "title": "独立全栈开发",
            "organization": "四川奥古斯塔科技有限公司",
            "location": "成都",
            "start_date": "2025年8月",
            "end_date": "2025年9月",
            "description": "新鹏程小程序项目开发，专为快递员、外卖员、大学生等就业群体准备的租房小程序",
            "highlights": [
                "采用微信原生框架进行前端开发，结合云开发模式实现后端逻辑",
                "设计了模块化架构，将项目清晰分为前端页面、云函数、组件库",
                "设计了基于OpenID的身份验证机制，实现用户权限分离",
            ],
        },
    ],
    "skills": [
        {"name": "Java", "level": 90, "category": "编程语言"},
        {"name": "Python", "level": 85, "category": "编程语言"},
        {"name": "JavaScript/TypeScript", "level": 85, "category": "编程语言"},
        {"name": "鸿蒙北向开发", "level": 80, "category": "移动开发"},
        {"name": "Android应用开发", "level": 75, "category": "移动开发"},
        {"name": "小程序开发", "level": 85, "category": "移动开发"},
        {"name": "Vue.js", "level": 85, "category": "前端框架"},
        {"name": "React", "level": 80, "category": "前端框架"},
        {"name": "SpringBoot", "level": 85, "category": "后端框架"},
        {"name": "MySQL", "level": 80, "category": "数据库"},
        {"name": "数据分析", "level": 75, "category": "数据科学"},
        {"name": "AI应用开发", "level": 70, "category": "人工智能"},
    ],
    "social_links": [
        {"platform": "GitHub", "icon_type": "github", "url": "https://github.com", "label": "GitHub主页"},
        {"platform": "LinkedIn", "icon_type": "linkedin", "url": "https://linkedin.com", "label": "LinkedIn主页"},
        {"platform": "微信", "icon_type": "message-circle", "url": "wechat:g15234240469", "label": "微信联系"},
    ],
}


def init_profile(db: Session, Profile):
    """初始化个人资料"""
    existing = db.query(Profile).first()
    if existing:
        print("  个人资料已存在，跳过")
        return
    
    data = FRONTEND_DATA["profile"]
    profile = Profile(**data)
    db.add(profile)
    db.commit()
    print("  ✓ 个人资料已导入")


def init_project_categories(db: Session, ProjectCategory):
    """初始化作品类别"""
    categories = set()
    for project in FRONTEND_DATA["projects"]:
        categories.add(project["category"])
    
    category_map = {}
    for idx, category_name in enumerate(sorted(categories)):
        existing = db.query(ProjectCategory).filter(ProjectCategory.name == category_name).first()
        if existing:
            category_map[category_name] = existing.id
            continue
        
        category = ProjectCategory(
            name=category_name,
            description=f"{category_name}相关项目",
            sort_order=idx
        )
        db.add(category)
        db.commit()
        category_map[category_name] = category.id
        print(f"  ✓ 作品类别 '{category_name}' 已导入")
    
    return category_map


def init_projects(db: Session, Project, category_map):
    """初始化作品项目"""
    for idx, project_data in enumerate(FRONTEND_DATA["projects"]):
        existing = db.query(Project).filter(Project.title == project_data["title"]).first()
        if existing:
            print(f"  项目 '{project_data['title']}' 已存在，跳过")
            continue
        
        category_name = project_data["category"]
        category_id = category_map.get(category_name)
        
        if not category_id:
            print(f"  ✗ 项目 '{project_data['title']}' 的类别 '{category_name}' 不存在")
            continue
        
        project = Project(
            title=project_data["title"],
            category_id=category_id,
            description=project_data["description"],
            full_description=project_data.get("full_description"),
            image_url=project_data.get("image_url"),
            technologies=project_data["technologies"],
            role=project_data["role"],
            duration=project_data["duration"],
            achievements=project_data["achievements"],
            sort_order=idx
        )
        db.add(project)
        db.commit()
        print(f"  ✓ 项目 '{project_data['title']}' 已导入")


def init_experiences(db: Session, Experience):
    """初始化经验背景"""
    for idx, exp_data in enumerate(FRONTEND_DATA["experiences"]):
        existing = db.query(Experience).filter(
            Experience.title == exp_data["title"],
            Experience.organization == exp_data["organization"]
        ).first()
        if existing:
            print(f"  经历 '{exp_data['title']}' 已存在，跳过")
            continue
        
        experience = Experience(
            type=exp_data["type"],
            title=exp_data["title"],
            organization=exp_data["organization"],
            location=exp_data.get("location"),
            start_date=exp_data["start_date"],
            end_date=exp_data.get("end_date"),
            description=exp_data.get("description"),
            highlights=exp_data["highlights"],
            sort_order=idx
        )
        db.add(experience)
        db.commit()
        print(f"  ✓ 经历 '{exp_data['title']}' 已导入")


def init_skills(db: Session, SkillCategory, Skill):
    """初始化技能专长"""
    categories = set()
    for skill in FRONTEND_DATA["skills"]:
        categories.add(skill["category"])
    
    category_map = {}
    for idx, category_name in enumerate(sorted(categories)):
        existing = db.query(SkillCategory).filter(SkillCategory.name == category_name).first()
        if existing:
            category_map[category_name] = existing.id
            continue
        
        category = SkillCategory(
            name=category_name,
            sort_order=idx
        )
        db.add(category)
        db.commit()
        category_map[category_name] = category.id
        print(f"  ✓ 技能类别 '{category_name}' 已导入")
    
    for idx, skill_data in enumerate(FRONTEND_DATA["skills"]):
        category_name = skill_data["category"]
        category_id = category_map.get(category_name)
        
        if not category_id:
            print(f"  ✗ 技能 '{skill_data['name']}' 的类别 '{category_name}' 不存在")
            continue
        
        existing = db.query(Skill).filter(
            Skill.name == skill_data["name"],
            Skill.category_id == category_id
        ).first()
        if existing:
            print(f"  技能 '{skill_data['name']}' 已存在，跳过")
            continue
        
        skill = Skill(
            category_id=category_id,
            name=skill_data["name"],
            level=skill_data["level"],
            sort_order=idx
        )
        db.add(skill)
        db.commit()
        print(f"  ✓ 技能 '{skill_data['name']}' 已导入")


def init_social_links(db: Session, SocialLink):
    """初始化社交链接"""
    for idx, link_data in enumerate(FRONTEND_DATA["social_links"]):
        existing = db.query(SocialLink).filter(SocialLink.platform == link_data["platform"]).first()
        if existing:
            print(f"  社交链接 '{link_data['platform']}' 已存在，跳过")
            continue
        
        social_link = SocialLink(
            platform=link_data["platform"],
            icon_type=link_data["icon_type"],
            url=link_data["url"],
            label=link_data.get("label"),
            sort_order=idx
        )
        db.add(social_link)
        db.commit()
        print(f"  ✓ 社交链接 '{link_data['platform']}' 已导入")


def init_default_user(db: Session, User):
    """初始化默认测试用户"""
    # 延迟导入 main 中的函数
    from main import get_password_hash
    
    existing = db.query(User).filter(User.username == "testuser").first()
    if existing:
        print("  默认测试用户已存在，跳过")
        return
    
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("test123"),
        avatar=None,
        points=100
    )
    db.add(user)
    db.commit()
    print("  ✓ 默认测试用户已创建")
    print("    用户名: testuser")
    print("    密码: test123")


def check_database_status(db: Session, models):
    """检查数据库各表的状态"""
    Profile, ProjectCategory, Project, Experience, SkillCategory, Skill, SocialLink = models
    
    tables_to_check = [
        (Profile, "个人资料"),
        (ProjectCategory, "作品类别"),
        (Project, "作品项目"),
        (Experience, "经验背景"),
        (SkillCategory, "技能类别"),
        (Skill, "技能"),
        (SocialLink, "社交链接"),
    ]
    
    status = {}
    for model, name in tables_to_check:
        count = db.query(model).count()
        status[name] = count
        print(f"  {name}: {count} 条记录")
    
    return status


def init_database():
    """初始化数据库，导入前端数据（增量导入，不会重复导入）"""
    print("\n" + "="*50)
    print("开始检查并初始化数据库...")
    print("="*50)
    
    try:
        Profile, ProjectCategory, Project, Experience, SkillCategory, Skill, SocialLink, SessionLocal = get_models()
        # 导入 User 模型
        from main import User
    except Exception as e:
        print(f"  ✗ 导入模型失败: {e}")
        return
    
    db = SessionLocal()
    try:
        print("\n1. 检查数据库状态:")
        status = check_database_status(db, (Profile, ProjectCategory, Project, Experience, SkillCategory, Skill, SocialLink))
        
        print("\n2. 导入个人资料:")
        init_profile(db, Profile)
        
        print("\n3. 导入作品类别:")
        category_map = init_project_categories(db, ProjectCategory)
        
        print("\n4. 导入作品项目:")
        init_projects(db, Project, category_map)
        
        print("\n5. 导入经验背景:")
        init_experiences(db, Experience)
        
        print("\n6. 导入技能专长:")
        init_skills(db, SkillCategory, Skill)
        
        print("\n7. 导入社交链接:")
        init_social_links(db, SocialLink)
        
        print("\n8. 创建默认测试用户:")
        init_default_user(db, User)
        
        print("\n" + "="*50)
        print("数据库初始化完成！")
        print("="*50 + "\n")
        
    except Exception as e:
        print(f"\n  ✗ 初始化失败: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_database()
