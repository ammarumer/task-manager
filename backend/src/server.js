import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
// import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __envfile = path.join(__dirname, "../.env");
dotenv.config({path: __envfile , debug: true});

import sendEmail from "./config/emailService.js";

// // Serve frontend
// app.use(express.static(path.join(__dirname, "../public"))); // <-- note ../public

// Serve React build for production
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(express.json());

// // Allow all origins (simple test)
// app.use(cors());

// Or restrict to your frontend origin:
// app.use(cors({ origin: "http://localhost:5173" }));
// Connect DB
connectDB();

//
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../public/index.html"));
// });

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


// Fallback: any other route returns index.html
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// app.get("/", (req, res) => {
//     res.send("API is running...");
// });

app.post("/send-email", async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        const info = await sendEmail(to, subject, text);
        res.json({ success: true, messageId: info.messageId });
    } catch (err) {
        console.error("Email error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
