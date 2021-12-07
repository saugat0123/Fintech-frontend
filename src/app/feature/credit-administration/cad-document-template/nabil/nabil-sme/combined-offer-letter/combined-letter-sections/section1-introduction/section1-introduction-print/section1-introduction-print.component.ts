import {Component, Input, OnInit} from '@angular/core';
import {EngNepDatePipe} from "nepali-patro";
import {DatePipe} from "@angular/common";

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

  constructor(private engToNepaliDate: EngNepDatePipe,
              private datePipe: DatePipe) { }

  ngOnInit() {
    if (this.letterData.smeGlobalForm.loanApplicationDataType === 'AD') {
      this.tempApplicationDate = this.engToNepaliDate.transform(this.datePipe.transform(this.letterData.smeGlobalForm.loanApplicationDate), true);
    } else {
      this.tempApplicationDate = this.letterData.smeGlobalForm.loanApplicationDateCT;
    }
    if (this.letterData.smeGlobalForm.previousSanctionType === 'AD') {
      this.tempSanctionDate = this.engToNepaliDate.transform(this.datePipe.transform(this.letterData.smeGlobalForm.sanctionLetterDate), true);
    } else {
      this.tempSanctionDate = this.letterData.smeGlobalForm.sanctionLetterDateCT;
    }
  }

}
