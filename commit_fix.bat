@echo off
cd /d "d:\project\个人网站3"
git add .
git commit -m "Add Railway deployment config files"
git push origin main
echo.
echo 推送完成！
pause
