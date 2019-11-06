import {Component, Input, OnInit} from '@angular/core';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {ToastService} from '../../../../../@core/utils';
import {CustomerOfferLetterService} from '../../../service/customer-offer-letter.service';

@Component({
  selector: 'app-offer-letter-upload',
  templateUrl: './offer-letter-upload.component.html',
  styleUrls: ['./offer-letter-upload.component.scss']
})
export class OfferLetterUploadComponent implements OnInit {
  @Input() customerOfferLetter: CustomerOfferLetter;
  @Input() customerId: number;
  offerLetterId: number;
  uploadFile;
  preview;

  constructor(
      private toastService: ToastService,
      private customerOfferLetterService: CustomerOfferLetterService,
  ) {
  }

  ngOnInit() {
    console.log(this.customerOfferLetter);
  }

  submitOfferLetter() {
    const formData: FormData = new FormData();

    formData.append('file', this.uploadFile);
    formData.append('customerLoanId', this.customerId.toString());
    formData.append('offerLetterId', this.offerLetterId.toString());
    if (this.customerId === undefined) {
      return this.toastService.show(new Alert(AlertType.ERROR, 'Customer Cannot be empty'));
    }
    this.customerOfferLetterService.uploadOfferFile(formData).subscribe((response: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'OFFER LETTER HAS BEEN UPLOADED'));
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
      console.error(error);
    });

  }

  uploadOfferLetter(event) {
    this.uploadFile = event.target.files[0];
    this.preview = true;
  }

  previewClick(file) {
    alert(file);
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

}
