import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-cross-collateralized-view',
  templateUrl: './cross-collateralized-view.component.html',
  styleUrls: ['./cross-collateralized-view.component.scss']
})
export class CrossCollateralizedViewComponent implements OnInit {
  @Input() securityData;
  @Input() securityType;

  constructor() { }

  ngOnInit() {
    console.log('securityType', this.securityType);
  }

}
