import {Component, Input, OnInit} from '@angular/core';
import {ShareSecurity} from '../../../../admin/modal/shareSecurity';
import {NepseService} from '../../../../admin/component/nepse/nepse.service';
import {ShareType} from '../../../model/ShareType';
import {ShareValue} from '../../../../admin/modal/shareValue';

@Component({
  selector: 'app-share-security-summary',
  templateUrl: './share-security-summary.component.html',
  styleUrls: ['./share-security-summary.component.scss']
})
export class ShareSecuritySummaryComponent implements OnInit {
  @Input() formData: ShareSecurity;
  shareSecurityDatas;
  sharePercent: ShareValue = new ShareValue();
  totalConsideredValue = 0;
  totalValue = 0;
  securityDescription;
  consideredValues = [];
  constructor(private nepseService: NepseService) { }

  ngOnInit() {
    const allData = JSON.parse(this.formData.data);
    this.shareSecurityDatas = allData.shareField;
    this.securityDescription = allData.securityDescription;
    this.findActiveShare();
  }

  findActiveShare() {
    this.nepseService.getActiveShare().subscribe(value => {
      this.sharePercent = JSON.parse(value.detail[0].shareData);
      this.calculateTotalConsideredValue();
    });
  }
  calculateTotalConsideredValue() {
    this.shareSecurityDatas.forEach(shareSecurityData => {
      let consideredValue = 0;
      this.totalValue +=  shareSecurityData.total;
      if (shareSecurityData.shareType.toString() === ShareType.PROMOTER.toString()) {
       consideredValue = ((shareSecurityData.totalShareUnit * shareSecurityData.shareRate) / 100 ) * this.sharePercent.promoterValue;
      } else {
        consideredValue = ((shareSecurityData.totalShareUnit * shareSecurityData.shareRate) / 100 ) * this.sharePercent.ordinaryValue;
      }
      this.totalConsideredValue += consideredValue;
          this.consideredValues.push(consideredValue);
    });
  }
}
