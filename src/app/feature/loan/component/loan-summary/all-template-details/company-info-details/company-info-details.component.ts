import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../../admin/modal/company-info';

@Component({
  selector: 'app-company-info-details',
  templateUrl: './company-info-details.component.html',
  styleUrls: ['./company-info-details.component.scss']
})
export class CompanyInfoDetailsComponent implements OnInit {
  @Input() companyInfoData: CompanyInfo;

  constructor() { }

  ngOnInit() {
  }

}
