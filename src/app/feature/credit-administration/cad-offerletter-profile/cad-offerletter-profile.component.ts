import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreditAdministrationService} from '../service/credit-administration.service';
import {MegaOfferLetterConst} from '../mega-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../model/customerApprovedLoanCadDocumentation';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {NbDialogService} from '@nebular/theme';
import {CadOfferLetterModalComponent} from './cad-offer-letter-modal/cad-offer-letter-modal.component';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {RouterUtilsService} from '../utils/router-utils.service';
import {CustomOfferLetterDocumentComponent} from './cad-offer-letter-modal/custom-offer-letter-document/custom-offer-letter-document.component';
import {UpdateCustomerCadInfoComponent} from './update-customer-cad-info/update-customer-cad-info.component';

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

    constructor(
        private activatedRoute: ActivatedRoute,
        private service: CreditAdministrationService,
        private nbDialogService: NbDialogService,
        private modelService: NgbModal,
        private toastrService: ToastService,
        private router: Router,
        private routerUtilsService: RouterUtilsService
    ) {
    }

    spinner = false;
    offerLetterId;
    loanHolderId;
    customerInfoData: CustomerInfoData;
    offerLetterTypes = MegaOfferLetterConst.enumObject();

    // todo move document upload to different to component
    documentName;
    documentId;
    docType = null;
    uploadFile;
    index;

    toggleArray: { toggled: boolean }[] = [];

    ngOnInit() {
        this.initial();
    }

    initial() {
        this.customerInfoData = this.cadOfferLetterApprovedDoc.loanHolder;
        console.log(this.cadOfferLetterApprovedDoc.assignedLoan, 'sd');
        this.cadOfferLetterApprovedDoc.assignedLoan.forEach(() => this.toggleArray.push({toggled: false}));
    }

    openOfferLetterDocumentModal(offerLetterType) {
        if (ObjectUtil.isEmpty(offerLetterType)) {
            this.toastrService.show(new Alert(AlertType.WARNING, 'Please Select Offer letter type'));
            return;
        }
        const cadOfferLetterApprovedDoc = this.cadOfferLetterApprovedDoc;
        this.nbDialogService.open(CadOfferLetterModalComponent, {
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
            console.log('update', res);
            if (!ObjectUtil.isEmpty(res)) {
                this.responseCadData.emit(res);
            }

        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initial();
    }

}
