import {Component, OnInit} from '@angular/core';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {LoanType} from '../../../../loan/model/loanType';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {UserService} from '../../../../../@core/service/user.service';
import {User} from '../../../../admin/modal/user';
import {RoleType} from '../../../../admin/modal/roleType';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-offer-letter-approved',
    templateUrl: './offer-letter-approved.component.html',
    styleUrls: ['./offer-letter-approved.component.scss']
})
export class OfferLetterApprovedComponent implements OnInit {

    // todo dynamic search obj for approve , pending
    searchObj = {docStatus: 'OFFER_APPROVED'};
    page = 1;
    spinner = false;
    pageable: Pageable = new Pageable();
    loanList = [];
    loanType = LoanType;
    toggleArray: { toggled: boolean }[] = [];
    currentIndexArray: { currentIndex: number }[] = [];
    user: User = new User();
    roleType = RoleType;



    constructor(private service: CreditAdministrationService,
                private router: Router,
                private userService: UserService,
                public routeService: RouterUtilsService,
                private spinnerService: NgxSpinnerService) {
    }

    static loadData(other: OfferLetterApprovedComponent) {
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
        this.userDetail();
        OfferLetterApprovedComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        OfferLetterApprovedComponent.loadData(this);
    }

    loadProfile(cadDocumentId, model) {
        this.routeService.routeOnConditionProfileOrSummary(cadDocumentId, model);
    }


    setSearchValue(value) {
        this.searchObj = Object.assign(value, {docStatus: 'OFFER_APPROVED'});
        OfferLetterApprovedComponent.loadData(this);
    }

    userDetail() {
        this.userService.getLoggedInUser().subscribe((res: any) => {
            this.user = res.detail;
        });
    }
}
