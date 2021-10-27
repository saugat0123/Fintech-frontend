import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../../../admin/modal/proposal';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-security-schedule',
  templateUrl: './security-schedule.component.html',
  styleUrls: ['./security-schedule.component.scss']
})
export class SecurityScheduleComponent implements OnInit {

  constructor() { }
@Input() proposal: Proposal;
  files;

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.proposal)) {
      if (!ObjectUtil.isEmpty(this.proposal.data)) {
        if (!ObjectUtil.isEmpty(JSON.parse(this.proposal.data).files)) {
          this.files = JSON.parse(JSON.parse(this.proposal.data).files);
        }
      }
    }
  }

}
