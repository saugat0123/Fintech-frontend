import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../../../nabil-offer-letter-const';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-common-section-top-print',
  templateUrl: './common-section-top-print.component.html',
  styleUrls: ['./common-section-top-print.component.scss']
})
export class CommonSectionTopPrintComponent implements OnInit {
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
      private datePipe: DatePipe
  ) { }

  ngOnInit() {
    // reference number
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc.assignedLoan)) {
      this.autoRefNumber = this.customerApprovedDoc.assignedLoan[0].refNo;
    }
    // for address
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.customerApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
      this.addressOfBorrower = this.loanHolderInfo.permanentMunicipality.ct + '-' +
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct +
          ' ,' + this.loanHolderInfo.permanentProvince.ct;
    }
    // Sanction-letter-date
    const previousSanctionType  = this.tempData.smeGlobalForm.previousSanctionType ? this.tempData.smeGlobalForm.previousSanctionType : '';
    if (previousSanctionType === 'AD') {
      const sanctionLetDate = this.tempData.smeGlobalForm.sanctionLetterDate ? this.tempData.smeGlobalForm.sanctionLetterDateCT : '';
      this.sanctionLetterDate = this.engToNepaliDate.transform(sanctionLetDate, true);
    } else {
      const sanctionLetDate = this.tempData.smeGlobalForm.sanctionLetterDate ? this.tempData.smeGlobalForm.sanctionLetterDateCT : '';
      this.sanctionLetterDate = sanctionLetDate ? sanctionLetDate : '';
    }
  }
}
