import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Proposal} from '../../../../admin/modal/proposal';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-proposal',
    templateUrl: './proposal.component.html',
    styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

    submitted = false;

    @Input() formValue: Proposal;
    proposalForm: FormGroup;
    proposalData: Proposal = new Proposal();
    formDataForEdit: Object;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {

        this.buildForm();
        if (!ObjectUtil.isEmpty(this.formValue)) {
            this.formDataForEdit = JSON.parse(this.formValue.data);
            this.proposalForm.setValue(this.formDataForEdit);
            this.proposalForm.get('proposedLimit').patchValue(this.formValue.proposedLimit);
        }
        // this.proposalForm.get('interestRate').valueChanges.subscribe( value => this.proposalForm.get('premiumRateOnBaseRate')
        //     .patchValue( Number(value) - Number(this.proposalForm.get('baseRate').value)));
        // this.proposalForm.get('baseRate').valueChanges.subscribe( value => this.proposalForm.get('premiumRateOnBaseRate')
        //     .patchValue(Number(this.proposalForm.get('interestRate').value) - Number(value)));

    }

    buildForm() {
        this.proposalForm = this.formBuilder.group({

            // Proposed Limit--
            proposedLimit: [undefined, [Validators.required, Validators.min(0)]],

            interestRate: [undefined, [Validators.required, Validators.min(0)]],
            baseRate: [undefined, [Validators.required, Validators.min(0)]],
            premiumRateOnBaseRate: [undefined, [Validators.required, Validators.min(0)]],
            serviceChargeMethod: [undefined, [Validators.required]],
            serviceCharge: [undefined, [Validators.required, Validators.min(0)]],
            tenureDurationInMonths: [undefined, [Validators.required, Validators.min(0)]],
            cibCharge: [undefined, [Validators.required, Validators.min(0)]],
            repaymentMode: [undefined, [Validators.required]],
            purposeOfSubmission: [undefined, [Validators.required]],
            disbursementCriteria: [undefined, [Validators.required]],
            creditInformationReportStatus: [undefined, [Validators.required]],
            incomeFromTheAccount: [undefined, [Validators.required]],
            borrowerInformation: [undefined, [Validators.required]],

            // Additional Fields--
            // for installment Amount--
            installmentAmount: [undefined, Validators.required],
            // for moratoriumPeriod Amount--
            moratoriumPeriod: [undefined, Validators.required],
            // for prepaymentCharge Amount--
            prepaymentCharge: [undefined, Validators.required],
            // for prepaymentCharge Amount--
            purposeOfSubmissionSummary: [undefined, Validators.required],
            // for commitmentFee Amount--
            commitmentFee: [undefined, Validators.required]
        });
    }

    onSubmit() {
        // Proposal Form Data--
        this.proposalData.data = JSON.stringify(this.proposalForm.value);

        // Proposed Limit value--
        this.proposalData.proposedLimit = this.proposalForm.get('proposedLimit').value;
    }

    get formControls() {
        return this.proposalForm.controls;
    }
}
