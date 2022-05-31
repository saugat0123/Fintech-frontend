import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section9-insurance-related-clauses',
  templateUrl: './section9-insurance-related-clauses.component.html',
  styleUrls: ['./section9-insurance-related-clauses.component.scss']
})
export class Section9InsuranceRelatedClausesComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  nepData;
  tempData;
  primarySecurity;
  isAutoOrLoan: boolean;
  isInsuranceRequired: boolean;
  securityType: Array<any> = new Array<any>();
  insurance: Array<any> = new Array<any>();
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.fillForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      nameOfBranch: [undefined]
    });
  }
  fillForm() {
    if (!ObjectUtil.isEmpty(this.tempData.securities)) {
      this.primarySecurity = this.tempData.securities.primarySecurity.forEach(value => {
        this.securityType.push(value.securityType);
        this.insurance.push(value.insuranceRequired);
      });
      this.securityType.forEach(value => {
        if (value === 'LAND_AND_BUILDING' || value === 'AUTO LOAN') {
          this.isAutoOrLoan = true;
          this.insurance.forEach(val => {
            if (val === true) {
              this.isInsuranceRequired = true;
            }
          });
        }
      });
    }
    this.form.patchValue({
      nameOfBranch: this.nepData.branch.ct,
    });
  }
}
