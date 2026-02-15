
```
# 🌐 Connectly

**Connectly** is a full-stack social media platform built with the **MERN stack**, featuring **secure authentication**, a **social feed**, and **real-time messaging** using WebSockets.

It is a **production-deployed, portfolio-grade application** that demonstrates real-world backend architecture, frontend state management, secure cookie-based authentication, and hybrid **REST + WebSocket** communication.

---

## 🌍 Live Deployment

- **Frontend (Vercel):** https://connectly-lovat.vercel.app  
- **Backend API (Render):** https://connectly-ff25.onrender.com  

> The application is fully deployed over **HTTPS**, using **secure cross-site cookies**, proper **CORS configuration**, and production-ready environment separation.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure signup & login using **JWT**
- Authentication via **HTTP-only, secure cookies**
- Cross-site auth (`SameSite=None`) for Vercel ↔ Render
- Protected routes using auth middleware
- Persistent login across refreshes
- Logout with proper cookie invalidation

### 👤 User Profiles
- Create & edit user profile
- Bio, city, state, education, occupation, website
- Profile & cover image support
- View own profile & other users’ profiles
- Followers / following system
- Mutual follow → friends list

### 📰 Social Feed
- Create text & image posts
- Image uploads via **Multer + Cloudinary**
- Like & unlike posts
- Comment on posts
- Personalized feed from followed users
- User-specific post feeds

### 🤝 Social Graph
- Follow / unfollow users
- Followers & following lists
- Friends (mutual follows)
- Recommended users to follow

### 💬 Messaging (Real-Time Chat)
- One-to-one chat between users
- Chat rooms persisted in MongoDB
- Load message history via REST
- **Real-time messaging using Socket.IO**
- Instant message delivery without refresh

### 🔔 Notifications
- Follow notifications
- Read / unread notification state
- Unread notification count

### 📱 UI / UX
- Responsive design (mobile & desktop)
- Clean UI with **Tailwind CSS**
- Modal-based post creation
- Tab-based profile layout
- Instagram / Twitter-inspired layout

---

## ⚡ Real-Time Architecture

Connectly uses a **hybrid communication model** for scalability and reliability:

| Feature | Technology |
|------|-----------|
| Auth, Profile, Feed | REST (Axios) |
| Load chat history | REST |
| Live chat messages | WebSocket (Socket.IO) |
| Notifications (future live) | WebSocket |
| Page refresh fallback | REST |

This design ensures:
- Low latency messaging
- Reliable data persistence
- Scalable real-time communication

---

## 🛠️ Tech Stack

### Frontend
- **React 19**
- **Vite**
- **React Router DOM**
- **Context API** (global state)
- **Axios**
- **Tailwind CSS**
- **Socket.IO Client**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT**
- **Bcrypt**
- **Multer**
- **Cloudinary**
- **Socket.IO**
- **HTTP + WebSocket hybrid server**

---

## 📁 Project Structure

```

Connectly/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── assets/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── controller/
│   ├── router/
│   ├── middleware/
│   ├── socket/
│   └── package.json
│
└── README.md

````

---

## 🚦 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

---

## 🔧 Installation

```bash
git clone https://github.com/rajnishkumar1906/Connectly.git
cd Connectly
````

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd ../backend
npm install
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173
NODE_ENV=development

CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## ▶️ Running the App Locally

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend API → [http://localhost:5000](http://localhost:5000)

---

## 🔐 Security Notes

* JWT stored in **HTTP-only cookies**
* Secure cookies enforced in production
* Passwords hashed with **bcrypt**
* Auth middleware protects sensitive routes
* Backend validation on all critical endpoints

---

## 🏗️ Production Notes

* Frontend deployed on **Vercel**
* Backend deployed on **Render**
* Database hosted on **MongoDB Atlas**
* Secure cross-site authentication via HTTPS cookies
* CORS configured with exact origin matching
* SPA routing handled with Vercel rewrites
* WebSockets enabled for real-time chat

---

## 🛣️ Roadmap

* [x] Deployment (Vercel + Render)
* [ ] Typing indicators
* [ ] Message delivered / seen status
* [ ] Live notifications via WebSocket
* [ ] Group chat
* [ ] Online / offline presence
* [ ] Performance optimization

---
---

> 💡 *Connectly showcases real-world social media architecture with secure authentication, scalable APIs, and real-time communication — suitable for production systems and strong portfolio presentation.*

```

---

## ✅ Next (optional but powerful)
If you want, I can:
- Add **screenshots / GIF section**
- Write a **resume-ready project description**
- Create a **System Design summary**
- Add badges (Vercel, Render, MongoDB, WebSocket)

Just tell me what you want next 🚀
```
