import { Component, OnInit, Input } from '@angular/core';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-above-security-arrangement',
  templateUrl: './above-security-arrangement.component.html',
  styleUrls: ['./above-security-arrangement.component.scss']
})
export class AboveSecurityArrangementComponent implements OnInit {
  @Input() guarantorData;
  personalGuarantorData: Array<any> = new Array<any>();
  corporateGuarantorData: Array<any> = new Array<any>();
  constructor(public datePipe: DatePipe) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.guarantorData)) {
      this.personalGuarantorData = this.guarantorData.filter(v => v.guarantorType === 'personalGuarantor');
      this.corporateGuarantorData = this.guarantorData.filter(v => v.guarantorType === 'corporateGuarantor');
    }
  }

}
