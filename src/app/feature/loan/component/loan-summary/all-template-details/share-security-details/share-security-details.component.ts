import {Component, Input, OnInit} from '@angular/core';
import {ShareSecurity} from '../../../../../admin/modal/shareSecurity';
import {NepseMaster} from '../../../../../admin/modal/NepseMaster';

@Component({
  selector: 'app-share-security-details',
  templateUrl: './share-security-details.component.html',
  styleUrls: ['./share-security-details.component.scss']
})
export class ShareSecurityDetailsComponent implements OnInit {
  @Input() formData: ShareSecurity;
  shareSecurityDatas;
  loanSharePercent: NepseMaster = new NepseMaster();
  totalConsideredValue = 0;
  totalValue = 0;
  securityDescription;
  constructor() { }

  ngOnInit() {const allData = JSON.parse(this.formData.data);
    this.shareSecurityDatas = allData.shareField;
    this.securityDescription = allData.securityOffered;
    this.loanSharePercent = allData.loanShareRate;
    this.calculateTotalValues();
  }

  calculateTotalValues() {
    this.shareSecurityDatas.forEach(shareSecurityData => {
      this.totalValue = this.totalValue + shareSecurityData.total;
      this.totalConsideredValue += shareSecurityData.consideredValue;
    });
  }
}
