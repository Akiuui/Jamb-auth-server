import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import { Register, Login } from "./controllers/auth.js"
import pino from "pino"

const logger = pino()
const app = express()
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_DB)
    .then(() => logger.info("Connected to mongoDb"))
    .catch(err => logger.error("MongoDB connection error:", err));

app.post("/register", Register)
app.post("/login", Login)


app.listen(7001, () => console.log(`Server running on port ${7001}`));