import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-hypothecation-of-goods-and-receivables-b-print',
  templateUrl: './hypothecation-of-goods-and-receivables-b-print.component.html',
  styleUrls: ['./hypothecation-of-goods-and-receivables-b-print.component.scss']
})
export class HypothecationOfGoodsAndReceivablesBPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}
