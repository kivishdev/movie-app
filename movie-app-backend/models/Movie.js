const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    rating:      { type: String }, // IMDb returns rating as text sometimes
    year:        { type: String },
    poster:      { type: String }, // URL of the image
    rank:        { type: Number },
    movieUrl:    { type: String }, // Link to IMDb page
    description: { type: String }, // Optional
    duration:    { type: Number }  // Optional
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);