import {Component, OnInit} from '@angular/core';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {NgxSpinnerService} from 'ngx-spinner';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../loan/model/loanType';

@Component({
    selector: 'app-unassigned-loan',
    templateUrl: './unassigned-loan.component.html',
    styleUrls: ['./unassigned-loan.component.scss']
})
export class UnassignedLoanComponent implements OnInit {
    searchObj = {};
    page = 1;
    spinner = false;
    pageable: Pageable = new Pageable();
    loanList = [];
    loanType = LoanType;
    toggleArray: { toggled: boolean }[] = [];
    constructor(private service: CreditAdministrationService, private spinnerService: NgxSpinnerService) {
    }

    static loadData(other: UnassignedLoanComponent) {
        other.spinnerService.show();
        other.service.getPaginationWithSearchObject(other.searchObj, other.page, 10).subscribe((res: any) => {
            other.loanList = res.detail.content;
            other.pageable = PaginationUtils.getPageable(res.detail);
            other.loanList.forEach(() => other.toggleArray.push({toggled: false}));

        });
    }

    ngOnInit() {
        UnassignedLoanComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        UnassignedLoanComponent.loadData(this);
    }

}
