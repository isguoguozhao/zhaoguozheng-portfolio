@echo off
cd /d "d:\project\个人网站3"
set RAILWAY_TOKEN=ab7bdfb4-0fde-45ff-a44a-ee734f912ac6
echo 已设置 Railway Token
echo 正在获取项目列表...
npx railway list
echo.
pause
