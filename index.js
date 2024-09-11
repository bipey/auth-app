import express from "express";
import "dotenv/config";
import {connctDb} from "./Public/src/database/dab_connect.js";
import userRouter from "./Public/src/routes/userRouter.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';
const app = express();

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the port
const port = process.env.PORT || 3000;

// Routes
app.use("/user", userRouter);

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'Public')));

// Serve a static HTML file or use a templating engine
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Public/frontend/html/register.html");  
});

// Database connection and server start
connctDb().then(() => {
    app.listen(port, () => {
        console.log(`Server running at port ${port}`);
    });
}).catch((error) => {
    console.error("An error occurred while connecting to the database:", error);
});
