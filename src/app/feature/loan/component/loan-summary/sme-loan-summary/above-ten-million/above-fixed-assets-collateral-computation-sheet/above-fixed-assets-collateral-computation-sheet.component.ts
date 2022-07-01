import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-above-fixed-assets-collateral-computation-sheet',
  templateUrl: './above-fixed-assets-collateral-computation-sheet.component.html',
  styleUrls: ['./above-fixed-assets-collateral-computation-sheet.component.scss']
})
export class AboveFixedAssetsCollateralComputationSheetComponent implements OnInit {
  @Input() commonLoanData;
  fixedAssetsComputing;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.commonLoanData)) {
      if (!ObjectUtil.isEmpty(this.commonLoanData.fixedAssetsComputing)) {
        this.fixedAssetsComputing = this.commonLoanData.fixedAssetsComputing;
      }
    }
  }

}
