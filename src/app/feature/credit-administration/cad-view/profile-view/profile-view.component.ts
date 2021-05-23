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
import {ExcelOfferLetterConst} from '../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';
import {CadOfferLetterConfigurationComponent} from '../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component';
import {UpdateCustomerCadInfoComponent} from '../../cad-offerletter-profile/update-customer-cad-info/update-customer-cad-info.component';
import {ExcelOfferLetterComponent} from '../../excel-offer-letter-template/excel-offer-letter/excel-offer-letter.component';

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
    roleType = LocalStorageUtil.getStorage().roleType;
    offerLetterConst = ExcelOfferLetterConst;
    responseCadData: EventEmitter<CustomerApprovedLoanCadDocumentation> = new EventEmitter<CustomerApprovedLoanCadDocumentation>();

    constructor(
        public commonService: CommonService,
        public routerUtilsService: RouterUtilsService,
        public toastrService: ToastService,
        public nbDialogService: NbDialogService,
    ) {
    }

    ngOnInit() {
        if (this.client === this.clientList.EXCEL) {
            this.offerLetterTypes = ExcelOfferLetterConst.enumObject();
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
        this.nbDialogService.open(ExcelOfferLetterComponent, {
            context: {
                offerLetterType: offerLetterType,
                cadOfferLetterApprovedDoc: cadOfferLetterApprovedDoc
            },
        });


    }

}
