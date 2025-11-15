# Webpage Portfolio - Blog Platform

A full-stack blog platform with user authentication, role-based access control, and post management. Built with Node.js + Express backend and React frontend.

## Project Structure

```
webpage-portfolio/
├── apps/
│   ├── backend/          # Node.js + Express + MongoDB API
│   │   ├── src/
│   │   │   ├── controllers/      # Route handlers
│   │   │   ├── services/         # Business logic
│   │   │   ├── models/           # Mongoose schemas
│   │   │   ├── middleware/       # Auth & role checks
│   │   │   ├── routes/           # API routes
│   │   │   ├── types/            # TypeScript interfaces
│   │   │   ├── utils/            # Helpers (validation, etc)
│   │   │   ├── config/           # Database config
│   │   │   ├── app.ts            # Express app setup
│   │   │   └── index.ts          # Server entry point
│   │   ├── test/                 # Jest unit tests
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── jest.config.js
│   │
│   └── frontend/         # React + TypeScript + Vite
│       ├── src/
│       │   ├── components/       # React components
│       │   │   ├── auth/         # Login/Signup
│       │   │   ├── blog/         # Blog list/post/editor
│       │   │   └── page/         # Layout/navbar/protected routes
│       │   ├── api/              # API client (PostAPI class)
│       │   ├── context/          # Auth context (useAuth hook)
│       │   ├── types/            # TypeScript interfaces
│       │   ├── App.tsx           # Router setup
│       │   ├── main.tsx          # Entry point
│       │   └── index.css         # Global styles
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── dist/                 # Built files (generated)
│
├── start-dev.sh          # Script to run backend + frontend
├── package.json          # Root package (workspaces)
└── README.md             # This file
```

## Tech Stack

**Backend:**
- Node.js + TypeScript
- Express.js for HTTP API
- MongoDB + Mongoose for database
- JWT for authentication
- bcryptjs for password hashing
- Jest for unit testing

**Frontend:**
- React 18 + TypeScript
- React Router v6 for routing
- Vite as build tool
- Context API for auth state

## Features

### Authentication
- User signup and login with JWT tokens
- Password hashing with bcryptjs
- Role-based access control (admin / user)
- Protected routes (ProtectedRoute component with role checks)

### Blog Management
- Create, read, update, delete (CRUD) blog posts
- Only admins can create/edit/delete posts
- Posts have title, summary, content, and published status
- Public read access; authenticated write access

### User Management
- Admin panel to view/manage users (admin only)
- User profiles with name, email, role, and active status
- Soft delete (mark as inactive instead of removing)

### Security
- Input validation and sanitization
- ObjectId validation
- Email format validation
- Password minimum length (6 chars)
- Script tag removal from user inputs
- Role-based middleware protection

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or cloud, e.g., MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mariogarcia79/webpage-portfolio.git
   cd webpage-portfolio
   ```

2. **Install dependencies:**
   ```bash
   # Install root workspaces
   npm install
   ```

3. **Set up environment variables:**

   **Backend** (`apps/backend/.env`):
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/blog
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

   **Frontend** (`apps/frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

### Running the Application

#### Option 1: Run both backend and frontend together
```bash
./start-dev.sh
```
This starts:
- Backend on `http://localhost:3000`
- Frontend dev server on `http://localhost:5173`

#### Option 2: Run separately

**Backend:**
```bash
cd apps/backend
npm install
npm run dev
```

**Frontend:**
```bash
cd apps/frontend
npm install
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd apps/frontend
npm run build
# Output in dist/
```

**Backend:**
```bash
cd apps/backend
npm run build
# Runs TypeScript compiler (tsconfig.json)
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/signup-admin` - Create admin user (admin-only in production)

### Posts
- `GET /api/posts` - Get all published posts (public)
- `GET /api/posts/:id` - Get a single post by ID (public)
- `POST /api/posts` - Create a new post (admin-only)
- `PATCH /api/posts/:id` - Update a post (admin-only)
- `DELETE /api/posts/:id` - Delete/unpublish a post (admin-only)

### Users
- `GET /api/users` - List all users (admin-only)
- `GET /api/users?name=search` - Search users by name (admin-only)
- `GET /api/users/:id` - Get user by ID (authenticated)
- `PATCH /api/users/:id` - Update user (authenticated)
- `DELETE /api/users/:id` - Deactivate user (authenticated)

## Development

### Running Tests (Backend)
```bash
cd apps/backend
npm test
# or run in watch mode
npm run test:watch
```

Tests use MongoDB Memory Server for isolation. See `jest.config.js` for configuration.

### Frontend Components

**Key Components:**
- `App.tsx` - Router and main layout
- `BlogList.tsx` - List of posts (public)
- `BlogPost.tsx` - Single post view (public)
- `BlogEditor.tsx` - Create/edit posts (admin-only)
- `SignUp.tsx` / `LogIn.tsx` - Auth forms
- `ProtectedRoute.tsx` - Route wrapper for auth/role checks
- `AuthContext.tsx` - Global auth state

### Using Auth in Components

```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { token, role, isLoggedIn, login, logout } = useAuth();

  if (role === 'admin') {
    // Show admin UI
  }

  return <div>...</div>;
}
```

### Backend Architecture

**Controllers** → Handle HTTP requests/responses
**Services** → Contain business logic
**Models** → Mongoose schemas for MongoDB
**Middleware** → Authentication (JWT) and authorization (role checks)

Example flow:
```
POST /api/posts
  ↓
PostController.postPost()
  ↓
AuthService validates JWT
  ↓
PostService.postPost() creates in DB
  ↓
Response with created post
```

## Security Considerations

- **Input Validation:** All user inputs are checked for type, length, and format
- **Sanitization:** HTML/script tags removed from inputs
- **ObjectId Validation:** Invalid MongoDB IDs are rejected before DB query
- **JWT Tokens:** Expire after 1 hour; include user ID and role
- **Password Hashing:** bcryptjs with salt rounds for secure storage
- **Role-Based Access:** Admin-only routes and endpoints protected by middleware

**Future Improvements:**
- Add express-validator or Zod for formal schema validation
- Use sanitize-html for rich content
- Implement rate limiting (express-rate-limit)
- Add request logging and monitoring
- Enable CORS with specific origins
- Use environment variables for all secrets

## Deployment

### Backend Deployment (e.g., Heroku, Railway, etc.)
```bash
# Ensure npm scripts in package.json point to compiled JS
npm run build
npm start
```

### Frontend Deployment (e.g., Vercel, Netlify, etc.)
```bash
# Build and deploy dist/ folder
npm run build
# Deploy dist/ folder to your hosting
```

## Troubleshooting

**Backend won't start:**
- Check MongoDB connection string in `.env`
- Verify PORT is not in use (default 3000)
- Ensure Node.js 16+ is installed

**Frontend won't connect to backend:**
- Check `VITE_API_URL` env var
- Verify backend is running on `localhost:3000`
- Check browser console for CORS issues

**Tests failing:**
- Ensure MongoDB Memory Server dependencies are installed
- Run `npm install` in `apps/backend`
- Check Node.js version compatibility

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m "Add my feature"`
3. Push to branch: `git push origin feature/my-feature`
4. Open a Pull Request

## License

MIT

## Author

Created by Mario Garcia - [GitHub](https://github.com/mariogarcia79)

---

For questions or issues, please open an issue on GitHub or contact the maintainer.
