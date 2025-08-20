#!/usr/bin/env python3
"""
Start the CleanSight YOLO Detection Server
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    return True

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting CleanSight YOLO Detection Server...")
    print("📡 Server will be available at: http://localhost:5000")
    print("📖 API docs will be available at: http://localhost:5000/docs")
    print("\n🔥 To stop the server, press Ctrl+C")
    print("-" * 50)
    
    try:
        # Run the server
        subprocess.run([sys.executable, "app.py"])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    print("🎯 CleanSight YOLO Detection Server Startup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("app.py"):
        print("❌ Error: app.py not found. Please run this script from the backend directory.")
        sys.exit(1)
    
    if not os.path.exists("best.pt"):
        print("❌ Error: best.pt model file not found. Please ensure your YOLO model is in this directory.")
        sys.exit(1)
    
    # Install requirements if needed
    if not os.path.exists("__pycache__") or input("Install/update requirements? (y/N): ").lower() == 'y':
        if not install_requirements():
            sys.exit(1)
    
    # Start server
    start_server()
