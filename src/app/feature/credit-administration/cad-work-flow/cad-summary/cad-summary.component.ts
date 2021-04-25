import {Component, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {CommonService} from '../../../../@core/service/common.service';
import * as CryptoJS from 'crypto-js';

@Component({
    selector: 'app-cad-summary',
    templateUrl: './cad-summary.component.html',
    styleUrls: ['./cad-summary.component.scss']
})
export class CadSummaryComponent implements OnInit {
    cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    customerInfoData: CustomerInfoData;
    cadDocumentId;
    spinner = false;
    currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
    toggleArray: { toggled: boolean }[] = [];
    checkListLiteVersion = LocalStorageUtil.getStorage().productUtil.CHECK_LIST_LITE_VERSION;

    constructor(private activatedRoute: ActivatedRoute,
                private service: CreditAdministrationService,
                public commonService: CommonService,
    ) {
    }

    static loadData(other: CadSummaryComponent) {
        other.spinner = true;
        other.service.detail(other.cadDocumentId).subscribe((res: any) => {
            other.cadOfferLetterApprovedDoc = res.detail;
            other.customerInfoData = other.cadOfferLetterApprovedDoc.loanHolder;
            other.spinner = false;
            other.customerInfoData = other.cadOfferLetterApprovedDoc.loanHolder;
            other.cadOfferLetterApprovedDoc.assignedLoan.forEach(() => other.toggleArray.push({toggled: false}));

        }, error => {
            console.log(error);
            other.spinner = false;
        });
    }

    ngOnInit() {
        this.cadDocumentId = Number(this.decryptUrl(this.activatedRoute.snapshot.params.id));
        CadSummaryComponent.loadData(this);


    }

    decryptUrl(id) {
        return new CryptoJS.AES.decrypt(id, 'id').toString(CryptoJS.enc.Utf8);
    }

}
