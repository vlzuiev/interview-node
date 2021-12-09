import 'reflect-metadata';
import { Application as ExpressApplication } from 'express';
import Container, { Service } from 'typedi';
import { useContainer } from 'typeorm';
import logger from './logger/Logger';
import Server from './Server';

@Service({ global: true })
export class Application {
  constructor(private readonly server: Server) {}

  public expressApp: ExpressApplication | undefined;

  public static async startUp(): Promise<Application> {
    useContainer(Container);

    const application = Container.get(Application);
    try {
      await application.startExpressServer();
      return application;
    } catch (e) {
      logger.warn('Disconnecting the DB.');
      throw e;
    }
  }

  private async startExpressServer(): Promise<void> {
    this.expressApp = await this.server.run();
  }
}
