import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../../@core/utils';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';

@Component({
    selector: 'app-legal-and-disbursement',
    templateUrl: './legal-and-disbursement.component.html',
    styleUrls: ['./legal-and-disbursement.component.scss']
})
export class LegalAndDisbursementComponent implements OnInit {

    cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    customerInfoData: CustomerInfoData;
    offerLetterId;
    spinner = false;
    currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
    showHideAction = false;

    constructor(private activatedRoute: ActivatedRoute,
                private service: CreditAdministrationService,
                private nbDialogService: NbDialogService,
                private modelService: NgbModal,
                private toastrService: ToastService) {
    }


    static loadData(other: LegalAndDisbursementComponent) {
        other.spinner = true;
        other.service.detail(other.offerLetterId).subscribe((res: any) => {
            other.cadOfferLetterApprovedDoc = res.detail;
            other.customerInfoData = other.cadOfferLetterApprovedDoc.loanHolder;
            console.log('from local storage', other.currentUserLocalStorage.toString());
            console.log('from local storage', other.cadOfferLetterApprovedDoc);
            if (other.currentUserLocalStorage.toString() === other.cadOfferLetterApprovedDoc.cadCurrentStage.toUser.id.toString()) {
                other.showHideAction = true;
            }
            console.log(res.detail);
            other.spinner = false;
        }, error => {
            console.log(error);
            other.spinner = false;
        });
    }

    ngOnInit() {
        this.offerLetterId = Number(this.activatedRoute.snapshot.queryParamMap.get('offerLetterId'));
        LegalAndDisbursementComponent.loadData(this);

    }


}
