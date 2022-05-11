import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../../../nabil-offer-letter-const';
import {EngNepDatePipe} from 'nepali-patro';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-common-section-top-print',
  templateUrl: './common-section-top-print.component.html',
  styleUrls: ['./common-section-top-print.component.scss']
})
export class CommonSectionTopPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() customerApprovedDoc;
  form: FormGroup;
  spinner = false;
  offerLetterConst = NabilOfferLetterConst;
  loanHolderInfo;
  tempData;
  autoRefNumber;
  sanctionLetterDate;
  addressOfBorrower;
  constructor(
      private formBuilder: FormBuilder,
      private engToNepaliDate: EngNepDatePipe,
  ) { }

  ngOnInit() {
    // reference number
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    // for address
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
        this.addressOfBorrower =  ((!ObjectUtil.isEmpty(this.loanHolderInfo.registeredMunicipality) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.registeredMunicipality.ct)) ?
                this.loanHolderInfo.registeredMunicipality.ct : '') +
            ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard.ct)) ?
                '-' + this.loanHolderInfo.permanentWard.ct : '') +
            ((!ObjectUtil.isEmpty(this.loanHolderInfo.registeredDistrict) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.registeredDistrict.ct)) ?
                ', ' + this.loanHolderInfo.registeredDistrict.ct : '') +
            ((!ObjectUtil.isEmpty(this.loanHolderInfo.registeredProvince) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.registeredProvince.ct)) ?
                ' ,' + this.loanHolderInfo.registeredProvince.ct + ' प्रदेश ' : '');
      }
      /*this.addressOfBorrower = this.loanHolderInfo.registeredMunicipality.ct + '-' +
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct +
          ', ' + this.loanHolderInfo.registeredProvince.ct;*/
    }
    // date of Approval
    const previousSanctionType  = this.tempData.smeGlobalForm.dateOfApprovalType ? this.tempData.smeGlobalForm.dateOfApprovalType : '';
    if (previousSanctionType === 'AD') {
      const sanctionLetDate = this.tempData.smeGlobalForm.dateOfApproval ? this.tempData.smeGlobalForm.dateOfApprovalCT : '';
      this.sanctionLetterDate = sanctionLetDate ? sanctionLetDate : '';
    } else {
      const sanctionLetDate = this.tempData.smeGlobalForm.dateOfApprovalCT ? this.tempData.smeGlobalForm.dateOfApprovalCT : '';
      this.sanctionLetterDate = sanctionLetDate ? sanctionLetDate : '';
    }
  }
}
