import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../loan/model/loanType';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import * as CryptoJS from 'crypto-js';

@Component({
    selector: 'app-cad-document-list',
    templateUrl: './cad-document-list.component.html',
    styleUrls: ['./cad-document-list.component.scss']
})
export class CadDocumentListComponent implements OnInit {

    // todo dynamic search obj for approve , pending
    searchObj = {isCadFile: 'true'};
    page = 1;
    spinner = false;
    pageable: Pageable = new Pageable();
    loanList = [];
    loanType = LoanType;
    toggleArray: { toggled: boolean }[] = [];
    encryptUrlArray: { url: string }[] = [];
    currentIndexArray: { currentIndex: number }[] = [];


    constructor(private service: CreditAdministrationService,
                private router: Router,
                private spinnerService: NgxSpinnerService) {
    }

    static loadData(other: CadDocumentListComponent) {
        other.currentIndexArray = [];
        other.toggleArray = [];
        other.encryptUrlArray = [];
        other.loanList = [];
        other.spinner = true;
        other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, 10).subscribe((res: any) => {
            other.spinner = false;
            other.loanList = res.detail.content;
            other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
            other.loanList.forEach((l) => other.encryptUrlArray.push({url: other.encryptUrl(l.id)}));
            other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: l.previousList.length}));
            other.pageable = PaginationUtils.getPageable(res.detail);


        }, error => {
            other.spinner = false;
            console.log(error);
        });
    }

    ngOnInit() {
        CadDocumentListComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        CadDocumentListComponent.loadData(this);
    }

    loadProfile(cadDocumentId) {
        this.router.navigate(['/home/credit/offer-letter-profile'],
            {
                queryParams: {
                    cadDocumentId: cadDocumentId,
                }
            });
    }

    setSearchValue(value) {
        this.searchObj = Object.assign(value, {isCadFile: 'true'});
        CadDocumentListComponent.loadData(this);
    }

    encryptUrl(id) {
        const i = CryptoJS.AES.encrypt(id.toString(), 'id').toString();
        return i;
    }

    loadSummary(model) {
        this.router.navigate(['/home/credit/cad-summary/', this.encryptUrl(model.id)],
            {state: {data: model}});

    }
}

