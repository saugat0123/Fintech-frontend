import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanActionService} from '../../../../loan/loan-action/service/loan-action.service';
import {AlertService} from '../../../../../@theme/components/alert/alert.service';
import {ToastService} from '../../../../../@core/utils';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SocketService} from '../../../../../@core/service/socket.service';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {ApprovalRoleHierarchyService} from '../../../../loan/approval/approval-role-hierarchy.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {CadStage} from '../../../model/cadStage';
import {RoleType} from '../../../../admin/modal/roleType';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {SecurityComplianceCertificateComponent} from '../legal-and-disbursement/security-compliance-certificate/security-compliance-certificate.component';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {DocAction} from '../../../../loan/model/docAction';
import {RoleService} from '../../../../admin/component/role-permission/role.service';
import {UserService} from '../../../../../@core/service/user.service';

@Component({
  selector: 'app-cad-action',
  templateUrl: './cad-action.component.html',
  styleUrls: ['./cad-action.component.scss']
})
export class CadActionComponent implements OnInit, OnChanges {

  @Input()
  selectedBranchId;

  @Input()
  cadId: number;

  @Input()
  currentStatus: any;

  @Input()
  currentCADStage: CadStage;

  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

  @Output() isActionClicked: EventEmitter<any> = new EventEmitter();

  popUpTitle: string;
  currentUserRoleType = false;

  formAction: FormGroup;

