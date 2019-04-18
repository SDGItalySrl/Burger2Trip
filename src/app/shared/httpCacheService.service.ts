import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class HttpCacheService {
  private requests: any = { };

  constructor() { }

  /**
   * Cache response from the URL
   * @param url URl being requested
   * @param response response being cached
   */
  put(url: string, response: HttpResponse<any>): void{
    this.requests[url] = response;
  }

  /**
   * Get data from cache
   * @param url url being requested
   */
  get(url: string): HttpResponse<any> | undefined{
    return this.requests[url];
  }

  /**
   * Delete a response from a specific url
   * @param url url to be deleted
   */
  invalidateUrl(url: string): void{
    this.requests[url] = undefined;
  }

  /**
   * Delete all the cache
   */
  invalidateCache(): void{
    this.requests = { }
  }

}
