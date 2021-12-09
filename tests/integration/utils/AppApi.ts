import axios, { AxiosResponse } from 'axios';
import getPort from 'get-port';
import 'reflect-metadata';
import { instance, mock, when } from 'ts-mockito';
import Container, { Service } from 'typedi';
import { useContainer } from 'typeorm';
import Config from '../../../src/config/Config';
import PortConfig from '../../../src/config/PortConfig';
import Server from '../../../src/Server';

@Service({ global: true })
export class AppApi {
  constructor(private readonly config: Config) {}

  public static async createInstance(): Promise<AppApi> {
    Container.reset();

    const portConfig = mock(PortConfig);
    const port = await getPort();
    when(portConfig.getServerPort()).thenReturn(port);

    Container.set(PortConfig, instance(portConfig));

    useContainer(Container);

    const app = Container.get(Server);
    await app.run();

    const config = Container.get(Config);

    return new AppApi(config);
  }

  public async stop(): Promise<void> {
    const app = Container.get(Server);
    await app.stop();
    Container.reset();
  }

  public async getPlanetName(planetId: string): Promise<AxiosResponse<string>> {
    try {
      return await axios.get<string>(
        `${this.buildBasePath()}/api/planet/${planetId}`
      );
    } catch (e) {
      return e.response;
    }
  }

  private buildBasePath(): string {
    return `http://localhost:${this.config.getServerPort()}`;
  }
}
