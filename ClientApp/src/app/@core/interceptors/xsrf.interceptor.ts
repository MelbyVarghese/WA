import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExcludedMethods } from './method-constants';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {
  constructor(private tokenStorage: TokenStorageService) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Set different header in case of file upload URL
    var urlString = httpRequest.url.split('/');
    let methodFound = urlString.some((x) =>
      ExcludedMethods.CsrfHeaderMethods.includes(x)
    );
    if (httpRequest.url.includes('?')) {
      urlString.forEach((element) => {
        if (element.includes('?')) {
          methodFound = element
            .split('?')
            .some((x) => ExcludedMethods.CsrfHeaderMethods.includes(x));
        }
      });
    }

    // console.log(httpRequest);
    // Setting charset
    const updatedAuthReq = httpRequest.clone({
      headers: httpRequest.headers.set(
        'Content-Type',
        'application/json; charset=utf-8'
      ),
      withCredentials: true,
    });

    // load token
    var xsrfToken = this.getCookieValue('XSRF-TOKEN');
    // let appData: any = this.tokenStorage.getAppData();
    // let xsrfToken = appData?.csrfToken;

    if (xsrfToken != null && !methodFound) {
      // create a copy of the request and
      // append the XSRF token to the headers list
      // const autReq = httpRequest.clone({
      const autReq = updatedAuthReq.clone({
        headers: updatedAuthReq.headers.set('X-XSRF-TOKEN', xsrfToken),
        // headers: httpRequest.headers.set('X-XSRF-TOKEN', xsrfToken.session_Key),
        withCredentials: true,
      });

      return next.handle(autReq);
    } else {
      return next.handle(updatedAuthReq);
    }
  }

  private getCookieValue(cookieName: string) {
    const allCookies = decodeURIComponent(document.cookie).split('; ');
    for (let i = 0; i < allCookies.length; i++) {
      const cookie = allCookies[i];
      if (cookie.startsWith(cookieName + '=')) {
        return cookie.substring(cookieName.length + 1);
      }
    }
    return '';
  }
}
