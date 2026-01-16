const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DB_CONNECT', 'JWT_SECRET', 'CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Error: Missing required environment variable ${varName}`);
    process.exit(1);
  }
});

const app = express();
const connecttoDb = require('./src/db/db')
const authRoutes = require('./src/routes/auth.routes');
const clientRoutes = require('./src/routes/client.routes');
const taskRoutes = require('./src/routes/task.routes');
const documentRoutes = require("./src/routes/documentRoutes");
const cookieParser = require('cookie-parser');

connecttoDb();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   methods: "GET,POST,PUT,DELETE",
//   credentials: true
// }));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/admin' , authRoutes);
app.use('/client' , clientRoutes);
app.use('/task' , taskRoutes);
app.use("/api/documents", documentRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is awake." });
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})