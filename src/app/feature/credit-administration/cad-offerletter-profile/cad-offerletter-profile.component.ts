import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../service/credit-administration.service';
import {CustomerApprovedLoanCadDocumentation} from '../model/customerApprovedLoanCadDocumentation';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {RouterUtilsService} from '../utils/router-utils.service';
import {CustomOfferLetterDocumentComponent} from './cad-offer-letter-modal/custom-offer-letter-document/custom-offer-letter-document.component';
import {UpdateCustomerCadInfoComponent} from './update-customer-cad-info/update-customer-cad-info.component';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {CadOfferLetterConfigurationComponent} from './cad-offer-letter-configuration/cad-offer-letter-configuration.component';
import {ExcelOfferLetterComponent} from '../excel-offer-letter-template/excel-offer-letter/excel-offer-letter.component';
import {ExcelOfferLetterConst} from '../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';
import {ProgressiveOfferLetterConst} from '../cad-document-template/progressive/progressive-offer-letter/progressive-offer-letter-const';
import {ProgressiveOfferLetterComponent} from '../cad-document-template/progressive/progressive-offer-letter/progressive-offer-letter.component';

import {IcfcOfferLetterComponent} from '../cad-document-template/icfc/icfc-offer-letter/icfc-offer-letter.component';
import {IcfcOfferLetterConst} from '../cad-document-template/icfc/icfc-offer-letter-const';
import {LaxmiOfferLetterConst} from '../cad-document-template/laxmi/laxmi-offer-letter/laxmi-offer-letter-const';
import {LaxmiOfferLetterComponent} from '../cad-document-template/laxmi/laxmi-offer-letter/laxmi-offer-letter.component';
import {OfferLetterDocType} from "../model/OfferLetteDocrTypeEnum";
import {DocAction} from "../../loan/model/docAction";
import {DocStatus} from "../../loan/model/docStatus";
import {LoanActionModalComponent} from "../../loan/loan-action/loan-action-modal/loan-action-modal.component";
import {LoanActionCombinedModalComponent} from "../../loan/loan-action/loan-action-combined-modal/loan-action-combined-modal.component";
import {CadLegalDocActionModalComponent} from "../cad-legal-doc-action-modal/cad-legal-doc-action-modal.component";

@Component({
    selector: 'app-cad-offerletter-profile',
    templateUrl: './cad-offerletter-profile.component.html',
    styleUrls: ['./cad-offerletter-profile.component.scss']
})
export class CadOfferLetterProfileComponent implements OnInit, OnChanges {

    /*todo get data from input and remove fetch here*/
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Output()
    responseCadData: EventEmitter<CustomerApprovedLoanCadDocumentation> = new EventEmitter<CustomerApprovedLoanCadDocumentation>();
    // change this on basis of bank
    offerLetterConst;
    excelOfferLetterConst = ExcelOfferLetterConst;

    constructor(
        private activatedRoute: ActivatedRoute,
        private service: CreditAdministrationService,
        private nbDialogService: NbDialogService,
        private modelService: NgbModal,
        private toastrService: ToastService,
        public routerUtilsService: RouterUtilsService
    ) {
    }

    spinner = false;
    offerLetterId;
    loanHolderId;
    customerInfoData: CustomerInfoData;
    component: any;
    offerLetterTypes = [];
    excelOfferLetterTypes = [];
    client = environment.client;
    clientList = Clients;
    // todo move document upload to different to component
    documentName;
    documentId;
    docType = null;
    uploadFile;
    index;
    spinners = false;
    toggleArray: { toggled: boolean }[] = [];

    roleType = LocalStorageUtil.getStorage().roleType;
    hasRequierdDocument = false;
    private dialogRef: NbDialogRef<any>;
    isOpen = false;
    legalDoc = [];


    ngOnInit() {
        this.initial();
        this.checkCadDocument();
        switch (this.client) {
            case this.clientList.LAXMI:
                this.offerLetterTypes = LaxmiOfferLetterConst.enumObject();
                this.offerLetterConst = LaxmiOfferLetterConst;
                this.component = LaxmiOfferLetterComponent;
                break;
            case this.clientList.EXCEL:
                this.offerLetterTypes = ExcelOfferLetterConst.enumObject();
                this.offerLetterConst = ExcelOfferLetterConst;
                this.component = ExcelOfferLetterComponent;
                break;
            case this.clientList.PROGRESSIVE:
                this.offerLetterTypes = ProgressiveOfferLetterConst.enumObject();
                this.offerLetterConst = ProgressiveOfferLetterConst;
                this.component = ProgressiveOfferLetterComponent;
                break;
            case this.clientList.ICFC:
                this.offerLetterTypes = IcfcOfferLetterConst.enumObject();
                this.offerLetterConst = IcfcOfferLetterConst;
                this.component = IcfcOfferLetterComponent;
                break;
        }
    }

    close() {
        if (this.isOpen) {
            this.dialogRef.close();
            this.isOpen = false;
        }
    }

