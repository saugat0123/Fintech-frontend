import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-fiscal-year-modal',
    templateUrl: './fiscal-year-modal.component.html',
    styleUrls: ['./fiscal-year-modal.component.scss']
})
export class FiscalYearModalComponent implements OnInit {
    financialStatementList = ['Projected', 'Provisional', 'Audited'];
    fiscalYearsArray = [
        '2070/2071',
        '2071/2072',
        '2072/2073',
        '2073/2074',
        '2074/2075',
        '2075/2076',
        '2076/2077',
        '2077/2078',
        '2078/2079',
        '2079/2080',
        '2080/2081',
        '2081/2082',
        '2082/2083',
        '2083/2084',
        '2084/2085',
        '2085/2086',
        '2086/2087',
        '2087/2088',
        '2088/2089',
        '2089/2090',
        '2090/2091',
        '2091/2092',
        '2092/2093',
        '2093/2094',
        '2094/2095',
        '2095/2096',
        '2096/2097',
        '2097/2098',
        '2098/2099',
        '2099/2100'
    ];
    financialStatementForm: FormGroup;

    spinner = false;
    showAuditorDetailsForm = false;

    fiscalYearValueChanges: any;

    constructor(private formBuilder: FormBuilder,
                private activeModalService: NgbActiveModal) {
    }

    get financialStatementFormControl() {
        return this.financialStatementForm.controls;
    }

    get auditorDetailsFormControl() {
        return (this.financialStatementForm.get('auditorDetails') as FormGroup).controls;
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.financialStatementForm = this.formBuilder.group({
            financialStatement: [undefined, Validators.required],
            fiscalYear: [undefined, [Validators.required, Validators.pattern('\\d\\d\\d\\d\\/\\d\\d\\d\\d')]],
            auditorDetails: [undefined]
        });
    }

    buildAuditorDetailsForm() {
        return this.formBuilder.group({
            audited: [this.financialStatementForm.get('fiscalYear').value],
            auditFirm: [undefined, Validators.required],
            proprietePartner: [undefined, Validators.required],
            membershipNo: [undefined, Validators.required],
            certificateOfPractice: [undefined, Validators.required],
            class: [undefined, Validators.required],
        });
    }

    onFinancialStatementChange(value) {
        if (value === 'Audited') {
            this.financialStatementForm.setControl('auditorDetails', this.buildAuditorDetailsForm());
            this.fiscalYearValueChanges = this.financialStatementForm.get('fiscalYear').valueChanges.subscribe(fiscalYearValue => {
                this.financialStatementForm.get('auditorDetails').get('audited').patchValue(fiscalYearValue);
            });
            this.showAuditorDetailsForm = true;
        } else {
            if (this.fiscalYearValueChanges) {
                this.fiscalYearValueChanges.unsubscribe();
            }
            this.financialStatementForm.removeControl('auditorDetails');
            this.showAuditorDetailsForm = false;
        }
    }

    onClose() {
        this.activeModalService.dismiss();
    }

    onSubmit() {
        const fiscalYearDetails = {
            fiscalYearValue: `${this.financialStatementForm.get('financialStatement').value === 'Audited' ?
                '*Audited*' : this.financialStatementForm.get('financialStatement').value} ${this.financialStatementForm.get('fiscalYear').value}`,
            auditorDetails: ObjectUtil.isEmpty(this.financialStatementForm.get('auditorDetails')) ? null : this.financialStatementForm.get('auditorDetails').value
        };
        this.activeModalService.close(fiscalYearDetails);
    }
}
