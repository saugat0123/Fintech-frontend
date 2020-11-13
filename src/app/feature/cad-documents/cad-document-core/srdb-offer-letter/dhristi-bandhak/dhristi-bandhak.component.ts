import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DocStatus} from '../../../../loan/model/docStatus';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {CustomerOfferLetterPath} from '../../../../loan/model/customer-offer-letter-path';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {OfferLetterConst} from '../offer-letter-const';

@Component({
  selector: 'app-dhristi-bandhak',
  templateUrl: './dhristi-bandhak.component.html',
  styleUrls: ['./dhristi-bandhak.component.scss']
})
export class DhristiBandhakComponent implements OnInit {

  loanGroup: FormGroup;
  spinner = false;
  existingOfferLetter = false;
  @Input() loanDataHolder: LoanDataHolder;
  customerOfferLetter: CustomerOfferLetter;
  @Input() customerId: number;
  @Input() offerLetterTypeId: number;
  // offerLetterTypeId= 4;
  initialInfoPrint;
  offerLetterConst = OfferLetterConst;

  constructor(
      private loanBuilder: FormBuilder,
      private customerOfferLetterService: CustomerOfferLetterService,
      private toastService: ToastService,
      private router: Router
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  buildForm() {
    this.loanGroup = this.loanBuilder.group({
      grandParent: [undefined],
      parent: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalities: [undefined],
      permanentWard: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalities: [undefined],
      temporaryWard: [undefined],
      age: [undefined],
      guarantor: [undefined],
      ministry: [undefined],
      department: [undefined],
      office: [undefined],
      date: [undefined],
      registrationNumber: [undefined],
      companyDistrict: [undefined],
      companyMunicipalities: [undefined],
      number: [undefined],
      company: [undefined],
      guarantorGrandParent: [undefined],
      guarantorParent: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipalities: [undefined],
      guarantorWard: [undefined],
      guarantorAge: [undefined],
      name: [undefined],
      amountInNumber: [undefined],
      amountInWord: [undefined],
      creditor: [undefined],
      freight: [undefined],
      self: [undefined],
    });
  }

  fillForm(): void {
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
        this.loanGroup.patchValue(initialInfo, {emitEvent: false});

      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
      });
    }
    this.loanGroup.valueChanges.subscribe((value) => {
      this.loanGroup.patchValue(value, {emitEvent: false});
    });
  }

  submit(): void {
    this.spinner = true;
    this.customerOfferLetter.docStatus = DocStatus.PENDING;
    const customerLoan = new LoanDataHolder();
    customerLoan.id = this.customerId;
    this.customerOfferLetter.customerLoan = customerLoan;
    if (this.existingOfferLetter) {
      this.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
        if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
          offerLetterPath.initialInformation = JSON.stringify(this.loanGroup.value);
        }
      });
    } else {
      const offerLetter = new OfferLetter();
      offerLetter.id = this.offerLetterTypeId;
      const customerOfferLetterPathArray = this.customerOfferLetter.customerOfferLetterPath ?
          this.customerOfferLetter.customerOfferLetterPath : [];
      const customerOfferLetterPath = new CustomerOfferLetterPath();
      customerOfferLetterPath.offerLetter = offerLetter;
      customerOfferLetterPath.initialInformation = JSON.stringify(this.loanGroup.value);
      customerOfferLetterPathArray.push(customerOfferLetterPath);
      this.customerOfferLetter.customerOfferLetterPath = customerOfferLetterPathArray;
    }

    this.customerOfferLetterService.save(this.customerOfferLetter).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Dhristi-Bhandak Offer Letter'));
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
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save  Dhristi-Bhandak Offer Letter'));
      this.spinner = false;
    });
  }
}
