import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../../../model/security';

@Component({
  selector: 'app-security-details',
  templateUrl: './security-details.component.html',
  styleUrls: ['./security-details.component.scss']
})
export class SecurityDetailsComponent implements OnInit {
  @Input() securityData: Security;
  vehicleSelected = false;
  landSelected = false;
  apartmentSelected = false;
  plantSelected = false;
  depositSelected = false;
  totalAmount = 0;

  constructor() {
  }

  ngOnInit() {
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
        case 'PlantSecurity' :
          this.plantSelected = true;
          break;
        case 'FixedDeposit':
          this.depositSelected = true;
          break;
      }
    });

    if (this.depositSelected) {
      this.calculateTotal();
    }
  }

  calculateTotal() {
    const depositList = this.securityData['initialForm']['fixedDepositDetails'];
    depositList.forEach(deposit => {
      this.totalAmount += deposit.amount;
    });
  }
}


