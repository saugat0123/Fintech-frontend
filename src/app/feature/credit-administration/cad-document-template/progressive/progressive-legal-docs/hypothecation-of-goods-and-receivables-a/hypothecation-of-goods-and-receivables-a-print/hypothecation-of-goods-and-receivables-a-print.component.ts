import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-hypothecation-of-goods-and-receivables-a-print',
  templateUrl: './hypothecation-of-goods-and-receivables-a-print.component.html',
  styleUrls: ['./hypothecation-of-goods-and-receivables-a-print.component.scss']
})
export class HypothecationOfGoodsAndReceivablesAPrintComponent implements OnInit {
  @Input() printDocForm;
  @Input() nepaliData;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}
