import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';

const swaggerDocument = YAML.load('./swagger.yaml');


class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseConnection();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
    this.initialiseHomeRoute();
    this.initialiseSwaggerUI();
  }

  private initialiseMiddleware(): void {
    this.express.use(
      rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 100, // maximum requests per minute
        message: 'Too many requests from this IP, please try again later.',
      })
    );
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initialiseHomeRoute(): void {
    this.express.get('/', (req, res) => {
      res.send("<h1>Locale API</h1><a href='/api-docs'>Documentation</a>");
    });
  }

  private initialiseSwaggerUI(): void {
    this.express.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  }

  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api/v1', controller.router);
    });
  }

  private initialiseErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  private async initialiseDatabaseConnection(): Promise<void> {
    const { MONGO_URL } = process.env;

    try {
      await mongoose.connect(`${MONGO_URL}`);
      console.log('Connected to the database successfully');
    } catch (error) {
      console.error('Could not connect to the database');
      process.exit(1);
    }
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

export default App;
