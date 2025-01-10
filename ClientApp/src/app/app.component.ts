import { Component, Inject, OnInit } from '@angular/core';
import { AppServicesService } from './@core/services/app-services.service';
import { TokenStorageService } from './@core/services/token-storage.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'CognizantOn';
  redirectionBaseURL: string = '';

  constructor(
    private router: Router,
    private appService: AppServicesService,
    private tokenStorage: TokenStorageService,
    @Inject('BASE_URL')
    private browserURL: string
  ) {
    this.redirectionBaseURL = environment.production
      ? browserURL.replace('AdminModule', 'NewjoinerManger')
      : 'https://localhost:44448/';
  }

  ngOnInit(): void {    
    this.getCSRFToken();
  }

  getCSRFToken() {
    this.appService.getCSRFToken().subscribe((csrfToken) => {
      console.log('csrfToken',csrfToken);
      this.getEncryptToken();
    });
  }

  getEncryptToken() {
    this.appService.getEncryptToken().subscribe((encToken) => {
      this.getValidatedUser();
    });
  }

  getValidatedUser() {
    this.appService.getValidatedUser().subscribe((user) => {
       console.log('user', user);
       console.log('router url = ', this.router.url);
       console.log(this.redirectionBaseURL);   

   
      if (user.isProxyEnabled == '1') {
        if (this.router.url == '/') {
          this.router.navigate(['/role-access-tester']);
        }
      }
      else {  
        this.appService.roleBasedURLredirection(user.roleType.toLowerCase(),this.redirectionBaseURL, user.associateID);
      }


    });
  }
}
