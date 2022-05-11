import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-common-section-top-retail',
  templateUrl: './common-section-top-retail.component.html',
  styleUrls: ['./common-section-top-retail.component.scss']
})
export class CommonSectionTopRetailComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  tempData;
  assignedData;
  sanctionDate;
  loanHolderInfo;
  refNum;
  sanctionLetterDate;
  address;
  constructor(
      private formBuilder: FormBuilder,
      private datePipe: DatePipe,
      private engNepDatePipe: EngNepDatePipe
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      this.loanHolderInfo = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.fillform();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      referenceNumber: [undefined],
      sanctionLetterDate: [undefined],
      nameOfBorrower: [undefined],
      addressOfBorrower: [undefined],
    });
  }
  fillform() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.assignedData = this.cadData.assignedLoan[0];
      this.refNum = this.assignedData.refNo ? this.assignedData.refNo : '';
    }
    // Sanction-letter-date
    // tslint:disable-next-line:max-line-length
    const sanctionLetterDateType  = this.tempData.retailGlobalForm.sanctionLetterDateType ? this.tempData.retailGlobalForm.sanctionLetterDateType : '';
    if (sanctionLetterDateType === 'AD') {
      const sanctionLetDate = this.tempData.retailGlobalForm.sanctionLetterDate ? this.tempData.retailGlobalForm.sanctionLetterDate : '';
      this.sanctionLetterDate = this.engNepDatePipe.transform(this.datePipe.transform(sanctionLetDate), true);
    } else {
      this.sanctionDate = this.tempData.retailGlobalForm.sanctionLetterDateNepali ?
      this.tempData.retailGlobalForm.sanctionLetterDateNepali.nDate : '';
      this.sanctionLetterDate = this.sanctionDate ? this.sanctionDate : '';
    }
    if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
      this.address =  ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality) &&
              !ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality.ct)) ?
              this.loanHolderInfo.permanentMunicipality.ct : '') +
          ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard) &&
              !ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard.ct)) ?
              '-' + this.loanHolderInfo.permanentWard.ct : '') +
          ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict) &&
              !ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict.ct)) ?
              ', ' + this.loanHolderInfo.permanentDistrict.ct : '') +
          ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince) &&
              !ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince.ct)) ?
              ' ,' + this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ' : '');
    }
    this.form.patchValue({
      referenceNumber: this.refNum ? this.refNum : '',
      sanctionLetterDate: this.sanctionLetterDate ? this.sanctionLetterDate : '',
      nameOfBorrower : this.loanHolderInfo.name ? this.loanHolderInfo.name.np : '',
      addressOfBorrower : this.address ? this.address : '',
    });
  }
}
