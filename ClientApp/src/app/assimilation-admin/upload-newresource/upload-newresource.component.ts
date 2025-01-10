import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { AdminServicesService } from '../admin-services.service';
import * as _ from 'lodash';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-upload-newresource',
  templateUrl: './upload-newresource.component.html',
  styleUrls: ['./upload-newresource.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UploadNewresourceComponent {
  @Input() displayUploadNewResourcePopup = false;
  @Output() closeUploadNewResourcePopup = new EventEmitter<any>();

  inductionContentInfo: any = {
    contentfilename: '',
  };
  apTemplates: any[] = [];
  selectedplan: any;
  selectplan: string='';
  roletype: string='';
  taskid: number = 0;
  selectedFiles: any = [];
  selectedServiceLine: any = 'N2C IOA';
  filewarning: string = '';
  showfilewarning: boolean = false;
  showFileValidation: boolean = false;

  N2CIOAchecked: boolean = false;
  N2CTechchecked: boolean = false;
  Bothchecked: boolean = false;
  base64FileContent: any = {};
  blockedPanel: boolean = false;


  constructor(
    private adminServices: AdminServicesService,
    private messageService: MessageService,

  ) {
 
  }

  ngOnInit(): void {
    this.fetchAPTemplates();
  }
  fetchAPTemplates(): void {
    this.adminServices.getAPTemplates().subscribe(
      (data) => {
        this.apTemplates= data;
        console.log('AP Templates:', this.apTemplates);
      },
      (error) => {
        console.error('Error fetching AP Templates', error);
      }
    );
  }

  OnPlanChange() {
    this.selectplan = this.selectedplan;
  }

  ViewN2CIoa() {
    this.N2CIOAchecked = !this.N2CIOAchecked;

    if (this.N2CIOAchecked == true && this.N2CTechchecked == true) {
      this.Bothchecked = true;
    }

    if (this.N2CIOAchecked != true || this.N2CTechchecked != true) {
      this.Bothchecked = false;
    }
  }

  ViewN2Ctech() {
    this.N2CTechchecked = !this.N2CTechchecked;

    if (this.N2CIOAchecked == true && this.N2CTechchecked == true) {
      this.Bothchecked = true;
    }

    if (this.N2CIOAchecked != true || this.N2CTechchecked != true) {
      this.Bothchecked = false;
    }
  }

  ViewBoth() {
    this.Bothchecked = !this.Bothchecked;

    if (this.Bothchecked == true) {
      this.N2CIOAchecked = true;
      this.N2CTechchecked = true;
    }

    if (this.Bothchecked == false) {
      this.N2CIOAchecked = false;
      this.N2CTechchecked = false;
    }
  }

  upload() {
    // let uploadData = new FormData();
    let documentType = '';
    let documentName = '';
    let fileToUpload: any;

    this.filewarning = '';
    this.showfilewarning = false;

    // if (
    //   this.selectedFile.type != 'application/pdf' &&
    //   this.selectedFile.type !== 'application/mp4'
    // ) {
    //   this.filewarning = 'only .pdf or .mp4 files are allowed';
    //   this.showfilewarning = true;
    //   //this.inductionContentInfo.contentFilename = '';
    // }

    // if (this.filewarning == '') {
    //   var filesize = parseFloat((this.selectedFile.size / 1048576).toFixed(2));

    //   if (filesize > 100) {
    //     this.filewarning = 'filesize should be at 100mb or less';
    //     this.showfilewarning = true;
    //     //this.inductionContentInfo.contentFilename = '';
    //   }
    // }

    if (this.showfilewarning == false) {
      // fileToUpload = this.selectedFile;
      //this.uploadedFileDetails.id = false;
      //this.inductionContentInfo.contentFilename = this.selectedFile.name;
      //this.myform.get('contentfilename')?.setValue(this.selectedFile.name);
      this.showFileValidation = false;
    }

    let uploadData: any = [];
    let country: any = [];
    // let file: File;
    // const reader = new FileReader();
    _.each(this.selectedFiles, (file) => {
      debugger;
      // const reader = new FileReader();
      // let base64FileContent: any = '';
      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   // console.log(reader.result);
      //   base64FileContent = reader.result;
      // };
      // // fileDataBase64: this.base64FileContent[file.name],
      // fileDataBase64: base64FileContent,
      uploadData.push({
        fileDataBase64: this.base64FileContent[file.name].split('base64,')[1],
        // fileDataBase64: base64FileContent,
        fileName: file.name,
      });
      // reader.abort();
    });
    console.log(uploadData);
    this.blockedPanel = true;
    this.adminServices
      .uploadAssociateKeyDocuments(uploadData, this.selectedplan.planTitle,country,this.roletype,this.taskid)
      .subscribe((response: any) => {
        console.log('uploadAssociateKeyDocuments:', response);
        this.blockedPanel = false;
        if (response?.length > 0) {
          let fileNames = '';
          let uploadSuccess = false;
          let failedFiles: any = [];
          _.each(response, (item) => {
            if (item.validateMessage == '') {
              fileNames += item.docName + ', ';
              uploadSuccess = true;
            } else {
              failedFiles.push(item);
            }
          });
          if (uploadSuccess) {
            this.close();
            this.displayUploadNewResourcePopup = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail:
                fileNames +
                'uploaded successfully. Associates will be able to view it under “Key document” in employee portal.',
              sticky: false,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Success',
              detail: failedFiles[0].validateMessage,
              sticky: false,
            });
          }
        }
      });
  }

  FileUpload(type: string) {
    let fileDOM = document.getElementById(type + '-file');
    fileDOM?.click();
  }

  onFileChanged(event: any, proofType: string) {
    this.checkAndFilterFiles(event.target.files);
    // if (event.target.files.length >= 4) {
    //   return;
    // }

    // // _.each(event.target.files, (file) => {
    // //   // console.log(file);
    // //   var allowedFileName = /^[a-zA-Z0-9() –_-]\.[a-zA-Z0-9() –_-]*$/;
    // //   console.log(allowedFileName.exec(file.name));
    // //   if (!allowedFileName.exec(file.name)) {
    // //     // alert('Invalid file type');
    // //     // return false;
    // //     event.target.files.remove(file);
    // //   }
    // //   //  else {
    // //   //   return true;
    // //   // }
    // // });

    // this.selectedFiles = event.target.files;
    // _.each(this.selectedFiles, (file) => {
    //   var allowedFileNameChk1: RegExp = /\.[\w]{0,}\./;
    //   var allowedFileNameChk2: RegExp = /^[a-zA-Z0-9() –_.-]*$/;
    //   // var allowedFileName = /^[a-zA-Z0-9() –_-]\.[a-zA-Z0-9() –_-]*$/;
    //   file.isAllowed = true;
    //   if (allowedFileNameChk1.exec(file.name)) {
    //     file.isAllowed = false;
    //   }
    //   if (!allowedFileNameChk2.exec(file.name)) {
    //     file.isAllowed = false;
    //   }
    //   if (Math.round(file.size / 1024) > 5 * 1024) {
    //     file.isAllowed = false;
    //   }

    //   // this.selectedFiles.push(file);
    //   const reader = new FileReader();
    //   // let base64FileContent: any = '';
    //   // reader.readAsBinaryString(file);
    //   reader.readAsDataURL(file);
    //   // reader.onload = (event) => btoa(reader.result.toString());
    //   reader.onload = () => {
    //     // console.log(reader.result);
    //     this.base64FileContent[file.name] = reader.result;
    //   };
    // });
    // console.log(this.selectedFiles);
    // this.selectedFiles = _.filter(this.selectedFiles, (file) => {
    //   return file.isAllowed;
    // });
    // console.log(this.selectedFiles);
    // // this.upload();
  }

  deleteFile(fileToRemove: File) {
    // this.showFileValidation = true;
    this.selectedFiles = _.filter(this.selectedFiles, (file) => {
      return file != fileToRemove;
    });
  }

  onDragEnter(event: any) {
    if (event.target.id == 'droppable') {
      event.preventDefault();
      event.target.classList?.add('dragging');
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
    event.target.classList?.add('dragging');
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.target.classList?.remove('dragging');
  }

  onDrop(event: any) {
    event.preventDefault();
    event.target.classList?.remove('dragging');
  }

  drop(event: any, proofType: string = 'id') {
    // this.selectedFiles = event.dataTransfer.files as FileList;
    this.checkAndFilterFiles(event.dataTransfer.files as FileList);
    event.stopPropagation();
    event.preventDefault();
    event.target.classList?.remove('dragging');

    // this.upload();
  }

  checkAndFilterFiles(files: FileList) {
    debugger;
    if (files.length >= 4) {
      return;
    }

    // _.each(event.target.files, (file) => {
    //   // console.log(file);
    //   var allowedFileName = /^[a-zA-Z0-9() –_-]\.[a-zA-Z0-9() –_-]*$/;
    //   console.log(allowedFileName.exec(file.name));
    //   if (!allowedFileName.exec(file.name)) {
    //     // alert('Invalid file type');
    //     // return false;
    //     event.target.files.remove(file);
    //   }
    //   //  else {
    //   //   return true;
    //   // }
    // });

    this.selectedFiles = files;
    _.each(this.selectedFiles, (file) => {
      debugger;
      var allowedFileNameChk1: RegExp = /\.[\w]{0,}\./;
      var allowedFileNameChk2: RegExp = /^[a-zA-Z0-9() –_.-]*$/;
      // var allowedFileName = /^[a-zA-Z0-9() –_-]\.[a-zA-Z0-9() –_-]*$/;
      file.isAllowed = true;
      if (allowedFileNameChk1.exec(file.name)) {
        file.isAllowed = false;
      }
      if (!allowedFileNameChk2.exec(file.name)) {
        file.isAllowed = false;
      }
      
      if (Math.round(file.size / 1024) > 5 * 1024) {
        file.isAllowed = false;
      }

      if (file.type == 'video/mp4' || file.type == 'mp4') {
        file.isAllowed = true;
      }

      // this.selectedFiles.push(file);
      const reader = new FileReader();
      // let base64FileContent: any = '';
      // reader.readAsBinaryString(file);
      reader.readAsDataURL(file);
      // reader.onload = (event) => btoa(reader.result.toString());
      reader.onload = () => {
        // console.log(reader.result);
        this.base64FileContent[file.name] = reader.result;
      };
    });
    console.log(this.selectedFiles);
    this.selectedFiles = _.filter(this.selectedFiles, (file) => {
      return file.isAllowed;
    });
    console.log(this.selectedFiles);
    // this.upload();
  }

  close() {
    this.closeUploadNewResourcePopup.emit(false);
  }
}
