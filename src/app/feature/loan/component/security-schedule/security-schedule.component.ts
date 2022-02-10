import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Proposal} from '../../../admin/modal/proposal';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Security} from '../../model/security';

@Component({
  selector: 'app-security-schedule',
  templateUrl: './security-schedule.component.html',
  styleUrls: ['./security-schedule.component.scss']
})
export class SecurityScheduleComponent implements OnInit, OnChanges {

  constructor() { }
@Input() proposal: Proposal;
@Input() security;
@Input() formData;
securityData: Security;
  files;

  ngOnInit() {
  }

  getTotalLandFMV() {
    if (!ObjectUtil.isEmpty(this.securityData)) {
      this.securityData['initialForm']['landDetails'].forEach(d => {
        console.log('this is security', d);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!ObjectUtil.isEmpty(this.security)) {
      this.securityData = JSON.parse(this.security.data);
      console.log('this is security', this.securityData);
    } else if (!ObjectUtil.isEmpty(this.formData)) {
      this.securityData = this.formData;
      console.log('this is security form data', this.formData);
    }
    this.getTotalLandFMV();
    if (!ObjectUtil.isEmpty(this.proposal)) {
      if (!ObjectUtil.isEmpty(this.proposal.data)) {
        if (!ObjectUtil.isEmpty(JSON.parse(this.proposal.data).files)) {
          this.files = JSON.parse(JSON.parse(this.proposal.data).files);
        }
      }
    }
  }

}
