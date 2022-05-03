import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section14-other-terms',
  templateUrl: './section14-other-terms.component.html',
  styleUrls: ['./section14-other-terms.component.scss']
})
export class Section14OtherTermsComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  tempData;
  loanName: Array<any> = new Array<any>();
  assignedData;
  isShareLoan: boolean;
  NCELL: boolean;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    this.checkCondition();
  }
  buildForm() {
    return this.form = this.formBuilder.group({

    });
  }
  checkCondition() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.assignedData = this.cadData.assignedLoan.forEach(value => {
        this.loanName.push(value.loan.name);
      });
      this.loanName.forEach(value => {
        if (value === 'NABIL SHARE LOAN POD COMBINED' || value === 'SHARE LOAN DEMAND COMBINED') {
          this.isShareLoan = true;
        }
        if (value === 'HOME LOAN COMBINED') {
          this.tempData.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach(val => {
            if (val.NcellStaffCheck = true) {
              this.NCELL = true;
            }
          });
        }
      });
    }
  }
}
