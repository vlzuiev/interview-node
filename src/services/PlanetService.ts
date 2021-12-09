import PlanetFacade, { Planet } from '../facades/PlanetFacade';
import { Service } from 'typedi';
import { err, ok, Result } from 'neverthrow';

@Service()
export default class PlanetService {
  constructor(private readonly planetFacade: PlanetFacade) {}

  public async getAllPlanets(): Promise<Result<Planet[], Error>> {
    const getAllPlanetsResult = await this.planetFacade.getAllPlanets();
    if (getAllPlanetsResult.isOk()) {
      return ok(this.mapSwapiResults(getAllPlanetsResult.value));
    }

    return err(getAllPlanetsResult.error);
  }

  public async getPlanet(): Promise<void> {
    return;
  }

  private mapSwapiResults(planets: Planet[]): Planet[] {
    return planets.map((planet) => ({
      name: planet.terrain,
      diameter: planet.diameter,
      climate: planet.climate,
      gravity: planet.gravity,
      terrain: planet.terrain,
      population: planet.population,
    }));
  }
}
