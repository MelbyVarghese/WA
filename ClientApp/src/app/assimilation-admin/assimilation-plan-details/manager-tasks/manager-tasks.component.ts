import { ChangeDetectionStrategy,  Component,  OnInit,  Inject,  Input,  Output,  EventEmitter,  ViewEncapsulation,  ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { AdminServicesService } from '../../admin-services.service';

@Component({
  selector: 'app-manager-tasks',
  templateUrl: './manager-tasks.component.html',
  styleUrls: ['./manager-tasks.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerTasksComponent {
  @Input() IsSaveButton: any;
  @Input() planType: any;
  @Input() planId: any;
  @Input() assimilationPlanDetails: any;
  @Output() assimilationPlanDetailsChange = new EventEmitter<any>();
  @Output() prevTaskEvent = new EventEmitter<string>();

  view: string = 'edit';
  formtype: string = 'manager';
  showAddManagerTaskPopup: boolean = false;
  selectedtask: any = {};

  tasks: any = [];
  addTasks: any = [];

  ptisSelected: boolean = true;
  showDisableTaskPopup: boolean = false;
  showActivationTaskPopup: boolean = false;

  deletetaskId: any;
  deleteselectedTaskId: any; 
  currenttaskIndex: any;
  currentstatus: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private adminServices: AdminServicesService
  ) {}

  ngOnInit(): void {
    this.getManagerTaskDetails();
  }

  getManagerTaskDetails() {
    this.adminServices
      .getManagerTaskDetails(this.planId)
      .subscribe((response: any) => {
        console.log('getManagerTaskDetails', response);
        this.assimilationPlanDetails.managerTasks = response;
        this.assimilationPlanDetailsChange.emit(this.assimilationPlanDetails);
        this.tasks = response;        
        this.cdr.detectChanges();
      });
  }

  deleteTask(taskId: any, selectedTaskId: any, activeStatus:any) {
    if (selectedTaskId != 0) {
      this.adminServices.deleteTask(taskId, 1, activeStatus).subscribe((response: any) => {
        console.log('deleteTask', response);
        this.assimilationPlanDetails.managerTasks = response;
        this.assimilationPlanDetailsChange.emit(this.assimilationPlanDetails);
        this.tasks = response;
        this.getManagerTaskDetails();
        this.cdr.detectChanges();
      });
    }

    if (selectedTaskId == 0) {
      this.adminServices
        .deleteCustomTask(taskId, 1, activeStatus)
        .subscribe((response: any) => {
          console.log('deleteCustomTask', response);
          this.assimilationPlanDetails.managerTasks = response;
          this.assimilationPlanDetailsChange.emit(this.assimilationPlanDetails);
          this.tasks = response;
          this.getManagerTaskDetails();
          this.cdr.detectChanges();
        });
    }
  }

  disableTask(taskId: any, selectedTaskId: any, activeStatus: any, taskIndex:any) {

    this.deletetaskId = taskId;
    this.deleteselectedTaskId = selectedTaskId;
    this.currenttaskIndex = taskIndex;
    this.currentstatus = activeStatus;

    if (activeStatus == false) {
      this.showDisableTaskPopup = true;
    }

    if (activeStatus == true) {
      this.showActivationTaskPopup = true;
    }   

  }

  prevStep(value: any) {
    this.prevTaskEvent.emit(value);
  }

  showAddTaskSidePopup(viewType: string) {
    this.view = viewType;
    this.showAddManagerTaskPopup = true;
  }

  closeAddTaskSidePopup() {
    this.getManagerTaskDetails();
    this.showAddManagerTaskPopup = false;
  }

  CancelDisableTask() {
    this.tasks[this.currenttaskIndex].activestatus = !this.currentstatus;
    this.showDisableTaskPopup = false;
  }

  CancelActiveTask() {
    this.tasks[this.currenttaskIndex].activestatus = !this.currentstatus;
    this.showActivationTaskPopup = false;
  }

}
