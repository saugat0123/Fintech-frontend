import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-counter-guarantee-company',
    templateUrl: './counter-guarantee-company.component.html',
    styleUrls: ['./counter-guarantee-company.component.scss']
})
export class CounterGuaranteeCompanyComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    form: FormGroup;
    individualData;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        this.fillForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            nameOfBranch: [undefined]
        });
    }

    fillForm() {
      this.form.patchValue({
        nameOfBranch: this.individualData.branch ? this.individualData.branch.ct : ''
      });
    }
}
