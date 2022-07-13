import {AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {ExistingExposure} from '../../loan/model/existingExposure';
import {LoanType} from '../../loan/model/loanType';
import {NbDialogRef} from '@nebular/theme';

@Component({
    selector: 'app-existing-exposure',
    templateUrl: './existing-exposure.component.html',
    styleUrls: ['./existing-exposure.component.scss']
})
export class ExistingExposureComponent implements OnInit, AfterContentChecked {
    @Input() customerType;
    @Input() customerInfo: CustomerInfoData;
    @Output() triggerCustomerRefresh = new EventEmitter<boolean>();
    existingExposure: FormGroup;
    submitted = false;
    loanList = [];
    selectedLoanList = [];
    multipleSelectedLoanType = [];
    existingData = [];
    loanListType = LoanType.value();
    existingExposureData: ExistingExposure = new ExistingExposure();

    constructor(private formBuilder: FormBuilder,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService,
                private loanFormService: LoanFormService,
                private customerInfoService: CustomerInfoService,
                private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.customerInfo.existingExposures)) {
            if (this.customerInfo.existingExposures.length > 0) {
                this.existingData = this.customerInfo.existingExposures;
                this.setLoans();
            } else {
                this.getApprovedLoanList();
            }
        } else {
            this.getApprovedLoanList();
        }
        this.getAllLoanList();
    }

    buildForm() {
        this.existingExposure = this.formBuilder.group({
            exposure: this.formBuilder.array([]),
        });
    }

    get formControls() {
        return this.existingExposure.controls;
    }

    getAllLoanList() {
        this.loanConfigService.getAllByLoanCategory(this.customerType)
            .subscribe((res: any) => {
                this.loanList = res.detail;
            }, (error) => {
                this.toastService.show(new Alert(AlertType.DANGER, 'Cannot get loan list '));
            }, () => {
                this.sliceLoan();
            });
    }

    private sliceLoan() {
        this.loanListType.forEach((val) => {
            if (val.key === 'CLOSURE_LOAN' || val.key === 'PARTIAL_SETTLEMENT_LOAN' || val.key === 'FULL_SETTLEMENT_LOAN'
                || val.key === 'RELEASE_AND_REPLACEMENT' || val.key === 'PARTIAL_RELEASE_OF_COLLATERAL'
                || val.key === 'INTEREST_RATE_REVISION') {
                return true;
            }
            this.multipleSelectedLoanType.push(val);
        });
        this.selectedLoanList = this.multipleSelectedLoanType[0]['key'];
    }

    addExposure() {
        const exposure: any = {
            existingLimit : null,
            proposedLimit : null,
            interestRate : null,
            existInterestRate : null,
            baseRate : null,
            premiumRateOnBaseRate : null,
            tenureDurationInMonths : null,
            outStandingLimit : null,
            existCashMargin : null,
            cashMargin : null,
            existCommissionPercentage : null,
            commissionPercentage : null,
            enhanceLimitAmount : null,
            commitmentFee : null,
            settlementAmount : null,
            existingDateOfExpiry : null,
        };
        (this.existingExposure.get('exposure') as FormArray).push(
            this.formBuilder.group({
                proposalData: this.formBuilder.group(exposure) as FormGroup,
                loanId: [undefined],
                originalLimit: [undefined],
                loanType: ['NEW_LOAN'],
                loanName: [undefined],
                loanConfig: [undefined],
                docStatus: ['APPROVED'],
            })
        );
        const c: ExistingExposure = new ExistingExposure();
        this.existingData.push(c);
        // this.existingData =  this.existingExposure.get('exposure').value;
    }

    getApprovedLoanList() {
        this.loanFormService.getLoansByLoanHolderIdAndDocStatus(this.customerInfo.id, 'APPROVED')
            .subscribe((res: any) => {
                const approvedLoanList = res.detail;
                approvedLoanList.forEach(al => {
                    this.setApprovedLoanData(al);
                });
            });
    }

    setApprovedLoanData(data: any) {
        const control = this.existingExposure.get('exposure') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            control.push(
                this.formBuilder.group({
                    proposalData: this.addProposalData(JSON.parse(data.proposal.data)),
                    loanName: [data.loan.name],
                    loanNature: [data.loan.loanNature],
                    loanType: [data.loanType],
                    loanConfig: [data.loan],
                    docStatus: [data.documentStatus],
                    loanId: [data.id],
                    originalLimit: [data.proposal.proposedLimit]
                })
            );
        }
        this.existingData = control.value;
    }

    removeLoan(i: number) {
        (this.existingExposure.get('exposure') as FormArray).removeAt(i);
        if (this.existingData.length > 0) {
            this.existingData.splice(i, 1);
        }
    }

    calculateRate(i: number, controlName) {
        let total = 0;
        const base = Number(this.existingExposure.get(['exposure', i, 'proposalData']).get('baseRate').value);
        const premiumRate = Number(this.existingExposure.get(['exposure', i, 'proposalData']).get('premiumRateOnBaseRate').value);
        const interest = Number(this.existingExposure.get(['exposure', i, 'proposalData']).get('interestRate').value);
        switch (controlName) {
            case 'baseRate':
                total = base + premiumRate;
                this.existingExposure.get(['exposure', i, 'proposalData'])
                    .get('interestRate').setValue(Number(total).toFixed(2));
                break;
            case 'interestRate':
                total = interest - base;
                this.existingExposure.get(['exposure', i, 'proposalData'])
                    .get('premiumRateOnBaseRate').setValue(Number(total).toFixed(2));
                break;
            default:
                return;
        }
    }

    calculateLimitValues(type: string, i: number) {
        let totalLimit = 0;
        const existingLimit = Number(this.existingExposure.get(['exposure', i, 'proposalData']).get('existingLimit').value);
        const settlementAmount = Number(this.existingExposure.get(['exposure', i, 'proposalData']).get('settlementAmount').value);
        const enhanceLimitAmount = Number(this.existingExposure.get(['exposure', i, 'proposalData']).get('enhanceLimitAmount').value);
        if (type.toString() === 'settlement') {
            totalLimit = existingLimit - settlementAmount;
        } else {
            totalLimit = existingLimit + enhanceLimitAmount;
        }
        this.existingExposure.get(['exposure', i, 'proposalData']).get('proposedLimit').setValue(Number(totalLimit).toFixed(2));
    }

    onSubmit() {
        this.submitted = true;
        if (this.existingExposure.invalid) {
            this.toastService.show(new Alert(AlertType.ERROR, 'Please check Validation'));
            return;
        }
        this.setExposure();
        this.customerInfoService.saveExistingExposure(this.existingData, this.customerInfo.id)
            .subscribe((res: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Existing Exposure'));
                this.triggerCustomerRefresh.emit(true);
            console.log('res', res);
        });
    }

    addProposalData(data) {
        return this.formBuilder.group({
            existingLimit: [ObjectUtil.isEmpty(data) ? undefined : data.existingLimit],
            proposedLimit: [ObjectUtil.isEmpty(data) ? undefined :
                data.proposedLimit, [Validators.required, Validators.min(0)]],
            existInterestRate: [ObjectUtil.isEmpty(data) ? undefined :
                data.existInterestRate],
            interestRate: [ObjectUtil.isEmpty(data) ? undefined : data.interestRate],
            baseRate: [ObjectUtil.isEmpty(data) ? undefined : data.baseRate],
            premiumRateOnBaseRate: [ ObjectUtil.isEmpty(data) ? undefined : data.premiumRateOnBaseRate],
            tenureDurationInMonths: [ObjectUtil.isEmpty(data) ? undefined : data.tenureDurationInMonths],
            outStandingLimit: [ObjectUtil.isEmpty(data) ? undefined : data.outStandingLimit],
            existCashMargin: [ObjectUtil.isEmpty(data) ? undefined : data.existCashMargin],
            cashMargin: [ObjectUtil.isEmpty(data) ? undefined : data.cashMargin],
            existCommissionPercentage: [ObjectUtil.isEmpty(data) ? undefined : data.existCommissionPercentage],
            commissionPercentage: [ObjectUtil.isEmpty(data) ? undefined : data.commissionPercentage],
            enhanceLimitAmount: [ObjectUtil.isEmpty(data) ? undefined : data.enhanceLimitAmount],
            commitmentFee: [ObjectUtil.isEmpty(data) ? undefined : data.commitmentFee],
            settlementAmount: [ObjectUtil.isEmpty(data) ? undefined : data.settlementAmount],
            existingDateOfExpiry: [ObjectUtil.isEmpty(data) ? undefined :
                ObjectUtil.isEmpty(data.existingDateOfExpiry) ? undefined :  new Date(data.existingDateOfExpiry)]
        });
    }

    setExposure() {
        const data = this.existingExposure.get('exposure') as FormArray;
        console.log('existingData', this.existingData);
        console.log('Data Value', data.value);
        data.value.forEach((d, i) => {
           this.existingData[i].proposalData = JSON.stringify(d.proposalData);
           this.existingData[i].loanId = d.loanId;
           this.existingData[i].loanType = d.loanType;
           this.existingData[i].loanName = d.loanName;
           this.existingData[i].loanConfig = d.loanConfig;
           this.existingData[i].docStatus = d.docStatus;
           this.existingData[i].originalLimit = Number(d.proposalData.proposedLimit);
        });
    }

    setLoans() {
        const formArray = (this.existingExposure.get('exposure') as FormArray);
        this.existingData.forEach((e, i) => {
            formArray.push(this.formBuilder.group({
                proposalData: this.addProposalData(JSON.parse(e.proposalData)),
                loanType: [e.loanType],
                loanName: [e.loanName],
                loanId: [e.loanId],
                loanConfig: [e.loanConfig],
                docStatus: [e.docStatus],
                originalLimit: [e.originalLimit],
                id: [e.id],
                version: [e.version]
            }));
        });
    }

    ngAfterContentChecked(): void {
        this.ref.detectChanges();
    }

    setLoanNameAndType(value, i: number) {
        this.existingExposure.get(['exposure', i , 'loanName']).patchValue(value.name);
        this.existingExposure.get(['exposure', i , 'loanConfig']).patchValue(value);
        return;
    }
}
