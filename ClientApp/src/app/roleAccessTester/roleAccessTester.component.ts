import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  type OnInit,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../@core/services/token-storage.service';
import { AppServicesService } from '../@core/services/app-services.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-access-tester',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './roleAccessTester.component.html',
  styleUrls: ['./roleAccessTester.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleAccessTesterComponent implements OnInit {
  redirectionBaseURL: string;
  proxyUser: string = '';
  constructor(
    private router: Router,
    private appService: AppServicesService,
    @Inject('BASE_URL') redirectionBaseURL: string,
    private tokenStorage: TokenStorageService
  ) {
    this.redirectionBaseURL = environment.production
      ? redirectionBaseURL.replace('AdminModule', 'NewjoinerManger')
      : 'https://localhost:44448/';
    // console.log(this.redirectionBaseURL);
  }

  ngOnInit(): void {}

  redirectTo(path: string = '') {
    window.location.href = this.redirectionBaseURL + path;
    let appData: any = this.tokenStorage.getAppData();
    appData.routeTo = path;
    this.tokenStorage.saveAppData(appData);
  }

  getProxiedUserDetails() {
    let getProxiedUserDetailsOnly = true;
    this.appService
      .getValidatedUser(this.proxyUser, getProxiedUserDetailsOnly)
      .subscribe((user) => {
        console.log('Proxied User Details: ', user);
        this.appService.roleBasedURLredirection(
          user.roleType.toLowerCase(),
          this.redirectionBaseURL,
          user.associateID
        );
      });
  }
}
