import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-guarantee-bond-personal-print',
  templateUrl: './guarantee-bond-personal-print.component.html',
  styleUrls: ['./guarantee-bond-personal-print.component.scss'],
})
export class GuaranteeBondPersonalPrintComponent implements OnInit {
  @Input() printDocForm;
  @Input() loanCat;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}
