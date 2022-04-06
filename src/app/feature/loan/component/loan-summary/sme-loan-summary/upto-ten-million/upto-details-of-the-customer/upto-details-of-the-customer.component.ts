import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../../../admin/modal/company-info';
import {LoanDataHolder} from '../../../../../model/loanData';

@Component({
  selector: 'app-upto-details-of-the-customer',
  templateUrl: './upto-details-of-the-customer.component.html',
  styleUrls: ['./upto-details-of-the-customer.component.scss']
})
export class UptoDetailsOfTheCustomerComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;

  constructor() { }

  ngOnInit() {
  }

}
