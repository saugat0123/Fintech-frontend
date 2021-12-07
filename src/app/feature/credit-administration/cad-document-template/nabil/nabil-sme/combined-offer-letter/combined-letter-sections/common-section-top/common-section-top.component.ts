import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
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
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  form: FormGroup;
  spinner = false;
  offerLetterConst = NabilOfferLetterConst;
  loanHolderInfo;
  tempData;
  sanctionLetterDate;
  constructor(
    private formBuilder: FormBuilder,
    private engToNepaliDate: EngNepDatePipe,
    private datePipe: DatePipe
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
    // Sanction-letter-date
    const previousSanctionType  = this.tempData.smeGlobalForm.previousSanctionType ? this.tempData.smeGlobalForm.previousSanctionType : '';
    if (previousSanctionType === 'AD') {
      const sanctionLetDate = this.tempData.smeGlobalForm.sanctionLetterDate ? this.tempData.smeGlobalForm.sanctionLetterDateCT : '';
      this.sanctionLetterDate = this.engToNepaliDate.transform(sanctionLetDate, true);
      } else {
      const sanctionLetDate = this.tempData.smeGlobalForm.sanctionLetterDate ? this.tempData.smeGlobalForm.sanctionLetterDateCT : '';
      this.sanctionLetterDate = sanctionLetDate ? sanctionLetDate : '';
    }
    // address of customer
    const customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
        this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct + ' ,' +
        this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ';
    this.form.patchValue({
      nameOfBorrower: this.loanHolderInfo.name ? this.loanHolderInfo.name.ct : '',
      addressOfBorrower: customerAddress ? customerAddress : '',
    });
  }

}
