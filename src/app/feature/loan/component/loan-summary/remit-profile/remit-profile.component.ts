import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-remit-profile',
  templateUrl: './remit-profile.component.html',
  styleUrls: ['./remit-profile.component.scss']
})
export class RemitProfileComponent implements OnInit {

  constructor() { }

  @Input() loanHolder;
  remit: any;
  agentDetails: any;
  beneficiaryDetails: any;
  senderDetails: any;
  documentDetails: any;
  isNull = true;
  newDocDetails = [];
  province;
  district;
  municipality;
  isLoaded = false;
  ngOnInit() {
    this.remit = this.loanHolder.remitCustomer;
    if (this.remit !== null || !ObjectUtil.isEmpty(this.remit)) {
      this.isNull = false;
      this.agentDetails = JSON.parse(this.remit.agentData);
      this.senderDetails = JSON.parse(this.remit.senderData);
      this.beneficiaryDetails = JSON.parse(this.remit.beneficiaryData);
      this.documentDetails = JSON.parse(this.remit.remitFilePathData);
    }
    this.documentDetails.forEach((data, i) => {
      if (data instanceof Array) {
      } else {
        this.newDocDetails.push(data);
      }
    });
  }


}
