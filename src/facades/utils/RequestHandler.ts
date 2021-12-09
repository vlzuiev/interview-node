import { Service } from 'typedi';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { err, ok, Result } from 'neverthrow';

@Service()
export default class RequestHandler {
  public async get<T>(
    url: string,
    requestConfig?: AxiosRequestConfig
  ): Promise<Result<AxiosResponse<T>, AxiosError>> {
    try {
      const response = await axios.get(url, requestConfig);
      return ok(response);
    } catch (error) {
      return err(error);
    }
  }
}
