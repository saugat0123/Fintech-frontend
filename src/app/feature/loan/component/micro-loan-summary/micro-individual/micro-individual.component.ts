import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {BusinessType} from '../../../../admin/modal/businessType';
import {CompanyJsonData} from '../../../../admin/modal/CompanyJsonData';
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

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerInfo)) {
      this.individualJsonData = JSON.parse(this.customerInfo.individualJsonData);
      // this.customerLocationData = JSON.parse(this.customerInfo.individualJsonData.address);
      this.contact = JSON.parse(this.customerInfo.contactNumber);
    }
  }

}
