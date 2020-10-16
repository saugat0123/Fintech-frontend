import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {BusinessType} from '../../../../admin/modal/businessType';
import {CompanyJsonData} from '../../../../admin/modal/CompanyJsonData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-company-info-summary',
  templateUrl: './company-info-summary.component.html',
  styleUrls: ['./company-info-summary.component.scss']
})
export class CompanyInfoSummaryComponent implements OnInit {
  @Input() companyInfo: CompanyInfo;
  businessType = BusinessType;
  companyJsonData: CompanyJsonData = new CompanyJsonData();
  contact = [];


  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.companyJsonData)) {
      this.companyJsonData = JSON.parse(this.companyInfo.companyJsonData);
      this.contact = JSON.parse(this.companyInfo.contactPersons);
    }
  }

}
