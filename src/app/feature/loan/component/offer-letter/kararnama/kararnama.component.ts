import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CustomerOfferLetterService} from '../../../service/customer-offer-letter.service';
import {ToastService} from '../../../../../@core/utils';
import {DocStatus} from '../../../model/docStatus';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {CustomerOfferLetterPath} from '../../../model/customer-offer-letter-path';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {OfferLetterConst} from '../model/offer-letter-const';

@Component({
    selector: 'app-kararnama',
    templateUrl: './kararnama.component.html',
    styleUrls: ['./kararnama.component.scss']
})
export class KararnamaComponent implements OnInit {

    spinner = false;
    form: FormGroup;
    existingKaranama;
    initialInfoPrint;
    customerInfo;
    customerDetails = {
      loanAmount: String,
      loanAmountInWord: String,
    };
    customerInformation = {
        grandFatherName: String,
    fatherName: String,
    district: String,
    municipality: String,
    wardNo: String,
    currentDistrict: String,
    currentMunicipality: String,
    currentWardNo: String,
    customerAge: Number,
    customerName: String,
    citizenIssuedDistrict: String,
    citizenshipIssuedDate: String,
    citizenshipNo: String,
     ministryName: String,
     departmentName: String,
     governmentOfficeName: String,
    registrationDate: String,
     registrationNo: String,
     registrationDistrict: String,
     registrationMunicipality: String,
     registrationWardNo: String,
     companyName: String,
    authorizedPerson: String,
    authorizedPersonDistrict: String,
    authorizedPersonWardNo: String,
    authorizedPersonAge: String,
    authorizedPersonName: String,
    authorizedCitizenIssuedDistrict: String,
    authorizedPersonCitizenIssuedDate: String,
    authorizedPersonCitizenNo: String,
    };
    customerData;
    customers;
    application;
    @Input() loanDataHolder: LoanDataHolder;
    customerOfferLetter: CustomerOfferLetter;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;
    offerLetterConst = OfferLetterConst;
    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private customerOfferLetterService: CustomerOfferLetterService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.customerData = JSON.parse(this.loanDataHolder.nepaliTemplates[0].data);
        this.customers = JSON.parse(this.loanDataHolder.nepaliTemplates[2].data);
        this.application = JSON.parse(this.loanDataHolder.nepaliTemplates[3].data);
        this.customerInfo =  JSON.parse(this.loanDataHolder.customerInfo.nepaliDetail);
        this.buildForm();
        this.fillForm();
        this.setCustomer();
    }

    removeCustomerDetail(index: number): void {
        (this.form.get('customerDetail') as FormArray).removeAt(index);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            authorityPerson: [undefined],
            customerDetail: this.formBuilder.array([]),
            vehicleOwnerName: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            loanInterestRate: [undefined],
            loanMonthlyTenure: [undefined],
            loanMonthlyTenureInWord: [undefined],
            loanMonthlyTenureDate: [undefined],
            loanTenureYear: [undefined],
            compensationPercent: [undefined],
            advancePaymentPercent: [undefined],
            mortgagesName: [undefined],
            mortgagesLandDistrict: [undefined],
            mortgagesLandMunicipality: [undefined],
            mortgagesLandWardNo: [undefined],
            mortgagesLandNo: [undefined],
            mortgagesLandArea: [undefined],
            licenseChangeCompensation: [undefined],
            licenseChangeCompensationWord: [undefined],
        });
    }

    addCustomerDetail() {
        (this.form.get('customerDetail') as FormArray).push(
            this.formBuilder.group({
                grandFatherName: [undefined],
                fatherName: [undefined],
                district: [undefined],
                municipality: [undefined],
                wardNo: [undefined],
                currentDistrict: [undefined],
                currentMunicipality: [undefined],
                currentWardNo: [undefined],
                customerAge: [undefined],
                customerName: [undefined],
                citizenIssuedDistrict: [undefined],
                citizenshipNo: [undefined],
                citizenShipIssuedDate: [undefined],
                ministryName: [undefined],
                departmentName: [undefined],
                governmentOfficeName: [undefined],
                registrationDate: [undefined],
                registrationNo: [undefined],
                registrationDistrict: [undefined],
                registrationMunicipality: [undefined],
                registrationWardNo: [undefined],
                companyName: [undefined],
                authorizedPerson: [undefined],
                authorizedPersonDistrict: [undefined],
                authorizedPersonWardNo: [undefined],
                authorizedPersonAge: [undefined],
                authorizedPersonName: [undefined],
                authorizedCitizenIssuedDistrict: [undefined],
                authorizedPersonCitizenIssuedDate: [undefined],
                authorizedPersonCitizenNo: [undefined]
            })
        );

    }

    onSubmit(): void {
        this.spinner = true;
        this.customerOfferLetter.docStatus = DocStatus.PENDING;
        const customerLoan = new LoanDataHolder();
        customerLoan.id = this.customerId;
        this.customerOfferLetter.customerLoan = customerLoan;
        if (this.existingKaranama) {
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
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Kararnama Letter'));
            this.spinner = false;
        });
    }

    fillForm(): void {
        if (this.loanDataHolder.customerOfferLetter) {
            this.loanDataHolder.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
                if (offerLetterPath.offerLetter.id === this.offerLetterTypeId) {
                    this.existingKaranama = true;
                }
            });
        }
        if (!this.existingKaranama) {
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
                        this.setCustomerDetail( {
                            grandFatherName: [data.grandFatherName],
                            fatherName: [data.fatherName],
                            district: [data.district],
                            municipality: [data.municipality],
                            wardNo: [data.wardNo],
                            currentDistrict: [data.currentDistrict],
                            currentMunicipality: [data.currentMunicipality],
                            currentWardNo: [data.currentWardNo],
                            customerAge: [data.customerAge],
                            customerName: [data.customerName],
                            citizenIssuedDistrict: [data.citizenIssuedDistrict],
                            citizenshipNo: [data.citizenshipNo],
                            citizenShipIssuedDate: [data.citizenShipIssuedDate],
                            ministryName: [data.ministryName],
                            departmentName: [data.departmentName],
                            governmentOfficeName: [data.governmentOfficeName],
                            registrationDate: [data.registrationDate],
                            registrationNo: [data.registrationNo],
                            registrationDistrict: [data.registrationDistrict],
                            registrationMunicipality: [data.registrationMunicipality],
                            registrationWardNo: [data.registrationWardNo],
                            companyName: [data.companyName],
                            authorizedPerson: [data.authorizedPerson],
                            authorizedPersonDistrict: [data.authorizedPersonDistrict],
                            authorizedPersonWardNo: [data.authorizedPersonWardNo],
                            authorizedPersonAge: [data.authorizedPersonAge],
                            authorizedPersonName: [data.authorizedPersonName],
                            authorizedCitizenIssuedDistrict: [data.authorizedCitizenIssuedDistrict],
                            authorizedPersonCitizenIssuedDate: [data.authorizedPersonCitizenIssuedDate],
                            authorizedPersonCitizenNo: [data.authorizedPersonCitizenNo],
                        })
                    );
                });
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Offer Letter'));
            });
        }

    }

    setCustomer() {
        const date = new Date(this.customerInfo.dob);
        const datepick = date.getFullYear();
        const currentdate = new Date(Date.now()).getFullYear();
        this.customerInformation.customerName = this.customerInfo.customerName;
        this.customerInformation.district = this.customerInfo.district;
        this.customerInformation.municipality = this.customerInfo.municipalities;
        this.customerInformation.wardNo = this.customerInfo.wardNumber;
        this.customerInformation.fatherName = this.customers.fatherName;
        this.customerInformation.grandFatherName = this.customers.grandfatherName;
        this.customerInformation.citizenIssuedDistrict = this.customers.citizenshipIssuedDistrict;
        this.customerInformation.citizenshipIssuedDate = this.customerInfo.citizenshipIssuedDate;
        this.customerInformation.citizenshipNo = this.customerInfo.citizenshipNumber;
        this.customerInformation.registrationDate = this.customers.businessRegdDate;
        this.customerInformation.customerAge = currentdate - datepick;
        this.customerInformation.currentDistrict = this.application.tempDistrict;
        this.customerInformation.currentMunicipality = this.application.tempMunicipality;
        this.customerInformation.currentWardNo = this.application.tempWardNo;
        this.customerDetails.loanAmount = this.customerData.loanAmount;
        this.customerDetails.loanAmountInWord = this.customerData.loanAmountInWord;
        this.form.valueChanges.subscribe(() => {
            this.form.patchValue(this.customerDetails, {emitEvent: false});
        });
        this.setCustomerDetail(this.customerInformation);
    }

      setCustomerDetail(data): FormGroup {
          // (this.form.get('customerDetail') as FormArray).push(
              return this.formBuilder.group({
                     grandFatherName: [data.grandFatherName],
                     fatherName: [data.fatherName],
                     district: [data.district],
                     municipality: [data.municipality],
                     wardNo: [data.wardNo],
                     currentDistrict: [data.currentDistrict],
                     currentMunicipality: [data.currentMunicipality],
                     currentWardNo: [data.currentWardNo],
                     customerAge: [data.customerAge],
                     customerName: [data.customerName],
                     citizenIssuedDistrict: [data.citizenIssuedDistrict],
                     citizenshipNo: [data.citizenshipNo],
                     citizenShipIssuedDate: [data.citizenshipIssuedDate],
                     ministryName: [data.ministryName],
                     departmentName: [data.departmentName],
                     governmentOfficeName: [data.governmentOfficeName],
                     registrationDate: [data.registrationDate],
                     registrationNo: [undefined],
                     registrationDistrict: [undefined],
                     registrationMunicipality: [undefined],
                     registrationWardNo: [undefined],
                     companyName: [undefined],
                     authorizedPerson: [undefined],
                     authorizedPersonDistrict: [undefined],
                     authorizedPersonWardNo: [undefined],
                     authorizedPersonAge: [undefined],
                     authorizedPersonName: [undefined],
                     authorizedCitizenIssuedDistrict: [undefined],
                     authorizedPersonCitizenIssuedDate: [undefined],
                     authorizedPersonCitizenNo: [undefined]
                 });
      // );
      }


}
