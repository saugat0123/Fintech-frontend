import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-hire-purchase-deed-print',
  templateUrl: './hire-purchase-deed-print.component.html',
  styleUrls: ['./hire-purchase-deed-print.component.scss']
})
export class HirePurchaseDeedPrintComponent implements OnInit {
  @Input() printDocForm;
  @Input() loanCat;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}
