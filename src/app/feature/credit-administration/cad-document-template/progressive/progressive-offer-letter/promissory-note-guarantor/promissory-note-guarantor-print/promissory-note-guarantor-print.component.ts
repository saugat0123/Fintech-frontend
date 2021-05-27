import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from "../../../progressive-offer-letter-const";

@Component({
  selector: 'app-promissory-note-guarantor-print',
  templateUrl: './promissory-note-guarantor-print.component.html',
  styleUrls: ['./promissory-note-guarantor-print.component.scss']
})
export class PromissoryNoteGuarantorPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
