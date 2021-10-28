import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-loan-deed-corporate-print',
  templateUrl: './loan-deed-corporate-print.component.html',
  styleUrls: ['./loan-deed-corporate-print.component.scss']
})
export class LoanDeedCorporatePrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;
  length: number;
  constructor() { }

  ngOnInit() {
  }

}
