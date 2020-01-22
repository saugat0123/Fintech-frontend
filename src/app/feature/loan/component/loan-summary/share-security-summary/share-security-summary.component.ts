import {Component, Input, OnInit} from '@angular/core';
import {ShareSecurity} from '../../../../admin/modal/shareSecurity';
import {NepseService} from '../../../../admin/component/nepse/nepse.service';
import {ShareType} from '../../../model/ShareType';
import {ShareValue} from '../../../../admin/modal/shareValue';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';

@Component({
    selector: 'app-share-security-summary',
    templateUrl: './share-security-summary.component.html',
    styleUrls: ['./share-security-summary.component.scss']
})
export class ShareSecuritySummaryComponent implements OnInit {
    @Input() formData: ShareSecurity;
    shareSecurityDatas;
     loanSharePercent: NepseMaster = new NepseMaster();
    totalConsideredValue = 0;
    totalValue = 0;
    securityDescription;

    constructor() {
    }

    ngOnInit() {
        const allData = JSON.parse(this.formData.data);
        this.shareSecurityDatas = allData.shareField;
        this.securityDescription = allData.securityOffered;
        this.loanSharePercent = allData.loanShareRate;
        this.calculateTotalValues();
    }

    calculateTotalValues() {
        this.shareSecurityDatas.forEach(shareSecurityData => {
          console.log(shareSecurityData);
          this.totalValue = this.totalValue + shareSecurityData.total;
            this.totalConsideredValue += shareSecurityData.consideredValue;
        });
    }
}
