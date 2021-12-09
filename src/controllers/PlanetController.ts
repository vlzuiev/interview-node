import { Service } from 'typedi';
import { Request, Response } from 'express';
import PlanetService from '../services/PlanetService';

@Service()
export default class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  public async getAllPlanets(_req: Request, res: Response): Promise<void> {
    const getPlanetsResult = await this.planetService.getAllPlanets();
    if (getPlanetsResult.isOk()) {
      res.status(200).json(getPlanetsResult.value);
      return;
    }
    res.sendStatus(500);
  }

  public async getPlanet(_req: Request, _res: Response): Promise<void> {
    return;
  }
}
