import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-mortgage-deed-print',
  templateUrl: './mortgage-deed-print.component.html',
  styleUrls: ['./mortgage-deed-print.component.scss']
})
export class MortgageDeedPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}
