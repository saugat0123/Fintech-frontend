import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CompanyInfo} from '../../../../../admin/modal/company-info';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {RegisteredOfficeList} from '../../../../../admin/modal/registeredOfficeList';

@Component({
  selector: 'app-company-profile-additional-information',
  templateUrl: './company-profile-additional-information.component.html',
  styleUrls: ['./company-profile-additional-information.component.scss']
})
export class CompanyProfileAdditionalInformationComponent implements OnInit , OnChanges {
  @Input() companyInfo: CompanyInfo;
  @Input() companyLocationData;
  companyContactPersons;
  registeredOffice: typeof RegisteredOfficeList = RegisteredOfficeList;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.companyInfo.companyContactDetails)) {
      this.companyContactPersons = JSON.parse(this.companyInfo.companyContactDetails);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

}
