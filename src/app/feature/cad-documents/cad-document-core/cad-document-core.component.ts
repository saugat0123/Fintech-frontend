import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {LoanDataHolder} from '../../loan/model/loanData';
import {OfferLetter} from '../../admin/modal/offerLetter';
import {CustomerOfferLetterPath} from '../../loan/model/customer-offer-letter-path';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {ToastService} from '../../../@core/utils';
import {CustomerOfferLetterService} from '../../loan/service/customer-offer-letter.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../@theme/model/Alert';

@Component({
  selector: 'app-cad-document-core',
  templateUrl: './cad-document-core.component.html',
  styleUrls: ['./cad-document-core.component.scss']
})
export class CadDocumentCoreComponent implements OnInit {

  client = environment.client;
  clientList = Clients;
  loanDataHolder: LoanDataHolder;
  customerId: number;
  branchId: number;
  offerLetterList: Array<OfferLetter>;
  offerLetterId;
  uploadFile;
  preview = false;
  customerOfferLetterPathList: Array<CustomerOfferLetterPath>;
  offerLetterConst;


  constructor(
      private activatedRoute: ActivatedRoute,
      private loanFormService: LoanFormService,
      private toastService: ToastService,
      private customerOfferLetterService: CustomerOfferLetterService,
      private modalService: NgbModal,
      private router: Router
  ) {
  }

  ngOnInit() {
    this.customerId = Number(this.activatedRoute.snapshot.queryParamMap.get('customerId'));
    this.branchId = Number(this.activatedRoute.snapshot.queryParamMap.get('branchId'));
    this.loanFormService.detail(this.customerId).subscribe((response: any) => {
      this.loanDataHolder = response.detail;
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
                  offerLetter.pathSigned = customerOfferLetterPath.pathSigned;
                  offerLetter.isApproved = customerOfferLetterPath.isApproved;
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

  onClose() {
    this.preview = false;
    this.uploadFile = null;
    this.modalService.dismissAll();
  }

}
