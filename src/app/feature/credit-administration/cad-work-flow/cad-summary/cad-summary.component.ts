import {Component, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {CommonService} from '../../../../@core/service/common.service';
import * as CryptoJS from 'crypto-js';
import {CadDocStatus} from '../../model/CadDocStatus';

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
    approvedLoan = false;
    ngOnInit() {
        console.log(this.cadOfferLetterApprovedDoc );
        this.cadDocumentId = Number(this.decryptUrl(this.activatedRoute.snapshot.params.id));
       this.loadData();
        console.log(this.cadOfferLetterApprovedDoc );
        if (this.cadOfferLetterApprovedDoc.docStatus === CadDocStatus.DISBURSEMENT_APPROVED) {
            this.approvedLoan = true;
        }

    }
     loadData() {
        this.spinner = true;
        this.service.detail(this.cadDocumentId).subscribe((res: any) => {
            console.log('this is respionse', res.detail);
            this.cadOfferLetterApprovedDoc = res.detail;
            this.customerInfoData = this.cadOfferLetterApprovedDoc.loanHolder;
            this.spinner = false;
            this.customerInfoData = this.cadOfferLetterApprovedDoc.loanHolder;
            this.cadOfferLetterApprovedDoc.assignedLoan.forEach(() => this.toggleArray.push({toggled: false}));

        }, error => {
            console.log(error);
            this.spinner = false;
        });
    }
    decryptUrl(id) {
        return new CryptoJS.AES.decrypt(id, 'id').toString(CryptoJS.enc.Utf8);
    }

}
