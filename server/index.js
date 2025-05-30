import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

const app = express();
dotenv.config();

app.use(express.json()); 
app.use(cors());
app.use(cookieParser());

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT

mongoose.set("strictQuery", true)

app.get("/", (req, res) => {
    res.send("Hello, WADS Backend!");
});

// Start the server
mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`)))
    .catch((error) => console.log(error.message));