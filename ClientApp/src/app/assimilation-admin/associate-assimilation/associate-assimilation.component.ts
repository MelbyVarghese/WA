import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { AdminServicesService } from '../admin-services.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-associate-assimilation',
  templateUrl: './associate-assimilation.component.html',
  styleUrls: ['./associate-assimilation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AssociateAssimilationComponent {
  @Input() displayAssociateAssimilationPopup = false;
  @Input() displayAssociatedocumentpopup = false;
  @Input() associateInfo: any;
  @Output() closeAssociateAssimilationPopup = new EventEmitter<any>();
  managerResponse: string = '';
  managerTaskStatus: string = '';
  milestones: any = [];
  firstname: string = '';
  lastname: string = '';
  collapsed: boolean = true;
  isconditionmet: boolean = false;
  constructor(private adminServices: AdminServicesService,private messageService: MessageService) {

  }

  ngOnInit(): void {
    console.log(this.associateInfo);

    var assname = this.associateInfo.associateName.split(',');
    var assfname = assname[0].trim().charAt(0).toUpperCase();
    this.firstname = assfname;

    if (assname.length > 1) {
      var asslname = assname[1].trim().charAt(0).toUpperCase();
      this.lastname = asslname;
    }

    this.getAssociateAssimilationProgress();
  }

  getAssociateAssimilationProgress() {
    this.adminServices
      .getAssociateAssimilationProgress(this.associateInfo.employeeId)
      .subscribe((list: any) => {
        console.log('getAssociateAssimilationProgress => ', list);
        this.associateInfo = list.associateDetails && list.associateDetails.length > 0 && list.associateDetails[0];
        this.managerResponse = list.feedback && list.feedback[0].managerResponse;
        this.managerTaskStatus = list.feedback && list.feedback[0].managerTaskStatus;
        this.milestones = list.milestones;
      });
  }

  close() {
    // emitting false means closing the popup
    this.closeAssociateAssimilationPopup.emit(false);
  }

  showdocumentpopup() {
    const popup1 = document.getElementById('popup1') as HTMLDivElement;
    this.displayAssociatedocumentpopup = true;
    popup1.classList.add('move-left');
  }
  closedocumentpopup() {
    this.displayAssociatedocumentpopup = false;
  }
  downloaddocument(
    ocmcontentid: any,
    taskid: any) {
    console.log(this.associateInfo.emplID, ocmcontentid);
    this.adminServices
      .downloaddoc(this.associateInfo.emplID, ocmcontentid)
      .subscribe((response: any) => {
        console.log(response);
        const linkSource = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + response.fileDataBase64;
        const downloadLink = document.createElement("a");
        const fileName = response.fileName;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }
    );
    this.Updatedownloaddocumentstatus(ocmcontentid, taskid);
  }
 

  Updatedownloaddocumentstatus(ocmcontentid: any,
    taskid: any) {
    debugger;
    console.log(ocmcontentid, taskid);
    this.adminServices
      .Updatedownloadeddocstatus(this.associateInfo.emplID, ocmcontentid, taskid)
      .subscribe((response: any) => {
        console.log(response);
      }
      );
  }


  UpdateDownloadedDocumentCompletedStatus(
    taskid: any,
   taskname:any) {
    debugger;
    console.log(taskid, taskname);
    this.adminServices
      .UpdateDownloadedDocumentCompletedStatus(this.associateInfo.emplID, taskid, taskname)
      .subscribe((response: any) => {
        console.log('UpdateDownloadedDocumentCompletedStatus:', response);

        if (response?.length > 0) {
          this.close();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail:
              'Marked as completed successfully.',
            sticky: false,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Success',
            /*   detail: failedFiles[0].validateMessage,*/
            detail: 'Mark as complete not successfull.',
            sticky: false,
          });
        }

      });
  }


  togglecondition() {
    this.isconditionmet = !this.isconditionmet;
  }
}

