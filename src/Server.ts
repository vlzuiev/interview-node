import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Router, Express } from 'express';
import { Server as HttpServer } from 'http';
import helmet from 'helmet';
import morgan from 'morgan';
import { Service } from 'typedi';

import PortConfig from './config/PortConfig';
import logger from './logger/Logger';
import MainRoute from './routes/MainRoute';

import 'express-async-errors';
import 'reflect-metadata';
import rateLimit from 'express-rate-limit';

@Service({ global: true })
export default class Server {
  constructor(
    private readonly mainRoute: MainRoute,
    private readonly portConfig: PortConfig
  ) {}

  public server: HttpServer;
  public expressApp: Express;

  public async run(): Promise<Application> {
    this.expressApp = express();
    const router = Router();
    const port = this.portConfig.getServerPort();

    this.registerPlugins();

    this.registerRoutes(router);

    this.server = this.expressApp.listen(port, () =>
      logger.info(`Express server started on port: ${port}`)
    );

    return this.expressApp;
  }

  private async registerPlugins(): Promise<void> {
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: true }));
    this.expressApp.use(cookieParser());

    const corsOptions = {
      origin: ['http://localhost:4000'],
      optionsSuccessStatus: 200,
      methods: 'GET, POST, DELETE',
    };

    this.expressApp.use(cors(corsOptions));

    if (process.env.NODE_ENV === 'development') {
      this.expressApp.use(morgan('dev'));
    } else {
      this.expressApp.use(helmet());
      this.expressApp.use(express.json({ limit: '10kb' }));

      const limit = rateLimit({
        max: 100, // max requests
        windowMs: 60 * 60 * 1000, // 1 Hour
        message: 'Too many requests', // message to send
      });
      this.expressApp.use('/api', limit);
    }
  }

  private async registerRoutes(router: Router): Promise<void> {
    this.expressApp.use('/api', this.mainRoute.mountRoutes(router));
  }

  public async stop(): Promise<void> {
    await this.server.close();
  }
}
