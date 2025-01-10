import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Duration, DurationPeriod } from './edit-milestone-model';
import { AdminServicesService } from '../../admin-services.service';

@Component({
  selector: 'app-edit-milestone',
  templateUrl: './edit-milestone.component.html',
  styleUrls: ['./edit-milestone.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditMilestoneComponent {
  @Input() displayMilestoneContentPopup = false;
  @Input() milestoneInfo: any;
  @Input() planId: any;
  @Output() closeMilestoneContentPopup = new EventEmitter<any>();

  durations: any = [];
  selected_duration: any;
  durationPeriods: any = [];
  weekdurationPeriods: any = [];
  monthdurationPeriods: any = [];
  selected_durationPeriod: any = [];
  period: string = 'Day to Day';
  msName: string = '';
  milestonebanner: string = '';
  showmilestionevalidation: boolean = false;
  showbannervalidation: boolean = false;

  myform!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private adminServices: AdminServicesService
  ) {
    this.selected_duration = { durationDesc: '', durationId: 0 };
    this.selected_durationPeriod = { durationCalDesc: '', durationCalId: 0 };

    //this.selected_duration = { name: '' };
    //this.selected_durationPeriod = { name: '', value: '' };
  }

  ngOnInit(): void {
    console.log(this.milestoneInfo);

    //this.createForm();

    this.selected_duration.durationId = this.milestoneInfo.DurationId;
    this.selected_duration.durationDesc = this.milestoneInfo.durationDesc;
    this.selected_durationPeriod.durationCalId =
      this.milestoneInfo.DurationCalId;
    this.selected_durationPeriod.durationCalDesc =
      this.milestoneInfo.durationCalDesc;

    this.period = this.milestoneInfo.milestonePeriod;
    this.msName = this.milestoneInfo.msName;
    this.milestonebanner = this.milestoneInfo.greetingText;

    this.getDurationDetails();
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


    this.msName =
      this.selected_duration.durationDesc +
      ' ' +
      this.selected_durationPeriod.durationCalId;
    if (this.selected_duration.durationDesc == 'Week') {
      this.period =
        'Day ' +
        (this.selected_durationPeriod.durationCalId * 7 - 6) +
        ' to Day ' +
        this.selected_durationPeriod.durationCalId * 7;

      this.milestoneInfo.startDay =
        this.selected_durationPeriod.durationCalId * 7 - 6;
      this.milestoneInfo.endDay =
        this.selected_durationPeriod.durationCalId * 7;
    }

    if (this.selected_duration.durationDesc == 'Month') {
      this.period =
        'Day ' +
        (this.selected_durationPeriod.durationCalId * 30 - 29) +
        ' to Day ' +
        this.selected_durationPeriod.durationCalId * 30;

      this.milestoneInfo.startDay =
        this.selected_durationPeriod.durationCalId * 30 - 29;
      this.milestoneInfo.endDay =
        this.selected_durationPeriod.durationCalId * 30;
    }
  }

  save() {
    this.showmilestionevalidation = false;
    this.showbannervalidation = false;

    if (this.msName == '') {
      this.showmilestionevalidation = true;
    }

    if (this.milestonebanner == '') {
      this.showbannervalidation = true;
    }

    if (
      this.showmilestionevalidation == true ||
      this.showbannervalidation == true
    ) {
      return;
    }

    let milestoneInfo = {
      msId: this.milestoneInfo.msId,
      MSName: this.msName,
      GreetingText: this.milestonebanner,
      DurationId: this.selected_duration.durationId,
      DurationCalId: this.selected_durationPeriod.durationCalId,
      startDay: this.milestoneInfo.startDay,
      endDay: this.milestoneInfo.endDay,
      PlanId: this.planId,
    };

    this.adminServices.editMileStone(milestoneInfo).subscribe((repo: any) => {
      console.log('editMileStone', repo);

      if (repo.length > 0) {
        this.close();
      }
    });
  }

  close() {
    this.closeMilestoneContentPopup.emit(false);
  }
}
