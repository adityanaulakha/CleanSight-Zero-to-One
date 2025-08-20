@echo off
echo 🎯 CleanSight YOLO Detection Server
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "app.py" (
    echo ❌ Error: app.py not found
    echo Please run this script from the backend directory
    pause
    exit /b 1
)

if not exist "best.pt" (
    echo ❌ Error: best.pt model file not found
    echo Please ensure your YOLO model is in this directory
    pause
    exit /b 1
)

echo 📦 Installing/updating requirements...
python -m pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install requirements
    pause
    exit /b 1
)

echo.
echo ✅ Requirements installed successfully!
echo.
echo 🚀 Starting server...
echo 📡 Server will be available at: http://localhost:5000
echo 📖 API docs will be available at: http://localhost:5000/docs
echo.
echo 🔥 To stop the server, close this window or press Ctrl+C
echo ===============================================
echo.

python app.py

echo.
echo 👋 Server stopped
pause
