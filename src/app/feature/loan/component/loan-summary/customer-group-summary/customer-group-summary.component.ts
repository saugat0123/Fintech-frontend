import {Component, Input, OnInit} from '@angular/core';
import {CustomerGroup} from '../../../../admin/modal/customer-group';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {CustomerLoanGroupDto} from '../../../model/CustomerLoanGroupDto';
import {CustomerInfoData} from '../../../model/customerInfoData';
import {CommonRoutingUtilsService} from '../../../../../@core/utils/common-routing-utils.service';

@Component({
  selector: 'app-customer-group-summary',
  templateUrl: './customer-group-summary.component.html',
  styleUrls: ['./customer-group-summary.component.scss']
})
export class CustomerGroupSummaryComponent implements OnInit {
  @Input() customerGroup: CustomerGroup;
  @Input() customerInfoData: CustomerInfoData;
  groupAssociateCustomers: Array<CustomerLoanGroupDto> = [];

  constructor(private loanFormService: LoanFormService,
              private routerUtilsService: CommonRoutingUtilsService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerGroup)) {
      this.loanFormService.getLoanOfCustomerByGroup(this.customerGroup).subscribe(loans => {
        this.groupAssociateCustomers = loans.detail;
        this.removeCurrentCustomerLoan();
      });
    }
  }

  removeCurrentCustomerLoan() {
    const index = this.groupAssociateCustomers.indexOf(this.groupAssociateCustomers.filter
    (value => value.loanHolder.id === this.customerInfoData.id)[0]);
    this.groupAssociateCustomers.splice(index, 1);
  }

  loadCustomerProfile(associateId, customerId, loanType) {
    this.routerUtilsService.loadCustomerProfile(associateId, customerId, loanType);
  }

}
