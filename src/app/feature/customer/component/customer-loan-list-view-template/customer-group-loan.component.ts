import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {LoanType} from '../../../loan/model/loanType';
import {CustomerService} from '../../service/customer.service';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {Customer} from '../../../admin/modal/customer';
import {CustomerRelative} from '../../../admin/modal/customer-relative';
import {LoanAmountType} from '../../model/loanAmountType';
import {FetchLoan} from '../../model/fetchLoan';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Guarantor} from '../../../loan/model/guarantor';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {SingleCombinedLoanDto} from '../../dto/single-combined-loan.dto';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {DocStatus} from '../../../loan/model/docStatus';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {LoanStage} from '../../../loan/model/loanStage';
import {ChangeLoanComponent} from '../change-loan/change-loan.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {LoginPopUp} from '../../../../@core/login-popup/login-pop-up';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {DocAction} from '../../../loan/model/docAction';
import {RoleType} from '../../../admin/modal/roleType';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoanTag} from '../../../loan/model/loanTag';
import {VideoKycComponent} from '../../../video-kyc/video-kyc.component';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {CommonLoanDataComponent} from '../customer-loan-information/common-loan-data/common-loan-data.component';
import {NbDialogRef, NbDialogService} from '@nebular/theme';


@Component({
  selector: 'app-customer-group-loan',
  templateUrl: './customer-group-loan.component.html',
  styleUrls: ['./customer-group-loan.component.scss']
})
export class CustomerGroupLoanComponent implements OnInit, OnChanges {

  constructor(private router: Router,
              private customerService: CustomerService,
              private customerLoanService: LoanFormService,
              private modalService: NgbModal,
              private spinnerService: NgxSpinnerService,
              private toastService: ToastService,
              private  activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private ngxSpinnerService: NgxSpinnerService,
              private nbDialogModal: NbDialogService
              ) {
  }
  totalApprovedProposedAmount;
  totalRejectProposedAmount;
  totalClosedProposedAmount;
  totalInitialPendingProposedAmount;
  totalApprovedCollateralAmount;
  totalRejectCollateralAmount;
  totalClosedCollateralAmount;
  totalInitialPendingCollateralAmount;

  public static LOAN_CHANGE = 'loanChange';
  public static LOAN_DELETE = 'loanDelete';
  @Input()
  formValue: Customer;
  customer: Customer;
  @Input()
  customerInfo: CustomerInfoData;
  @Input()
  fetchType: FetchLoan;

  @Output() messageToEmit: EventEmitter<LoanAmountType> = new EventEmitter();
  @Output() deleteEmitter = new EventEmitter();

  fetchLoan = FetchLoan;
  @Input()
  total: number;
  @Input() customerLoans;
  spinner = false;
  loanHistories: SingleCombinedLoanDto[];
  toggleArray: { toggled: boolean }[] = [];
  customerGroupLoanList: Array<LoanDataHolder> = Array<LoanDataHolder>();
  loanAssociatedByKYC: Array<LoanDataHolder> = Array<LoanDataHolder>();
  loanAssociatedByGuarantor: Array<LoanDataHolder> = Array<LoanDataHolder>();
  loanType = LoanType;
  totalLoanProposedAmount = 0;
  totalProposedAmountByKYC = 0;
  totalProposalAmount = 0;
  totalProposedAmountByGuarantor = 0;
  totalRequiredCollateral = 0;
  collateralDtoData = {
    totalRequiredCollateral: 0,
    totalFMV_ConsiderValue: 0,
    deficit_Surplus: 0,
    coveragePercent: 0,
    loanExposure: 0,
    totalApprovedLimit: 0,
    totalPendingLimit: 0,
    totalRejectProposedLimit: 0,
    totalRejectRequiredCollateral: 0,
    totalClosedProposedLimit: 0,
    totalClosedRequiredCollateral: 0,
    totalApprovedRequiredCollateral: 0,
    totalPendingRequiredCollateral: 0,
  };

