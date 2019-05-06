import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerDataService} from '../../service/customer-data.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-customer-form',
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit, DoCheck {

    currentId: number;
    finalId: number;
    customerACOpeningForm: FormGroup;

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
        private customerDataService: CustomerDataService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.finalId = this.customerDataService.totalNavsCount;
        this.buildACOpeningForm();
    }

    ngDoCheck(): void {
        this.currentId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        if (this.currentId > this.finalId || this.currentId < 1) {
            this.router.navigate(['customer/open/1']);
        }
        console.log(this.customerACOpeningForm.value);
        console.log(this.customerACOpeningForm.status);
    }

    buildACOpeningForm() {
        this.customerACOpeningForm = this.formBuilder.group(
            {
                bankBranch: ['Branch 1', Validators.required],
                existingAccountRadio: [undefined, Validators.required],
                existingAccountNumber: [undefined],
                accountTypeRadio: [undefined, Validators.required],
                otherAccountName: [undefined],
                accountCurrency: ['NPR', Validators.required],
                jointAccountRadio: [undefined, Validators.required],
                nomineeRadio: [undefined, Validators.required],
                personalTitle: ['Mr.', Validators.required],
                personalFirstName: [undefined, Validators.required],
                personalMiddleName: [undefined],
                personalLastName: [undefined, Validators.required],
                personalMaritalStatusRadio: [undefined, Validators.required],
                otherMaritalStatus: [undefined],
                personalGenderRadio: [undefined, Validators.required],
                otherPersonalGender: [undefined],
                personalPurposeOfAccount: [undefined, Validators.required],
                otherPurposeOfAccount: [undefined],
                personalEducationalQualification: [undefined],
                qualificationOtherValue: [undefined],
                personalPermanentHouseNo: [undefined, Validators.required],
                personalPermanentStreet: [undefined, Validators.required],
                personalPermanentWard: [undefined, Validators.required],
                personalPermanentMunicipalityOrVDC: [undefined, Validators.required],
                personalPermanentProvince: [undefined, Validators.required],
                personalPermanentDistrict: [undefined, Validators.required],
                personalPermanentZone: [undefined, Validators.required],
                personalPresentHouseNo: [undefined, Validators.required],
                personalPresentStreet: [undefined, Validators.required],
                personalPresentWard: [undefined, Validators.required],
                personalPresentMunicipalityOrVDC: [undefined, Validators.required],
                personalPresentProvince: [undefined, Validators.required],
                personalPresentDistrict: [undefined, Validators.required],
                personalPresentZone: [undefined, Validators.required],
                personalLandlordName: [undefined],
                personalLandlordContact: [undefined],
                personalResidentialContact: [undefined],
                personalOfficeContact: [undefined],
                personalMobileContact: [undefined],
                personalEmail: [undefined],
                personalSpouseName: [undefined, Validators.required],
                personalFatherName: [undefined, Validators.required],
                personalMotherName: [undefined, Validators.required],
                personalGrandFatherName: [undefined, Validators.required],
                personalGrandMotherName: [undefined, Validators.required],
                personalSonName: [undefined, Validators.required],
                personalDaughterName: [undefined, Validators.required],
                personalDaughterInLawName: [undefined, Validators.required],
                personalFatherInLawName: [undefined, Validators.required],
                personalMotherInLawName: [undefined, Validators.required],
                personalPAN: [undefined],
                personalNationality: ['Nepal', Validators.required],
                personalDOB: [undefined, Validators.required],
                personalCitizenshipNumber: [undefined],
                personalCitizenshipIssueAddress: [undefined],
                personalCitizenshipIssueDate: [undefined],
                personalPassportNumber: [undefined],
                personalPassportIssueAddress: [undefined],
                personalPassportIssueDate: [undefined],
                personalPassportExpiryDate: [undefined],
                employmentDetailRadio: [undefined, Validators.required],
                employmentDetailSalariedRadio: [undefined, Validators.required],
                employmentDetailSalariedOthersValue: [undefined, Validators.required],
                employmentDetailSelfRadio: [undefined, Validators.required],
                employmentDetailSelfOthersValue: [undefined],
                occupationOrganizationName: [undefined],
                occupationOrganizationAddress: [undefined],
                occupationOrganizationTel: [undefined],
                occupationOrganizationDesignation: [undefined],
                occupationOrganizationNature: [undefined],
                occupationOrganizationEstimatedAnnualIncome: [undefined],
                occupationOtherIncomeSource: [undefined],
                occupationExpectedAnnualTurnover: [undefined],
                occupationEstimatedTransaction: [undefined],
                otherBankAccount: [undefined],
                otherBankAccountValue: [undefined]
            }
        );
    }

}
