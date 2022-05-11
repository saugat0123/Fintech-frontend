import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../../nabil-offer-letter-const';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-common-section-top',
  templateUrl: './common-section-top.component.html',
  styleUrls: ['./common-section-top.component.scss']
})
export class CommonSectionTopComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  form: FormGroup;
  spinner = false;
  offerLetterConst = NabilOfferLetterConst;
  loanHolderInfo;
  tempData;
  assignedData;
  sanctionLetterDate;
  constructor(
    private formBuilder: FormBuilder,
    private engToNepaliDate: EngNepDatePipe
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.fillForm();
    }
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      referenceNumber: [undefined],
      sanctionLetterDate: [undefined],
      nameOfBorrower: [undefined],
      addressOfBorrower: [undefined],
    });
  }
  setLoanConfigData(data: any) {
    let cadNepData = {
      numberNepali: ')',
      nepaliWords: 'सुन्य',
    };
    const customerAddress =
        data.permanentMunicipality + ' , ' +
        data.permanentWard + ' , ' +
        data.permanentProvince + ' , ' +
        data.permanentDistrict;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepData)) {
      cadNepData = JSON.parse(this.cadOfferLetterApprovedDoc.nepData);
    }
    this.form.patchValue({
      customerName: data.name ? data.name : '',
      customerAddress: customerAddress ? customerAddress : ''
    });
  }
  fillForm() {
    // ref number of customer
    let autoRefNumber;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.assignedData = this.cadOfferLetterApprovedDoc.assignedLoan[0];
      autoRefNumber = this.assignedData.refNo;
    }
    // Sanction-letter-date
    const previousSanctionType  = this.tempData.smeGlobalForm.dateOfApprovalType ? this.tempData.smeGlobalForm.dateOfApprovalType : '';
    if (previousSanctionType === 'AD') {
      const sanctionLetDate = this.tempData.smeGlobalForm.dateOfApproval ? this.tempData.smeGlobalForm.dateOfApprovalCT : '';
      this.sanctionLetterDate = sanctionLetDate ? sanctionLetDate : '';
      } else {
      const sanctionLetDate = this.tempData.smeGlobalForm.dateOfApprovalCT ? this.tempData.smeGlobalForm.dateOfApprovalCT : '';
      this.sanctionLetterDate = sanctionLetDate ? sanctionLetDate : '';
    }
    // address of customer
    let customerAddress;
    if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
      customerAddress =  ((!ObjectUtil.isEmpty(this.loanHolderInfo.registeredMunicipality) &&
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
    /*const customerAddress = this.loanHolderInfo.registeredMunicipality.ct + '-' +
        this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct + ', ' +
        this.loanHolderInfo.registeredProvince.ct + ' प्रदेश ';*/
    this.form.patchValue({
      referenceNumber: autoRefNumber ? autoRefNumber : '',
      nameOfBorrower: this.loanHolderInfo.name ? this.loanHolderInfo.name.ct : '',
      addressOfBorrower: customerAddress ? customerAddress : '',
    });
  }

}
