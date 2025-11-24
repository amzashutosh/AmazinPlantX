# AmazinPlantX - Smart Factory Solution

## Overview
AmazinPlantX is a comprehensive Smart Factory solution designed to manage clients, plants, and assets with 3D visualization capabilities. This project consists of a Django backend and a React (Vite) frontend.

## Tech Stack

### Backend
- **Framework**: Django 5.2.8
- **API**: Django REST Framework
- **Database**: SQLite (Development)
- **Authentication**: Django Auth

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS (Inferred)
- **3D Visualization**: React Three Fiber / Drei
- **HTTP Client**: Axios

## Project Structure

```
AmazinPlantX/
├── backend/                # Django Backend
│   ├── config/             # Project settings
│   ├── core/               # Core functionality (Auth)
│   ├── tenants/            # Client & Plant management
│   ├── assets/             # Asset management
│   ├── analytics/          # Data analytics
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Frontend
│   ├── src/                # Source code
│   └── package.json        # Node dependencies
├── Screens/                # UI Mockups & Assets
└── README.md               # Project Documentation
```

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply migrations:
   ```bash
   python manage.py migrate
   ```

5. Run the development server:
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173/`.

## Features
- **Client Management**: Manage different tenants/clients.
- **Plant Management**: Associate plants with clients, including location data.
- **3D Visualization**: View 3D models of plants and assets.
- **Analytics**: Dashboard for factory metrics.

## License
[Proprietary/Private]
