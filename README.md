## Circle App

**Circle App** is a full-stack social networking platform designed to enable users to share thoughts, interact in real-time, and build meaningful connections within their own circles.
This repository contains both the Backend (API Server) and Frontend (Web Client) in a single monorepo structure.

---

## 📁 Project Structure

```bash
Circle-App/
├── backend/      # API server, authentication, business logic
└── frontend/     # User interface built with modern web technologies
```

---

##✨ Features

**Frontend**
- Modern and responsive UI
- Built with React/Vite + TypeScript (or adjust based on your FE tech)
- Smooth page transitions (Login ↔ Register)
- TailwindCSS configured with darkMode: 'class'
- Auto-filled inputs on validation error
- Popup alert for error handling
- Protected pages for authenticated users

**Backend**
- Node.js + Express API
- RESTful architecture
- Authentication using JWT
- Cloudinary file upload (without Multer)
- CRUD for posts, profiles, tech stacks, experiences, and projects
- Modular controller & routing structure

---

## 🚀 Tech Stack

**Frontend**
- React / Next.js
- TypeScript
- TailwindCSS (CLI)
- Axios
- Shadcn UI / Lucide Icons

**Backend**
- Node.js
- Express.js
- Prisma ORM / MongoDB / PostgreSQL
- Cloudinary SDK
- JSON Web Token (JWT)

---

## 🛠 Installation & Setup

**Prerequisites**
Ensure you have installed:
- Node.js
- npm / pnpm / yarn
- Database (PostgreSQL / MongoDB depending on your setup)

## 📦 Backend Setup

1. Navigate to the backend folder
```bash
cd backend
```
2. Install dependencies
```bash
npm install
```
3. Create an .env file
Example:
```ini
DATABASE_URL=your-database-connect
JWT_SECRET=your-jwt-secret
EMAIL_USER=your-email-user
EMAIL_PASS=your-email-pass
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
4. Run the development server
```bash
npm run dev
```

## 🖥 Frontend Setup

1. Navigate to the frontend directory
```bash
cd frontend
```
2. Install dependencies
```ini
npm install
```
3. Run the frontend
```bash
npm run dev
```

---

##📊 Core Modules

**Backend Modules**
- Auth: login, register, token verification
- User: profile management
- Posts / Threads: create, update, delete, real-time update support
- Upload Service: Cloudinary integration

**Frontend Modules**
- Authentication pages with animated transitions
- Dashboard / Home Feed
- Profile page
- Post creation & interactions
- Responsive navbar and layouts

---

## 🔐 Authentication
- JWT-based authentication
- Access control for protected routes
- Auto-save form values on backend validation error
- Frontend performs token checks before rendering protected pages
