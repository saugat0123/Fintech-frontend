import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../../../model/OfferDocument';
import {CustomerSubType} from '../../../../../../../customer/model/customerSubType';

@Component({
  selector: 'app-section9-other-clause',
  templateUrl: './section9-other-clause.component.html',
  styleUrls: ['./section9-other-clause.component.scss']
})
export class Section9OtherClauseComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  offerLetterDocument: OfferDocument;
  isNaturalPerson;
  isloanAmountAbove50Crore;
  isworkingCapitalAbove25Crore;
  tempData;
  loanHolderData;
  form: FormGroup;
  freeInformation: any;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.loanHolderData = this.cadOfferLetterApprovedDoc.loanHolder.customerSubType;
    }
    this.fillForm();
    this.isNaturalPerson = this.tempData.smeGlobalForm.borrowerNaturalPerson;
    this.isloanAmountAbove50Crore = this.tempData.smeGlobalForm.loanAmountAbove50Crore;
    this.isworkingCapitalAbove25Crore = this.tempData.smeGlobalForm.workingCapitalAbove25Crore;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      freeText1: [undefined],
      freeText2: [undefined],
    });
  }
  fillForm() {
    this.form.patchValue({
      freeText1: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.section9.freeText1 : '',
      freeText2: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.section9.freeText2 : ''
    });
  }

}
