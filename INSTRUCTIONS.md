# Setup & Test Instructions

## 1) Prerequisites
- Node.js ≥ 18
- MongoDB (Local or Atlas)

## 2) Environment Variables
Create a `.env` file in the project root:

```
MONGODB_URI=your_mongodb_connection_string
DB_NAME=social_app
JWT_SECRET=your_strong_secret
# Optional: leave unset to use same-origin
# NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

## 3) Install & Run (Dev)
```
npm install
npm run dev
# App: http://localhost:3000
```

## 4) One-time DB Indexes (Recommended)
Run in MongoDB shell or Compass for better query performance:
```
db.comments.createIndex({ postId: 1, createdAt: -1 }, { name: "postId_createdAt_index" })
db.comments.createIndex({ userId: 1 }, { name: "userId_index" })
db.comments.createIndex({ createdAt: -1 }, { name: "createdAt_index" })
```

## 5) How to Test

### Authentication
1. Go to `/register` → create an account
2. Go to `/login` → sign in (httpOnly cookie stored)

### Comments Feature
- Navigate to `/feed`
- Click "Comment" on a post to open its comments (only one post opens at a time)
- Add a comment (1–500 chars) → appears immediately (optimistic), persists to DB
- Delete your own comment → removed immediately and persists
- Pagination: after 20 comments, click "Load More Comments"
- Real-time: comment list and count poll every 5s when open

### Validations & Security
- Server-side validation via Zod
- Auth required for all comment APIs
- XSS-safe rendering of comment text

## 6) Build & Run (Production)
```
npm run build
npm start
```