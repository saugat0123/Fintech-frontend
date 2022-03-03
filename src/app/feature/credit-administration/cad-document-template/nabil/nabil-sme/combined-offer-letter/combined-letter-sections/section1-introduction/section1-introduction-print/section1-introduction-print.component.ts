import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section1-introduction-print',
  templateUrl: './section1-introduction-print.component.html',
  styleUrls: ['./section1-introduction-print.component.scss']
})
export class Section1IntroductionPrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;
  tempApplicationDate;
  tempSanctionDate;
  loanOption: any;

  constructor() { }

  ngOnInit() {
    if (this.letterData.smeGlobalForm.loanApplicationDataType === 'AD') {
      this.tempApplicationDate = this.letterData.smeGlobalForm.loanApplicationDate ? this.letterData.smeGlobalForm.loanApplicationDateCT : '';
    } else {
      this.tempApplicationDate = this.letterData.smeGlobalForm.loanApplicationDateCT;
    }
    if (this.letterData.smeGlobalForm.previousSanctionType === 'AD') {
      this.tempSanctionDate = this.letterData.smeGlobalForm ? this.letterData.smeGlobalForm.sanctionLetterDateCT : '';
    } else {
      this.tempSanctionDate = this.letterData.smeGlobalForm.sanctionLetterDateCT;
    }
    /* For Loan Option */
    if (!ObjectUtil.isEmpty(this.letterData)) {
      this.loanOption = !ObjectUtil.isEmpty(this.letterData.smeGlobalForm) ?
          this.letterData.smeGlobalForm.loanOption : '';
    }
  }

}
