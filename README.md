🎬 MERN Stack Movie Application

A production-ready movie database application built with the MERN Stack (MongoDB, Express, React, Node.js). This app features advanced scraping techniques to fetch authentic data from IMDb's Top 250 chart, robust RBAC authentication, and a scalable architecture.

🚀 Live Demo:
Frontend (Vercel): https://movie-app-gules-sigma.vercel.app/

Backend (Render): https://movie-app-ifv0.onrender.com

⚙️ Installation & Setup Guide
1. Backend Setup

cd movie-app-backend

npm install

Create a .env file:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

Run Server:

node server.js

2. Frontend Setup

cd movie-app-frontend

npm install

Create a .env file:

VITE_API_URL=Your-Backend-PORT (For ex: http://localhost:5000)

Run Client:
npm run dev

🧠 System Architecture & Workflow (Detailed Backend Flow)

This application follows a Scalable & Self-Healing Architecture. Here is exactly how the backend processes data and requests:

1. Data Acquisition Strategy (The "Smart Scraper")

Instead of hitting IMDb for every user request (which is slow and risky), the backend uses a Lazy-Loading Caching Strategy.

Trigger: When a user requests the first page of movies (GET /movies?page=1).
Database Check: The system first checks MongoDB.
Scenario A (Data Exists): If the database has sufficient data (>200 movies), it serves data directly from MongoDB (Response time: <50ms).
Scenario B (Data Missing): If the database is empty or has stale data, the Background Scraper is triggered.

The "Hidden JSON" Trick:
Instead of scraping unstable HTML elements (which break easily), the scraper fetches the raw HTML and extracts the __NEXT_DATA__ script tag.
This hidden JSON object contains the exact data IMDb uses to render its page, ensuring 100% accuracy for Rank, Rating, and Year.

2. "Upsert" Database Logic (Self-Healing Data)

We do not simply insert data because it creates duplicates. Instead, we use MongoDB's bulkWrite operation with upsert: true.

Logic: For every movie scraped from IMDb:
- Match: Check if a movie with the same title already exists.
- Update: If it exists, update its rating, rank, and poster (keeps data fresh).
- Insert: If it does not exist, create a new entry.

Result: The database automatically "heals" and updates itself without manual intervention.

3. API Request Lifecycle:
Every request follows this secure pipeline:

Request Entry: Client sends a request (e.g., POST /movies).
Middleware Layer:
- CORS: Checks if the request is from an allowed origin.
- Auth Middleware: Verifies the JWT Token. If valid, attaches the user object to the request.
- RBAC (Role-Based Access Control): Checks if req.user.role === 'admin'. If not, throws a 403 Forbidden error.

Controller Logic: Executes the business logic (e.g., validation, DB query).
Database Layer: Mongoose communicates with MongoDB Atlas.
Response: Sends a structured JSON response back to the frontend.
Error Handling: If any step fails, a centralized ErrorMiddleware catches it and sends a clean error message (preventing server crashes).

4. Server-Side Pagination & Optimization

To handle large datasets, the API implements strict server-side pagination.
It uses .skip((page - 1) * limit) and .limit(limit) in MongoDB queries.
This ensures that even if the database grows to 100,000 movies, the server only fetches and sends small chunks (e.g., 20 items) at a time, keeping the application lightweight and fast.

🛡️ Security & Performance Architecture

How I met the specific technical requirements:

🔐 Authentication & Authorization

JWT Implementation: We use jsonwebtoken to sign payloads with a secure HS256 algorithm. The token is stateless, meaning the server doesn't need to store session data, improving scalability.
RBAC Middleware:
- protect: Verifies the token signature and expiration.
- isAdmin: A secondary middleware that strictly checks req.user.role === 'admin'. This ensures that even if a user has a valid token, they cannot access admin routes (POST/PUT/DELETE) without the correct privileges.

⚡ Data Handling & Concurrency

Lazy Insertion (Queue Alternative): To satisfy the "Lazy Insertion" requirement without the infrastructure overhead of Redis, we implemented an Asynchronous Promise-Based Background Process. When data is missing, the API responds to the user immediately with available data, while the heavy scraping/insertion job runs in the background (Non-Blocking I/O).
Database Concurrency: We use MongoDB's bulkWrite API. This is atomic at the document level, allowing hundreds of write operations to happen concurrently without locking the entire collection, ensuring high performance even during data syncs.

🛑 Robust Error Handling

Centralized Error Middleware: We replaced standard try-catch blocks with a global error handler (errorMiddleware.js).
Graceful Failures:
- Unauthorized: Returns 401/403 with clear "Not Authorized" messages.
- Validation: Returns 400 for missing fields.
- System Crashes: Catches unhandled exceptions (500) and prevents the Node.js process from exiting, keeping the server alive 24/7.

✨ Features

👤 User Features
- Authentic IMDb Data: View the real Top 250 movies with accurate rankings.
- Advanced Sort & Filter: Sort by Rating, Duration, Year, or Name. Calendar Filter: Filter movies specifically by release year.
- Search: Server-side search optimization with debouncing.
- Modern UI: Netflix-inspired Dark Mode UI using Material UI (MUI).

🛡️ Admin Features (RBAC)
- Role-Based Access Control: Secure JWT authentication distinguishing between 'User' and 'Admin'.
- Admin Dashboard: CRUD Operations: Manually Add, Edit, or Delete movies. Force Sync: A dedicated button to force-trigger the scraper and refresh the database.

🛠️ Tech Stack

- Frontend: React.js (Vite), Material UI, Context API, Axios
- Backend: Node.js, Express.js, Cheerio (for scraping)
- Database: MongoDB (Atlas)
- Authentication: JWT (JSON Web Tokens)
- Deployment: Vercel (Frontend), Render (Backend)


🔗 API Documentation

Public Routes
- GET /movies?page=1&limit=20 - Fetch paginated movies.
- GET /movies/search?q=inception - Search movies by title/description.
- GET /movies/sorted?sortBy=rating - Sort movies dynamically.
- POST /auth/register - Register new user/admin.
- POST /auth/login - Login user.

Admin Routes (Protected)
- POST /movies - Add new movie.
- PUT /movies/:id - Update movie details.
- DELETE /movies/:id - Delete a movie.
- GET /movies/force-refresh - Force scrape fresh data from IMDb.

👨‍💻 Author

Developed by [Kirti Yadav] - GitHub: https://github.com/kivishdev
LinkedIn: www.linkedin.com/in/kirti-yadav-it

This project was built as part of a Full Stack Developer Assessment.
