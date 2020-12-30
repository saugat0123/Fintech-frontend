import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {DocStatus} from '../../../../loan/model/docStatus';
import {CustomerOfferLetterPath} from '../../../../loan/model/customer-offer-letter-path';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {MegaOfferLetterConst} from '../mega-offer-letter-const';

@Component({
  selector: 'app-retail-educational-loan',
  templateUrl: './retail-educational-loan.component.html',
  styleUrls: ['./retail-educational-loan.component.scss']
})
export class RetailEducationalLoanComponent implements OnInit {
  form: FormGroup;
  spinner = false;
  existingData;
  initialInfoPrint;
  @Input() loanDataHolder: LoanDataHolder;
  customerOfferLetter: CustomerOfferLetter;
  @Input() customerId: number;
  @Input() offerLetterTypeId: number;
  offerLetterConst = MegaOfferLetterConst;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private customerOfferLetterService: CustomerOfferLetterService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      refNo: [undefined],
      customerName: [undefined],
      permanentAddress: [undefined],
      currentAddress: [undefined],
      mobileNo: [undefined],
      subject: [undefined],
      loanName: [undefined],
      loanAmount: [undefined],
      loanNameInWord: [undefined],

      companyLocation: [undefined],
      companyName: [undefined],
      course: [undefined],
      loanTenure: [undefined],
      moratoriumPeriod: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyLoanRate: [undefined],
      emiPeriod: [undefined],
      emiAmount: [undefined],
      emiAmountInWord: [undefined],
      fmvPercent: [undefined],
      serviceChargePercent: [undefined],
      draftAmount: [undefined],
      currency: [undefined],
      securityPersonName: [undefined],
      motherDistrict: [undefined],
      motherWardNo: [undefined],
      securityDistrict: [undefined],
      securityWardNo: [undefined],
      securityLandId: [undefined],
      loanManagingDirectorName: [undefined],
      loanManagerName: [undefined],
      guarantors: [undefined]
    });
  }

  onSubmit(): void {
    this.spinner = true;
    this.customerOfferLetter.docStatus = DocStatus.PENDING;
    const customerLoan = new LoanDataHolder();
    customerLoan.id = this.customerId;
    this.customerOfferLetter.customerLoan = customerLoan;
    if (this.existingData) {
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
    // TODO: Assign Supported Information in OfferLetter
    this.customerOfferLetterService.save(this.customerOfferLetter).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.router.navigateByUrl('/home/dashboard').then(value => {
        if (value) {
          this.router.navigate(['/home/cad-document'], {
            queryParams: {customerId: this.customerId, }
          });
        }
      });
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save retail educational loan Letter'));
      this.spinner = false;
    });
  }

  fillForm(): void {
    if (this.loanDataHolder.customerOfferLetter) {
      this.loanDataHolder.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
        if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
          this.existingData = true;
        }
      });
    }
    if (!this.existingData) {
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
     /* this.addCustomerDetail();*/
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
        this.form.patchValue(initialInfo);
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
      });
    }
  }
}