  currentUserId = LocalStorageUtil.getStorage().userId;
  currentUserRoleType = LocalStorageUtil.getStorage().roleType;
  loanActionList = [];
  loan = [];
  singleLoan: LoanDataHolder;
  loanTag = LoanTag;
  isLoaded = false;
  canReInitiateLoan = false;
  reInitiateSpinner = false;
  reInitiateLoanCustomerName: string;
  reInitiateLoanFacilityName: string;
  reInitiateLoanBranchName: string;
  reInitiateLoanType: string;
  formAction: FormGroup;
  displaySecurity = false;
  isCombineLoan = false;
  loanConfigData = [{
    loanName: null,
    loanType: null
  }];
  loanData = [{
    loanConfigId: null,
    customerLoanId: null,
    toUser: null,
    toRole: null,
    docAction: null,
    comment: null,
    documentStatus: null
  }];
  isLoanBeginEdit = false;
  @Output() public triggerCustomerRefresh = new EventEmitter<boolean>();
  nbDialogRef: NbDialogRef<any>;
  COMBINED_KEY = 'Combined Loan';

  ngOnChanges(changes: SimpleChanges): void {
    this.initial();

  }

  ngOnInit() {
    this.initial();
    this.loanActionList = [{
      key: CustomerGroupLoanComponent.LOAN_CHANGE,
      value: 'Change Loan'
    }];
    if (!ObjectUtil.isEmpty(this.customerLoans)) {
      this.loan = this.customerLoans;

      this.isLoaded = true;
      this.loan = this.loan.filter((l) => l.documentStatus !== DocStatus.value(DocStatus.APPROVED));
    } else {
      this.customerLoanService.getLoansByLoanHolderId(this.customerInfo.id).subscribe((data: any) => {
        this.loan = data.detail;
        this.isLoaded = true;
        this.loan = this.loan.filter((l) => l.documentStatus !== DocStatus.value(DocStatus.APPROVED));
      });
    }

    if (LocalStorageUtil.getStorage().username === 'SPADMIN'
        || LocalStorageUtil.getStorage().roleType === RoleType.ADMIN
        || LocalStorageUtil.getStorage().roleType === RoleType.MAKER) {
      this.canReInitiateLoan = true;
    }
    this.buildActionForm();
    // this.displaySecurityDetails();
  }

