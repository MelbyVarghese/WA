import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpParams } from '@angular/common/http';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable()
export class Res_DecryptInterceptor implements HttpInterceptor {
  constructor(private tokenStorage: TokenStorageService) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      httpRequest.url.indexOf('getCSRFToken') == -1 &&
      httpRequest.url.indexOf('getEncryptToken') == -1
    ) {
      return next.handle(httpRequest).pipe(
        map((event) => {
          if (event instanceof HttpResponse) {
            event = event.clone({
              body: this.decryptData(event.body.encryptedValue),
            });
          }
          return event;
        })
      );
    } else {
      return next.handle(httpRequest);
    }
  }

  /**
   * Helper method to decrypt given data and parse the string to JSON
   * @returns decrypted JSON data
   */
  decryptData(ciphertextB64: any) {
    if (!ciphertextB64) {
      return;
    }
    try {
      let appData: any = this.tokenStorage.getAppData();
      var key = CryptoJS.enc.Utf8.parse(
        atob(appData.encToken.edInfo).split('_')[0]
      );
      var iv = CryptoJS.enc.Utf8.parse(
        atob(appData.encToken.edInfo).split('_')[1]
      );

      var decrypted = CryptoJS.AES.decrypt(ciphertextB64.trim(), key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      console.log(JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)));
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
