import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../offer-letter/model/offer-letter-const';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';
import {LoanDataHolder} from '../../../model/loanData';
import {Router} from '@angular/router';
import {CustomerOfferLetterService} from '../../../service/customer-offer-letter.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {DocStatus} from '../../../model/docStatus';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {CustomerOfferLetterPath} from '../../../model/customer-offer-letter-path';
import {MegaOfferLetterConst} from '../model/mega-offer-letter-const';

@Component({
  selector: 'app-retail-educational-loan-english',
  templateUrl: './retail-educational-loan-english.component.html',
  styleUrls: ['./retail-educational-loan-english.component.scss']
})
export class RetailEducationalLoanEnglishComponent implements OnInit {
  spinner = false;
  form: FormGroup;
  megaofferLetterConst = MegaOfferLetterConst;
  customerOfferLetter: CustomerOfferLetter;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerId: number;
  @Input() offerLetterTypeId: number;
  existingOfferLetter = false;
  initialInfoPrint;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private customerOfferLetterService: CustomerOfferLetterService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      referenceNo: [undefined],
      date: [undefined],
      guarantor: [undefined],
      permanentAddress: [undefined],
      currentAddress: [undefined],
      educationalLoan: [undefined],
      educationLoanInWord: [undefined],
      purpose: [undefined],
      studyLocation: [undefined],
      applicantName: [undefined],
      promissory: [undefined],
      loanDeed: [undefined],
      morgage: [undefined],
      personalGuarantee: [undefined],
      month: [undefined],
      returnmonth: [undefined],
      installment: [undefined],
      installmentInWord: [undefined],
      contactNo: [undefined]


    });
  }

  fillForm() {
    if (this.loanDataHolder.customerOfferLetter) {
      this.loanDataHolder.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
        if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
          this.existingOfferLetter = true;
        }
      });
    }
    if (!this.existingOfferLetter) {
      if (this.loanDataHolder.customerOfferLetter) {
        this.customerOfferLetterService.detail(this.loanDataHolder.customerOfferLetter.id).subscribe(response => {
          this.customerOfferLetter = response.detail;
        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
        });
      } else {
        this.customerOfferLetter = new CustomerOfferLetter();
      }

    } else {
      this.customerOfferLetterService.detail(this.loanDataHolder.customerOfferLetter.id).subscribe(response => {
        this.customerOfferLetter = response.detail;
        let initialInfo = null;
        this.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
          if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
            initialInfo = JSON.parse(offerLetterPath.initialInformation);
            this.initialInfoPrint = initialInfo;
          }
        });
        this.form.patchValue(initialInfo, {emitEvent: false});
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
      });
    }
  }

  submit() {
    this.spinner = true;
    this.customerOfferLetter.docStatus = DocStatus.PENDING;
    const customerLoan = new LoanDataHolder();
    customerLoan.id = this.customerId;
    this.customerOfferLetter.customerLoan = customerLoan;
    if (this.existingOfferLetter) {
      this.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
        if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerLetter = new OfferLetter();
      offerLetter.id = this.offerLetterTypeId;
      const customerOfferLetterPathArray = this.customerOfferLetter.customerOfferLetterPath ?
          this.customerOfferLetter.customerOfferLetterPath : [];
      const customerOfferLetterPath = new CustomerOfferLetterPath();
      customerOfferLetterPath.offerLetter = offerLetter;
      customerOfferLetterPath.initialInformation = JSON.stringify(this.form.value);
      customerOfferLetterPathArray.push(customerOfferLetterPath);
      this.customerOfferLetter.customerOfferLetterPath = customerOfferLetterPathArray;
    }
    this.customerOfferLetterService.save(this.customerOfferLetter).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.router.navigateByUrl('/home/dashboard').then(value => {
        if (value) {
          this.router.navigate(['/home/loan/offer-letter'], {
            queryParams: {customerId: this.customerId, }
          });
        }
      });
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Retail Educational Loan English'));
      this.spinner = false;
    });
  }

}
