import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';
import RedisCache from './utils/cache';

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
    }

    private initialiseMiddleware(): void {
        this.express.use(
            rateLimit({
                windowMs: 60 * 1000, // 1 minute
                max: 100, // maximum requests per minute
                standardHeaders: true,
                legacyHeaders: false,
                message:
                    'Too many requests from this IP, please try again later.',
            })
        );
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
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
            console.log('connected successfully');
        } catch (error) {
            console.error('Could not connect to DB');
            process.exit(1);
        }
    }

    public listen(): void {
        this.express.listen(this.port, async () => {
            console.log(`App listening on port ${this.port}`);
        });
    }

}

export default App;
