import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';


@Component({
  selector: 'app-security-summary',
  templateUrl: './security-summary.component.html',
  styleUrls: ['./security-summary.component.scss']
})
export class SecuritySummaryComponent implements OnInit {
  @Input() formData: Object;
  @Input() shareSecurity;
  landSelected = false;
  apartmentSelected = false;
  plantSelected = false;
  vehicleSelected = false;
  depositSelected = false;
  shareSelected = false;
  isPresentGuarantor = false;
  totalAmount = 0;
  shareTotalValue = 0;
  totalConsideredValue = 0;
  buildingSelected = false;
  hypothecation = false;
  corporate = false;
  personal = false;
  loanSharePercent: NepseMaster = new NepseMaster();
  landBuilding = false;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData)) {
      (this.formData['selectedArray'] as Array<any>).forEach(selectedValue => {
        switch (selectedValue) {
          case 'LandSecurity' :
            this.landSelected = true;
            break;
          case 'VehicleSecurity' :
            this.vehicleSelected = true;
            break;
          case 'ApartmentSecurity' :
            this.apartmentSelected = true;
            break;
          case 'Land and Building Security' :
            this.landBuilding = true;
            break;
          case 'PlantSecurity' :
            this.plantSelected = true;
            break;
          case 'FixedDeposit':
            this.depositSelected = true;
            break;
          case 'ShareSecurity':
            this.shareSelected = true;
            break;
          case 'HypothecationOfStock':
            this.hypothecation = true;
            break;
          case 'CorporateGuarantee':
            this.corporate = true;
            break;
          case 'PersonalGuarantee':
            this.personal = true;
        }
      });
    }

    if (this.depositSelected) {
      this.calculateTotal();
    }
    if (this.shareSelected) {
      this.calculateShareTotals();
      this.loanSharePercent = this.shareSecurity['loanShareRate'];
    }
    if (this.formData['guarantorsForm']['guarantorsDetails'].length !== 0) {
      this.isPresentGuarantor = true;
    }
  }

  calculateTotal() {
    const depositList = this.formData['initialForm']['fixedDepositDetails'];
    depositList.forEach(deposit => {
      this.totalAmount += deposit.amount;
    });
  }

  private calculateShareTotals() {
    const shareList = this.shareSecurity['shareSecurityDetails'];
    shareList.forEach(share => {
      this.shareTotalValue += share.total;
      this.totalConsideredValue += share.consideredValue;
    });
  }
}
