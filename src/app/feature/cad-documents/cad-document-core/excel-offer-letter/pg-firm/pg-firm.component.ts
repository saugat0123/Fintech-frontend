import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {DocStatus} from '../../../../loan/model/docStatus';
import {CustomerOfferLetterPath} from '../../../../loan/model/customer-offer-letter-path';
import {ExcelOfferLetterConst} from '../excel-offer-letter-const';

@Component({
  selector: 'app-pg-firm',
  templateUrl: './pg-firm.component.html',
  styleUrls: ['./pg-firm.component.scss']
})
export class PgFirmComponent implements OnInit {
  pgfirm: FormGroup;
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
    console.log(this.pgfirm);
    this.buildForm();
    this.fillForm();
  }

  buildForm() {
    this.pgfirm = this.formBuilder.group({
      address: [undefined],
      name: [undefined],
      amount: [undefined],
      amountinWord: [undefined],
      date: [undefined],
      date2: [undefined],
      headbranch: [undefined],
      officeaddress: [undefined],
      number: [undefined],
      district: [undefined],
      municipalityvdc: [undefined],
      wardnumber: [undefined],
      district2: [undefined],
      municipalityvdc2: [undefined],
      wardnumber2: [undefined],
      name2: [undefined],
      sanchalak: [undefined],
      grandchildren: [undefined],
      children: [undefined],
      wife: [undefined],
      district3: [undefined],
      municipalityvdc3: [undefined],
      wardnumber3: [undefined],
      district4: [undefined],
      municipalityvdc4: [undefined],
      wardnumber4: [undefined],
      date3: [undefined],
      number2: [undefined],
      age: [undefined],
      name3: [undefined],
      reason: [undefined],
      paper: [undefined],
      patra: [undefined],
      share: [undefined],
      share2: [undefined],
      banknameform1: [undefined],
      rasidnoform1: [undefined],
      jarimitiform1: [undefined],
      amountform1: [undefined],
      interestrateform1: [undefined],
      bhuktanimitiform1: [undefined],
      remarkform1: [undefined],
      companynameform2: [undefined],
      shareholdernoform2: [undefined],
      fromform2: [undefined],
      toform2: [undefined],
      noofsharesform2: [undefined],
      amountform2: [undefined],
      remarkform2: [undefined],
      typeofpaperform3: [undefined],
      jarigarnenikayaform3: [undefined],
      krasanform3: [undefined],
      amountform3: [undefined],
      startdateform3: [undefined],
      bhuktanimitiform3: [undefined],
      interestrateform3: [undefined],
      remarkform3: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      roj: [undefined],
      shubham: [undefined],
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
        this.pgfirm.patchValue(initialInfo, {emitEvent: false});

      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
      });
    }
    this.pgfirm.valueChanges.subscribe((value) => {
      this.pgfirm.patchValue(value, {emitEvent: false});
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
          offerLetterPath.initialInformation = JSON.stringify(this.pgfirm.value);
        }
      });
    } else {
      const offerLetter = new OfferLetter();
      offerLetter.id = this.offerLetterTypeId;
      const customerOfferLetterPathArray = this.customerOfferLetter.customerOfferLetterPath ?
          this.customerOfferLetter.customerOfferLetterPath : [];
      const customerOfferLetterPath = new CustomerOfferLetterPath();
      customerOfferLetterPath.offerLetter = offerLetter;
      customerOfferLetterPath.initialInformation = JSON.stringify(this.pgfirm.value);
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




