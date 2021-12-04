import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../../nabil-offer-letter-const';

@Component({
  selector: 'app-common-section-top',
  templateUrl: './common-section-top.component.html',
  styleUrls: ['./common-section-top.component.scss']
})
export class CommonSectionTopComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  form: FormGroup;
  spinner = false;
  offerLetterConst = NabilOfferLetterConst;
  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      sanctionLetterDate: [undefined],
      nameOfBorrower: [undefined],
      addressOfBorrower: [undefined],
    });
  }

}
