import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoanFormService} from '../../../../feature/loan/component/loan-form/service/loan-form.service';
import {CatalogueSearch, CatalogueService} from '../../../../feature/admin/component/catalogue/catalogue.service';
import {DocStatus} from '../../../../feature/loan/model/docStatus';


@Component({
  selector: 'app-pending-loan',
  templateUrl: './pending-loan.component.html',
  styleUrls: ['./pending-loan.component.css']
})
export class PendingLoanComponent implements OnInit {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  closedCount: number;
  initCount: number;

  constructor(
      private router: Router,
      private loanFormService: LoanFormService,
      private catalogueService: CatalogueService
  ) {
  }

  ngOnInit() {

    this.loanFormService.getStatus().subscribe(
        (response: any) => {
          this.pendingCount = response.detail.pending;
          this.approvedCount = response.detail.Approved;
          this.rejectedCount = response.detail.Rejected;
          this.closedCount = response.detail.Closed;
          this.initCount = response.detail.initial;
        }
    );
  }

  resolveToCatalogue(status: string) {
    const search: CatalogueSearch = new CatalogueSearch();
    if (status === 'approved') {
      search.documentStatus = DocStatus.value(DocStatus.APPROVED);
    } else if (status === 'rejected') {
      search.documentStatus = DocStatus.value(DocStatus.REJECTED);
    } else if (status === 'closed') {
      search.documentStatus = DocStatus.value(DocStatus.CLOSED);
    }
    this.catalogueService.search = search;
    this.router.navigate(['/home/admin/catalogue'], {
      queryParams: {
        redirect: true,
        search: search.documentStatus
      }
    });
  }
}