  spinner = false;
  submitted = false;
  userList = [];
  errorMsg;
  errorMsgStatus = false;
  currentUserId;
  isBackwardDisabled = false;
  isForwardDisabled = true;
  isApprovedDisabled = true;
  isSendToBranchDisabled = true;
  approvedLabel = 'APPROVED';
  backwardToolTip = 'return to previous user';
  roleType = RoleType;
  isOpened = false;
  forApproveMaker = [];
  hasBranchMaker = false;
  falseCredential = false;
  falseCredentialMessage = '';
  customerOfferLetter: CustomerOfferLetter;
  sendForwardBackwardList = [];
  roleId;
  isMaker = false;
  isCad = false;
  showHideReturnToRm = true;
  missingSignDoc = false;
  missingDraftDoc = false;
  public dialogRef: NbDialogRef<any>;
  customApproveSelection = false;
  isForApproveMaker = false;
  selectedTemplate;
  commentVar;
  committeeDefaultUser;
  branchMakerRole;
  toUserNull = false;
  showPoolCheck = true;
  isBackwardToDisabled = false;
  backwardToToolTip;
  allRoleHierarchy;
  private securityUrl = ApiConfig.TOKEN;
  private headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
  });

  constructor(private router: ActivatedRoute,
              private route: Router,
              private loanActionService: LoanActionService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private toastService: ToastService,
              private userService: UserService,
              private loanConfigService: LoanConfigService,
              private modalService: NgbModal,
              private http: HttpClient,
              private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
              private cadService: CreditAdministrationService,
              private roleService: RoleService,
              private socketService: SocketService,
              private routerUtilsService: RouterUtilsService,
              private nbDialogService: NbDialogService,
  ) {
  }

  async ngOnInit() {
    await this.getAllHierarchy();
    this.checkMakersInBranch();
    this.currentUserId = LocalStorageUtil.getStorage().userId;
    this.roleId = LocalStorageUtil.getStorage().roleId;
    if (LocalStorageUtil.getStorage().roleType === 'MAKER') {
      this.isMaker = true;
    } else if (LocalStorageUtil.getStorage().roleName === 'CAD') {
      this.isCad = true;
    } else {
      // this.getNewDocStatusOnApprove();
    }
    this.backwardTooltipMessageAndShowHideBackward();
    this.showHideCadActionButtons();

    this.checkForwardValidMessage();
  }

  getBackwardHierarchy() {
    this.approvalRoleHierarchyService.getBackwardRolesForRoleWithType(Number(LocalStorageUtil.getStorage().roleId), 'CAD', 0).subscribe(res => {
      this.sendForwardBackwardList = res.detail;
      this.spinner = false;
    }, error => {
      console.error(error);
      this.spinner = false;
    });
  }

  async getAllHierarchy() {
    await this.approvalRoleHierarchyService.findAll('CAD', 0)
    .toPromise().then((response: any) => {
      this.allRoleHierarchy = response.detail;
      this.sendForwardBackwardList = [];
      this.sendForwardBackwardList = response.detail;
      if (this.sendForwardBackwardList.length !== 0) {
        // if (this.isMaker && this.currentStatus === 'OFFER_PENDING') {
        //   this.sendForwardBackwardList = this.sendForwardBackwardList.filter(f => f.role.roleType !== RoleType.CAD_LEGAL);
        // }
        this.getUserList(this.sendForwardBackwardList[0].role);
      }
    });
  }

  checkMakersInBranch() {
    this.userService.getUserListByBranchIdAndMakerActive(this.selectedBranchId).subscribe(res => {
      if (res.detail.length > 0) {
        this.hasBranchMaker = true;
        this.branchMakerRole = res.detail[0].role;
      }
    });
  }

  checkForwardValidMessage() {
    const storage = LocalStorageUtil.getStorage();
    if (storage.roleType === 'MAKER') {
      this.missingSignDoc = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value =>
          value.draftPath === undefined || value.pathSigned === null).length > 0;
    }

    // CAD is fixed patched role
    if (storage.roleName === 'CAD') {
      this.missingDraftDoc = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value =>
          value.draftPath === undefined || value.draftPath === null).length > 0;
    }
  }

  onSubmit(templateLogin) {
    this.errorMsgStatus = false;
    this.falseCredential = false;
    this.submitted = true;
    // if (this.formAction.invalid) {
    //     return;
    // }

    this.onClose();
    this.closeNb();
    this.modalService.open(templateLogin);
    this.isOpened = false;
    this.isActionClicked.emit(this.isOpened);


  }

  onClose() {
    this.modalService.dismissAll(this.formAction.value);
    this.isOpened = false;
    this.isActionClicked.emit(this.isOpened);
    this.isForApproveMaker = false;
  }

  closeNb() {
    this.dialogRef.close();
    this.isOpened = false;
    this.isActionClicked.emit(this.isOpened);
    this.isForApproveMaker = false;
  }

  onLogin(dataValue) {

    const data: { email: string, password: string } = dataValue.value;
    data.email = LocalStorageUtil.getStorage().username;
    const requestBody = 'grant_type=password&username=' + data.email + '&password=' + data.password;
    this.http.post(this.securityUrl, requestBody, {headers: this.headers})
    .subscribe(
        () => {
          this.onClose();
          this.postAction();
        },
        error => {
          this.falseCredentialMessage = ObjectUtil.isEmpty(error.error.errorDescription) ? '' : error.error.errorDescription;
          this.falseCredential = true;
        }
    );


  }

  // public getNewDocStatusOnApprove() {
  //   // if (this.currentStatus === 'OFFER_AND_LEGAL_PENDING') {
  //   //   this.approvedLabel = 'APPROVE OFFER LETTER AND FORWARD';
  //   //   return 'OFFER_AND_LEGAL_APPROVED';
  //   // } else if (this.currentStatus === 'DOC_CHECK_PENDING') {
  //   //   return 'DOC_CHECK_APPROVED';
  //   // } else if (this.currentStatus === 'DISBURSEMENT_APPROVED') {
  //   //   return '0';
  //   // } else {
  //   //   return 'DISBURSEMENT_APPROVED';
  //   // }
  // }


  // public forwardBackwardDocStatusChange() {
  //   if (this.currentStatus === 'OFFER_AND_LEGAL_APPROVED') {
  //     return 'LEGAL_PENDING';
  //   } else if (this.currentStatus === 'LEGAL_APPROVED') {
  //     return 'DISBURSEMENT_PENDING';
  //   } else {
  //     return this.currentStatus;
  //   }

  postAction() {
    this.isForApproveMaker = false;
    if (LocalStorageUtil.getStorage().roleType === RoleType.CAS_CHECKER && this.popUpTitle === 'APPROVED') {
      this.cadService.checkByCadChecker(this.formAction.value).subscribe(res => {
        this.onClose();
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Action has been completed successfully'));
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.DANGER, 'Error while taking action. Please try again.'));
      });
    } else {
      this.cadService.saveAction(this.formAction.value).subscribe((response: any) => {
        this.onClose();
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Action has been completed successfully'));
        this.routerUtilsService.routeSummaryAndEncryptPathID(this.cadId);
      }, error => {
        this.forApproveMaker = [];
        switch (error.status) {
          case 417:
            this.commentVar = this.formAction.get('comment').value;
            // tslint:disable-next-line:max-line-length
            this.cadService.getMakerUserByBranchID
            (this.cadOfferLetterApprovedDoc.loanHolder.branch.id).subscribe((resUser: any) => {
              this.approvedForwardBackward(this.selectedTemplate, 'APPROVED', false);
              this.isForApproveMaker = true;
              this.forApproveMaker = resUser.detail;
              if (this.forApproveMaker.length < 1) {
                this.toastService.show(new Alert(AlertType.ERROR, 'NO User Found Please Contact Admin'));
              } else {
                this.formAction.patchValue({
                  toRole: this.forApproveMaker[this.forApproveMaker.length - 1].role,
                  toUser: this.forApproveMaker[this.forApproveMaker.length - 1],
                  customApproveSelection: true,
                  comment: this.commentVar

                });
              }
            }, error1 => this.toastService.show(new Alert(AlertType.ERROR, error1.error.message)));
            break;
        }
        this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

      });

    }
  }

  public getUserList(role) {
    this.userList = [];
    if (role.roleType === RoleType.CAD_LEGAL) {
      this.formAction.patchValue({
        toRole: role
      });
      this.formAction.get('toUser').clearValidators();
      this.formAction.updateValueAndValidity();
    } else {
      this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.selectedBranchId).subscribe((response: any) => {
        this.userList = response.detail;
        if (this.userList.length === 1) {
          this.formAction.patchValue({
            toUser: this.userList[0],
            toRole: role
          });
        } else if (this.userList.length > 1) {
          this.formAction.patchValue({
            toUser: this.userList[0],
            toRole: role
          });
          this.formAction.get('toUser').setValidators(Validators.required);
          this.formAction.updateValueAndValidity();
        } else {
          this.toastService.show(new Alert(AlertType.ERROR, 'NO User Present in this Role'));
        }
      });
    }
  }

  async approvedForwardBackward(template, val, returnToMaker) {
    this.selectedTemplate = template;
    this.popUpTitle = val;
    this.userList = [];
    if (this.popUpTitle === 'BACKWARD') {
      this.showPoolCheck = false;
    }
    if (this.popUpTitle === 'BACKWARD TO') {
      this.spinner = true;
      this.showPoolCheck = true;
      this.customApproveSelection = true;
      this.getBackwardHierarchy();
    }
    if (this.popUpTitle === 'FORWARD') {
      this.formAction = this.formBuilder.group(
          {
            toRole: [undefined, Validators.required],
            toUser: [undefined],
            cadId: [this.cadId],
            docAction: [val],
            toUserNull: [false],
            comment: [undefined, Validators.required],
            documentStatus: [this.currentStatus],
            isBackwardForMaker: returnToMaker,
          }
      );
      const approvalType = 'CAD';
      const refId = 0;


    } else if (this.popUpTitle === 'SEND TO BRANCH') {
      /* @TODO: Change this */
      // await this.userService.getDefaultCommunityUser().then(res => {
      //     this.committeeDefaultUser = res.detail;
      // });
      this.showPoolCheck = false;
      this.formAction = this.formBuilder.group(
          {
            toRole: [this.branchMakerRole],
            cadId: [this.cadId],
            docAction: [DocAction.FORWARD],
            comment: [undefined, Validators.required],
            documentStatus: [this.currentStatus],
            isBackwardForMaker: returnToMaker,
            sendToBranch: true,
            toUserNull: true
          }
      );
      const approvalType = 'CAD';
      const refId = 0;

    } else if (this.popUpTitle === 'APPROVED') {
      this.showPoolCheck = false;
      const newDocStatus = this.getApprovalStatus();
      this.popUpTitle = this.approvedLabel;
      // if (newDocStatus === '0') {
      //   this.toastService.show(new Alert(AlertType.ERROR, 'This Document is Already Approved'));
      //   return;
      // }
      this.formAction = this.formBuilder.group(
          {
            cadId: [this.cadId],
            docAction: [newDocStatus],
            comment: [undefined, Validators.required],
            documentStatus: [newDocStatus],
            isBackwardForMaker: returnToMaker,
            customApproveSelection: [false],
            toUser: [undefined],
            toRole: [undefined]
          }
      );
    } else {
      this.formAction = this.formBuilder.group(
          {
            cadId: [this.cadId],
            docAction: [DocAction.BACKWARD],
            comment: [undefined, Validators.required],
            documentStatus: [this.currentStatus],
            isBackwardForMaker: returnToMaker,
            customApproveSelection: [this.customApproveSelection],
            toUser: [undefined],
            toRole: [undefined]
          }
      );

    }
    // this.modalService.open(template,{backdrop: false, scrollable: true});
    this.dialogRef = this.nbDialogService.open(template,
        {
          closeOnBackdropClick: false,
          hasBackdrop: false,
          hasScroll: true
        });

    this.isOpened = true;
    this.isActionClicked.emit(this.isOpened);
  }

  public showHideCadActionButtons() {
    // send to branch -> cas maker / cad
    if (RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CAS_MAKER) {
      this.isSendToBranchDisabled = false;
    }

    // forward -> enable forward for maker and rm and for checkers if coming from above hierarchy
    if (((RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.MAKER)
            || (RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CAS_MAKER)
            || (RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CAS_DOC_MAKER)
            || (RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CLAD_MAKER))
        ||
        // enable forward button for checkers if coming from above hierarchy
        (this.checkIfFromAboveHierarchy()
            && (RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CAS_CHECKER
                || RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CAS_DOC_CHECKER
                || RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CLAD_CHECKER
            )
        )) {
      this.isForwardDisabled = false;
    }

    // backward and approve -> cas checker, cas doc checker, clad checker
    if (((RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CAS_CHECKER)
            || (RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CAS_DOC_CHECKER)
            || (RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CLAD_CHECKER))
        && !this.checkIfFromAboveHierarchy()
    ) {
      this.isApprovedDisabled = false;
    }

    if (this.currentCADStage.fromUser.id === Number(LocalStorageUtil.getStorage().userId)) {
      this.isBackwardDisabled = true;
    }

    if (this.currentCADStage.fromRole.id === Number(LocalStorageUtil.getStorage().userId)
        // || (RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CAS_CHECKER)
        // || (this.currentCADStage.fromRole.roleType === this.roleType.CAD_SUPERVISOR)
    ) {
      this.isBackwardDisabled = true;
    }

    if ((RoleType[LocalStorageUtil.getStorage().roleType] === RoleType.CAS_MAKER)) {
      this.isBackwardToDisabled = true;
    }
  }

  public backwardTooltipMessageAndShowHideBackward() {
    const user = this.currentCADStage.fromUser.name + ' (' + this.currentCADStage.fromRole.roleName + ')';
    // tslint:disable-next-line:max-line-length
    if (this.currentCADStage.fromRole.id === Number(LocalStorageUtil.getStorage().userId)
        // || (this.currentCADStage.fromRole.roleType === this.roleType.CAD_ADMIN)
        // || (this.currentCADStage.fromRole.roleType === this.roleType.CAD_SUPERVISOR)
    ) {
      this.isBackwardDisabled = true;
    } else {
      this.backwardToolTip = 'return file to ' + user;
    }
    if (this.currentCADStage.fromRole.roleType === this.roleType.MAKER) {
      this.showHideReturnToRm = false;
    }
  }

  openModel() {
    this.nbDialogService.open(SecurityComplianceCertificateComponent, {context: {cadFile: this.cadOfferLetterApprovedDoc}});
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkForwardValidMessage();
  }

  updateToUserNull($event) {
    this.toUserNull = this.formAction.get('toUserNull').value;
  }

  getApprovalStatus() {
    switch (RoleType[LocalStorageUtil.getStorage().roleType]) {
      case this.roleType.CAS_DOC_CHECKER:
        return 'DOC_CHECK_APPROVED';
        break;
      case this.roleType.CLAD_CHECKER:
        return 'DISBURSEMENT_APPROVED';
        break;
      default:
        return 'OFFER_AND_LEGAL_APPROVED';
    }
  }

  checkIfFromAboveHierarchy() {
    if (this.allRoleHierarchy.filter(arh => arh.role.id === this.currentCADStage.fromRole.id)[0].roleOrder < this.allRoleHierarchy.filter(arh1 => arh1.role.id === Number(LocalStorageUtil.getStorage().roleId))[0].roleOrder) {
      return true;
    }
    return false;
  }

}
