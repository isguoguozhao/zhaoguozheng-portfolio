@echo off
cd /d "d:\project\个人网站3"
git add .
git commit -m "Update production API URL to Railway domain"
git push origin main
echo.
echo API地址已更新！
echo.
echo ==========================================
echo 部署完成！
echo ==========================================
echo.
echo 后端API地址：https://zhaoguozheng-portfolio-production.up.railway.app
echo.
echo 现在你可以：
echo 1. 访问 API 文档：https://zhaoguozheng-portfolio-production.up.railway.app/docs
echo 2. 测试 API：https://zhaoguozheng-portfolio-production.up.railway.app/api/projects
echo.
echo 注意：前端需要单独部署才能访问
echo 建议：使用 Vercel 部署前端（免费）
echo.
pause
