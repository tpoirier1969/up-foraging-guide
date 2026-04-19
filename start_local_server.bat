@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:8765/index.html#/home"
  py server.py
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:8765/index.html#/home"
  python server.py
  goto :eof
)
echo Python was not found on this system.
pause
