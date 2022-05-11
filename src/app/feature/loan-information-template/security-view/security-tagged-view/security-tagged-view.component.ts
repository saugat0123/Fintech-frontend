import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {LandBuilding} from '../../../loan/model/LandBuilding';
import {Auto} from '../../../loan/model/Auto';

@Component({
  selector: 'app-security-tagged-view',
  templateUrl: './security-tagged-view.component.html',
  styleUrls: ['./security-tagged-view.component.scss']
})
export class SecurityTaggedViewComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  landBuildings: Array<LandBuilding> = new Array<LandBuilding>();
  autos: Array<Auto> = new Array<Auto>();

  constructor() { }

  ngOnInit() {
    if (this.loanDataHolder.landBuildings.length > 0) {
      this.landBuildings = this.loanDataHolder.landBuildings;
    }
    if (this.loanDataHolder.autos.length > 0) {
      this.autos = this.loanDataHolder.autos;
    }
  }

}
