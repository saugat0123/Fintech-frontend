import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-above-fixed-assets-collateral-computation-sheet',
  templateUrl: './above-fixed-assets-collateral-computation-sheet.component.html',
  styleUrls: ['./above-fixed-assets-collateral-computation-sheet.component.scss']
})
export class AboveFixedAssetsCollateralComputationSheetComponent implements OnInit {
  @Input() fixedAssetsComputing;

  constructor() { }

  ngOnInit() {
    console.log('fixedAssetsComputing', this.fixedAssetsComputing);
  }

}
