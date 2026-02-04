@echo off
echo Starting Letterboxd Personality Analyzer Server...
echo.
echo The application will open at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
python -m http.server 8000

pause
