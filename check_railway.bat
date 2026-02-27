@echo off
cd /d "d:\project\个人网站3"
npx railway login --token ab7bdfb4-0fde-45ff-a44a-ee734f912ac6
echo.
echo 登录成功，正在获取项目列表...
npx railway list
echo.
pause
