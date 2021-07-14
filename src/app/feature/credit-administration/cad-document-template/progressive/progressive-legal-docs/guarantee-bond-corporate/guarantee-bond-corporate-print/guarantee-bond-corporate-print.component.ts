import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-guarantee-bond-corporate-print',
  templateUrl: './guarantee-bond-corporate-print.component.html',
  styleUrls: ['./guarantee-bond-corporate-print.component.scss']
})
export class GuaranteeBondCorporatePrintComponent implements OnInit {

  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}
