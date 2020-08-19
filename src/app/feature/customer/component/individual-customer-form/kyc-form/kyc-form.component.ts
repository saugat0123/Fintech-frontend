import {Component, Input, OnInit} from '@angular/core';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';

@Component({
  selector: 'app-kyc-form',
  templateUrl: './kyc-form.component.html',
  styleUrls: ['./kyc-form.component.scss']
})
export class KycFormComponent implements OnInit {

  @Input()
  kycRelative: Array<CustomerRelative>;

  constructor() {
  }

  ngOnInit() {
    console.log(this.kycRelative);
  }

}
