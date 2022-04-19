import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {SecurityConstant} from './security-constant';
import {SecurityLandBuildingComponent} from './security-land-building/security-land-building.component';
import {SecurityAutoComponent} from './security-auto/security-auto.component';
import {LandBuilding} from '../model/land-building';
import {Auto} from '../model/auto';

@Component({
  selector: 'app-security-master-template',
  templateUrl: './security-master-template.component.html',
  styleUrls: ['./security-master-template.component.scss']
})
export class SecurityMasterTemplateComponent implements OnInit {
  @ViewChild('landBuilding', {static: true}) landBuilding: SecurityLandBuildingComponent;
  @ViewChild('auto', {static: true}) auto: SecurityAutoComponent;
  selectedSecurity: string;
  isLandAndBuildingSecuritySelected = false;
  isAutoSecuritySelected = false;
  securities = [
      {value: 'Land And Building Security'},
      {value : 'Auto Security'}
  ];
  @Input() customerInfoId: number;
  @Input() landBuildings: Array<LandBuilding> = new Array<LandBuilding>();
  @Input() autos: Array<Auto> = new Array<Auto>();

  constructor(public nbDialogRef: NbDialogRef<SecurityMasterTemplateComponent>) { }

  ngOnInit() {
  }

  public onSecuritySelect(): void {
    this.isLandAndBuildingSecuritySelected = this.selectedSecurity === SecurityConstant.LAND_AND_BUILDING_SECURITY;
    this.isAutoSecuritySelected = this.selectedSecurity === SecurityConstant.AUTO_SECURITY;
  }

  public onSubmit(): void {
    if (this.isLandAndBuildingSecuritySelected) {
      this.landBuilding.onSubmit();
    }
    if (this.isAutoSecuritySelected) {
      this.auto.onSubmit();
    }
  }

}
