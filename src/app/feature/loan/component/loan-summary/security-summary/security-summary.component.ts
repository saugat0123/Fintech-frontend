import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';


@Component({
  selector: 'app-security-summary',
  templateUrl: './security-summary.component.html',
  styleUrls: ['./security-summary.component.scss']
})
export class SecuritySummaryComponent implements OnInit {
  @Input() formData: Object;
  landSelected = false;
  apartmentSelected = false;
  plantSelected = false;
  vehicleSelected = false;

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
            this.apartmentSelected = this.landSelected = true;
            break;
          case 'PlantSecurity' :
            this.plantSelected = true;
        }
      });
    }
  }
}
