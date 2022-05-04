import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {Proposal} from '../../../admin/modal/proposal';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-security-tagged-view',
  templateUrl: './security-tagged-view.component.html',
  styleUrls: ['./security-tagged-view.component.scss']
})
export class SecurityTaggedViewComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  hasLandBuilding = false;
  hasAuto = false;
  files;
  proposal: Proposal;
  constructor() { }
  ngOnInit() {
  // this.checkSecurity();
    this.hasLandBuilding = this.checkIndividualSecurity(this.loanDataHolder.landBuildings);
    this.hasAuto = this.checkIndividualSecurity(this.loanDataHolder.autos);
    this.proposal = this.loanDataHolder.proposal;
    if (!ObjectUtil.isEmpty(this.proposal.data)) {
      if (!ObjectUtil.isEmpty(JSON.parse(this.proposal.data).files)) {
        this.files = JSON.parse(JSON.parse(this.proposal.data).files);
      }
    }
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
    if (!ObjectUtil.isEmpty(array)) {
      return array.length > 0;
    }
  }
}
