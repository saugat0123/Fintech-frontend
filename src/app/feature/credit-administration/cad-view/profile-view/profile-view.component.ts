import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';

import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {CommonService} from '../../../../@core/service/common.service';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {environment} from '../../../../../environments/environment';
import {Clients} from '../../../../../environments/Clients';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {CadOfferLetterConfigurationComponent} from '../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component';
import {UpdateCustomerCadInfoComponent} from '../../cad-offerletter-profile/update-customer-cad-info/update-customer-cad-info.component';
import {MegaOfferLetterConst} from '../../mega-offer-letter-const';
import {CadOfferLetterModalComponent} from '../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';


@Component({
    selector: 'app-profile-view',
    templateUrl: './profile-view.component.html',
    styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
    @Input()
    cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input()
    customerInfoData: CustomerInfoData;
    cadDocumentId;
    spinner = false;
    currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
    @Input()
    toggleArray: { toggled: boolean }[];
    offerLetterTypes = [];
    client = environment.client;
    clientList = Clients;
    component: any;
    roleType = LocalStorageUtil.getStorage().roleType;
    offerLetterConst;
    responseCadData: EventEmitter<CustomerApprovedLoanCadDocumentation> = new EventEmitter<CustomerApprovedLoanCadDocumentation>();
    @Input()
    disableEditBasicData: boolean;
    constructor(
        public commonService: CommonService,
        public routerUtilsService: RouterUtilsService,
        public toastrService: ToastService,
        public nbDialogService: NbDialogService,
    ) {
    }

    ngOnInit() {
        switch (this.client) {
        }
    }

    updateBasicInfo() {
        // const modalRef = this.modelService.open(UpdateCustomerCadInfoComponent);
        // modalRef.componentInstance.cadData = this.cadOfferLetterApprovedDoc;
        this.nbDialogService.open(UpdateCustomerCadInfoComponent, {
            context: {
                cadData: this.cadOfferLetterApprovedDoc,

            },
            closeOnBackdropClick: false
        }).onClose.subscribe((res: any) => {
            console.log('update', res);
            if (!ObjectUtil.isEmpty(res)) {
                this.responseCadData.emit(res);
            }

        });
    }

    openOfferLetterConfigModal() {
        this.nbDialogService.open(CadOfferLetterConfigurationComponent, {
            context: {
                cadData: this.cadOfferLetterApprovedDoc,
                customerInfo: this.customerInfoData,
                customer: this.cadOfferLetterApprovedDoc.assignedLoan[0].customerInfo
            }
        }).onClose
            .subscribe(value => {
                if (!ObjectUtil.isEmpty(value)) {
                    this.customerInfoData = value;
                    console.log(value);
                }
            });
    }

    openOfferLetterDocumentModal(offerLetterType) {
        if (ObjectUtil.isEmpty(offerLetterType)) {
            this.toastrService.show(new Alert(AlertType.WARNING, 'Please Select Offer letter type'));
            return;
        }
        const cadOfferLetterApprovedDoc = this.cadOfferLetterApprovedDoc;
        const a = isNaN(offerLetterType);
        if (a) {
            offerLetterType = this.offerLetterConst.keysEnum(offerLetterType);
        }
        this.nbDialogService.open(this.component, {
            context: {
                offerLetterType: offerLetterType,
                cadOfferLetterApprovedDoc: cadOfferLetterApprovedDoc
            },
        });


    }

    public getTotal() {
        const loanList = this.cadOfferLetterApprovedDoc.assignedLoan;
        return this.isNumber(loanList
        .map(l => (l.proposal.proposedLimit))
        .reduce((a, b) => a + b, 0));

    }

    isNumber(value) {
        if (ObjectUtil.isEmpty(value)) {
            return 0;
        }
        if (Number.isNaN(value)) {
            return 0;
        } else {
            return value;
        }

    }

}
