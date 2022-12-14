import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {BusinessType} from '../../../../admin/modal/businessType';
import {Customer} from '../../../../admin/modal/customer';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {IndividualJsonData} from '../../../../admin/modal/IndividualJsonData';

@Component({
  selector: 'app-micro-individual',
  templateUrl: './micro-individual.component.html',
  styleUrls: ['./micro-individual.component.scss']
})
export class MicroIndividualComponent implements OnInit {

  @Input() customerInfo: Customer;
  @Input() loanDataHolder: LoanDataHolder;
  businessType = BusinessType;
  individualJsonData: IndividualJsonData = new IndividualJsonData();
  contact = [];
  additionalInfoJsonData;
  customerLocationData;
  otherInformationAndConfirmation;
  age: number;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerInfo)) {
      this.individualJsonData = JSON.parse(this.customerInfo.individualJsonData);
      this.contact = JSON.parse(this.customerInfo.contactNumber);
      this.otherInformationAndConfirmation = JSON.parse(this.loanDataHolder.proposal.data);
    }
  }

  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    this.age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
    return this.age;
  }

}
