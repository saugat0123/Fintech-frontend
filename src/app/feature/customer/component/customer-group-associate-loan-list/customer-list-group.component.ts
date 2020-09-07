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
import {CustomerLoanGroupDto} from '../../../loan/model/CustomerLoanGroupDto';

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
  customerLoanList: Array<CustomerLoanGroupDto> = [];
  totalLoanProposedAmount = 0;
  fetchLoan = FetchLoan;

  constructor(private loanFormService: LoanFormService,
              private toastrService: ToastService,
              private router: Router) {
  }

  ngOnInit() {
    console.log(this.customerInfoData);
    if (!ObjectUtil.isEmpty(this.customerInfoData.customerGroup)) {
      this.isAssociateGroup = true;
      this.currentGroup = this.customerInfoData.customerGroup;
      this.getLoanListByCustomerGroup();
    }
  }

  getLoanListByCustomerGroup() {
    let currentCustomerGroupLoanProposal = 0;
    this.spinner = true;
    const filterGroup = new CustomerGroup();
    filterGroup.groupCode = this.currentGroup.groupCode;
    this.loanFormService.getLoanOfCustomerByGroup(filterGroup).subscribe(loans => {
      console.log(loans);
      this.customerLoanList = loans.detail;
      this.spinner = false;
      this.totalLoanProposedAmount = 0;
      this.customerLoanList.forEach(l => {
              if (l.loanHolder.id === this.customerInfoData.id) {
                currentCustomerGroupLoanProposal = l.totalObtainedLimit;
              }
              this.totalLoanProposedAmount = this.totalLoanProposedAmount + l.totalObtainedLimit;
          }
      );
      console.log(currentCustomerGroupLoanProposal);
      const loanAmountType = new LoanAmountType();
      loanAmountType.type = this.fetchLoan.CUSTOMER_AS_GROUP;
      loanAmountType.value = this.totalLoanProposedAmount;
      loanAmountType.otherParam = this.totalLoanProposedAmount - currentCustomerGroupLoanProposal;
      this.messageToEmit.emit(loanAmountType);
    }, res => {
      this.toastrService.show(new Alert(AlertType.ERROR, res.message.error));
    });
  }

  customerProfile(associateId, id, customerType) {
    console.log(associateId, id, customerType);
    if (CustomerType[customerType] === CustomerType.INDIVIDUAL) {
      this.router.navigate(['/home/customer/profile/' + associateId], {
        queryParams: {
          customerType: customerType,
          customerInfoId: id
        }
      });
    } else if (CustomerType[customerType] === CustomerType.COMPANY) {
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
