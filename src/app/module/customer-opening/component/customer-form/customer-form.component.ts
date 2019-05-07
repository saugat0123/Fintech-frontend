import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerDataService} from '../../service/customer-data.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

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
                personalPurposeOfAccount: [undefined, Validators.required],
                otherPurposeOfAccount: [undefined],
                accountTypeRadio: [undefined, Validators.required],
                otherAccountName: [undefined],
                accountCurrency: ['NPR', Validators.required],
                jointAccountRadio: [undefined, Validators.required],
                nomineeRadio: [undefined, Validators.required],
                applicantsDetail: this.formBuilder.array([
                    this.applicantDetailFormGroup()
                ]),
                employmentDetailRadio: [undefined, Validators.required],
                employmentDetailSalariedRadio: [undefined, Validators.required],
                employmentDetailSalariedOthersValue: [undefined, Validators.required],
                employmentDetailSelfRadio: [undefined, Validators.required],
                employmentDetailSelfOthersValue: [undefined],
                occupationDetails: this.formBuilder.array([
                    this.occupationalDetailsFormGroup()
                ]),
                occupationOtherIncomeSource: [undefined],
                occupationExpectedAnnualTurnover: [undefined],
                occupationEstimatedTransaction: [undefined],
                otherBankAccount: [undefined],
                otherBankAccountValue: [undefined],
                declarationPepRadio: [undefined, Validators.required],
                declarationPepYesName: [undefined],
                declarationPepYesRelationship: [undefined],
                declarationBeneficialRadio: [undefined, Validators.required],
                declarationBeneficialYesName: [undefined],
                declarationBeneficialYesRelationship: [undefined],
                declarationCrimeRadio: [undefined, Validators.required],
                declarationCrimeYesValue: [undefined],
                declarationResidentialRadio: [undefined],
                declarationResidentialYesRadio: [undefined],
                fatcaUSResident: [undefined, Validators.required],
                fatcaUSCitizen: [undefined, Validators.required],
                fatcaUSPermanent: [undefined, Validators.required],
                serviceAccountStatementRadio: [undefined, Validators.required],
                serviceAccountStatementFrequencyRadio: [undefined],
                serviceAccountStatementDeliveryRadio: [undefined],
                serviceDebitCardRadio: [undefined, Validators.required],
                serviceDebitCardTypeRadio: [undefined],
                serviceDebitCardTypeOtherValue: [undefined],
                serviceInternetBankingRadio: [undefined, Validators.required],
                serviceMobileBankingRadio: [undefined, Validators.required]
            }
        );
    }

    occupationalDetailsFormGroup() {
        return this.formBuilder.group(
            {
                occupationOrganizationName: [undefined],
                occupationOrganizationAddress: [undefined],
                occupationOrganizationTel: [undefined],
                occupationOrganizationDesignation: [undefined],
                occupationOrganizationNature: [undefined],
                occupationOrganizationEstimatedAnnualIncome: [undefined],
            }
        );
    }

    addOccupationalDetail() {
        (<FormArray>this.customerACOpeningForm.get('occupationDetails')).push(this.occupationalDetailsFormGroup());
    }

    removeOccupationalDetail(index: number) {
        (<FormArray>this.customerACOpeningForm.get('occupationDetails')).removeAt(index);
    }

    applicantDetailFormGroup() {
        return this.formBuilder.group({
            personalTitle: ['Mr.', Validators.required],
            personalFirstName: [undefined, Validators.required],
            personalMiddleName: [undefined],
            personalLastName: [undefined, Validators.required],
            personalMaritalStatusRadio: [undefined, Validators.required],
            otherMaritalStatus: [undefined],
            personalGenderRadio: [undefined, Validators.required],
            otherPersonalGender: [undefined],
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
            personalPassportExpiryDate: [undefined]
        });
    }

    addApplicant() {
        (<FormArray>this.customerACOpeningForm.get('applicantsDetail')).push(this.applicantDetailFormGroup());
    }

    removeApplicant(index: number) {
        (<FormArray>this.customerACOpeningForm.get('applicantsDetail')).removeAt(index);
    }

}
