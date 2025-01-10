import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AppServicesService } from '../services/app-services.service';
// import { AuthenticationService } from 'src/app/@auth/services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private router: Router, private appService: AppServicesService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.appService.currentUserValue;
    console.log('auth guard -> current user -> ', currentUser);
    console.log(route);

    if (!currentUser) {
      // this.appService.logout();
      // this.router.navigate(['/login']);
      return false;
    }
    currentUser.isProxyEnabled == '1'
      ? (currentUser.isProxyEnabled = true)
      : (currentUser.isProxyEnabled = false);

    if (currentUser.isProxyEnabled) {
      // Tester role so all URL paths accessible
      return true;
    }

    let url: string = state.url;
    if (url.indexOf('/admin') == 0 && (currentUser.roleType.toLowerCase() == 'admin' || currentUser.roleType.toLowerCase() == 'super admin')) {
      return true;
    }

    if (
      url.indexOf('/newhire') == 0 &&
      currentUser.roleType.toLowerCase() == 'new hire'
    ) {
      return true;
    }

    if (
      url.indexOf('/manager') == 0 &&
      currentUser.roleType.toLowerCase() == 'manager'
    ) {
      return true;
    }

    if (
      url.indexOf('/no-access') == 0 &&
      currentUser.roleType.toLowerCase() == 'no'
    ) {
      return true;
    }

    // return true;

    // if (route.data && route.data.user_group) {
    //   var validuser = userRole.user_groups.find(
    //     (role: any) =>
    //       role.user_group.toLowerCase() == route.data.user_group.toLowerCase()
    //   );
    //   if (validuser)
    //     validuser =
    //       this.authenticationService.currentUserGroup?.toLowerCase() ==
    //       route.data.user_group.toLowerCase();

    //   if (validuser) return true;
    //   else {
    //     this.authenticationService.logout();
    //     this.router.navigate(['/login'], {
    //       queryParams: { returnUrl: state.url },
    //     });
    //     return false;
    //   }
    // } else if (route.data && route.data.user_role == 'admin') {
    //   var validuser = userRole.user_groups.find(
    //     (role: any) =>
    //       role.user_role.toLowerCase() == route.data.user_role.toLowerCase()
    //   );
    //   if (validuser) return true;
    //   else {
    //     this.authenticationService.logout();
    //     this.router.navigate(['/login'], {
    //       queryParams: { returnUrl: state.url },
    //     });
    //     return false;
    //   }
    // } else if (
    //   route.data &&
    //   route.data.user_role != this.authenticationService.currentUserRole &&
    //   route.data.user_role != '@adminuser'
    // ) {
    //   this.authenticationService.logout();
    //   this.router.navigate(['/login'], {
    //     queryParams: { returnUrl: state.url },
    //   });
    //   return false;
    // }

    // be default don't allow
    return false;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // console.log(route);
    return this.canActivate(route, state);
  }
}
