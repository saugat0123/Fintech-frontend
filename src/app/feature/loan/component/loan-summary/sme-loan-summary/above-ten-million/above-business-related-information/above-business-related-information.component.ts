import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../../../admin/modal/company-info';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-above-business-related-information',
  templateUrl: './above-business-related-information.component.html',
  styleUrls: ['./above-business-related-information.component.scss']
})
export class AboveBusinessRelatedInformationComponent implements OnInit {
  @Input() companyInfo: CompanyInfo;
  jsonData: any;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.companyInfo)) {
      this.jsonData = JSON.parse(this.companyInfo.companyJsonData);
    }
  }

}
