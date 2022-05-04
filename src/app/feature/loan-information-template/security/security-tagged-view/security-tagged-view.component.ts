import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../loan/model/loanData';

@Component({
  selector: 'app-security-tagged-view',
  templateUrl: './security-tagged-view.component.html',
  styleUrls: ['./security-tagged-view.component.scss']
})
export class SecurityTaggedViewComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  hasLandBuilding = false;
  hasAuto = false;
  constructor() { }
  ngOnInit() {
  // this.checkSecurity();
    this.hasLandBuilding = this.checkIndividualSecurity(this.loanDataHolder.landBuildings);
    this.hasAuto = this.checkIndividualSecurity(this.loanDataHolder.autos);
  }

  // checkSecurity() {
  //   console.log('this is loan holder', this.loanDataHolder);
  //   const selectedArray = JSON.parse(this.loanDataHolder.selectedArray);
  //   selectedArray.forEach((d) => {
  //   switch (d) {
  //     case 'Land and Building Security': {
  //       this.hasLandBuilding = this.checkIndividualSecurity(this.loanDataHolder.landBuildings);
  //     }
  //     break;
  //     case 'VehicleSecurity': {
  //       this.hasAuto = this.checkIndividualSecurity(this.loanDataHolder.autos);
  //     }
  //     break;
  //     default: return;
  //
  //   }
  //   });
  // }
  checkIndividualSecurity(array: Array<any>) {
    return array.length > 0;
  }
}
