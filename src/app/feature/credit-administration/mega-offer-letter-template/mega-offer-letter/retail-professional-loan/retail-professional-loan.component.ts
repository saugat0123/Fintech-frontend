import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {NepaliTemplateDataHolder} from '../../../../loan/model/nepali-template-data-holder';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {DocStatus} from '../../../../loan/model/docStatus';
import {CustomerOfferLetterPath} from '../../../../loan/model/customer-offer-letter-path';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';

@Component({
  selector: 'app-retail-professional-loan',
  templateUrl: './retail-professional-loan.component.html',
  styleUrls: ['./retail-professional-loan.component.scss']
})
export class RetailProfessionalLoanComponent implements OnInit {
  @Input() nepaliTemplates: NepaliTemplateDataHolder[];
  finalData: string;
  retailProfessionalLoan: FormGroup;
  @Input() loanDataHolder: LoanDataHolder;
  customerOfferLetter: CustomerOfferLetter;
  @Input() customerId: number;
  offerLetterConst = MegaOfferLetterConst;
  existingOfferLetter = false;
  spinner = false;
  initialInfoPrint;
  @Input() offerLetterTypeId: number;

  constructor(private formBuilder: FormBuilder,
              private customerOfferLetterService: CustomerOfferLetterService,
              private toastService: ToastService,
              private router: Router
              ) { }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }
  buildForm() {
    this.retailProfessionalLoan = this.formBuilder.group({
      borrowerName: [undefined],
      loanAmount: [undefined],
      vdc: [undefined],
      ward: [undefined],
      district: [undefined],
      currentVdc: [undefined],
      currentWard: [undefined],
      currentDistrict: [undefined],
      rate: [undefined],
      aadharRate: [undefined],
      premiumRate: [undefined],
      timePeriod: [undefined],
      noOfInstallments: [undefined],
      emiAmount: [undefined],
      mobileNo: [undefined],
      chargeAmount: [undefined],
      gurantorName: [undefined],
      loanOfficer1: [undefined],
      loanOfficer2: [undefined],
      amountInWords: [undefined],
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
        this.retailProfessionalLoan.patchValue(initialInfo, {emitEvent: false});

      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
      });
    }
    this.retailProfessionalLoan.valueChanges.subscribe((value) => {
      this.retailProfessionalLoan.patchValue(value, {emitEvent: false});
    });
  }



  onSubmit(): void {
    this.spinner = true;
    this.customerOfferLetter.docStatus = DocStatus.PENDING;
    const customerLoan = new LoanDataHolder();
    customerLoan.id = this.customerId;
    this.customerOfferLetter.customerLoan = customerLoan;
    if (this.existingOfferLetter) {
      this.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
        if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
          offerLetterPath.initialInformation = JSON.stringify(this.retailProfessionalLoan.value);
        }
      });
    } else {
      const offerLetter = new OfferLetter();
      offerLetter.id = this.offerLetterTypeId;
      const customerOfferLetterPathArray = this.customerOfferLetter.customerOfferLetterPath ?
          this.customerOfferLetter.customerOfferLetterPath : [];
      const customerOfferLetterPath = new CustomerOfferLetterPath();
      customerOfferLetterPath.offerLetter = offerLetter;
      customerOfferLetterPath.initialInformation = JSON.stringify(this.retailProfessionalLoan.value);
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
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Birth Mark Offer Letter'));
      this.spinner = false;
    });
  }

}
