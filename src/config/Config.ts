import { Service } from 'typedi';
import PortConfig from './PortConfig';

@Service({ global: true })
export default class Config {
  constructor(private readonly portConfig: PortConfig) {}

  public getServerPort(): number {
    return this.portConfig.getServerPort();
  }

  public isProductionStage(): boolean {
    return this.isItProductionStage(this.getStage());
  }

  public isItProductionStage(stage: string | undefined): boolean {
    if (stage === undefined || stage === 'development') {
      return false;
    }
    return true;
  }

  public getStage(): string | undefined {
    return process.env.APP_STAGE;
  }
}
