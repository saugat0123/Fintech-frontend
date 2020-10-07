import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CompanyInfo} from '../../../../../admin/modal/company-info';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-company-profile-additional-information',
  templateUrl: './company-profile-additional-information.component.html',
  styleUrls: ['./company-profile-additional-information.component.scss']
})
export class CompanyProfileAdditionalInformationComponent implements OnInit , OnChanges {
  @Input() companyInfo: CompanyInfo;
  companyContactPersons = [];

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.companyInfo.contactPersons)) {
      this.companyContactPersons = JSON.parse(this.companyInfo.contactPersons);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

}
