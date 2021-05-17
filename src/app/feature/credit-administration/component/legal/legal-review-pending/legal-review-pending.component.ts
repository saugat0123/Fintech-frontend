import {Component, OnInit} from '@angular/core';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {LoanType} from '../../../../loan/model/loanType';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

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
        other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
            other.loanList = res.detail.content;
            other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
            // tslint:disable-next-line:max-line-length
            other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: ObjectUtil.isEmpty(l.previousList) ? 0 : l.previousList.length}));
            console.log(other.loanList);
            other.pageable = PaginationUtils.getPageable(res.detail);
            other.spinner = false;

        }, error => {
            other.spinner = false;
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
