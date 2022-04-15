import { Component, OnInit } from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {SecurityConstant} from './security-constant';

@Component({
  selector: 'app-security-master-template',
  templateUrl: './security-master-template.component.html',
  styleUrls: ['./security-master-template.component.scss']
})
export class SecurityMasterTemplateComponent implements OnInit {
  selectedSecurity: string;
  isLandAndBuildingSecuritySelected = false;
  isAutoSecuritySelected = false;
  securities = [
      {value: 'Land And Building Security'},
      {value : 'Auto Security'}
  ];

  constructor(public nbDialogRef: NbDialogRef<SecurityMasterTemplateComponent>) { }

  ngOnInit() {
  }

  public onSecuritySelect(): void {
    this.isLandAndBuildingSecuritySelected = this.selectedSecurity === SecurityConstant.LAND_AND_BUILDING_SECURITY;
    this.isAutoSecuritySelected = this.selectedSecurity === SecurityConstant.AUTO_SECURITY;
  }

}
