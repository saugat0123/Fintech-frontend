import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../feature/loan/model/loanData';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {LoanFormService} from '../../../../feature/loan/component/loan-form/service/loan-form.service';

@Component({
  selector: 'app-search-result',
  styles: [''],
  templateUrl: 'searchResult.component.html',
})
export class SearchResultComponent implements OnInit {

  @Input() searchData;
  searchResult: Array<LoanDataHolder>;
  customerName: string;
  showSearchResult = false;
  loanConfigId: number;
  customerId: number;

  constructor(
      private modalRef: NgbActiveModal,
      private router: Router,
      private loanFormService: LoanFormService
  ) {
  }

  ngOnInit(): void {

    this.loanFormService.getLoansByCitizenship(this.searchData).subscribe((response: any) => {
      this.searchResult = response.detail;
      this.showSearchResult = this.searchResult.length > 0;
      const customerLoan: LoanDataHolder = this.searchResult[0];
      if (customerLoan !== undefined) {
        if (customerLoan.customerInfo !== null && customerLoan.customerInfo !== undefined) {
          this.customerName = customerLoan.customerInfo.customerName;
        } else if (customerLoan.dmsLoanFile !== null && customerLoan.dmsLoanFile !== undefined) {
          this.customerName = customerLoan.customerInfo.customerName;
        }
      }
    }, error => console.error(error));
  }

  close() {
    this.modalRef.dismiss();
  }

  openLoan(loanConfigId: number, customerId: number) {
    const routeData = {
      'loanConfigId': loanConfigId,
      'customerId': customerId
    };
    this.modalRef.close(routeData);
  }

}
