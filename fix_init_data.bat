@echo off
cd /d "d:\project\个人网站3"
git add .
git commit -m "Fix circular import in init_data.py for Railway deployment"
git push origin main
echo.
echo 修复已推送，请等待 Railway 重新部署！
pause
