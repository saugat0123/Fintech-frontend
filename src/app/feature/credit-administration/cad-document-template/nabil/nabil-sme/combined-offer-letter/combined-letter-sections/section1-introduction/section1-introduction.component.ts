import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-section1-introduction',
  templateUrl: './section1-introduction.component.html',
  styleUrls: ['./section1-introduction.component.scss']
})
export class Section1IntroductionComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  section1: FormGroup;
  tempData: any;
  tempApplicationDate: any;
  tempSanctionDate: any;
  loanOption: any;
  freeInformation;
  constructor(private formBuilder: FormBuilder,
              private datePipe: DatePipe,
              private engToNepaliDate: EngNepDatePipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
      this.fillForm();
      this.loanOption = this.tempData.smeGlobalForm.loanOption;
    }
  }
  buildForm() {
    this.section1 = this.formBuilder.group({
      referenceNumber: [undefined],
      dateOfApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateOfApplication: [undefined],
      prevSanctionLetterDate: [undefined],
     firstAdditionalDetails: [undefined],
    });
  }

  fillForm() {
    if (this.tempData.smeGlobalForm.loanApplicationDataType === 'AD') {
      this.tempApplicationDate =  this.tempData.smeGlobalForm ? this.tempData.smeGlobalForm.loanApplicationDateCT : '';
    } else {
      this.tempApplicationDate = this.tempData.smeGlobalForm.loanApplicationDateCT;
    }
    if (this.tempData.smeGlobalForm.previousSanctionType === 'AD') {
      this.tempSanctionDate = this.tempData.smeGlobalForm ? this.tempData.smeGlobalForm.sanctionLetterDateCT : '';
    } else {
      this.tempSanctionDate = this.tempData.smeGlobalForm.sanctionLetterDateCT;
    }
    this.section1.patchValue({
      dateOfApplication: this.tempApplicationDate ? this.tempApplicationDate : '',
      prevSanctionLetterDate: this.tempSanctionDate ? this.tempSanctionDate : '',
    });
  }
}
