import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section11-extra-clauses-for-auto-loan',
  templateUrl: './section11-extra-clauses-for-auto-loan.component.html',
  styleUrls: ['./section11-extra-clauses-for-auto-loan.component.scss']
})
export class Section11ExtraClausesForAutoLoanComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  isAutoLoan: boolean;
  loanName: Array<any> = new Array<any>();
  tempData;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    this.checkLoan();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
    });
  }
  checkLoan() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.cadData.assignedLoan.forEach(val => {
        this.loanName.push(val.loan.name);
      });
      this.loanName.forEach(value => {
        if (value === 'AUTO LOAN COMBINED') {
          this.isAutoLoan = true;
        }
      });
    }
  }
}
