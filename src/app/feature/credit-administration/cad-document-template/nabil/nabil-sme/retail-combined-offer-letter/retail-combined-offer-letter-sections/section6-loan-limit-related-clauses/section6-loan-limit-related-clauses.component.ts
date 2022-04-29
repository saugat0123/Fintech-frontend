import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section6-loan-limit-related-clauses',
  templateUrl: './section6-loan-limit-related-clauses.component.html',
  styleUrls: ['./section6-loan-limit-related-clauses.component.scss']
})
export class Section6LoanLimitRelatedClausesComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  tempData;
  loanName;
  assignedData;
  isOthers: boolean;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    this.fillForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      totalLimitInFigure: [undefined],
      totalLimitInWords: [undefined]
    });
  }
  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.assignedData = this.cadData.assignedLoan[0];
      this.loanName = this.assignedData.loan.name;
      if (this.loanName === 'EDUCATION LOAN COMBINED') {
        this.tempData.educationLoanForm.educationLoanCombinedFormArray.forEach(val => {
          if (val.countryName === 'OTHERS') {
            this.isOthers = true;
          }
        });
      }
    }
    this.form.patchValue({
      totalLimitInFigure: this.tempData.retailGlobalForm.totalLimitInFigureCT ? this.tempData.retailGlobalForm.totalLimitInFigureCT : '',
      totalLimitInWords: this.tempData.retailGlobalForm.totalLimitInWordsCT ? this.tempData.retailGlobalForm.totalLimitInWordsCT : '',
    });
  }
}
