import {  ChangeDetectionStrategy, Component,  ViewEncapsulation, Inject, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { Milestone, Tasks } from './MilestoneModel';
import { AdminServicesService } from '../../admin-services.service';

@Component({
  selector: 'app-milestone-tasks',
  templateUrl: './milestone-tasks.component.html',
  styleUrls: ['./milestone-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MilestoneTasksComponent {
  @Input() IsSaveButton: any;
  @Input() planType: any;
  @Input() planId: any;
  @Input() assimilationPlanDetails: any;
  @Output() assimilationPlanDetailsChange = new EventEmitter<any>();
  @Output() prevTaskEvent = new EventEmitter<string>();
  @Output() nextTaskEvent = new EventEmitter<string>();

  milestone = new Milestone();
  lstmilestones: Milestone[];
  tasks = new Tasks();
  lstTasks: Tasks[];
  durations: any = [];
  selected_duration: any = [];
  weekdurationPeriods: any = [];
  monthdurationPeriods: any = [];
  durationPeriods: any = [];
  selected_durationPeriod: any = [];
  period: string = 'Day ...to Day ...';
  milestonename: string = 'Name of the milestone';
  milestonebanner: string = '';
  isAddMilestone: boolean = false;
  bordercolors: any = ['#7373D8', '#6AA2DC', '#92BBE6'];
  showbannervalidation: boolean = false;

  view: string = 'edit';
  formtype = 'milestone';
  showAddManagerTaskPopup: boolean = false;
  selectedtask: any = {};
  addTasks: any = [];

  showMilestonePopup: boolean = false;
  selectedMilestone: any = {};
  msId: any;

  showDisableTaskPopup: boolean = false;
  showActivationTaskPopup: boolean = false;
  deletetaskId: any;
  deleteselectedTaskId: any;
  deleterepeatId: any;
  deleteremainderID: any;
  currentmileIndex: any;
  currenttaskIndex: any;
  currentstatus: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private adminServices: AdminServicesService
  ) {
    this.selected_duration = { durationId: '', durationDesc: '' };
    this.selected_durationPeriod = { durationCalId: '', durationCalDesc: '' };
    this.lstmilestones = [];
    this.lstTasks = [];
  }

  ngOnInit(): void {
    console.log('IsSaveButton = ' + this.IsSaveButton);
    console.log('planType = ' + this.planType);

    // GPGkey test

    this.getDurationDetails();
    this.getMSTaskDetails();
  }

  getDurationDetails() {
    this.adminServices.getDurationDetails().subscribe((list: any) => {
      
      console.log('getDurationDetails', list);
      this.durations = list.durationMasterList;
      this.durationPeriods = list.durationCalMasterList;
      this.weekdurationPeriods = list.durationCalMasterList;

      for (let x = 0; x < 3; x++) {
        let dtx = {
          durationCalId: list.durationCalMasterList[x].durationCalId,
          durationCalDesc: list.durationCalMasterList[x].durationCalDesc,
        };

        this.monthdurationPeriods[x] = dtx;
      }
    });
  }

  getMSTaskDetails() {
    this.lstmilestones = [];

    this.adminServices
      .getMSTaskDetails(this.planId)
      .subscribe((response: any) => {
        console.log('getMSTaskDetails', response);
        this.assimilationPlanDetails.milestones = response;
        this.assimilationPlanDetailsChange.emit(this.assimilationPlanDetails);

        //response = response.sort((a: any, b: any) =>
        //  a.mileStones.msName < b.mileStones.msName
        //    ? 1
        //    : a.mileStones.msName < b.mileStones.msName
        //    ? -1
        //    : 0
        //);

        for (let i = 0; i < response.length; i++) {
          this.milestone = new Milestone();
          this.milestone.msId = response[i].mileStones.msId;
          this.milestone.msName = response[i].mileStones.msName;
          this.milestone.durationDesc = response[i].mileStones.durationDesc;
          this.milestone.DurationId = response[i].mileStones.durationId;
          this.milestone.durationCalDesc = response[i].mileStones.durationCalDesc;
          this.milestone.DurationCalId = response[i].mileStones.durationCalId;
          this.milestone.milestonePeriod =  response[i].mileStones.durationCalDesc;
          this.milestone.milestonDescription = response[i].mileStones.durationCalDesc;
          this.milestone.startDay = response[i].mileStones.startDay;
          this.milestone.endDay = response[i].mileStones.endDay;
          this.milestone.greetingText = response[i].mileStones.greetingText;

          this.lstTasks = [];

          for (let j = 0; j < response[i].taskDetails.length; j++) {
            this.tasks = new Tasks();
            this.tasks.msId = response[i].taskDetails[j].msId;
            this.tasks.taskId = response[i].taskDetails[j].taskId;
            this.tasks.selectedTaskId = response[i].taskDetails[j].selectedTaskId;
            this.tasks.taskName = response[i].taskDetails[j].taskName;
            this.tasks.taskDesc = response[i].taskDetails[j].taskDesc;           
            this.tasks.activeStatus = response[i].taskDetails[j].activeStatus == 1 ? true : false;
            this.tasks.image = response[i].taskDetails[j].imageUrl;
            this.tasks.reDirectionLink = response[i].taskDetails[j].redirectionLink;           
            this.tasks.gradeIds = response[i].taskDetails[j].gradeIds;
            this.tasks.grades = response[i].taskDetails[j].grades;
            this.tasks.reminderId = response[i].taskDetails[j].reminderId;
            this.tasks.reminderDesc = response[i].taskDetails[j].reminderDesc;
            this.tasks.repeatId = response[i].taskDetails[j].repeatId;
            this.tasks.repeatDesc = response[i].taskDetails[j].repeatDesc;
            this.tasks.isMarkEnabled = response[i].taskDetails[j].isMarkEnabled == 1 ? true : false;
            this.lstTasks.push(this.tasks);
          }

          this.milestone.tasks = this.lstTasks;
          this.lstmilestones.push(this.milestone);
        }

        this.cdr.detectChanges();
      });
  }

  setMilestoneName() {
    if (this.selected_duration.durationDesc == 'Week') {
      this.durationPeriods = this.weekdurationPeriods;
    }

    if (this.selected_duration.durationDesc == 'Month') {
      this.durationPeriods = this.monthdurationPeriods;

      if (this.selected_durationPeriod.durationCalId > 3) {
        this.selected_durationPeriod = { durationCalDesc: '1st', durationCalId: 1 };
      }

    }

    this.milestonename =
      this.selected_duration.durationDesc +
      ' ' +
      this.selected_durationPeriod.durationCalId;

    if (
      this.selected_duration.durationDesc == 'Week' &&
      this.selected_durationPeriod.durationCalId != ''
    ) {
      this.period =
        'Day ' +
        (this.selected_durationPeriod.durationCalId * 7 - 6) +
        ' to Day ' +
        this.selected_durationPeriod.durationCalId * 7;
    }

    if (
      this.selected_duration.durationDesc == 'Month' &&
      this.selected_durationPeriod.durationCalId != ''
    ) {
      this.period =
        'Day ' +
        (this.selected_durationPeriod.durationCalId * 30 - 29) +
        ' to Day ' +
        this.selected_durationPeriod.durationCalId * 30;
    }
  }

  showMilestone() {
    this.selected_duration = { durationId: '', durationDesc: '' };
    this.selected_durationPeriod = { durationCalId: '', durationCalDesc: '' };

    this.milestonename = '';
    this.milestonebanner = '';
    this.period = 'Day ...to Day ...';
    this.isAddMilestone = true;
    this.showbannervalidation = false;
  }

  milestonenameValidation() {   

    this.milestonename = this.milestonename.replace(/</gi, '');
    this.milestonename = this.milestonename.replace(/>/gi, '');
    this.milestonename = this.milestonename.replace('script', '');
    this.milestonename = this.milestonename.replace(/\//gi, '');
    this.milestonename = this.milestonename.replace(/\\/gi, '');
    this.milestonename = this.milestonename.replace('(', '');
    this.milestonename = this.milestonename.replace(')', '');
    this.milestonename = this.milestonename.replace(/!/gi, '');
    this.milestonename = this.milestonename.replace(/@/gi, '');
    this.milestonename = this.milestonename.replace(/#/gi, '');
    this.milestonename = this.milestonename.replace('$', '');
    this.milestonename = this.milestonename.replace(/%/gi, '');
    this.milestonename = this.milestonename.replace('^', ''); 
    this.milestonename = this.milestonename.replace('*', '');  
    this.milestonename = this.milestonename.replace('-', '');
    this.milestonename = this.milestonename.replace('+', '');
    this.milestonename = this.milestonename.replace('=', '');
    this.milestonename = this.milestonename.replace(/{/gi, '');
    this.milestonename = this.milestonename.replace(/}/gi, '');
    this.milestonename = this.milestonename.replace('[', '');
    this.milestonename = this.milestonename.replace(']', '');
    this.milestonename = this.milestonename.replace(/'/gi, '');
    this.milestonename = this.milestonename.replace(/"/gi, '');
    this.milestonename = this.milestonename.replace(/|/gi, '');
    this.milestonename = this.milestonename.replace(/:/gi, '');
    this.milestonename = this.milestonename.replace(/;/gi, '');
    this.milestonename = this.milestonename.replace(/,/gi, '');   
    this.milestonename = this.milestonename.replace('?', '');

  }

  milestonebannerValidation() {
    this.milestonebanner = this.milestonebanner.replace(/</gi, '');
    this.milestonebanner = this.milestonebanner.replace(/>/gi, '');
    this.milestonebanner = this.milestonebanner.replace('script', '');
    this.milestonebanner = this.milestonebanner.replace(/\//gi, '');
    this.milestonebanner = this.milestonebanner.replace(/\\/gi, '');   
    this.milestonebanner = this.milestonebanner.replace(/#/gi, '');
    this.milestonebanner = this.milestonebanner.replace('$', '');
    this.milestonebanner = this.milestonebanner.replace(/%/gi, '');
    this.milestonebanner = this.milestonebanner.replace('^', '');   
    this.milestonebanner = this.milestonebanner.replace(/!/gi, '');
    this.milestonebanner = this.milestonebanner.replace(/@/gi, '');   
    this.milestonebanner = this.milestonebanner.replace('*', '');  
    this.milestonebanner = this.milestonebanner.replace('-', '');
    this.milestonebanner = this.milestonebanner.replace('+', '');
    this.milestonebanner = this.milestonebanner.replace('=', '');
    this.milestonebanner = this.milestonebanner.replace(/{/gi, '');
    this.milestonebanner = this.milestonebanner.replace(/}/gi, '');
    this.milestonebanner = this.milestonebanner.replace('[', '');
    this.milestonebanner = this.milestonebanner.replace(']', '');
    this.milestonebanner = this.milestonebanner.replace(/|/gi, '');
    this.milestonebanner = this.milestonebanner.replace(/"/gi, '');
    this.milestonebanner = this.milestonebanner.replace(/:/gi, '');
    this.milestonebanner = this.milestonebanner.replace(/;/gi, '');   
    this.milestonebanner = this.milestonebanner.replace('?', '');
  }

  addMilestone() {
    this.showbannervalidation = false;

    if (this.milestonebanner == '') {
      this.showbannervalidation = true;
      return;
    }

    let milestoneInfo = {
      MSName: this.milestonename,
      GreetingText: this.milestonebanner,
      DurationId: this.selected_duration.durationId,
      DurationCalId: this.selected_durationPeriod.durationCalId,
      PlanId: this.planId,
    };

    this.adminServices.addMileStone(milestoneInfo).subscribe((repo: any) => {
      console.log('addMileStone', repo);
      this.isAddMilestone = false;

      if (repo.length > 0) {
        this.getMSTaskDetails();
      }
    });
  }

  deleteMilestone(mileStoneId: any) {
    this.adminServices.deleteMileStone(mileStoneId).subscribe((respo: any) => {
      console.log('deleteMilestone', respo);

      if (respo == 1) {
        this.getMSTaskDetails();
      }
    });
  }

  deleteTask(taskId: any, selectedTaskId: any,remainderId:any,repeatId:any, activeStatus: any) {
    debugger;
    if (selectedTaskId != 0) {
      this.adminServices.deleteTask(taskId, 0, activeStatus).subscribe((respo: any) => {
        console.log('deleteTask', respo);
        if (respo == 1) {
          this.getMSTaskDetails();
        }
      });
    }
    else if (selectedTaskId == 0 && remainderId != 0 && repeatId != 0)
    {
      this.adminServices.deleteCustomTask(taskId, 0, activeStatus).subscribe((respo: any) => {
        console.log('deleteCustomTask', respo);
        if (respo == 1) {
          this.getMSTaskDetails();
        }
      });
    }
    else {

      this.adminServices.deleteSessionTask(taskId, 0, activeStatus).subscribe((respo: any) => {
        console.log('deleteSessionTask', respo);
        if (respo == 1) {
          this.getMSTaskDetails();
        }
      });
    }
  }

  getddldurationsStyles() {
    return {
      width: '14.9375rem',
      height: '2.625rem',
      'border-radius': '0.5rem 0rem 0rem 0.5rem',
      background: '#F7F7F5',
    };
  }

  setTasksBorderColor(taskindex: any) {
    var rscolor = (taskindex + 1) % this.bordercolors.length;
    return { 'border-color': this.bordercolors[rscolor] };
  }

  prevStep(value: any) {
    this.prevTaskEvent.emit(value);
  }

  nextStep(value: any) {
    this.nextTaskEvent.emit(value);
  }

  showAddTaskSidePopup(msId: any, viewmode: any) {
    this.view = viewmode;

    this.msId = msId;
    this.showAddManagerTaskPopup = true;
  }

  closeAddTaskSidePopup() {
    this.getMSTaskDetails();
    this.showAddManagerTaskPopup = false;
  }

  closeMilestonePopup() {
    this.getMSTaskDetails();
    this.showMilestonePopup = false;
  }


  disableTask(taskId: any, selectedTaskId: any, activeStatus: any, reminderId:any, repeatId:any, mileIndex:any, taskIndex:any) {

    this.deletetaskId = taskId;
    this.deleteselectedTaskId = selectedTaskId;
    this.deleteremainderID = reminderId;
    this.deleterepeatId = repeatId;
    this.currentmileIndex = mileIndex;
    this.currenttaskIndex = taskIndex;
    this.currentstatus = activeStatus;

    if (activeStatus == false) {
      this.showDisableTaskPopup = true;
    }

    if (activeStatus == true) {
      this.showActivationTaskPopup = true;
    }

  }

  CancelDisableTask() {
    this.lstmilestones[this.currentmileIndex].tasks[this.currenttaskIndex].activeStatus = !this.currentstatus;
    this.showDisableTaskPopup = false;
  }

  CancelActiveTask() {
    this.lstmilestones[this.currentmileIndex].tasks[this.currenttaskIndex].activeStatus = !this.currentstatus;
    this.showActivationTaskPopup = false;
  }


}
