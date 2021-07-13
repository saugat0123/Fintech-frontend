import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-indemnity-deed-print',
  templateUrl: './indemnity-deed-print.component.html',
  styleUrls: ['./indemnity-deed-print.component.scss']
})
export class IndemnityDeedPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}
