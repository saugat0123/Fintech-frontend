import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../../admin/modal/company-info';

@Component({
  selector: 'app-company-profile-additional-information',
  templateUrl: './company-profile-additional-information.component.html',
  styleUrls: ['./company-profile-additional-information.component.scss']
})
export class CompanyProfileAdditionalInformationComponent implements OnInit {
  @Input() companyInfo: CompanyInfo;

  constructor() { }

  ngOnInit() {
  }

}
