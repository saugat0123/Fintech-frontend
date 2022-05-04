import {Component, Input, OnInit} from '@angular/core';
import {Occupation} from '../../admin/modal/occupation';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-guarantor-view',
  templateUrl: './guarantor-view.component.html',
  styleUrls: ['./guarantor-view.component.scss']
})
export class GuarantorViewComponent implements OnInit {
  @Input() guarantorData;
  personalGuarantorData: Array<any> = new Array<any>();
  corporateGuarantorData: Array<any> = new Array<any>();
  Occupation = Occupation;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.guarantorData)) {
      this.personalGuarantorData = this.guarantorData.filter(v => v.guarantorType === 'personalGuarantor');
      this.corporateGuarantorData = this.guarantorData.filter(v => v.guarantorType === 'corporateGuarantor');
    }
  }

}
