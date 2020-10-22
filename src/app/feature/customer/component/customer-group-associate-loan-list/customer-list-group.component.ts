import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {CustomerGroup} from '../../../admin/modal/customer-group';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CustomerType} from '../../model/customerType';
import {Router} from '@angular/router';
import {LoanAmountType} from '../../model/loanAmountType';
import {FetchLoan} from '../../model/fetchLoan';
import {GroupDto} from '../../../loan/model/GroupDto';
import {GroupSummaryDto} from '../../../loan/model/GroupSummaryDto';

@Component({
  selector: 'app-customer-list-group',
  templateUrl: './customer-list-group.component.html',
  styleUrls: ['./customer-list-group.component.scss']
})
export class CustomerListGroupComponent implements OnInit {
  @Input() customerInfoData: any;

  @Output() messageToEmit: EventEmitter<LoanAmountType> = new EventEmitter();

  spinner = false;
  isAssociateGroup = false;
  currentGroup: CustomerGroup;
  groupSummaryDto: GroupSummaryDto;
  fetchLoan = FetchLoan;
  index = 0;


  constructor(private loanFormService: LoanFormService,
              private toastrService: ToastService,
              private router: Router) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerInfoData.customerGroup)) {
      this.isAssociateGroup = true;
      this.currentGroup = this.customerInfoData.customerGroup;
      this.getLoanListByCustomerGroup();
    }
  }

  async getLoanListByCustomerGroup() {
    const filterGroup = new CustomerGroup();
    filterGroup.groupCode = this.currentGroup.groupCode;
    await this.loanFormService.getLoanOfCustomerByGroup(this.customerInfoData.customerGroup).subscribe(response => {
      this.groupSummaryDto = response.detail;
      const loanAmountType = new LoanAmountType();
      loanAmountType.type = this.fetchLoan.CUSTOMER_AS_GROUP;
      loanAmountType.value = this.groupSummaryDto.grandTotalApprovedLimit + this.groupSummaryDto.grandTotalPendingLimit;
      this.messageToEmit.emit(loanAmountType);
    }, res => {
      this.toastrService.show(new Alert(AlertType.ERROR, res.message.error));
    });
  }

  customerProfile(associateId, id, customerType) {
    if (CustomerType[customerType] === CustomerType.INDIVIDUAL) {
      this.router.navigate(['/home/customer/profile/' + associateId], {
        queryParams: {
          customerType: customerType,
          customerInfoId: id
        }
      });
    } else if (CustomerType[customerType] === CustomerType.INSTITUTION) {
      this.router.navigate(['/home/customer/company-profile/' + associateId],
          {
            queryParams: {
              id: id,
              customerType: customerType,
              companyInfoId: associateId,
              customerInfoId: id
            }
          });
    }
  }
}
