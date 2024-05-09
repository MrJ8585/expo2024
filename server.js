require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectDB } = require('./db/db');
const publicRouter = require('./controllers/publicController');


connectDB();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/', publicRouter);


app.listen(process.env.PORT || 8080);