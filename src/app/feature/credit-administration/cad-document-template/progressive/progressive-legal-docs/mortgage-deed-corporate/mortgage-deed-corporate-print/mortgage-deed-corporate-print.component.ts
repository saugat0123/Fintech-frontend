import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-mortgage-deed-corporate-print',
  templateUrl: './mortgage-deed-corporate-print.component.html',
  styleUrls: ['./mortgage-deed-corporate-print.component.scss']
})
export class MortgageDeedCorporatePrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;
  constructor() { }

  ngOnInit() {
  }

}
