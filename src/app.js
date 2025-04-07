import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import { Register, Login } from "./controllers/auth.js"
import verifyToken from "./controllers/verifyToken.js"
import pino from "pino"

const logger = pino()
const app = express()

const corsOptions ={
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allow sending cookies
    methods: ["GET", "POST", "OPTIONS"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow headers
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

mongoose.connect(process.env.MONGO_DB)
    .then(() => logger.info("Connected to mongoDb"))
    .catch(err => logger.error("MongoDB connection error:", err));

app.post("/register", Register)

app.post("/login", Login)

app.post("/logout", (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logged out successfully" });
});

app.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "Access granted", user: req.user });
});


app.listen(7001, () => console.log(`Server running on port ${7001}`));