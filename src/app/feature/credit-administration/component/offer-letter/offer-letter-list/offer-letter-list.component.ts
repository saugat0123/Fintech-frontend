import {Component, OnInit} from '@angular/core';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../../loan/model/loanType';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';

@Component({
    selector: 'app-offer-letter-list',
    templateUrl: './offer-letter-list.component.html',
    styleUrls: ['./offer-letter-list.component.scss']
})
export class OfferLetterListComponent implements OnInit {

    // todo dynamic search obj for approve , pending
    searchObj = {docStatus: 'OFFER_PENDING'};
    page = 1;
    spinner = false;
    pageable: Pageable = new Pageable();
    loanList = [];
    loanType = LoanType;
    currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
    toggleArray: { toggled: boolean }[] = [];
    currentIndexArray: { currentIndex: number }[] = [];

    constructor(private service: CreditAdministrationService,
                private router: Router,
                private routeService: RouterUtilsService,
                private spinnerService: NgxSpinnerService) {
    }

    static loadData(other: OfferLetterListComponent) {
        other.spinner = true;
        other.currentIndexArray = [];
        other.toggleArray = [];
        other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, 10).subscribe((res: any) => {
            other.loanList = res.detail.content;
            other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
            other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: l.previousList.length}));
            other.pageable = PaginationUtils.getPageable(res.detail);
            other.spinner = false;

        }, error => {
            console.log(error);
        });
    }

    ngOnInit() {
        OfferLetterListComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        OfferLetterListComponent.loadData(this);
    }

    loadProfile(cadDocumentId, model) {
        this.routeService.routeOnConditionProfileOrSummary(cadDocumentId, model);
    }


    setSearchValue(value) {
        this.searchObj = Object.assign(value, {docStatus: 'OFFER_PENDING'});
        OfferLetterListComponent.loadData(this);
    }

}
