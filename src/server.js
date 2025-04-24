import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { initDB } from './db/initMongoConnection.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import * as fs from "node:fs";
import userRouter from './routes/user.js';



const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve("docs", "swagger.json"), "utf-8"));

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.use("/uploads", express.static(path.resolve("src", "uploads")));

app.use(cookieParser());

app.use(cors());
app.use(express.json());
app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use("/users", userRouter);


app.get('/', (req, res) => {
  res.json({
    message: 'Hello from the server!',

  });
});

app.use(notFoundHandler);


app.use(errorHandler);

export const startServer = async () => {
  const PORT = process.env.PORT || 3000;

  try {
    console.log('Starting server...');
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error.message);
  }
};

export default app;