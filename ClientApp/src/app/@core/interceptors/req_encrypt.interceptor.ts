import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpParams } from '@angular/common/http';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable()
export class Req_EncryptInterceptor implements HttpInterceptor {
  constructor(private tokenStorage: TokenStorageService) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let reqClone1, reqClone2: any;
    // console.log(httpRequest);
    if (
      httpRequest.url.indexOf('getCSRFToken') == -1 &&
      httpRequest.url.indexOf('getEncryptToken') == -1
    ) {
      if (httpRequest.body != null) {
        let fbEncValue = this.encryptData(httpRequest.body);
        reqClone1 = httpRequest.clone({
          body: { fbEncValue },
        });
        // console.log(reqClone1);
      } else {
        reqClone1 = httpRequest.clone();
      }
      if (httpRequest.urlWithParams.split('?')[1] != null) {
        let qaData: any = {};
        httpRequest.urlWithParams
          .split('?')[1]
          .split('&')
          .forEach((item) => {
            qaData[item.split('=')[0]] = item.split('=')[1];
          });
        let qsEncValue = this.encryptData(qaData);
        reqClone2 = reqClone1.clone({
          params: new HttpParams({ fromObject: { qsEncValue } }),
        });
        // console.log(reqClone2);
        return next.handle(reqClone2);
      } else {
        return next.handle(reqClone1);
      }
    }

    return next.handle(httpRequest);
  }

  /**
   * Helper method to encrypt given data
   * @returns encrypted strirng
   */
  encryptData(inputData: any) {
    let appData: any = this.tokenStorage.getAppData();
    var key = CryptoJS.enc.Utf8.parse(
      atob(appData.encToken.edInfo).split('_')[0]
    );
    var iv = CryptoJS.enc.Utf8.parse(
      atob(appData.encToken.edInfo).split('_')[1]
    );
    let ev = CryptoJS.AES.encrypt(JSON.stringify(inputData), key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return ev;
  }
}
