# Modern Personal Portfolio & Admin CMS

A production-ready, dynamic **Personal Portfolio Website with an Admin Content Management System (CMS)** built for UI/UX Designers and Frontend Developers.

Allows adding, editing, publishing, structuring case studies, and managing media files dynamically via a secure `/admin` dashboard without editing source code.

---

## Features

- **Public Portfolio**:
  - Hero Section (Dynamic avatar, headline, bio, CTA buttons, social links)
  - About Section (Design philosophy & core principles)
  - Skills & Stack (Category tabs, level progress bars, icon badges)
  - Projects Grid (Filterable categories, featured badges, live preview/code/Figma links)
  - Dedicated Case Study System (`/projects/:slug`) with multi-section breakdown (Overview, Problem Statement, User Research, Wireframes, UI Design, Design System, Prototype, Results, Learnings, Gallery)
  - Experience Timeline & Education Cards
  - Verified Certifications Grid with document previews
  - Interactive Contact Form & Footer
- **Admin CMS Panel (`/admin`)**:
  - JWT Authentication & session persistence
  - Dashboard stats & recent activity overview
  - Full CRUD for Projects, Case Studies, Experience, Education, Skills, Certifications, Media Library, and Site Settings
  - Status toggles (Publish/Unpublish, Featured)
  - Media Library drag-and-drop uploader with URL copy & file size analytics

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Axios, React Router v6, Lucide Icons
- **Backend**: Django 5, Django REST Framework, SimpleJWT, CORS Headers, Pillow
- **Database**: SQLite (Out of the box) / PostgreSQL support via `DATABASE_URL`

---

## Quick Start Guide

### 1. Start the Django Backend

```bash
cd backend
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8000
```

> **Admin Credentials**:
> - Username: `sivapetla`
> - Password: `Siva@123`

### 2. Start the React Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:3000`.

- Public Portfolio: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3000/admin`
