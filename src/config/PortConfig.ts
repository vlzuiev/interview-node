import { Service } from 'typedi';

@Service({ global: true })
export default class PortConfig {
  public getServerPort(): number {
    return parseInt(process.env.PORT ?? '8080', 10);
  }
}
