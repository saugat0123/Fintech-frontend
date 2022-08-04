import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../service/credit-administration.service';
import {CustomerApprovedLoanCadDocumentation} from '../model/customerApprovedLoanCadDocumentation';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {NbDialogService} from '@nebular/theme';
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
import {ExcelOfferLetterConst} from '../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';

import {LaxmiOfferLetterConst} from '../cad-document-template/laxmi/laxmi-offer-letter/laxmi-offer-letter-const';
import {LaxmiOfferLetterComponent} from '../cad-document-template/laxmi/laxmi-offer-letter/laxmi-offer-letter.component';
import {DocStatus} from '../../loan/model/docStatus';
import {CadLegalDocActionModalComponent} from '../cad-legal-doc-action-modal/cad-legal-doc-action-modal.component';
import {LoanTag} from '../../loan/model/loanTag';
import {CommonService} from '../../../@core/service/common.service';

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
    isRemit = false;
    index = 0;
    path;

    constructor(
        private activatedRoute: ActivatedRoute,
        private service: CreditAdministrationService,
        private nbDialogService: NbDialogService,
        private modelService: NgbModal,
        private toastrService: ToastService,
        public routerUtilsService: RouterUtilsService,
        public commonService: CommonService
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
    spinners = false;
    toggleArray: { toggled: boolean }[] = [];

    roleType = LocalStorageUtil.getStorage().roleType;
    hasRequierdDocument = false;
    private dialogRef: any;
    isOpen = false;
    legalDoc = [];
    formdata: FormData = new FormData();
    objArr = [{}, {}];
    restUrl = ApiConfig.URL;
    ngOnInit() {
        this.offerLetterTypes = LaxmiOfferLetterConst.enumObject();
        this.offerLetterConst = LaxmiOfferLetterConst;
        this.component = LaxmiOfferLetterComponent;
    }

    checkRemit() {
        if (this.cadOfferLetterApprovedDoc.assignedLoan[0].loan.loanTag === LoanTag.getKeyByValue(LoanTag.REMIT_LOAN) && this.cadOfferLetterApprovedDoc.assignedLoan[0].loan.isRemit) {
            this.isRemit = true;
        }
    }

    getDoc() {
        this.formdata = new FormData();
        this.objArr = [{}, {}];
        this.cadOfferLetterApprovedDoc.offerDocumentList.forEach((d, i) => {
            if ((d.docName === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.PERSONAL_GUARANTEE))
                || (d.docName === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.LETTER_OF_COMMITMENT))) {
                this.getFile(i);
            }
        });
    }

    close() {
        if (this.isOpen) {
            this.dialogRef.close();
            this.isOpen = false;
        }
    }

    dataURItoBlob(dataURI) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], {type: 'image/png'});
        return blob;
    }

    public loanAction(action: 'send legal doc to sender' | 'send legal doc to agent'): void {
        const beneficiaryId: any = this.cadOfferLetterApprovedDoc.assignedLoan[0].remitCustomer.beneficiaryId;
        this.formdata.append('details', JSON.stringify(this.objArr));
        let context;
        switch (action) {
            case 'send legal doc to sender':
                context = {
                    beneficiaryId: beneficiaryId,
                    popUpTitle: 'Send Legal Doc To Sender',
                    docAction: 'SEND_BACK_TO_SENDER',
                    docActionMsg: 'Send Legal Doc',
                    legalDoc: this.legalDoc,
                    formData: this.formdata,
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
                    formData: this.formdata,
                    documentStatus: DocStatus.SEND_BACK_TO_AGENT
                };
                break;
        }
        this.dialogRef = this.nbDialogService.open(CadLegalDocActionModalComponent, {
            context,
            closeOnBackdropClick: false,
            hasBackdrop: false,
            hasScroll: true
        }).onClose.subscribe((res) => {
            this.checkCadDocument();
            this.dialogRef = null;
        });
        this.isOpen = true;
    }

    getFile(index) {
        this.path = this.cadOfferLetterApprovedDoc.offerDocumentList[index].draftPath;
        const mimeType = this.path.split('.')[1];
        const promise = this.service.getFile(this.path).toPromise();
        promise.then(res => {
            const imageBase64 = res.detail;
            if (res.detail) {
                const blob = this.dataURItoBlob(imageBase64);
                let type;
                if (mimeType === 'png' || mimeType === 'jpg' || mimeType === 'jpeg') {
                    type = 'image/' + mimeType;
                } else if (mimeType === 'pdf') {
                    type = 'application/pdf';
                } else if (mimeType === 'docx') {
                    type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                } else if (mimeType === 'txt') {
                    type = 'text/plain';
                }
                const file = new File([blob], this.cadOfferLetterApprovedDoc.offerDocumentList[index].docName + '.' + mimeType, {type: type});
                const obj = {
                    id: this.cadOfferLetterApprovedDoc.offerDocumentList[index].id,
                    docName: this.cadOfferLetterApprovedDoc.offerDocumentList[index].docName,
                    draftPath: this.cadOfferLetterApprovedDoc.offerDocumentList[index].draftPath,
                    pathSigned: ''
                };
                if (this.cadOfferLetterApprovedDoc.offerDocumentList[index].docName === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.PERSONAL_GUARANTEE)) {
                    this.formdata.append('file', file);
                    this.objArr[0] = obj;
                } else if (this.cadOfferLetterApprovedDoc.offerDocumentList[index].docName === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.LETTER_OF_COMMITMENT)) {
                    this.formdata.append('file2', file);
                    this.objArr[1] = obj;
                }
            }
        });
    }

    checkCadDocument() {
        const cadDocuments: any = this.cadOfferLetterApprovedDoc.offerDocumentList;
        let index = 0;
        if (cadDocuments.length > 0) {
            cadDocuments.forEach((data) => {
                if ((data.docName === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.PERSONAL_GUARANTEE) && data.draftPath !== null)
                    || (data.docName === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.LETTER_OF_COMMITMENT && data.draftPath !== null))) {
                    index += 1;
                }
            });
            if (index === 2 || index > 2) {
                this.hasRequierdDocument = true;
                if (this.hasRequierdDocument && this.isRemit) {
                    this.getDoc();
                }
            }
        }
    }

    initial() {
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.customerInfoData = this.cadOfferLetterApprovedDoc.loanHolder;
            this.cadOfferLetterApprovedDoc.assignedLoan.forEach(() => this.toggleArray.push({toggled: false}));
        }
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
        const i = this.uploadFile.name.split('.').length - 1;
        if (this.uploadFile.name.split('.')[i] !== 'docx' && this.uploadFile.name.split('.')[i] !== 'png' && this.uploadFile.name.split('.')[i] !== 'jpg' && this.uploadFile.name.split('.')[i] !== 'pdf' && this.uploadFile.name.split('.')[i] !== 'txt') {
            this.modelService.dismissAll();
            this.toastrService.show(new Alert(AlertType.ERROR, 'Not Supported Type'));
            this.uploadFile = null;
            return;
        }
    }

    previewClick(file, flag) {
        let fileName = this.uploadFile;
        if (file !== null) {
            if (!file.toLowerCase().includes('signed') && flag) {
                this.commonService.openDocuments(file);
            } else {
                fileName = ApiConfig.URL + '/' + file;
                const link = document.createElement('a');
                link.href = fileName;
                link.target = '_blank';
                link.click();
            }
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
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.checkRemit();
            this.initial();
            this.checkCadDocument();
        }
    }

    openModal(template) {
        this.modelService.open(template);
    }

}
