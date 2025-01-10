import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleAccessTesterComponent } from './roleAccessTester/roleAccessTester.component';
import { AuthGuard } from './@core/guards/auth.guard';
import { ErrorComponent } from './error/error.component';
import { NoAccessComponent } from './no-access/no-access.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./assimilation-admin/assimilation-admin.module').then(
        (m) => m.AssimilationAdminModule
      ),
    canActivateChild: [AuthGuard],
  },
  // {
  //   path: 'newhire',
  //   // loadChildren: () =>
  //   //   import('./new-hire/new-hire.module').then((m) => m.NewHireModule),
  //   canActivateChild: [AuthGuard],
  // },
  // {
  //   path: 'manager',
  //   // loadChildren: () =>
  //   //   import('./manager/manager.module').then((m) => m.ManagerModule),
  //   canActivateChild: [AuthGuard],
  // },
  {
    path: 'no-access',
    component: NoAccessComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'role-access-tester',
    component: RoleAccessTesterComponent,
    canActivateChild: [AuthGuard],
  },

  {
    path: 'error',
    component: ErrorComponent,
  },

 // { path: '**', redirectTo: 'no-access' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
