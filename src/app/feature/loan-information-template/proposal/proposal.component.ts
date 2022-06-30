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
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {IncomeFromAccountComponent} from '../income-from-account/income-from-account.component';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../loan/model/loanData';
import {NgxSpinnerService} from 'ngx-spinner';
import {CombinedLoan} from '../../loan/model/combined-loan';
import {CombinedLoanService} from '../../service/combined-loan.service';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {SecurityAdderComponent} from '../../loan-information-view/security-view/security-adder/security-adder.component';
import {CadFileSetupComponent} from '../../credit-administration/cad-work-flow/cad-work-flow-base/legal-and-disbursement/cad-file-setup/cad-file-setup.component';

@Component({
    selector: 'app-proposal',
    templateUrl: './proposal.component.html',
    styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit {

    submitted = false;

    @Input() formValue: Proposal;
    @Input() loanIds;
    @Input() loanType;
    @Input() customerInfo: CustomerInfoData;
    @Input() fromProfile;
    @Input() loan: LoanDataHolder;
    @ViewChild('earning', {static: false}) earning: IncomeFromAccountComponent;
    @ViewChild('securityAdderComponent', {static: false}) securityAdderComponent: SecurityAdderComponent;
    @ViewChild('cadSetup', {static: false}) cadSetup: CadFileSetupComponent;
    @Output() emitter = new EventEmitter();
    @Input() loanList = [];
    @Input() isLoanBeingEdit = false;
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
    waiverChecked = false;
    deviationChecked = false;
    riskChecked = false;
    checkedDataEdit;
    ckeConfig;
    checkApproved = false;
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
    loanEnumType = LoanType;
    showInstallmentAmount = false;
    showRepaymentMode = false;
    subsidizedLoanChecked = false;
    client = environment.client;
    clientName = Clients;
    othersSubsidyLoan = false;
    existInterestLimit: number;
    showInterestAmount = true;
    legalDocs;
    commitmentChecked = false;
    swapDoubleChargeChecked = false;
    prepaymentChargeChecked = false;
    purposeChecked = false;
    debtChecked = false;
    netChecked = false;
    borrowChecked = false;
    endUseChecked = false;
    checkedHistorical = false;
    checkedProjection = false;
    fixedAssetsChecked = false;
    summaryEnvChecked = false;
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
    files = [];
    incomeFromAccountDataResponse;
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
    combineLoanList: Array<LoanDataHolder> = [];
    guarantor = new FormControl(undefined, Validators.required);
    isSbk = false;
    isInsti = false;
    showCad = false;

    dropdownPriorities = [
        {id: 'HIGH', name: 'High'},
        {id: 'MEDIUM', name: 'Medium'},
        {id: 'LOW', name: 'Low'},
    ];
    existingCombinedLoan = {
        id: undefined,
        version: undefined
    };
    customerGroupLoanList: Array<LoanDataHolder> = Array<LoanDataHolder>();
    combinedLoansIds: number[] = [];
    removeFromCombinedLoan = false;
    existingExpo = [];


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
                private combinedLoanService: CombinedLoanService
    ) {
    }

    ngOnInit() {
        this.configEditor();
        this.buildForm();
        this.checkLoanTypeAndBuildForm();
        if (!ObjectUtil.isEmpty(this.formValue) && this.formValue.data !== null) {
            this.formDataForEdit = JSON.parse(this.formValue.data);
            if (ObjectUtil.isEmpty(this.formDataForEdit.deposit) || this.formDataForEdit.deposit.length < 1) {
                if (!ObjectUtil.isEmpty(this.formDataForEdit.depositBank)) {
                    (this.proposalForm.get('deposit') as FormArray).push(this.formBuilder.group({
                        amount: this.formDataForEdit.depositBank,
                        assets: this.formDataForEdit.depositBankRemark
                    }));
                }
                if (!ObjectUtil.isEmpty(this.formDataForEdit.depositOther)) {
                    (this.proposalForm.get('deposit') as FormArray).push(this.formBuilder.group({
                        amount: this.formDataForEdit.depositOther,
                        assets: this.formDataForEdit.depositOtherRemark
                    }));
                }
            }
            if (!ObjectUtil.isEmpty(this.formDataForEdit.vehicle)) {
                this.setFormData(this.formDataForEdit.vehicle, 'vehicle');
            } else {
                this.addKeyValue('vehicle');
            }
            if (!ObjectUtil.isEmpty(this.formDataForEdit.realState)) {
                this.setFormData(this.formDataForEdit.realState, 'realState');
            } else {
                this.addKeyValue('realState');
            }
            if (!ObjectUtil.isEmpty(this.formDataForEdit.shares)) {
                this.setFormData(this.formDataForEdit.shares, 'shares');
            } else {
                this.addKeyValue('shares');
            }
            if (!ObjectUtil.isEmpty(this.formDataForEdit.deposit)) {
                this.setFormData(this.formDataForEdit.deposit, 'deposit');
            } else {
                this.addKeyValue('deposit');
            }
      if (!ObjectUtil.isEmpty(this.formDataForEdit.fixedAssetsSummary)) {
        // this.setFormData(this.formDataForEdit.deposit, 'deposit');
        if (this.formDataForEdit.fixedAssetsSummary.length < 1  ) {
          this.addFixedArray();
        } else {
        this.setFixedArray();
        }
      } else {
        this.addFixedArray();
      }
            this.checkedDataEdit = JSON.parse(this.formValue.checkedData);
            this.setProposalData(this.formDataForEdit);
            this.setSummaryEnvironment(this.formDataForEdit);
            this.setCheckedData(this.checkedDataEdit);
            this.interestLimit = this.formDataForEdit['interestRate'];
            this.existInterestLimit = this.formDataForEdit['existInterestRate'];
            if (!ObjectUtil.isEmpty(this.formValue.groupExposure)) {
                this.groupExposureData = JSON.parse(this.formValue.groupExposure);
                this.proposalForm.patchValue(this.groupExposureData);
                this.setGroupExposureData(this.groupExposureData);
            }
            if (!ObjectUtil.isEmpty(this.formValue.proposedLimit)) {
                this.proposalForm.patchValue({
                    proposedLimit: this.formValue.proposedLimit
                });
            }
        } else {
            this.addFixedArray();
            this.setActiveBaseRate();
            this.addGroupExposureData();
        }
        if (!this.fromProfile) {
            this.activatedRoute.queryParams.subscribe(
                (paramsValue: Params) => {
                    this.allId = {
                        loanId: null,
                        customerId: null,
                        loanCategory: null
                    };
                    this.allId = paramsValue;
                    this.loanId = this.allId.loanId ? this.allId.loanId : this.loanIds;
                });
            if (!ObjectUtil.isEmpty(this.customerInfo.commonLoanData)) {
                const commonData = JSON.parse(this.customerInfo.commonLoanData);
                this.setFormData(commonData.vehicle, 'vehicle');
                this.setFormData(commonData.deposit, 'deposit');
                this.setFormData(commonData.realState, 'realState');
                this.setFormData(commonData.shares, 'shares');
            }
        }
        this.getLoanData();
        this.proposalForm.get('premiumRateOnBaseRate').valueChanges.subscribe(value => this.proposalForm.get('interestRate')
            .patchValue((Number(value) + Number(this.proposalForm.get('baseRate').value)).toFixed(2)));
        this.proposalForm.get('baseRate').valueChanges.subscribe(value => this.proposalForm.get('interestRate')
            .patchValue((Number(this.proposalForm.get('premiumRateOnBaseRate').value) + Number(value)).toFixed(2)));
        this.checkInstallmentAmount();
        this.proposalForm.get('proposedLimit').valueChanges.subscribe(value => {
            this.proposalForm.get('principalAmount')
                .patchValue(Number(value));
            this.proposedLimit = this.proposalForm.get('proposedLimit').value;
        });
        if (!ObjectUtil.isEmpty(this.formValue)) {
            this.proposalForm.get('proposedLimit').patchValue(this.formValue.proposedLimit);
        }
        if (!ObjectUtil.isEmpty(this.formValue)) {
            if (!ObjectUtil.isEmpty(this.formValue.data)) {
                const data = JSON.parse(this.formValue.data);
                if (!ObjectUtil.isEmpty(data.files)) {
                    this.files = JSON.parse(data.files);
                }
            }
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.incomeFromAccount)) {
            this.incomeFromAccountDataResponse = this.customerInfo.incomeFromAccount;
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
                    .forEach((l) => this.combinedLoansIds.push(l.id));
            }
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
        this.setValidatorForPrepaymentField();
        if (ObjectUtil.isEmpty(this.formDataForEdit)) {
            // this.existInterestLimit = this.loan.existInterestRate;

        }
    }

    buildForm() {
        this.proposalForm = this.formBuilder.group({
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
                || ObjectUtil.isEmpty(this.proposalData.prepaymentCharge)) ? 0 :
                this.proposalData.prepaymentCharge],
            // for prepaymentCharge Amount--
            // for commitmentFee Amount--
            commitmentFee: [undefined],
            solConclusionRecommendation: [undefined],
            waiverConclusionRecommendation: [undefined],
            riskConclusionRecommendation: [undefined],
            summeryRecommendation: undefined,
            purposeOfLoan: undefined,
            termsAndCondition: undefined,
            prepaymentSwapCommitment: [undefined],
            existCashMargin: [undefined],
            existCashMarginMethod: ['PERCENT'],
            existInterestRate: [undefined],
            existCommissionPercentage: [undefined],
            settlementAmount: [undefined],
            groupExposure: this.formBuilder.array([]),
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
            borrowingCase: [undefined],
            endUseOfFund: [undefined],
            justificationChangeHistorical: [undefined],
            justificationChangeProjection: [undefined],
            fixedAssetsSummary: this.formBuilder.array([]),
            summaryEnvironment: this.formBuilder.group({
                priority: [undefined],
                criticalSectorList: [undefined],
                criticalSector: [undefined],
                processApplicable: [undefined],
            }),
            justification: [undefined],
            currentRequest: [undefined]
        });
    }

    setValidatorForPrepaymentField() {
        if ((this.loanNatureSelected && this.fundableNonFundableSelcted &&
            this.isFundable && this.isTerminating) || this.isVehicle || this.isShare || this.isGeneral) {
            this.proposalForm.get('prepaymentCharge').setValidators([Validators.required, Validators.max(100), Validators.min(0)]);
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
        if (this.customerInfo.clientType === 'SMALL_BUSINESS_FINANCIAL_SERVICES') {
            this.isSbk = true;
        }
        if (this.customerInfo.customerType === 'INSTITUTION') {
            this.isInsti = true;
        }
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

    onSubmit() {
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
                waiverChecked: this.waiverChecked,
                riskChecked: this.riskChecked,
                subsidizedLoanChecked: this.subsidizedLoanChecked,
                deviationChecked: this.deviationChecked,
                commitmentChecked: this.commitmentChecked,
                swapDoubleChargeChecked: this.swapDoubleChargeChecked,
                prepaymentChargeChecked: this.prepaymentChargeChecked,
                purposeChecked: this.purposeChecked,
                debtChecked: this.debtChecked,
                netChecked: this.netChecked,
                borrowChecked: this.borrowChecked,
                endUseChecked: this.endUseChecked,
                fixedAssetsChecked: this.fixedAssetsChecked,
                summaryEnvChecked: this.summaryEnvChecked
            };
            this.proposalData.checkedData = JSON.stringify(mergeChecked);

            // Proposed Limit value--
        } else {
            this.securityAdderComponent.save();
            if (!ObjectUtil.isEmpty(this.customerInfo.commonLoanData)) {
                this.proposalForm.patchValue(JSON.parse(this.customerInfo.commonLoanData));
                this.proposalData.checkedData = JSON.parse(this.customerInfo.commonLoanData).mergedCheck;
            }
            this.proposalData.data = JSON.stringify(this.proposalForm.value);
            this.loan.proposal = this.proposalData;
            this.spinner.show();
            this.loanFormService.save(this.loan).subscribe((response: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Loan'));
                this.loan = response.detail;
                if (!this.combinedLoansIds.includes(this.loan.id)) {
                    this.combinedLoansIds.push(this.loan.id);
                }
                if (this.isLoanBeingEdit === false) {
                    this.loanList.push(this.loan);
                }
                this.spinner.hide();
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
                    if (this.loanList.length > 1) {
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
                    }
                } else {
                    this.spinner.hide();
                    this.emitter.emit(this.loan);
                }
                this.emitter.emit(this.loan);
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
            if (value.detail) {
                this.proposalForm.get('baseRate').setValue(value.detail.rate);
            }
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
            case 'waiver':
                if (event) {
                    this.waiverChecked = true;
                } else {
                    this.waiverChecked = false;
                    this.proposalForm.get('waiverConclusionRecommendation').setValue(null);
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
            case 'subsidizedLoan':
                if (event) {
                    this.subsidizedLoanChecked = true;
                } else {
                    this.subsidizedLoanChecked = false;
                    this.proposalForm.get('subsidizedLoan').setValue(null);
                    this.proposalForm.get('subsidyLoanType').setValue(null);
                }
                break;
            case 'deviation':
                if (event) {
                    this.deviationChecked = true;
                } else {
                    this.deviationChecked = false;
                    this.proposalForm.get('deviationConclusionRecommendation').setValue(null);
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
            case 'prepayment': {
                this.prepaymentChargeChecked = event;
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
            case 'borrow': {
                this.borrowChecked = event;
            }
                break;
            case 'endUse': {
                this.endUseChecked = event;
            }
                break;
            case 'changeHistorical': {
                this.checkedHistorical = event;
            }
                break;
            case 'changeProjection': {
                this.checkedProjection = event;
            }
                break;
            case 'fixedAssets': {
                this.fixedAssetsChecked = event;
            }
                break;
            case 'summaryEnv': {
                this.summaryEnvChecked = event;
            }
                break;
        }
    }

    setCheckedData(data) {
        if (!ObjectUtil.isEmpty(data)) {
            this.checkChecked(data['solChecked'], 'sol');
            this.checkChecked(data['waiverChecked'], 'waiver');
            this.checkChecked(data['riskChecked'], 'risk');
            this.checkChecked(data['subsidizedLoanChecked'], 'subsidizedLoan');
            this.checkChecked(data['deviationChecked'], 'deviation');
            this.checkChecked(data['commitmentChecked'], 'commitment');
            this.checkChecked(data['swapDoubleChargeChecked'], 'swapDoubleCharge');
            this.checkChecked(data['prepaymentChargeChecked'], 'prepayment');
            this.checkChecked(data['purposeChecked'], 'purpose');
            this.checkChecked(data['debtChecked'], 'debt');
            this.checkChecked(data['netChecked'], 'net');
            this.checkChecked(data['borrowChecked'], 'borrow');
            this.checkChecked(data['endUseChecked'], 'endUse');
            this.checkChecked(data['checkedHisrotical'], 'changeHistorical');
            this.checkChecked(data['checkedProjection'], 'changeProjection');
            this.checkChecked(data['fixedAssetsChecked'], 'fixedAssets');
            this.checkChecked(data['summaryEnvChecked'], 'summaryEnv');
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
            this.calculateRepaymentModeAmounts(this.proposalForm.get('repaymentModePrincipal').value, 'PRINCIPAL');
            this.calculateRepaymentModeAmounts(this.proposalForm.get('repaymentModeInterest').value, 'INTEREST');
        }
    }

    calculateEmiEqiAmount(repaymentMode) {
        const proposedAmount = this.proposalForm.get('proposedLimit').value;
        const rate = Number(this.proposalForm.get('interestRate').value) / (12 * 100);
        const n = this.proposalForm.get('tenureDurationInMonths').value;
        const eqiRate = Number(this.proposalForm.get('interestRate').value) / (4 * 100);
        if (proposedAmount && rate && n) {
            const emi = Number((proposedAmount * rate * Math.pow(1 + rate, n)) / Number(Math.pow(1 + rate, n) - 1));
            const eqi = Number((proposedAmount * eqiRate * Math.pow(1 + eqiRate, n / 4)) / Number(Math.pow(1 + eqiRate, n / 4) - 1));
            switch (repaymentMode) {
                case 'emi':
                    this.proposalForm.get('installmentAmount').patchValue(Number(emi.toFixed(2)));
                    break;
                case 'eqi':
                    this.proposalForm.get('installmentAmount').patchValue(Number(eqi.toFixed(2)));
                    break;
            }
        } else {
            this.proposalForm.get('installmentAmount').patchValue(undefined);
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
                this.proposalForm.get('interestAmount').patchValue(Number((interestAmount).toFixed(2)));
            }
            if (key === 'PRINCIPAL') {
                this.proposalForm.get('principalAmount').patchValue(Number((principleAmount).toFixed(2)));
            }
        }
    }

    setCollateralRequirement(collateralRequirement) {
        if (ObjectUtil.isEmpty(this.proposalForm.get('collateralRequirement').value)) {
            this.proposalForm.get('collateralRequirement').patchValue(collateralRequirement);
        }
    }

    checkInstallmentAmount() {
        if (this.proposalForm.get('repaymentMode').value === 'EMI' || this.proposalForm.get('repaymentMode').value === 'EQI') {
            this.showInstallmentAmount = true;
            this.showRepaymentMode = false;
            this.checkRepaymentMode();
            this.controlValidation(['repaymentModeInterest', 'repaymentModePrincipal'], false);
        } else if (this.proposalForm.get('repaymentMode').value === 'CUSTOM') {
            this.showInterestAmount = false;
            this.showRepaymentMode = true;
            this.showInstallmentAmount = false;
            this.controlValidation(['repaymentModeInterest', 'repaymentModePrincipal'], true);
        } else {
            this.calculateInterestAmountForRepaymentMode();
            this.showInstallmentAmount = false;
            this.showRepaymentMode = false;
            this.showInterestAmount = true;
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
        this.proposalForm.get('interestAmount').setValue(Number(interestAmount).toFixed(2));
        this.proposalForm.get('principalAmount').setValue(Number(proposeLimit).toFixed(2));
    }

    calculateInterestRate() {
        const baseRate = Number(this.proposalForm.get('baseRate').value);
        const premiumRateOnBaseRate = Number(this.proposalForm.get('premiumRateOnBaseRate').value);
        const discountRate = Number(this.proposalForm.get('subsidizedLoan').value);

        const interestRate = (baseRate - discountRate + premiumRateOnBaseRate);
        return this.proposalForm.get('interestRate').setValue(Number(interestRate).toFixed(2));
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
            (this.proposalForm.get('groupExposure') as FormArray).push(
                this.formBuilder.group({
                    clientName: [undefined],
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
                    clientName: [singleData.clientName],
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
            const clientName = data.get('clientName').value;
            const facilityType = data.get('facilityType').value;
            const loanLimit = data.get('loanLimit').value;
            const osLimit = data.get('osLimit').value;
            const proposedLimit = data.get('proposedLimit').value;
            const fmvDv = data.get('fmvDv').value;
            const exposure = data.get('exposure').value;
            if (ObjectUtil.isEmpty(clientName) && ObjectUtil.isEmpty(facilityType) && ObjectUtil.isEmpty(loanLimit) && ObjectUtil.isEmpty(osLimit)
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

    calculate() {
        let total = this.proposalForm.get('depositBank').value + this.proposalForm.get('depositOther').value;
        total += this.getArrayTotal('shares');
        total += this.getArrayTotal('vehicle');
        total += this.getArrayTotal('realState');
        total += this.getArrayTotal('deposit');
        this.proposalForm.get('total').patchValue(total);
    }

    getArrayTotal(formControl): number {
        let total = 0;
        (this.proposalForm.get(formControl).value).forEach((d, i) => {
            total += d.amount;
        });
        return total;
    }

    setFormData(data, formControl) {
        const form = this.proposalForm.get(formControl) as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(l => {
                form.push(this.formBuilder.group({
                    assets: [l.assets],
                    amount: [l.amount]
                }));
            });
        }
    }

    removeValue(formControl: string, index: number) {
        (<FormArray>this.proposalForm.get(formControl)).removeAt(index);
    }

    addKeyValue(formControl: string) {
        (this.proposalForm.get(formControl) as FormArray).push(
            this.formBuilder.group({
                assets: undefined,
                amount: 0,
            })
        );
    }



    guarantors(guarantors) {
        this.loan.taggedGuarantors = guarantors;
    }

    setLoanHolder(loan: LoanDataHolder) {
        this.loan = loan;
    }

  addFixedArray() {
    (this.proposalForm.get('fixedAssetsSummary') as FormArray).push(
      this.formBuilder.group({
        particular: [undefined],
        unit: [undefined],
        rate: [undefined],
        total: [undefined],
        remarks: [undefined],
      })
    );
  }
  setFixedArray() {
    const fixedAssets = this.proposalForm.get('fixedAssetsSummary') as FormArray;
      if (this.customerInfo.customerType === 'INSTITUTION') {
          this.formDataForEdit.fixedAssetsSummary.forEach(d => {
              fixedAssets.push(this.formBuilder.group({
                  particular: [d.particular],
                  unit: [d.unit],
                  rate: [d.rate],
                  total: [d.total],
                  remarks: [d.remarks],
              }));
          });
      }
  }

    deleteEmitter(event) {
        if (event === true) {
            this.ngOnInit();
        }
    }

    private setSummaryEnvironment(formDataForEdit: any) {
        const summaryEnvironmentFormGroup = this.proposalForm.get('summaryEnvironment') as FormGroup;
        if (!ObjectUtil.isEmpty(formDataForEdit.summaryEnvironment)) {
            summaryEnvironmentFormGroup.get('priority').patchValue(formDataForEdit.summaryEnvironment.priority);
            summaryEnvironmentFormGroup.get('criticalSectorList').patchValue(formDataForEdit.summaryEnvironment.criticalSectorList);
            summaryEnvironmentFormGroup.get('criticalSector').patchValue(formDataForEdit.summaryEnvironment.criticalSector);
            summaryEnvironmentFormGroup.get('processApplicable').patchValue(formDataForEdit.summaryEnvironment.processApplicable);
        }
    }

    private setProposalData(formDataForEdit: any) {
        this.proposalForm.get('proposedLimit').setValue(formDataForEdit.proposedLimit);
        this.proposalForm.get('interestRate').setValue(formDataForEdit.interestRate);
        this.proposalForm.get('baseRate').setValue(formDataForEdit.baseRate);
        this.proposalForm.get('premiumRateOnBaseRate').setValue(formDataForEdit.premiumRateOnBaseRate);
        this.proposalForm.get('serviceChargeMethod').setValue(formDataForEdit.serviceChargeMethod);
        this.proposalForm.get('swapChargeMethod').setValue(formDataForEdit.swapChargeMethod);
        this.proposalForm.get('tenureDurationInMonths').setValue(formDataForEdit.tenureDurationInMonths);
        this.proposalForm.get('repaymentMode').setValue(formDataForEdit.repaymentMode);
        this.proposalForm.get('repaymentModeInterest').setValue(formDataForEdit.repaymentModeInterest);
        this.proposalForm.get('repaymentModePrincipal').setValue(formDataForEdit.repaymentModePrincipal);
        this.proposalForm.get('disbursementCriteria').setValue(formDataForEdit.disbursementCriteria);
        this.proposalForm.get('repayment').setValue(formDataForEdit.repayment);
        this.proposalForm.get('borrowerInformation').setValue(formDataForEdit.borrowerInformation);
        this.proposalForm.get('interestAmount').setValue(formDataForEdit.interestAmount);
        this.proposalForm.get('existingLimit').setValue(formDataForEdit.existingLimit);
        this.proposalForm.get('outStandingLimit').setValue(formDataForEdit.outStandingLimit);
        this.proposalForm.get('collateralRequirement').setValue(formDataForEdit.collateralRequirement);
        this.proposalForm.get('swapCharge').setValue(formDataForEdit.swapCharge);
        this.proposalForm.get('subsidizedLoan').setValue(formDataForEdit.subsidizedLoan);
        this.proposalForm.get('remark').setValue(formDataForEdit.remark);
        this.proposalForm.get('cashMargin').setValue(formDataForEdit.cashMargin);
        this.proposalForm.get('commissionPercentage').setValue(formDataForEdit.commissionPercentage);
        this.proposalForm.get('commissionFrequency').setValue(formDataForEdit.commissionFrequency);
        this.proposalForm.get('couponRate').setValue(formDataForEdit.couponRate);
        this.proposalForm.get('premiumOnCouponRate').setValue(formDataForEdit.premiumOnCouponRate);
        this.proposalForm.get('tenorOfEachDeal').setValue(formDataForEdit.tenorOfEachDeal);
        this.proposalForm.get('cashMarginMethod').setValue(formDataForEdit.cashMarginMethod);
        this.proposalForm.get('enhanceLimitAmount').setValue(formDataForEdit.enhanceLimitAmount);
        this.proposalForm.get('subsidyLoanType').setValue(formDataForEdit.subsidyLoanType);
        this.proposalForm.get('others').setValue(formDataForEdit.others);
        this.proposalForm.get('installmentAmount').setValue(formDataForEdit.installmentAmount);
        this.proposalForm.get('principalAmount').setValue(formDataForEdit.principalAmount);
        this.proposalForm.get('moratoriumPeriod').setValue(formDataForEdit.moratoriumPeriod);
        this.proposalForm.get('prepaymentCharge').setValue(formDataForEdit.prepaymentCharge);
        this.proposalForm.get('commitmentFee').setValue(formDataForEdit.commitmentFee);
        this.proposalForm.get('solConclusionRecommendation').setValue(formDataForEdit.solConclusionRecommendation);
        this.proposalForm.get('waiverConclusionRecommendation').setValue(formDataForEdit.waiverConclusionRecommendation);
        this.proposalForm.get('riskConclusionRecommendation').setValue(formDataForEdit.riskConclusionRecommendation);
        this.proposalForm.get('summeryRecommendation').setValue(formDataForEdit.summeryRecommendation);
        this.proposalForm.get('purposeOfLoan').setValue(formDataForEdit.purposeOfLoan);
        this.proposalForm.get('termsAndCondition').setValue(formDataForEdit.termsAndCondition);
        this.proposalForm.get('prepaymentSwapCommitment').setValue(formDataForEdit.prepaymentSwapCommitment);
        this.proposalForm.get('existCashMargin').setValue(formDataForEdit.existCashMargin);
        this.proposalForm.get('existCashMarginMethod').setValue(formDataForEdit.existCashMarginMethod);
        this.proposalForm.get('existInterestRate').setValue(formDataForEdit.existInterestRate);
        this.proposalForm.get('existCommissionPercentage').setValue(formDataForEdit.existCommissionPercentage);
        this.proposalForm.get('settlementAmount').setValue(formDataForEdit.settlementAmount);
        this.proposalForm.get('files').setValue(formDataForEdit.files);
        this.proposalForm.get('deviationConclusionRecommendation').setValue(formDataForEdit.deviationConclusionRecommendation);
        this.proposalForm.get('depositBank').setValue(formDataForEdit.depositBank);
        this.proposalForm.get('depositOther').setValue(formDataForEdit.depositOther);
        this.proposalForm.get('depositBankRemark').setValue(formDataForEdit.depositBankRemark);
        this.proposalForm.get('depositOtherRemark').setValue(formDataForEdit.depositOtherRemark);
        this.proposalForm.get('total').setValue(formDataForEdit.total);
        this.proposalForm.get('totals').setValue(formDataForEdit.totals);
        this.proposalForm.get('borrowingCase').setValue(formDataForEdit.borrowingCase);
        this.proposalForm.get('endUseOfFund').setValue(formDataForEdit.endUseOfFund);
        this.proposalForm.get('justificationChangeHistorical').setValue(formDataForEdit.justificationChangeHistorical);
        this.proposalForm.get('justificationChangeProjection').setValue(formDataForEdit.justificationChangeProjection);
        this.proposalForm.get('justification').setValue(formDataForEdit.justification);
        this.proposalForm.get('currentRequest').setValue(formDataForEdit.currentRequest);
    }
    patchValue(data) {
        this.proposalForm.patchValue(JSON.parse(data));
    }
}
