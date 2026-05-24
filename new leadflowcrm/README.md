# 🚀 LeadFlow CRM — BDA Team Management System

> A production-ready MERN Stack CRM dashboard for Manufacturing Company's BDA Teams

![LeadFlow CRM](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs)

---

## ✨ Features

- 🔐 **JWT Authentication** — Register, Login, Protected Routes
- 👥 **Role-Based Access** — Admin and BDA Employee roles
- 📊 **Dashboard** — Real-time stats, charts, activity feed
- 📋 **Lead Management** — Full CRUD with search, filter, pagination
- 🗂️ **Kanban Board** — Drag-and-drop workflow with `@hello-pangea/dnd`
- 📈 **Analytics** — Monthly trends, team performance, source breakdown
- 🔔 **Notifications** — Overdue and upcoming follow-up alerts
- 🌙 **Dark Mode** — Light/dark theme toggle
- 📱 **Mobile Responsive** — Works on all screen sizes

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite, Tailwind CSS, Framer Motion |
| Charts | Recharts |
| Drag-Drop | @hello-pangea/dnd |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Auth | JWT + bcryptjs |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
leadflow-crm/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Dashboard, Leads, Kanban, Analytics...
│   │   ├── context/      # AuthContext, ThemeContext
│   │   ├── layouts/      # MainLayout with Sidebar + Topbar
│   │   └── services/     # Axios API service
│   └── package.json
├── server/               # Express.js backend
│   ├── controllers/      # Route handlers
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── middleware/        # Auth middleware
│   └── utils/            # Seed data script
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier)

### 1. Clone & Install

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 2. Environment Variables

**Backend** — create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/leadflow
JWT_SECRET=your_secret_key_here
```

**Frontend** — create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Sample Data

```bash
cd server
node utils/seedData.js
```

### 4. Run Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open http://localhost:5173

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@leadflow.com | admin123 |
| BDA | rahul@leadflow.com | bda123 |
| BDA | priya@leadflow.com | bda123 |

---

## 📡 API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile |

### Leads
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/leads | Get all leads (with filters) |
| GET | /api/leads/:id | Get lead by ID |
| POST | /api/leads | Create lead |
| PUT | /api/leads/:id | Update lead |
| DELETE | /api/leads/:id | Delete lead |

### Dashboard
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/dashboard/stats | Get statistics |
| GET | /api/dashboard/analytics | Get monthly chart data |

### More
- GET `/api/employees/performance` — Team performance
- GET `/api/activities` — Activity logs
- GET `/api/notifications` — Follow-up notifications

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
# Set VITE_API_URL to your Render backend URL
```

### Backend (Render)
- Connect GitHub repo to Render
- Set environment variables in Render dashboard
- Deploy `server/` directory

---

## 📸 Screenshots

| Dashboard | Kanban Board |
|-----------|-------------|
| Stats cards, charts, activity | Drag-and-drop columns |

---

Made with ❤️ for MERN Stack Development
