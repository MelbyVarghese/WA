import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AdminServicesService } from '../../admin-services.service';

@Component({
  selector: 'app-induction-content',
  templateUrl: './induction-content.component.html',
  styleUrls: ['./induction-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InductionContentComponent {
  @Input() displayInductionContentPopup = false;
  @Input() inductionContentInfo: any;
  @Input() planId: any;
  @Input() viewType: any;
  @Output() closeAssociateAssimilationPopup = new EventEmitter<any>();

  myform!: FormGroup;
  selected_image: any;
  imageList: any = [];
  imagenames: any = [];

  isUploadDevice: boolean = true;
  isLinkContext: boolean = false;
  selectedFile!: File;
  filewarning: string = '';
  showfilewarning: boolean = false;
  showFileValidation: boolean = false;
  showFileLinkValidation: boolean = false;
  showImagedropdown: boolean = true;
  showlargeImage: boolean = false;
  showImages: boolean = false;
  isDisabled: boolean = false;

  uploadedFileDetails: any = {
    id: false,
  };

  constructor(
    private fb: FormBuilder,
    private adminServices: AdminServicesService
  ) {
    this.selected_image = { name: '' };
  }

  ngOnInit(): void {
    console.log(this.inductionContentInfo);

    this.imageList = [
      { name: 'image_name1.jpg', isSelected: false },
      { name: 'image_name2.jpg', isSelected: false },
      { name: 'image_name3.jpg', isSelected: false },
      { name: 'image_name4.jpg', isSelected: false },
    ];

    this.createForm();

    if (this.viewType == 'Edit') {
      this.myform
        .get('contenttitle')
        ?.setValue(this.inductionContentInfo.title);
      this.myform
        .get('contentdescription')
        ?.setValue(this.inductionContentInfo.description);

      this.imagenames = [];
      this.imagenames.push({ name: this.inductionContentInfo.imageUrl });
      this.selected_image.name = this.inductionContentInfo.imageUrl;
      this.myform
        .get('contentfilename')
        ?.setValue(this.inductionContentInfo.imageUrl);
      this.inductionContentInfo.contentfilename =
        this.inductionContentInfo.imageUrl;

      this.myform.get('contentlink')?.setValue(this.inductionContentInfo.link);
    }
  }

  createForm() {
    this.myform = new FormGroup({
      contenttitle: new FormControl(this.inductionContentInfo.contentName, [
        Validators.required,
      ]),
      contentdescription: new FormControl(
        this.inductionContentInfo.contentDescription,
        [Validators.required]
      ),
      contentfilename: new FormControl(
        this.inductionContentInfo.contentFilename
      ),
      contentlink: new FormControl(this.inductionContentInfo.contentLink),
    });
  }

  setContentName() {
   
    var tempcontenttitle;
    tempcontenttitle = this.myform.get('contenttitle')?.value;

    tempcontenttitle = tempcontenttitle.replace(/</gi, '');
    tempcontenttitle = tempcontenttitle.replace(/>/gi, '');
    tempcontenttitle = tempcontenttitle.replace('script', '');
    tempcontenttitle = tempcontenttitle.replace(/\//gi, '');
    tempcontenttitle = tempcontenttitle.replace(/\\/gi, '');
    tempcontenttitle = tempcontenttitle.replace('(', '');
    tempcontenttitle = tempcontenttitle.replace(')', '');
    tempcontenttitle = tempcontenttitle.replace(/!/gi, '');
    tempcontenttitle = tempcontenttitle.replace(/@/gi, '');
    tempcontenttitle = tempcontenttitle.replace(/#/gi, '');
    tempcontenttitle = tempcontenttitle.replace('$', '');
    tempcontenttitle = tempcontenttitle.replace(/%/gi, '');
    tempcontenttitle = tempcontenttitle.replace('^', '');    
    tempcontenttitle = tempcontenttitle.replace('*', '');  
    tempcontenttitle = tempcontenttitle.replace('-', '');
    tempcontenttitle = tempcontenttitle.replace('+', '');
    tempcontenttitle = tempcontenttitle.replace('=', '');
    tempcontenttitle = tempcontenttitle.replace(/{/gi, '');
    tempcontenttitle = tempcontenttitle.replace(/}/gi, '');
    tempcontenttitle = tempcontenttitle.replace('[', '');
    tempcontenttitle = tempcontenttitle.replace(']', '');
    tempcontenttitle = tempcontenttitle.replace(/'/gi, '');
    tempcontenttitle = tempcontenttitle.replace(/"/gi, '');
    tempcontenttitle = tempcontenttitle.replace(/|/gi, '');
    tempcontenttitle = tempcontenttitle.replace(/:/gi, '');
    tempcontenttitle = tempcontenttitle.replace(/;/gi, '');
    tempcontenttitle = tempcontenttitle.replace(/'/gi, '');
    tempcontenttitle = tempcontenttitle.replace(/,/gi, '');    
    tempcontenttitle = tempcontenttitle.replace('?', '');

    this.myform.get('contenttitle')?.setValue(tempcontenttitle);
    this.inductionContentInfo.contentName = this.myform.get('contenttitle')?.value;
  }

  setContentDescription() {

    var tempcontentdescription;
    tempcontentdescription = this.myform.get('contentdescription')?.value;

    tempcontentdescription = tempcontentdescription.replace(/</gi, '');
    tempcontentdescription = tempcontentdescription.replace(/>/gi, '');
    tempcontentdescription = tempcontentdescription.replace('script', '');
    tempcontentdescription = tempcontentdescription.replace(/\//gi, '');
    tempcontentdescription = tempcontentdescription.replace(/\\/gi, '');  
    tempcontentdescription = tempcontentdescription.replace(/@/gi, '');
    tempcontentdescription = tempcontentdescription.replace(/#/gi, '');
    tempcontentdescription = tempcontentdescription.replace('$', '');
    tempcontentdescription = tempcontentdescription.replace(/%/gi, '');
    tempcontentdescription = tempcontentdescription.replace('^', ''); 
    tempcontentdescription = tempcontentdescription.replace('*', '');
    tempcontentdescription = tempcontentdescription.replace('-', '');
    tempcontentdescription = tempcontentdescription.replace('+', '');
    tempcontentdescription = tempcontentdescription.replace('=', '');
    tempcontentdescription = tempcontentdescription.replace(/{/gi, '');
    tempcontentdescription = tempcontentdescription.replace(/}/gi, '');
    tempcontentdescription = tempcontentdescription.replace('[', '');
    tempcontentdescription = tempcontentdescription.replace(']', '');
    tempcontentdescription = tempcontentdescription.replace(/|/gi, '');
    tempcontentdescription = tempcontentdescription.replace(/"/gi, '');
    tempcontentdescription = tempcontentdescription.replace(/:/gi, '');
    tempcontentdescription = tempcontentdescription.replace(/;/gi, ''); 
    tempcontentdescription = tempcontentdescription.replace('?', '');

    this.myform.get('contentdescription')?.setValue(tempcontentdescription);
    this.inductionContentInfo.contentDescription = this.myform.get('contentdescription')?.value;
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
    this.myform.get('contentfilename')?.setValue(fileteredImage.name);
    this.inductionContentInfo.contentfilename = fileteredImage.name;

    this.showFileValidation = false;
  }

  setContentFileLink() {
    this.inductionContentInfo.contentLink =
      this.myform.get('contentlink')?.value;

    if (this.inductionContentInfo.contentLink != '') {
      this.showFileLinkValidation = false;
    }

    if (this.inductionContentInfo.contentLink == '') {
      this.showFileLinkValidation = true;
    }
  }

  setUploadView(type: string) {
    this.isUploadDevice = false;
    this.isLinkContext = false;

    if (type == 'uploadDevice') {
      this.isUploadDevice = true;
    }

    if (type == 'linkContent') {
      this.isLinkContext = true;
    }
  }

  FileUpload(type: string) {
    // this.fullname = '';
    // this.fullNameStyle = '';
    // this.initial = '';
    // this.initialStyle = '';
    // this.signatureImg = '';

    let fileDOM = document.getElementById(type + '-file');
    fileDOM?.click();
  }

  onFileChanged(event: any, proofType: string) {
    this.selectedFile = event.target.files[0];
    this.upload();
  }

  upload() {
    let uploadData = new FormData();
    let documentType = '';
    let documentName = '';
    let fileToUpload: any;

    this.filewarning = '';
    this.showfilewarning = false;

    if (
      this.selectedFile.type != 'application/pdf' &&
      this.selectedFile.type !== 'application/mp4'
    ) {
      this.filewarning = 'only .pdf or .mp4 files are allowed';
      this.showfilewarning = true;
      this.inductionContentInfo.contentFilename = '';
    }

    if (this.filewarning == '') {
      var filesize = parseFloat((this.selectedFile.size / 1048576).toFixed(2));

      if (filesize > 100) {
        this.filewarning = 'filesize should be at 100mb or less';
        this.showfilewarning = true;
        this.inductionContentInfo.contentFilename = '';
      }
    }

    if (this.showfilewarning == false) {
      fileToUpload = this.selectedFile;
      this.uploadedFileDetails.id = false;
      this.inductionContentInfo.contentFilename = this.selectedFile.name;
      this.myform.get('contentfilename')?.setValue(this.selectedFile.name);
      this.showFileValidation = false;
    }
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
    this.selectedFile = (event.dataTransfer.files as FileList)[0];

    event.stopPropagation();
    event.preventDefault();
    event.target.classList?.remove('dragging');

    this.upload();
  }

  deleteFile() {
    this.inductionContentInfo.contentFilename = '';
    this.myform.get('contentfilename')?.setValue('');
    this.showFileValidation = true;
  }

  saveInductionContent(event: Event) {
    this.inductionContentInfo.contentName =
      this.myform.get('contenttitle')?.value;
    this.inductionContentInfo.contentDescription =
      this.myform.get('contentdescription')?.value;
    this.inductionContentInfo.contentFilename =
      this.myform.get('contentfilename')?.value;
    this.inductionContentInfo.contentLink =
      this.myform.get('contentlink')?.value;

    if (this.inductionContentInfo.contentFilename.name == '') {
      this.showFileValidation = true;
    }

    if (this.isLinkContext && this.inductionContentInfo.contentLink == '') {
      this.showFileLinkValidation = true;
    }

    if (!this.myform.valid) {
      this.myform.markAllAsTouched();
      return;
    }

    if (
      this.showFileValidation == true ||
      this.showFileLinkValidation == true
    ) {
      return;
    }

    if (this.myform.valid) {
      if (this.viewType == 'Add') {
        let contentInfo = {
          PlanId: this.planId,
          Title: this.inductionContentInfo.contentName,
          Description: this.inductionContentInfo.contentDescription,
          UploadedFile: '',
          ImageUrl: this.inductionContentInfo.contentFilename.name,
          Link: this.inductionContentInfo.contentLink,
        };

        this.adminServices
          .addInductionContent(contentInfo)
          .subscribe((list: any) => {
            console.log('addInductionContent', list);

            if (list.length > 0) {
              this.close();
            }
          });
      }

      if (this.viewType == 'Edit') {
        let contentInfo = {
          IndContentId: this.inductionContentInfo.indContentId,
          PlanId: this.inductionContentInfo.planId,
          Title: this.inductionContentInfo.contentName,
          Description: this.inductionContentInfo.contentDescription,
          UploadedFile: '',
          Link: this.inductionContentInfo.contentLink,
          ImageUrl: this.inductionContentInfo.contentFilename.name,
        };

        this.adminServices
          .editInductionContent(contentInfo)
          .subscribe((list: any) => {
            console.log('editInductionContent', list);
            if (list.length > 0) {
              this.close();
            }
          });
      }
    }
  }

  close() {
    this.closeAssociateAssimilationPopup.emit(false);
  }
}
