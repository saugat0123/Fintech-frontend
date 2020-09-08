import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../admin/modal/company-info';

@Component({
  selector: 'app-company-info-view',
  templateUrl: './company-info-view.component.html',
  styleUrls: ['./company-info-view.component.scss']
})
export class CompanyInfoViewComponent implements OnInit {
  @Input() formValue: CompanyInfo;

  constructor() {
  }

  ngOnInit() {
  }

}
