const express = require('express');
const http = require('http');
const { initSocket } = require('./socket');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const itemRoutes = require('./routes/itemRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventories', inventoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
    res.send('Inventory Manager API is running');
});

app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR:', err);
    res.status(500).json({ status: 'error', message: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
});

const server = http.createServer(app);
const io = initSocket(server);

app.set('io', io);

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

module.exports = app;