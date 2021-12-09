import { Request, Response, Router } from 'express';
import PlanetController from '../controllers/PlanetController';
import { Service } from 'typedi';

@Service()
export default class MainRoute {
  constructor(private readonly planetController: PlanetController) {}

  public mountRoutes(app: Router): Router {
    app.get('/planets/', async (req: Request, res: Response) =>
      this.planetController.getAllPlanets(req, res)
    );

    app.get('/planet/:planetName', async (req: Request, res: Response) =>
      this.planetController.getPlanet(req, res)
    );

    return app;
  }
}
