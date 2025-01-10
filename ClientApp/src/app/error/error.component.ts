import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppServicesService } from '../@core/services/app-services.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  constructor(
    private router: Router,
    private appServices: AppServicesService
  ) {}

  ngOnInit(): void {}

  backToHome() {
    this.appServices.currentUserValue.isProxyEnabled == '1'
      ? this.router.navigate(['/role-access-tester'])
      : this.router.navigate(['admin']);
  }
}
