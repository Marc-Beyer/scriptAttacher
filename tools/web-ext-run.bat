@echo off

cd ..
cd src

web-ext run --config=../tools/web-ext-config.js --keep-profile-changes --firefox-profile="C:\Users\Marc\AppData\Roaming\Mozilla\Firefox\Profiles\h2iy4i83.web-ext-profile" --browser-console

set /p input="End"
echo %input%
pause
--keep-profile-changes