  getCustomerLoans() {
    this.spinner = true;
    this.customerLoanService.getFinalLoanListByLoanHolderId(this.customerInfo.id).subscribe((res: any) => {
      this.customerGroupLoanList = res.detail;
      this.loanHistories = this.groupCombinedLoan(this.customerGroupLoanList);
      this.loanHistories.forEach(() => this.toggleArray.push({toggled: false}));
      this.spinner = false;
      this.totalLoanProposedAmount = 0;
      this.collateralDtoData.totalApprovedRequiredCollateral = 0;
      this.collateralDtoData.totalApprovedLimit = 0;
      this.collateralDtoData.totalPendingRequiredCollateral = 0;
      this.collateralDtoData.totalPendingLimit = 0;
      this.collateralDtoData.totalRequiredCollateral = 0;
      this.collateralDtoData.totalRejectProposedLimit = 0;
      this.collateralDtoData.totalRejectRequiredCollateral = 0;
      this.collateralDtoData.totalClosedProposedLimit = 0;
      this.collateralDtoData.totalClosedRequiredCollateral = 0;

      // Total Approved Proposed Amount

      const totalApprovedProposedAmount = [];
      this.customerGroupLoanList.map(val => {
        if (val.documentStatus.toString() === DocStatus.value(DocStatus.APPROVED )) {
          totalApprovedProposedAmount.push(val.proposal.proposedLimit);
        }
      });
      this.totalApprovedProposedAmount = totalApprovedProposedAmount.reduce((a, b) => Number(a) + Number(b), 0);


      // Total Approved Collateral Amount
      let totalApprovedCollateralAmount = 0;
     this.customerGroupLoanList.forEach(value => {
       if (value.documentStatus.toString() === DocStatus.value(DocStatus.APPROVED )) {
         totalApprovedCollateralAmount += value.proposal.proposedLimit * (value.proposal.collateralRequirement / 100);
       }
     });
     this.totalApprovedCollateralAmount = totalApprovedCollateralAmount



//    Total Rejected Proposed Amount
      const totalRejectProposedAmount = [];
      this.customerGroupLoanList.map(val => {
        if (val.documentStatus.toString() === DocStatus.value(DocStatus.REJECTED)) {
          totalRejectProposedAmount.push(val.proposal.proposedLimit);
        }
      });
      this.totalRejectProposedAmount = totalRejectProposedAmount.reduce((a, b) => Number(a) + Number(b), 0);


      // Total Rejected Collateral Amount
      let totalRejectCollateralAmount = 0;
      this.customerGroupLoanList.forEach(value => {
        if(value.documentStatus.toString() === DocStatus.value(DocStatus.REJECTED )) {
          totalRejectCollateralAmount += value.proposal.proposedLimit * (value.proposal.collateralRequirement / 100);
        }
      });
      this.totalRejectCollateralAmount = totalRejectCollateralAmount;


// Total Closed Proposed Amount
      const totalClosedProposedAmount = [];
      this.customerGroupLoanList.map(val => {
        if (val.documentStatus.toString() === DocStatus.value(DocStatus.CLOSED)) {
          totalClosedProposedAmount.push(val.proposal.proposedLimit);
        }
      });
      this.totalClosedProposedAmount = totalClosedProposedAmount.reduce((a, b) => Number(a) + Number(b), 0);


      // Total Closed Collateral Amount

      let totalClosedCollateralAmount = 0;
      this.customerGroupLoanList.forEach(value => {
        if (value.documentStatus.toString() === DocStatus.value(DocStatus.CLOSED )) {
          totalClosedCollateralAmount += value.proposal.proposedLimit * (value.proposal.collateralRequirement / 100);
        }
      });
      this.totalClosedCollateralAmount = totalClosedCollateralAmount;


// Total Initial Pending UnderDiscussion Under Review Proposed Amount
      const totalInitialPendingProposedAmount = [];
      this.customerGroupLoanList.map(val => {
        if  (val.documentStatus.toString() === DocStatus.value(DocStatus.PENDING) ||
            (val.documentStatus.toString() === DocStatus.value(DocStatus.DISCUSSION)) ||
            (val.documentStatus.toString() === DocStatus.value(DocStatus.INITIAL)) ||
            (val.documentStatus.toString() === DocStatus.value(DocStatus.UNDER_REVIEW))) {
          totalInitialPendingProposedAmount.push(val.proposal.proposedLimit);
        }
      });
      this.totalInitialPendingProposedAmount = totalInitialPendingProposedAmount.reduce((a, b) => Number(a) + Number(b), 0);



      // Total Initial Pending UnderDiscussion Under Review Proposed Amount
      let totalInitialPendingCollateralAmount = 0;
      this.customerGroupLoanList.forEach(value => {
        if  (value.documentStatus.toString() === DocStatus.value(DocStatus.PENDING) ||
            (value.documentStatus.toString() === DocStatus.value(DocStatus.DISCUSSION)) ||
            (value.documentStatus.toString() === DocStatus.value(DocStatus.INITIAL)) ||
            (value.documentStatus.toString() === DocStatus.value(DocStatus.UNDER_REVIEW)) ||
            (value.documentStatus.toString() === DocStatus.value(DocStatus.VALUATION)) ||
            (value.documentStatus.toString() === DocStatus.value(DocStatus.DOCUMENTATION))) {
          totalInitialPendingCollateralAmount += value.proposal.proposedLimit * (value.proposal.collateralRequirement / 100);
        }
      });
      this.totalInitialPendingCollateralAmount = totalInitialPendingCollateralAmount;


      // Total Loan Proposed Amount

      this.totalLoanProposedAmount = this.totalInitialPendingProposedAmount + this.totalApprovedProposedAmount;

// Total Required Collateral
      this.collateralDtoData.totalRequiredCollateral = this.totalInitialPendingCollateralAmount + this.totalApprovedCollateralAmount;
      // this.calculateCollateralData();
      const loanAmountType = new LoanAmountType();
      loanAmountType.type = this.fetchLoan.CUSTOMER_LOAN;
      loanAmountType.value = this.totalLoanProposedAmount;
      this.messageToEmit.emit(loanAmountType);
    }, error => this.spinner = false);
  }

