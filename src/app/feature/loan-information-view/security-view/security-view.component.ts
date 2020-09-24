import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../loan/model/security';
import {NepseMaster} from '../../admin/modal/NepseMaster';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-security-view',
  templateUrl: './security-view.component.html',
  styleUrls: ['./security-view.component.scss']
})
export class SecurityViewComponent implements OnInit {
  @Input() security: Security;
  @Input() shareSecurityData;
  securityData: Security;
  shareSecurity;
  vehicleSelected = false;
  landSelected = false;
  apartmentSelected = false;
  plantSelected = false;
  depositSelected = false;
  totalAmount = 0;
  shareSelected = false;
  shareTotalValue = 0;
  totalConsideredValue = 0;
  loanSharePercent: NepseMaster = new NepseMaster();

  constructor() {
  }

  ngOnInit() {
    this.securityData = JSON.parse(this.security.data);

    (this.securityData['selectedArray'] as Array<any>).forEach(selectedValue => {
      switch (selectedValue) {
        case 'VehicleSecurity':
          this.vehicleSelected = true;
          break;
        case 'LandSecurity' :
          this.landSelected = true;
          break;
        case 'ApartmentSecurity' :
          this.apartmentSelected = true;
          break;
        case 'Land and Building Security' :
          this.apartmentSelected = this.landSelected = true;
          break;
        case 'ShareSecurity' :
          this.shareSelected = true;
          break;
        case 'PlantSecurity' :
          this.plantSelected = true;
      }
    });
    if (!ObjectUtil.isEmpty(this.shareSecurityData)) {
      this.shareSecurity = JSON.parse(this.shareSecurityData.data);
    } else {
      this.shareSelected = false;
    }
    if (this.shareSelected) {
      this.calculateShareTotals();
      this.loanSharePercent = this.shareSecurity['loanShareRate'];
    }
  }

  calculateShareTotals() {
    const shareList = this.shareSecurity['shareSecurityDetails'];
    shareList.forEach(share => {
      this.shareTotalValue += share.total;
      this.totalConsideredValue += share.consideredValue;
    });
  }

}
