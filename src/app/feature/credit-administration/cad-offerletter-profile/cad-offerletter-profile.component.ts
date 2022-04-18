import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../service/credit-administration.service';
import {MegaOfferLetterConst} from '../mega-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../model/customerApprovedLoanCadDocumentation';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CadOfferLetterModalComponent} from './cad-offer-letter-modal/cad-offer-letter-modal.component';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {RouterUtilsService} from '../utils/router-utils.service';
import {CustomOfferLetterDocumentComponent} from './cad-offer-letter-modal/custom-offer-letter-document/custom-offer-letter-document.component';
import {UpdateCustomerCadInfoComponent} from './update-customer-cad-info/update-customer-cad-info.component';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {CadOfferLetterConfigurationComponent} from './cad-offer-letter-configuration/cad-offer-letter-configuration.component';
import {LoanDataHolder} from '../../loan/model/loanData';
import {NabilOfferLetterConst} from '../nabil-offer-letter-const';
import {OfferDocument} from '../model/OfferDocument';
import {PersonalLoanPrintComponent} from '../mega-offer-letter-template/mega-offer-letter/personal-loan/personal-loan-print/personal-loan-print.component';
import {CustomerType} from '../../customer/model/customerType';


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
    nepData;
    offerLetterDocument;
    loanLimit: any;
    initialInfoPrint: any;
    offerLetterData: any;
    nbDialogServiceRef;
    selectedSecurity: any;
    renewal: any;
    selectedInterest: any;
    customerType = CustomerType;

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
    // todo move document upload to different to component
    documentName;
    documentId;
    docType = null;
    uploadFile;
    index;

    toggleArray: { toggled: boolean }[] = [];

    roleType = LocalStorageUtil.getStorage().roleType;

    ngOnInit() {
        this.initial();
        this.offerLetterTypes = NabilOfferLetterConst.enumObject();
        this.offerLetterConst = NabilOfferLetterConst;
        this.component = CadOfferLetterModalComponent;
    }

    initial() {
        this.customerInfoData = this.cadOfferLetterApprovedDoc.loanHolder;
        this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        console.log(this.cadOfferLetterApprovedDoc.assignedLoan, 'sd');
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
            context: {offerLetterType, cadOfferLetterApprovedDoc},
            dialogClass: 'model-full',
        });
    }

    openOfferLetterPrintDocumentModal(offerLetterType) {
        if (ObjectUtil.isEmpty(offerLetterType)) {
            this.toastrService.show(new Alert(AlertType.WARNING, 'Please Select Offer letter type'));
            return;
        }

        const cadOfferLetterApprovedDoc = this.cadOfferLetterApprovedDoc;
        if (isNaN(offerLetterType)) {
            offerLetterType = this.offerLetterConst.keysEnum(offerLetterType);
        }
        this.nbDialogService.open(this.component, {
            context: {offerLetterType, cadOfferLetterApprovedDoc},
            dialogClass: 'model-full',
        });
    }


    openCustomOfferLetterDocumentModal(editId) {
        const cadOfferLetterApprovedDoc = this.cadOfferLetterApprovedDoc;
        this.nbDialogService.open(CustomOfferLetterDocumentComponent, {
            context: {editId, cadOfferLetterApprovedDoc}
        });
    }

    openPreviewModal(model, documentName: string, documentId, index: number) {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName
                === documentName)[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = documentName;
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                console.log('initialInformation:', initialInfo);
                if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
                    this.offerLetterData = this.offerLetterDocument;
                    // this.personalLoan.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
                }
                if ('loanLimitChecked' in initialInfo) {
                    this.loanLimit = initialInfo.loanLimitChecked.en;
                }
                if ('selectedSecurity' in initialInfo) {
                    this.selectedSecurity = initialInfo.selectedSecurity.en;
                }
                if ('renewalChecked' in initialInfo) {
                    this.renewal = initialInfo.renewalChecked.en;
                }
                if ('selectedInterest'in initialInfo) {
                    this.selectedInterest = initialInfo.selectedInterest.en;
                }
                this.initialInfoPrint = initialInfo;
                // this.selectedArray = initialInfo.loanTypeSelectedArray;
                this.initialInfoPrint = initialInfo;
            }
            this.documentName = documentName;
        }
        this.nbDialogServiceRef = this.nbDialogService.open(model, {
            dialogClass: 'model-full'
        });
    }

    openModel(model, documentName: string, documentId, index: number) {
        this.documentName = documentName;
        this.documentId = documentId;
        this.modelService.open(model);
    }


    // todo move document upload to seperate to component
    submitOfferLetter() {
        this.spinner = true;
        const formData: FormData = new FormData();

        formData.append('file', this.uploadFile);
        formData.append('customerApprovedDocId', this.cadOfferLetterApprovedDoc.id.toString());
        formData.append('offerLetterId', this.documentId.toString());
        formData.append('type', this.docType.toString());
        if (this.customerInfoData.id === undefined) {
            return this.toastrService.show(new Alert(AlertType.ERROR, 'Customer Cannot be empty'));
        }
        this.service.uploadOfferFile(formData).subscribe((response: any) => {
            this.toastrService.show(new Alert(AlertType.SUCCESS, 'OFFER LETTER HAS BEEN UPLOADED'));
            this.modelService.dismissAll();
            this.spinner = false;
            this.service.detail(this.cadOfferLetterApprovedDoc.id).subscribe((res: any) => {
                this.responseCadData.emit(res.detail);
            });
        }, error => {
            this.modelService.dismissAll();
            this.spinner = false;
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
            fileName = `${ApiConfig.URL}/${file}?${Math.floor(Math.random() * 100) + 1}`;

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

    ngOnChanges(changes: SimpleChanges): void {
        this.initial();
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

    nbDialogServiceClose() {
        this.nbDialogServiceRef.close();
    }
}
