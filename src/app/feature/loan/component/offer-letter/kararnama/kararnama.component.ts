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
        this.buildForm();
        this.fillForm();
    }

    removeCustomerDetail(index) {
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
                        this.formBuilder.group({
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
}
