import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpCacheService } from './httpCacheService.service';

@Injectable({
  providedIn: 'root'
})
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: HttpCacheService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    //pass along non-cacheable requests and invalidates requests
    if(request.method !== 'GET'){
      this.cacheService.invalidateCache();
      return next.handle(request);
    }

    //attempt to retrieve a cached response
    const cachedResponse : HttpResponse<any> = this.cacheService.get(request.url);
    
    //return cached response
    if(cachedResponse){
      return of(cachedResponse)
    }

    //send request to server and add response to cache
    return next.handle(request)
      .pipe(
        tap(event => {
          if(event instanceof HttpResponse){
            this.cacheService.put(request.url, event)
          }
        })
      )

  }

}
