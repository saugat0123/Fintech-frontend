import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../admin/modal/company-info';
import {Customer} from '../../admin/modal/customer';

@Component({
  selector: 'app-company-info-view',
  templateUrl: './company-info-view.component.html',
  styleUrls: ['./company-info-view.component.scss']
})
export class CompanyInfoViewComponent implements OnInit {
  @Input() formValue: CompanyInfo;
  @Input() basicInfo: Customer;

  constructor() {
  }

  ngOnInit() {
  }

}
