import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CustomerInfoData} from '../../../../model/customerInfoData';

@Component({
  selector: 'app-nrb-statutory-remarks-status',
  templateUrl: './nrb-statutory-remarks-status.component.html',
  styleUrls: ['./nrb-statutory-remarks-status.component.scss']
})
export class NrbStatutoryRemarksStatusComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerInfo: CustomerInfoData;
  commentData;
  constructor() { }

  ngOnInit() {
      /* based on customer info */
      const cusInfoData = !ObjectUtil.isEmpty(this.customerInfo) ?
          JSON.parse(this.customerInfo.data) : this.customerInfo;

      this.commentData = !ObjectUtil.isEmpty(cusInfoData) ?
          JSON.parse(cusInfoData.data) : cusInfoData;

      if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
          const data = JSON.parse(this.loanDataHolder.loanHolder.data);
          if (!ObjectUtil.isEmpty(data)) {
              if (!ObjectUtil.isEmpty(data.data)) {
                  this.commentData = JSON.parse(data.data);
              }
          }
      }
  }

}
