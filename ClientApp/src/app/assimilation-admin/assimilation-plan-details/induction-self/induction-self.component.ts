import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { AdminServicesService } from '../../admin-services.service';

@Component({
  selector: 'app-induction-self',
  templateUrl: './induction-self.component.html',
  styleUrls: ['./induction-self.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InductionSelfComponent {
  @Input() IsSaveButton: any;
  @Input() planType: any;
  @Input() planId: any;
  @Input() assimilationPlanDetails: any;
  @Output() assimilationPlanDetailsChange = new EventEmitter<any>();
  @Output() prevTaskEvent = new EventEmitter<string>();
  @Output() nextTaskEvent = new EventEmitter<string>();

  showInductionContentPopup: boolean = false;
  selectedInductionContent: any = {};
  viewType: string = '';

  contents: any = [];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private adminServices: AdminServicesService
  ) {}

  ngOnInit(): void {
    console.log('planType = ' + this.planType);

    this.getInductionContent();

    //if(this.planType == 'defaultTemplate') {
    // this.getInductionContent();
    //}
  }

  getInductionContent() {
    this.adminServices
      .getInductionContent(this.planId)
      .subscribe((response: any) => {
        console.log('getInductionContent', response);
        this.assimilationPlanDetails.inductionContent = response;
        this.assimilationPlanDetailsChange.emit(this.assimilationPlanDetails);
        this.contents = response;
        this.cdr.detectChanges();
      });
  }

  deleteInductionContent(indContentId: any) {
    this.adminServices
      .deleteInductionContent(indContentId)
      .subscribe((respo: any) => {
        console.log('deleteInductionContent', respo);

        if (respo == '1') {
          this.getInductionContent();
        }
      });
  }

  prevStep(value: any) {
    this.prevTaskEvent.emit(value);
  }

  nextStep(value: any) {
    this.nextTaskEvent.emit(value);
  }

  setInfo() {
    this.selectedInductionContent = {
      contentName: '',
      contentDescription: '',
      contentFilename: '',
      contentFile: '',
      contentLink: '',
    };

    return this.selectedInductionContent;
  }

  showContentPopup(value: any) {
    this.viewType = value;
    this.showInductionContentPopup = true;
  }

  closeContentPopup() {
    this.getInductionContent();
    this.showInductionContentPopup = false;
  }
}
