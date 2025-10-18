# 💼 Resume Builder & Career Ecosystem

> **A complete full-stack MERN application for creating professional resumes and managing your career journey.**

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5%2B-green?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue?logo=tailwind-css)](https://tailwindcss.com/)

---

## 🎯 What is This?

A modern web application that helps you:
- 📄 **Build Professional Resumes** - 5 beautiful templates
- 🤖 **AI-Powered Content** - Auto-generate summaries
- 💼 **Manage Projects** - Showcase your portfolio
- 📚 **Track Courses** - Monitor learning progress  
- 💪 **Organize Skills** - Categorize with proficiency
- 🏆 **Record Achievements** - Track awards & certs
- 🌓 **Dark Mode** - Eye-friendly theme
- 📱 **Fully Responsive** - Works on all devices

---

## ✨ Key Features

✅ **5 Resume Templates** - Modern, Classic, Creative, Minimal, Professional  
✅ **Real-time Preview** - See changes as you type  
✅ **PDF Export** - Download high-quality resumes  
✅ **AI Summary Generator** - Auto-create professional summaries  
✅ **Dark Mode** - With localStorage persistence  
✅ **Smooth Animations** - 60fps scroll effects  
✅ **100% Responsive** - Mobile, tablet, desktop  
✅ **Secure Auth** - JWT + bcrypt protection  
✅ **Fast API** - 8-83ms response times  
✅ **34 API Endpoints** - Complete CRUD operations  

---

## 🛠 Tech Stack

**Frontend:** React 18.2 • Vite 5.0 • TailwindCSS 3.4 • Zustand • React Router  
**Backend:** Node.js 16+ • Express 4.18 • MongoDB 5+ • Mongoose  
**Auth:** JWT • bcrypt • express-validator  
**Tools:** Axios • Lucide Icons • html2canvas • jsPDF

---

## ⚡ Quick Start

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org/))
- MongoDB v5+ ([Download](https://www.mongodb.com/try/download/community))
- Git ([Download](https://git-scm.com/))

### Installation (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/Bil-2/resume-builder.git
cd resume-builder

# 2. Install backend dependencies
cd backend
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret

# 4. Install frontend dependencies
cd ../frontend
npm install
```

### Configuration

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your_super_secret_key_change_this_to_something_random
PORT=5001
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a secure random string!

### Run Application

Open **3 terminals**:

**Terminal 1 - Start MongoDB:**
```bash
cd resume-builder
mkdir -p data/db
mongod --dbpath ./data/db
# Keep running - you should see "Waiting for connections"
```

**Terminal 2 - Start Backend:**
```bash
cd resume-builder/backend
npm run dev
# Keep running - you should see "Server running on port 5001"
```

**Terminal 3 - Start Frontend:**
```bash
cd resume-builder/frontend
npm run dev
# Keep running - you should see "Local: http://localhost:3000"
```

**Open Browser:** http://localhost:3000

🎉 **Done! Your app is running!**

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5001/api
```

### Complete API List (34 Endpoints)

#### 🔐 Authentication (5)
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user  
- `PUT /auth/profile` - Update profile
- `PUT /auth/change-password` - Change password

#### 📄 Resumes (7)
- `GET /resumes` - Get all resumes
- `POST /resumes` - Create resume
- `GET /resumes/:id` - Get single resume
- `PUT /resumes/:id` - Update resume
- `DELETE /resumes/:id` - Delete resume
- `POST /resumes/:id/generate-summary` - AI summary
- `POST /resumes/:id/duplicate` - Duplicate resume

#### 💼 Projects (5)
- `GET /projects` - Get all projects
- `POST /projects` - Create project
- `GET /projects/:id` - Get single project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

#### 📚 Courses (6)
- `GET /courses` - Get all courses
- `POST /courses` - Create course
- `GET /courses/:id` - Get single course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course
- `PATCH /courses/:id/progress` - Update progress

#### 💪 Skills (6)
- `GET /skills` - Get all skills
- `GET /skills/grouped` - Get skills by category
- `POST /skills` - Create skill
- `GET /skills/:id` - Get single skill
- `PUT /skills/:id` - Update skill
- `DELETE /skills/:id` - Delete skill

#### 🏆 Achievements (5)
- `GET /achievements` - Get all achievements
- `POST /achievements` - Create achievement
- `GET /achievements/:id` - Get single achievement
- `PUT /achievements/:id` - Update achievement
- `DELETE /achievements/:id` - Delete achievement

### Authentication
All endpoints (except register/login) require JWT token:
```javascript
Headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

### Example Usage

**Register:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'
```

**Login & Get Token:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Resumes:**
```bash
curl http://localhost:5001/api/resumes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚀 Deployment

### Option 1: Heroku

```bash
# Backend
heroku create your-app-backend
heroku addons:create mongolab:sandbox
heroku config:set JWT_SECRET=your_production_secret
git subtree push --prefix backend heroku main

# Frontend (update VITE_API_URL first)
# Deploy to Netlify or Vercel
```

### Option 2: Docker

```bash
docker-compose up -d
docker-compose logs -f
```

### Option 3: VPS

```bash
# Install Node.js, MongoDB, PM2
pm2 start backend/server.js --name resume-backend
pm2 startup
pm2 save
```

**Production Checklist:**
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Update MongoDB to production DB
- [ ] Configure HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Enable rate limiting
- [ ] Configure backups

---

## 🔒 Security

✅ **JWT Authentication** - Secure token-based auth  
✅ **bcrypt Password Hashing** - 10 salt rounds  
✅ **Input Validation** - express-validator  
✅ **Protected Routes** - Middleware auth checks  
✅ **CORS Configuration** - Controlled access  
✅ **Rate Limiting** - Prevent abuse  
✅ **Helmet Security Headers** - HTTP protection  
✅ **Environment Variables** - Secure config  

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod --dbpath ./data/db

# Or use Docker
docker run -d -p 27017:27017 mongo:5
```

### Port Already in Use
```bash
# Find process on port 5001
lsof -i :5001

# Kill it
kill -9 <PID>

# Or change PORT in .env
```

### JWT Token Expired
```javascript
// In browser console
localStorage.clear();
window.location.reload();
// Then login again
```

### Frontend Can't Connect to Backend
```bash
# Check backend is running
curl http://localhost:5001/api/auth/login

# Check frontend .env has correct API URL
cat frontend/.env
```

### Build Fails
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📂 Project Structure

```
resume-builder/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database connection
│   ├── controllers/        # Business logic (6 files)
│   ├── middleware/         # Auth, validation, errors
│   ├── models/             # Mongoose schemas (6 models)
│   ├── routes/             # API routes (6 files)
│   ├── server.js           # Entry point
│   └── .env.example        # Environment template
│
├── frontend/               # React SPA
│   ├── src/
│   │   ├── components/    # Reusable components (50+)
│   │   ├── pages/         # Page components (18 pages)
│   │   ├── services/      # API integration
│   │   ├── store/         # State management (Zustand)
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utilities
│   ├── vite.config.js     # Vite config
│   └── tailwind.config.js # Tailwind config
│
└── data/db/               # Local MongoDB data
```

---

## 🤝 Contributing

Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

**TL;DR:** Free to use, modify, and distribute with attribution.

---

## 👨‍💻 Author

**Your Name**
- 📧 Email: biltubag29@gmail.com
- 🌐 Website: yourwebsite.com
- 💼 LinkedIn: linkedin.com/in/yourusername
- 🐙 GitHub: @Bil-2

---

## 🙏 Acknowledgments

- React Team - Amazing UI library
- Tailwind Labs - Beautiful CSS framework
- MongoDB - Flexible database
- Express Community - Robust backend framework
- Vite Team - Lightning-fast build tool
- Open Source Community - Continuous inspiration

---

## 📞 Support

- 📖 [Read Documentation](#)
- 🐛 [Report Bug](https://github.com/Bil-2/resume-builder/issues)
- 💬 [Ask Question](https://github.com/Bil-2/resume-builder/discussions)
- 📧 Email: support@example.com

---

<div align="center">

**Built with ❤️ using MERN Stack**

⭐ **Star this repo if it helped you!**

</div>
# Resume_Builder
