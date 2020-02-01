import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {DocStatus} from '../../../model/docStatus';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {CustomerOfferLetterPath} from '../../../model/customer-offer-letter-path';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Router} from '@angular/router';
import {CustomerOfferLetterService} from '../../../service/customer-offer-letter.service';
import {ToastService} from '../../../../../@core/utils';

@Component({
    selector: 'app-karjatamsuk',
    templateUrl: './karjatamsuk.component.html',
    styleUrls: ['./karjatamsuk.component.scss']
})
export class KarjatamsukComponent implements OnInit {

  spinner = false;
  form: FormGroup;
  existingkarjaLetter;
  initialInfoPrint;
    @Input() loanDataHolder: LoanDataHolder;
    customerOfferLetter: CustomerOfferLetter;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
  private customerOfferLetterService: CustomerOfferLetterService,
  private toastService: ToastService) {
    }

    ngOnInit() {
      this.buildForm();
      this.fillForm();
    }

  onSubmit(): void {
    this.spinner = true;
    this.customerOfferLetter.docStatus = DocStatus.PENDING;
    const customerLoan = new LoanDataHolder();
    customerLoan.id = this.customerId;
    this.customerOfferLetter.customerLoan = customerLoan;
    if (this.existingkarjaLetter) {
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
          this.router.navigate(['/home/loan/offer-letter'], {
            queryParams: {customerId: this.customerId, }
          });
        }
      });
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Karja Tamsuk Letter'));
      this.spinner = false;
    });
  }

    buildForm() {
      this.form = this.formBuilder.group({
        customerDetail : this.formBuilder.array([]),
        letterAppliedDate: undefined,
        letterIssuedDate: undefined,
        loanAmount: undefined,
        loanAmountInWord: undefined,
        loanRate: undefined,
        loanTenure: undefined,
        tenurePaymentRate: undefined,
        monthlyRate: undefined
      });
    }


  addCustomerDetail() {
    (this.form.get('customerDetail') as FormArray).push(
        this.formBuilder.group({
          district : [undefined],
          municipality : [undefined],
          wardNo : [undefined],
          currentDistrict: [undefined],
          currentMunicipality : [undefined],
          currentWardNo : [undefined],
          grandFatherName : [undefined],
          fatherName : [undefined],
          customerAge : [undefined],
          customerName : [undefined],
          citizenIssuedDistrict: [undefined],
          citizenIssuedDate : [undefined],
          citizenshipNo : [undefined],
          ministryName: [undefined],
          departmentName: [undefined],
          governmentOfficeName: [undefined],
          registrationDate: [undefined],
          registrationNo: [undefined],
          registrationDistrict: [undefined],
          registrationMunicipality: [undefined],
          registrationWardNo: [undefined],
          companyName: [undefined],
        })
    );

  }

  removeCustomerDetail(index) {
    (this.form.get('customerDetail') as FormArray).removeAt(index);
  }

  fillForm(): void {
    if (this.loanDataHolder.customerOfferLetter) {
      this.loanDataHolder.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
        if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
          this.existingkarjaLetter = true;
        }
      });
    }
    if (!this.existingkarjaLetter) {
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
        this.form.patchValue(initialInfo);
        initialInfo.customerDetail.forEach(data => {
          (this.form.get('customerDetail') as FormArray).push(
              this.formBuilder.group({
                district : [data.district],
                municipality : [data.municipality],
                wardNo : [data.wardNo],
                currentDistrict: [data.currentDistrict],
                currentMunicipality : [data.currentMunicipality],
                currentWardNo : [data.currentWardNo],
                grandFatherName : [data.grandFatherName],
                fatherName : [data.fatherName],
                customerAge : [data.customerAge],
                customerName : [data.customerName],
                citizenIssuedDistrict: [data.citizenIssuedDistrict],
                citizenIssuedDate : [data.citizenIssuedDate],
                citizenshipNo : [data.citizenshipNo],
                ministryName: [data.ministryName],
                departmentName: [data.departmentName],
                governmentOfficeName: [data.governmentOfficeName],
                registrationDate: [data.registrationDate],
                registrationNo: [data.registrationNo],
                registrationDistrict: [data.registrationDistrict],
                registrationMunicipality: [data.registrationMunicipality],
                registrationWardNo: [data.registrationWardNo],
                companyName: [data.companyName],
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
