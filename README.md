# 🌐 Connectly

**Connectly** is a modern full-stack social media platform built with the **MERN stack**.  
It allows users to connect, share posts, follow others, and communicate via **real-time chat**.

Live Demo: https://connectly-lovat.vercel.app/

This project demonstrates scalable backend architecture, clean frontend state management, and hybrid **REST + WebSocket** communication — perfect for portfolio showcase.

---

## 🚀 Features

### 🔐 Authentication & Users
- Secure signup & login using **JWT**
- Authentication via **HTTP-only cookies**
- Protected routes with middleware
- Persistent login session

### 👤 User Profiles
- Editable profile (first name, last name, bio, city, state, phone)
- Profile picture support (Cloudinary)
- Follower & following counts
- View own profile & other users’ profiles
- Follow / unfollow system

### 📰 Social Feed
- Create posts (text or image)
- Image uploads using **Multer + Cloudinary**
- Like posts
- Comment on posts
- Feed from followed users
- User-specific post feeds

### 🤝 Social Graph
- Follow / unfollow users
- Followers & following lists
- Friends list (mutual follows)
- Recommended users

### 💬 Messaging (Live Chat)
- One-to-one chat between friends
- Chat rooms stored in MongoDB
- Message history via REST
- **Real-time messaging using WebSockets (Socket.IO)**
- Instant message delivery

### 🔔 Notifications
- Follow notifications
- Read / unread status
- Notification count

### 📱 UI / UX
- Responsive design (desktop & mobile)
- Clean UI with **Tailwind CSS**
- Modal-based post creation
- Tabbed profile sections
- Instagram/Twitter-inspired layout

---

## ⚡ Real-Time Architecture

Hybrid communication model:

| Feature                | Technology           |
|------------------------|----------------------|
| Auth, Profile, Feed    | REST (Axios)         |
| Load chat history      | REST                 |
| Live chat messages     | WebSocket (Socket.IO)|
| Notifications (future) | WebSocket            |

Ensures scalability, reliability, and low-latency chat.

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
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── socket/
│   └── package.json
│
└── README.md
```

---

## 🚦 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm / yarn

### Installation

```bash
git clone https://github.com/rajnishkumar1906/Connectly.git
cd Connectly
```

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
FRONTEND_URL=https://your-frontend.vercel.app
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```
**For Render:** Set `FRONTEND_URL` to your Vercel frontend URL (e.g. `https://connectly-lovat.vercel.app`) so CORS and Socket.IO allow requests from the frontend.

### Frontend (`frontend/.env`)
```env
VITE_API_URL=https://your-backend-domain.com/api
# or for local testing: http://localhost:5000/api
```

---

## 🚀 Deploy (Render + Vercel)
- **Backend (Render):** Deploy the full `backend` folder. Set env vars: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL` (your Vercel URL), Cloudinary keys. **Redeploy after adding communities (servers/channels)** so `/api/servers` and `/api/channels` exist.
- **Frontend (Vercel):** Set `VITE_API_URL` to your Render backend URL (e.g. `https://connectly-ff25.onrender.com`). No trailing slash.
- **Socket.IO:** The client uses polling then WebSocket. If WebSocket fails (e.g. proxy), polling still works. Ensure `FRONTEND_URL` on Render matches the Vercel origin exactly.

---

## ▶️ Running Locally

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

---

## 🔐 Security Notes
- JWT in **HTTP-only cookies**
- Passwords hashed with **bcrypt**
- Protected routes + input validation

---

## 🛣️ Roadmap
- [ ] Typing indicators
- [ ] Message seen/delivered status
- [ ] Live notifications (WebSocket)
- [ ] Group chat
- [ ] Online/offline status

---

## 🎯 Future Direction: Discord-Style Community Platform

Connectly is being evolved into a **Discord-like community platform**:

- **Communities (servers)** — Create/join communities; share thoughts in **channels**.
- **Learning through chat** — 1:1 DMs, **group DMs**, and **channel discussions** (and later **threads**).
- **Discovery** — Public servers, invite links, categories.

See **[DISCORD-LIKE-ROADMAP.md](./DISCORD-LIKE-ROADMAP.md)** for the full vision, new data models (Server, Channel, ChannelMessage, ServerMember), and a phased implementation plan (foundations → group DMs → threads → roles & moderation).

---

## 👤 Author
**Rajnish Kumar**  
GitHub: [@rajnishkumar1906](https://github.com/rajnishkumar1906) for bu=okbuddy
