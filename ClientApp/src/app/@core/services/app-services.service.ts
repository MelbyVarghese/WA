import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AppServicesService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  baseURL: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private tokenStorage: TokenStorageService,
    private cookieService: CookieService
  ) {
    this.baseURL = environment.production
      ? baseUrl + 'api/login/'
      : 'https://localhost:7174/3990/AdminModule/api/login/';
  }

  public get currentUserValue() {
    let appData: any = this.tokenStorage.getAppData();
    return appData && appData.currentUser;
  }

  /**
   * To fetch CSRF token details
   * @returns CSRF token details
   */
  getCSRFToken(): Observable<any> {
    return this.http.get<any>(this.baseURL + 'GetCSRFToken/getCSRFToken').pipe(
      tap((csrfToken) => {
        if (csrfToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.tokenStorage.saveAppData({ app: 'cognizantOn' });
          let appData: any = this.tokenStorage.getAppData();
          appData.csrfToken = csrfToken;
          this.cookieService.set(
            'XSRF-TOKEN',
            csrfToken,
            undefined,
            undefined,
            undefined,
            true
          );
          this.tokenStorage.saveAppData(appData);
        }
        console.log('Fetched csrfToken!');
      }),
      catchError(this.handleError<any>('getCSRFToken', []))
    );
  }

  /**
   * To fetch Encrypt Decrypt token details
   * @returns Encrypt Decrypt token details
   */
  getEncryptToken(): Observable<any> {
    return this.http
      .get<any>(this.baseURL + 'GetEncryptToken/getEncryptToken')
      .pipe(
        tap((encToken) => {
          if (encToken) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if (this.tokenStorage.getAppData() == null) {
              this.tokenStorage.saveAppData({ app: 'cognizantOn' });
            }
            this.cookieService.set(
              'ENC-TOKEN',
              encToken.edInfo,
              undefined,
              undefined,
              undefined,
              true
            );
            let appData: any = this.tokenStorage.getAppData();
            appData.encToken = encToken;

            this.tokenStorage.saveAppData(appData);
          }
          console.log('Fetched encToken!');
        }),
        catchError(this.handleError<any>('getEncryptToken', []))
      );
  }

  /**
   * To fetch validated user details on app loading
   * @returns validated user details
   */
  getValidatedUser(proxyUser = '',getUserDetails: boolean = false): Observable<any> {
    // For local access
   
    if (proxyUser == '') {
      let appData: any = this.tokenStorage.getAppData();
      proxyUser = appData.csrfToken.proxyUserId;
    }

    //proxyUser == '' ? (proxyUser = '616098') : false;
    let qsEncValue = {
      associateID: proxyUser,
      getLoggedInUserDetails: !getUserDetails,
    };
    return this.http
      .get<any>(this.baseURL + 'GetAssociateID', {
        params: qsEncValue,
      })
      .pipe(
        // map((response: any) => {
        //   return this.decryptData(response.encryptedValue);
        // }),
        tap((currentUser) => {         
          if (currentUser && !getUserDetails) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if (this.tokenStorage.getAppData() == null) {
              this.tokenStorage.saveAppData({ app: 'cognizantOn' });
            }
            let appData: any = this.tokenStorage.getAppData();
            appData.currentUser = currentUser;
            this.tokenStorage.saveAppData(appData);
          } else if (currentUser && getUserDetails) {
            // this.tokenStorage.saveAppData({ app: 'cognizantOn' });
            let appData: any = this.tokenStorage.getAppData();
            appData.proxiedUser = currentUser;
            this.tokenStorage.saveAppData(appData);
          }
          console.log('Fetched validated user info!');
        }),
        catchError(this.handleError<any>('getValidatedUser', []))
      );
  }

  roleBasedURLredirection( userRole: any,  redirectionBaseURL: string,  userId: string = '') {
    switch (userRole) {
      case 'no':
        this.router.navigate(['/no-access']);
        break;
      case 'admin':
        let appDataA: any = this.tokenStorage.getAppData();
        this.tokenStorage.saveAppData(appDataA);
        this.router.navigate(['/admin']);
        break;
      case 'super admin':      
        let appDataS: any = this.tokenStorage.getAppData();
        this.tokenStorage.saveAppData(appDataS);
        this.router.navigate(['/admin']);       
        break;
      case 'new hire':
        // this.router.navigate(['/newhire']);
        // this.router.navigate([this.redirectionBaseURL + '/newhire']);
        let appData: any = this.tokenStorage.getAppData();
        appData.routeTo = 'newhire';
        this.tokenStorage.saveAppData(appData);
        if (environment.production) {
          window.location.href = redirectionBaseURL + 'newhire';
        } else {
          window.location.href =
            redirectionBaseURL + 'newhire?userId=' + userId;
        }
        // window.location.href =
        //   'https://onecdevintaksbcapps.cognizant.com/3990/NewJoinerManger/newhire';
        // window.location.reload();
        break;
      case 'manager':
        // this.router.navigate(['/manager']);
        // this.router.navigate([redirectionBaseURL + 'manager']);
        let appDataM: any = this.tokenStorage.getAppData();
        appDataM.routeTo = 'manager';
        this.tokenStorage.saveAppData(appDataM);
        if (environment.production) {
          window.location.href = redirectionBaseURL + 'manager';
        } else {
          window.location.href =
            redirectionBaseURL + 'manager?userId=' + userId;
        }
        // window.location.href =
        //   'https://onecdevintaksbcapps.cognizant.com/3990/NewJoinerManger/manager';
        // window.location.reload();
        break;
    }
  }

  logout() {
    // remove user from local storage to log user out
    this.tokenStorage.signOut();
    // this.cookieService.deleteAll();
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(operation);
      this.router.navigate(['/error']);

      // TODO: send the error to remote logging infrastructure if needed
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
