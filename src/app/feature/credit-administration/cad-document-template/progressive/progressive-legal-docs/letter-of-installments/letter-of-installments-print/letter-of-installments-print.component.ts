import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-letter-of-installments-print',
  templateUrl: './letter-of-installments-print.component.html',
  styleUrls: ['./letter-of-installments-print.component.scss']
})
export class LetterOfInstallmentsPrintComponent implements OnInit {

  @Input()
  printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}
