const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const cheerio = require('cheerio');
const Movie = require('../models/Movie');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// --- ROBUST SCRAPING FUNCTION (Hidden App Data Method) ---
async function scrapeIMDB() {
    console.log("🔄 Scraping IMDb Top 250 (Using Hidden App Data)...");
    const url = "https://www.imdb.com/chart/top/";
    
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        const $ = cheerio.load(data);
        let movies = [];

        // METHOD 1: Try "__NEXT_DATA__" (Most Reliable for Data Integrity)
        const nextDataScript = $("#__NEXT_DATA__").html();
        
        if (nextDataScript) {
            try {
                const json = JSON.parse(nextDataScript);
                // Navigate deep into the IMDb data structure
                const edges = json?.props?.pageProps?.pageData?.chartTitles?.edges;
                
                if (edges && Array.isArray(edges)) {
                    console.log(`🎯 Found ${edges.length} movies in Hidden App Data!`);
                    
                    movies = edges.map((edge) => {
                        const node = edge.node;
                        const rank = edge.currentRank;
                        
                        return {
                            title: node.titleText?.text || "Unknown Title",
                            rating: node.ratingsSummary?.aggregateRating?.toFixed(1) || "N/A",
                            year: node.releaseYear?.year?.toString() || "N/A",
                            poster: node.primaryImage?.url || "https://via.placeholder.com/150",
                            rank: rank,
                            movieUrl: `https://www.imdb.com/title/${node.id}/`,
                            description: `Ranked #${rank} on IMDb Top 250. Rating: ${node.ratingsSummary?.aggregateRating}`,
                            duration: 120 // Default, as extracting complex duration from this JSON is inconsistent
                        };
                    });
                }
            } catch (e) {
                console.error("⚠️ Failed to parse __NEXT_DATA__, falling back...", e.message);
            }
        }

        // METHOD 2: Fallback to JSON-LD (SEO Data) if Method 1 failed
        if (movies.length === 0) {
            console.log("⚠️ __NEXT_DATA__ failed, trying JSON-LD...");
            const jsonLdScripts = $('script[type="application/ld+json"]');
            
            jsonLdScripts.each((i, el) => {
                try {
                    const json = JSON.parse($(el).html());
                    if (json['@type'] === 'ItemList' && json.itemListElement) {
                        movies = json.itemListElement.map((item) => {
                            const movieData = item.item;
                            return {
                                title: movieData.name,
                                rating: movieData.aggregateRating?.ratingValue?.toString() || "N/A",
                                year: movieData.datePublished?.substring(0, 4) || "N/A",
                                poster: movieData.image || "https://via.placeholder.com/150",
                                rank: item.position,
                                movieUrl: movieData.url,
                                description: `Ranked #${item.position} on IMDb Top 250.`,
                                duration: 120
                            };
                        });
                    }
                } catch (e) { /* Ignore */ }
            });
        }

        // Final Sort by Rank to ensure strict 1-250 order
        movies.sort((a, b) => a.rank - b.rank);

        console.log(`✅ Final Scrape Count: ${movies.length}`);
        return movies;

    } catch (err) {
        console.error("❌ Scraping Error:", err.message);
        return [];
    }
}

// Helper: Pagination
const paginate = async (query, page, limit) => {
    const skip = (page - 1) * limit;
    const totalMovies = await Movie.countDocuments(query._conditions);
    const totalPages = Math.ceil(totalMovies / limit);
    const movies = await query.skip(skip).limit(limit);
    return { movies, currentPage: page, totalPages, totalMovies };
};

// --- ROUTES ---

// 1. Force Refresh (Clean Slate for Authentic Order)
router.get('/force-refresh', asyncHandler(async (req, res) => {
    console.log("⚠️ Force Refresh Triggered!");
    
    const scrapedData = await scrapeIMDB();
    
    if (scrapedData.length > 0) {
        // Delete all and insert fresh to guarantee order
        await Movie.deleteMany({});
        await Movie.insertMany(scrapedData);
    }
    
    res.json({ message: "Data refreshed successfully", count: scrapedData.length });
}));

// 2. GET ALL MOVIES
router.get('/', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const count = await Movie.countDocuments();
    
    // Auto-scrape if DB is almost empty
    if (count < 200 && page === 1) {
        console.log("⚡ DB incomplete. Running scraper...");
        scrapeIMDB().then(async (scrapedData) => {
            if (scrapedData.length > 0) {
                // Upsert logic for background sync
                const operations = scrapedData.map(movie => ({
                    updateOne: {
                        filter: { title: movie.title },
                        update: { $set: movie },
                        upsert: true
                    }
                }));
                await Movie.bulkWrite(operations);
                console.log("✅ Background Sync Complete!");
            }
        }).catch(err => console.error("Sync Failed", err));
    }

    const result = await paginate(Movie.find({}).sort({ rank: 1 }), page, limit);
    res.json(result);
}));

// 3. SEARCH
router.get('/search', asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) { res.status(400); throw new Error('Query required'); }
    
    const query = Movie.find({
        $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ]
    });
    const result = await paginate(query, parseInt(page), parseInt(limit));
    res.json(result);
}));

// 4. SORT
router.get('/sorted', asyncHandler(async (req, res) => {
    const { sortBy, page = 1, limit = 10 } = req.query; 
    let sortOptions = {};
    
    if (sortBy === 'title') sortOptions['title'] = 1;
    else if (sortBy === 'rating') sortOptions['rating'] = -1;
    else if (sortBy === 'year') sortOptions['year'] = -1;
    else if (sortBy === 'duration') sortOptions['duration'] = -1;
    else sortOptions['rank'] = 1;
    
    const query = Movie.find({}).sort(sortOptions);
    const result = await paginate(query, parseInt(page), parseInt(limit));
    res.json(result);
}));

// 5. ADMIN ROUTES
router.post('/', protect, isAdmin, asyncHandler(async (req, res) => {
    const { title, description, rating, duration } = req.body;
    if (!title) { res.status(400); throw new Error('Title required'); }
    
    const movie = await Movie.create({
        title, description, rating, duration,
        year: new Date().getFullYear().toString(),
        poster: "https://via.placeholder.com/150",
        rank: (await Movie.countDocuments()) + 1
    });
    res.status(201).json(movie);
}));

router.put('/:id', protect, isAdmin, asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMovie);
    } else { res.status(404); throw new Error('Movie not found'); }
}));

router.delete('/:id', protect, isAdmin, asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
        await movie.deleteOne();
        res.json({ message: 'Movie removed' });
    } else { res.status(404); throw new Error('Movie not found'); }
}));

module.exports = router;