import { Component,  OnInit,  Input,  Output,  EventEmitter,  ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { AdminServicesService } from '../../admin-services.service';

@Component({
  selector: 'app-add-manager-task',
  templateUrl: './add-manager-task.component.html',
  styleUrls: ['./add-manager-task.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AddManagerTaskComponent {
  @Input() displayAddManagerTaskPopup = false;
  @Input() taskInfo: any;
  @Input() addTasksInfo: any;
  @Input() msId: any;
  @Input() planId: any;
  @Input() viewType: any;
  @Input() formtype: any;
  @Output() closeAddTaskPopup = new EventEmitter<any>();

  taskNames: any = [];
  taskId: any;
  selectedtask: any;
  imagenames: any = [];
  selected_image: any;
  imageList: any = [];
  isTaskCompleted: boolean = false;

  grades: any = [];
  selected_Grades: any = [];

  taskdescription: string = '';
  reDirectionLink: string = '';
  reminders: any = [];
  selected_reminder: any;
  repeats: any = [];
  selected_repeat: any;
  taskType: string = '';
  showsubsection: boolean = false;
  showImagedropdown: boolean = true;
  showlargeImage: boolean = false;
  showImages: boolean = false;
  isTaskTitle: boolean = false;
  isTaskDescription: boolean = false;
  isRedirectionLink: boolean = false;
  isDisabled: boolean = false;
  isImageShow: boolean = false;
  isStartingShow: boolean = false;
  isRepeatShow: boolean = false;
  isAssociateComplete: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private adminServices: AdminServicesService
  ) {
    this.selectedtask = { pkTaskMasterId: 0, taskName: '' };
    this.selected_image = { name: '' };
    this.selected_reminder = { pkReminderId: 0, description: '' };
    this.selected_repeat = { pkRepeatId: 0, description: '' };
  }

  ngOnInit(): void {
    console.log('taskInfo', this.taskInfo);

    this.taskId = this.taskInfo.taskId;

    if (
      this.taskInfo.taskId != undefined &&
      this.taskInfo.taskId > 0 &&
      this.taskInfo.selectedTaskId > 0
    ) {
      this.isAssociateComplete = true;
    }

    if (this.formtype == 'milestone') {
      this.getTaskMasterDetails(0);
    }

    if (this.formtype == 'manager') {
      this.getTaskMasterDetails(1);
    }

    if (this.viewType == 'edit' || this.viewType == 'view') {
      this.showsubsection = true;

      if (this.formtype == 'milestone') {
      
        if (this.taskInfo.selectedTaskId == 0 && this.taskInfo.repeatId != 0 && this.taskInfo.reminderId != 0) {
          this.selectedtask = this.taskInfo.taskName;
          this.imagenames.push({ name: this.taskInfo.image });
          this.selected_image.name = this.taskInfo.image;
          this.taskdescription = this.taskInfo.taskDesc;
          this.reDirectionLink = this.taskInfo.reDirectionLink;
          this.selected_Grades = this.taskInfo.grades;          
          this.selected_reminder = this.taskInfo.reminderId;
          this.selected_repeat = this.taskInfo.repeatId;
          this.isTaskCompleted = this.taskInfo.isMarkEnabled == 1 ? true : false;
          this.taskType = 'customelist';
        }
        else if (this.taskInfo.selectedTaskId != 0 ){
          this.selectedtask = this.taskInfo.selectedTaskId;
          this.imagenames.push({ name: this.taskInfo.image });
          this.selected_image.name = this.taskInfo.image;
          this.taskdescription = this.taskInfo.taskDesc;
          this.selected_Grades = this.taskInfo.grades;
          this.selected_reminder = this.taskInfo.reminderId;
          this.selected_repeat = this.taskInfo.repeatId;
          this.isTaskCompleted =  this.taskInfo.isMarkEnabled == 1 ? true : false;

          this.taskType = 'taskslist';
        }
        else{
          this.selectedtask = this.taskInfo.taskName;
          this.imagenames.push({ name: this.taskInfo.image });
          this.selected_image.name = this.taskInfo.image;
          this.taskdescription = this.taskInfo.taskDesc;
          this.selected_Grades = this.taskInfo.grades;
          this.selected_reminder = this.taskInfo.reminderId;
          this.selected_repeat = this.taskInfo.repeatId;
          this.isTaskCompleted = this.taskInfo.isMarkEnabled == 1 ? true : false;

          this.taskType = 'sessionlist';
        }
      }

      if (this.formtype == 'manager') {
        if (this.taskInfo.selectedTaskId == 0) {
          this.selectedtask = this.taskInfo.taskName;
          this.imagenames.push({ name: this.taskInfo.image });
          this.selected_image.name = this.taskInfo.image;
          this.taskdescription = this.taskInfo.taskDesc;
          this.reDirectionLink = this.taskInfo.redirectionLink;
          this.selected_reminder = this.taskInfo.reminderId;
          this.selected_repeat = this.taskInfo.repeatId;
          this.isTaskCompleted = this.taskInfo.isAssCompletedEnabled;
          this.taskType = 'customelist';
        } else {
          //this.taskNames.push({ name: this.taskInfo.taskName });
          this.selectedtask = this.taskInfo.selectedTaskId;
          this.imagenames.push({ name: this.taskInfo.image });
          this.selected_image.name = this.taskInfo.image;
          this.taskdescription = this.taskInfo.taskDesc;
          this.selected_reminder = this.taskInfo.reminderId;
          this.selected_repeat = this.taskInfo.repeatId;
          this.isTaskCompleted =
            this.taskInfo.isMarkEnabled == 1 ? true : false;

          this.taskType = 'taskslist';
        }
      }
    }

    if (this.viewType == 'view') {
      this.isDisabled = true;
    }

    this.imageList = [
      { name: 'image_name1.jpg', isSelected: false },
      { name: 'image_name2.jpg', isSelected: false },
      { name: 'image_name3.jpg', isSelected: false },
      { name: 'image_name4.jpg', isSelected: false },
    ];
  }

  getTaskMasterDetails(isManagerTask: any) {
    this.adminServices
      .getTaskMasterDetails(isManagerTask, this.planId)
      .subscribe((list: any) => {
        console.log('getTaskMasterDetails', list);

        var reslist = list;
        this.taskNames = list.taskMasters;
        this.reminders = list.reminderScheduleMasters;
        this.repeats = list.repeatScheduleMasters;
        this.grades = list.gradeMasters;
        this.cdr.detectChanges();

        if (this.viewType == 'add') {
          let rbtsel = document.getElementById('rbtntaskslist');
          rbtsel?.click();
        }
      });
  }

  setTaskType(info: string) {
    this.taskType = info;
    this.showsubsection = false;

    this.showImagedropdown = true;
    this.showlargeImage = false;
    this.showImages = false;
    this.isAssociateComplete = true;   

    if (this.taskType == 'customelist') {
      this.selectedtask = '';
      this.showsubsection = true;
      this.imagenames = [];
      this.imagenames.push({ name: 'Add image' });
      this.selected_image.name = '';
      this.taskdescription = '';

      this.selected_reminder = 0;
      this.selected_repeat = 0;

      this.isTaskCompleted = false;
      this.isAssociateComplete = false;
    }
    if (this.taskType == 'sessionlist') {
      this.selectedtask = '';
    }
  }

  viewlargeImage() {
    if (!this.isDisabled) {
      if (
        this.imagenames.length == 1 &&
        this.imagenames[0].name == 'Add image'
      ) {
        this.showImagedropdown = false;
        this.showlargeImage = false;
        this.showImages = true;
      } else {
        this.showImagedropdown = false;
        this.showlargeImage = true;
        this.showImages = false;
      }
    }
  }

  setView() {
    this.showsubsection = true;
  }

  setTaskDetails(titleId: any) {
    var taskRes = this.taskNames.filter(
      (item: any) => item.pkTaskMasterId === titleId
    );
    this.imagenames = [];

    if (taskRes.length > 0) {
      this.imagenames.push({ name: taskRes[0].imageUrl });
      this.selected_image.name = taskRes[0].imageUrl;
      this.taskdescription = taskRes[0].taskDescription;
      this.selected_reminder = taskRes[0].reminderSchedule;
      this.selected_repeat = taskRes[0].repeatSchedule;
      this.isTaskCompleted = taskRes[0].isMarkCompleteEnabled;
    }
  }

  viewTaskTitleValidation() {
    if (this.selectedtask == '') {
      this.isTaskTitle = true;
    } else {
      this.isTaskTitle = false;
    }

    this.selectedtask = this.selectedtask.replace(/</gi, '');
    this.selectedtask = this.selectedtask.replace(/>/gi, '');
    this.selectedtask = this.selectedtask.replace('script', '');
    this.selectedtask = this.selectedtask.replace(/\//gi, '');
    this.selectedtask = this.selectedtask.replace(/\\/gi, '');
    this.selectedtask = this.selectedtask.replace('(', '');
    this.selectedtask = this.selectedtask.replace(')', '');
    this.selectedtask = this.selectedtask.replace(/!/gi, '');
    this.selectedtask = this.selectedtask.replace(/@/gi, '');
    this.selectedtask = this.selectedtask.replace(/#/gi, '');
    this.selectedtask = this.selectedtask.replace('$', '');
    this.selectedtask = this.selectedtask.replace(/%/gi, '');
    this.selectedtask = this.selectedtask.replace('^', '');  
    this.selectedtask = this.selectedtask.replace('*', '');    
    this.selectedtask = this.selectedtask.replace('-', '');
    this.selectedtask = this.selectedtask.replace('+', '');
    this.selectedtask = this.selectedtask.replace('=', '');
    this.selectedtask = this.selectedtask.replace(/{/gi, '');
    this.selectedtask = this.selectedtask.replace(/}/gi, '');
    this.selectedtask = this.selectedtask.replace('[', '');
    this.selectedtask = this.selectedtask.replace(']', '');
    this.selectedtask = this.selectedtask.replace(/'/gi, '');
    this.selectedtask = this.selectedtask.replace(/"/gi, '');
    this.selectedtask = this.selectedtask.replace(/|/gi, '');
    this.selectedtask = this.selectedtask.replace(/:/gi, '');
    this.selectedtask = this.selectedtask.replace(/;/gi, '');
    this.selectedtask = this.selectedtask.replace(',', '');
    this.selectedtask = this.selectedtask.replace('.', '');
    this.selectedtask = this.selectedtask.replace('?', '');


  }

  viewTaskDescriptionValidation() {
    if (this.taskdescription == '') {
      this.isTaskDescription = true;
    } else {
      this.isTaskDescription = false;
    }


    this.taskdescription = this.taskdescription.replace(/</gi, '');
    this.taskdescription = this.taskdescription.replace(/>/gi, '');
    this.taskdescription = this.taskdescription.replace('script', '');
    this.taskdescription = this.taskdescription.replace(/\//gi, '');
    this.taskdescription = this.taskdescription.replace(/\\/gi, '');    
    this.taskdescription = this.taskdescription.replace(/@/gi, '');
    this.taskdescription = this.taskdescription.replace(/#/gi, '');
    this.taskdescription = this.taskdescription.replace('$', '');
    this.taskdescription = this.taskdescription.replace(/%/gi, '');
    this.taskdescription = this.taskdescription.replace('^', '');   
    this.taskdescription = this.taskdescription.replace('*', '');
    this.taskdescription = this.taskdescription.replace('-', '');
    this.taskdescription = this.taskdescription.replace('+', '');
    this.taskdescription = this.taskdescription.replace('=', '');
    this.taskdescription = this.taskdescription.replace(/{/gi, '');
    this.taskdescription = this.taskdescription.replace(/}/gi, '');
    this.taskdescription = this.taskdescription.replace('[', '');
    this.taskdescription = this.taskdescription.replace(']', '');
    this.taskdescription = this.taskdescription.replace(/|/gi, '');
    this.taskdescription = this.taskdescription.replace(/"/gi, '');
    this.taskdescription = this.taskdescription.replace(/:/gi, '');
    this.taskdescription = this.taskdescription.replace(/;/gi, '');
    this.taskdescription = this.taskdescription.replace('?', '');

  }

  viewRedirectionLinkValidation() {
    if (this.reDirectionLink == '') {
      this.isRedirectionLink = true;
    } else {
      this.isRedirectionLink = false;
    }
  }

  viewCheckbox(event: any, position: any) {
    var imglength = this.imageList.length;

    for (let i = 0; i < this.imageList.length; i++) {
      document
        .getElementById('imagechk_' + i)
        ?.classList.remove('checkboxActive');
      this.imageList[i].isSelected = false;
    }

    document
      .getElementById('imagechk_' + position)
      ?.classList.add('checkboxActive');

    this.imageList[position].isSelected = true;

    var fileteredImage = this.imageList[position];

    this.imagenames = [];
    this.imagenames.push({ name: fileteredImage.name });
    this.selected_image.name = fileteredImage.name;
  }

  validateStarting() {
    this.isStartingShow = false;
  }

  validateRepeat() {
    this.isRepeatShow = false;
  }

  saveTaskDetails() {
    debugger;
    if (this.taskType == 'customelist') {
      if (this.selectedtask == '') {
        this.isTaskTitle = true;
      }

      if (this.taskdescription == '') {
        this.isTaskDescription = true;
      }

      if (this.reDirectionLink == '') {
        this.isRedirectionLink = true;
      }

      if (
        this.isTaskTitle == true ||
        this.isTaskDescription == true ||
        this.isRedirectionLink == true
      )
      {
        return;

      }
      else
      {
        if (this.viewType == 'add') {
          if (this.selected_image.name == '') {
            this.isImageShow = true;
          }

          if (this.selected_reminder.pkReminderId == 0) {
            this.isStartingShow = true;
          }

          if (this.selected_repeat.pkRepeatId == 0) {
            this.isRepeatShow = true;
          }

          if (
            this.isStartingShow == true ||
            this.isRepeatShow == true ||
            this.isImageShow == true
          ) {
            return;
          }

          let selectedTaskInfo = {
            TaskName: this.selectedtask,
            ImageUrl: this.selected_image.name,
            TaskDescription: this.taskdescription,
            gradeIds: Array.prototype.map
              .call(this.selected_Grades, function (item) {
                return item.gradeDesc;
              })
              .join(','),
            RedirectionLink: this.reDirectionLink,
            ReminderSchedule: this.selected_reminder,
            RepeatSchedule: this.selected_repeat,
            MarkCompleted: this.isTaskCompleted,
          };

          if (this.formtype == 'milestone') {
            this.adminServices
              .addCustomTask(selectedTaskInfo, this.msId)
              .subscribe((repo: any) => {
                console.log('addCustomTask', repo);
                var reslist = repo;
                this.close();
              });
          }

          if (this.formtype == 'manager') {
            this.adminServices
              .addManagerCustomTask(selectedTaskInfo, this.planId)
              .subscribe((repo: any) => {
                console.log('addCustomTask', repo);
                var reslist = repo;
                this.close();
              });
          }
        }

        if (this.viewType == 'edit') {
          let selectedTaskInfo = {
            CustomTaskId: this.taskInfo.taskId,
            TaskName: this.selectedtask,
            ImageUrl: this.selected_image.name,
            TaskDescription: this.taskdescription,
            gradeIds: Array.prototype.map
              .call(this.selected_Grades, function (item) {
                return item.gradeDesc;
              })
              .join(','),
            RedirectionLink: this.reDirectionLink,
            ReminderSchedule: this.selected_reminder,
            RepeatSchedule: this.selected_repeat,
            MarkCompleted: this.isTaskCompleted,
          };

          if (this.formtype == 'milestone') {
            this.adminServices
              .editCustomTask(selectedTaskInfo, this.msId)
              .subscribe((repo: any) => {
                console.log('editCustomTask', repo);
                var reslist = repo;
                this.close();
              });
          }

          if (this.formtype == 'manager') {
            this.adminServices
              .editManagerCustomTask(selectedTaskInfo, this.planId)
              .subscribe((repo: any) => {
                console.log('editManagerCustomTask', repo);
                var reslist = repo;
                this.close();
              });
          }
        }
      }
    }

    if (this.taskType == 'taskslist') {
      if (this.selectedtask == '') {
        this.isTaskTitle = true;
      }

      if (this.taskdescription == '') {
        this.isTaskDescription = true;
      }

      if (this.isTaskTitle == true || this.isTaskDescription == true) {
        return;
      } else {
        if (this.viewType == 'add') {
          if (this.formtype == 'milestone') {
            if (this.selected_image.name == '') {
              this.isImageShow = true;
            }

            if (this.selected_reminder.pkReminderId == 0) {
              this.isStartingShow = true;
            }

            if (this.selected_repeat.pkRepeatId == 0) {
              this.isRepeatShow = true;
            }

            if (
              this.isStartingShow == true ||
              this.isRepeatShow == true ||
              this.isImageShow == true
            ) {
              return;
            }

            let selectedTaskInfo = {
              SelectedTaskId: this.selectedtask,
              TaskId: 0,
              ImageUrl: this.selected_image.name,
              TaskDescription: this.taskdescription,
              gradeIds: Array.prototype.map
                .call(this.selected_Grades, function (item) {
                  return item.gradeDesc;
                })
                .join(','),
              ReminderSchedule: this.selected_reminder,
              RepeatSchedule: this.selected_repeat,
              MarkCompleted: this.isTaskCompleted,
            };

          

            this.adminServices
              .addSelectedTask(selectedTaskInfo, this.msId)
              .subscribe((repo: any) => {
                console.log('addselectedtask', repo);
                var reslist = repo;
                this.close();
              });
          }

          if (this.formtype == 'manager') {
            if (this.selected_image.name == '') {
              this.isImageShow = true;
            }

            if (this.selected_reminder.pkReminderId == 0) {
              this.isStartingShow = true;
            }

            if (this.selected_repeat.pkRepeatId == 0) {
              this.isRepeatShow = true;
            }

            if (
              this.isStartingShow == true ||
              this.isRepeatShow == true ||
              this.isImageShow == true
            ) {
              return;
            }

            let selectedTaskInfo = {
              SelectedTaskId: this.selectedtask,
              TaskId: this.taskInfo.taskId,
              ImageUrl: this.selected_image.name,
              TaskDescription: this.taskdescription,
              ReminderSchedule: this.selected_reminder,
              RepeatSchedule: this.selected_repeat,
              MarkCompleted: this.isTaskCompleted,
            };

            this.adminServices
              .addManagerSelectedTask(selectedTaskInfo, this.planId)
              .subscribe((repo: any) => {
                console.log('AddManagerSelectedTask', repo);
                var reslist = repo;
                this.close();
              });
          }
        }

        if (this.viewType == 'edit') {
          debugger;
          let selectedTaskInfo = {
            SelectedTaskId: this.selectedtask,
            TaskId: this.taskInfo.taskId,
            ImageUrl: this.selected_image.name,
            TaskDescription: this.taskdescription,
            gradeIds: Array.prototype.map
              .call(this.selected_Grades, function (item) {
                return item.gradeDesc;
              })
              .join(','),
            ReminderSchedule: this.selected_reminder,
            RepeatSchedule: this.selected_repeat,
            MarkCompleted: this.isTaskCompleted,
          };

          if (this.formtype == 'milestone') {
            this.adminServices
              .editTask(selectedTaskInfo, this.msId)
              .subscribe((repo: any) => {
                console.log('editTask', repo);
                var reslist = repo;
                this.close();
              });
          }

          if (this.formtype == 'manager') {
            this.adminServices
              .editManagerSelectedTask(selectedTaskInfo, this.planId)
              .subscribe((repo: any) => {
                console.log('editManagerSelectedTask', repo);
                var reslist = repo;
                this.close();
              });
          }
        }
      }
    }


    if (this.taskType == 'sessionlist') {
      debugger;
      if (this.selectedtask == '') {
        this.isTaskTitle = true;
      }

      if (this.taskdescription == '') {
        this.isTaskDescription = true;
      }
      if (
        this.isTaskTitle == true ||
        this.isTaskDescription == true
      ) {
        return;
      } else {
        if (this.viewType == 'add') {
          if (this.selected_image.name == '') {
            this.isImageShow = true;
          }

          if (
            this.isImageShow == true
          ) {
            return;
          }

          let selectedTaskInfo = {
            TaskName: this.selectedtask,
            ImageUrl: this.selected_image.name,
            TaskDescription: this.taskdescription,
            gradeIds: Array.prototype.map
              .call(this.selected_Grades, function (item) {
                return item.gradeDesc;
              })
              .join(','),
            ReminderSchedule: 0,
            RepeatSchedule:0,
            MarkCompleted: 0,
         
          };

          if (this.formtype == 'milestone') {

            if (this.viewType == 'add') {

              this.adminServices
                .addSessionTask(selectedTaskInfo, this.msId)
                .subscribe((repo: any) => {
                  console.log('addSessionTask', repo);
                  var reslist = repo;
                  this.close();
                });
            }
          }

        }

        if (this.viewType == 'edit') {
          let selectedTaskInfo = {
            SessionTaskId: this.taskInfo.taskId,
            TaskName: this.selectedtask,
            ImageUrl: this.selected_image.name,
            TaskDescription: this.taskdescription,
            gradeIds: Array.prototype.map
              .call(this.selected_Grades, function (item) {
                return item.gradeDesc;
              })
              .join(','),
            ReminderSchedule: 0,
            RepeatSchedule: 0,
            MarkCompleted: 0,
          };

          if (this.formtype == 'milestone') {
            this.adminServices
              .EditSesssionTask(selectedTaskInfo, this.msId)
              .subscribe((repo: any) => {
                console.log('EditSesssionTask', repo);
                var reslist = repo;
                this.close();
              });
          }
        }
      }
    }
  }


  getFilterStyles() {

    let ddllist = document.getElementById('ddlImage') ;
    //let ddllist = document.getElementsByName('p-dropdown');

  
    if (this.viewType == 'view') {

      //if (ddllist != null) {
      //  ddllist.style.backgroundColor = '#D0D0CE';
      //  ddllist.style.width = '31.375rem';
      //  ddllist.style.height = '2.5rem';
      //}

      return { 'background-color': '#D0D0CE' }; 
    } else {

      //if (ddllist != null) {
      //  ddllist.style.backgroundColor = '#F7F7F5';
      //  ddllist.style.width = '31.375rem';
      //  ddllist.style.height = '2.5rem';
      //}

      return { 'background-color': '#F7F7F5' };
    }

  }


  getdropdownFilterStyles() {


    let ddllist = document.getElementById('ddlImage') as HTMLElement;
    let ddllistname = document.getElementsByClassName('p-dropdown');

    if (this.viewType == 'view') {


      if (ddllist != null) {
        ddllist.style.backgroundColor = 'D0D0CE';
      }

      //if (ddllistname != null) {
      //  ddllistname..backgroundColor = 'red';
      //}

      //width: 31.375rem;
      //height: 2.5rem;
      //background - color: #D0D0CE;
      //color: #000048;
      //font - family: Gellix;
      //font - size: 0.9375rem;
      //font - style: normal;
      //font - weight: 400;
      //line - height: normal;
      //margin - top: 0.5rem;


      return { 'background-color': 'D0D0CE', 'width': '31.375rem', 'height':'2.5rem'  };
    } else {

     
      return { 'background-color': '#F7F7F5',  'width': '31.375rem', 'height': '2.5rem' };
    }

  }

  test() {
    alert('hiiii');
  }



  close() {
    this.closeAddTaskPopup.emit(false);
  }
}
