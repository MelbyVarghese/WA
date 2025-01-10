import {
  Component,
  Inject,
  LOCALE_ID,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, forEach, join, map } from 'lodash-es';
import { saveAs } from 'file-saver-es';
import { AdminServicesService } from './admin-services.service';
import { TokenStorageService } from '../@core/services/token-storage.service';
import { DatePipe, formatDate } from '@angular/common';
import { MessageService } from 'primeng/api';

import * as XLSX from 'xlsx';
import * as _ from 'lodash';


type AOA = any[][];

@Component({
  selector: 'app-assimilation-admin',
  templateUrl: './assimilation-admin.component.html',
  styleUrls: ['./assimilation-admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AssimilationAdminComponent {
  myform!: FormGroup;
  inductionContentInfo: any = {
    contentfilename: '',
  };

  attentancefilename: string = '';
  taskstatusfilename: string = '';
  assigntoadminfilename: string = '';
  messsageResult: string = 'success';

  aptClicked = false;
  akdClicked = false;
  paClicked = false;
  umClicked = false;
  showSetCorpIndConf = false;
  showSetAssgntoAdmin = false;
  showSetAssgntoSuperAdmin = false;
  showSetAssgntoAdminValidationMsg: string = '';
  showUploadAttendance: boolean = false;
  showUploadtaskstatus: boolean = false;
  showUploadAttendanceValidationMsg: string = '';
showUploadtaskstatusValidationMsg: string = '';
  showAssigntoAdmin: boolean = false;
  showAssigntoAdminValidationMsg: string = '';
  showReAssignPlan: boolean = false;
  showReAssignPlanValidationMsg: string = '';
  showAssociateResourceDialog: boolean = false;
  showMakeAdminRoleType: boolean = false;
  showMakeSuperAdmin: boolean = false;
  showRemoveUser: boolean = false;
  isSuperAdmin: boolean = false;
  //newHireIds: any = [];
  defaultAssignPlan: any = [];
  isAdmin: boolean = false
  isAdminLogin: boolean = false;
  isAdminAssignplanLogin: boolean = false;
  isDefaultplan: boolean = false;
  isSuperAdminLogin: boolean = false;
  selectedAdmin: string = 'Assign to Me';
  selectedAssign: any = 'Assign to Me';
  AssigntoMechecked: boolean = false;
  AssigntoOtherchecked: boolean = false;
  BothAssignchecked: boolean = false;
  lblheader: string = 'New 2 Cognizant Dashboard - Admin Portal';
  showLoader: boolean = false;
  selectedAIPFilters: any = {
    grade: [],
    serviceLine: [],
    country: [],
    city: [],
    vertical: [],
    dojRange: undefined,
    ageing: [],
  };
  selectedPAFilters: any = {
    grade: [],
    serviceLine: [],
    country: [],
    city: [],
    vertical: [],
    dojRange: undefined,
    ageing: [],
  };
  selected_Grades: any = [];
  selected_serviceLines: any = [];
  selected_geographies: any = [];
  selected_loj: any = [];
  selected_vertical: any = [];
  selected_daysRemaining: any = [];
  pendingAssimilations: any = [];
  selected_pendingAssimilations: any = [];
  selected_processAssimilations: any = [];
  processAssimilations: any = [];
  downloadedAssimilations: any = [];
  associateDocuments: any = [];
  selected_newHireIDs: any = [];
  selected_associateDocuments: any = [];
  users: any = [];
  selected_users: any = [];
  adminID_value: number = 0;
  adminID_value1: number = 0;
  masterPlantemplates: any = [];
  plantemplates: any = [];
  loading: boolean = true;
  dialogVisible: boolean = false;
  activeIndex: number = 0;
  assimilation_index: number = 0;
  tabviewcolor: string = 'white';
  searchvalue: any;
  searchTemplate: string = '';
  searchColumn: string = '';
  showFilter: boolean = false;
  showFilteredList: boolean = false;
  showPAFilter: boolean = false;
  showPAFilterList: boolean = false;
  rangeDates: Date[] | undefined;
  selectedAssociate: any = {};
  columnFilterOptions: any = [];
  pendingColumnFilterOptions: any = [];
  assignPlanList: any = [];
  columnFilterSelectedOptions: any = {
    employeeId: {},
    associateName: {},
    accountName: {},
    grade: {},
    country: {},
    city: {},
    dateOfJoiningText: {},
    ongoingMilestones: {},
    inductionDate: {},
    remaining: {},
    vertical: {},
    serviceLine: {},
    ageing: {},
    corp_induction: {},
    assignedPlan: {},
    projectName: {},
    welcomeMailStatus: {},
    role: {},
    facilitatorId: {},
    managerConnectStatus: {},
    hireType: {},
    adminPoC: {},
    adminPoCName: {},
    monthOfJoiningText: {},

  };
  pendingAssiColumnFilterSelectedOptions: any = {
    candidateId: {},
    associateName: {},
    remaining: {},
    remainingText: {},
    DateofJoining: {},
    dateOfJoiningText: {},
    MonthofJoining: {},
    monthOfJoiningText: {},
    grade: {},
    country: {},
    city: {},
    vertical: {},
    serviceLine: {},
    corp_induction: {},
  };

  //newHireIds!: any[];
  selectedFilterOptions: any = {
    grade: '',
    serviceLine: '',
    city: '',
    country: '',
    ageing: '',
    vertical: '',
    fromDate: '',
    toDate: '',
  };
  masterList: any = {};
  selectedPlanTemplate: any = {};
  activeMainTabIndex: number = 0;
  activeSubTabIndex: number = 0;
  activeSettingsSubTabIndex: number = 0;
  sessiontaskNames: any = [];
  deleteAPIparams: any = {
    deletePlanId: 0,
  };

  mastercolstoggle!: any[];
  colstoggle!: any[];
  tempcolstoggle!: any[];
  tempassignplancolstoggle!: any[];
  selectedColumns!: any[];

  showAssociateAssimilationPopup: boolean = false;
  showConfigureMailPopup: boolean = false;
  deletePlanId: any;
  balanceFrozen: boolean = false;

  showUploadNewResourcePopup: boolean = false;
  showAddUser: boolean = false;

  selectedFile!: File;
  filewarning: string = '';
  showfilewarning: boolean = false;
  showFileValidation: boolean = false;
  showTaskStatusFileValidation: boolean = false;
  showFileLinkValidation: boolean = false;

  IsAgeing: boolean = false;
  Iscorp_induction: boolean = false;
  corpSubject: string = 'Meet and Greet Session ';
  corpdate: any;
  corpmindate = new Date();
  starttimeValue: string = '';
  endtimeValue: string = '';
  corpvalidationMsg: string = '';

  userIDs = '';
  verifiedUserIDs: any = [];
  newRoleType: string = 'Admin';
  selectedUser: any = {};

  storeData: any;
  storeDataAgn: any;
  storeDatatask: any;
  attentanceExcelData: any;
  taskstatusExcelData: any;
  assignAdminExcelData: any;
  fileUploaded!: File;
  fileUploadedTask!: File;
  worksheet: any;
  worksheetagn: any;
  worksheetask: any;
  selectedsessiontask: any;
  documentToDelete: any = {};

  data: AOA = [
    [1, 2],
    [3, 4],
  ];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  locationWidth: string = '92px';
  projectnameWidth: string = '127px';
  welcomeEmailWidth: string = '127px';
  corpInductionWidth: string = '135px';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private adminServices: AdminServicesService,
    private tokenStorage: TokenStorageService, private cdr: ChangeDetectorRef, private messageService: MessageService,
    @Inject(LOCALE_ID) private locale: string, private datePipe: DatePipe) {

    this.corpmindate.setDate(new Date().getDate() + 1);
  }

  ngOnInit(): void {

    this.showLoader = true;

    this.IsAgeing = false;
    this.selectedAdmin = 'Assign to Me';

    //this.createForm();

    if (
      this.activatedRoute.snapshot.queryParams['view'] != undefined &&
      this.activatedRoute.snapshot.queryParams['view'] == 'apt'
    ) {
      this.activeMainTabIndex = 1;
      this.getAPTemplates();
    }

    //this.columnFilterOptions.corp_induction = [
    //  { name: 'Set' },
    //  { name: 'Not set' },
    //];

    this.columnFilterOptions.corp_induction = [];

    this.columnFilterOptions.assignedPlan = [];

    this.columnFilterOptions.welcomeMailStatus = [
      { name: 'Sent' },
      { name: 'Not Sent' },
    ];

    //let defaultAssignPlan = this.processAssimilations.assignedPlan;

    //for (var i = 0; i < this.processAssimilations.assignedPlan.length; i++) {
    //  if (this.processAssimilations.assignedPlan = 'Default Plan') {
    //    defaultAssignPlan = this.processAssimilations.assignedPlan;
    //  }

    //}
    this.columnFilterOptions.employeeId = [];
    this.columnFilterOptions.associateName = [];
    this.columnFilterOptions.accountName = [];
    this.columnFilterOptions.role = [
      { name: 'Admin' },
      { name: 'Super Admin' },
    ];
    this.columnFilterOptions.dateOfJoiningText = [];
    this.columnFilterOptions.monthOfJoiningText = [];
    this.columnFilterOptions.ongoingMilestones = [];
    this.columnFilterOptions.ageing = [];
    this.columnFilterOptions.serviceLineType = [
      { serviceLineDesc: 'N2C IOA' },
      { serviceLineDesc: 'N2C Tech' },
      { serviceLineDesc: 'N2C IOA, N2C Tech' },
    ];

    this.columnFilterOptions.managerConnectStatus = [
      { name: 'In Progress' },
      { name: 'Not Started' },
      { name: 'Pending' },
      { name: 'Completed' },
    ];

    this.columnFilterOptions.facilitatorId = [];
    this.columnFilterOptions.projectName = [];
    this.columnFilterOptions.hireType = [];
    this.columnFilterOptions.adminPoC = [];

    this.columnFilterOptions.inductionDate = [];
    this.columnFilterOptions.adminPoCName = [];
    this.pendingColumnFilterOptions.candidateId = [];
    this.pendingColumnFilterOptions.associateName = [];
    this.pendingColumnFilterOptions.remainingText = [];
    this.pendingColumnFilterOptions.dateOfJoining = [];
    this.pendingColumnFilterOptions.dateOfJoiningText = [];
    this.pendingColumnFilterOptions.monthOfJoining = [];
    this.pendingColumnFilterOptions.monthOfJoiningText = [];

    this.mastercolstoggle = [
      { field: 'employeeId', header: 'Emp.ID', isSelected: true },
      { field: 'associateName', header: 'Name', isSelected: true },
      { field: 'grade', header: 'Grade', isSelected: true },
      { field: 'country', header: 'Geo', isSelected: false },
      { field: 'city', header: 'Location', isSelected: true },
      { field: 'serviceLine', header: 'Service line', isSelected: false },
      { field: 'dateOfJoining', header: 'DOJ', isSelected: true },
      { field: 'monthOfJoining', header: 'MOJ', isSelected: true },
      { field: 'assignedPlan', header: 'Assigned plan', isSelected: false },
      { field: 'projectName', header: 'Project name', isSelected: true },
      { field: 'accountName', header: 'Account name', isSelected: false },
      { field: 'ongoingMilestones', header: 'Milestone', isSelected: true },
      { field: 'ageing', header: 'Ageing', isSelected: true },
      { field: 'vertical', header: 'Vertical', isSelected: false },
      { field: 'inductionDate', header: 'Induction date', isSelected: false },
      { field: 'welcomeMailStatus', header: 'Welcome mail', isSelected: true },
      { field: 'corp_induction', header: 'Corp.induction', isSelected: true },
      { field: 'facilitatorId', header: 'Facilitator Id', isSelected: false },
      {
        field: 'managerConnectStatus',
        header: 'Manager connect',
        isSelected: true,
      },

      {
        field: 'hireType',
        header: 'Hire Type',
        isSelected: true,
      },
      {
        field: 'adminPoC',
        header: 'Admin POC',
        isSelected: false,
      },
      {
        field: 'adminPoCname',
        header: 'Admin POC Name',
        isSelected: false,
      },
    
    ];

    this.colstoggle = [
      { field: 'employeeId', header: 'Emp.ID', isSelected: true },
      { field: 'associateName', header: 'Name', isSelected: true },
      { field: 'grade', header: 'Grade', isSelected: true },
      { field: 'country', header: 'Geo', isSelected: false },
      { field: 'city', header: 'Location', isSelected: true },
      { field: 'serviceLine', header: 'Service line', isSelected: false },
      { field: 'dateOfJoining', header: 'DOJ', isSelected: true },
      { field: 'monthOfJoining', header: 'MOJ', isSelected: true },
      { field: 'assignedPlan', header: 'Assigned plan', isSelected: false },
      { field: 'projectName', header: 'Project name', isSelected: true },
      { field: 'accountName', header: 'Account name', isSelected: false },
      { field: 'ongoingMilestones', header: 'Milestone', isSelected: true },
      { field: 'ageing', header: 'Ageing', isSelected: true },
      { field: 'vertical', header: 'Vertical', isSelected: false },
      { field: 'inductionDate', header: 'Induction date', isSelected: false },
      { field: 'welcomeMailStatus', header: 'Welcome mail', isSelected: true },
      { field: 'corp_induction', header: 'Corp.induction', isSelected: true },
      { field: 'facilitatorId', header: 'Facilitator Id', isSelected: false },
      {
        field: 'managerConnectStatus',
        header: 'Manager connect',
        isSelected: true,
      },
      {
        field: 'hireType',
        header: 'Hire Type',
        isSelected: true,
      },
      {
        field: 'adminPoC',
        header: 'Admin POC',
        isSelected: false,
      },
      {
        field: 'adminPoCname',
        header: 'Admin POC Name',
        isSelected: false,
      },
      
    ];

    this.tempassignplancolstoggle = [
      { field: 'assignedPlan', header: 'Assigned plan', isSelected: false },
    ];



    this.tempcolstoggle = [
      { field: 'employeeId', header: 'Emp.ID', isSelected: true },
      { field: 'associateName', header: 'Name', isSelected: true },
      { field: 'grade', header: 'Grade', isSelected: true },
      { field: 'country', header: 'Geo', isSelected: false },
      { field: 'city', header: 'Location', isSelected: true },
      { field: 'serviceLine', header: 'Service line', isSelected: false },
      { field: 'dateOfJoining', header: 'DOJ', isSelected: true },
      { field: 'monthOfJoining', header: 'MOJ', isSelected: true },
      { field: 'assignedPlan', header: 'Assigned plan', isSelected: false },
      { field: 'projectName', header: 'Project name', isSelected: true },
      { field: 'accountName', header: 'Account name', isSelected: false },
      { field: 'ongoingMilestones', header: 'Milestone', isSelected: true },
      { field: 'ageing', header: 'Ageing', isSelected: true },
      { field: 'vertical', header: 'Vertical', isSelected: false },
      { field: 'inductionDate', header: 'Induction date', isSelected: false },
      { field: 'welcomeMailStatus', header: 'Welcome mail', isSelected: true },
      { field: 'corp_induction', header: 'Corp.induction', isSelected: true },
      { field: 'facilitatorId', header: 'Facilitator Id', isSelected: false },
      {
        field: 'managerConnectStatus',
        header: 'Manager connect',
        isSelected: true,
      },
      {
        field: 'hireType',
        header: 'Hire Type',
        isSelected: true,
      },
      {
        field: 'adminPoC',
        header: 'Admin POC',
        isSelected: true,
      },
      {
        field: 'adminPoCname',
        header: 'Admin POC Name',
        isSelected: true,
      },
      
    ];

    this.adminServices.getMasterList().subscribe((list: any) => {
      console.log(list);
      this.masterList = list;
    });

   
    this.getAssimilationInProgressList();

    let appData: any = this.tokenStorage.getAppData();

    console.log('proxiedUser check on appData = ', appData);

    if (appData.proxiedUser == undefined && appData.currentUser.roleType == 'Super Admin') {
      this.isSuperAdmin = true;
      this.lblheader = 'New 2 Cognizant Dashboard - Super Admin Portal';
    }


    if (appData.proxiedUser != undefined) {
      if (appData.proxiedUser.roleType == 'Super Admin') {
        this.isSuperAdmin = true;
        this.lblheader = 'New 2 Cognizant Dashboard - Super Admin Portal';
      }
    }

    if (appData.proxiedUser != undefined) {
      if (appData.proxiedUser.roleType == 'Admin') {
        this.isAdminLogin = true;
        this.isAdminAssignplanLogin = true;
        this.lblheader = 'New 2 Cognizant Dashboard - Admin Portal';
      }
    }

    setTimeout(() => {
      this.showLoader = false;
    }, 2000);
  }

  //FileChange(evt: any) {
  //  /* wire up file reader */
  //  const target: DataTransfer = <DataTransfer>(evt.target);
  //  if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  //  const reader: FileReader = new FileReader();
  //  reader.onload = (e: any) => {f
  //    /* read workbook */
  //    const bstr: string = e.target.result;
  //    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

  //    /* grab first sheet */
  //    const wsname: string = wb.SheetNames[0];
  //    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

  //    /* save data */
  //    this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
  //    console.log(this.data);
  //  };
  //  reader.readAsBinaryString(target.files[0]);
  //}

  setColumn() {

    this.searchColumn = '';

    this.tempcolstoggle = [];

    for (let i = 0; i < this.colstoggle.length; i++) {
      let temp = {
        field: this.colstoggle[i].field,
        header: this.colstoggle[i].header,
        isSelected: this.colstoggle[i].isSelected,
      };

      this.tempcolstoggle.push(temp);
      console.log("Customize" + this.colstoggle[i].header);

    }

    this.cdr.detectChanges();
  }


  ViewAssignToMe() {
    this.AssigntoMechecked = !this.AssigntoMechecked;

    if (this.AssigntoMechecked == true && this.AssigntoMechecked == true) {
      this.BothAssignchecked = true;
    }

    if (this.AssigntoMechecked != true || this.AssigntoMechecked != true) {
      this.BothAssignchecked = false;
    }
  }

  ViewAssignToOther() {
    this.AssigntoOtherchecked = !this.AssigntoOtherchecked;

    if (this.AssigntoOtherchecked == true && this.AssigntoOtherchecked == true) {
      this.BothAssignchecked = true;
    }

    if (this.AssigntoOtherchecked != true || this.AssigntoOtherchecked != true) {
      this.BothAssignchecked = false;
    }
  }

  //ViewAssigntoBoth() {
  //  this.BothAssignchecked = !this.BothAssignchecked;

  //  if (this.BothAssignchecked == true) {
  //    this.AssigntoMechecked = true;
  //    this.AssigntoOtherchecked = true;
  //  }

  //  if (this.BothAssignchecked == false) {
  //    this.AssigntoMechecked = false;
  //    this.AssigntoOtherchecked = false;
  //  }
  //}



  searchColumns(event: any) {

    if (this.searchColumn != '') {
      this.tempcolstoggle = [];

      var searchres = this.mastercolstoggle.filter((x: any) =>
        x.header.toLowerCase().includes(this.searchColumn.toLowerCase())
      );

      for (let i = 0; i < searchres.length; i++) {
        let temp = {
          field: searchres[i].field,
          header: searchres[i].header,
          isSelected: searchres[i].isSelected,
        };

        this.tempcolstoggle.push(temp);
      }
    }

    if (this.searchColumn == '') {

      this.tempcolstoggle = [];

      for (let i = 0; i < this.mastercolstoggle.length; i++) {
        let temp = {
          field: this.mastercolstoggle[i].field,
          header: this.mastercolstoggle[i].header,
          isSelected: this.mastercolstoggle[i].isSelected,
        };

        this.tempcolstoggle.push(temp);
      }

      this.cdr.detectChanges();
    }
  }

  //getAssignPlanName() {
  //  this.tempcolstoggle = [];

  //  for (let i = 0; i < this.mastercolstoggle.length; i++) {
  //    let temp = {
  //      field: this.mastercolstoggle[i].field,
  //      header: this.mastercolstoggle[i].header,
  //      isSelected: this.mastercolstoggle[i].isSelected,
  //    };

  //    if (this.mastercolstoggle[i].field == "Assigned plan") {

  //    }

  //    this.tempcolstoggle.push(temp);
  //  }
  //}

  getColumnPosition(ptselected: any, ptheader: string) {
    var ptindex = this.mastercolstoggle.findIndex(
      (x: any) => x.header === ptheader
    );
    this.colstoggle[ptindex].isSelected = ptselected;
  }

  getToggleAdminAssignedList() {
    if (this.isAdmin == true) {
      //if (this.selectedAssign == "Assign to Me") {
      this.getFilterOptions(this.selectedAIPFilters);
      console.log(this.selectedAssign);
      this.adminServices
        .getAssimilationInProgressAdminAssignList(this.selectedFilterOptions)
        .subscribe((list) => {
          console.log(list);
          forEach(list, (item) => {
            // EO-198
            item.ageingText = item.ageing + ' Day(s)';
            item.dateOfJoiningText = formatDate(
              item.dateOfJoining,
              'dd MMM yy',
              this.locale
            );
            //item.monthOfJoiningText = formatDate(
            //  item.monthOfJoining,
            //  'MMM yy',
            //  this.locale
            //);
            item.corp_induction = item.isCorpInduction;

            let cindux = {
              name: item.corp_induction,
            };

            this.columnFilterOptions.corp_induction.push(cindux);

            let facilitatorItem = {
              name: item.facilitatorId,
            };

            this.columnFilterOptions.facilitatorId.push(facilitatorItem);

            let assignPlanItem = {
              name: item.assignPlan,
            };

            this.columnFilterOptions.assignPlan.push(assignPlanItem);


            let monthOfJoining = {
              name: item.monthofjoining,
            };

            this.columnFilterOptions.monthOfJoiningText.push(monthOfJoining);

            let pname = {
              name: item.projectName,
            };

            if (pname.name != '') {
              this.columnFilterOptions.projectName.push(pname);
            }

          });

          this.columnFilterOptions.facilitatorId =
            this.columnFilterOptions.facilitatorId.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.columnFilterOptions.projectName =
            this.columnFilterOptions.projectName.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.columnFilterOptions.corp_induction =
            this.columnFilterOptions.corp_induction.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.processAssimilations = list;
        });

    }
    else {
      this.getFilterOptions(this.selectedAIPFilters);
      console.log(this.selectedFilterOptions);
      this.adminServices
        .getAssimilationInProgressList(this.selectedFilterOptions)
        .subscribe((list) => {
          console.log(list);
          forEach(list, (item) => {
            // EO-198
            item.ageingText = item.ageing + ' Day(s)';
            item.dateOfJoiningText = formatDate(
              item.dateOfJoining,
              'dd MMM yy',
              this.locale
            );
            //item.monthOfJoiningText = formatDate(
            //  item.monthOfJoining,
            //  'MMM yy',
            //  this.locale
            //);

            let monthOfJoining = {
              name: item.monthofjoining,
            };

            this.columnFilterOptions.monthOfJoiningText.push(monthOfJoining);
            item.corp_induction = item.isCorpInduction;

            let cindux = {
              name: item.corp_induction,
            };

            this.columnFilterOptions.corp_induction.push(cindux);

            let facilitatorItem = {
              name: item.facilitatorId,
            };

            this.columnFilterOptions.facilitatorId.push(facilitatorItem);

            let pname = {
              name: item.projectName,
            };

            if (pname.name != '') {
              this.columnFilterOptions.projectName.push(pname);
            }

          });

          this.columnFilterOptions.facilitatorId =
            this.columnFilterOptions.facilitatorId.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.columnFilterOptions.projectName =
            this.columnFilterOptions.projectName.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.columnFilterOptions.corp_induction =
            this.columnFilterOptions.corp_induction.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.processAssimilations = list;
        });
    }
  }

  getAdminAssignedList() {

    /*    if (this.isAdmin == true) {*/
    if (this.selectedAssign == "Assign to Me") {
      this.getFilterOptions(this.selectedAIPFilters);
      console.log(this.selectedAssign);
      this.adminServices
        .getAssimilationInProgressAdminAssignList(this.selectedFilterOptions)
        .subscribe((list) => {
          console.log(list);
          forEach(list, (item) => {
            // EO-198
            item.ageingText = item.ageing + ' Day(s)';
            item.dateOfJoiningText = formatDate(
              item.dateOfJoining,
              'dd MMM yy',
              this.locale
            );
            //item.monthOfJoiningText = formatDate(
            //  item.monthOfJoining,
            //  'MMM yy',
            //  this.locale
            //);
            item.corp_induction = item.isCorpInduction;

            let cindux = {
              name: item.corp_induction,
            };

            this.columnFilterOptions.corp_induction.push(cindux);

            let monthOfJoining = {
              name: item.monthofjoining,
            };

            this.columnFilterOptions.monthOfJoiningText.push(monthOfJoining);

            let facilitatorItem = {
              name: item.facilitatorId,
            };

            this.columnFilterOptions.facilitatorId.push(facilitatorItem);

            let pname = {
              name: item.projectName,
            };

            if (pname.name != '') {
              this.columnFilterOptions.projectName.push(pname);
            }

          });

          this.columnFilterOptions.facilitatorId =
            this.columnFilterOptions.facilitatorId.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.columnFilterOptions.projectName =
            this.columnFilterOptions.projectName.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.columnFilterOptions.corp_induction =
            this.columnFilterOptions.corp_induction.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.processAssimilations = list;
        });

    }
    else {
      this.getFilterOptions(this.selectedAIPFilters);
      console.log(this.selectedFilterOptions);
      this.adminServices
        .getAssimilationInProgressList(this.selectedFilterOptions)
        .subscribe((list) => {
          console.log(list);
          forEach(list, (item) => {
            // EO-198
            item.ageingText = item.ageing + ' Day(s)';
            item.dateOfJoiningText = formatDate(
              item.dateOfJoining,
              'dd MMM yy',
              this.locale
            );
            //item.monthOfJoiningText = formatDate(
            //  item.monthOfJoining,
            //  'MMM yy',
            //  this.locale
            //);
            item.corp_induction = item.isCorpInduction;

            let cindux = {
              name: item.corp_induction,
            };

            this.columnFilterOptions.corp_induction.push(cindux);

            let facilitatorItem = {
              name: item.facilitatorId,
            };

            this.columnFilterOptions.facilitatorId.push(facilitatorItem);


            let monthOfJoining = {
              name: item.monthofjoining,
            };

            this.columnFilterOptions.monthOfJoiningText.push(monthOfJoining);

            let pname = {
              name: item.projectName,
            };

            if (pname.name != '') {
              this.columnFilterOptions.projectName.push(pname);
            }

          });

          this.columnFilterOptions.facilitatorId =
            this.columnFilterOptions.facilitatorId.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.columnFilterOptions.projectName =
            this.columnFilterOptions.projectName.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.columnFilterOptions.corp_induction =
            this.columnFilterOptions.corp_induction.filter(
              (el: any, i: any, a: any) =>
                i === a.indexOf(a.find((f: any) => f.name === el.name))
            );

          this.processAssimilations = list;
        });


    }


  }

  showAllColumn() {

    this.tempcolstoggle = [];

    this.locationWidth = '120px';
    this.projectnameWidth = '150px';
    this.welcomeEmailWidth = '150px';
    this.corpInductionWidth = '150px';

    for (let i = 0; i < this.mastercolstoggle.length; i++) {
      let temp = {
        field: this.mastercolstoggle[i].field,
        header: this.mastercolstoggle[i].header,
        isSelected: true,
      };

      this.tempcolstoggle.push(temp);
    }

    this.colstoggle = [];

    for (let i = 0; i < this.mastercolstoggle.length; i++) {
      let temp = {
        field: this.mastercolstoggle[i].field,
        header: this.mastercolstoggle[i].header,
        isSelected: true,
      };

      this.colstoggle.push(temp);
    }

    this.cdr.detectChanges();
  }

  restoreColumn() {
    this.tempcolstoggle = [];

    this.locationWidth = '90px';
    this.projectnameWidth = '90px';
    this.welcomeEmailWidth = '125px';
    this.corpInductionWidth = '125px';

    for (let i = 0; i < this.mastercolstoggle.length; i++) {
      let temp = {
        field: this.mastercolstoggle[i].field,
        header: this.mastercolstoggle[i].header,
        isSelected: this.mastercolstoggle[i].isSelected,
      };

      this.tempcolstoggle.push(temp);
    }

    this.colstoggle = [];

    for (let i = 0; i < this.mastercolstoggle.length; i++) {
      let temp = {
        field: this.mastercolstoggle[i].field,
        header: this.mastercolstoggle[i].header,
        isSelected: this.mastercolstoggle[i].isSelected,
      };

      this.colstoggle.push(temp);
    }

    this.cdr.detectChanges();
  }

  mainTabChanged() {
    if (this.activeMainTabIndex == 1 && !this.aptClicked) {
      this.getAPTemplates();
      this.aptClicked = true;
    } else if (this.activeMainTabIndex == 2 && !this.akdClicked) {
      this.getGetAssociateKeyDocuments();
      this.akdClicked = true;
    }
  }


  subTabChanged() {
    if (this.activeSubTabIndex == 1 && !this.paClicked) {
      this.getPendingAssimilationList();
      this.paClicked = true;
    }
  }

  settingsSubTabChanged() {
    if (this.activeSettingsSubTabIndex == 1 && !this.umClicked) {
      this.getGetAdminList();
      this.umClicked = true;
    }
  }

  getFilterOptions(sourceTabFilters: any) {
    this.selectedFilterOptions.grade = join(
      map(sourceTabFilters.grade, 'gradeCode'),
      ','
    );
    this.selectedFilterOptions.serviceLine = join(
      map(sourceTabFilters.serviceLine, 'serviceLineCode'),
      ','
    );
    this.selectedFilterOptions.country = join(
      map(sourceTabFilters.country, 'countryCode'),
      ','
    );
    this.selectedFilterOptions.city = join(
      map(sourceTabFilters.city, 'cityCode'),
      ','
    );
    this.selectedFilterOptions.vertical = join(
      map(sourceTabFilters.vertical, 'verticalCode'),
      ','
    );
    this.selectedFilterOptions.ageing = join(
      map(sourceTabFilters.ageing, 'dayId'),
      ','
    );

    if (sourceTabFilters.dojRange == undefined) {
      this.selectedFilterOptions.fromDate = '';
      this.selectedFilterOptions.toDate = '';
    }

    if (sourceTabFilters.dojRange != undefined) {
      const datepipe: DatePipe = new DatePipe('en-US');
      this.selectedFilterOptions.fromDate =
        sourceTabFilters.dojRange &&
        datepipe.transform(sourceTabFilters.dojRange[0], 'YYYY-MM-dd 00:00:00');
      this.selectedFilterOptions.toDate =
        sourceTabFilters.dojRange &&
        sourceTabFilters.dojRange[1] &&
        datepipe.transform(sourceTabFilters.dojRange[1], 'YYYY-MM-dd 23:59:59');
    }
  }

  //changed() {
  //  this.value1 = this.value;
  //}

  getAssimilationInProgressAdminList() {

    this.getFilterOptions(this.selectedAIPFilters);
    console.log(this.selectedFilterOptions);
    this.adminServices
      .getAssimilationInProgressAdminAssignList(this.selectedFilterOptions)
      .subscribe((list) => {
        console.log(list);
        forEach(list, (item) => {
          // EO-198
          item.ageingText = item.ageing + ' Day(s)';
          item.dateOfJoiningText = formatDate(
            item.dateOfJoining,
            'dd MMM yy',
            this.locale
          );
          //item.monthOfJoiningText = formatDate(
          //  item.monthOfJoining,
          //  'MMM yy',
          //  this.locale
          //);
          item.corp_induction = item.isCorpInduction;

          let cindux = {
            name: item.corp_induction,
          };

          this.columnFilterOptions.corp_induction.push(cindux);
          let monthOfJoining = {
            name: item.monthofjoining,
          };

          this.columnFilterOptions.monthOfJoiningText.push(monthOfJoining);

          let facilitatorItem = {
            name: item.facilitatorId,
          };

          this.columnFilterOptions.facilitatorId.push(facilitatorItem);

          let pname = {
            name: item.projectName,
          };

          if (pname.name != '') {
            this.columnFilterOptions.projectName.push(pname);
          }

        });

        this.columnFilterOptions.facilitatorId =
          this.columnFilterOptions.facilitatorId.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.name === el.name))
          );

        this.columnFilterOptions.projectName =
          this.columnFilterOptions.projectName.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.name === el.name))
          );

        this.columnFilterOptions.corp_induction
          this.columnFilterOptions.corp_induction.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.name === el.name))
          );

        this.processAssimilations = list;
      });
  }

  getAssimilationInProgressList() {
    this.getFilterOptions(this.selectedAIPFilters);
    console.log(this.selectedFilterOptions);
    this.adminServices
      .getAssimilationInProgressList(this.selectedFilterOptions)
      .subscribe((list) => {
        console.log(list);
        forEach(list, (item) => {
          // EO-198
          item.ageingText = item.ageing + ' Day(s)';
          item.dateOfJoiningText = formatDate(
            item.dateOfJoining,
            'dd MMM yy',
            this.locale
          );

          //item.monthOfJoiningText = formatDate(
          //  item.monthOfJoining,
          //  'MMM yy',
          //  this.locale
          //);


          item.corp_induction = item.isCorpInduction;

          let cindux = {
            name: item.corp_induction,
          };

          this.columnFilterOptions.corp_induction.push(cindux);

          let EmpID = {
            empID: item.employeeId,
          };

          if (EmpID.empID != '') {
            this.columnFilterOptions.employeeId.push(EmpID);
          }


          let AssoName = {
            assname: item.associateName,
          };

          if (AssoName.assname != '') {
            this.columnFilterOptions.associateName.push(AssoName);
          }

          let DOJ = {
            doj: item.dateOfJoiningText,
          };

          if (DOJ.doj != '') {
            this.columnFilterOptions.dateOfJoiningText.push(DOJ);
          }

          let monthOfJoining = {
            name: item.monthofjoining,
          };

          this.columnFilterOptions.monthOfJoiningText.push(monthOfJoining);
          
          //item.assigned_plan = item.assignedPlan;
          let AssignPlanItem = {
            assPlan: item.assignedPlan,
          };

          if (AssignPlanItem.assPlan != '') {
            this.columnFilterOptions.assignedPlan.push(AssignPlanItem);
          }


          let InductionDate = {
            inddate: item.inductionDate,
          };

          if (InductionDate.inddate != '') {
            this.columnFilterOptions.inductionDate.push(InductionDate);
          }

        
          let AccountName = {
            accname: item.accountName,
          };

          if (AccountName.accname != '') {
            this.columnFilterOptions.accountName.push(AccountName);
          }

          let Milestone = {
            name: item.ongoingMilestones,
          };

          if (Milestone.name != '') {
            this.columnFilterOptions.ongoingMilestones.push(Milestone);
          }

          let ageing = {
            name: item.ageing,
          };

          if (ageing.name != '') {
            this.columnFilterOptions.ageing.push(ageing);
          }


          let facilitatorItem = {
            name: item.facilitatorId,
          };

          this.columnFilterOptions.facilitatorId.push(facilitatorItem);

          let pname = {
            name: item.projectName,
          };

          if (pname.name != '') {
            this.columnFilterOptions.projectName.push(pname);
          }

          let hiretype = {
            name: item.hireType,
          };

          if (hiretype.name != '') {
            this.columnFilterOptions.hireType.push(hiretype);
          }

          let adminPoC = {
            name: item.adminPoC,
          };

          if (adminPoC.name != '') {
            this.columnFilterOptions.adminPoC.push(adminPoC);
          }
       
          let adminPoCName = {
            name: item.adminPoCName,
          };

          if (adminPoCName.name != '') {
            this.columnFilterOptions.adminPoCName.push(adminPoCName);
          }

      });

        this.columnFilterOptions.employeeId =
          this.columnFilterOptions.employeeId.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.empID === el.empID))
          );

        this.columnFilterOptions.associateName =
          this.columnFilterOptions.associateName.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.assname === el.assname))
          );

        this.columnFilterOptions.inductionDate =
          this.columnFilterOptions.inductionDate.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.inddate === el.inddate))
          );

        this.columnFilterOptions.assignedPlan =
          this.columnFilterOptions.assignedPlan.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.assPlan === el.assPlan))
          );


        this.columnFilterOptions.dateOfJoiningText =
          this.columnFilterOptions.dateOfJoiningText.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.doj === el.doj))
          );

        this.columnFilterOptions.monthOfJoiningText =
          this.columnFilterOptions.monthOfJoiningText.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.monthOfJoining === el.monthOfJoining))
          );

        this.columnFilterOptions.ongoingMilestones =
          this.columnFilterOptions.ongoingMilestones.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.name === el.name))
          );


        this.columnFilterOptions.accountName =
          this.columnFilterOptions.accountName.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.accname === el.accname))
          );

        this.columnFilterOptions.ageing =
          this.columnFilterOptions.ageing.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.name === el.name))
          );


        this.columnFilterOptions.facilitatorId =
          this.columnFilterOptions.facilitatorId.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.name === el.name))
          );

        //this.columnFilterOptions.assigned_plan =
        //  this.columnFilterOptions.assigned_plan.filter(
        //    (el: any, i: any, a: any) =>
        //      i === a.indexOf(a.find((f: any) => f.name === el.name))
        //  );

        this.columnFilterOptions.projectName =
          this.columnFilterOptions.projectName.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.name === el.name))
          );

        this.columnFilterOptions.corp_induction =
          this.columnFilterOptions.corp_induction.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.name === el.name))
          );

        this.columnFilterOptions.hireType =
          this.columnFilterOptions.hireType.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.name === el.name))
          );

        this.columnFilterOptions.adminPoC =
          this.columnFilterOptions.adminPoC.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.name === el.name))
          );


        this.columnFilterOptions.adminPoCName =
          this.columnFilterOptions.adminPoCName.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.name === el.name))
          );
        this.processAssimilations = list;


      });

  }

 

  getAPTemplates() {
    this.adminServices.getAPTemplates().subscribe((list: any) => {
      console.log(list);
      this.masterPlantemplates = list;
      this.plantemplates = list;
    });
  }

  getPendingAssimilationList() {
    this.getFilterOptions(this.selectedPAFilters);
    this.adminServices
      .getPendingAssimilationList(this.selectedFilterOptions)
      .subscribe((list) => {
        console.log(list);
        // EO-198
        forEach(list, (item) => {
          item.remainingText = item.remaining + ' Day(s)';
          item.dateOfJoiningText = formatDate(
            item.dateOfJoining,
            'dd MMM yy',
            this.locale
          );

          //item.monthOfJoiningText = formatDate(
          //  item.monthOfJoining,
          //  'dd MMM yy',
          //  this.locale
          //);

          let candidateId = {
            caid: item.candidateId,
          };

          if (candidateId.caid != '') {
            this.pendingColumnFilterOptions.candidateId.push(candidateId);
          }

          let AssociateName = {
            assName: item.associateName,
          };

          if (AssociateName.assName!= '') {
            this.pendingColumnFilterOptions.associateName.push(AssociateName);
          }
       
          let RemainingText = {
            rmtext: item.remainingText,
          };

          if (RemainingText.rmtext != '') {
            this.pendingColumnFilterOptions.remainingText.push(RemainingText);
          }

          let DOJ = {
            doj: item.dateOfJoiningText,
          };

          if (DOJ.doj != '') {
            this.pendingColumnFilterOptions.dateOfJoiningText.push(DOJ);
          }

          let monthOfJoining = {
            name: item.monthofjoining,
          };

          this.columnFilterOptions.monthOfJoiningText.push(monthOfJoining);

        });
        
        this.pendingColumnFilterOptions.candidateId =
          this.pendingColumnFilterOptions.candidateId.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.caid === el.caid))
          );

        this.pendingColumnFilterOptions.associateName =
          this.pendingColumnFilterOptions.associateName.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.assName === el.assName))
          );


        this.pendingColumnFilterOptions.remainingText =
          this.pendingColumnFilterOptions.remainingText.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.rmtext === el.rmtext))
          );

        this.pendingColumnFilterOptions.dateOfJoiningText =
          this.pendingColumnFilterOptions.dateOfJoiningText.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.doj === el.doj))
          );

        this.pendingColumnFilterOptions.monthOfJoiningText =
          this.pendingColumnFilterOptions.monthOfJoiningText.filter(
            (el: any, i: any, a: any) =>
              i === a.indexOf(a.find((f: any) => f.monthOfJoining === el.monthOfJoining))
          );

        this.pendingAssimilations = list;
      });
  }

  deleteAssimilationPlanTemplate() {
    console.log('selected plan template: ', this.selectedPlanTemplate);

    this.deleteAPIparams.deletePlanId = this.selectedPlanTemplate.planId;

    this.adminServices
      .deleteAssimilationPlanTemplate(this.deleteAPIparams)
      .subscribe((response: any) => {
        console.log(response);
        if (response == 1) {
          this.getAPTemplates();
        }
      });
  }

  //getDownloadedReport() {
  //  debugger;
  //  this.getFilterOptions(this.selectedAIPFilters);
  //  console.log(this.selectedFilterOptions);
  //  this.adminServices
  //    .getReportDownloadedList(this.selectedFilterOptions)
  //    .subscribe((list) => {
  //      console.log(list);
  //      this.downloadedAssimilations = list;
  //    });
  //}

  downloadReport() {
    let downloadList: any;
    if (this.selected_processAssimilations.length > 0) {
      downloadList = this.selected_processAssimilations;
      this.saveAsExcelFile(downloadList);
    }
    else
    {
      this.adminServices
        .getReportDownloadedList(this.selectedFilterOptions)
        .subscribe((list) => {
          console.log(list,'downloaded');
          this.downloadedAssimilations = list;
          this.saveAsExcelFile(this.downloadedAssimilations);
        });

      //downloadList = this.downloadedAssimilations;
      //console.log(downloadList,'downloadList');
    }
    //const newdownloadList = downloadList.map((item: any) => ({
    //  employeeId: item.employeeId,
    //  associateName: item.associateName,
    //  grade: item.grade,
    //  country: item.grade,
    //  location: item.country,
    //  geo: item.city,
    //  serviceLine: item.serviceLine,
    //  dateOfJoining: item.dateOfJoining,
    //  monthOfJoining: item.monthofjoining,
    //  assignedPlan: item.assignedPlan,
    //  ongoingMilestones: item.ongoingMilestones,
    //  ageing: item.ageing,
    //  corp_induction: item.corp_induction,
    //  vertical: item.vertical,
    //  inductionDate: item.inductionDate,
    //  projectName: item.projectName,
    //  welcomeMailStatus: item.welcomeMailStatus,
    //  facilitatorId: item.facilitatorId,
    //  managerConnectStatus: item.managerConnectStatus,
    //  EthicsandcompliancesessionStatus: item.EthicsandcompliancesessionStatus,
    //  EthicsandcompliancesessionDate: item.EthicsandcompliancesessionDate,
    //  EthicsandcompliancesessionFacilitatorID: item.EthicsandcompliancesessionFacilitatorID,
    //  PolicyrefresherStatus: item.PolicyrefresherStatus,
    //  PolicyrefresherDate: item.PolicyrefresherDate,
    //  PolicyrefresherFacilitatorID: item.PolicyrefresherFacilitatorID,
    //}));

    //import('xlsx').then((xlsx: any) => {
    //  const worksheet = xlsx.utils.json_to_sheet(newdownloadList);
    //  const workbook = {
    //    Sheets: { data: worksheet },
    //    SheetNames: ['data'],
    //  };
    //  const excelBuffer: any = xlsx.write(workbook, {
    //    bookType: 'xlsx',
    //    type: 'array',
    //  });
    //  this.saveAsExcelFile(excelBuffer, 'ProcessAssimilations');
    //});
  }

  saveAsExcelFile(downloadList: any): void {

    const newdownloadList = downloadList.map((item: any) => ({
      employeeId: item.employeeId,
      associateName: item.associateName,
      grade: item.grade,
      country: item.grade,
      location: item.country,
      geo: item.city,
      serviceLine: item.serviceLine,
      dateOfJoining: item.dateOfJoining,
      monthOfJoining: item.monthofjoining,
      assignedPlan: item.assignedPlan,
      ongoingMilestones: item.ongoingMilestones,
      ageing: item.ageing,
      corp_induction: item.corp_induction,
      vertical: item.vertical,
      inductionDate: item.inductionDate,
      projectName: item.projectName,
      welcomeMailStatus: item.welcomeMailStatus,
      facilitatorId: item.facilitatorId,
      managerConnectStatus: item.managerConnectStatus,
      EthicsandcompliancesessionStatus: item.EthicsandcompliancesessionStatus,
      EthicsandcompliancesessionDate: item.EthicsandcompliancesessionDate,
      EthicsandcompliancesessionFacilitatorID: item.EthicsandcompliancesessionFacilitatorID,
      PolicyrefresherStatus: item.PolicyrefresherStatus,
      PolicyrefresherDate: item.PolicyrefresherDate,
      PolicyrefresherFacilitatorID: item.PolicyrefresherFacilitatorID,
      LeadershipConnectStatus: item.LeadershipConnectStatus,
      LeadershipConnectDate: item.LeadershipConnectDate,
      LeadershipConnectFacilitatorID: item.LeadershipConnectFacilitatorID,
      SkipConnectStatus: item.SkipConnectStatus,
      SkipConnectDate: item.SkipConnectDate,
      SkipConnectFacilitatorID: item.SkipConnectFacilitatorID,
      QuerySupportStatus: item.QuerySupportStatus,
      QuerySupportDate: item.QuerySupportDate,
      QuerySupportFacilitatorID: item.QuerySupportFacilitatorID,
      OutreachProgramStatus: item.OutreachProgramStatus,
      OutreachProgramDate: item.OutreachProgramDate,
      OutreachProgramFacilitatorID: item.OutreachProgramFacilitatorID,
      CTSJourneyAgendaBusinessOverviewStatus: item.CTSJourneyAgendaBusinessOverviewStatus,
      CTSJourneyAgendaBusinessOverviewDate: item.CTSJourneyAgendaBusinessOverviewDate,
      CTSJourneyAgendaBusinessOverviewFacilitatorID: item.CTSJourneyAgendaBusinessOverviewFacilitatorID,
      DIDiscussionStatus: item.DIDiscussionStatus,
      DIDiscussionDate: item.DIDiscussionDate,
      DIDiscussionFacilitatorID: item.DIDiscussionFacilitatorID,
      LDOrientationStatus: item.LDOrientationStatus,
      LDOrientationDate: item.LDOrientationDate,
      LDOrientationFacilitatorID: item.LDOrientationFacilitatorID,
      MedInsuranceAwarenessSessionStatus: item.MedInsuranceAwarenessSessionStatus,
      MedInsuranceAwarenessSessionDate: item.MedInsuranceAwarenessSessionDate,
      MedInsuranceAwarenessSessionFacilitatorID: item.MedInsuranceAwarenessSessionFacilitatorID,
      FinLiteracyStatus: item.FinLiteracyStatus,
      FinLiteracyDate: item.FinLiteracyDate,
      FinLiteracyFacilitatorID: item.FinLiteracyFacilitatorID,
      BULeadershipConnectStatus: item.BULeadershipConnectStatus,
      BULeadershipConnectDate: item.BULeadershipConnectDate,
      BULeadershipConnectFacilitatorID: item.BULeadershipConnectFacilitatorID,
      PerformanceMangmntStatus: item.PerformanceMangmntStatus,
      PerformanceMangmntDate: item.PerformanceMangmntDate,
      PerformanceMangmntFacilitatorID: item.PerformanceMangmntFacilitatorID,
      CareerGuidStatus: item.CareerGuidStatus,
      CareerGuidDate: item.CareerGuidDate,
      CareerGuidFacilitatorID: item.CareerGuidFacilitatorID,
      WellnessStatus: item.WellnessStatus,
      WellnessDate: item.WellnessDate,
      WellnessFacilitatorID: item.WellnessFacilitatorID,
      PolicyRefresherandHRTPHandoverSessionStatus: item.PolicyRefresherandHRTPHandoverSessionStatus,
      PolicyRefresherandHRTPHandoverSessionDate: item.PolicyRefresherandHRTPHandoverSessionDate,
      PolicyRefresherandHRTPHandoverSessionFacilitatorID: item.PolicyRefresherandHRTPHandoverSessionFacilitatorID,
      LRNTaskStatus: item.LRNTaskStatus,
      MediAssistTaskStatus: item.MediAssistTaskStatus,

    }));

    import('xlsx').then((xlsx: any) => {
      const worksheet = xlsx.utils.json_to_sheet(newdownloadList);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ['data'],
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      let EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
      const formattedDate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
      const fullFileName = `ProcessAssimilations_export_${formattedDate}${EXCEL_EXTENSION}`;
      saveAs(data, fullFileName);    
    });
  
  }

  saveAsExcelFile_backup(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    // FileSaver.saveAs(
    //saveAs(
    //  data,
    //  fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    //);
    const formattedDate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    const fullFileName = `${fileName}_export_${formattedDate}${EXCEL_EXTENSION}`;

    saveAs(data, fullFileName);
  }

  // getFilterOptionsModel(col: string, filterOptionName: any) {
  //   return filter(this.columnFilterOptions[col], (item: any) => {
  //     item.name == filterOptionName;
  //   })[0];
  // }

  utilMapPropertyToArray(items: any, fieldName: string) {
    return map(items, fieldName);
  }

  toggleCurrentColFilterValue(
    col: string,
    value: any,
    tableColumnsFilterSelectedOptions: any = this.columnFilterSelectedOptions
  ) {
    console.log(col);
    console.log(value);
    console.log(tableColumnsFilterSelectedOptions);
    tableColumnsFilterSelectedOptions[col] = {};
    // this.columnFilterSelectedOptions[col] = {};

    value.forEach((element: any) => {
      tableColumnsFilterSelectedOptions[col][element] =
        tableColumnsFilterSelectedOptions[col][element] == undefined
          ? true
          : undefined;
      // this.columnFilterSelectedOptions[col][element] = true;
    });
    // this.columnFilterSelectedOptions[col][value] = true;
    console.log(tableColumnsFilterSelectedOptions);
    // console.log(this.columnFilterSelectedOptions);
  } 

  filterChange(event: any) {
    console.log(event);
    console.log(this.columnFilterSelectedOptions);
  }

  pendingtoggleCurrentColFilterValue(
    col: string,
    value: any,
    pendingtableColumnsFilterSelectedOptions: any = this.pendingAssiColumnFilterSelectedOptions
  ) {
    console.log(col);
    console.log(value);
    console.log(pendingtableColumnsFilterSelectedOptions);
    pendingtableColumnsFilterSelectedOptions[col] = {};
    // this.columnFilterSelectedOptions[col] = {};

    value.forEach((element: any) => {
      pendingtableColumnsFilterSelectedOptions[col][element] =
        pendingtableColumnsFilterSelectedOptions[col][element] == undefined
          ? true
          : undefined;
      // this.columnFilterSelectedOptions[col][element] = true;
    });
    // this.columnFilterSelectedOptions[col][value] = true;
    console.log(pendingtableColumnsFilterSelectedOptions);
    // console.log(this.columnFilterSelectedOptions);
  }

  pendingfilterChange(event: any) {
    console.log(event);
    console.log(this.pendingAssiColumnFilterSelectedOptions);
  }

  clear(table: Table) {
    table.clear();
  }

  viewfilter() {
    this.showFilter = !this.showFilter;

    if (this.showFilter == false) {
      this.showFilteredList = true;
    }

    if (this.showFilter == true) {
      this.showFilteredList = false;
    }
  }

  viewPAfilter() {
    this.showPAFilter = !this.showPAFilter;

    if (this.showPAFilter == false) {
      this.showPAFilterList = true;
    }

    if (this.showPAFilter == true) {
      this.showPAFilterList = false;
    }
  }

  showAssociatedocumentspopup() {
   this.showAssociateAssimilationPopup = true;
  }

  showAssociateAssimilationDialog() {
    // this.dialogVisible = true;
    this.showAssociateAssimilationPopup = true;
  }

  closeAssociateAssimilationPopup() {
    this.showAssociateAssimilationPopup = false;
  }

  showConfigureMailDialog() {
    this.showConfigureMailPopup = true;
  }

  closeConfigureMailPopup() {
    this.showConfigureMailPopup = false;
  }

  closeUploadNewResourcePopup() {
    this.showUploadNewResourcePopup = false;
    this.getGetAssociateKeyDocuments();
  }

  planredirect(planname: string, planId: any) {
    //if (planname.toLowerCase() == 'default plan') {
    //  this.router.navigate(['admin/assimilation-plan-details'], {
    //    queryParams: { planid: planId },
    //  });

    this.router.navigate(['admin/assimilation-plan-details'], {
      queryParams: { planid: planId },
    });
  }

  // newAssimilationRedirect() {
  //   this.router.navigate(['new-assimilation-plan']);
  // }

  newAssimilationRedirect() {
    this.router.navigate(['admin/assimilation-plan-details'], {
      queryParams: { planType: 'CreateTemplate' },
    });
  }

  teamsNavigate() {
    if (this.selected_processAssimilations.length > 0) {
      let ids = '';

      for (let i = 0; i < this.selected_processAssimilations.length; i++) {
        ids =
          ids +
          this.selected_processAssimilations[i].employeeId +
          '@cognizant.com' +
          ',';
        // todo: ensure email id is received from API and used
        // ids = ids + this.selected_processAssimilations[i].emailId + ',';
      }

      ids = ids.replace(/,*$/, '');
      let url =
        //'https://teams.microsoft.com/l/meeting/new?subject=Corporate%20Induction%20Meeting&content=Project%20Meet&attendees=' +ids;
        'https://teams.microsoft.com/l/meeting/new?subject=' + this.selectedsessiontask.taskName + '%20Meeting&content=Project%20Meet&attendees=' + ids;
      window.open(url, '_blank');
    }

    this.selected_processAssimilations = [];
  }

  checkEmployeeCorpIndction() {
    //var rrres = (this.selected_processAssimilations, (item: any) => item.isCorpInduction == false).length;

    return (
      this.selected_processAssimilations.length !==
      filter(this.selected_processAssimilations, (item) => {
        return (
          item.isCorpInduction == 'Set' ||
          item.isCorpInduction == 'Not Set' ||
          item.isCorpInduction == 'Not Attended' ||
          item.isCorpInduction == 'Attended'
        );
      }).length
    );
  }

  onStartSelect($event: any) {
    let hour = new Date($event).getHours();
    var min = new Date($event).getMinutes();

    if (new Date($event).getMinutes() > 10) {
      this.starttimeValue = hour + ':' + min;
    }

    if (new Date($event).getMinutes() < 10) {
      this.starttimeValue = hour + ':0' + min;
    }
  }

  onEndSelect($event: any) {
    this.corpvalidationMsg = '';

    let hour = new Date($event).getHours();
    var min = new Date($event).getMinutes();

    if (new Date($event).getMinutes() > 10) {
      this.endtimeValue = hour + ':' + min;
    }

    if (new Date($event).getMinutes() < 10) {
      this.endtimeValue = hour + ':0' + min;
    }

    let time1 = this.starttimeValue;
    let time2 = this.endtimeValue;

    if (time2 <= time1) {
      this.corpvalidationMsg = 'Endtime should be greater than Starttime';
    }
  }

  setCorporationInduction() {
    if (this.selected_processAssimilations.length > 0) {
      let selectedEmployees: any = [];

      forEach(this.selected_processAssimilations, (item) => {
        selectedEmployees.push({ empId: item.employeeId });
      });
      /*alert(this.selectedsessiontask.taskName);*/

      let taskInfo = {
        taskName: this.selectedsessiontask.taskName,
        employee: selectedEmployees,

      };


      this.adminServices
        .setCorporateInduction(taskInfo)
        .subscribe((response) => {
          console.log(response);
          this.clearItems('progress');
        });
    }
  }

  changeAssignplan(assignPlan: string) {
    if (this.selected_processAssimilations.length > 0) {
      let employeeId: any = [];
      forEach(this.selected_processAssimilations, (item) => {
        employeeId.push({ empId: item.employeeId });
      });

      this.adminServices
        .ReAssignPlan(employeeId[0].empId, assignPlan)
        .subscribe((response) => {
          console.log(response);
          if (response == 1) {
            this.messsageResult = 'success';
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Success: Rows were updated Successfully',
            });
            this.showReAssignPlan = true;
            this.showReAssignPlanValidationMsg = '';
          }
          else {
            this.messsageResult = 'failure';
            this.messageService.add({
              severity: 'Failure',
              summary: 'Failure',
              //detail: response,
              detail: 'Failure: Rows were not updated Successfully',
            });
            this.showReAssignPlan = false;
            this.showReAssignPlanValidationMsg = '';
          }

          this.clearItems('progress');
        });
    }
  }


  //setCorporationInduction() {
  //  if (this.corpdate == '') {
  //    this.corpvalidationMsg = 'Please select Date ,';
  //    return;
  //  }

  //  if (this.starttimeValue == '') {
  //    this.corpvalidationMsg = 'Please select strarttime';
  //    return;
  //  }

  //  if (this.endtimeValue == '') {
  //    this.corpvalidationMsg = 'Please select endtime';
  //    return;
  //  }

  //  if (this.corpvalidationMsg != '') {
  //    return;
  //  }

  //  if (this.selected_processAssimilations.length > 0) {
  //    let selectedEmployees: any = [];

  //    for (let i = 0; i < this.selected_processAssimilations.length; i++) {
  //      selectedEmployees.push(
  //        this.selected_processAssimilations[i].employeeId
  //      );
  //    }

  //    const datepipe: DatePipe = new DatePipe('en-US');
  //    this.corpdate = datepipe.transform(this.corpdate, 'YYYY-MM-dd');

  //    let corpInfo = {
  //      Subject: this.corpSubject,
  //      InductionDate: this.corpdate,
  //      StartTime: this.starttimeValue + ':00',
  //      EndTime: this.endtimeValue + ':00',
  //      EmpId: selectedEmployees,
  //    };

  //    this.adminServices
  //      .setCorporateInduction(corpInfo)
  //      .subscribe((response) => {
  //        console.log(response);

  //        this.showSetCorpIndConf = false;

  //        if (response.includes('success')) {
  //          this.messsageResult = 'success';
  //          this.messageService.add({
  //            severity: 'success',
  //            summary: 'Success',
  //            detail:
  //              'The meeting invitation has been successfully sent to all selected associates.',
  //          });
  //        }

  //        if (!response.includes('success')) {
  //          this.messsageResult = 'failure';

  //          this.messageService.add({
  //            severity: 'Failure',
  //            summary: 'Failure',
  //            detail:
  //              'The meeting invitation has not sent to all selected associates.',
  //          });
  //        }

  //        this.clearItems('progress');
  //      });
  //  }
  //}

  searachTemplates(event: any) {
    if (this.searchTemplate != '') {
      this.plantemplates = this.masterPlantemplates.filter((x: any) =>
        x.planTitle.toLowerCase().includes(this.searchTemplate.toLowerCase())
      );
    }

    if (this.searchTemplate == '') {
      this.plantemplates = this.masterPlantemplates;
    }
  }

  removeCategoryItem(
    needRrefresh: boolean = false,
    catetory: any,
    catitem: any
  ) {
    if (catetory == 'Grade') {
      this.selectedAIPFilters.grade = this.selectedAIPFilters.grade.filter(
        (item: any) => item.gradeDesc !== catitem
      );
    }

    if (catetory == 'ServiceLine') {
      this.selectedAIPFilters.serviceLine =
        this.selectedAIPFilters.serviceLine.filter(
          (item: any) => item.serviceLineDesc !== catitem
        );
    }

    if (catetory == 'Geography') {
      this.selectedAIPFilters.country = this.selectedAIPFilters.country.filter(
        (item: any) => item.countryDesc !== catitem
      );
    }

    if (catetory == 'Vertical') {
      this.selectedAIPFilters.vertical =
        this.selectedAIPFilters.vertical.filter(
          (item: any) => item.verticalDesc !== catitem
        );
    }

    if (catetory == 'LocationOfJoining') {
      this.selectedAIPFilters.city = this.selectedAIPFilters.city.filter(
        (item: any) => item.cityDesc !== catitem
      );
    }

    if (catetory == 'Ageing') {
      this.selectedAIPFilters.ageing = this.selectedAIPFilters.ageing.filter(
        (item: any) => item.days !== catitem
      );
    }

    if (catetory == 'Date_Range') {
      this.selectedAIPFilters.dojRange = undefined;
    }

    if (needRrefresh) {
      this.getAssimilationInProgressList();
    }
  }

  removePendingCategoryItem(
    needRefresh: boolean = false,
    catetory: any,
    catitem: any
  ) {
    if (catetory == 'Grade') {
      this.selectedPAFilters.grade = this.selectedPAFilters.grade.filter(
        (item: any) => item.gradeDesc !== catitem
      );
    }

    if (catetory == 'ServiceLine') {
      this.selectedPAFilters.serviceLine =
        this.selectedPAFilters.serviceLine.filter(
          (item: any) => item.serviceLineDesc !== catitem
        );
    }

    if (catetory == 'Geography') {
      this.selectedPAFilters.country = this.selectedPAFilters.country.filter(
        (item: any) => item.countryDesc !== catitem
      );
    }

    if (catetory == 'LocationOfJoining') {
      this.selectedPAFilters.city = this.selectedPAFilters.city.filter(
        (item: any) => item.cityDesc !== catitem
      );
    }

    if (catetory == 'Ageing') {
      this.selectedPAFilters.ageing = this.selectedPAFilters.ageing.filter(
        (item: any) => item.days !== catitem
      );
    }

    if (catetory == 'Date_Range') {
      this.selectedPAFilters.dojRange = undefined;
    }

    if (needRefresh) {
      this.getPendingAssimilationList();
    }
  }

  clearItems(processtype: any) {
    console.log(this.rangeDates);

    if (processtype == 'progress') {
      this.selectedAIPFilters.grade = [];
      this.selectedAIPFilters.serviceLine = [];
      this.selectedAIPFilters.country = [];
      this.selectedAIPFilters.city = [];
      this.selectedAIPFilters.vertical = [];
      this.selectedAIPFilters.dojRange = undefined;
      this.selectedAIPFilters.ageing = [];
      this.selected_processAssimilations = [];
      this.attentanceExcelData = [];
      this.taskstatusExcelData=[];
      this.assignAdminExcelData = [];
      this.getAssimilationInProgressList();
    }

    if (processtype == 'pending') {
      this.selectedPAFilters.grade = [];
      this.selectedPAFilters.serviceLine = [];
      this.selectedPAFilters.country = [];
      this.selectedPAFilters.city = [];
      this.selectedPAFilters.dojRange = undefined;
      this.selectedPAFilters.ageing = [];
      this.getPendingAssimilationList();
    }
  }

  getPlanColor(plandesc: any) {
    if (plandesc == 'Plan Not Assigned') {
      return '#b81f2d';
    } else {
      return 'black';
    }
  }

  getFilterStyles() {

    return { 'width': '10rem' };
  }

  getMessageColor(desc: any) {
    if (desc == 'success') {
      return '#ABE3A5';
    } else {
      return '#F1D2D5';
    }
  }

  onInput(event: Event): void {
    this.adminID_value = +(<HTMLInputElement>event.target).value.split(',').join('');
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  selectedAssignAdminRst() {
    this.adminID_value = 0;
  }

  selectedAssignAdmin() {
    if (this.selectedAssign != "Assign to Other") {
      let newHireIds: any = [];
      let adminID: number = this.adminID_value;
      if (this.selected_processAssimilations.length > 0) {

        for (var i = 0; i < this.selected_processAssimilations.length; i++) {
          forEach(this.selected_processAssimilations, (item) => {
            newHireIds.push({ empId: item.employeeId });
          });
        }
      }
      console.log(newHireIds);
      this.adminServices
        .getSelectedAssimilationInProgressAdminAssignList(newHireIds, adminID)
        .subscribe((response) => {
          console.log(response);
          var res = response;

          if (!res.includes('Failure')) {
            this.messsageResult = 'success';
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response,
            });
          }

          if (res.includes('Failure')) {
            this.messsageResult = 'failure';
            this.messageService.add({
              severity: 'Failure',
              summary: 'Failure',
              detail: response,
            });
          }
          this.showAssigntoAdmin = false;
          this.adminID_value = 0;
          this.clearItems('progress');
        });
    }

    else {
      let newHireIds: any = [];
      let adminID: number = this.adminID_value;
      if (this.selected_processAssimilations.length > 0) {
        for (var i = 0; i < this.selected_processAssimilations.length; i++) {
          forEach(this.selected_processAssimilations, (item) => {
            newHireIds.push({ empId: item.employeeId });
          });
        }
      }
      console.log(newHireIds);
      console.log(adminID);
      this.adminServices
        .getSelectedOtherAdminAssignList(newHireIds, adminID)
        .subscribe((response) => {
          console.log(response);
          var res = response;

          if (!res.includes('Failure')) {
            this.messsageResult = 'success';
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response,
            });
          }

          if (res.includes('Failure')) {
            this.messsageResult = 'failure';
            this.messageService.add({
              severity: 'Failure',
              summary: 'Failure',
              detail: response,
            });
          }
          this.showAssigntoAdmin = false;
          this.adminID_value = 0;
          this.clearItems('progress');
        });
    }

  }



  paginate1(event: any) {
    const divboxes = document.getElementsByClassName(
      'p-paginator-rpp-options'
    )[0];
    divboxes?.classList.remove('pageadjust');

    if (event.rows > 9) {
      const divboxes1 = document.getElementsByClassName(
        'p-paginator-rpp-options'
      )[0];
      divboxes1?.classList.add('pageadjust');
    } else {
      const divboxes2 = document.getElementsByClassName(
        'p-paginator-rpp-options'
      )[0];
      divboxes2?.classList.remove('pageadjust');
    }
  }

  paginate2(event: any) {
    if (event.rows > 9) {
      const divboxes1 = document.getElementsByClassName(
        'p-paginator-rpp-options'
      )[1];
      divboxes1?.classList.add('pageadjust');
    } else {
      const divboxes2 = document.getElementsByClassName(
        'p-paginator-rpp-options'
      )[1];
      divboxes2?.classList.remove('pageadjust');
    }
  }

  paginate3(event: any) { }

  paginate4(event: any) { }

  FileUpload(type: string) {
    let fileDOM = document.getElementById(type + '-file');
    fileDOM?.click();
  }

  FileUploadagn(type: string) {
    let fileDOM = document.getElementById(type + '-file1');
    fileDOM?.click();
  }

  FileUploadtaskStatus(type: string) {
    let fileDOM2 = document.getElementById(type + '-file2');
    fileDOM2?.click();
  }

  onFileChanged(event: any, proofType: string) {
    this.fileUploaded = event.target.files[0];
    this.attentancefilename = event.target.files[0].name;

    if (this.fileUploaded.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.showUploadAttendanceValidationMsg = 'Please upload the file in correct format';
    }

    if (this.fileUploaded.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.readExcel();
      event.target.value = null;
      console.log('File upload has been reset.');
    }
  }

  onFileChangedagn(event: any, proofType: string) {
    this.fileUploaded = event.target.files[0];
    this.assigntoadminfilename = event.target.files[0].name;

    if (this.fileUploaded.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.showAssigntoAdminValidationMsg = 'Please upload the file in correct format';
    }

    if (this.fileUploaded.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.readExcelagn();
      event.target.value = null;
      console.log('File upload has been reset.');
    }
  }

  onFileChangedtask(event: any, proofType: string) {
    this.fileUploadedTask = event.target.files[0];
    this.taskstatusfilename = event.target.files[0].name;

    if (this.fileUploadedTask.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.showUploadtaskstatusValidationMsg = 'Please upload the file in correct format';
    }

    if (this.fileUploadedTask.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.readtaskstatusExcel();
      event.target.value = null;
      console.log('File upload has been reset.', this.fileUploadedTask);
    }
  }

  readExcel() {
    debugger;
    this.attentanceExcelData = [];
    this.showUploadAttendanceValidationMsg = '';

    let readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;

      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join('');
      var workbook = XLSX.read(bstr, { type: 'binary' });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];

            let sessiondate = this.worksheet.D1.w;
            sessiondate = sessiondate.replace("\n[MM/DD/YYYY]", '');

      let sessionname = this.worksheet.B1.v;
      sessionname = sessionname.replace("\n[NOTE: The Session Name must match the Assimilation Plan Template.]", '');

      this.worksheet.D1.w = sessiondate;
      this.worksheet.B1.w = sessionname;

      this.attentanceExcelData = XLSX.utils.sheet_to_json(this.worksheet, {
        raw: false,
      });
      if (this.attentanceExcelData.length == 0 && this.attentanceExcelData[0].SessionDate == undefined) {
        this.attentanceExcelData = [];
      }

      if (this.attentanceExcelData.length > 0 && this.attentanceExcelData[0].SessionDate != undefined) {
        for (let i = 0; i < this.attentanceExcelData.length; i++) {
          var tempdate = this.attentanceExcelData[i].SessionDate.split('/');
          this.attentanceExcelData[i].SessionDate = tempdate[2] + '-' + tempdate[0] + '-' + tempdate[1];
        }
      }

      console.log('Attendance Data =  ', this.attentanceExcelData);
    };
    readFile.readAsArrayBuffer(this.fileUploaded);
  }

  readExcelagn() {
    this.assignAdminExcelData = [];
    this.showAssigntoAdminValidationMsg = '';

    let readFileagn = new FileReader();
    readFileagn.onload = (e) => {
      this.storeDataAgn = readFileagn.result;

      var dataagn = new Uint8Array(this.storeDataAgn);
      var arr = new Array();
      for (var i = 0; i != dataagn.length; ++i)
        arr[i] = String.fromCharCode(dataagn[i]);
      var bstragn = arr.join('');
      var workbookagn = XLSX.read(bstragn, { type: 'binary' });
      var first_sheet_name = workbookagn.SheetNames[0];
      this.worksheetagn = workbookagn.Sheets[first_sheet_name];
      this.assignAdminExcelData = XLSX.utils.sheet_to_json(this.worksheetagn, {
        raw: false,
      });

      if (this.assignAdminExcelData.length > 0) {
        //this.assignAdminExcelData = [];
      }

      //if (this.assignAdminExcelData.length > 0 ) {
      //  for (let i = 0; i < this.assignAdminExcelData.length; i++) {
      //    var tempdate = this.attentanceExcelData[i].InductionDate.split('-');
      //    this.attentanceExcelData[i].InductionDate = tempdate[2] + '-' + tempdate[1] + '-' + tempdate[0];
      //  }
      //}

      console.log('assign Admin Data =  ', this.assignAdminExcelData);
    };
    readFileagn.readAsArrayBuffer(this.fileUploaded);
  }

  readtaskstatusExcel() {
    this.taskstatusExcelData = [];
    this.showUploadtaskstatusValidationMsg = '';

    let readFiletask = new FileReader();
    readFiletask.onload = (e) => {
      console.log(readFiletask.result)
      this.storeDatatask = readFiletask.result;

      var datatask = new Uint8Array(this.storeDatatask);
      var arrtask = new Array();
      for (var i = 0; i != datatask.length; ++i)
        arrtask[i] = String.fromCharCode(datatask[i]);
      var bstrtask = arrtask.join('');
      var workbooktask = XLSX.read(bstrtask, { type: 'binary' });
      var first_sheet_name = workbooktask.SheetNames[0];
      this.worksheetask = workbooktask.Sheets[first_sheet_name];

      this.taskstatusExcelData = XLSX.utils.sheet_to_json(this.worksheetask, {
        raw: false,
      });

      if (this.taskstatusExcelData.length > 0) {
      }
      console.log('Uploaded Task Status =  ', this.taskstatusExcelData);
    };
    readFiletask.readAsArrayBuffer(this.fileUploadedTask);
  }

  uploadAttentance() {
    this.showUploadAttendanceValidationMsg = '';
    if (this.attentancefilename == '') {
      this.showUploadAttendanceValidationMsg = 'Please upload the file in correct format.';
      return;
    }

    if (this.attentanceExcelData.length == 0) {
      this.showUploadAttendanceValidationMsg = 'Please upload the file in correct format.';
      return;
    }
    this.adminServices
      .uploadAttentance(this.attentanceExcelData)
      .subscribe((response) => {
        console.log('uploadAttentance Results = ', JSON.stringify(response));
        var res = response;

        if (!res.includes('Failure')) {
          this.messsageResult = 'success';
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response,
          });
        }

        if (res.includes('Failure')) {
          this.messsageResult = 'failure';
          this.messageService.add({
            severity: 'Failure',
            summary: 'Failure',
            detail: response,
          });
        }


        //this.getAssimilationInProgressList();
        //this.attentanceExcelData = [];
        this.showUploadAttendance = false;
        this.clearItems('progress');

      });
  }

  uploadTaskStatus() {
    this.showUploadtaskstatusValidationMsg = '';
    if (this.taskstatusfilename == '') {
      this.showUploadtaskstatusValidationMsg = 'Please upload the file in correct format.';
      return;
    }

    if (this.taskstatusExcelData.length == 0) {
      this.showUploadtaskstatusValidationMsg = 'Please upload the file in correct format.';
      return;
    }
    this.adminServices
      .uploadTaskStatus(this.taskstatusExcelData)
      .subscribe((response) => {
        console.log('uploadtaskstatus Results = ', JSON.stringify(response));
        var res = response;

        if (!res.includes('Failure')) {
          this.messsageResult = 'success';
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response,
          });
        }

        if (res.includes('Failure')) {
          this.messsageResult = 'failure';
          this.messageService.add({
            severity: 'Failure',
            summary: 'Failure',
            detail: response,
          });
        }

        this.showUploadtaskstatus = false;
        this.clearItems('progress');

      });
  }

  assigntoadmin() {
    this.showAssigntoAdminValidationMsg = '';

    if (this.assigntoadminfilename == '') {

      this.showAssigntoAdminValidationMsg = 'Please upload the file in correct format.';
      return;
    }

    if (this.assignAdminExcelData.length == 0) {
      this.showAssigntoAdminValidationMsg = 'Please upload the file in correct format.';
      return;
    }

    this.adminServices
      .AssigntoAdmin(this.assignAdminExcelData)
      .subscribe((response) => {
        console.log('adminNewhiresData Results = ', JSON.stringify(response));
        var res = response;

        if (!res.includes('Failure')) {
          this.messsageResult = 'success';
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response,
          });
        }

        if (res.includes('Failure')) {
          this.messsageResult = 'failure';
          this.messageService.add({
            severity: 'Failure',
            summary: 'Failure',
            detail: response,
          });
        }


        //this.getAssimilationInProgressList();
        //this.attentanceExcelData = [];
        this.showAssigntoAdmin = false;
        this.clearItems('progress');

      });
  }

  upload() {
    let uploadData = new FormData();
    let documentType = '';
    let documentName = '';
    let fileToUpload: any;

    this.filewarning = '';
    this.showfilewarning = false;

    //if (
    //  this.selectedFile.type != 'application/pdf' &&
    //  this.selectedFile.type !== 'application/mp4'
    //) {
    //  this.filewarning = 'only .pdf or .mp4 files are allowed';
    //  this.showfilewarning = true;
    //  //this.inductionContentInfo.contentFilename = '';
    //}

    //if (this.filewarning == '') {
    //  var filesize = parseFloat((this.selectedFile.size / 1048576).toFixed(2));

    //  if (filesize > 100) {
    //    this.filewarning = 'filesize should be at 100mb or less';
    //    this.showfilewarning = true;
    //    //this.inductionContentInfo.contentFilename = '';
    //  }
    //}

    if (this.showfilewarning == false) {
      fileToUpload = this.selectedFile;
      //this.uploadedFileDetails.id = false;
      //this.inductionContentInfo.contentFilename = this.selectedFile.name;
      //this.myform.get('contentfilename')?.setValue(this.selectedFile.name);
      this.showFileValidation = false;
    }
  }

  showSetCorpInductionPopup() {
    this.showSetCorpIndConf = true;
    this.corpdate = '';
    this.starttimeValue = '';
    this.endtimeValue = '';
    this.corpvalidationMsg = '';
    console.log(this.selected_processAssimilations);
    if (this.selected_processAssimilations.length > 0) {
      let selectedEmployees: any = [];
      forEach(this.selected_processAssimilations, (item) => {
        selectedEmployees.push({ empId: item.employeeId });
      });

      this.adminServices
        .getSessionList(selectedEmployees)
        .subscribe((response) => {
          console.log('getsessiontaskname', response);
          this.sessiontaskNames = response;
        });
    }
  }


  showAssigntoAdminPopup() {
    this.showSetAssgntoAdmin = true;
    this.showAssigntoAdminValidationMsg = '';
  }

  showUploadAttendancePopup() {
    this.showUploadAttendance = true;
    this.attentancefilename = '';
    this.attentanceExcelData = [];
    this.showFileValidation = true;
    this.showUploadAttendanceValidationMsg = '';
  }

  showUploadTaskStatusPopup() {
    this.showUploadtaskstatus = true;
    this.taskstatusfilename = '';
    this.taskstatusExcelData = [];
    this.showTaskStatusFileValidation = true;
    this.showUploadtaskstatusValidationMsg = '';
  }

  AssigntoAdminPopup() {
    this.showAssigntoAdmin = true;
    this.assigntoadminfilename = '';
    this.attentanceExcelData = [];
    this.showFileValidation = true;
    this.showAssigntoAdminValidationMsg = '';
  }

  deleteFile() {
    this.showFileValidation = true;
    this.attentancefilename = '';
    this.attentanceExcelData = [];
    this.showUploadAttendanceValidationMsg = '';
  }

  deleteFileAsgn() {
    this.showFileValidation = true;
    this.assigntoadminfilename = '';
    this.assignAdminExcelData = [];
    this.showAssigntoAdminValidationMsg = '';
  }

  deletetaskstatusFile() {
    this.showTaskStatusFileValidation = true;
    this.taskstatusfilename = '';
    this.taskstatusExcelData = [];
    this.showUploadtaskstatusValidationMsg = '';
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
    this.attentancefilename = this.selectedFile.name;

    event.stopPropagation();
    event.preventDefault();
    event.target.classList?.remove('dragging');

    this.selectedFile = (event.dataTransfer.files as FileList)[0];
    this.attentancefilename = this.selectedFile.name;

    if (
      this.selectedFile.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.showUploadAttendanceValidationMsg =
        'Please upload the file in correct format';
    }

    if (
      this.selectedFile.type ==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.readExcel();
    }
  }

  droptaskstatus(event: any, proofType: string = 'id') {
    //this.selectedFile = (event.dataTransfer.files as FileList)[0];
    //this.taskstatusfilename = this.selectedFile.name;

    event.stopPropagation();
    event.preventDefault();
    event.target.classList?.remove('dragging');

    this.fileUploadedTask = (event.dataTransfer.files as FileList)[0];
 this.taskstatusfilename = this.fileUploadedTask.name;

    if (
      this.fileUploadedTask.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.showUploadtaskstatusValidationMsg =
        'Please upload the file in correct format';
    }

    if (
      this.fileUploadedTask.type ==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.readtaskstatusExcel();
    }
  }

  dropagn(event: any, proofType: string = 'id') {
    this.selectedFile = (event.dataTransfer.files as FileList)[0];
    this.attentancefilename = this.selectedFile.name;

    event.stopPropagation();
    event.preventDefault();
    event.target.classList?.remove('dragging');

    this.selectedFile = (event.dataTransfer.files as FileList)[0];
    this.assigntoadminfilename = this.selectedFile.name;

    if (
      this.selectedFile.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.showAssigntoAdminValidationMsg =
        'Please upload the file in correct format';
    }

    if (
      this.selectedFile.type ==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.readExcelagn();
    }
  }

  /**
   * Settings tab - Key documents block
   */
  getGetAssociateKeyDocuments() {
    this.adminServices.getGetAssociateKeyDocuments().subscribe((list: any) => {
      // console.log(list);
      this.associateDocuments = list;
    });
  }

  deleteAssociateKeyDocument(ocmContentId: any) {
    this.adminServices
      .deleteAssociateKeyDocument(ocmContentId)
      .subscribe((response: any) => {
        // console.log(response);
        if (response == 1) {
          this.getGetAssociateKeyDocuments();
          this.messageService.add({
            severity: 'error',
            summary: 'Success',
            detail:
              'File deleted. Associates will no longer be able to view it in employee portal',
            styleClass: 'custom-error',
            sticky: false,
          });
        }
      });
  }
  /************************************/

  /**
   * Add Users popup block
   */
  getGetAdminList() {
    this.adminServices.getGetAdminList().subscribe((list) => {
      console.log(list);
      this.users = list;
    });
  }

  viewAddUser() {
    this.showAddUser = true;
    this.userIDs = '';
    this.verifiedUserIDs = [];
  }

  getVerifiedUsers() {
    let userIDs = {
      associateIDs: this.userIDs,
    };
    this.adminServices.getVerifiedUsers(userIDs).subscribe((list) => {
      console.log(list);
      // this.userIDs = '';
      this.verifiedUserIDs =
        list && list.length > 0
          ? _.filter(list, (item) => {
            return item.adminDetails.lastIndexOf('does not exist') == -1;
          })
          : [];
      this.verifiedUserIDs = _.uniq(
        _.map(this.verifiedUserIDs, 'adminDetails')
      );
      console.log(this.verifiedUserIDs);
    });
  }

  addUsers() {
    let userIDs: any = [];
    _.each(this.verifiedUserIDs, (user) => {
      userIDs.push(user.split(' - ')[0]);
    });
    // associateIDs: this.userIDs,
    let newUsers = {
      associateIDs: userIDs.toString(),
      role: this.newRoleType,
    };
    console.log(userIDs.toString());
    this.adminServices.addUsers(newUsers).subscribe((response) => {
      console.log(response);
      if (response.length > 0) {
        this.getGetAdminList();
        this.messageService.add({
          severity: 'Success',
          summary: 'Success',
          detail: response[response.length - 1].adminDetails,
        });
      }
    });
  }

  deleteUser() {
    console.log(this.selectedUser);
    this.adminServices
      .deleteUser(this.selectedUser.associateID)
      .subscribe((response: any) => {
        console.log(response);
        if (response == 1) {
          this.getGetAdminList();
          this.messageService.add({
            severity: 'error',
            summary: 'Success',
            detail: 'User access removed from portal',
            styleClass: 'custom-error',
          });
        }
      });
  }

  updateUserRole(newRole: any) {
    this.adminServices
      .updateUserRole(this.selectedUser.associateID, newRole)
      .subscribe((response: any) => {
        console.log(response);
        if (response == 1) {
          this.getGetAdminList();
          this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'User role changed to ' + newRole,
          });
        }
      });
  }

  removeVerifiedUser(userToRemove: any) {
    this.verifiedUserIDs = _.filter(this.verifiedUserIDs, (user) => {
      return user != userToRemove;
    });
  }
  /***********************/
}
