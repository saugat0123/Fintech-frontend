import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
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


@Component({
    selector: 'app-customer-group-loan',
    templateUrl: './customer-group-loan.component.html',
    styleUrls: ['./customer-group-loan.component.scss']
})
export class CustomerGroupLoanComponent implements OnInit, OnChanges {
    @Input()
    formValue: Customer;
    customer: Customer;
    @Input()
    customerInfo: CustomerInfoData;
    @Input()
    fetchType: FetchLoan;

    @Output() messageToEmit: EventEmitter<LoanAmountType> = new EventEmitter();

    fetchLoan = FetchLoan;
    @Input()
    total: number;
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
        totalApprovedRequiredCollateral: 0,
        totalPendingRequiredCollateral: 0,
    };

    currentUserId = LocalStorageUtil.getStorage().userId;
    currentUserRoleType = LocalStorageUtil.getStorage().roleType;


    constructor(private router: Router,
                private customerService: CustomerService,
                private customerLoanService: LoanFormService,
                private modalService: NgbModal,
                private spinnerService: NgxSpinnerService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initial();

    }

    ngOnInit() {
        this.initial();
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
            this.customerGroupLoanList.forEach(l => {
                    if (l.proposal) {
                        this.totalLoanProposedAmount = this.totalLoanProposedAmount + l.proposal.proposedLimit;
                        this.collateralDtoData.totalRequiredCollateral = this.collateralDtoData.totalRequiredCollateral +
                            ((l.proposal.collateralRequirement * l.proposal.proposedLimit) / 100);
                        if (l.documentStatus.toString() === DocStatus.value(DocStatus.APPROVED)) {
                            this.collateralDtoData.totalApprovedLimit = this.collateralDtoData.totalApprovedLimit +
                                l.proposal.proposedLimit;
                            this.collateralDtoData.totalApprovedRequiredCollateral =
                                this.collateralDtoData.totalApprovedRequiredCollateral +
                                ((l.proposal.collateralRequirement * l.proposal.proposedLimit) / 100);
                        } else {
                            this.collateralDtoData.totalPendingLimit = this.collateralDtoData.totalPendingLimit +
                                l.proposal.proposedLimit;
                            this.collateralDtoData.totalPendingRequiredCollateral = this.collateralDtoData.totalPendingRequiredCollateral
                                + ((l.proposal.collateralRequirement * l.proposal.proposedLimit) / 100);
                        }
                    }
                }
            );
            this.calculateCollateralData();
            const loanAmountType = new LoanAmountType();
            loanAmountType.type = this.fetchLoan.CUSTOMER_LOAN;
            loanAmountType.value = this.totalLoanProposedAmount;
            this.messageToEmit.emit(loanAmountType);
        });
    }

    calculateCollateralData() {
        if (!ObjectUtil.isEmpty(this.customerInfo.security)) {
            this.collateralDtoData.deficit_Surplus = this.customerInfo.security.totalSecurityAmount -
                this.collateralDtoData.totalRequiredCollateral;
            this.collateralDtoData.coveragePercent = (this.customerInfo.security.totalSecurityAmount /
                (this.totalLoanProposedAmount)) * 100;
            this.collateralDtoData.loanExposure = (
                (this.totalLoanProposedAmount) / this.customerInfo.security.totalSecurityAmount) * 100;
        }
    }

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
                    parentId: loan.parentId
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
                    documentStatus: 'N/A',
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
                            parentId: l.parentId
                        };
                        return singleCombinedLoanDto;
                    })
                };
                loanHistories.push(dto);
            }
        }
        return loanHistories;
    }

    loanHistoriesGroup(loans: SingleCombinedLoanDto[]): {
        pending: SingleCombinedLoanDto[],
        funded: SingleCombinedLoanDto[],
        nonFunded: SingleCombinedLoanDto[]
    } {
        return {
            pending: loans.filter((l) => l.documentStatus !== DocStatus[DocStatus.APPROVED]),
            funded: loans.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED] && l.loanIsFundable),
            nonFunded: loans.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED] && !l.loanIsFundable)
        };
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
        modelRef.componentInstance.isMicroCustomer = this.customerInfo.isMicroCustomer;
        modelRef.componentInstance.customerLoanId = id;


    }
}
