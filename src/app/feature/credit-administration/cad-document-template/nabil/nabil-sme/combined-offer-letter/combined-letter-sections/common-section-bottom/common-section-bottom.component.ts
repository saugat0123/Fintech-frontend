import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../../nabil-offer-letter-const';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-common-section-bottom',
  templateUrl: './common-section-bottom.component.html',
  styleUrls: ['./common-section-bottom.component.scss']
})
export class CommonSectionBottomComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  form: FormGroup;
  spinner = false;
  offerLetterConst = NabilOfferLetterConst;
  position = 'सम्पर्क अधिकृत';
  position1 = 'सम्पर्क प्रबन्धक';
  loanHolderInfo;
  initialInfoPrint;
  tempData;
  freeTextVal: any = {};
  freeInformation: any;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);

      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    this.setFreeText();
    this.fillForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      nameOfBranchManager: [undefined],
      position: [undefined],
      position1: [undefined],
      branchName: [undefined],
      nameOfARO_RO_RM_ARM: [undefined],
      freeTextVal: [undefined],
    });
  }
  fillForm() {
    this.form.patchValue({
      nameOfARO_RO_RM_ARM: this.tempData.smeGlobalForm.nameOfRelationshipManagerCT ? this.tempData.smeGlobalForm.nameOfRelationshipManagerCT : '',
      nameOfBranchManager: this.tempData.smeGlobalForm.nameOfBranchManagerCT ? this.tempData.smeGlobalForm.nameOfBranchManagerCT : '',
      position : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.position : '',
      position1 : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.position1 : '',
      branchName: this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',

    });
  }
  setFreeText() {
    this.freeTextVal = {
      sixthText: this.form.get('position').value,
      seventhText: this.form.get('position1').value,
    };
  }

}
