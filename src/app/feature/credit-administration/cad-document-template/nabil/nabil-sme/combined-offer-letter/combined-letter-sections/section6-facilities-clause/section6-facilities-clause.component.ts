import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section6-facilities-clause',
  templateUrl: './section6-facilities-clause.component.html',
  styleUrls: ['./section6-facilities-clause.component.scss']
})
export class Section6FacilitiesClauseComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  @Input() freeText;
  form: FormGroup;
  tempData;
  tenureOfLoan;
  freeInformation: any;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    }
    this.fillForm();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      tenureOfLoan: [undefined],
    });
  }
  fillForm() {
    this.form.patchValue({
      tenureOfLoan: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.section6 : ''
    });
  }

}
