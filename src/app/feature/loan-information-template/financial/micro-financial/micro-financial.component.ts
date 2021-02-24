import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-micro-financial',
    templateUrl: './micro-financial.component.html',
    styleUrls: ['./micro-financial.component.scss']
})
export class MicroFinancialComponent implements OnInit {
    microFinancialForm: FormGroup;

    constructor(protected formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.microFinancialForm = this.formBuilder.group({
          fiscalYears: [[]],
          borrowingAndDepositToCoreCapital: this.formBuilder.array([]),
          costOfFund: this.formBuilder.array([]),
          yieldOnPortfolio: this.formBuilder.array([]),
          capitalAdequacyRatio: this.formBuilder.array([]),
          NPARate: this.formBuilder.array([]),
          debtEquityRatio: this.formBuilder.array([]),
          returnOnAsset: this.formBuilder.array([]),
          iscr: this.formBuilder.array([]),
          dscr: this.formBuilder.array([])
        });
    }

    addFiscalYear(year) {
        const currentYears = this.microFinancialForm.get('fiscalYears').value;
        this.microFinancialForm.get('fiscalYears').patchValue([...currentYears, year]);
        for (const [key, value] of Object.entries(this.microFinancialForm.value)) {
            if (key !== 'fiscalYears') {
                console.log(key);
                (this.microFinancialForm.controls[`${key}`] as FormArray).push(this.formBuilder.group({
                    year: [year],
                    value: [0]
                }));
            }
        }
    }
}
