Here is the cleaned-up README.md content ready for direct copy-paste to GitHub:

```markdown
# 🌐 Connectly

**Connectly** is a modern full-stack social media platform built with the **MERN stack**.  
It allows users to connect, share posts, follow others, and communicate via **real-time chat**.

This project is designed as a **portfolio-grade, real-world application**, demonstrating scalable backend architecture, clean frontend state management, and hybrid **REST + WebSocket** communication.

---

## 🚀 Features

### 🔐 Authentication & Users
- Secure signup & login using **JWT**
- Authentication via **HTTP-only cookies**
- Protected routes with middleware
- Persistent login session

### 👤 User Profiles
- Editable profile (first name, last name, bio, city, state, phone)
- Profile picture support
- Follower & following counts
- View own profile & other users’ profiles
- Follow / unfollow system

### 📰 Social Feed
- Create posts (text or image)
- Image uploads using **Multer + Cloudinary**
- Like posts
- Comment on posts
- View feed from followed users
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
- Instant message delivery without refresh

### 🔔 Notifications
- Follow notifications
- Read / unread notification state
- Notification count tracking

### 📱 UI / UX
- Responsive design (desktop & mobile)
- Clean UI using **Tailwind CSS**
- Modal-based create post
- Tab-based profile sections
- Instagram / Twitter-like layout

---

## ⚡ Real-Time Architecture

Connectly uses a **hybrid communication model**:

| Feature                  | Technology          |
|--------------------------|---------------------|
| Auth, Profile, Feed      | REST (Axios)        |
| Load chat history        | REST                |
| Live chat messages       | WebSocket (Socket.IO) |
| Notifications (future)   | WebSocket           |
| Page refresh fallback    | REST                |

This approach ensures scalability, reliability, low latency for chat, and safe data persistence.

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
- **HTTP + WebSocket Hybrid Server**

---

## 📁 Project Structure

```
Connectly/
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages (Home, Profile, Messages)
│   │   ├── context/        # AppContext (global state)
│   │   ├── hooks/          # Custom hooks
│   │   └── assets/
│   └── package.json
│
├── backend/
│   ├── config/         # DB & Cloudinary config
│   ├── models/         # Mongoose schemas
│   ├── controllers/    # Business logic
│   ├── routes/         # API routes
│   ├── middleware/     # Auth & guards
│   ├── socket/         # WebSocket logic
│   └── package.json
│
└── README.md
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

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
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the App

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

- Frontend → http://localhost:5173  
- Backend API → http://localhost:5000

---

## 🔐 Security Notes
- JWT stored in **HTTP-only cookies**
- Protected routes with auth middleware
- Passwords hashed using **bcrypt**
- Backend validation on all sensitive routes

---

## 🛣️ Roadmap (Next Enhancements)
- [ ] Typing indicators (WebSocket)
- [ ] Message seen / delivered status
- [ ] Live notifications via WebSocket
- [ ] Group chat
- [ ] Online / offline presence

---

## 👤 Author
**Rajnish Kumar**  
GitHub: [@rajnishkumar1906](https://github.com/rajnishkumar1906)

> 💡 *Connectly demonstrates real-world social media architecture with clean separation of concerns, scalable APIs, and real-time communication — perfect for production-level systems and strong portfolio showcase.*
```

You can now copy the entire content above and paste it directly into your GitHub README.md file.
