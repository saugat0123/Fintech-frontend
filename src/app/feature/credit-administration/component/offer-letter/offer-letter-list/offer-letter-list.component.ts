import {Component, OnInit} from '@angular/core';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../../loan/model/loanType';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {User} from '../../../../admin/modal/user';
import {RoleType} from '../../../../admin/modal/roleType';
import {UserService} from '../../../../../@core/service/user.service';
import {Stage} from '../../../../loan/model/stage';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

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
    user: User = new User();
    roleType = RoleType;

    constructor(private service: CreditAdministrationService,
                private router: Router,
                private userService: UserService,
                public routeService: RouterUtilsService,
                private spinnerService: NgxSpinnerService) {
    }

    static loadData(other: OfferLetterListComponent) {
        other.spinner = true;
        other.currentIndexArray = [];
        other.toggleArray = [];
        other.loanList = [];
        other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
            other.spinner = false;
            other.loanList = res.detail.content;
            other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
            other.loanList.forEach((l) => l.loanStage = other.getInitiator(l.assignedLoan));
            // tslint:disable-next-line:max-line-length
            other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: ObjectUtil.isEmpty(l.previousList) ? 0 : l.previousList.length}));
            other.pageable = PaginationUtils.getPageable(res.detail);

        }, error => {
            other.spinner = false;
            console.log(error);
        });
    }

    ngOnInit() {
        this.userDetail();
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

    userDetail() {
        this.userService.getLoggedInUser().subscribe((res: any) => {
            this.user = res.detail;
        });
    }


    /**
     *  last modified is of approved date
     */
    public getInitiator(loan: any) {
        let stage = new Stage();
        if (!ObjectUtil.isEmpty(loan)) {
            if (loan.length > 1) {
                const commentLoan = loan[loan.length - 1];
                if (ObjectUtil.isEmpty(commentLoan.previousList)) {
                    const tempPreviousList = JSON.parse(commentLoan.previousStageList);
                    stage = tempPreviousList[0];
                } else {
                    stage = commentLoan.previousList[0];
                }
                stage.lastModifiedAt = commentLoan.lastModifiedAt;
                return stage;
            } else if (loan.length === 1) {
                if (ObjectUtil.isEmpty(loan[0].previousList)) {
                    const tempPreviousList = JSON.parse(loan[0].previousStageList);
                    stage = tempPreviousList[0];
                } else {
                    stage = loan[0].previousList[0];
                }

                stage.lastModifiedAt = loan[0].lastModifiedAt;
                return stage;
            }
        }
    }

}
