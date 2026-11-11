import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import homeRoutes from './routes/homeRoutes.js';
import session from 'express-session';
import loginRouter from './routes/loginRouter.js';
import registerRoutes from './routes/registerRoutes.js';
import checkAuthRouter from './routes/checkAuthRouter.js';
import dataRouter from './routes/dataRouter.js';

const backendDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(backendDir, '.env') });
dotenv.config({ path: resolve(backendDir, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;
const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  '/uploads',
  express.static(resolve(backendDir, '../frontend/src/uploads'))
);

if (isProduction) {
  app.set('trust proxy', 1);
}

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not configured in backend/.env');
    }
    if (!process.env.MONGO_DB_NAME) {
      throw new Error('MONGO_DB_NAME is not configured in backend/.env');
    }
    if (!process.env.SECRET_KEY) {
      throw new Error('SECRET_KEY is not configured');
    }

    const mongoHost = new URL(process.env.MONGO_URI).hostname;
    if (['localhost', '127.0.0.1', '::1'].includes(mongoHost)) {
      throw new Error(
        'MONGO_URI in backend/.env points to localhost. Replace it with your MongoDB Atlas connection string.'
      );
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME
    });
    console.log('MongoDB Atlas connected successfully');

    app.use(
      session({
        secret: process.env.SECRET_KEY,
        store: MongoStore.create({
          client: mongoose.connection.getClient(),
          collectionName: 'sessions',
          ttl: 24 * 60 * 60
        }),
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'none' : 'lax',
          maxAge: 24 * 60 * 60 * 1000
        }
      })
    );

    app.get('/api/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'PawGo backend is running'
      });
    });

    app.use('/api/home', homeRoutes);
    app.use('/api/login', loginRouter);
    app.use('/api/register', registerRoutes);
    app.use('/api/check-auth', checkAuthRouter);
    app.use('/api/petdata', dataRouter);

    await new Promise((resolve, reject) => {
      const server = app.listen(PORT, () => {
        console.log(`PawGo backend running on port ${PORT}`);
        resolve(server);
      });
      server.once('error', reject);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      'Failed to start PawGo backend:',
      process.env.MONGO_URI ? message.replace(process.env.MONGO_URI, '[MongoDB URI redacted]') : message
    );
    process.exit(1);
  }
};

startServer();
