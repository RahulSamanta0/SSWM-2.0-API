import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import authRoutes from "./routes/loginroutes/authRoutes.js"


// import { errorHandler } from "./middlewares/errorHandler.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security Middleware
app.use(helmet())
app.use(cors(
  {
    origin: ['http://localhost:3000', 'http://localhost:3001','https://rstb-api.vercel.app'],
    credentials: true
  }
))
app.use(morgan("combined"))

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)


// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "SSWM 2.0 API Server is running" })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Global Error Handler
// app.use(errorHandler)

// Start Server
app.listen(PORT, () => {
  console.log(`SSWM 2.0 Server running on port ${PORT}`)
})

export default app
