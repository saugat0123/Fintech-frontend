import {Component, Input, OnInit} from '@angular/core';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {ToastService} from '../../../../@core/utils';
import {CustomerOfferLetterService} from '../../../loan/service/customer-offer-letter.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ExcelOfferLetterConst} from './excel-offer-letter-const';
import {Router} from '@angular/router';
import {OfferLetterDocType, OfferLetteDocrTypeEnum} from '../model/OfferLetteDocrTypeEnum';

@Component({
  selector: 'app-excel-offer-letter',
  templateUrl: './excel-offer-letter.component.html',
  styleUrls: ['./excel-offer-letter.component.scss']
})
export class ExcelOfferLetterComponent implements OnInit {

  @Input() customerId;
  @Input() loanDataHolder;
  @Input() offerLetterList;

  offerLetterId;
  offerLetterConst = ExcelOfferLetterConst;
  fullScreenView = false;
  uploadFile;
  preview = false;
  docType = OfferLetteDocrTypeEnum.DRAFT;
  offerLetterType = OfferLetterDocType.values();

  constructor(  private loanFormService: LoanFormService,
                private toastService: ToastService,
                private customerOfferLetterService: CustomerOfferLetterService,
                private modalService: NgbModal,
                private router: Router) { }

  ngOnInit() {
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

  onFileChange(e) {
    this.uploadFile = e.target.files[0];
    this.preview = true;
  }

  uploadOfferLetter(id, model) {
    this.offerLetterId = id;
    this.modalService.open(model);

  }

  submitOfferLetter() {

    this.preview = false;
    const formData: FormData = new FormData();

    formData.append('customerLoanId', this.customerId.toString());
    formData.append('offerLetterId', this.offerLetterId.toString());
    formData.append('file', this.uploadFile);
    formData.append('type', this.docType.toString());

    if (this.customerId === undefined) {
      return this.toastService.show(new Alert(AlertType.ERROR, 'Customer Cannot be empty'));
    }
    this.customerOfferLetterService.uploadOfferFile(formData).subscribe((response: any) => {
      this.onClose();
      this.toastService.show(new Alert(AlertType.SUCCESS, 'OFFER LETTER HAS BEEN UPLOADED'));
      this.router.navigateByUrl('/home/dashboard').then(value => {
        if (value) {
          this.router.navigate(['/home/cad-document'], {
            queryParams: {customerId: this.customerId, }
          });
        }
      });
    }, error => {
      this.onClose();
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
      console.error(error);
    });

  }

}
