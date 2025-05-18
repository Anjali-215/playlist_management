const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set('strictQuery', false);

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/onemusic', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to OneMusic Database');
    
    // Start server only after successful database connection
    const PORT = 3002;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if cannot connect to database
});

// Handle MongoDB connection errors
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Playlist Schema
const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    songs: [{
        title: String,
        artist: String,
        album: String,
        duration: String,
        coverImage: String
    }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Playlist = mongoose.model('Playlist', playlistSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Admin = mongoose.model('Admin', adminSchema);

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });
        
        if (!user) {
            throw new Error();
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

// Create default admin if not exists
async function createDefaultAdmin() {
    try {
        const adminExists = await Admin.findOne({ username: 'Anjali' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('12345678', 10);
            const admin = new Admin({
                username: 'Anjali',
                password: hashedPassword
            });
            await admin.save();
            console.log('Default admin created successfully');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
}

// Call createDefaultAdmin when server starts
createDefaultAdmin();

// Admin login route
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ adminId: admin._id }, JWT_SECRET);
        res.json({ token, username: admin.username });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Admin middleware
const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findOne({ _id: decoded.adminId });
        
        if (!admin) {
            throw new Error();
        }
        
        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate as admin' });
    }
};

// Routes
app.post('/api/register', async (req, res) => {
    try {
        console.log('Registration attempt with data:', { 
            username: req.body.username, 
            email: req.body.email 
        });

        const { username, email, password } = req.body;

        // Input validation
        if (!username || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                error: 'All fields are required',
                received: { username: !!username, email: !!email, password: !!password }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            console.log('User already exists:', existingUser.email);
            return res.status(400).json({ 
                error: 'User with this email or username already exists' 
            });
        }

        // Password validation
        if (password.length < 6) {
            console.log('Password too short');
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save user
        await user.save();
        console.log('User registered successfully:', user.username);

        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            username: user.username
        });
    } catch (error) {
        console.error('Registration error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            error: 'Registration failed',
            details: error.message 
        });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.json({ token, username: user.username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create new contact message
        const contact = new Contact({
            name,
            email,
            subject,
            message
        });

        await contact.save();
        console.log('Contact message saved:', { name, email, subject });
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Protected route example
app.get('/api/profile', auth, async (req, res) => {
    res.json({ username: req.user.username, email: req.user.email });
});

// Playlist Routes
app.post('/api/playlists', auth, async (req, res) => {
    try {
        const { name, description } = req.body;
        const playlist = new Playlist({
            name,
            description,
            userId: req.user._id
        });
        
        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

app.get('/api/playlists', auth, async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.user._id });
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch playlists' });
    }
});

app.get('/api/playlists/:id', auth, async (req, res) => {
    try {
        const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.user._id });
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch playlist' });
    }
});

app.put('/api/playlists/:id', auth, async (req, res) => {
    try {
        const { name, description } = req.body;
        const playlist = await Playlist.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { name, description },
            { new: true }
        );
        
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update playlist' });
    }
});

app.delete('/api/playlists/:id', auth, async (req, res) => {
    try {
        const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete playlist' });
    }
});

app.post('/api/playlists/:id/songs', auth, async (req, res) => {
    try {
        const { title, artist, album, duration, coverImage } = req.body;
        const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.user._id });
        
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        playlist.songs.push({ title, artist, album, duration, coverImage });
        await playlist.save();
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add song to playlist' });
    }
});

app.delete('/api/playlists/:playlistId/songs/:songIndex', auth, async (req, res) => {
    try {
        const playlist = await Playlist.findOne({ _id: req.params.playlistId, userId: req.user._id });
        
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        const songIndex = parseInt(req.params.songIndex);
        if (songIndex < 0 || songIndex >= playlist.songs.length) {
            return res.status(400).json({ error: 'Invalid song index' });
        }

        playlist.songs.splice(songIndex, 1);
        await playlist.save();
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove song from playlist' });
    }
});

// Get all contact messages (admin only)
app.get('/api/admin/contacts', adminAuth, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Failed to fetch contact messages' });
    }
});

// Delete contact message (admin only)
app.delete('/api/admin/contacts/:id', adminAuth, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
}); 