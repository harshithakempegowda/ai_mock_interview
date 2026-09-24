# AI Mock Interview Platform

A full-stack mock interview & test preparation platform built with **Django REST Framework** (backend, SQLite database) and **React + Vite + Tailwind CSS + Framer Motion** (frontend).

## Features

- **Authentication**: Signup, Login, Forgot Password (OTP-based), Logout, JWT session management.
- **Dashboard**: Animated stat counters + quick-access cards to every module.
- **Take Test**: Aptitude, Technical, HR, Coding categories with dynamic MCQ questions, auto-scoring.
- **Interviews**: Camera/microphone permission flow, live camera preview, timer, sequential questions, stored responses, auto-generated score & feedback.
- **Results**: Test and interview scores with strengths/weaknesses/suggestions.
- **History**: Combined searchable/filterable table of all tests & interviews.
- **Analytics**: Line/Bar/Pie charts (Recharts) for score trends, communication/technical trends, and category breakdowns.
- **Resume Module**: PDF upload, text extraction (PyPDF2), parsed name/email/phone/skills/education/projects, resume score & suggestions.
- **Profile**: Edit details, upload profile picture, manage skills/education, view stats.

## Project Structure

```
mockinterview/
├── backend/                  # Django REST API
│   ├── config/                settings, urls, wsgi/asgi
│   ├── accounts/               custom user, JWT auth, signup/login/forgot-password
│   ├── profiles/                profile + picture upload
│   ├── tests_module/            test categories, questions, attempts, scoring
│   ├── interviews/              interview sessions, responses, AI-style feedback
│   ├── results/                 aggregated results endpoints
│   ├── history/                 combined history with filters
│   ├── analytics/               chart-ready aggregated data
│   ├── resumes/                 PDF upload + parsing + scoring
│   ├── manage.py
│   └── requirements.txt
└── frontend/                  # React app
    ├── src/
    │   ├── components/          Navbar, Sidebar, Card, Loader, ProtectedRoute, AnimatedCounter
    │   ├── pages/                Login, Signup, ForgotPassword, Dashboard, TakeTest, Interviews, Results, History, Analytics, Resume, Profile...
    │   ├── services/             axios API clients per module (JWT auto-refresh)
    │   ├── hooks/                 useCountUp, useMediaDevices (camera/mic)
    │   ├── context/               AuthContext
    │   └── App.jsx / main.jsx
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### 1. Backend (Django + SQLite)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

python manage.py makemigrations accounts profiles tests_module interviews results history analytics resumes
python manage.py migrate

# Seed sample test/interview questions
python manage.py seed_data

# Create an admin user (optional, for Django admin)
python manage.py createsuperuser

python manage.py runserver
```

Backend runs at **http://localhost:8000**. Admin panel at `/admin/`. Media files (resumes, profile pictures) are served from `/media/`.

### 2. Frontend (React + Vite + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** and proxies all `/api` and `/media` requests to the Django backend (see `vite.config.js`).

### 3. Using the App

1. Open http://localhost:5173 and click **Get Started** to sign up.
2. After signup/login you're redirected to the **Dashboard**.
3. Use the sidebar to navigate: Take Test, Interviews, Results, History, Analytics, Resume, Profile.
4. For interviews, your browser will request **camera & microphone permission** — allow it to start the live session.
5. Upload a **PDF resume** in the Resume page to see automatic parsing & scoring.

## Notes on Forgot Password

For demo purposes (no email service configured), the `forgot-password` endpoint returns the generated OTP directly in the API response (`demo_otp`) so you can complete the reset flow without an SMTP server. In production, wire this up to Django's email backend or a transactional email provider (SendGrid, SES, etc.) and remove the `demo_otp` field from the response.

## Notes on AI Interview Scoring

Interview scoring (`interviews/views.py: generate_feedback`) uses a heuristic algorithm based on answer completeness/length to generate communication, technical, and confidence scores plus textual feedback. This can be swapped for a call to an LLM API (e.g., the Anthropic API) for richer, more accurate feedback — the JSON contract (`overall_score`, `communication_score`, `technical_score`, `confidence_score`, `strengths`, `weaknesses`, `suggestions`, `feedback`) is already in place for that swap.

## Tech Stack

- **Backend**: Django 5, Django REST Framework, SimpleJWT, django-cors-headers, PyPDF2, Pillow, SQLite
- **Frontend**: React 18, React Router v6, Axios, Tailwind CSS, Framer Motion, Recharts, react-icons, Vite
