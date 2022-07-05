import {Component, Input, OnInit} from '@angular/core';
import {Cicl, CiclArray} from '../../admin/modal/cicl';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CiclRelationListEnum} from '../../loan/model/ciclRelationListEnum';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-cicl-view',
  templateUrl: './cicl-view.component.html',
  styleUrls: ['./cicl-view.component.scss']
})
export class CiclViewComponent implements OnInit {

  @Input() ciclValue: CiclArray;
  ciclList: Array<Cicl> = new Array<Cicl>();
  ciclRelationList = CiclRelationListEnum;

  crgLambdaDisabled = environment.disableCrgLambda;
  checkedDdata;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.ciclValue)) {
      this.ciclList = JSON.parse(this.ciclValue.data);
      this.checkedDdata = JSON.parse(this.ciclValue.checkedData);
    }
  }

}
