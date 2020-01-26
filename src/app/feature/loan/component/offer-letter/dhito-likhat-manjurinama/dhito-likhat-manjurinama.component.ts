import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {DocStatus} from '../../../model/docStatus';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {CustomerOfferLetterPath} from '../../../model/customer-offer-letter-path';
import {CustomerOfferLetterService} from '../../../service/customer-offer-letter.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';

@Component({
    selector: 'app-dhito-likhat-manjurinama',
    templateUrl: './dhito-likhat-manjurinama.component.html',
    styleUrls: ['./dhito-likhat-manjurinama.component.scss']
})
export class DhitoLikhatManjurinamaComponent implements OnInit {

    @Input() loanDataHolder: LoanDataHolder;
  customerOfferLetter: CustomerOfferLetter = new CustomerOfferLetter()  ;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;
    dhitoForm: FormGroup;
    existingDhitoForm;
  initialInfoPrint;

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
        this.dhitoForm = this.formBuilder.group({
            customerDetail : this.formBuilder.array([]),
          loanName : [undefined],
          interestRateLoan : [undefined],
          loanTenure : [undefined],
          loanAmount : [undefined],
          loanAmountInWord : [undefined],
          id: [undefined],
          version: [undefined]
        });

    }

    addCustomerDetail() {
        (this.dhitoForm.get('customerDetail') as FormArray).push(
            this.formBuilder.group({
                grandFatherName : [undefined],
                fatherName : [undefined],
                district : [undefined],
                municipality : [undefined],
                wardNo : [undefined],
                currentDistrict: [undefined],
                currentMunicipality : [undefined],
                currentWardNo : [undefined],
                customerAge : [undefined],
                customerName : [undefined],
                citizenshipNo : [undefined],
                citizenIssuedDate : [undefined],
                citizenIssuedDistrict: [undefined]
            })
        );

    }

    removeCustomerDetail(index) {
      (this.dhitoForm.get('customerDetail') as FormArray).removeAt(index);
    }
  onSubmit(): void {/*
    this.spinner = true;*/
    this.customerOfferLetter.docStatus = DocStatus.PENDING;
    const customerLoan = new LoanDataHolder();
    customerLoan.id = this.customerId;
    this.customerOfferLetter.customerLoan = customerLoan;
    if (this.existingDhitoForm) {
      this.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
        if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
          offerLetterPath.initialInformation = JSON.stringify(this.dhitoForm.value);
        }
      });
    } else {
      const offerLetter = new OfferLetter();
      offerLetter.id = this.offerLetterTypeId;
      const customerOfferLetterPathArray = this.customerOfferLetter.customerOfferLetterPath ?
          this.customerOfferLetter.customerOfferLetterPath : [];
      const customerOfferLetterPath = new CustomerOfferLetterPath();
      customerOfferLetterPath.offerLetter = offerLetter;
      customerOfferLetterPath.initialInformation = JSON.stringify(this.dhitoForm.value);
      customerOfferLetterPathArray.push(customerOfferLetterPath);
      this.customerOfferLetter.customerOfferLetterPath = customerOfferLetterPathArray;
    }
    // TODO: Assign Supported Information in OfferLetter
    this.customerOfferLetterService.save(this.customerOfferLetter).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
     /* this.spinner = false;*/
      this.router.navigateByUrl('/home/dashboard').then(value => {
        if (value) {
          this.router.navigate(['/home/loan/offer-letter'], {
            queryParams: {customerId: this.customerId, }
          });
        }
      });
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Birth Mark Offer Letter'));
     /* this.spinner = false;*/
    });
  }


  fillForm(): void {
    if (this.loanDataHolder.customerOfferLetter) {
      this.loanDataHolder.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
        if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
          this.existingDhitoForm = true;
        }
      });
    }
    if (!this.existingDhitoForm) {
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
      this.addCustomerDetail();
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
        this.dhitoForm.patchValue(initialInfo);
        initialInfo.customerDetail.forEach(value => {
          (this.dhitoForm.get('customerDetail') as FormArray).push(
              this.formBuilder.group({
                grandFatherName : [value.grandFatherName],
                fatherName : [value.fatherName],
                district : [value.district],
                municipality : [value.municipality],
                wardNo : [value.wardNo],
                currentDistrict: [value.currentDistrict],
                currentMunicipality : [value.currentMunicipality],
                currentWardNo : [value.currentWardNo],
                customerAge : [value.customerAge],
                customerName : [value.customerName],
                citizenshipNo : [value.citizenshipNo],
                citizenIssuedDate : [value.citizenIssuedDate],
                citizenIssuedDistrict: [value.citizenIssuedDistrict]
              })
          );
        });
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
      });
    }
  }
}
