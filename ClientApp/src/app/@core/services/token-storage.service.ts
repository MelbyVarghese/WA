import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ls from 'localstorage-slim';

const APP_DATA = 'user.app_data';
var SECRET_KEY = 'my secret key';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  // ls: any;

  constructor(private router: Router, private route: ActivatedRoute) {
    // enable encryption globally
    ls.config.encrypt = true;

    // optionally use a different secret key
    ls.config.secret = 3990;

    // this.route.paramMap.subscribe((params) => {
    //   // this.ls = new SecureLS({
    //   //   encodingType: 'aes',
    //   //   // encryptionSecret: this.account_key,
    //   //   isCompression: false,
    //   // });
    // });
  }

  signOut(): void {
    ls.clear();
  }

  public saveAppData(appData: any): void {
    ls.remove(APP_DATA);
    ls.set(APP_DATA, appData);
  }

  public getAppData() {
    if (ls.get(APP_DATA)) {
      try {
        return ls.get(APP_DATA);
      } catch {
        return null;
      }
    } else return null;
  }
}
