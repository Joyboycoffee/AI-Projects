# AI Resume Builder

A production-ready AI-powered Resume Builder SaaS built with FastAPI (Python) and Next.js (React).

## 🚀 Features

- **AI-Powered Optimization**: Enhance your resume with Claude AI
- **Beautiful Templates**: Modern, minimal, and professional designs
- **ATS-Friendly**: Optimized for Applicant Tracking Systems
- **PDF Export**: Download resumes as high-quality PDFs
- **Authentication**: JWT-based secure authentication
- **Subscription System**: Free and Pro plans with Stripe integration
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Production-grade database
- **JWT**: Secure authentication
- **Stripe**: Payment processing
- **Anthropic Claude**: AI optimization

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Smooth animations
- **Next Themes**: Dark mode support

## 📁 Project Structure

```
Resume-Builder/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── main.py            # Application entry point
│   └── requirements.txt   # Python dependencies
│
└── frontend/              # Next.js frontend
    ├── src/
    │   ├── app/          # Next.js App Router
    │   ├── components/   # React components
    │   ├── contexts/     # React contexts
    │   ├── lib/          # Utilities
    │   └── types/        # TypeScript types
    └── next.config.js    # Next.js config
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Edit `.env` with your credentials:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/resume_builder
SECRET_KEY=your-secret-key
ANTHROPIC_API_KEY=your-anthropic-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

6. Run the backend:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SECRET_KEY` | JWT secret key | Yes |
| `ANTHROPIC_API_KEY` | Claude API key | No (simulates if not provided) |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |

### Frontend (.env.local)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## 📦 Deployment

### Backend (Production)

1. Set up PostgreSQL database
2. Configure environment variables
3. Run with production ASGI server:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (Production)

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider (Vercel, Netlify, etc.)

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 API Documentation

When running the backend locally, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔑 Key Features Implementation

### AI Optimization
The AI service (`backend/app/services/ai_service.py`) integrates with Anthropic's Claude API to:
- Enhance bullet points with professional language
- Optimize for ATS keywords
- Improve grammar and style

If no API key is provided, it returns simulated responses for demo purposes.

### PDF Generation
PDF generation is handled by `backend/app/services/pdf_service.py` using WeasyPrint with Jinja2 templates for three styles: Modern, Minimal, and Professional.

### Stripe Integration
Payment processing is managed by `backend/app/services/stripe_service.py` with:
- Checkout sessions for subscriptions
- Customer portal for management
- Webhook handling for events

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Anthropic Claude](https://www.anthropic.com/)
- [Stripe](https://stripe.com/)
