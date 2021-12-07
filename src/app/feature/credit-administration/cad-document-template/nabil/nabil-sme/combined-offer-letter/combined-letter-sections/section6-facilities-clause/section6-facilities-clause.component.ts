import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section6-facilities-clause',
  templateUrl: './section6-facilities-clause.component.html',
  styleUrls: ['./section6-facilities-clause.component.scss']
})
export class Section6FacilitiesClauseComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  form: FormGroup;
  tempData;

  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.fillForm();
    }
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      tenureOfLoan: [undefined],
    });
  }

  fillForm() {
    this.form.patchValue({
      tenureOfLoan: this.tempData.autoLoanMasterForm.tenureOfLoan ? this.tempData.autoLoanMasterForm.tenureOfLoan : ''
    });
  }

}
