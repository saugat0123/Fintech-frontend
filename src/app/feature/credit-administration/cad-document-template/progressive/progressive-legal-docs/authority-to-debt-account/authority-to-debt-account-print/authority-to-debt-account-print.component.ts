import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-authority-to-debt-account-print',
  templateUrl: './authority-to-debt-account-print.component.html',
  styleUrls: ['./authority-to-debt-account-print.component.scss']
})
export class AuthorityToDebtAccountPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;
  constructor() { }

  ngOnInit() {
  }

}
