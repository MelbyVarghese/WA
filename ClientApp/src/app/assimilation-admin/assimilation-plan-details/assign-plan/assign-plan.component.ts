import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { AdminServicesService } from '../../admin-services.service';
import { TokenStorageService } from '../../../@core/services/token-storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-assign-plan',
  templateUrl: './assign-plan.component.html',
  styleUrls: ['./assign-plan.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignPlanComponent implements OnChanges {
  @Input() IsSaveButton: any;
  // @Input() planType: any;
  @Input() planId: any;
  @Input() assimilationPlanDetails: any;
  @Output() assimilationPlanDetailsChange = new EventEmitter<any>();
  @Output() nextTaskEvent = new EventEmitter<string>();

  grades: any = [];
  selected_Grades: any = [];
  serviceLines: any = [];
  selected_serviceLines: any = [];
  geographies: any = [];
  selected_geographies: any = [];
  loj: any = [];
  selected_loj: any = [];
  //planEffectiveDate: Date | undefined = undefined;
  planEffectiveDate: any;
  apDetailsMapId: number = 0;
  showsavebtn: boolean = false;
  isDisabled: boolean = false;
  canEdit: boolean = false;
  nextday: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private adminServices: AdminServicesService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    
    console.log('changes = ', changes);   
    if (changes.planId != undefined && !changes.planId.firstChange) {
      this.getAssignPlan();
      //this.canEdit = this.assimilationPlanDetails.info.tag != 'Active';
    }

    if (changes.IsSaveButton != undefined && !changes.IsSaveButton.firstChange) {     
      this.canEdit = false;
    }

 
    var today = new Date();
    this.nextday = new Date(today);
    this.nextday.setDate(today.getDate() + 1);
  }

  ngOnInit(): void {
    // console.log(this.assimilationPlanDetails);
    console.log('IsSaveButton = ' + this.IsSaveButton);
    // console.log('planType = ' + this.planType);

    // this.planEffectiveDate?.setDate(31);
    // this.planEffectiveDate?.setMonth(1);
    // this.planEffectiveDate?.setFullYear(2024);

    this.getMasterlist();

    // if (this.IsSaveButton == true && this.planType == 'CreateTemplate') {
    //   this.clearItems();
    // }

    //if (this.IsSaveButton == true) {
    //  this.canEdit = true;
    //}


  }


  //getMasterlist() {
  //  // this.adminServices.getMasterList().subscribe((list) => {
  //  this.adminServices.getMasterList$.subscribe((response) => {
  //    console.log(response);
  //    this.grades = response.grades;
  //    this.serviceLines = response.serviceLines;
  //    this.geographies = response.countries;
  //    this.loj = response.cities;
  //    this.cdr.detectChanges();
  //  });
  //}
  getMasterlist() {
    // this.adminServices.getMasterList().subscribe((list) => {
    this.adminServices.getMasterList().subscribe((response: any) => {
      console.log(response);
      this.grades = response.grades;
      this.serviceLines = response.serviceLines;
      this.geographies = response.countries;
      this.loj = response.cities;
      this.cdr.detectChanges();
    });
  }

  getAssignPlan() {
    console.log('getAssignPlan', this.assimilationPlanDetails.info.planId);
    this.adminServices
      // .getAssignPlan(this.assimilationPlanDetails.info.planId)
      .getAssignPlan(this.planId)
      .subscribe((response: any) => {
     
        console.log('getAssignPlan', response);     

        this.assimilationPlanDetails.assignPlan = response;      

        if (response.assignPlans != null && response.assignPlans.length > 0) {
          this.assimilationPlanDetails.info.planEffDate = response.assignPlans[0].effectiveDate;
        }      

        this.assimilationPlanDetailsChange.emit(this.assimilationPlanDetails);
        
        this.selected_Grades = response.grades;
        this.selected_serviceLines = response.serviceLines;
        this.selected_geographies = response.countries;
        this.selected_loj = response.cities;

       // this.planEffectiveDate = new Date(this.assimilationPlanDetails.info.planEffDate);
        this.planEffectiveDate = new Date(response.effectiveDate);
        this.apDetailsMapId = response.apDetailsMapId;
       
        this.cdr.detectChanges();

        // if (this.IsSaveButton == true && this.planType == 'CreateTemplate') {
        //   this.clearItems();
        // }
      });
  }

  saveAssignPlan() {
   
    const datepipe: DatePipe = new DatePipe('en-US');

    var FormatedplanEffectiveDate = new Date(this.planEffectiveDate);
    FormatedplanEffectiveDate = new Date(new Date(FormatedplanEffectiveDate).setHours(FormatedplanEffectiveDate.getHours() + 6));


    let assignPlanInfo = {
      // EffectiveDate: datepipe.transform(
      //   this.planEffectiveDate,
      //   'YYYY-MM-dd 00:00:00'
      // ),

      APDetailsMapId: this.apDetailsMapId,

      EffectiveDate: FormatedplanEffectiveDate,
      //GradeIds: Array.prototype.map
      //  .call(this.selected_Grades, function (item) {
      //    return item.gradeId;
      //  })
      //  .join(','),
      ServiceLineIds: Array.prototype.map
        .call(this.selected_serviceLines, function (item) {
          return item.serviceLineId;
        })
        .join(','),
      CountryIds: Array.prototype.map
        .call(this.selected_geographies, function (item) {
          return item.countryId;
        })
        .join(','),
      //CityIds: Array.prototype.map
      //  .call(this.selected_loj, function (item) {
      //    return item.cityId;
      //  })
      //  .join(','),
    };

    if ( assignPlanInfo.CountryIds == '' || assignPlanInfo.ServiceLineIds == '' || Number.isNaN(assignPlanInfo.EffectiveDate.getMonth()) ) {
      return;
    }

   
    this.adminServices
      .saveAssignPlan(assignPlanInfo, this.assimilationPlanDetails.info.planId)
      .subscribe((res: any) => {
        console.log('saveAssignPlan', res);

        this.getAssignPlan();
      });

  }

  getFilterStyles() {
    if (this.canEdit) {
      return { 'background-color': '#2F78C4', color: '#FFF' };
    } else {
      return {
        'background-color': '#FFF',
        'border-color': '#97999B',
        'border-width': '2px',
        'border-style': 'ridge',
        color: '#97999B',
      };
    }
  }

  getStarStyle() {
    if (this.canEdit) {
      return { color: 'red' };
    } else {
      return { color: 'black' };
    }
  }

  getDropdownStyles() {
    if (this.canEdit) {
      return { 'background-color': '#F2F2F2' };
    } else {
      return { 'background-color': '#D0D0CE' };
    }
  }

  getFilterButtonStyles() {
    if (this.canEdit) {
      return {
        'border-radius': '3.125rem',
        border: '0px solid #2F78C4',
        width: '22.25rem',
        padding: '0.75rem 1.5rem',
        'justify-content': 'center',
        'align-items': 'center',
        gap: '0.5rem',
        'margin-top': '0.938rem',
        'background-color': 'white',
        'border-color': '#6aa2dc',
        'border-width': '2px',
        'border-style': 'ridge',
        color: '#6aa2dc',
        'font-weight': 600,
        'font-family': 'Gellix',
      };
    } else {
      return {
        'border-radius': '3.125rem',
        border: '0px solid #2F78C4',
        width: '22.25rem',
        padding: '0.75rem 1.5rem',
        'justify-content': 'center',
        'align-items': 'center',
        gap: '0.5rem',
        'margin-top': '0.938rem',
        'background-color': '#D0D0CE',
        color: '#000048',
        'font-weight': 600,
        'font-family': 'Gellix',
      };
    }
  }

  removeCategoryItem(catetory: any, catitem: any) {
    if (catetory == 'Grade') {
      this.selected_Grades = this.selected_Grades.filter(
        (item: any) => item.gradeDesc !== catitem
      );
    }

    if (catetory == 'ServiceLine') {
      this.selected_serviceLines = this.selected_serviceLines.filter(
        (item: any) => item.serviceLineDesc !== catitem
      );
    }

    if (catetory == 'Geography') {
      this.selected_geographies = this.selected_geographies.filter(
        (item: any) => item.countryDesc !== catitem
      );
    }

    if (catetory == 'LocationOfJoining') {
      this.selected_loj = this.selected_loj.filter(
        (item: any) => item.cityDesc !== catitem
      );
    }

    if (catetory == 'PlanEffectiveDate') {
      this.planEffectiveDate = undefined;
      // this.planEffectiveDate = new Date();
    }
  }

  clearItems() {
    this.selected_Grades = [];
    this.selected_serviceLines = [];
    this.selected_geographies = [];
    this.selected_loj = [];
    this.planEffectiveDate = undefined;
  }

  nextStep(value: any) {
    this.nextTaskEvent.emit(value);
  }
}
