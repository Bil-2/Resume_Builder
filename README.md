&<div align="center">

# 💼 Resume Builder & Career Ecosystem

### *Complete MERN Stack Career Management Platform*

[![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**[Features](#-features) • [Quick Start](#-quick-start) • [API Docs](#-api-documentation) • [Deploy](#-deployment)**

</div>

### 🚀 Live Demo

| Component | URL | Status |
|-----------|-----|--------|
| **Frontend** | [resume-builder-biltu.netlify.app](https://resume-builder-biltu.netlify.app) | ✅ Live |
| **Backend** | [Vercel Deployment URL](https://vercel.com/) | ⏳ Pending |

---

## 🎯 Overview

A production-ready MERN stack application for creating professional resumes and managing career growth. Build stunning resumes with AI-powered features, track projects, courses, skills, and achievements—all in one platform.

### **Key Highlights**

- 🎨 **5 Professional Templates** - Modern, Classic, Creative, Minimal, Professional
- 🤖 **AI Summary Generation** - Auto-create compelling professional narratives
- ⚡ **Real-time Preview** - See changes instantly as you edit
- 📄 **PDF Export** - High-quality downloads
- 🔒 **Enterprise Security** - JWT + bcrypt + rate limiting
- 🌓 **Dark Mode** - System-aware theme
- 📱 **Fully Responsive** - Mobile-first design
- 🚀 **Fast API** - 8-83ms response times
- 🔄 **Auto-Save** - Never lose your work
- 🌐 **Google OAuth** - One-click login

---

## ✨ Features

| Category | Features |
|----------|----------|
| **Resume Builder** | 5 templates • Real-time editor • AI summary • PDF export • Duplicate resumes |
| **Career Mgmt** | Projects portfolio • Course tracking • Skills matrix • Achievements |
| **Security** | JWT auth • bcrypt hashing • Rate limiting • Input validation • CORS |
| **UI/UX** | Dark mode • Responsive • Animations • Auto-save • Drag & drop |

---

## 🛠 Tech Stack

**Frontend**: React 18.2 • Vite 5.0 • TailwindCSS 3.4 • Zustand • React Router  
**Backend**: Node.js 16+ • Express 4.18 • MongoDB 7.0 • Mongoose 8.0  
**Auth**: JWT • bcrypt • Google OAuth  
**Tools**: Axios • Lucide Icons • jsPDF • React Hook Form

---

## ⚡ Quick Start

### **Prerequisites**

```bash
node --version   # v16.0+
npm --version    # v7.0+
mongod --version # v5.0+
```

### **Installation**

```bash
# Clone repository
git clone https://github.com/Bil-2/resume-builder.git
cd resume-builder

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
```

### **Environment Configuration**

**Backend** (`backend/.env`):
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your_secure_random_secret_min_64_chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
RATE_LIMIT_MAX_REQUESTS=1000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5001/api
```

### **Run Application**

**Option 1: Docker (Recommended)**
```bash
docker-compose up -d
# Access: http://localhost:3000
```

**Option 2: Manual**

Terminal 1 - MongoDB:
```bash
mongod --dbpath ./data/db
```

Terminal 2 - Backend:
```bash
cd backend && npm run dev
```

Terminal 3 - Frontend:
```bash
cd frontend && npm run dev
```

**Access**: http://localhost:3000

---

## 📚 API Documentation

### **Base URL**: `http://localhost:5001/api`

### **Endpoints (34 Total)**

#### Authentication (5)
```bash
POST   /auth/register          # Register user
POST   /auth/login             # Login user
GET    /auth/me                # Get current user
PUT    /auth/profile           # Update profile
PUT    /auth/change-password   # Change password
```

#### Resumes (7)
```bash
GET    /resumes                # Get all resumes
POST   /resumes                # Create resume
GET    /resumes/:id            # Get single resume
PUT    /resumes/:id            # Update resume
DELETE /resumes/:id            # Delete resume
POST   /resumes/:id/generate-summary  # AI summary
POST   /resumes/:id/duplicate  # Duplicate resume
```

#### Projects, Courses, Skills, Achievements (15)
```bash
# Each resource follows CRUD pattern:
GET    /[resource]             # List all
POST   /[resource]             # Create
GET    /[resource]/:id         # Get one
PUT    /[resource]/:id         # Update
DELETE /[resource]/:id         # Delete
```

### **Authentication**

All endpoints (except register/login) require JWT:
```javascript
Headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

### **Example Usage**

**Register & Login:**
```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"SecurePass123"}'

# Login (returns JWT token)
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

**Create Resume:**
```bash
curl -X POST http://localhost:5001/api/resumes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer Resume",
    "template": "modern",
    "personalInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1-234-567-8900"
    },
    "summary": "Experienced software engineer...",
    "skills": ["JavaScript", "React", "Node.js"]
  }'
```

### **Error Responses**

```javascript
// 401 Unauthorized
{"success": false, "message": "Invalid credentials"}

// 400 Bad Request
{"success": false, "message": "Validation error", "errors": [...]}

// 404 Not Found
{"success": false, "message": "Resource not found"}
```

### **Rate Limits**
- Development: 1000 requests / 15 min
- Production: 100 requests / 15 min

---

## 🚀 Deployment

### **Option 1: Docker (Easiest)**

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Services running:
# - MongoDB: Port 27017
# - Backend: Port 5000
# - Frontend: Port 3000
```

### **Option 2: Vercel (Free)**

1. **Create MongoDB Atlas** (free M0 cluster)
2. **Push to GitHub**
3. **Deploy on Vercel**:
   - Create a new project and import the repository.
   - Set the **Root Directory** to `backend`.
   - **Important:** Set the **Build Command**, **Output Directory**, and **Install Command** to empty (toggle Override and leave blank).
   - Set the following Environment Variables:
     - `NODE_ENV` = `production`
     - `MONGODB_URI` = `<YOUR_MONGODB_ATLAS_CONNECTION_STRING>`
     - `JWT_SECRET` = `<YOUR_JWT_SECRET>`
     - `JWT_EXPIRE` = `7d`
     - `CLIENT_URL` = `https://resume-builder-biltu.netlify.app`
     - `RATE_LIMIT_MAX_REQUESTS` = `100`
     - `GOOGLE_CLIENT_ID` = `456065185658-0j003u1rk8uq41api9oq2rfr7gjim6gq.apps.googleusercontent.com`
   - Vercel automatically detects `vercel.json` for serverless function configuration.
   - Deploy automatically

### **Option 3: AWS/VPS**

```bash
# SSH to server
ssh user@server-ip

# Install Node.js & MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs mongodb-org nginx

# Clone & setup
git clone https://github.com/Bil-2/resume-builder.git
cd resume-builder

# Install & configure
cd backend && npm install && cp .env.example .env
cd ../frontend && npm install

# Start with PM2
npm install -g pm2
pm2 start backend/server.js --name resume-backend
pm2 startup && pm2 save

# Build frontend
cd frontend && npm run build

# Configure Nginx (reverse proxy)
# See full nginx config in detailed README
```

### **Production Checklist**

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (64+ chars)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable automated backups
- [ ] Set up monitoring (New Relic, Datadog)
- [ ] Configure error logging

---

## 📂 Project Structure

```
resume-builder/
├── backend/              # Node.js + Express API
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic (7 files)
│   ├── middleware/      # Auth, validation, errors (5 files)
│   ├── models/          # Mongoose schemas (6 models)
│   ├── routes/          # API routes (6 files)
│   └── server.js        # Entry point
│
├── frontend/            # React + Vite SPA
│   ├── src/
│   │   ├── components/  # Reusable components (50+)
│   │   ├── pages/       # Page components (18+)
│   │   ├── hooks/       # Custom hooks (5)
│   │   ├── store/       # Zustand state (3 stores)
│   │   ├── services/    # API integration
│   │   └── utils/       # Helper functions
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docker-compose.yml   # Docker orchestration
├── ecosystem.config.js  # PM2 configuration
└── backend/vercel.json  # Vercel deployment
```

**Stats**: 7,500+ lines of code • 50+ components • 34 API endpoints • 6 database models

---

## 🗄 Database Schema

### **Collections**

**Users**: Authentication & profiles  
**Resumes**: Resume data with 5 templates  
**Projects**: Portfolio projects  
**Courses**: Learning & certifications  
**Skills**: Technical & soft skills  
**Achievements**: Awards & milestones

### **Key Indexes**
```javascript
users.createIndex({ email: 1 }, { unique: true })
resumes.createIndex({ userId: 1 })
projects.createIndex({ userId: 1 })
```

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| API Response Time | 8-83ms avg |
| Auth Endpoints | 125-250ms (bcrypt) |
| First Contentful Paint | < 1.2s |
| Lighthouse Score | 90+ |
| Bundle Size | ~450KB (gzipped) |

**Optimizations**:
- Database indexing
- Response compression (gzip)
- Query caching
- Code splitting
- Image lazy loading

---

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# E2E tests (Cypress)
cd frontend && npm run test:e2e
```

**Coverage**: Backend ~75% • Frontend ~60%

---

## 🔒 Security

✅ JWT Authentication  
✅ bcrypt Password Hashing (10 rounds)  
✅ Rate Limiting (1000 req/15min dev)  
✅ Input Validation (express-validator)  
✅ CORS Configuration  
✅ Helmet Security Headers  
✅ MongoDB Injection Prevention  
✅ XSS Protection

---

## 🐛 Troubleshooting

**MongoDB Connection Error:**
```bash
# Start MongoDB
mongod --dbpath ./data/db
# Or use Docker
docker run -d -p 27017:27017 mongo:7
```

**Port Already in Use:**
```bash
# Find & kill process
lsof -i :5001
kill -9 <PID>
```

**Build Fails:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**JWT Token Expired:**
```javascript
localStorage.clear();
window.location.reload();
// Login again
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create branch: `git checkout -b feature/AmazingFeature`
3. Make changes and test
4. Commit: `git commit -m "Add: AmazingFeature"`
5. Push: `git push origin feature/AmazingFeature`
6. Open Pull Request

**Commit Convention**:
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Improvements
- `Docs:` Documentation

**What to Contribute**:
- 🐛 Bug fixes
- ✨ New features (templates, AI features, export formats)
- 📚 Documentation improvements
- 🎨 UI/UX enhancements

---

## 🎯 Roadmap

**v2.0** (Coming Soon)
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Resume scoring & ATS optimization
- [ ] Cover letter builder
- [ ] LinkedIn import

**Future**
- [ ] Mobile app (React Native)
- [ ] AI interview prep
- [ ] Job application tracking
- [ ] DOCX export

---

## 📄 License

MIT License - Free to use, modify, and distribute with attribution.

See [LICENSE](LICENSE) for full details.

---

## 👨‍💻 Author

**Bil-2** - Full-Stack Developer | MERN Stack Specialist

[![GitHub](https://img.shields.io/badge/GitHub-@Bil--2-181717?style=flat-square&logo=github)](https://github.com/Bil-2)
[![Email](https://img.shields.io/badge/Email-biltubag29@gmail.com-D14836?style=flat-square&logo=gmail)](mailto:biltubag29@gmail.com)

---

## 🙏 Acknowledgments

**Technologies**: React • Vite • TailwindCSS • MongoDB • Express • Node.js • Zustand  
**Tools**: Axios • Mongoose • Lucide Icons • jsPDF • React Router

Special thanks to the open source community! 🌟

---

## 📞 Support

- 📖 [Full Documentation](https://github.com/Bil-2/resume-builder#readme)
- 🐛 [Report Bug](https://github.com/Bil-2/resume-builder/issues)
- 💡 [Request Feature](https://github.com/Bil-2/resume-builder/issues)
- 📧 [Email](mailto:biltubag29@gmail.com)

---

<div align="center">

### 💖 Built with Love using MERN Stack

**Resume Builder & Career Ecosystem** © 2025

⭐ **Star this repo if it helped you!** ⭐

[⬆ Back to Top](#-resume-builder--career-ecosystem)

</div>
