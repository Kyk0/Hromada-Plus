require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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