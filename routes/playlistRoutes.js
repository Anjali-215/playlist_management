const express = require('express');
const Playlist = require('../modals/playlist'); // Ensure correct path to your model
const router = express.Router();

// GET: Get all playlists
router.get('/api/playlists', async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching playlists' });
    }
});

// POST: Create new playlist
router.post('/api/playlists', async (req, res) => {
    try {
        const { name, description } = req.body;
        const playlist = await Playlist.create({ name, description });
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ error: 'Error creating playlist' });
    }
});

// POST: Add song to playlist
router.post('/api/playlists/:id/addSong', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        const { title, artist } = req.body;
        playlist.songs.push({ title, artist });
        await playlist.save();
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ error: 'Error adding song to playlist' });
    }
});

// DELETE: Delete playlist
router.delete('/api/playlists/:id', async (req, res) => {
    try {
        await Playlist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Playlist deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting playlist' });
    }
});

// DELETE: Remove song from playlist
router.delete('/api/playlists/:playlistId/removeSong/:songId', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId);
        playlist.songs = playlist.songs.filter(song => song._id != req.params.songId);
        await playlist.save();
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ error: 'Error removing song' });
    }
});

module.exports = router;
