# 🧠 Brainly - Your Second Brain

A modern, AI-powered knowledge management system that helps you save, organize, and interact with your digital content. Built with React, Node.js, PostgreSQL, and powered by Google's Gemini AI.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)

## ✨ Features

### 📚 Content Management
- **Multi-format Support**: Save articles, videos, tweets, and documents
- **Smart Extraction**: Automatic content extraction with metadata
- **Rich Previews**: Beautiful cards with thumbnails and descriptions
- **Tag Organization**: Organize content with custom tags
- **Category Filtering**: Filter by content type

### 🤖 AI-Powered Features
- **Intelligent Chat**: Ask questions about your saved content
- **RAG (Retrieval Augmented Generation)**: AI answers based on your knowledge base
- **Smart Search**: Vector-based semantic search using pgvector
- **Content Analysis**: Automatic content summarization and insights

### 🔒 Authentication & Security
- **Email/Password Auth**: Traditional authentication with JWT
- **Google OAuth**: One-click sign-in with Google
- **Email Verification**: Secure email verification flow
- **Password Reset**: Secure password recovery
- **Protected Routes**: Route-level authentication guards

### 🎨 User Experience
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Dark Mode**: Full dark mode support
- **Real-time Updates**: Live content processing status
- **Share Brain**: Share your knowledge base with others (read-only)
- **Profile Management**: Manage your account settings

## 🏗️ Architecture

```
brainly/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── ai/          # AI & embedding logic
│   │   ├── auth.ts      # Authentication routes
│   │   ├── content.ts   # Content management routes
│   │   └── index.ts     # Server entry point
│   ├── prisma/          # Database schema & migrations
│   └── package.json
│
└── frontend/            # React + Vite SPA
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── layouts/      # Layout components
    │   ├── lib/          # Utilities & API clients
    │   ├── context/      # React context providers
    │   ├── icons/        # SVG icon components
    │   └── types/        # TypeScript types
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher with pgvector extension
- **Google Gemini API Key**: For AI features
- **Google OAuth Credentials**: For social login (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/brainly.git
   cd brainly
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   # Edit .env with your credentials
   
   # Setup database
   npx prisma migrate dev
   npx prisma generate
   
   # Start development server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/brainly?sslmode=require"

# Authentication
USER_JWT_SECRET="your-secure-jwt-secret-key-here"

# Environment
NODE_ENV=development

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Google OAuth (optional)
OAUTH_CLIENT_SECRET="your-oauth-client-secret"
OAUTH_CLIENT_ID="your-oauth-client-id"
GOOGLE_REDIRECT_URI="http://localhost:5000/api/v1/auth/google/callback"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key"
```

### Frontend Configuration

The frontend automatically connects to `http://localhost:5000` in development. For production, update the API base URL in `src/lib/api.ts`.

## 📦 Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 8
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS 4
- **Routing**: React Router 7
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Animations**: TSParticles

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 5
- **Language**: TypeScript 7
- **Database ORM**: Prisma 7
- **Database**: PostgreSQL 14+ with pgvector
- **Authentication**: JWT + Google OAuth
- **AI**: Google Gemini API
- **Email**: Resend
- **Rate Limiting**: express-rate-limit

## 🗄️ Database Schema

Key tables:
- **User**: User accounts and profiles
- **Content**: Saved content items (articles, videos, etc.)
- **Tag**: Content tags
- **Chunk**: AI-processed content chunks with embeddings
- **Link**: Shared brain links

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Rate limiting on sensitive endpoints
- SQL injection prevention (Prisma)
- XSS protection
- Email verification
- Secure password reset flow

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/signin` - Login
- `POST /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/change-password` - Change password
- `GET /api/v1/auth/google` - Google OAuth login
- `POST /api/v1/auth/logout` - Logout

### Content Management
- `GET /api/v1/content` - Get user's content
- `POST /api/v1/content` - Add new content
- `DELETE /api/v1/content` - Delete content

### AI Features
- `POST /api/v1/chat` - Chat with AI about your content

### Sharing
- `GET /api/v1/brain/share/status` - Get share status
- `POST /api/v1/brain/share` - Enable/disable sharing
- `GET /api/v1/brain/:hash` - View shared brain (public)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend/vite-project
npm test
```

## 🏭 Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist/ folder with your preferred static server
```

## 🚢 Deployment

### Backend
- Deploy to any Node.js hosting (Heroku, Railway, Render, AWS, etc.)
- Ensure PostgreSQL database with pgvector extension
- Set environment variables
- Run migrations: `npx prisma migrate deploy`

### Frontend
- Deploy to Vercel, Netlify, or any static hosting
- Update API base URL to your backend domain
- Build command: `npm run build`
- Output directory: `dist`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Google Gemini AI for powering the chat features
- Prisma for the excellent ORM
- All open-source contributors

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ by the Brainly team
