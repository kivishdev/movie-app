🎬 MERN Stack Movie Application

A full-stack movie database application built with the MERN Stack (MongoDB, Express, React, Node.js). This application features authentic data scraping from IMDb's Top 250 list, robust role-based authentication, and a modern Netflix-style user interface.

🚀 Live Demo

Frontend (Vercel): [Add Your Vercel Link Here]

Backend (Render): [Add Your Render Link Here]

✨ Key Features

🌟 User Features

Authentic Data: Fetches real-time data from IMDb's Top 250 chart (Rank, Rating, Year, Poster).

Smart Search & Sort:

Search movies by title or description.

Sort by Rating, Duration, Release Year, or Alphabetical order.

Advanced Filtering: Use the calendar filter to sort movies by release year.

Responsive UI: Fully responsive design built with Material UI (MUI), featuring a dark/light mode aesthetic.

Pagination: Efficient server-side pagination to handle large datasets seamlessly.

🛡️ Admin Features (Role-Based Access Control)

Secure Dashboard: Protected routes accessible only to Admins.

CRUD Operations:

Create: Add new movies manually.

Update: Edit details of existing movies.

Delete: Remove movies from the database.

Smart Caching (Upsert Logic): The system intelligently checks for missing data and auto-scrapes IMDb only when necessary, preventing duplicate entries and optimizing database calls.

🛠️ Tech Stack

Frontend: React.js (Vite), Material UI, Context API, Axios

Backend: Node.js, Express.js

Database: MongoDB (Atlas)

Scraping: Cheerio, Axios

Authentication: JWT (JSON Web Tokens)

Deployment: Vercel (Frontend), Render (Backend)

⚙️ Installation & Setup Guide

Follow these steps to run the project locally.

Prerequisites

Node.js installed

MongoDB Atlas Account (or local MongoDB)

1. Clone the Repository

git clone [https://github.com/YOUR_USERNAME/mern-movie-app.git](https://github.com/YOUR_USERNAME/mern-movie-app.git)
cd mern-movie-app


2. Backend Setup

Navigate to the backend folder and install dependencies:

cd movie-app-backend
npm install


Create a .env file in the movie-app-backend folder and add your credentials:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_123


Start the Backend Server:

node server.js
# Server running on http://localhost:5000


3. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies:

cd movie-app-frontend
npm install


Start the React Development Server:

npm run dev
# Frontend running on http://localhost:5173


🔗 API Endpoints

Public Routes

GET /movies - Get all movies (Paginated)

GET /movies/search?q=name - Search movies

GET /movies/sorted?sortBy=rating - Sort movies

POST /auth/register - Register new user/admin

POST /auth/login - Login user

Admin Routes (Protected)

POST /movies - Add new movie

PUT /movies/:id - Update movie details

DELETE /movies/:id - Delete a movie

GET /movies/force-refresh - Force scrape fresh data from IMDb

🧠 Smart Implementation Highlights

"Hidden App Data" Scraping: Instead of relying on brittle DOM selectors, the backend extracts structured JSON data directly from IMDb's source code (__NEXT_DATA__). This ensures 100% accurate rankings, years, and ratings.

Upsert Strategy: The scraping logic uses MongoDB's bulkWrite with upsert: true. This means existing movies are updated, and new ones are inserted—preventing duplicates and data loss.

Hybrid Pagination: The frontend intelligently switches between client-side and server-side pagination based on the data volume received, ensuring a smooth user experience regardless of network speed.

👨‍💻 Author

Developed by [Your Name] - GitHub: [Your Profile Link]

LinkedIn: [Your Profile Link]

This project was built as part of a Full Stack Developer Assessment.