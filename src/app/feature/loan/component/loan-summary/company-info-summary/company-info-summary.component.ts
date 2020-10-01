import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {BusinessType} from '../../../../admin/modal/businessType';

@Component({
  selector: 'app-company-info-summary',
  templateUrl: './company-info-summary.component.html',
  styleUrls: ['./company-info-summary.component.scss']
})
export class CompanyInfoSummaryComponent implements OnInit {
  @Input() companyInfo: CompanyInfo;
  businessType = BusinessType;


  constructor() { }

  ngOnInit() {
  }

}
