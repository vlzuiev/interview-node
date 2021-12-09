import axios, { AxiosResponse } from 'axios';
import { err, ok, Result } from 'neverthrow';
import { Service } from 'typedi';
import RequestHandler from './utils/RequestHandler';

export interface Planet {
  name: string;
  diameter: number;
  climate: string;
  gravity: string;
  terrain: string;
  population: number;
}

type SwapiResponse = AxiosResponse<{
  results: Planet[];
}>;
@Service({ global: true })
export default class PlanetFacade {
  private readonly swapiBaseUrl = 'https://swapi.dev';

  constructor(readonly requestHandler: RequestHandler) {}

  public async getAllPlanets(): Promise<Result<Planet[], Error>> {
    try {
      const getPlanets = await axios.get(`${this.swapiBaseUrl}/api/planets`);
      if (this.isSwapiResponse(getPlanets)) {
        return ok(getPlanets.data.results);
      }
      console.log('here');
      return err(new Error('Malformed response'));
    } catch (error) {
      return err(error);
    }
  }
  private isSwapiResponse(response: unknown): response is SwapiResponse {
    const getPlanetsResponse = response as Partial<SwapiResponse>;
    if (getPlanetsResponse.data === undefined) {
      return false;
    }

    if (!Array.isArray(getPlanetsResponse.data.results)) {
      return false;
    }

    return true;
  }
}
