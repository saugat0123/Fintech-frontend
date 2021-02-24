import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-micro-synopsis-creditworthiness',
  templateUrl: './micro-synopsis-creditworthiness.component.html',
  styleUrls: ['./micro-synopsis-creditworthiness.component.scss']
})
export class MicroSynopsisCreditworthinessViewComponent implements OnInit {
  @Input() synopsisData;
  synopsisCreditworthiness;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.synopsisData)) {
      this.synopsisCreditworthiness = JSON.parse(this.synopsisData.data);
    }
  }

}
