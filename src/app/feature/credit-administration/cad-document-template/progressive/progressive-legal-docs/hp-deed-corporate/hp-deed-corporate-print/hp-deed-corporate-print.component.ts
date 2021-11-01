import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-hp-deed-corporate-print',
  templateUrl: './hp-deed-corporate-print.component.html',
  styleUrls: ['./hp-deed-corporate-print.component.scss']
})
export class HpDeedCorporatePrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;
  constructor() { }

  ngOnInit() {
  }

}
