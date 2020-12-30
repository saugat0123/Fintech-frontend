import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {ExcelOfferLetterConst} from '../excel-offer-letter-const';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {CustomerOfferLetterPath} from '../../../../loan/model/customer-offer-letter-path';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {DocStatus} from '../../../../loan/model/docStatus';

@Component({
  selector: 'app-continuation-deed',
  templateUrl: './continuation-deed.component.html',
  styleUrls: ['./continuation-deed.component.scss']
})
export class ContinuationDeedComponent implements OnInit {

  continuationdeed: FormGroup;
  spinner = false;
  existingOfferLetter = false;
  @Input() loanDataHolder: LoanDataHolder;
  initialInfoPrint;
  customerOfferLetter: CustomerOfferLetter;
  @Input() customerId: number;
  @Input() offerLetterTypeId: number;
  offerLetterConst = ExcelOfferLetterConst;


  constructor(private formBuilder: FormBuilder,
              private customerOfferLetterService: CustomerOfferLetterService,
              private toastService: ToastService,
              private router: Router) {
  }

  ngOnInit() {
    console.log(this.continuationdeed);
    this.buildForm();
    this.fillForm();
  }

  buildForm() {
    this.continuationdeed = this.formBuilder.group({
      borrower: [undefined],
      name: [undefined],
      amount: [undefined],
      amountinWord: [undefined],
      date: [undefined],
      date2: [undefined],
      address: [undefined],
      branch: [undefined]
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
        this.continuationdeed.patchValue(initialInfo, {emitEvent: false});

      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
      });
    }
    this.continuationdeed.valueChanges.subscribe((value) => {
      this.continuationdeed.patchValue(value, {emitEvent: false});
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
          offerLetterPath.initialInformation = JSON.stringify(this.continuationdeed.value);
        }
      });
    } else {
      const offerLetter = new OfferLetter();
      offerLetter.id = this.offerLetterTypeId;
      const customerOfferLetterPathArray = this.customerOfferLetter.customerOfferLetterPath ?
          this.customerOfferLetter.customerOfferLetterPath : [];
      const customerOfferLetterPath = new CustomerOfferLetterPath();
      customerOfferLetterPath.offerLetter = offerLetter;
      customerOfferLetterPath.initialInformation = JSON.stringify(this.continuationdeed.value);
      customerOfferLetterPathArray.push(customerOfferLetterPath);
      this.customerOfferLetter.customerOfferLetterPath = customerOfferLetterPathArray;
    }

    this.customerOfferLetterService.save(this.customerOfferLetter).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Continuation Deed'));
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
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save  Continuation Deed'));
      this.spinner = false;
    });
  }


}
