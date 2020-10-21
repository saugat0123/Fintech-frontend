import {Component, Input, OnInit} from '@angular/core';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {CustomerLoanGroupDto} from '../../../model/CustomerLoanGroupDto';
import {CustomerInfoData} from '../../../model/customerInfoData';
import {CommonRoutingUtilsService} from '../../../../../@core/utils/common-routing-utils.service';
import {NbToastrService} from '@nebular/theme';
import {GroupDto} from '../../../model/GroupDto';

@Component({
  selector: 'app-customer-group-summary',
  templateUrl: './customer-group-summary.component.html',
  styleUrls: ['./customer-group-summary.component.scss']
})
export class CustomerGroupSummaryComponent implements OnInit {
  @Input() groupDto: GroupDto;
  @Input() customerInfoData: CustomerInfoData;
  groupAssociateCustomers: Array<CustomerLoanGroupDto> = [];
  totalGroupApprovedAmount = 0;
  spinner = false;
  totalFundedAmount = 0;
  totalNotFundedAmount = 0;

  constructor(private loanFormService: LoanFormService,
              private routerUtilsService: CommonRoutingUtilsService,
              private toastService: NbToastrService) {
  }

  ngOnInit() {
    this.groupAssociateCustomers = this.groupDto.customerLoanGroupDto;
    this.groupDto.fundedData.forEach((l, i) => {
                this.totalFundedAmount += l.proposal.proposedLimit;
            }
        );
    this.groupDto.nonFundedData.forEach((l, i) => {
                this.totalNotFundedAmount += l.proposal.proposedLimit;
            }
        );
        /*this.removeCurrentCustomerLoan();*/
        this.spinner = false;
    console.log(this.spinner);
  }

  removeCurrentCustomerLoan() {
    const index = this.groupAssociateCustomers.indexOf(this.groupAssociateCustomers.filter
    (value => value.loanHolderId === this.customerInfoData.id)[0]);
    this.groupAssociateCustomers.splice(index, 1);
  }

  loadCustomerProfile(associateId, customerId, loanType) {
    this.routerUtilsService.loadCustomerProfile(associateId, customerId, loanType);
  }

}
