import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Proposal} from '../../admin/modal/proposal';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ActivatedRoute, Params} from '@angular/router';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {MinimumAmountValidator} from '../../../@core/validator/minimum-amount-validator';
import {BaseInterestService} from '../../admin/service/base-interest.service';
import {Editor} from '../../../@core/utils/constants/editor';
import {LoanType} from '../../loan/model/loanType';
import {NumberUtils} from '../../../@core/utils/number-utils';
import {LoanDataHolder} from '../../loan/model/loanData';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CombinedLoanService} from '../../service/combined-loan.service';
import {CombinedLoan} from '../../loan/model/combined-loan';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {IncomeFromAccountComponent} from '../income-from-account/income-from-account.component';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {CreditRiskGradingGammaComponent} from '../credit-risk-grading-gamma/credit-risk-grading-gamma.component';
import {SecurityAdderComponent} from '../../loan-information-view/security-view/security-adder/security-adder.component';
import {CreditRiskGradingGamma} from '../../admin/modal/creditRiskGradingGamma';
import {CadFileSetupComponent} from '../../credit-administration/cad-work-flow/cad-work-flow-base/legal-and-disbursement/cad-file-setup/cad-file-setup.component';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

  submitted = false;

    @Input() formValue: Proposal;
    @Input() loanIds;
    @Input() loanType;
    @Input() customerInfo: CustomerInfoData;
    @Input() fromProfile: boolean;
    @Input() loan: LoanDataHolder;
    @ViewChild('earning', {static: false}) earning: IncomeFromAccountComponent;
    @ViewChild('crgGamma', {static: false}) crgGammaComponent: CreditRiskGradingGammaComponent;
    @ViewChild('securityAdderComponent', {static: false}) securityAdderComponent: SecurityAdderComponent;
    @ViewChild('cadFileSetupComponent', {static: false}) cadFileSetupComponent: CadFileSetupComponent;
    @Output() emitter = new EventEmitter();
    // @Output() crgGammaData = new EventEmitter();
    proposedLimit: number;
    proposalForm: FormGroup;
    proposalData: Proposal = new Proposal();
    formDataForEdit: any;
    minimumAmountLimit = 0;
    collateralRequirement;
    interestLimit: number;
    allId: Params;
    loanId: number;
    solChecked = false;
    deviationChecked = false;
    riskChecked = false;
    checkedDataEdit;
    ckeConfig;
    checkApproved = false;
    absoluteSelected = false;
    customSelected = false;
    isFundable = false;
    fundableNonFundableSelcted = false;
    isFixedDeposit = false;
    loanNature;
    loanNatureSelected = false;
    isRevolving = false;
    isTerminating = false;
    isGeneral = false;
    isVehicle = false;
    isShare = false;
    isHomeLoan = false;
    loanEnumType = LoanType;
    showInstallmentAmount = false;
    showRepaymentMode = false;
    swapChargeChecked = false;
    swapChargeVar = false;
    subsidizedLoanChecked = false;
    othersSubsidyLoan = false;
    existInterestLimit: number;
    showInterestAmount = true;
    legalDocs;
    commitmentChecked = false;
    swapDoubleChargeChecked = false;
    purposeChecked = false;
    debtChecked = false;
    netChecked = false;
    debtValue = `<p>a. After completion and execution of all legal/security documents.</p><p>b. Demand Loan (Loan Against Share) shall be implemented/ disbursed on the account of client upon completion of all security documents.</p><p>c. Financing against the pledge of public and promoter shares shall be governed by NRB Directives.</p><p>d. In case of pledge of public shares, the drawdown on ordinary shares shall be restricted to maximum 70% of 180 days average of shares or last transaction price of all listed companies whichever is lower or as per NRB directives.</p><p>e. In case of pledge of promoter shares, the drawdown shall be calculated on monthly as guided by NRB and shall be restricted to 50% of weighted average Market price of Public shares of last 180 days or last transaction price of Promoter shares, whichever is lower.</p><p>f. The facility against Promoter Shares shall be available for maximum 1- year period and the client has to settle entire facility with in or at the expiry of the facility. But if the promoter shares holding is below 0.5% the loan can be renewed upon satisfactory account performance in compliance of NRB directives by levying necessary charges and fees.</p><p>g. Demand Loan can be availed on single deal or on multiple deals, however the original maturity date shall not exceed the tenure of 1 year from the date of initial deal booking.</p><p>h. Client shall be allowed to re-use approved limit till maturity date upon the pledge of additional shares acceptable to CCBL even after partial/full settlement of respective Demand Loan deal.</p><p>i. We shall obtain approval from NRB for the pledge of promoter shares having more than 2% of shareholding in any company prior to the disbursement of credit limit.</p><p>j. Replacement of shares shall be allowed within approved limit.</p><p>k. Partial security release shall be allowed on the following condition:</p><p>&nbsp;&nbsp;i) Cash deposit equivalent to share drawdown amount: In case of Cash deposit, equivalent deposit to share drawdown limit shall be lien over in operative account of client instead of settlement of limit. OR limit shall be settled equivalent to drawdown limit provided against pledge of particular shares. However, client shall reuse vacant limit with in its maturity.</p><p>&nbsp;&nbsp;ii) Broker Cheque: In case of share release request received from the client against Stock Broker Cheque; the borrower shall provide us Cheque encashable maximum within 7 working days of release of shares along with written letter from Licensed Stock Broker requesting release of desired shares of different listed companies pledged with us for the margin lending facility availed by the client. After realization of the Cheque; amount shall be lien over account of client instead of settlement of limit OR limit shall be settled equivalent to drawdown limit provided against pledge of particular shares. However, client shall reuse vacant limit with in its maturity.</p><p>l. Margin call of the loan shall be done as per product paper guidelines of the bank or as per NRB directives. In case of shortfall, margin call shall be done within 7 days of deficit occurrence date. The deficit amount to be deposited by the client within 35 days of Margin Call. However, if the deficit is less than or equal to 15% of the value of pledged shares, Margin Call may not be required.</p><p>m. No enhancement in the sanctioned limit shall be allowed by re-valuation of shares.</p><p><strong>n. Approving Authority for full or partial release of pledged shares complying above criteria shall be provided to Manager &ndash; Retail Credit. &ndash;Separate memo has been raised</strong></p><p>o. As per the client, tentative list of share to be purchased/ pledged is listed below:</p><table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" style=\"width:500px\"><tbody><tr><td>SN</td><td>Company Name</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table><p><strong>In case of promoter share</strong></p><p>In the event of expiry, if the borrower could not settle the loan within stipulated time, borrower with reason shall be blacklisted within 7 days of providing 35 days notice. The provision for blacklisting shall also be mentioned in Loan deed.</p><p><strong>Disbursement:</strong></p><ul><li>Disbursement is subjected to the clause of pledge over marketable securities of public/ promoter shares of various companies and after execution of all security documents.</li><li>Disbursement of demand loan shall be done on single deal, on multiple deals, or as per request of the client. However, loan shall be expired within a year of first disbursement.</li><li>Demand Loan will be disbursed against public as well as promoters share.</li><li>Processing fee charge of 0.75% of implemented limit shall be levied to the customer.</li><li>Replacement of shares shall be allowed within limit.</li><li><p>Partial security release shall be allowed on the following condition:</p><p>I. Cash deposit equivalent to share drawdown amount</p><p>II. Broker ChequeI</p><p>III. Replacement of Shares</p></li></ul><p><strong>Repayment:</strong></p><p>a. The client shall serve interest on Overdraft/Demand Loan (Loan Against Shares) on a quarterly basis, i.e. at Chaitra end, Ashad end, Ashoj end and Poush end.</p><p>b. Principal amount will be renewed/ reviewed upon satisfactory performance of the account during review period as per the guidelines of NRB.</p>`;
    yesNo = [
        {value: 'Yes'},
        {value: 'No'}];

    subsidyLoanType = [
        {value: 'Literate Youth Self Employment Loan'},
        {value: 'Project Loan For Youth Returning From Foreign'},
        {value: 'Female Entrepreneur Loan'},
        {value: 'Business Loan For Marginalized Group of People'},
        {value: 'Loan For Higher Technical Know How'},
        {value: 'Residential Home Loan For Earthquake Affected'},
        {value: 'Loan For Garment Industry Operation'},
        {value: 'Loan For Training From Approved Technical Know How'},
        {value: 'Agriculture Business Loan (Overdraft)'},
        {value: 'Agriculture Business Loan (Term)'},
        {value: 'Others'},
    ];
    groupExposureData;
    isAllExposureFieldNull = false;
    firstTimeHomeBuyerChecked = false;
    files = [];
    purposes: Array<string> = [
        'Purchase of Land',
        'Construction of Building',
        'Purchase of Apartments and Independent Units',
        'Home Improvement',
        'Home Improvement',
        'Purchase of Residential Building',
        'Investment in Business',
        'Investment in Fixed Assets',
        'Investment in Financial Assets (Securities)',
        'Repayment of Personal Debt',
        'Social Obligations/Functions',
        'Family Expenses',
        'Debt Consolidation',
        'Home Improvement, Repair and Maintenance',
        'Debt Consolidation',
        'To Finance Tertiary Education',
        'To Finance Post-Secondary Education'];
    isCombineLoan = false;
    combineLoanList: Array<LoanDataHolder> = [];
    guarantor = new FormControl(undefined, Validators.required);
    existingCombinedLoan = {
        id: undefined,
        version: undefined
    };
    customerGroupLoanList: Array<LoanDataHolder> = Array<LoanDataHolder>();
    combinedLoansIds: number[] = [];
    removeFromCombinedLoan = false;
    customerType: any;
    collateral = ['With Collateral', 'Without Collateral'];
    defaultCompliance = '<p><strong>Repayment:</strong></p>\n\n<p>a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &hellip;&hellip;&hellip; equal monthly installments commencing from the 10th of every Gregorian calendar from the next month of initial drawdown. The client shall serve interest on the loan outstanding during the first month, calculated on a daily debit outstanding from the date of disbursement.</p>\n\n<p>b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The above mentioned loan when repaid in part or full shall not be reinstated by the extent of the amount repaid/settled.</p>\n\n<p><strong>Mode of Disbursemet:</strong></p>\n\n<p>The loan shall be disbursed as under:</p>\n\n<ul>\n\t<li>We shall disburse loan amount of NPR &hellip;&hellip;&hellip;.. Mio or &hellip;&hellip;&hellip;.% of FMV of the real estate collateral whichever is lower by crediting the current account of Mr. &hellip;&hellip;&hellip;&hellip;&hellip;.. maintained at &hellip;&hellip;&hellip;&hellip;&hellip;. Branch or issued Managers Cheque in the name of Seller or as per request of the applicant upon completion of security documents</li>\n\t<li>Execution of all the security documents including mortgaged of proposed collateral.</li>\n</ul>\n\n<p>Letter of undertaking to the seller shall be issued at the request of buyer.</p>\n\n<p>Completion of security documentations</p>\n';

    constructor(private formBuilder: FormBuilder,
                private loanConfigService: LoanConfigService,
                private activatedRoute: ActivatedRoute,
                private toastService: ToastService,
                private baseInterestService: BaseInterestService,
                private el: ElementRef,
                private nbService: NgbModal,
                private customerInfoService: CustomerInfoService,
                private loanFormService: LoanFormService,
                private spinner: NgxSpinnerService,
                private combinedLoanService: CombinedLoanService) {
    }

    ngOnInit() {
        console.log('loan', this.loan);
        this.configEditor();
        this.buildForm();
        this.checkLoanTypeAndBuildForm();
        if (!ObjectUtil.isEmpty(this.formValue)) {
            this.formDataForEdit = JSON.parse(this.formValue.data);
            this.checkedDataEdit = JSON.parse(this.formValue.checkedData);
            this.proposalForm.patchValue(this.formDataForEdit);
            this.setCheckedData(this.checkedDataEdit);
            this.proposalForm.get('proposedLimit').patchValue(this.formValue.proposedLimit);
            this.interestLimit = this.formDataForEdit['interestRate'];
            /*this.proposalForm.get('existingLimit').patchValue(this.formValue.proposedLimit);
            this.proposalForm.get('dateOfExpiry').patchValue(!ObjectUtil.isEmpty(this.formDataForEdit.dateOfExpiry)
                ? new Date(this.formDataForEdit.dateOfExpiry) : undefined);
            this.checkLimitExpiryBuildValidation(this.formDataForEdit.limitExpiryMethod);*/
            this.proposalForm.get('existingDateOfExpiry').patchValue(!ObjectUtil.isEmpty(this.formDataForEdit.existingDateOfExpiry)
                ? new Date(this.formDataForEdit.existingDateOfExpiry) : undefined);
            this.existInterestLimit = this.formDataForEdit['existInterestRate'];
            if (!ObjectUtil.isEmpty(this.formValue.groupExposure)) {
                this.groupExposureData = JSON.parse(this.formValue.groupExposure);
                this.proposalForm.patchValue(this.groupExposureData);
                this.setGroupExposureData(this.groupExposureData);
            }
        } else {
            this.proposalForm.get('compliance').patchValue(this.defaultCompliance);
            this.setActiveBaseRate();
            this.addGroupExposureData();
        }
        if (!this.fromProfile) {
            this.activatedRoute.queryParams.subscribe(
                (paramsValue: Params) => {
                    this.allId = {
                        loanId: null,
                        customerId: null,
                        loanCategory: null,
                        customerType: null,
                    };
                    this.allId = paramsValue;
                    this.loanId = this.allId.loanId ? this.allId.loanId : this.loanIds;
                    this.customerType = this.allId.loanCategory;
                });
        }
        this.getLoanData();
        if (!ObjectUtil.isEmpty(this.formValue)) {
            if (!ObjectUtil.isEmpty(this.formValue.data)) {
                const data = JSON.parse(this.formValue.data);
                if (!ObjectUtil.isEmpty(data.files)) {
                    this.files = JSON.parse(data.files);
                }
            }
        }

        this.loanFormService.getInitialLoansByLoanHolderId(this.customerInfo.id).subscribe((res: any) => {
            this.customerGroupLoanList = res.detail;
            this.customerGroupLoanList
                .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan))
                .forEach((l) => this.combinedLoansIds.push(l.id));
            this.removeFromCombinedLoan = this.combinedLoansIds.length > 0;
            if (this.combinedLoansIds.length > 0) {
                const loan = this.customerGroupLoanList
                    .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan))[0];
                this.existingCombinedLoan.id = loan.combinedLoan.id;
                this.existingCombinedLoan.version = loan.combinedLoan.version;
            } else {
                this.customerGroupLoanList
                    .filter((ld) => ld.currentStage.toUser.id.toString() === LocalStorageUtil.getStorage().userId)
                    .forEach((l) => this.combinedLoansIds.push(l.id));
            }
        });

        this.proposalForm.get('interestRate').valueChanges.subscribe(value => this.proposalForm.get('premiumRateOnBaseRate')
            .patchValue((Number(value) - Number(this.proposalForm.get('baseRate').value)).toFixed(8)));
        this.proposalForm.get('baseRate').valueChanges.subscribe(value => this.proposalForm.get('premiumRateOnBaseRate')
            .patchValue((Number(this.proposalForm.get('interestRate').value) - Number(value)).toFixed(8)));
        // this.proposalForm.get('limitExpiryMethod').valueChanges.subscribe(value => this.checkLimitExpiryBuildValidation(value));
        this.checkInstallmentAmount();
        this.proposalForm.get('proposedLimit').valueChanges.subscribe(value => {
            this.proposalForm.get('principalAmount')
                .patchValue(Number(value));
            this.proposedLimit = this.proposalForm.get('proposedLimit').value;
        });
    }

    getLoanData() {
        if (!ObjectUtil.isEmpty(this.loan)) {
            this.loanId = this.loan.loan.id;
        }
        this.loanConfigService.detail(this.loanId).subscribe((response: any) => {
            if (!this.fromProfile) {
                this.loan = new LoanDataHolder();
            }
            this.loan.loan = response.detail;
            this.checkLoan();
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
        });
        if (this.fromProfile) {
            this.customerType = this.activatedRoute.snapshot.queryParamMap.get('customerType');
        }
    }


    checkLoan() {
        this.minimumAmountLimit = this.loan.loan.minimumProposedAmount;
        this.collateralRequirement = this.loan.loan.collateralRequirement;
        this.isFundable = this.loan.loan.isFundable;
        this.fundableNonFundableSelcted = !ObjectUtil.isEmpty(this.loan.loan.isFundable);
        this.isFixedDeposit = this.loan.loan.loanTag === 'FIXED_DEPOSIT';
        this.isGeneral = this.loan.loan.loanTag === 'GENERAL';
        this.isShare = this.loan.loan.loanTag === 'SHARE_SECURITY';
        this.isVehicle = this.loan.loan.loanTag === 'VEHICLE';
        this.isHomeLoan = this.loan.loan.loanTag === 'HOME_LOAN';
        this.loanNature = this.loan.loan.loanNature;
        if (!ObjectUtil.isEmpty(this.loanNature)) {
            this.loanNatureSelected = true;
            this.isTerminating = this.loanNature === 'Terminating';
            this.isRevolving = this.loanNature === 'Revolving';
            if (this.isRevolving) {
                this.isGeneral = false;
            }
        }
        if (!this.isFundable) {
            this.isGeneral = false;
        }
        if (this.isFixedDeposit) {
            this.loanNatureSelected = false;
            this.fundableNonFundableSelcted = false;
        }
        this.proposalForm.get('proposedLimit').setValidators([Validators.required,
            MinimumAmountValidator.minimumAmountValidator(this.minimumAmountLimit)]);
        this.proposalForm.get('proposedLimit').updateValueAndValidity();
        if (ObjectUtil.isEmpty(this.formDataForEdit)) {
            this.interestLimit = this.loan.loan.interestRate;
        }
        this.setCollateralRequirement(this.collateralRequirement);
        // this.checkLoanConfig();
        // this.setValidatorForPrepaymentField();
        if (ObjectUtil.isEmpty(this.formDataForEdit)) {
            // this.existInterestLimit = this.loan.existInterestRate;

        }
    }

    buildForm() {
        this.proposalForm = this.formBuilder.group({

            // Proposed Limit--
            proposedLimit: [undefined, [Validators.required, Validators.min(0)]],

            interestRate: [undefined],
            baseRate: [undefined],
            premiumRateOnBaseRate: [undefined],
            serviceChargeMethod: ['PERCENT'],
            swapChargeMethod: ['PERCENT'],
            serviceCharge: [undefined],
            tenureDurationInMonths: [undefined],
            repaymentMode: [undefined],
            repaymentModeInterest: [undefined],
            repaymentModePrincipal: [undefined],
            disbursementCriteria: [undefined],
            repayment: [undefined],
            borrowerInformation: [undefined],
            interestAmount: [undefined],
            existingLimit: [undefined],
            outStandingLimit: [undefined],
            collateralRequirement: [undefined, Validators.required],
            swapCharge: [undefined],
            subsidizedLoan: [undefined],
            /*limitExpiryMethod: [undefined, Validators.required],
            duration: [undefined, Validators.required],
            condition: [undefined, Validators.required],
            frequency: [undefined, Validators.required],
            dateOfExpiry: [undefined, Validators.required],*/
            remark: [undefined],
            cashMargin: [undefined],
            commissionPercentage: [undefined],
            commissionFrequency: [undefined],
            couponRate: [undefined],
            premiumOnCouponRate: [undefined],
            tenorOfEachDeal: [undefined],
            cashMarginMethod: ['PERCENT'],
            enhanceLimitAmount: [undefined],
            subsidyLoanType: [undefined],
            others: [undefined],

            // Additional Fields--
            // for installment Amount--
            installmentAmount: [undefined],
            principalAmount: [undefined],
            // for moratoriumPeriod Amount--
            moratoriumPeriod: [undefined],
            // for prepaymentCharge Amount--
            prepaymentCharge: [(ObjectUtil.isEmpty(this.proposalData)
                || ObjectUtil.isEmpty(this.proposalData.prepaymentCharge)) ? '' :
                this.proposalData.prepaymentCharge],
            // for prepaymentCharge Amount--
            // for commitmentFee Amount--
            commitmentFee: [undefined],
            solConclusionRecommendation: [undefined],
            waiverConclusionRecommendation: [undefined],
            riskConclusionRecommendation: [undefined],
            summeryRecommendation: undefined,
            purposeOfLoan: undefined,
            debtStructure: [this.debtValue],
            termsAndCondition: undefined,
            prepaymentSwapCommitment: [undefined],
            existCashMargin: [undefined],
            existCashMarginMethod: ['PERCENT'],
            existInterestRate: [undefined],
            existCommissionPercentage: [undefined],
            settlementAmount: [undefined],
            groupExposure: this.formBuilder.array([]),
            yesNo1: [undefined],
            yesNo2: [undefined],
            yesNo3: [undefined],
            yesNo4: [undefined],
            yesNo5: [undefined],
            accountStrategy: [undefined],
            files: [undefined],
            deviationConclusionRecommendation: [undefined],
            shares: this.formBuilder.array([]),
            realState: this.formBuilder.array([]),
            vehicle: this.formBuilder.array([]),
            deposit: this.formBuilder.array([]),
            depositBank: [undefined],
            depositOther: [undefined],
            depositBankRemark: [undefined],
            depositOtherRemark: [undefined],
            total: [undefined],
            totals: [undefined],
            compliance: [undefined],
            existingDateOfExpiry: [undefined],
            // pricing table
            interestCardRate: [undefined],
            processCardRate: [undefined],
            processExistingRate: [undefined],
            processProposedRate: [undefined],
            commissionsCardRate: [undefined],
            cashCardRate: [undefined],
            prepaymentCardRate: [undefined],
            prepaymentExistingRate: [undefined],
            strCharge: [undefined],
            AdminFee: [undefined],
            other: [undefined],
            collateral: [undefined],

    });
    }

    setValidatorForPrepaymentField() {
        if ((this.loanNatureSelected && this.fundableNonFundableSelcted &&
            this.isFundable && this.isTerminating) || this.isVehicle || this.isShare || this.isGeneral) {
            this.proposalForm.get('prepaymentCharge').setValidators([Validators.required]);
        } else {
            this.proposalForm.get('prepaymentCharge').clearValidators();
        }
        this.proposalForm.get('prepaymentCharge').updateValueAndValidity();
    }

    checkLoanTypeAndBuildForm() {
        if (this.loanType === 'RENEWED_LOAN' || this.loanType === 'ENHANCED_LOAN' || this.loanType === 'PARTIAL_SETTLEMENT_LOAN'
            || this.loanType === 'FULL_SETTLEMENT_LOAN' || this.loanType === 'RENEW_WITH_ENHANCEMENT') {
            this.checkApproved = true;
            this.proposalForm.get('existingLimit').setValidators(Validators.required);
            this.proposalForm.get('outStandingLimit');
        }
    }

    configEditor() {
        this.ckeConfig = Editor.CK_CONFIG;
    }

    scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
            'form .ng-invalid'
        );
        window.scroll({
            top: this.getTopOffset(firstInvalidControl),
            left: 0,
            behavior: 'smooth'
        });
        firstInvalidControl.focus();
    }

    private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 50;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
    }

    setIndividualCrgGamma(crgGamma: CreditRiskGradingGamma): void {
        this.loan.crgGamma = crgGamma;
    }

    onSubmit() {
        // this.cadFileSetupComponent.save();
        if (this.customerType === 'INDIVIDUAL' && this.fromProfile) {
            this.crgGammaComponent.onSubmit();
        }
        // Proposal Form Data--
        this.submitted = true;
        this.proposalData.proposedLimit = this.proposalForm.get('proposedLimit').value;
        this.proposalData.existingLimit = this.proposalForm.get('existingLimit').value;
        this.proposalData.outStandingLimit = this.proposalForm.get('outStandingLimit').value;
        this.proposalData.collateralRequirement = this.proposalForm.get('collateralRequirement').value;
        this.proposalData.tenureDurationInMonths = this.proposalForm.get('tenureDurationInMonths').value;
        this.proposalData.cashMargin = this.proposalForm.get('cashMargin').value;
        this.proposalData.commissionPercentage = this.proposalForm.get('commissionPercentage').value;
        this.proposalData.commissionFrequency = this.proposalForm.get('commissionFrequency').value;
        this.proposalData.couponRate = this.proposalForm.get('couponRate').value;
        this.proposalData.premiumOnCouponRate = this.proposalForm.get('premiumOnCouponRate').value;
        this.proposalData.tenorOfEachDeal = this.proposalForm.get('tenorOfEachDeal').value;
        this.proposalData.cashMarginMethod = this.proposalForm.get('cashMarginMethod').value;
        this.proposalData.enhanceLimitAmount = this.proposalForm.get('enhanceLimitAmount').value;
        this.proposalData.settlementAmount = this.proposalForm.get('settlementAmount').value;
        this.proposalData.existCashMargin = this.proposalForm.get('existCashMargin').value;
        this.proposalData.existCashMarginMethod = this.proposalForm.get('existCashMarginMethod').value;
        this.proposalData.existCommissionPercentage = this.proposalForm.get('existCommissionPercentage').value;
        this.proposalData.groupExposure = JSON.stringify(this.proposalForm.get('groupExposure').value);
      if (!this.fromProfile) {
            if (!ObjectUtil.isEmpty(this.formValue)) {
                this.proposalData = this.formValue;
            }
            this.proposalData.data = JSON.stringify(this.proposalForm.value);

            const mergeChecked = {
                solChecked: this.solChecked,
                riskChecked: this.riskChecked,
                swapChargeChecked: this.swapChargeChecked,
                subsidizedLoanChecked: this.subsidizedLoanChecked,
                commitmentChecked: this.commitmentChecked,
                swapDoubleChargeChecked: this.swapDoubleChargeChecked,
                purposeChecked: this.purposeChecked,
                debtChecked: this.debtChecked,
                netChecked: this.netChecked,
                firstTimeHomeBuyerChecked: this.firstTimeHomeBuyerChecked
            };
            this.proposalData.checkedData = JSON.stringify(mergeChecked);
            this.proposalData.proposedLimit = this.proposalForm.get('proposedLimit').value;

            // Proposed Limit value--
        } else {
          if (this.proposalForm.invalid) {
              this.toastService.show(new Alert(AlertType.WARNING, 'VALIDATION FAILEDs'));
              return;
          }
            // this.securityAdderComponent.save();
            if (!ObjectUtil.isEmpty(this.customerInfo.commonLoanData)) {
                this.proposalForm.patchValue(JSON.parse(this.customerInfo.commonLoanData));
                this.proposalData.checkedData = JSON.parse(this.customerInfo.commonLoanData).mergedCheck;
            }
            const mergeChecked = {
                solChecked: this.solChecked,
                riskChecked: this.riskChecked,
                swapChargeChecked: this.swapChargeChecked,
                subsidizedLoanChecked: this.subsidizedLoanChecked,
                commitmentChecked: this.commitmentChecked,
                swapDoubleChargeChecked: this.swapDoubleChargeChecked,
                purposeChecked: this.purposeChecked,
                debtChecked: this.debtChecked,
                netChecked: this.netChecked,
                firstTimeHomeBuyerChecked: this.firstTimeHomeBuyerChecked
            };
            this.proposalData.checkedData = JSON.stringify(mergeChecked);
            this.proposalData.data = JSON.stringify(this.proposalForm.value);
            this.loan.proposal = this.proposalData;
            this.spinner.show();
            this.loanFormService.save(this.loan).subscribe((response: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Loan'));
                this.loan = response.detail;
                this.combinedLoansIds.push(this.loan.id);
                if (this.combinedLoansIds.length > 1) {
                    const combinedLoans: LoanDataHolder[] = this.combinedLoansIds.map((id) => {
                        const loan = new LoanDataHolder();
                        loan.id = id;
                        return loan;
                    });
                    const combinedLoan: CombinedLoan = {
                        id: this.existingCombinedLoan.id,
                        loans: combinedLoans.length < 1 ? [] : combinedLoans,
                        version: this.existingCombinedLoan.version
                    };
                    this.combinedLoanService.save(combinedLoan).subscribe(() => {
                        const msg = `Successfully saved combined loan`;
                        this.toastService.show(new Alert(AlertType.SUCCESS, msg));
                        this.emitter.emit(this.loan);
                        this.spinner.hide();
                    }, error => {
                        console.error(error);
                        this.spinner.hide();
                        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save combined loan'));
                    });
                } else {
                    this.spinner.hide();
                    this.emitter.emit(this.loan);
                }
            }, error => {
                this.spinner.hide();
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, `Error saving customer: ${error.error.message}`));
            });
        }
    }

    get formControls() {
        return this.proposalForm.controls;
    }

    setActiveBaseRate() {
        this.baseInterestService.getActiveBaseRate().subscribe(value => {
            this.proposalForm.get('baseRate').setValue(value.detail.rate);
        });
    }

    checkChecked(event, type) {
        switch (type) {
            case 'sol':
                if (event) {
                    this.solChecked = true;
                } else {
                    this.solChecked = false;
                    this.proposalForm.get('solConclusionRecommendation').setValue(null);
                }
                break;
            case 'risk':
                if (event) {
                    this.riskChecked = true;
                } else {
                    this.riskChecked = false;
                    this.proposalForm.get('riskConclusionRecommendation').setValue(null);
                }
                break;
            case 'swapCharge':
                if (event) {
                    this.swapChargeChecked = true;
                } else {
                    this.swapChargeChecked = false;
                    this.proposalForm.get('swapCharge').setValue(null);
                }
                break;
            case 'subsidizedLoan':
                if (event) {
                    this.subsidizedLoanChecked = true;
                } else {
                    this.subsidizedLoanChecked = false;
                    this.proposalForm.get('subsidizedLoan').setValue(null);
                    this.proposalForm.get('subsidyLoanType').setValue(null);
                }
                break;
            case 'swapChVar':
                if (event) {
                    this.swapChargeVar = true;
                } else {
                    this.swapChargeVar = false;
                }
                break;
            case 'commitment': {
                this.commitmentChecked = event;
            }
                break;
            case 'swapDoubleCharge': {
                this.swapDoubleChargeChecked = event;
            }
                break;
            case 'purpose': {
                this.purposeChecked = event;
            }
                break;
            case 'debt': {
                this.debtChecked = event;
            }
                break;
            case 'net': {
                this.netChecked = event;
            }
                break;
            case 'firstTimeHomeBuyer':
                if (event) {
                  this.firstTimeHomeBuyerChecked = true;
                } else {
                  this.firstTimeHomeBuyerChecked = false;
                  this.proposalForm.get('yesNo1').patchValue(null);
                  this.proposalForm.get('yesNo2').patchValue(null);
                  this.proposalForm.get('yesNo3').patchValue(null);
                  this.proposalForm.get('yesNo4').patchValue(null);
                  this.proposalForm.get('yesNo5').patchValue(null);
                  this.proposalForm.get('collateral').patchValue(null);
                }
                break;
        }
    }

  setCheckedData(data) {
    if (!ObjectUtil.isEmpty(data)) {
      this.checkChecked(data['solChecked'], 'sol');
      this.checkChecked(data['riskChecked'], 'risk');
      this.checkChecked(data['swapChargeChecked'], 'swapCharge');
      this.checkChecked(data['subsidizedLoanChecked'], 'subsidizedLoan');
      this.checkChecked(data['swapChargeVar'], 'swapChVar');
      this.checkChecked(data['firstTimeHomeBuyerChecked'], 'firstTimeHomeBuyer');
    }
  }

  checkRepaymentMode() {
    if (this.showInstallmentAmount) {
      this.proposalForm.get('interestAmount').patchValue(0);
      const repaymentMode = this.proposalForm.get('repaymentMode').value;
      switch (repaymentMode) {
        case 'EMI':
          this.calculateEmiEqiAmount('emi');
          break;
        case 'EQI':
          this.calculateEmiEqiAmount('eqi');
          break;
      }
    } else {
      this.proposalForm.get('installmentAmount').patchValue(0);
    }
  }

  checkCustomRepaymentMode() {
   if (this.showRepaymentMode) {
     this.calculateRepaymentModeAmounts(this.proposalForm.get('repaymentModePrincipal').value , 'PRINCIPAL');
     this.calculateRepaymentModeAmounts(this.proposalForm.get('repaymentModeInterest').value , 'INTEREST');
   }
  }

  calculateEmiEqiAmount(repaymentMode) {
    const proposedAmount = this.proposalForm.get('proposedLimit').value;
    const moratoriumPeriod = this.proposalForm.get('moratoriumPeriod').value;
    const rate = Number(this.proposalForm.get('interestRate').value) / (12 * 100);
    const n = this.proposalForm.get('tenureDurationInMonths').value;
    if (!ObjectUtil.isEmpty(moratoriumPeriod)) {
        if (!ObjectUtil.isEmpty(n) && !ObjectUtil.isEmpty(proposedAmount)) {
            const emi = Number(proposedAmount / Number(n - moratoriumPeriod));
            switch (repaymentMode) {
                case 'emi':
                    this.proposalForm.get('installmentAmount').patchValue(Number(emi.toFixed(8)));
                    break;
                case 'eqi':
                    this.proposalForm.get('installmentAmount').patchValue(Number((emi * 3).toFixed(8)));
                    break;
            }
        }
    } else {
        if (proposedAmount && rate && n) {
            const emi = Number((proposedAmount * rate * Math.pow(1 + rate, n)) / Number(Math.pow(1 + rate, n) - 1));
            switch (repaymentMode) {
                case 'emi':
                    this.proposalForm.get('installmentAmount').patchValue(Number(emi.toFixed(8)));
                    break;
                case 'eqi':
                    this.proposalForm.get('installmentAmount').patchValue(Number((emi * 3).toFixed(8)));
                    break;
            }
        } else {
            this.proposalForm.get('installmentAmount').patchValue(undefined);
        }
    }
  }

  /** @param key - calculate type identifier,
   * @param repaymentMode - period of calculation*/
  calculateRepaymentModeAmounts(repaymentMode, key) {
    let principleAmount = 0;
    let interestAmount = 0;
    const rate = Number(this.proposalForm.get('interestRate').value) / 100;
    const proposedAmount = this.proposalForm.get('proposedLimit').value;
    const tenure = this.proposalForm.get('tenureDurationInMonths').value;
    if (proposedAmount) {
      switch (repaymentMode) {
        case 'MONTHLY':
          interestAmount = (proposedAmount * rate) / 12;
          principleAmount = (proposedAmount / tenure);
          break;
        case 'QUARTERLY':
          interestAmount = ((proposedAmount * rate) / 12) * 3;
          principleAmount = (proposedAmount / tenure) * 3;
          break;
        case 'SEMI-ANNUALLY' :
          interestAmount = ((proposedAmount * rate) / 12) * 6;
          principleAmount = (proposedAmount / tenure) * 6;
          break;
        case 'ANNUALLY':
          interestAmount = (proposedAmount * rate);
          principleAmount = (proposedAmount / tenure) * 12;
          break;
        case 'AT MATURITY':
          principleAmount = proposedAmount;
          break;
        default:
          principleAmount = 0;
          interestAmount = 0;
      }
      if (key === 'INTEREST') {
        this.proposalForm.get('interestAmount').patchValue(Number((interestAmount).toFixed(8)));
      }if (key === 'PRINCIPAL') {
        this.proposalForm.get('principalAmount').patchValue(Number((principleAmount).toFixed(8)));
      }
    }
  }

  setCollateralRequirement(collateralRequirement) {
    if (ObjectUtil.isEmpty(this.proposalForm.get('collateralRequirement').value)) {
      this.proposalForm.get('collateralRequirement').patchValue(collateralRequirement);
    }
  }

 /* checkLimitExpiryBuildValidation(limitExpiry) {
    if (limitExpiry === 'ABSOLUTE') {
      this.absoluteSelected = true;
      this.customSelected = false;
      this.proposalForm.get('dateOfExpiry').setValidators([Validators.required]);
      this.proposalForm.get('dateOfExpiry').updateValueAndValidity();
      this.proposalForm.get('duration').clearValidators();
      this.proposalForm.get('duration').patchValue(undefined);
      this.proposalForm.get('duration').updateValueAndValidity();
      this.proposalForm.get('condition').clearValidators();
      this.proposalForm.get('condition').updateValueAndValidity();
      this.proposalForm.get('condition').patchValue(undefined);
      this.proposalForm.get('frequency').clearValidators();
      this.proposalForm.get('frequency').updateValueAndValidity();
      this.proposalForm.get('frequency').patchValue(undefined);
    } else if (limitExpiry === 'CUSTOM') {
      this.customSelected = true;
      this.absoluteSelected = false;
      this.proposalForm.get('duration').setValidators([Validators.required]);
      this.proposalForm.get('duration').updateValueAndValidity();
      this.proposalForm.get('condition').setValidators([Validators.required]);
      this.proposalForm.get('condition').updateValueAndValidity();
      this.proposalForm.get('frequency').setValidators([Validators.required]);
      this.proposalForm.get('frequency').updateValueAndValidity();
      this.proposalForm.get('dateOfExpiry').clearValidators();
      this.proposalForm.get('dateOfExpiry').updateValueAndValidity();
      this.proposalForm.get('dateOfExpiry').patchValue(undefined);

    }
  }*/

  checkInstallmentAmount() {
    if (this.proposalForm.get('repaymentMode').value === 'EMI' || this.proposalForm.get('repaymentMode').value === 'EQI') {
      this.showInstallmentAmount = true;
      this.showRepaymentMode = false;
      this.checkRepaymentMode();
      this.controlValidation(['repaymentModeInterest' , 'repaymentModePrincipal'] , false);
    } else if (this.proposalForm.get('repaymentMode').value === 'CUSTOM') {
      this.showRepaymentMode = true;
      this.showInstallmentAmount = false;
      this.controlValidation(['repaymentModeInterest' , 'repaymentModePrincipal'] , true);
    } else {
      this.calculateInterestAmountForRepaymentMode();
      this.showInstallmentAmount = false;
      this.showRepaymentMode = false;
    }
  }

  controlValidation(controlNames, addValidation) {
    controlNames.forEach(s => {
      if (addValidation) {
        this.proposalForm.get(s).setValidators(Validators.required);
      } else {
      this.proposalForm.get(s).clearValidators();
      }
      this.proposalForm.get(s).updateValueAndValidity();
    });
  }

  // checkLoanConfig() {
  //   if (this.isFixedDeposit) {
  //     this.proposalForm.get('couponRate').setValidators(Validators.required);
  //     this.proposalForm.get('couponRate').updateValueAndValidity();
  //     this.proposalForm.get('premiumOnCouponRate').setValidators(Validators.required);
  //     this.proposalForm.get('premiumOnCouponRate').updateValueAndValidity();
  //   }
  //   if (!this.isFundable) {
  //     this.proposalForm.get('cashMargin').setValidators(Validators.required);
  //     this.proposalForm.get('cashMargin').updateValueAndValidity();
  //     this.proposalForm.get('commissionPercentage').setValidators(Validators.required);
  //     this.proposalForm.get('commissionPercentage').updateValueAndValidity();
  //     this.proposalForm.get('commissionFrequency').setValidators(Validators.required);
  //     this.proposalForm.get('commissionFrequency').updateValueAndValidity();
  //   }
  // }

    calculateLimitValues() {

        switch (this.loanType) {
          case  'PARTIAL_SETTLEMENT_LOAN':
            const newLimit = this.formControls.existingLimit.value - this.formControls.settlementAmount.value;
            this.formControls.proposedLimit.setValue(NumberUtils.isNumber(newLimit));
            return;
          case  'ENHANCED_LOAN':
            const enhancementAmount = this.formControls.existingLimit.value + this.formControls.enhanceLimitAmount.value;
            this.formControls.proposedLimit.setValue(NumberUtils.isNumber(enhancementAmount));
            return;
          case  'RENEW_WITH_ENHANCEMENT':
            const enhanceLimit = this.formControls.existingLimit.value + this.formControls.enhanceLimitAmount.value;
            this.formControls.proposedLimit.setValue(NumberUtils.isNumber(enhanceLimit));
            return;
          default:
            return;
        }

    }

    calculateInterestAmountForRepaymentMode() {
        const proposeLimit = Number(this.proposalForm.get('proposedLimit').value);
        const interestRate = Number(this.proposalForm.get('interestRate').value);
        const tenureDurationInMonths = Number(this.proposalForm.get('tenureDurationInMonths').value) / 12;
        const interestAmount = (proposeLimit * (interestRate / 100) * tenureDurationInMonths) / 12;
        this.proposalForm.get('interestAmount').setValue(Number(interestAmount).toFixed(8));
        this.proposalForm.get('principalAmount').setValue(Number(proposeLimit).toFixed(8));
    }

  calculateInterestRate() {
    const baseRate = Number(this.proposalForm.get('baseRate').value);
    const premiumRateOnBaseRate = Number(this.proposalForm.get('premiumRateOnBaseRate').value);
    const discountRate = Number(this.proposalForm.get('subsidizedLoan').value);

    const interestRate = (baseRate - discountRate + premiumRateOnBaseRate);
    return this.proposalForm.get('interestRate').setValue(Number(interestRate).toFixed(8));
  }

  onChange() {
    const isOtherSelected = this.proposalForm.get('subsidyLoanType').value.includes('Others');
    if (isOtherSelected) {
      this.othersSubsidyLoan = true;
    } else {
      this.othersSubsidyLoan = false;
      this.proposalForm.get('others').setValue(null);
    }
  }

  addGroupExposureData() {
    this.checkGroupExposureNull();
    if (this.isAllExposureFieldNull) {
      this.toastService.show(new Alert(AlertType.ERROR, 'Please fill at least one field'));
    } else {
      (this.proposalForm.get('groupExposure') as FormArray).push (
          this.formBuilder.group({
            facilityType: [undefined],
            loanLimit: [undefined],
            osLimit: [undefined],
            proposedLimit: [undefined],
            fmvDv: [undefined],
            exposure: [undefined],
            remarks: [undefined],
          })
      );
    }
  }

  setGroupExposureData(data) {
    const groupExposuresArray = this.proposalForm.get('groupExposure') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(singleData => {
        groupExposuresArray.push(this.formBuilder.group({
          facilityType: [singleData.facilityType],
          loanLimit: [singleData.loanLimit],
          osLimit: [singleData.osLimit],
          proposedLimit: [singleData.proposedLimit],
          fmvDv: [singleData.fmvDv],
          exposure: [singleData.exposure],
          remarks: [singleData.remarks],
        }));
      });
    }
  }

    removeGroupExposureData(index: number) {
        (<FormArray>this.proposalForm.get('groupExposure')).removeAt(index);
    }

  checkGroupExposureNull() {
    const groupExposuresArray = this.proposalForm.get('groupExposure') as FormArray;
    groupExposuresArray.controls.forEach((data) => {
      const facilityType = data.get('facilityType').value;
      const loanLimit = data.get('loanLimit').value;
      const osLimit = data.get('osLimit').value;
      const proposedLimit = data.get('proposedLimit').value;
      const fmvDv = data.get('fmvDv').value;
      const exposure = data.get('exposure').value;
      if (ObjectUtil.isEmpty(facilityType) && ObjectUtil.isEmpty(loanLimit) && ObjectUtil.isEmpty(osLimit)
          && ObjectUtil.isEmpty(proposedLimit) && ObjectUtil.isEmpty(fmvDv) && ObjectUtil.isEmpty(exposure)) {
        this.isAllExposureFieldNull = true;
      } else {
        this.isAllExposureFieldNull = false;
      }
    });
  }

    getData(data) {
        this.files = data;
        this.proposalForm.patchValue({
            files: JSON.stringify(data)
        });
    }

    guarantors(guarantors) {
        this.loan.taggedGuarantors = guarantors;
    }

    setLoanHolder(loan: LoanDataHolder) {
        this.loan = loan;
    }
}
