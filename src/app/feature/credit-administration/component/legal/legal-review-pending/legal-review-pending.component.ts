import {Component, OnInit} from '@angular/core';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {LoanType} from '../../../../loan/model/loanType';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {RouterUtilsService} from '../../../utils/router-utils.service';

@Component({
    selector: 'app-legal-review-pending',
    templateUrl: './legal-review-pending.component.html',
    styleUrls: ['./legal-review-pending.component.scss']
})
export class LegalReviewPendingComponent implements OnInit {

    // todo dynamic search obj for approve , pending
    searchObj = {docStatus: 'LEGAL_PENDING'};
    page = 1;
    spinner = false;
    pageable: Pageable = new Pageable();
    loanList = [];
    loanType = LoanType;
    toggleArray: { toggled: boolean }[] = [];
    currentIndexArray: { currentIndex: number }[] = [];

    constructor(private service: CreditAdministrationService,
                private router: Router,
                private routeService: RouterUtilsService,
                private spinnerService: NgxSpinnerService) {
    }

    static loadData(other: LegalReviewPendingComponent) {
        other.spinner = true;
        other.currentIndexArray = [];
        other.toggleArray = [];
        other.loanList = [];
        other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, 10).subscribe((res: any) => {
            other.loanList = res.detail.content;
            other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
            other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: l.previousList.length}));
            console.log(other.loanList);
            other.pageable = PaginationUtils.getPageable(res.detail);
            other.spinner = false;

        }, error => {
            console.log(error);
        });
    }

    ngOnInit() {
        LegalReviewPendingComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        LegalReviewPendingComponent.loadData(this);
    }

    loadProfile(cadDocumentId, model) {
        this.routeService.routeOnConditionProfileOrSummary(cadDocumentId, model);
    }


    setSearchValue(value) {
        this.searchObj = Object.assign(value, {docStatus: 'LEGAL_PENDING'});
        LegalReviewPendingComponent.loadData(this);
    }
}
