# Setup Guide

This guide will walk you through setting up the AI Resume Builder locally.

## 📋 Prerequisites

Before starting, ensure you have:

- **Python 3.9+** installed
- **Node.js 18+** installed
- **PostgreSQL** installed and running
- **Git** (optional, for cloning)

## 🗄️ Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE resume_builder;
```

2. (Optional) Create a dedicated user:
```sql
CREATE USER resume_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE resume_builder TO resume_user;
```

## ⚙️ Backend Setup

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
# Database (Required)
DATABASE_URL=postgresql://username:password@localhost:5432/resume_builder

# JWT (Required)
SECRET_KEY=your-super-secret-key-here

# Anthropic Claude (Optional)
# If not provided, AI optimization returns simulated responses
ANTHROPIC_API_KEY=sk-ant-your-api-key

# Stripe (Optional for basic features)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Frontend URL (Required)
FRONTEND_URL=http://localhost:3000
```

### Step 5: Run the Backend
```bash
python main.py
```

You should see:
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 💻 Frontend Setup

### Step 1: Navigate to Frontend
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 4: Run Development Server
```bash
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000
```

## 🧪 Verification

1. **Backend Health Check**: Visit http://localhost:8000/health
2. **API Docs**: Visit http://localhost:8000/docs
3. **Frontend**: Visit http://localhost:3000

## 🚀 Production Deployment

### Backend

1. Set `ENVIRONMENT=production` in `.env`
2. Use a production ASGI server:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend

1. Build for production:
```bash
npm run build
```

2. The static files will be in the `dist` folder, ready for deployment.

## 🐛 Troubleshooting

### Backend Issues

**Database connection failed**
- Verify PostgreSQL is running
- Check DATABASE_URL format: `postgresql://user:pass@host:port/dbname`

**Import errors**
- Ensure virtual environment is activated
- Reinstall: `pip install -r requirements.txt`

### Frontend Issues

**Module not found errors**
- Delete `node_modules` and run `npm install` again

**API connection errors**
- Verify backend is running
- Check NEXT_PUBLIC_API_URL matches backend URL

## 📝 Next Steps

1. Create an account at http://localhost:3000/signup
2. Build your first resume
3. Try the AI optimization feature
4. Download as PDF

## 💡 Tips

- Keep your SECRET_KEY secure in production
- Use environment-specific .env files
- Regular database backups recommended
- Consider using a reverse proxy (nginx) in production
