import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-loan-deed-print',
  templateUrl: './loan-deed-print.component.html',
  styleUrls: ['./loan-deed-print.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoanDeedPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;
  length: number;
  constructor() {
  }

  ngOnInit() {
    this.length = this.printDocForm.swikritiBibaran.length;
  }

}
