import {Component, Input, OnInit} from '@angular/core';
import {CompanyJsonData} from '../../../../../admin/modal/CompanyJsonData';
import {CompanyInfo} from '../../../../../admin/modal/company-info';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-business-background',
  templateUrl: './business-background.component.html',
  styleUrls: ['./business-background.component.scss']
})
export class BusinessBackgroundComponent implements OnInit {
  @Input() companyInfo: CompanyInfo;

  companyJsonData: CompanyJsonData;

  marketScenario;
  localRaw;
  importedRaw;
  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.companyInfo.companyJsonData)) {
      this.companyJsonData = JSON.parse(this.companyInfo.companyJsonData);
      if (!ObjectUtil.isEmpty(this.companyJsonData.marketScenario)) {
        console.log(this.companyJsonData.marketScenario);
        this.marketScenario = this.companyJsonData.marketScenario;
      }
      // this.localRaw = this.companyJsonData.rawMaterialSourcing.includes('local');
      // this.importedRaw = this.companyJsonData.rawMaterialSourcing.includes('imported');
    }
  }

}
