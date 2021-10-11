import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from "../../progressive-legal-doc-const";

@Component({
  selector: 'app-blacklist-consent-print',
  templateUrl: './blacklist-consent-print.component.html',
  styleUrls: ['./blacklist-consent-print.component.scss']
})
export class BlacklistConsentPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;  constructor() { }
  ngOnInit() {
  }

}