  // calculateCollateralData() {
  //   if (!ObjectUtil.isEmpty(this.customerInfo.security)) {
  //     this.collateralDtoData.deficit_Surplus = this.customerInfo.security.totalSecurityAmount -
  //         this.collateralDtoData.totalRequiredCollateral;
  //     this.collateralDtoData.coveragePercent = (this.customerInfo.security.totalSecurityAmount /
  //         (this.totalLoanProposedAmount)) * 100;
  //     this.collateralDtoData.loanExposure = (
  //         (this.totalLoanProposedAmount) / this.customerInfo.security.totalSecurityAmount) * 100;
  //   }
  // }

  groupCombinedLoan(customerLoans: LoanDataHolder[]): SingleCombinedLoanDto[] {
    const loanHistories: SingleCombinedLoanDto[] = [];
    for (const loan of customerLoans) {
      // if loan is not combined
      if (ObjectUtil.isEmpty(loan.combinedLoan)) {
        loanHistories.push({
          id: loan.id,
          customerInfoCustomerName: loan.loanHolder.name,
          branchName: loan.branch.name,
          loanId: loan.loan.id,
          loanName: loan.loan.name,
          loanIsFundable: loan.loan.isFundable,
          proposalProposedLimit: loan.proposal.proposedLimit,
          loanType: loan.loanType,
          documentStatus: loan.documentStatus,
          createdAt: loan.createdAt,
          collateralRequirement: loan.proposal.collateralRequirement,
          requiredCollateral: loan.proposal.collateralRequirement,
          currentStage: loan.currentStage,
          parentId: loan.parentId,
          loan: loan.loan,
          proposal: loan.proposal
        });
      } else if (   // check if combined loan is not included already
          !loanHistories.filter((l) => !ObjectUtil.isEmpty(l.combinedLoans))
          .map((l) => l.id).includes(loan.combinedLoan.id)
      ) {
        // find all combined loans if the loan is combined
        const combinedLoans = this.customerGroupLoanList
        .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan))
        .filter((l) => l.combinedLoan.id === loan.combinedLoan.id);
        // create single combined dto
        let documentStat = null;
        const result = combinedLoans.filter((value, index, self) =>
            self.findIndex((m) => m.documentStatus === value.documentStatus) === index);
        if (result.length > 1) {
          documentStat = 'N/A';
        } else {
          documentStat = combinedLoans[0].documentStatus;
        }
        const dto: SingleCombinedLoanDto = {
          collateralRequirement: 0, requiredCollateral: 0,
          id: combinedLoans[0].combinedLoan.id,
          customerInfoCustomerName: combinedLoans[0].loanHolder.name,
          branchName: combinedLoans[0].branch.name,
          loanName: 'Combined Loan',
          proposalProposedLimit: combinedLoans
          .map((l) => l.proposal.proposedLimit)
          .reduce((a, b) => a + b, 0),
          loanType: 'N/A',
          documentStatus: documentStat,
          createdAt: combinedLoans[0].combinedLoan.createdAt,
          currentStage: null,
          combinedLoans: combinedLoans.map((l) => {
            const singleCombinedLoanDto: SingleCombinedLoanDto = {
              id: l.id,
              customerInfoCustomerName: l.loanHolder.name,
              branchName: l.branch.name,
              loanId: l.loan.id,
              loanName: l.loan.name,
              proposalProposedLimit: l.proposal.proposedLimit,
              loanType: l.loanType,
              documentStatus: l.documentStatus,
              createdAt: l.createdAt,
              collateralRequirement: l.proposal.collateralRequirement,
              requiredCollateral: l.proposal.collateralRequirement,
              currentStage: l.currentStage,
              parentId: l.parentId,
              loan: l.loan,
              proposal: l.proposal
            };
            return singleCombinedLoanDto;
          }),
          loan: loan.loan,
          proposal: loan.proposal
        };
        loanHistories.push(dto);
      }
    }
    return loanHistories;
  }

  loanHistoriesGroup(loans: SingleCombinedLoanDto[]): {
    pending: SingleCombinedLoanDto[],
    funded: SingleCombinedLoanDto[],
    nonFunded: SingleCombinedLoanDto[],
    rejected: SingleCombinedLoanDto[],
    closed: SingleCombinedLoanDto[],
    approved: SingleCombinedLoanDto[],
  } {
    if (!ObjectUtil.isEmpty(this.loanHistories)) {
      return {
        pending: loans.filter((l) => (l.documentStatus !== DocStatus[DocStatus.APPROVED])
            && (l.documentStatus !== DocStatus[DocStatus.REJECTED]) && (l.documentStatus !== DocStatus[DocStatus.CLOSED])),
        funded: loans.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED] && l.loanIsFundable),
        nonFunded: loans.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED] && !l.loanIsFundable),
        rejected: loans.filter((l) => l.documentStatus === DocStatus[DocStatus.REJECTED]),
        closed: loans.filter((l) => l.documentStatus === DocStatus[DocStatus.CLOSED]),
        approved: loans.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED]),
      };
    }
  }

  getLoanOfCustomerAssociatedToByKYC() {
    this.spinner = true;
    const customerRelative = new CustomerRelative();
    customerRelative.customerRelativeName = this.customer.customerName;
    customerRelative.citizenshipNumber = this.customer.citizenshipNumber;
    customerRelative.citizenshipIssuedDate = this.customer.citizenshipIssuedDate;
    this.customerLoanService.getLoanByCustomerKyc(customerRelative).subscribe((res: any) => {
      this.customerGroupLoanList = res.detail;
      this.spinner = false;
      this.totalProposedAmountByKYC = 0;
      this.customerGroupLoanList.forEach((l) => {
        if (l.proposal) {
          this.totalProposedAmountByKYC = this.totalProposedAmountByKYC + l.proposal.proposedLimit;
        }

      });
      const loanAmountType = new LoanAmountType();
      loanAmountType.type = this.fetchLoan.CUSTOMER_AS_KYC;
      loanAmountType.value = this.totalProposedAmountByKYC;
      this.messageToEmit.emit(loanAmountType);
    });
  }

  onClick(loanConfigId: number, customerId: number, currentStage: LoanStage) {
    this.modalService.dismissAll();
    this.spinnerService.show();
    if (!ObjectUtil.isEmpty(currentStage)) {
      if ((currentStage.toUser.id.toString() === this.currentUserId) && (this.currentUserRoleType === 'MAKER')) {
        this.router.navigate(['/home/loan/summary'], {
          queryParams: {
            loanConfigId: loanConfigId,
            customerId: customerId
          }
        });
      } else {
        this.router.navigate(['/home/loan/summary'], {
          queryParams: {
            loanConfigId: loanConfigId,
            customerId: customerId,
            catalogue: true
          }
        });
      }
    } else {
      this.router.navigate(['/home/loan/summary'], {
        queryParams: {
          loanConfigId: loanConfigId,
          customerId: customerId,
          catalogue: true
        }
      });
    }
    this.spinnerService.hide();
  }

  initial() {
    this.customer = this.formValue;
    if (this.fetchType === this.fetchLoan.CUSTOMER_LOAN) {
      if (this.customerInfo.id !== undefined) {
        this.getCustomerLoans();
      }
    }
    if (this.fetchType === this.fetchLoan.CUSTOMER_AS_KYC) {
      if (this.customer.id !== undefined) {
        this.getLoanOfCustomerAssociatedToByKYC();
      }
    }
    if (this.fetchType === this.fetchLoan.CUSTOMER_AS_GUARANTOR) {
      if (this.customer.id !== undefined) {
        this.getLoanByCustomerAsGuarantor();
      }
    }
  }

  getLoanByCustomerAsGuarantor() {
    this.spinner = true;
    const guarantor = new Guarantor();
    guarantor.name = this.customer.customerName;
    guarantor.citizenNumber = this.customer.citizenshipNumber;
    guarantor.issuedYear = this.customer.citizenshipIssuedDate;
    guarantor.district = this.customer.district;
    guarantor.province = this.customer.province;
    this.customerLoanService.getLoanOfCustomerAsGuarantor(guarantor).subscribe((res: any) => {
      this.customerGroupLoanList = res.detail;
      this.spinner = false;
      this.totalProposedAmountByGuarantor = 0;
      this.customerGroupLoanList.forEach((l) => {
        if (l.proposal) {
          this.totalProposedAmountByGuarantor = this.totalProposedAmountByGuarantor + l.proposal.proposedLimit;
        }

      });
      const loanAmountType = new LoanAmountType();
      loanAmountType.type = this.fetchLoan.CUSTOMER_AS_GUARANTOR;
      loanAmountType.value = this.totalProposedAmountByGuarantor;
      this.messageToEmit.emit(loanAmountType);
    });

  }

  addRequiredCollateral(collateralRequirement: number, proposalLimit) {
    return collateralRequirement * proposalLimit;
  }

  changeLoan(id: number, loanConfigId: number) {
    const modelRef = this.modalService.open(ChangeLoanComponent, {backdrop: false});
    modelRef.componentInstance.customerType = this.customerInfo.customerType;
    modelRef.componentInstance.currentLoanConfigId = loanConfigId;
    modelRef.componentInstance.customerLoanId = id;


  }

  addVideoKyc(model) {
    this.customerLoanService.detail(model.id).subscribe((data) => {
      const ref =  this.modalService.open(VideoKycComponent, {size: 'xl', backdrop: true});
      ref.componentInstance.showSender = false;
      ref.componentInstance.showHeader = true;
      ref.componentInstance.showBenificiary = true;
      ref.componentInstance.remitCustomer = data.detail.remitCustomer;
    });
  }
  deleteLoan(id: number) {
    const ref = this.modalService.open(LoginPopUp);
    let isAuthorized = false;

    ref.componentInstance.returnAuthorizedState.subscribe((receivedEntry) => {
      isAuthorized = receivedEntry;

      if (isAuthorized) {
        this.modalService.dismissAll();
        this.spinner = true;
        this.customerLoanService.deleteLoanByAdminAndMaker(id).subscribe(() => {
          this.deleteEmitter.emit();
          this.getCustomerLoans();
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Delete Loan'));
        }, error => {
          this.spinner = false;
          this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
      }
    });
  }

  onReInitiateClick(template, customerLoanId, customerName, loanFacilityName, loanType, branchName, combineLoan) {
    this.loanData = [];
    if (!ObjectUtil.isEmpty(combineLoan)) {
      this.loanConfigData = [];
      this.isCombineLoan = true;
      combineLoan.forEach((cl) => {
        this.reInitiateLoanCustomerName = customerName;
        this.reInitiateLoanBranchName = branchName;
        // this.reInitiateLoanType = cl.loanType;
        this.loanConfigData.push({
          loanType: cl.loanType,
          loanName: cl.loanName,
        });
        this.loanData.push({
          loanConfigId: null,
          customerLoanId: cl.id,
          toUser: null,
          toRole: null,
          docAction: DocAction.value(DocAction.RE_INITIATE),
          comment: 'Re-initiate',
          documentStatus: null,
        });
      });
    } else {
      this.reInitiateLoanCustomerName = customerName;
      this.reInitiateLoanFacilityName = loanFacilityName;
      this.reInitiateLoanType = loanType;
      this.reInitiateLoanBranchName = branchName;
      this.loanData.push({
        loanConfigId: null,
        customerLoanId: customerLoanId,
        toUser: null,
        toRole: null,
        docAction: DocAction.value(DocAction.RE_INITIATE),
        comment: 'Re-initiate',
        documentStatus: null,
      });
    }
    this.modalService.open(template, {size: 'lg', backdrop: 'static', keyboard: false});
  }

  reInitiateConfirm(comment: string) {
    const ref = this.modalService.open(LoginPopUp);
    let isAuthorized = false;
    ref.componentInstance.returnAuthorizedState.subscribe((receivedEntry) => {
      isAuthorized = receivedEntry;
      if (isAuthorized) {
        this.modalService.dismissAll();
        this.reInitiateSpinner = true;
        this.loanData.forEach((cl) => {
          cl.comment = comment;
        });
        // this.formAction.patchValue({
        //   comment: comment
        // });
        this.customerLoanService.reInitiateLoan(this.loanData).subscribe((response: any) => {
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Loan has been successfully re-initiated.'));
          this.reInitiateSpinner = false;
          this.modalService.dismissAll();
          this.ngOnInit();
        }, error => {
          this.reInitiateSpinner = false;
          this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
          this.modalService.dismissAll();
        });
      }
    });
  }

  renewedOrCloseFrom(loanConfigId, childId) {
    this.router.navigate(['/home/loan/summary'], {
      queryParams: {
        loanConfigId: loanConfigId,
        customerId: childId,
        catalogue: true
      }
    });
  }

  onClose() {
    this.buildActionForm();
    this.modalService.dismissAll();
  }

  buildActionForm(): void {
    this.formAction = this.formBuilder.group(
        {
          loanConfigId: [undefined],
          customerLoanId: [undefined],
          toUser: [undefined, Validators.required],
          toRole: [undefined, Validators.required],
          docAction: [undefined],
          comment: [undefined, Validators.required],
          documentStatus: [undefined]
        }
    );
  }
  // displaySecurityDetails() {
  //   if (!ObjectUtil.isEmpty(this.customerInfo.security)) {
  //   const securityData = JSON.parse(this.customerInfo.security.data);
  //   const approvedSecurityData = JSON.parse(this.customerInfo.security.approvedData);
  //   if (!ObjectUtil.isEmpty(securityData)) {
  //   if (!ObjectUtil.isEmpty(this.customerInfo.security) && securityData.selectedArray.length > 0) {
  //     this.displaySecurity = true;
  //     if (securityData.selectedArray.length === 1 &&
  //         securityData.selectedArray.includes('OtherSecurity')) {
  //       this.displaySecurity = false;
  //     }
  //   } else {
  //     this.displaySecurity = false;
  //     }
  //   }
  //     if (!ObjectUtil.isEmpty(approvedSecurityData)) {
  //       if (!ObjectUtil.isEmpty(this.customerInfo.security) && approvedSecurityData.selectedArray.length > 0) {
  //         this.displaySecurity = true;
  //         if (approvedSecurityData.selectedArray.length === 1 &&
  //             approvedSecurityData.selectedArray.includes('OtherSecurity')) {
  //           this.displaySecurity = false;
  //         }
  //       } else {
  //         this.displaySecurity = false;
  //       }
  //     }
  // } else {
  //     this.displaySecurity = false;
  //   }
  // }

  public onEdit(proposal, id: number): void {
    this.ngxSpinnerService.show();
    this.customerLoanService.getSingleLoanByLoanHolderId(id).subscribe((response: any) => {
      this.singleLoan = response.detail;
      this.isLoanBeginEdit = true;
      this.modalService.open(proposal, {
        size: 'xl',
        windowClass: 'modal-holder',
        scrollable: true,
      });
      this.ngxSpinnerService.hide();
    }, error => {
      this.ngxSpinnerService.hide();
      console.error(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Error while loading loan data!!'));
    });
  }

  public close(): void {
    this.modalService.dismissAll();
  }

  public refreshCustomerInfo(): void {
    this.ngOnInit();
    this.modalService.dismissAll();
  }

    openCommonModal(id, combinedLoans) {
        this.nbDialogRef = this.nbDialogModal.open(CommonLoanDataComponent,
            {
                context: {
                    customerInfo: this.customerInfo,
                    loanId: id,
                  resCombinedData: combinedLoans
                },
                closeOnBackdropClick: false,
                closeOnEsc: false
            });
        this.nbDialogRef.onClose.subscribe((res) => {
            if (res) {
                this.triggerCustomerRefresh.emit(true);
            }
        });
    }
}
