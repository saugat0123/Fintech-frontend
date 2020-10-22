import {Component, Input, OnInit} from '@angular/core';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {CustomerInfoData} from '../../../model/customerInfoData';
import {CommonRoutingUtilsService} from '../../../../../@core/utils/common-routing-utils.service';
import {NbToastrService} from '@nebular/theme';
import {GroupDto} from '../../../model/GroupDto';
import {GroupSummaryDto} from '../../../model/GroupSummaryDto';

@Component({
  selector: 'app-customer-group-summary',
  templateUrl: './customer-group-summary.component.html',
  styleUrls: ['./customer-group-summary.component.scss']
})
export class CustomerGroupSummaryComponent implements OnInit {
  @Input() groupDto: GroupSummaryDto;
  @Input() customerInfoData: CustomerInfoData;
  groupAssociateCustomers: Array<GroupDto> = [];
  totalGroupApprovedAmount = 0;
  spinner = false;
  grandTotalFundedAmount = 0;
  grandTotalNotFundedAmount = 0;

  constructor(private loanFormService: LoanFormService,
              private routerUtilsService: CommonRoutingUtilsService,
              private toastService: NbToastrService) {
  }

  ngOnInit() {
    console.log(this.groupDto);
    this.groupAssociateCustomers = this.groupDto.groupDtoList;
  }

 /* removeCurrentCustomerLoan() {
    const index = this.groupAssociateCustomers.indexOf(this.groupAssociateCustomers.filter
    (value => value.loanHolderId === this.customerInfoData.id)[0]);
    this.groupAssociateCustomers.splice(index, 1);
  }*/

  loadCustomerProfile(associateId, customerId, loanType) {
    this.routerUtilsService.loadCustomerProfile(associateId, customerId, loanType);
  }
}
