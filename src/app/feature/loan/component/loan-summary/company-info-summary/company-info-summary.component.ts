import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {BusinessType} from '../../../../admin/modal/businessType';
import {CompanyJsonData} from '../../../../admin/modal/CompanyJsonData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../model/loanData';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';

@Component({
  selector: 'app-company-info-summary',
  templateUrl: './company-info-summary.component.html',
  styleUrls: ['./company-info-summary.component.scss']
})
export class CompanyInfoSummaryComponent implements OnInit {
  @Input() companyInfo: CompanyInfo;
  @Input() loanDataHolder: LoanDataHolder;
  businessType = BusinessType;
  companyJsonData: CompanyJsonData = new CompanyJsonData();
  contact = [];
  additionalInfoJsonData;
  companyLocationData;
  projectAddress;
  correspondenceAddress;
  @Input() approveSheet;
  client = environment.client;
  clientName = Clients;


  constructor() { }

  ngOnInit() {
    console.log('this is company info',this.companyInfo);
    if (!ObjectUtil.isEmpty(this.companyJsonData)) {
      this.companyJsonData = JSON.parse(this.companyInfo.companyJsonData);
      this.companyLocationData = JSON.parse(this.companyInfo.companyLocations.address);
      this.projectAddress = JSON.parse(this.companyInfo.companyLocations.projectAddress);
      this.correspondenceAddress = JSON.parse(this.companyInfo.companyLocations.correspondenceAddress);
      this.contact = JSON.parse(this.companyInfo.contactPersons);
    }
  }

}
