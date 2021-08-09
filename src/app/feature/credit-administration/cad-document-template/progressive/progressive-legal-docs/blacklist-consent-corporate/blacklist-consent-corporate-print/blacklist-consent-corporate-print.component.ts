import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-blacklist-consent-corporate-print',
  templateUrl: './blacklist-consent-corporate-print.component.html',
  styleUrls: ['./blacklist-consent-corporate-print.component.scss']
})
export class BlacklistConsentCorporatePrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;  constructor() { }
  ngOnInit() {
  }

}
