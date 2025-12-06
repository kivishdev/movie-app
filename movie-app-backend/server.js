const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const https = require('https'); // Import https to ping self

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Default Route for Ping
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/auth', require('./routes/authRoutes'));
app.use('/movies', require('./routes/movieRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // --- SELF PING MECHANISM (Keep-Alive for Render) ---
    // Only run this in production to save resources locally
    if (process.env.NODE_ENV === 'production') {
        const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`; // Render automatically sets this env var
        
        // OR manually replace 'url' with your actual Render URL if env var doesn't work locally for testing
        // const url = "https://your-app-name.onrender.com"; 

        console.log(`⏰ Keep-Alive Ping set for: ${url}`);

        setInterval(() => {
            https.get(url, (res) => {
                console.log(`✅ Ping successful: ${res.statusCode}`);
            }).on('error', (e) => {
                console.error(`❌ Ping failed: ${e.message}`);
            });
        }, 14 * 60 * 1000); // 14 minutes
    }
});