import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Proposal} from '../../../../admin/modal/proposal';

@Component({
    selector: 'app-proposal',
    templateUrl: './proposal.component.html',
    styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

    submitted = false;

    @Input() formValue: Proposal;
    proposalForm: FormGroup;
    proposalDetail: Proposal = new Proposal();

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        if (this.formValue !== undefined) {
            this.proposalDetail = this.formValue;
        }
        this.proposalForm = this.fb.group({
            proposedLimit: [this.proposalDetail.proposedLimit === undefined ? '' :
                this.proposalDetail.proposedLimit, [Validators.required, Validators.min(0)]],
            interestRate: [this.proposalDetail.interestRate === undefined ? '' :
                this.proposalDetail.interestRate, [Validators.required, Validators.min(0)]],
            baseRate: [this.proposalDetail.baseRate === undefined ? '' :
                this.proposalDetail.baseRate, [Validators.required, Validators.min(0)]],
            premiumRateOnBaseRate: [this.proposalDetail.premiumRateOnBaseRate === undefined ? '' :
                this.proposalDetail.premiumRateOnBaseRate, [Validators.required, Validators.min(0)]],
            serviceChargeMethod: [this.proposalDetail.serviceChargeMethod === undefined ? '' :
                this.proposalDetail.serviceChargeMethod, [Validators.required]],
            serviceCharge: [this.proposalDetail.serviceCharge === undefined ? '' :
                this.proposalDetail.serviceCharge, [Validators.required, Validators.min(0)]],
            tenureDurationInMonths: [this.proposalDetail.tenureDurationInMonths === undefined ? '' :
                this.proposalDetail.tenureDurationInMonths, [Validators.required, Validators.min(0)]],
            cibCharge: [this.proposalDetail.cibCharge === undefined ? '' :
                this.proposalDetail.cibCharge, [Validators.required, Validators.min(0)]],
            repaymentMode: [this.proposalDetail.repaymentMode === undefined ? null :
                this.proposalDetail.repaymentMode, [Validators.required]],
            purposeOfSubmission: [this.proposalDetail.purposeOfSubmission === undefined ? '' :
                this.proposalDetail.purposeOfSubmission, [Validators.required]],
            disbursementCriteria: [this.proposalDetail.disbursementCriteria === undefined ? '' :
                this.proposalDetail.disbursementCriteria, [Validators.required]],
            creditInformationReportStatus: [this.proposalDetail.creditInformationReportStatus === undefined ? '' :
                this.proposalDetail.creditInformationReportStatus, [Validators.required]],
            incomeFromTheAccount: [this.proposalDetail.incomeFromTheAccount === undefined ? '' :
                this.proposalDetail.incomeFromTheAccount, [Validators.required]],
            borrowerInformation: [this.proposalDetail.borrowerInformation === undefined ? '' :
                this.proposalDetail.borrowerInformation, [Validators.required]]
        });
    }

    onSubmit() {
        console.log(this.proposalForm);
        this.proposalDetail.proposedLimit = (<number>this.proposalForm.get('proposedLimit').value);
        this.proposalDetail.interestRate = (<number>this.proposalForm.get('interestRate').value);
        this.proposalDetail.baseRate = <number>this.proposalForm.get('baseRate').value;
        this.proposalDetail.premiumRateOnBaseRate = <number>this.proposalForm.get('premiumRateOnBaseRate').value;
        this.proposalDetail.serviceChargeMethod = this.proposalForm.get('serviceChargeMethod').value;
        this.proposalDetail.serviceCharge = <number>this.proposalForm.get('serviceCharge').value;
        this.proposalDetail.tenureDurationInMonths = <number>this.proposalForm.get('tenureDurationInMonths').value;
        this.proposalDetail.cibCharge = <number>this.proposalForm.get('cibCharge').value;
        this.proposalDetail.repaymentMode = this.proposalForm.get('repaymentMode').value;
        this.proposalDetail.purposeOfSubmission = this.proposalForm.get('purposeOfSubmission').value;
        this.proposalDetail.disbursementCriteria = this.proposalForm.get('disbursementCriteria').value;
        this.proposalDetail.creditInformationReportStatus = this.proposalForm.get('creditInformationReportStatus').value;
        this.proposalDetail.incomeFromTheAccount = this.proposalForm.get('incomeFromTheAccount').value;
        this.proposalDetail.borrowerInformation = this.proposalForm.get('borrowerInformation').value;
    }

    get formControls() {
        return this.proposalForm.controls;
    }


}
