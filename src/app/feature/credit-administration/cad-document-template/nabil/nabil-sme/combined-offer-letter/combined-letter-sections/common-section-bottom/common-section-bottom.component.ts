import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../../nabil-offer-letter-const';

@Component({
  selector: 'app-common-section-bottom',
  templateUrl: './common-section-bottom.component.html',
  styleUrls: ['./common-section-bottom.component.scss']
})
export class CommonSectionBottomComponent implements OnInit {
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
      samparkaAdhikrit: [undefined],
      branchName: [undefined],
      samparkaPrabandhak: [undefined]
    });
  }

}
