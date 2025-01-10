import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AssimilationAdminComponent } from './assimilation-admin.component';
import { AssignPlanComponent } from './assimilation-plan-details/assign-plan/assign-plan.component';
import { WelcomeEmailComponent } from './assimilation-plan-details/welcome-email/welcome-email.component';
import { AssociateAssimilationComponent } from './associate-assimilation/associate-assimilation.component';
import { EditMilestoneComponent } from './assimilation-plan-details/edit-milestone/edit-milestone.component';
import { InductionSelfComponent } from './assimilation-plan-details/induction-self/induction-self.component';
import { MilestoneTasksComponent } from './assimilation-plan-details/milestone-tasks/milestone-tasks.component';
import { ManagerTasksComponent } from './assimilation-plan-details/manager-tasks/manager-tasks.component';
import { AddManagerTaskComponent } from './assimilation-plan-details/add-manager-task/add-manager-task.component';
import { AssimilationPlanDetailsComponent } from './assimilation-plan-details/assimilation-plan-details.component';
import { InductionContentComponent } from './assimilation-plan-details/induction-content/induction-content.component';

import { AssimilationAdminRoutingModule } from './assimilation-admin-routing.module';
import { AdminServicesService } from './admin-services.service';
import { UploadNewresourceComponent } from './upload-newresource/upload-newresource.component';

@NgModule({
  declarations: [
    AssimilationAdminComponent,
    AssociateAssimilationComponent,
    AssimilationPlanDetailsComponent,
    AssignPlanComponent,
    WelcomeEmailComponent,
    InductionSelfComponent,
    InductionContentComponent,
    ManagerTasksComponent,
    AddManagerTaskComponent,
    MilestoneTasksComponent,
    EditMilestoneComponent,
    UploadNewresourceComponent,
  ],
  imports: [
    CommonModule,
    AssimilationAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    ButtonModule,
    MultiSelectModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    InputSwitchModule,
    PanelModule,
    DialogModule,
    ListboxModule,
    CheckboxModule,
    OverlayPanelModule,
    TooltipModule,
    AccordionModule,
    ToastModule,
    BlockUIModule,
    ProgressSpinnerModule,
  ],
  providers: [DatePipe,MessageService, AdminServicesService],
})
export class AssimilationAdminModule {}
