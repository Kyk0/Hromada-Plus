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

const hromadaRoutes = require('./routes/hromadaRoutes');
app.use('/api/hromadas', hromadaRoutes);