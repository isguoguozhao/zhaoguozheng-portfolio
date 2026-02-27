@echo off
cd /d "d:\project\个人网站3"
git remote add origin https://github.com/isguoguozhao/zhaoguozheng-portfolio.git
git branch -M main
git push -u origin main
echo.
echo 推送完成！如果提示输入密码，请输入你的GitHub密码。
pause
