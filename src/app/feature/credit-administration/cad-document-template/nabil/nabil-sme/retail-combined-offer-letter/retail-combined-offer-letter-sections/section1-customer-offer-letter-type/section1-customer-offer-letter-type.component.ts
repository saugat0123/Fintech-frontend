import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-section1-customer-offer-letter-type',
  templateUrl: './section1-customer-offer-letter-type.component.html',
  styleUrls: ['./section1-customer-offer-letter-type.component.scss']
})
export class Section1CustomerOfferLetterTypeComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  tempData;
  loanOption;
  loanData;
  assignedData;
  loanName;
  NCELL;
  reqDate;
  prevDate;
  constructor(
      private formBuilder: FormBuilder,
      private datepipe: DatePipe,
      private engNepDatePipe: EngNepDatePipe
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    this.loanOption = this.tempData.retailGlobalForm.loanType;
    this.fillForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      requestLetterDate: [undefined],
      previousSanctionLetter: [undefined],
      freetext1: [undefined],
    });
  }
  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.assignedData = this.cadData.assignedLoan[0];
      this.loanName = this.assignedData.loan.name;
      if (this.loanName === 'HOME LOAN COMBINED') {
        this.tempData.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach(value => {
          this.NCELL = value.NcellStaffCheck ? value.NcellStaffCheck : '';
        });
      }
     }
    // for request letter date
    if (this.tempData.retailGlobalForm.requestLetterDateType === 'AD') {
      const requestDate = this.tempData.retailGlobalForm ? this.tempData.retailGlobalForm.requestLetterDate : '';
      this.reqDate = this.engNepDatePipe.transform(this.datepipe.transform(requestDate), true);
    } else {
      this.reqDate = this.tempData.retailGlobalForm ? this.tempData.retailGlobalForm.requestLetterDateNepaliCT : '';
    }
    // for previous sanction date
    if (!ObjectUtil.isEmpty(this.tempData.retailGlobalForm.previousSanctionLetterDateType)) {
      if (this.tempData.retailGlobalForm.previousSanctionLetterDateType === 'AD') {
        const prevSanctionDate = this.tempData.retailGlobalForm ? this.tempData.retailGlobalForm.previousSanctionLetterDate : '';
        this.prevDate = this.engNepDatePipe.transform(this.datepipe.transform(prevSanctionDate), true);
      } else {
        this.prevDate = this.tempData.retailGlobalForm ? this.tempData.retailGlobalForm.previousSanctionLetterDateNepali.nDate : '';
      }
    }
    this.form.patchValue({
      requestLetterDate: this.reqDate ? this.reqDate : '',
      previousSanctionLetter: this.prevDate ? this.prevDate : ''
    });
  }
}
