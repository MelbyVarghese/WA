import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AdminServicesService } from '../../admin-services.service';

@Component({
  selector: 'app-welcome-email',
  templateUrl: './welcome-email.component.html',
  styleUrls: ['./welcome-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeEmailComponent {
  // @Input() IsSaveButton: any;
  // @Input() planType: any;
  // @Input() planId: any;
  @Input() assimilationPlanDetails: any;
  @Output() assimilationPlanDetailsChange = new EventEmitter<any>();
  @Output() prevTaskEvent = new EventEmitter<string>();
  @Output() nextTaskEvent = new EventEmitter<string>();

  myform!: FormGroup;

  emailSubject: string = 'Welcome to Cognizant!';
  emailMessage: string =
    'As you embark on your journey with Cognizant, we have put together an Assimilation Plan to enable you to fully integrate into Cognizant’s way of life. It would provide a roadmap to help you in identifying and accomplishing the key tasks to ensure your seamless integration into Cognizant. \n\n Log on to the assimilation portal today to reach new heights together with us!';
  emailContact: string = '';

  zoomwidth: number = 405;
  previewwidth = 405;
  zoompercentage: number = 100;
  canEdit: boolean = false;
  plantitle: string = '';

  supportMails: any = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private adminServices: AdminServicesService
  ) {
    this.createForm();
    // this.getWelcomeEmail();
  }

  ngOnInit(): void {   

    this.canEdit = this.assimilationPlanDetails.info.tag != 'Active';
    this.plantitle = this.assimilationPlanDetails.info.planTitle;
    console.log('plantitle = ', this.plantitle)
    this.getWelcomeEmail();

    if (!this.canEdit) {
      this.myform.get('ESubject')?.disable();
      this.myform.get('EMessage')?.disable();
      this.myform.get('EContact')?.disable();
    }
  }

  getWelcomeEmail() {
 
    console.log(this.assimilationPlanDetails);
    this.adminServices
      .getWelcomeEmail(this.assimilationPlanDetails.info.planId)
      .subscribe((response: any) => {
        console.log('getWelcomeEmail', response);
        this.assimilationPlanDetails.welcomeEmail = response;
        this.assimilationPlanDetailsChange.emit(this.assimilationPlanDetails);

        this.myform.get('ESubject')?.setValue(response[0].subject);   

        var mess = response[0].message;
        this.myform.get('EMessage')?.setValue(mess);      

        if (response[0].supportContactEmail != null) {         
          var mails = response[0].supportContactEmail.split(';');
         
          for (let i = 0; i < mails.length; i++) {
            if (mails[i] != '') {
              mails[i] = mails[i].replace('(', '\r\n(');
              this.supportMails.push(mails[i]);   
            }
            
          }    
        }           

        this.myform.get('EContact')?.setValue(response[0].supportContactEmail);

        if (response[0].supportContactEmail != null) {
          this.emailContact = response[0].supportContactEmail.split(';')[0];
        }

        this.cdr.detectChanges();

      });
  }

  getMailId(mailid: any) {
    var mail = mailid.split('.com')[0];
    return mail;
  }

  getZoneName(mailid: any) {
    var mail = mailid.split('.com');
    var zone = '';

    if (mail.length > 1) {
      zone = mail[1].split('(')[0];
    }

    return zone;
  }

  getLocationName(mailid: any) {
    var mail = mailid.split('.com');
  
    var location = '';

    if (mail.length > 1) {
      var zone = mail[1].split('(');

      if (zone.length > 1) {
        location = '(' +zone[1];
      }
    }

    return location;
  }


  ngOnChanges() {
    // console.log('IsSaveButton = ' + this.IsSaveButton);
    // console.log('planType = ' + this.planType);

    if (this.canEdit) {
      this.myform.get('ESubject')?.enable();
      this.myform.get('EMessage')?.enable();
      this.myform.get('EContact')?.enable();
    }
  }

  createForm() {
    this.myform = new FormGroup({
      ESubject: new FormControl(this.emailSubject, [Validators.required]),
      EMessage: new FormControl(this.emailMessage, [Validators.required]),
      EContact: new FormControl(this.emailContact, [Validators.required]),
    });
  }

  getBackgroundStyles() {
    if (this.canEdit) {
      return { 'background-color': '#F2F2F2' };
    } else {
      return { 'background-color': '#D0D0CE' };
    }
  }

  setSubject() {
    this.emailSubject = this.myform.get('ESubject')?.value;
  }

  setMessage() {
    this.emailMessage = this.myform.get('EMessage')?.value;
  }

  setContact() {
    this.emailContact = this.myform.get('EContact')?.value;
  }

  zoomplus() {
    this.zoomwidth = this.zoomwidth + 5;
    this.zoompercentage = Math.round(
      (this.zoomwidth / this.previewwidth) * 100
    );
  }

  zoomminus() {
    this.zoomwidth = this.zoomwidth - 5;
    this.zoompercentage = Math.round(
      (this.zoomwidth / this.previewwidth) * 100
    );
  }

  saveChanges() {
    if (!this.myform.valid) {
      this.myform.markAllAsTouched();
      return;
    }

    if (this.myform.valid) {
      let emailInfo = {
        Subject: this.emailSubject,
        Message: this.emailMessage,
        SupportContactEmail: this.emailContact,
        planId: this.assimilationPlanDetails.info.planId,
        templateID: this.assimilationPlanDetails.welcomeEmail[0].templateID,
      };
     
    
      this.adminServices
        .updateWelcomeEmail(emailInfo)
        .subscribe((resp: any) => {
          console.log(resp);
          this.getWelcomeEmail();
        });

    }
  }

  prevStep(value: any) {
    this.prevTaskEvent.emit(value);
  }

  nextStep(value: any) {
    this.nextTaskEvent.emit(value);
  }
}
