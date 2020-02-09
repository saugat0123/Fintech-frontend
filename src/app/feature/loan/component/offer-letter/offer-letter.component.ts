import {Component, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../model/loanData';
import {ActivatedRoute} from '@angular/router';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFormService} from '../loan-form/service/loan-form.service';
import {ToastService} from '../../../../@core/utils';
import {OfferLetter} from '../../../admin/modal/offerLetter';
import {CustomerOfferLetterService} from '../../service/customer-offer-letter.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {CustomerOfferLetterPath} from '../../model/customer-offer-letter-path';
import {OfferLetterConst} from './model/offer-letter-const';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-offer-letter',
    templateUrl: './offer-letter.component.html',
    styleUrls: ['./offer-letter.component.scss']
})
export class OfferLetterComponent implements OnInit {
    loanDataHolder: LoanDataHolder;
    customerId: number;
    offerLetterList: Array<OfferLetter>;
    finalOfferLetterList: Array<OfferLetter>;
    offerLetterId;
    uploadFile;
    preview = false;
    customerOfferLetterPathList: Array<CustomerOfferLetterPath>;
    offerLetterConst = OfferLetterConst;
    fullScreenView = false;
    nepaliData;
    checkNepaliData = true;


    constructor(
        private activatedRoute: ActivatedRoute,
        private loanFormService: LoanFormService,
        private toastService: ToastService,
        private customerOfferLetterService: CustomerOfferLetterService,
        private modalService: NgbModal,
    ) {
    }

    ngOnInit() {
        this.customerId = Number(this.activatedRoute.snapshot.queryParamMap.get('customerId'));
        this.loanFormService.detail(this.customerId).subscribe((response: any) => {
            this.loanDataHolder = response.detail;
            if (ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.nepaliDetail)) {
                this.alertNoNepaliForm();
                this.checkNepaliData = false;
            } else {
                this.nepaliData = JSON.parse(this.loanDataHolder.customerInfo.nepaliDetail);
            }
            this.offerLetterList = this.loanDataHolder.loan.offerLetters;
            if (this.loanDataHolder.customerOfferLetter != null) {
                this.customerOfferLetterPathList = this.loanDataHolder.customerOfferLetter.customerOfferLetterPath;
            }
            this.offerLetterList.forEach(offerLetter => {
                    offerLetter.isPresent = false;
                    if (this.loanDataHolder.customerOfferLetter != null) {
                        this.customerOfferLetterPathList.forEach(customerOfferLetterPath => {
                            if (customerOfferLetterPath.offerLetter.id === offerLetter.id) {
                                offerLetter.isPresent = true;
                                offerLetter.uploadedUrl = customerOfferLetterPath.path;
                            }

                        });
                    }
                }
            );

        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error loading loan information.'));
        });
    }

    uploadOfferLetter(id, model) {
        this.offerLetterId = id;
        this.modalService.open(model);

    }

    onFileChange(e) {
        this.uploadFile = e.target.files[0];
        this.preview = true;
    }

    submitOfferLetter() {

        this.preview = false;
        const formData: FormData = new FormData();

        formData.append('customerLoanId', this.customerId.toString());
        formData.append('offerLetterId', this.offerLetterId.toString());
        formData.append('file', this.uploadFile);

        if (this.customerId === undefined) {
            return this.toastService.show(new Alert(AlertType.ERROR, 'Customer Cannot be empty'));
        }
        this.customerOfferLetterService.uploadOfferFile(formData).subscribe((response: any) => {
            this.onClose();
            this.toastService.show(new Alert(AlertType.SUCCESS, 'OFFER LETTER HAS BEEN UPLOADED'));
        }, error => {
            this.onClose();
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            console.error(error);
        });

    }

    onClose() {
        this.preview = false;
        this.uploadFile = null;
        this.modalService.dismissAll();
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


    showFullScreen(id) {
        this.fullScreenView = true;
        const a = this.offerLetterConst.keysEnum(id);
        const el = document.getElementById(a);
        el.requestFullscreen();

    }

    alertNoNepaliForm() {
        const alert = new Alert(AlertType.INFO, 'नेपाली फारम भारिएको छैन');
        this.toastService.show(alert);
    }
}
