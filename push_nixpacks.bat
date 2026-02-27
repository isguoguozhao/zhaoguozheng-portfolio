@echo off
cd /d "d:\project\个人网站3"
git add .
git commit -m "Add nixpacks.toml for Railway deployment"
git push origin main
echo.
echo Nixpacks 配置已推送！
pause
