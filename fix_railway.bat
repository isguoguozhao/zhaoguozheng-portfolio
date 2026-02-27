@echo off
cd /d "d:\project\个人网站3"
git add .
git commit -m "Fix Railway start command"
git push origin main
echo.
echo 修复完成，请等待 Railway 自动重新部署！
pause
