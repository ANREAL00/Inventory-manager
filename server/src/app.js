const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

require('./config/passport');

const authRoutes = require('./routes/authRoutes');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
    res.send('Inventory Manager API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

module.exports = app;