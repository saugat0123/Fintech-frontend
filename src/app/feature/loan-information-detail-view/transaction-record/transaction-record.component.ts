import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {MultipleBanking} from '../../admin/modal/multipleBanking';

@Component({
  selector: 'app-transaction-record',
  templateUrl: './transaction-record.component.html',
  styleUrls: ['./transaction-record.component.scss']
})
export class TransactionRecordComponent implements OnInit, OnChanges {
  @Input() multiBanking: MultipleBanking;
  multiBankingData;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (!ObjectUtil.isEmpty(this.multiBanking)) {
      this.multiBankingData = JSON.parse(this.multiBanking.data);
    }
  }

}
