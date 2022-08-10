import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {LoanDataHolder} from '../../../model/loanData';

@Component({
  selector: 'app-summary-header',
  templateUrl: './summary-header.component.html',
  styleUrls: ['./summary-header.component.scss']
})
export class SummaryHeaderComponent implements OnInit {
  client: string;
  @Input() loanCategory;
  @Input() isJointInfo: boolean;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() jointInfo;
  @Input() currentDocAction;
  @Input() crgCCbl;
  constructor() {
    this.client = environment.client;
  }

  ngOnInit() {
    console.log('loanDataHolder', this.loanDataHolder);
  }

}
