const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const { mongoose } = require('mongoose')
const app = express();

// DB connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: 'ecommerceDB',
})
.then(() => console.log('Database connected'))
.catch((err) => console.log('Database not connected', err))

// middleware
app.use(express.json())

app.use('/', require('./routes/authRoutes'))

const port = process.env.PORT
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))