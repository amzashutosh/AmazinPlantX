@echo off
echo Starting AmazinPlantX Development Environment...

:: Start Backend
echo Starting Django Backend...
start "Django Backend" cmd /k "cd backend && (if exist venv\Scripts\activate call venv\Scripts\activate) && python manage.py runserver"

:: Start Frontend
echo Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Services are starting in separate windows.
echo Backend: http://localhost:8000/
echo Frontend: http://localhost:5173/
echo.
pause
