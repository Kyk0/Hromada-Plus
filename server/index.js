require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Middlewares
app.use(express.json());

// Basic route to test
app.get('/', (req, res) => {
    res.send('Hromada+ backend is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const hromadaRoutes = require('./routes/hromadas');
app.use('/api/hromadas', hromadaRoutes);

const initiativeRoutes = require('./routes/initiatives');
app.use('/api/initiatives', initiativeRoutes);

const announcementRoutes = require('./routes/announcements');
app.use('/api/announcements', announcementRoutes);

const supportRoutes = require('./routes/initiativeSupport');
app.use('/api/initiative-supports', supportRoutes);

const commentRoutes = require('./routes/comments');
app.use('/api/comments', commentRoutes);

const moderationRoutes = require('./routes/moderation');
app.use('/api/moderation', moderationRoutes);
