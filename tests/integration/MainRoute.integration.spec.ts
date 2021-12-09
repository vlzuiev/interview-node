import nock from 'nock';
import { AppApi } from './utils/AppApi';

jest.setTimeout(30_000);

describe('MainRoute integration test', () => {
  let api: AppApi;

  beforeEach(async () => {
    api = await AppApi.createInstance();
  });

  afterEach(async () => {
    await api.stop();
    nock.cleanAll();
  });

  describe('Planet', () => {
    const planetId = '1';

    it('gets planet name by id', async () => {
      const { status, data } = await api.getPlanetName(planetId);

      expect(status).toEqual(200);
      expect(data).toEqual('Tatooine');
    });
  });
});
