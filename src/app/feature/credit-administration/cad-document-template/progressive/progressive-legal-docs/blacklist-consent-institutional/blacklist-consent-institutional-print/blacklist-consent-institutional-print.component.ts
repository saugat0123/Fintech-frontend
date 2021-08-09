import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-blacklist-consent-institutional-print',
  templateUrl: './blacklist-consent-institutional-print.component.html',
  styleUrls: ['./blacklist-consent-institutional-print.component.scss']
})
export class BlacklistConsentInstitutionalPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;  constructor() { }
  ngOnInit() {
  }

}
