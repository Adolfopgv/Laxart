const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
require('./helpers/db');
const app = express();

// middleware
app.use(express.json())

app.use('/', require('./routes/authRoutes'))

const port = process.env.PORT
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))