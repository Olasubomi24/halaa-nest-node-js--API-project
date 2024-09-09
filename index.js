import express from 'express';
import cors from 'cors';
import mainRouter from './src/routes/routes.js';
import apiKeyMiddleware from './src/middleware/apiKeyMiddleWare.js';
import { json } from 'express'; 

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://194.163.149.51:4000',
  'http://194.163.149.51:5000',
  'http://194.163.149.51:5100'
];

app.use(json());

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true // Allow credentials
}));

// Custom middleware to explicitly set CORS headers
app.use((req, res, next) => {
  // Set the Access-Control-Allow-Origin header based on the request origin
  const origin = req.get('origin');
  if (allowedOrigins.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // End preflight response
  }

  next();
});

app.get('/', (req, res) => {
  res.send({ "status": "works fine" }).status(200);
});

app.use('/hialal', apiKeyMiddleware, mainRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
