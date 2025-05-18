const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    songs: [{ 
        title: String, 
        artist: String, 
        duration: String // Format: "3:45"
    }],
    description: String,
    created_at: { type: Date, default: Date.now },
});

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;
