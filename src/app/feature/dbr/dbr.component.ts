import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-dbr',
  templateUrl: './dbr.component.html',
  styleUrls: ['./dbr.component.scss']
})
export class DbrComponent implements OnInit {
  constructor() { }
  @Input() financialData;
  @Input() proposalData;

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.proposalData.data)) {
      this.proposalData = JSON.parse(this.proposalData.data);
    }
  }

}
