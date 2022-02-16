import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-guarantee-bond-personal-print',
  templateUrl: './guarantee-bond-personal-print.component.html',
  styleUrls: ['./guarantee-bond-personal-print.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GuaranteeBondPersonalPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}
