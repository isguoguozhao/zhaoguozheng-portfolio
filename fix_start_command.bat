@echo off
cd /d "d:\project\个人网站3"
git add .
git commit -m "Fix Railway start command to use python -m uvicorn"
git push origin main
echo.
echo 修复已推送，请等待 Railway 重新部署！
pause
