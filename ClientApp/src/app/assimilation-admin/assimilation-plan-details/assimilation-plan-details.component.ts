import {
  Component,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AdminServicesService } from '../admin-services.service';
import { MessageService } from 'primeng/api';
import { TokenStorageService } from '../../@core/services/token-storage.service';

@Component({
  templateUrl: './assimilation-plan-details.component.html',
  styleUrls: ['./assimilation-plan-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AssimilationPlanDetailsComponent {
  showcreateicon: boolean = false;
  showPublishBtn: boolean = false;
  showMakeACopyBtn: boolean = true;
  showEditBtn: boolean = false;
  activesave = false;
  createplanvisible: boolean = false;
  selectedNavItem: string = '01';
  showAssgnPlan: boolean = true;
  showWelcomeEmail: boolean = false;
  showMilestoneTasks: boolean = false;
  showInductionSelf: boolean = false;
  showManagerTasks: boolean = false;
  isPlantitle: boolean = false;
  isPlanDescription: boolean = false;
  isPlanTitleLength: boolean = false;
  isPlansDescriptionLength: boolean = false;
  planType = '';
  planName: string = '';
  planName_temp: string = '';
  planId: any;
  planDescription: string = '';
  planDescription_temp: string = '';
  templateType: string = '';
  isSaveClicked = false;
  // templateType: string = 'defaultTemplate';
  assimilationPlanDetails: any = {
    info: {},
    assignPlan: [],
    welcomeEmail: {},
    milestones: [],
    inductionContent: [],
    managerTasks: [],
  };
  showPublishMandatoryAlert = false;
  isTemplateExists: boolean = false;
  isSuperAdmin: boolean = false;
  showpublishConfirmPopup: boolean = false;
  discardpublishConfirmPopup: boolean = false;
  messsageResult: string = '';
  lblheader: string = 'Cognizant Neuro HR - Admin Portal';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private messageService: MessageService,
    private adminServices: AdminServicesService
  ) {}

  ngOnInit(): void {
    // console.log(this.activatedRoute.snapshot.queryParams['planType']);
    if (this.activatedRoute.snapshot.queryParams['planType'] != undefined) {
      //this.showPublishBtn = true;
      this.templateType = this.activatedRoute.snapshot.queryParams['planType'];
    }

    if (this.activatedRoute.snapshot.queryParams['planid'] != undefined) {
      this.planId = this.activatedRoute.snapshot.queryParams['planid'];
      this.getAPTemplateDetails();
    }

    var res = this.activatedRoute.snapshot.queryParams['step'];

 
    let appData: any = this.tokenStorage.getAppData();  

    if (appData.proxiedUser == undefined && appData.currentUser.roleType == 'Super Admin') {
      this.isSuperAdmin = true;
      this.showEditBtn = true;
      this.lblheader = 'Cognizant Neuro HR - Super Admin Portal';
    }


    if (appData.proxiedUser != undefined) {
      if (appData.proxiedUser.roleType == 'Super Admin') {
        this.isSuperAdmin = true;
        this.showEditBtn = true;
        this.lblheader = 'Cognizant Neuro HR - Super Admin Portal';
      }
    }

    //if (this.templateType == 'CreateTemplate') {
    //  this.planType = 'New assimilation plan ';
    //  this.planName = 'New assimilation plan ';
    //  this.planDescription = 'Write a description about new plan';
    //  this.createplanvisible = true;
    //} else if (this.templateType == 'CopiedPlanTemplate') {
    //  this.createplanvisible = true;
    //}
  }

  viewPlanTitleValidation() {

    if (this.planName_temp == '') {
      this.isPlantitle = true;
    } else {
      this.isPlantitle = false;
    }

    this.planName_temp = this.planName_temp.replace(/</gi, '');
    this.planName_temp = this.planName_temp.replace(/>/gi, '');
    this.planName_temp = this.planName_temp.replace('script', '');
    this.planName_temp = this.planName_temp.replace(/\//gi, '');
    this.planName_temp = this.planName_temp.replace(/\\/gi, '');
    this.planName_temp = this.planName_temp.replace('(', '');
    this.planName_temp = this.planName_temp.replace(')', '');
    this.planName_temp = this.planName_temp.replace(/!/gi, '');
    this.planName_temp = this.planName_temp.replace(/@/gi, '');
    this.planName_temp = this.planName_temp.replace(/#/gi, '');
    this.planName_temp = this.planName_temp.replace('$', '');
    this.planName_temp = this.planName_temp.replace(/%/gi, '');
    this.planName_temp = this.planName_temp.replace('^', '');  
    this.planName_temp = this.planName_temp.replace('*', '');   
    this.planName_temp = this.planName_temp.replace('-', '');
    this.planName_temp = this.planName_temp.replace('+', '');
    this.planName_temp = this.planName_temp.replace('=', '');
    this.planName_temp = this.planName_temp.replace(/{/gi, '');
    this.planName_temp = this.planName_temp.replace(/}/gi, '');
    this.planName_temp = this.planName_temp.replace('[', '');
    this.planName_temp = this.planName_temp.replace(']', '');
    this.planName_temp = this.planName_temp.replace(/|/gi, '');
    this.planName_temp = this.planName_temp.replace(/:/gi, '');
    this.planName_temp = this.planName_temp.replace(/;/gi, '');
    this.planName_temp = this.planName_temp.replace(/'/gi, '');
    this.planName_temp = this.planName_temp.replace(/"/gi, '');
    this.planName_temp = this.planName_temp.replace(',', '');
    this.planName_temp = this.planName_temp.replace('.', '');
    this.planName_temp = this.planName_temp.replace('?', '');  

    if (this.planName_temp.length > 38) {
      this.isPlanTitleLength = true;
    }
    else {
      this.isPlanTitleLength = false;
    }

    this.isTemplateExists = false;
  }

  viewPlanDescriptionValidation() {

    if (this.planDescription_temp == '') {
      this.isPlanDescription = true;
    } else {
      this.isPlanDescription = false;
    }

    this.planDescription_temp = this.planDescription_temp.replace(/</gi, '');
    this.planDescription_temp = this.planDescription_temp.replace(/>/gi, '');
    this.planDescription_temp = this.planDescription_temp.replace('script', '');
    this.planDescription_temp = this.planDescription_temp.replace(/\//gi, '');
    this.planDescription_temp = this.planDescription_temp.replace(/\\/gi, '');   
    this.planDescription_temp = this.planDescription_temp.replace(/@/gi, '');
    this.planDescription_temp = this.planDescription_temp.replace(/#/gi, '');
    this.planDescription_temp = this.planDescription_temp.replace('$', '');
    this.planDescription_temp = this.planDescription_temp.replace(/%/gi, '');
    this.planDescription_temp = this.planDescription_temp.replace('^', '');  
    this.planDescription_temp = this.planDescription_temp.replace('*', ''); 
    this.planDescription_temp = this.planDescription_temp.replace('-', '');
    this.planDescription_temp = this.planDescription_temp.replace('+', '');
    this.planDescription_temp = this.planDescription_temp.replace('=', '');
    this.planDescription_temp = this.planDescription_temp.replace(/{/gi, '');
    this.planDescription_temp = this.planDescription_temp.replace(/}/gi, '');
    this.planDescription_temp = this.planDescription_temp.replace('[', '');
    this.planDescription_temp = this.planDescription_temp.replace(']', '');
    this.planDescription_temp = this.planDescription_temp.replace(/|/gi, '');
    this.planDescription_temp = this.planDescription_temp.replace(/"/gi, '');
    this.planDescription_temp = this.planDescription_temp.replace(/:/gi, '');
    this.planDescription_temp = this.planDescription_temp.replace(/;/gi, '');     
    this.planDescription_temp = this.planDescription_temp.replace('?', '');

    if (this.planDescription_temp.length > 48) {
      this.isPlansDescriptionLength = true;
    }
    else {
      this.isPlansDescriptionLength = false;
    }


  }

  showSave() {
    this.showPublishBtn = true;
  }

  toggle() {
    //this.activesave = !this.activesave;
    //this.showcreateicon = true;
  }

  editMode() {
    this.showPublishBtn = true;
    this.showEditBtn = false;
    this.assimilationPlanDetails.info.tag = 'In progress';
  }

  publishMode() {
    this.showPublishBtn = false;
    this.showEditBtn = true;
    this.assimilationPlanDetails.info.tag = 'Active';


    this.messsageResult = 'success';
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'The modifications done to the assimilation plan have been successfully saved.The modifications will be applicable for the employees joining from next day.',
    });

  }


  publishTemplate() {   

    console.log(this.assimilationPlanDetails);
    if (      
      this.assimilationPlanDetails.assignPlan.countries.length > 0 &&
      this.assimilationPlanDetails.assignPlan.serviceLines.length > 0 &&
      this.assimilationPlanDetails.welcomeEmail.length > 0 &&
      this.assimilationPlanDetails.welcomeEmail[0].message != '' &&
      this.assimilationPlanDetails.welcomeEmail[0].subject != '' &&
      this.assimilationPlanDetails.welcomeEmail[0].supportContactEmail != '' &&
      this.assimilationPlanDetails.milestones.length > 0 &&
      this.assimilationPlanDetails.milestones[0].taskDetails.length > 0 &&
      this.assimilationPlanDetails.inductionContent.length > 0 &&
      this.assimilationPlanDetails.managerTasks.length > 0
    ) {
      this.adminServices
        .publishPlan(this.assimilationPlanDetails.info.planId)
        .subscribe((resp: any) => {
        
          console.log(resp);
           this.showpublishConfirmPopup = false;
          // todo: obj should be returned
          if (resp == 1) {

            this.messsageResult = 'success';
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail:  'The modifications done to the assimilation plan have been successfully saved & published ',
            });

            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() =>
                this.router.navigate(['admin/assimilation-plan-details'], {
                  queryParams: { planid: this.planId },
                })
              );
          }

          if (resp != 1) {
            this.messsageResult = 'failure';
            this.messageService.add({
              severity: 'failure',
              summary: 'Failure',
              detail:
                'The modifications is not done to the assimilation plan',
            });

          }



        });
    } else {
      this.showPublishMandatoryAlert = true;
    }
  }

  copyCurrentActivePlan() {
    this.adminServices
      .copyPlan(this.assimilationPlanDetails.info.planId)
      .subscribe((resp: any) => {
        console.log(resp);
        if (this.planId != resp) {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() =>
              this.router.navigate(['admin/assimilation-plan-details'], {
                queryParams: { planid: resp, planType: 'CopiedPlanTemplate' },
              })
            );
        }
      });
  }

  showCreateDialog() {
    this.createplanvisible = true;
  }

  getAPTemplateDetails() {
    this.adminServices
      .getAPTemplates(this.planId)
      .subscribe((response: any) => {
        console.log(response);

        if (response && response.length > 0) {
          this.assimilationPlanDetails.info = response[0];
          this.planType = response[0].isDefault ? 'Default' : '';
          this.planName = this.planName_temp = response[0].planTitle;
          this.planDescription = this.planDescription_temp =
            response[0].planDescription;
          this.showcreateicon = response[0].tag != 'Active' ? true : false;
          //this.showPublishBtn = response[0].tag != 'Active' ? true : false;
          this.showMakeACopyBtn = response[0].tag != 'Draft in progress' ? true : false;
          this.planId = this.assimilationPlanDetails.info.planId;
        }
      });
  }

  navClick(liItem: any) {
    this.selectedNavItem = liItem;

    this.showAssgnPlan = false;
    this.showWelcomeEmail = false;
    this.showMilestoneTasks = false;
    this.showInductionSelf = false;
    this.showManagerTasks = false;

    if (liItem == '01') {
      this.showAssgnPlan = true;
    }

    if (liItem == '02') {
      this.showWelcomeEmail = true;
    }

    if (liItem == '03') {
      this.showMilestoneTasks = true;
    }

    if (liItem == '04') {
      this.showInductionSelf = true;
    }

    if (liItem == '05') {
      this.showManagerTasks = true;
    }
  }

  cancel() {
    this.createplanvisible = false;

    if (this.templateType == 'CreateTemplate' && !this.isSaveClicked) {
      this.router.navigate(['admin'], { queryParams: { view: 'apt' } });
    }
  }

  save() {

    if (this.planName_temp == '') {
      this.isPlantitle = true;
    }

    if (this.planDescription_temp == '') {
      this.isPlanDescription = true;
    }

    if (this.planName_temp.length > 38) {
      this.isPlanTitleLength = true;
    }

    if (this.planDescription_temp.length > 48) {
      this.isPlansDescriptionLength = true;
    }

    if (this.isPlantitle == true || this.isPlanDescription == true || this.isPlanTitleLength == true || this.isPlansDescriptionLength == true) {
      return;
    }

    let planInfo = {
      planId: this.planId,
      planTitle: this.planName_temp,
      planDescription: this.planDescription_temp,
    };

    this.isSaveClicked = true;

    this.adminServices.saveAPTitle(planInfo).subscribe((resp: any) => {
      console.log('saveAPTitle', resp);

      if (resp == -100) {
        this.isTemplateExists = true;
        this.createplanvisible = true;
        this.isSaveClicked = false;
        return;
      }

      this.planName = this.planName_temp;
      this.planDescription = this.planDescription_temp;

      this.isSaveClicked = false;
      this.createplanvisible = false;

      if (this.planId != resp) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(['admin/assimilation-plan-details'], {
            queryParams: { planid: resp },
          })
        );
      }
    });
  }

  discardChange() {

    if (this.showPublishBtn == true) {
      this.discardpublishConfirmPopup = true;     
    }

    if (this.showPublishBtn == false) {    
      this.router.navigate(['/admin'], {
        queryParams: { view: 'apt' },
      })
    }   
  }


  discardChangeConfirm() {

    if (this.showPublishBtn == true) {
      this.discardpublishConfirmPopup = true;

      this.router.navigate(['/admin'], {
        queryParams: { view: 'apt' },
      })
    }

    if (this.showPublishBtn == false) {
      this.router.navigate(['/admin'], {
        queryParams: { view: 'apt' },
      })
    }
  }

  setPreviousTask(value: any) {
    this.navClick(value);
  }

  setNextTask(value: any) {
    this.navClick(value);
  }



}
