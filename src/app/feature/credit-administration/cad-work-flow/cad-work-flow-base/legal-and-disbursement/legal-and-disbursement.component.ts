import {Component, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../../@core/utils';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-legal-and-disbursement',
    templateUrl: './legal-and-disbursement.component.html',
    styleUrls: ['./legal-and-disbursement.component.scss']
})
export class LegalAndDisbursementComponent implements OnInit {

    cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    customerInfoData: CustomerInfoData;
    cadDocumentId;
    spinner = false;
    currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
    showHideAction = false;
    activeTab = 0;

    constructor(private activatedRoute: ActivatedRoute,
                private service: CreditAdministrationService,
                private nbDialogService: NbDialogService,
                private modelService: NgbModal,
                private toastrService: ToastService) {
    }


    static loadData(other: LegalAndDisbursementComponent) {
        other.spinner = true;
        other.service.detail(other.cadDocumentId).subscribe((res: any) => {
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
        this.cadDocumentId = Number(this.activatedRoute.snapshot.queryParamMap.get('cadDocumentId'));
        if (!ObjectUtil.isEmpty(history.state.data)) {
            this.cadOfferLetterApprovedDoc = history.state.data;
            this.customerInfoData = this.cadOfferLetterApprovedDoc.loanHolder;
            if (this.currentUserLocalStorage.toString() === this.cadOfferLetterApprovedDoc.cadCurrentStage.toUser.id.toString()) {
                this.showHideAction = true;
            }
        } else {
            LegalAndDisbursementComponent.loadData(this);
        }
        if (!ObjectUtil.isEmpty(history.state.tabId)) {
            this.activeTab = history.state.tabId;
        }

    }

    newCadData(event: CustomerApprovedLoanCadDocumentation) {
        this.cadOfferLetterApprovedDoc = event;
        if (ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            LegalAndDisbursementComponent.loadData(this);
        } else {
            this.customerInfoData = this.cadOfferLetterApprovedDoc.loanHolder;
            if (this.currentUserLocalStorage.toString() === this.cadOfferLetterApprovedDoc.cadCurrentStage.toUser.id.toString()) {
                this.showHideAction = true;
            }
        }
    }

}
