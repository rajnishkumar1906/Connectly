
# 🌐 Connectly

**Connectly** is a modern full-stack social media platform built with the MERN stack. It enables users to connect, share moments, and communicate in real time through a clean and responsive interface.

Designed as a portfolio-grade project, Connectly demonstrates real-world features such as authentication, media uploads, feeds, messaging, and upcoming real-time capabilities.

---

## 🚀 Features

* 🔐 **User Authentication** – Secure signup & login using JWT
* 📰 **Social Feed** – Create, view, like, and interact with posts
* 👤 **User Profiles** – Customizable profiles with personal info
* 💬 **Messaging** – Direct user-to-user chat
* 🖼️ **Image Uploads** – Multer + Cloudinary integration
* 📱 **Responsive UI** – Mobile-first design using Tailwind CSS
* 🤝 **Friend System** – Connect & get user recommendations
* ⚡ **Real-Time Updates (Planned)** – WebSocket-based live messaging & notifications

> 🔧 *Upcoming Enhancement:*
> Real-time features such as live chat, instant notifications, and online status will be implemented using **WebSockets (Socket.IO)** to provide a seamless social experience.

---

## 🛠️ Tech Stack

### Frontend

* **React 19** – UI library
* **Vite** – Fast build tool & dev server
* **React Router DOM** – Client-side routing
* **Tailwind CSS** – Utility-first styling

### Backend

* **Node.js** – Runtime
* **Express.js** – Web framework
* **MongoDB + Mongoose** – Database & ODM
* **JWT** – Authentication
* **Bcrypt** – Password hashing
* **Cloudinary** – Media storage
* **Multer** – File upload handling
* **WebSocket (Socket.IO)** – *Planned for real-time communication*

---

## 📁 Project Structure

```
Connectly/
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   ├── context/     # Global state (Context API)
│   │   └── assets/      # Static assets
│   └── package.json
├── backend/             # Express API
│   ├── config/          # DB & service configs
│   ├── router/          # API routes
│   ├── utils/           # Helper utilities
│   └── package.json
└── README.md
```

---

## 🚦 Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB (local or cloud)
* npm or yarn

### Installation

```bash
git clone https://github.com/rajnishkumar1906/Connectly.git
cd Connectly
```

```bash
cd frontend
npm install
```

```bash
cd ../backend
npm install
```

---

## 🔧 Environment Setup

### Backend (`backend/.env`)

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:4000/api
```

---

## ▶️ Running the Application

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:4000](http://localhost:4000)

---

## 🔐 Authentication

Connectly uses JWT (JSON Web Tokens) for authentication. Tokens are stored securely in HTTP-only cookies to enhance security and prevent XSS attacks.

---

## 📸 Image Uploads

All media uploads are handled using **Multer** and stored on **Cloudinary**.
Ensure Cloudinary credentials are correctly set in the backend `.env` file.

---

## 🛣️ Roadmap

* [ ] Real-time chat using WebSockets (Socket.IO)
* [ ] Live notifications (likes, messages, requests)
* [ ] Online/offline user status
* [ ] Post comments in real time
* [ ] Deployment (Vercel + Render)

---

## 👤 Author

**Rajnish Kumar**

* GitHub: [@rajnishkumar1906](https://github.com/rajnishkumar1906)

---

