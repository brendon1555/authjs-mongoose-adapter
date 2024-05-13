@echo off

set CONTAINER_NAME=authjs-mongoose-test

REM Start db
docker run -d --rm ^
  -p 27017:27017 ^
  --name %CONTAINER_NAME% ^
  mongo

echo Waiting 5s for db to start...
timeout /t 5 >nul

REM Always stop container, but exit with 1 when tests are failing
call npx.cmd vitest run
if %errorlevel% equ 0 (
  docker stop %CONTAINER_NAME%
) else (
  docker stop %CONTAINER_NAME% & exit /b 1
)