    public loanAction(action: 'send legal doc to sender' | 'send legal doc to agent'): void {
        this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offer => {
            const obj = {
                id: 0,
                docName: '',
                draftPath: '',
                pathSigned: ''
            };
            obj.id = offer.id;
            obj.docName = offer.docName;
            obj.draftPath = offer.draftPath;
            this.legalDoc.push(obj);
        });
        const beneficiaryId: any = this.cadOfferLetterApprovedDoc.assignedLoan[0].remitCustomer.beneficiaryId;
        this.close();
        let context;
        switch (action) {
            case 'send legal doc to sender':
                context = {
                    beneficiaryId: beneficiaryId,
                    popUpTitle: 'Send Legal Doc To Sender',
                    docAction: 'SEND_BACK_TO_SENDER',
                    docActionMsg: 'Send Legal Doc',
                    legalDoc: this.legalDoc,
                    documentStatus: DocStatus.SEND_BACK_TO_SENDER
                };
                break;

            case 'send legal doc to agent':
                context = {
                    beneficiaryId: beneficiaryId,
                    popUpTitle: 'Send Legal Doc To Agent',
                    docAction: 'SEND_BACK_TO_AGENT',
                    legalDoc: this.legalDoc,
                    docActionMsg: 'Send Legal Doc',
                    documentStatus: DocStatus.SEND_BACK_TO_AGENT
                };
                break;
        }
        this.dialogRef = this.nbDialogService.open(CadLegalDocActionModalComponent, {
            context,
            closeOnBackdropClick: false,
            hasBackdrop: false,
            hasScroll: true
        });
        this.isOpen = true;
    }

    checkCadDocument() {
        const cadDocuments: any = this.cadOfferLetterApprovedDoc.offerDocumentList;
        let index = 0;
        if (cadDocuments.length > 0) {
            cadDocuments.forEach((data) => {
                if ((data.docName === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.PERSONAL_GUARANTEE))
                    || (data.docName === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.LETTER_OF_COMMITMENT))) {
                    index += 1;
                }
            });
            if (index === 2 || index > 2) {
                this.hasRequierdDocument = true;
            }
        }
    }

    initial() {
        this.customerInfoData = this.cadOfferLetterApprovedDoc.loanHolder;
        this.cadOfferLetterApprovedDoc.assignedLoan.forEach(() => this.toggleArray.push({toggled: false}));
    }

    openOfferLetterDocumentModal(offerLetterType) {
        if (ObjectUtil.isEmpty(offerLetterType)) {
            this.toastrService.show(new Alert(AlertType.WARNING, 'Please Select Offer letter type'));
            return;
        }

        const cadOfferLetterApprovedDoc = this.cadOfferLetterApprovedDoc;
        if (isNaN(offerLetterType)) {
            offerLetterType = this.offerLetterConst.keysEnum(offerLetterType);
        }
        this.nbDialogService.open(this.component, {
            context: {offerLetterType, cadOfferLetterApprovedDoc}
        });
    }

    openCustomOfferLetterDocumentModal(editId) {
        const cadOfferLetterApprovedDoc = this.cadOfferLetterApprovedDoc;
        this.nbDialogService.open(CustomOfferLetterDocumentComponent, {
            context: {editId, cadOfferLetterApprovedDoc}
        });
    }

    openModel(model, documentName: string, documentId, index: number) {
        this.documentName = documentName;
        this.documentId = documentId;
        this.modelService.open(model);
    }

    // todo move document upload to seperate to component
    submitOfferLetter() {
        const formData: FormData = new FormData();
        formData.append('file', this.uploadFile);
        formData.append('customerApprovedDocId', this.cadOfferLetterApprovedDoc.id.toString());
        formData.append('offerLetterId', this.documentId.toString());
        formData.append('type', this.docType.toString());
        if (this.customerInfoData.id === undefined) {
            return this.toastrService.show(new Alert(AlertType.ERROR, 'Customer Cannot be empty'));
        }
        this.spinners = true;
        this.service.uploadOfferFile(formData).subscribe((response: any) => {
            this.spinners = false;
            this.toastrService.show(new Alert(AlertType.SUCCESS, 'OFFER LETTER HAS BEEN UPLOADED'));
            this.modelService.dismissAll();
            this.service.detail(this.cadOfferLetterApprovedDoc.id).subscribe((res: any) => {
                this.responseCadData.emit(res.detail);
                this.cadOfferLetterApprovedDoc = res.detail;
            });
        }, error => {
            this.modelService.dismissAll();
            this.spinners = false;
            this.toastrService.show(new Alert(AlertType.ERROR, error.error.message));
            console.error(error);
        });

    }


    uploadOfferLetter(event) {
        this.uploadFile = event.target.files[0];
    }

    previewClick(file) {
        let fileName = this.uploadFile;
        if (file !== null) {
            fileName = ApiConfig.URL + '/' + file;

            const link = document.createElement('a');
            link.href = fileName;
            link.target = '_blank';
            link.click();
        } else {
            const downloadUrl = window.URL.createObjectURL(fileName);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.target = '_blank';
            link.click();
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
                    this.cadOfferLetterApprovedDoc.loanHolder = value;
                    this.customerInfoData = value;
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initial();
        this.checkCadDocument();
    }

    openModal(template) {
        this.modelService.open(template);
    }

}
