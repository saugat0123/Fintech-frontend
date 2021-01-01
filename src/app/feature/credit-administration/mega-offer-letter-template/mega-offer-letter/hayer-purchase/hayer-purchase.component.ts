import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {DocStatus} from '../../../../loan/model/docStatus';
import {CustomerOfferLetterPath} from '../../../../loan/model/customer-offer-letter-path';

@Component({
  selector: 'app-hayer-purchase',
  templateUrl: './hayer-purchase.component.html',
  styleUrls: ['./hayer-purchase.component.scss']
})
export class HayerPurchaseComponent implements OnInit {
  hayarPurchase: FormGroup;
  spinner = false;
  existingOfferLetter = false;
  @Input() loanDataHolder: LoanDataHolder;
  initialInfoPrint;
  customerOfferLetter: CustomerOfferLetter;
  @Input() customerId: number;
  @Input() offerLetterTypeId: number;
  offerLetterConst = MegaOfferLetterConst;


  constructor(private formBuilder: FormBuilder,
              private customerOfferLetterService: CustomerOfferLetterService,
              private toastService: ToastService,
              private router: Router) {
  }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  buildForm() {
    this.hayarPurchase = this.formBuilder.group({
      name: [undefined],
      permanentVdcMunicipalities: [undefined],
      permanentWard: [undefined],
      permanentDistrict: [undefined],
      temporaryVdcMunicipalities: [undefined],
      temporaryWard: [undefined],
      temporaryDistrict: [undefined],
      phoneNumber: [undefined],
      amount: [undefined],
      amountInWord: [undefined],
      vehicle: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      presentRate: [undefined],
      month: [undefined],
      totalMonth: [undefined],
      emiAmount: [undefined],
      emiAmountInWord: [undefined],
      emiAmountInWordPaisa: [undefined],
      englishDate: [undefined],
      vatPercent: [undefined],
      serviceAmount: [undefined],
      company: [undefined],
      servicePercentage: [undefined],
      securityCharge: [undefined],
      charge: [undefined],
      guarantor: [undefined],
      addedPercentage: [undefined],
      post1: [undefined],
      post1Name: [undefined],
      post2: [undefined],
      post2Name: [undefined],
      date: [undefined]
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
        this.hayarPurchase.patchValue(initialInfo, {emitEvent: false});

      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
      });
    }
    this.hayarPurchase.valueChanges.subscribe((value) => {
      this.hayarPurchase.patchValue(value, {emitEvent: false});
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
          offerLetterPath.initialInformation = JSON.stringify(this.hayarPurchase.value);
        }
      });
    } else {
      const offerLetter = new OfferLetter();
      offerLetter.id = this.offerLetterTypeId;
      const customerOfferLetterPathArray = this.customerOfferLetter.customerOfferLetterPath ?
          this.customerOfferLetter.customerOfferLetterPath : [];
      const customerOfferLetterPath = new CustomerOfferLetterPath();
      customerOfferLetterPath.offerLetter = offerLetter;
      customerOfferLetterPath.initialInformation = JSON.stringify(this.hayarPurchase.value);
      customerOfferLetterPathArray.push(customerOfferLetterPath);
      this.customerOfferLetter.customerOfferLetterPath = customerOfferLetterPathArray;
    }

    this.customerOfferLetterService.save(this.customerOfferLetter).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Hayer Purchase Offer Letter'));
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
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save  Hayer Purchase Offer Letter'));
      this.spinner = false;
    });
  }
}




