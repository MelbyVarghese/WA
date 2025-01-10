import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssimilationAdminComponent } from './assimilation-admin.component';
import { AssignPlanComponent } from './assimilation-plan-details/assign-plan/assign-plan.component';
import { AssimilationPlanDetailsComponent } from './assimilation-plan-details/assimilation-plan-details.component';
import { WelcomeEmailComponent } from './assimilation-plan-details/welcome-email/welcome-email.component';
import { ManagerTasksComponent } from './assimilation-plan-details/manager-tasks/manager-tasks.component';

const routes: Routes = [
  { path: '', component: AssimilationAdminComponent },
  {
    path: 'assimilation-plan-details',
    component: AssimilationPlanDetailsComponent,
  },
  { path: 'assign-plan', component: AssignPlanComponent },
  { path: 'welcome-email', component: WelcomeEmailComponent },
  { path: 'manager-tasks', component: ManagerTasksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssimilationAdminRoutingModule {}
