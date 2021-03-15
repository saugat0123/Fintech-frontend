import {Component, Input, OnInit} from '@angular/core';
import {FiscalYear} from '../../admin/modal/FiscalYear';
import {environment} from '../../../../environments/environment';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Proposal} from '../../admin/modal/proposal';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CombinedLoan} from '../../loan/model/combined-loan';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CombinedLoanService} from '../../service/combined-loan.service';

@Component({
  selector: 'app-detail-view-base',
  templateUrl: './detail-view-base.component.html',
  styleUrls: ['./detail-view-base.component.scss']
})
export class DetailViewBaseComponent implements OnInit {
  @Input() loanDataHolder;
  @Input() loanHolder;
  @Input() calendarType;
  @Input() loanId;
  fiscalYearArray: Array<FiscalYear>;

  isMega = environment.isMega;
  customerAllLoanList: LoanDataHolder[] = [];
  proposalData: Proposal;
  megaGroupEnabled = environment.MEGA_GROUP;
  constructor(private customerLoanService: LoanFormService,
              private combinedLoanService: CombinedLoanService) { }

  ngOnInit() {
    this.getAllLoans(this.loanDataHolder.loanHolder.id);
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.proposalData = this.loanDataHolder.proposal;
    }
  }

  getAllLoans(customerInfoId: number): void {
    const search = {
      loanHolderId: customerInfoId.toString(),
      isStaged: 'true'
    };
    this.customerLoanService.getAllWithSearch(search)
        .subscribe((res: any) => {
          this.customerAllLoanList = res.detail;
          // push current loan if not fetched from staged spec response
          if (this.customerAllLoanList.filter((l) => l.id === this.loanDataHolder.id).length < 1) {
            this.customerAllLoanList.push(this.loanDataHolder);
          }
          // push loans from combined loan if not in the existing array
          const combinedLoans = this.customerAllLoanList
              .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan));
          if (combinedLoans.length > 0) {
            const combinedLoanId = combinedLoans[0].combinedLoan.id;
            this.combinedLoanService.detail(combinedLoanId).subscribe((response: any) => {
              (response.detail as CombinedLoan).loans.forEach((cl) => {
                const allLoanIds = this.customerAllLoanList.map((loan) => loan.id);
                if (!allLoanIds.includes(cl.id)) {
                  this.customerAllLoanList.push(cl);
                }
              });
            }, err => {
              console.error(err);
            });
          }
        }, error => {
          console.error(error);
        });
  }

}
