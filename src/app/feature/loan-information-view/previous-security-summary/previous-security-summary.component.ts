import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-previous-security-summary',
  templateUrl: './previous-security-summary.component.html',
  styleUrls: ['./previous-security-summary.component.scss']
})
export class PreviousSecuritySummaryComponent implements OnInit {
@Input() formData;
previousSecurity: any;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData)){
      this.previousSecurity = JSON.parse(this.formData.data);
      console.log(this.previousSecurity);
    }
  }

}
