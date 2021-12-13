import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../../nabil-offer-letter-const';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../../../model/OfferDocument';

@Component({
  selector: 'app-common-section-bottom',
  templateUrl: './common-section-bottom.component.html',
  styleUrls: ['./common-section-bottom.component.scss']
})
export class CommonSectionBottomComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  offerLetterDocument: OfferDocument;
  form: FormGroup;
  spinner = false;
  offerLetterConst = NabilOfferLetterConst;
  position = 'सम्पर्क अधिकृत';
  position1 = 'सम्पर्क प्रबन्धक';
  loanHolderInfo;
  initialInfoPrint;
  tempData;
  freeInformation: any;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    // for free information
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.fillForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      nameOfBranchManager: [undefined],
      position: [undefined],
      position1: [undefined],
      branchName: [undefined],
      nameOfARO_RO_RM_ARM: [undefined]
    });
  }
  fillForm() {
    this.form.patchValue({
      branchName: this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
      nameOfARO_RO_RM_ARM: this.tempData.smeGlobalForm.nameOfRelationshipManagerCT ? this.tempData.smeGlobalForm.nameOfRelationshipManagerCT : '',
      nameOfBranchManager: this.tempData.smeGlobalForm.nameOfBranchManagerCT ? this.tempData.smeGlobalForm.nameOfBranchManagerCT : '',
      position : !ObjectUtil.isEmpty(this.position) ? this.position : '',
      position1 : !ObjectUtil.isEmpty(this.position1) ? this.position1 : '',
    });
    // position value
    if (!ObjectUtil.isEmpty(this.freeInformation)) {
      if (this.position === this.freeInformation.sectionBottom.position) {
        this.position = 'सम्पर्क अधिकृत';
      }
      if (this.position1 === this.freeInformation.sectionBottom.position1) {
        this.position1 = 'सम्पर्क प्रबन्धक';
      }
      if (this.freeInformation.sectionBottom.position !== this.position) {
        this.position = this.freeInformation.sectionBottom.position;
      }
      if (this.freeInformation.sectionBottom.position1 !== this.position1) {
        this.position1 = this.freeInformation.sectionBottom.position1;
      }
    }
  }

}
