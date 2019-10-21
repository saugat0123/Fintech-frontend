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
    proposal: Proposal = new Proposal();
    formDataForEdit;
    proposalData: Object;
    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        // this.proposalForm.get('interestRate').valueChanges.subscribe( value => this.proposalForm.get('premiumRateOnBaseRate')
        //     .patchValue( Number(value) - Number(this.proposalForm.get('baseRate').value)));
        // this.proposalForm.get('baseRate').valueChanges.subscribe( value => this.proposalForm.get('premiumRateOnBaseRate')
        //     .patchValue(Number(this.proposalForm.get('interestRate').value) - Number(value)));
        //
        if (this.formValue !== undefined) {
            const  formValueString = JSON.stringify(this.formValue);
            this.formDataForEdit = JSON.parse(formValueString);
            // const formValue = this.formDataForEdit.data.proposalForm;
        }
    }

    buildForm() {
        this.proposalForm = this.fb.group({

            proposedLimit: [this.formValue.proposedLimit === undefined ? '' :
                this.formValue.proposedLimit, [Validators.required, Validators.min(0)]],
            interestRate: [this.formValue.interestRate === 0 ? '' :
                this.formValue.interestRate, [Validators.required, Validators.min(0)]],
            baseRate: [this.formValue.baseRate === 0 ? '' :
                this.formValue.baseRate, [Validators.required, Validators.min(0)]],
            premiumRateOnBaseRate: [this.formValue.premiumRateOnBaseRate === 0 ? '' :
                this.formValue.premiumRateOnBaseRate, [Validators.required, Validators.min(0)]],
            serviceChargeMethod: [this.formValue.serviceChargeMethod === undefined ? '' :
                this.formValue.serviceChargeMethod, [Validators.required]],
            serviceCharge: [this.formValue.serviceCharge === undefined ? '' :
                this.formValue.serviceCharge, [Validators.required, Validators.min(0)]],
            tenureDurationInMonths: [this.formValue.tenureDurationInMonths === undefined ? '' :
                this.formValue.tenureDurationInMonths, [Validators.required, Validators.min(0)]],
            cibCharge: [this.formValue.cibCharge === undefined ? '' :
                this.formValue.cibCharge, [Validators.required, Validators.min(0)]],
            repaymentMode: [this.formValue.repaymentMode === undefined ? null :
                this.formValue.repaymentMode, [Validators.required]],
            purposeOfSubmission: [this.formValue.purposeOfSubmission === undefined ? '' :
                this.formValue.purposeOfSubmission, [Validators.required]],
            disbursementCriteria: [this.formValue.disbursementCriteria === undefined ? '' :
                this.formValue.disbursementCriteria, [Validators.required]],
            creditInformationReportStatus: [this.formValue.creditInformationReportStatus === undefined ? '' :
                this.formValue.creditInformationReportStatus, [Validators.required]],
            incomeFromTheAccount: [this.formValue.incomeFromTheAccount === undefined ? '' :
                this.formValue.incomeFromTheAccount, [Validators.required]],
            borrowerInformation: [this.formValue.borrowerInformation === undefined ? '' :
                this.formValue.borrowerInformation, [Validators.required]],
            // for installment Amount
            installmentAmount: [this.formValue.installmentAmount === undefined ? '' :
                this.formValue.installmentAmount, [Validators.required]],
            // for moratoriumPeriod Amount
            moratoriumPeriod: [this.formValue.moratoriumPeriod === undefined ? '' :
                this.formValue.moratoriumPeriod, [Validators.required]],
            // for prepaymentCharge Amount
            prepaymentCharge: [this.formValue.prepaymentCharge === undefined ? '' :
                this.formValue.prepaymentCharge, [Validators.required]],
            // for prepaymentCharge Amount
            purposeOfSubmissionSummary: [this.formValue.purposeOfSubmissionSummary === undefined ? '' :
                this.formValue.purposeOfSubmissionSummary, [Validators.required]],
            // for commitmentFee Amount6523
            commitmentFee: [this.formValue.commitmentFee === undefined ? '' :
                this.formValue.commitmentFee, [Validators.required]]
        });

    }

    onSubmit() {
        console.log(this.proposalForm);
        const proposalData = this.proposalForm.value;
        // this.proposal = this.proposalForm.value;
        this.proposalData = {data: proposalData};
    }

    get formControls() {
        return this.proposalForm.controls;
    }


}
