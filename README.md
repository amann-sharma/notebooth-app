# 📝 NoteBooth https://notebooth.onrender.com/

A full-stack Notes App built using **React**, **Node.js**, **Express**, and **MongoDB**. It allows users to register, log in, create, search, and manage their notes securely.

---

## 📁 Project Structure

```
notebooth-app/
├── backend/                 # Express.js server and API logic
│   ├── models/              # Mongoose schemas
│   ├── index.js             # Server entry point
│   └── utils.js             # Helper functions
├── frontend                 # Vite + React frontend
│   ├── src/                 # React components and logic
│   ├── tailwind.config.js
│   └── vite.config.js
```

---

## 🚀 Features

### Frontend
- 🔍 Search notes in real-time
- 👤 User authentication with JWT
- 🎨 Styled using Tailwind CSS
- 📱 Responsive and clean UI

### Backend
- ✅ JWT-based login/signup
- 📦 MongoDB with Mongoose
- 🔐 Protected routes for user data
- 🧠 API for notes (CRUD + search)

---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/notes-app.git
cd notes-app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=8000
MONGO_URI= 
ACCESS_TOKEN_SECRET=
```

Start the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🌐 Deployment

- **Frontend**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: [Render](https://render.com) or [Railway](https://railway.app)

Make sure to update API URLs in your frontend for production.

---

## 🙋‍♂️ Author

**Aman Sharma**  
📍 Jamshedpur | 🎓 SOA University  
🔗 [GitHub](https://github.com/amann-sharma) | [LinkedIn](https://linkedin.com/in/amann-sharma)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
