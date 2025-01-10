import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Observable,
  ReplaySubject,
  catchError,
  of,
  share,
  tap,
  timer,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../@core/services/token-storage.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AdminServicesService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  httpOptions2 = {
    headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
  };
  CACHE_TIMEOUT = 60 * 60 * 1000; // 1 Hr
  @Inject('BASE_URL')
  browserURL: string = '';
  baseURL: string = environment.production
    ? this.browserURL + 'api/admin/'
    : 'https://localhost:7174/3990/AdminModule/api/admin/';
  userID: string = '';
  roletype: string = '';
  country: any = [];
  Country: any = [];
  methodsThatReqErrorPageRedirection: any = [''];

  constructor(private router: Router, private http: HttpClient, private messageService: MessageService, private tokenStorage: TokenStorageService) {
    let appDataA: any = this.tokenStorage.getAppData();
    this.userID = appDataA.currentUser.isProxyEnabled == '1' ? appDataA.proxiedUser.associateID : appDataA.currentUser.associateID;
    this.roletype = appDataA.currentUser.isProxyEnabled == '1' ? appDataA.proxiedUser.roleType : appDataA.currentUser.roleType;
    this.Country = appDataA.currentUser.isProxyEnabled == '1' ? appDataA.proxiedUser.country : appDataA.currentUser.country;
    this.country.push(this.Country);
  }

  /**
   * API call to get the master list for various dropdowns
   * @returns Master list
   */
  //getMasterList$ =
  //  this.http
  //  .get<string>(this.baseURL + 'GetMasterList',
  //    { params: { associateID: this.userID }})     // this.httpOptions2)
  //  .pipe(
  //    tap((_) => console.log('fetched GetMasterList')),
  //    // map((response: any) => {
  //    //   return this.decryptData(response.encryptedValue);
  //    // }),
  //    share({
  //      connector: () => new ReplaySubject(1), // override default "new Subject()"
  //      resetOnComplete: () => timer(this.CACHE_TIMEOUT),
  //    }),
  //    catchError(this.handleError<any>('GetMasterList', []))
  //  );


  getMasterList(): Observable<any> {
    let queryParams = {
      associateID: this.userID,
    };
    return this.http
      .get<any>(this.baseURL + 'GetMasterList', {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched GetMasterList')),
        catchError(this.handleError<any>('GetMasterList', []))
      );
  }

  /**
   * API call to get the list of New hires assimilation list
   * @param filterOptions - options to filter the list
   * @returns AssimilationInProgressList
   */
  getAssimilationInProgressList(filterOptions: any): Observable<any> {
    let queryParams = {
      isNewJoiner: 1,
      loginId: this.userID,
    };
    // let qsEncValue = this.encryptData(queryParams);
    // let fbEncValue = this.encryptData(filterOptions);
    return this.http
      .post<any>(this.baseURL + 'GetFilteredDetails', filterOptions, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched AssimilationInProgressList')),
        // map((response: any) => {
        //   return this.decryptData(response.encryptedValue);
        // }),
        catchError(this.handleError<any>('getAssimilationInProgressList', []))
      );
  }


  /**
 * API call to get the list of New hires assimilation list
 * @param filterOptions - options to filter the list
 * @returns AssimilationInProgressList
 */
  getAssimilationInProgressAdminAssignList(filterOptions: any): Observable<any> {
    let queryParams = {
      isNewJoiner: 1,
      loginId: this.userID,
    };
    // let qsEncValue = this.encryptData(queryParams);
    // let fbEncValue = this.encryptData(filterOptions);
    return this.http
      .post<any>(this.baseURL + 'GetFilteredDetailsAdminList', filterOptions, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched AssimilationInProgressAdminAssignList')),
        // map((response: any) => {
        //   return this.decryptData(response.encryptedValue);
        // }),
        catchError(this.handleError<any>('getAssimilationInProgressAdminAssignList', []))
      );
  }


  /**
  * API call to get the list of New hires assimilation list
  * @param filterOptions - options to filter the list
  * @returns AssimilationInProgressList
  */
  getReportDownloadedList(filterOptions: any): Observable<any> {
    let queryParams = {
      isNewJoiner: 1,
      loginId: this.userID,
    };
    // let qsEncValue = this.encryptData(queryParams);
    // let fbEncValue = this.encryptData(filterOptions);
    return this.http
      .post<any>(this.baseURL + 'GetDownloadedReport', filterOptions, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched Downloaded Report')),
        // map((response: any) => {
        //   return this.decryptData(response.encryptedValue);
        // }),
        catchError(this.handleError<any>('getReportDownloadedList', []))
      );
  }


  getSessionList(corpInfo: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
    };
    return this.http
      .post<any>(this.baseURL + 'GetAssociateSessionList', corpInfo, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched GetAssociateSessionList')),
        catchError(this.handleError<any>('GetAssociateSessionList', []))
      );
  }


  /**
   * API call to get the list of pending candidates assimilation list
   * @param filterOptions - options to filter the list
   * @returns PendingAssimilationList
   */
  getPendingAssimilationList(filterOptions: any): Observable<any> {
    let queryParams = {
      isNewJoiner: 0,
      loginId: this.userID,
    };
    // let qsEncValue = this.encryptData(queryParams);
    // let fbEncValue = this.encryptData(filterOptions);
    return this.http
      .post<any>(this.baseURL + 'GetFilteredDetails', filterOptions, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched PendingAssimilationList')),
        // map((response: any) => {
        //   return this.decryptData(response.encryptedValue);
        // }),
        catchError(this.handleError<any>('PendingAssimilationList', []))
      );
  }


  /**
 * API call to get the list of Admin assigned list
 * @returns valid getSelectedAssimilationInProgressAdminAssign list
 */
  getSelectedAssimilationInProgressAdminAssignList(newHireIds: any, assignToAdminId: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
      adminId: this.userID,
    };
    return this.http
      .post<any>(this.baseURL + 'SaveAssignedPOC', newHireIds, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched getSelectedAssimilationInProgressAdminAssignList')),
        catchError(this.handleError<any>('getSelectedAssimilationInProgressAdminAssignList', []))
      );
  }


  /**
* API call to get the list of Admin assigned list
* @returns valid getSelectedAssimilationInProgressAdminAssign list
*/
  getSelectedOtherAdminAssignList(newHireIds: any, AssignToAdminId: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
      adminId: AssignToAdminId,
    };
    return this.http
      .post<any>(this.baseURL + 'SaveOtherAssignedPOC', newHireIds,  {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched getSelectedAssimilationInProgressAdminAssignList')),
        catchError(this.handleError<any>('getSelectedAssimilationInProgressAdminAssignList', []))
      );
  }

  /**
   * API call to get the list of Key Documents
   * @returns valid Documents list
   */
  getGetAssociateKeyDocuments(): Observable<any> {
    let queryParams = {
      loginId: this.userID,
    };
    return this.http
      .get<any>(this.baseURL + 'GetAssociateKeyDocuments', {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched AssociateKeyDocuments')),
        catchError(this.handleError<any>('AssociateKeyDocuments', []))
      );
  }

  /**
   * API call to upload associate documents
   * @returns confirmation
   */
  uploadAssociateKeyDocuments(
    fileData: any,
    plan: string,
    country: any = [],
    roleType: string,
    taskid:number
  ): Observable<any> {
   
    let queryParams = {
      loginId: this.userID,
      fileUploadData: fileData,
      plan:plan,
      country: country,
      roleType: roleType,
      TaskId: taskid,
    };
    debugger;
    return this.http
      .post<any>(this.baseURL + 'UploadAssociateKeyDocuments', {
        loginId: this.userID,
        fileUploadData: fileData,
        plan: plan,
        country: this.country,
        roleType: this.roletype,
        TaskId: 0
        
      })
      .pipe(
        tap((_) => console.log('upload associate documents')),
        catchError(this.handleError<any>('upload associate documents', []))
      );
  }

  /**
   * API call to delete the list of Key Documents
   * @returns valid Documents list
   */
  deleteAssociateKeyDocument(ocmContentId: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
      ocmContentId: ocmContentId,
    };
    return this.http
      .post<any>(
        this.baseURL + 'DeleteKeyDocuments',
        {},
        {
          params: queryParams,
        }
      )
      .pipe(
        tap((_) => console.log('deleted AssociateKeyDocument')),
        catchError(this.handleError<any>('delete AssociateKeyDocument', []))
      );
  }

  /**
   * API call to get the list of Admins & Super Admins
   * @returns valid Admins list
   */
  getGetAdminList(): Observable<any> {
    let queryParams = {
      loginId: this.userID,
    };
    return this.http
      .get<any>(this.baseURL + 'GetAdminList', {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched AdminList')),
        catchError(this.handleError<any>('AdminList', []))
      );
  }

  downloaddoc(
    associateId: string,
    ocmContentId: string,
  ): Observable<any> {
    debugger;
    let queryParams = {
      loginId: this.userID,
      associateId:associateId,
      ocmContentId:ocmContentId
    };
    return this.http
      .get<any>(this.baseURL + 'DownloadAssociateKeyDocuments', {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('Downloaded Document')),
        catchError(this.handleError<any>('AdminList', []))
      );
  }


  Updatedownloadeddocstatus(
    associateId: string,
    ocmContentId: string,
    taskId:string
  ): Observable<any> {
   
    let queryParams = {
      associateId: associateId,
      ocmContentId: ocmContentId,
      taskId: taskId
    };
    debugger;
    return this.http
      .post<any>(this.baseURL + 'UpdateDownloadDocStatus', {},{
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('UpdateDownloadDocStatus log')),
        catchError(this.handleError<any>('AdminList', []))
      );
  }


  UpdateDownloadedDocumentCompletedStatus(
    associateId: string,
    taskId: string,
    taskName: string,
  ): Observable<any> {

    let queryParams = {
      associateId: associateId,
      taskName: taskName,
      taskId: taskId
    };
    debugger;
    return this.http
      .post<any>(this.baseURL + 'UpdateAssociateCompletionStatus', {}, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('UpdateAssociateCompletionStatus log')),
        catchError(this.handleError<any>('AdminList', []))
      );
  }

  /**
   * API call to get the list of verified users
   * @param userIDs - userIDs list
   * @returns valid users list
   */
  getVerifiedUsers(userIDs: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
    };
    // let qsEncValue = this.encryptData(queryParams);
    // let fbEncValue = this.encryptData(filterOptions);
    return this.http
      .post<any>(this.baseURL + 'GetAdminIdName', userIDs, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched VerifiedUsersList')),
        // map((response: any) => {
        //   return this.decryptData(response.encryptedValue);
        // }),
        catchError(this.handleError<any>('VerifiedUsersList', []))
      );
  }

  /**
   * API call to get the list of verified users
   * @param userIDs - userIDs list
   * @returns valid users list
   */
  addUsers(newUsers: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
    };
    return this.http
      .post<any>(this.baseURL + 'SaveAdminRoleDetails', newUsers, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('added new users')),
        // map((response: any) => {
        //   return this.decryptData(response.encryptedValue);
        // }),
        catchError(this.handleError<any>('add new users', []))
      );
  }

  /**
   * API call to delete admin user
   * @returns confirmation
   */
  deleteUser(userId: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
      associateID: userId,
    };
    return this.http
      .post<any>(
        this.baseURL + 'DeleteAdminRoleDetails',
        {},
        {
          params: queryParams,
        }
      )
      .pipe(
        tap((_) => console.log('deleted User')),
        catchError(this.handleError<any>('delete User', []))
      );
  }

  /**
   * API call to update user role
   * @returns confirmation
   */
  updateUserRole(userId: any, newRole: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
      associateID: userId,
      role: newRole,
    };
    return this.http
      .post<any>(
        this.baseURL + 'UpdateAdminRoleDetails',
        {},
        {
          params: queryParams,
        }
      )
      .pipe(
        tap((_) => console.log('updated User role')),
        catchError(this.handleError<any>('updated User role', []))
      );
  }

  setCorporateInduction(taskInfo:any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
    };
    return this.http
      .post<any>(this.baseURL + 'SetCorpInduction', taskInfo, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched setCorporateInduction')),
        catchError(this.handleError<any>('setCorporateInduction', []))
      );
  }


  ReAssignPlan(selectedEmployee: any, assignPlan: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
      newJoinerID: selectedEmployee,
    };
    return this.http
      .post<any>(this.baseURL + 'ReAssignPlanonButtonClick', assignPlan, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched ReAssignPlan')),
        catchError(this.handleError<any>('ReAssignPlan', []))
      );
  }

  uploadAttentance(attentancelst: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
    };

    return this.http
      .post<any>(this.baseURL + 'SaveAttendanceDetails', attentancelst, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched uploadAttentance')),
        catchError(this.handleError<any>('uploadAttentance', []))
      );
  } 

  uploadTaskStatus(tasklst: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
    };

    return this.http
      .post<any>(this.baseURL + 'SaveUploadedTaskStatus', tasklst, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched uploadTaskStatus')),
        catchError(this.handleError<any>('uploadTaskStatus', []))
      );
  }

  AssigntoAdmin(newhireslst: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
    };

    return this.http
      .post<any>(this.baseURL + 'AssigntoAdminDetails', newhireslst, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched AssigntoAdmin')),
        catchError(this.handleError<any>('AssigntoAdmin', []))
      );
  }

  getAPTemplates(planId: string = ''): Observable<any> {
    let queryParams = {
      loginId: this.userID,
      planId,
    };
    // let qsEncValue = this.encryptData(queryParams);
    return (
      this.http
        // .get<any>(this.baseURL + 'GetAPTemplates', {
        .post<any>(
          this.baseURL + 'GetAPTemplates',
          {},
          {
            params: queryParams,
          }
        )
        .pipe(
          tap((_) => console.log('fetched getAPTemplates')),
          // map((response: any) => {
          //   return this.decryptData(response.encryptedValue);
          // }),
          catchError(this.handleError<any>('getAPTemplates', []))
        )
    );
  }

  saveAPTitle(filterOptions: any) {
    return this.http
      .post<any>(this.baseURL + 'SaveAPTitle', filterOptions, {
        params: { loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('executed saveAPTitle')),
        catchError(this.handleError<any>('saveAPTitle', []))
      );
  }

  deleteAssimilationPlanTemplate(filterOptions: any) {
    const queryparams = new HttpParams()
      .set('planId', filterOptions.deletePlanId)
      .set('loginId', this.userID);

    return this.http
      .post<any>(this.baseURL + 'DeleteAP', {}, { params: queryparams })
      .pipe(
        tap((_) => console.log('fetched DeleteAP')),
        catchError(this.handleError<any>('DeleteAP', []))
      );
  }

  getAssignPlan(planId: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
      planId: planId.toString(),
    };
    // let qsEncValue = this.encryptData(queryParams);
    return this.http
      .get<any>(this.baseURL + 'GetAssignPlan', {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched GetAssignPlan')),
        // map((response: any) => {
        //   return this.decryptData(response.encryptedValue);
        // }),
        catchError(this.handleError<any>('GetAssignPlan', []))
      );
  }

  saveAssignPlan(assignPlanIn: any, planId: any): Observable<any> {
    let queryParams = {
      loginId: this.userID,
      planId,
    };
    return this.http
      .post<any>(this.baseURL + 'SaveAssignPlan', assignPlanIn, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched saveAssignPlan')),
        catchError(this.handleError<any>('saveAssignPlan', []))
      );
  }

  getWelcomeEmail(planId: any): Observable<any> {
    let queryParams = {
      associateId: this.userID,
      planId,
    };
    return this.http
      .get<any>(this.baseURL + 'GetWelcomeEmail', {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('fetched getWelcomeEmail')),
        catchError(this.handleError<any>('getWelcomeEmail', []))
      );
  }

  updateWelcomeEmail(filterOptions: any) {
    let queryParams = {
      loginId: this.userID,
    };
    return this.http
      .post<any>(this.baseURL + 'UpdateWelcomeEmail', filterOptions, {
        params: queryParams,
      })
      .pipe(
        tap((_) => console.log('executed updateWelcomeEmail')),
        catchError(this.handleError<any>('updateWelcomeEmail', []))
      );
  }

  getDurationDetails() {
    return this.http
      .get<any>(this.baseURL + 'getDurationDetails', {
        params: { loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched getDurationDetails')),
        catchError(this.handleError<any>('getDurationDetails', []))
      );
  }

  addMileStone(milestoneInfo: any) {
    return this.http
      .post<any>(this.baseURL + 'AddMileStone', milestoneInfo, {
        params: { loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched addMileStone')),
        catchError(this.handleError<any>('addMileStone', []))
      );
  }

  editMileStone(milestoneInfo: any) {
    return this.http
      .post<any>(this.baseURL + 'EditMileStone', milestoneInfo, {
        params: { loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched EditMileStone')),
        catchError(this.handleError<any>('EditMileStone', []))
      );
  }

  deleteMileStone(mileStoneId: any) {
    const queryparams = new HttpParams()
      .set('mileStoneId', mileStoneId)
      .set('loginId', this.userID);

    return this.http
      .post<any>(this.baseURL + 'DeleteMileStone', {}, { params: queryparams })
      .pipe(
        tap((_) => console.log('fetched deleteMileStone')),
        catchError(this.handleError<any>('deleteMileStone', []))
      );
  }

  getMSTaskDetails(planId: any): Observable<any> {
    return this.http
      .get<any>(this.baseURL + 'GetMSTaskDetails', {
        params: { planId: planId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched getMSTaskDetails')),
        catchError(this.handleError<any>('getMSTaskDetails', []))
      );
  }

  getTaskMasterDetails(isManagerTask: any, planId: any): Observable<any> {
    return this.http
      .get<any>(this.baseURL + 'GetTaskMasterDetails', {
        params: {
          isManagerTask: isManagerTask,
          loginId: this.userID,
          planId: planId,
        },
      })
      .pipe(
        tap((_) => console.log('fetched GetTaskMasterDetails')),
        catchError(this.handleError<any>('GetTaskMasterDetails', []))
      );
  }

  addSelectedTask(task: any, mileStoneId: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + 'AddSelectedTask', task, {
        params: { mileStoneId: mileStoneId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched addSelectedTask')),
        catchError(this.handleError<any>('addSelectedTask', []))
      );
  }

  addManagerSelectedTask(task: any, planId: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + 'AddManagerSelectedTask', task, {
        params: { planId: planId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched AddManagerSelectedTask')),
        catchError(this.handleError<any>('AddManagerSelectedTask', []))
      );
  }

  editTask(task: any, mileStoneId: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + 'EditTask', task, {
        params: { mileStoneId: mileStoneId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched EditTask')),
        catchError(this.handleError<any>('EditTask', []))
      );
  }

  editManagerSelectedTask(task: any, planId: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + 'EditManagerSelectedTask', task, {
        params: { planId: planId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched EditManagerSelectedTask')),
        catchError(this.handleError<any>('EditManagerSelectedTask', []))
      );
  }

  deleteTask(
    taskId: any,
    isManagerTask: any,
    activeStatus: any
  ): Observable<any> {
    const queryparams = new HttpParams()
      .set('taskId', taskId)
      .set('isManagerTask', isManagerTask)
      .set('loginId', this.userID)
      .set('activeStatus', activeStatus);

    return this.http
      .post<any>(
        this.baseURL + 'DeleteTask',
        {},
        {
          params: queryparams,
        }
      )
      .pipe(
        tap((_) => console.log('fetched DeleteTask')),
        catchError(this.handleError<any>('DeleteTask', []))
      );
  }

  deleteCustomTask(
    selectedTaskId: any,
    isManagerTask: any,
    activeStatus: any
  ): Observable<any> {
    const queryparams = new HttpParams()
      .set('customTaskId', selectedTaskId)
      .set('isManagerTask', isManagerTask)
      .set('loginId', this.userID)
      .set('activeStatus', activeStatus);

    return this.http
      .post<any>(this.baseURL + 'DeleteCustomTask', {}, { params: queryparams })
      .pipe(
        tap((_) => console.log('fetched DeleteCustomTask')),
        catchError(this.handleError<any>('DeleteCustomTask', []))
      );
  }

  deleteSessionTask(
    TaskId: any,
    isManagerTask: any,
    activeStatus: any
  ): Observable<any> {
    const queryparams = new HttpParams()
      .set('sessionTaskId', TaskId)
      .set('isManagerTask', isManagerTask)
      .set('loginId', this.userID)
      .set('activeStatus', activeStatus);

    return this.http
      .post<any>(this.baseURL + 'DeleteSessionTask', {}, { params: queryparams })
      .pipe(
        tap((_) => console.log('fetched DeleteSessionTask')),
        catchError(this.handleError<any>('DeleteSessionTask', []))
      );
  }


  addCustomTask(task: any, mileStoneId: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + 'AddCustomTask', task, {
        params: { mileStoneId: mileStoneId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched AddCustomTask')),
        catchError(this.handleError<any>('AddCustomTask', []))
      );
  }

  addManagerCustomTask(task: any, planId: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + 'AddManagerCustomTask', task, {
        params: { planId: planId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched AddCustomTask')),
        catchError(this.handleError<any>('AddCustomTask', []))
      );
  }

  editCustomTask(task: any, mileStoneId: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + 'EditCustomTask', task, {
        params: { mileStoneId: mileStoneId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched EditCustomTask')),
        catchError(this.handleError<any>('EditCustomTask', []))
      );
  }

  editManagerCustomTask(task: any, planId: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + 'EditManagerCustomTask', task, {
        params: { planId: planId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched EditManagerCustomTask')),
        catchError(this.handleError<any>('EditManagerCustomTask', []))
      );
  }

  addSessionTask(task: any, mileStoneId: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + 'AddSessionTask', task, {
        params: { mileStoneId: mileStoneId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched AddSessionTask')),
        catchError(this.handleError<any>('AddSessionTask', []))
      );
  }

  EditSesssionTask(task: any, mileStoneId: any): Observable<any> {

    debugger;
    return this.http
      .post<any>(this.baseURL + 'EditSesssionTask', task, {
        params: { mileStoneId: mileStoneId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched EditSesssionTask')),
        catchError(this.handleError<any>('EditSesssionTask', []))
      );
  }

  getInductionContent(planId: any): Observable<any> {
    return this.http
      .get<any>(this.baseURL + 'GetInductionContent', {
        params: { planId: planId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched GetInductionContent')),
        catchError(this.handleError<any>('GetInductionContent', []))
      );
  }

  addInductionContent(contentInfo: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + 'AddInductionContent', contentInfo, {
        params: { loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched AddInductionContent')),
        catchError(this.handleError<any>('AddInductionContent', []))
      );
  }

  editInductionContent(contentInfo: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + 'EditInductionContent', contentInfo, {
        params: { loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched EditInductionContent')),
        catchError(this.handleError<any>('EditInductionContent', []))
      );
  }

  deleteInductionContent(IndContentId: any): Observable<any> {
    const queryparams = new HttpParams()
      .set('IndContentId', IndContentId)
      .set('loginId', this.userID);

    return this.http
      .post<any>(
        this.baseURL + 'DeleteInductionContent',
        {},
        { params: queryparams }
      )
      .pipe(
        tap((_) => console.log('fetched DeleteInductionContent')),
        catchError(this.handleError<any>('DeleteInductionContent', []))
      );
  }

  getManagerTaskDetails(planId: any): Observable<any> {
    return this.http
      .get<any>(this.baseURL + 'GetManagerTaskDetails', {
        params: { planId: planId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched getManagerTaskDetails')),
        catchError(this.handleError<any>('getManagerTaskDetails', []))
      );
  }

  getAssociateAssimilationProgress(assId: any): Observable<any> {
    return this.http
      .get<any>(this.baseURL + 'GetAssociateAssimilationProgress', {
        params: { associateID: assId, loginId: this.userID },
      })
      .pipe(
        tap((_) => console.log('fetched GetAssociateAssimilationProgress')),
        catchError(
          this.handleError<any>('GetAssociateAssimilationProgress', [])
        )
      );
  }

  publishPlan(planId: string) {
    let queryParams = {
      loginId: this.userID,
      planId,
    };
    return this.http
      .post<any>(
        this.baseURL + 'PublishPlan',
        {},
        {
          params: queryParams,
        }
      )
      .pipe(
        tap((_) => console.log('executed PublishPlan')),
        catchError(this.handleError<any>('PublishPlan', []))
      );
  }

  copyPlan(planId: string) {
    let queryParams = {
      loginId: this.userID,
      planId,
    };
    return this.http
      .post<any>(
        this.baseURL + 'CopyPlan',
        {},
        {
          params: queryParams,
        }
      )
      .pipe(
        tap((_) => console.log('executed CopyPlan')),
        catchError(this.handleError<any>('CopyPlan', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(operation);
      if (this.methodsThatReqErrorPageRedirection.includes(operation)) {
        this.router.navigate(['/error']);
      }

      this.messageService.add({
        severity: 'error',
        summary: operation,
        detail: 'Unable to retrieve data at the moment!',
        sticky: false,
        styleClass: 'custom-error',
      });

      // TODO: send the error to remote logging infrastructure if needed
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
