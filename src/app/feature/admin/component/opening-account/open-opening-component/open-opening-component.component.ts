import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {OpeningForm} from '../../../modal/openingForm';
import {OpeningCustomerRelative} from '../../../modal/openingCustomerRelative';
import {OpeningOccupationalDetails} from '../../../modal/openingOccupationalDetails';
import {OpeningCustomer} from '../../../modal/openingCustomer';

@Component({
    selector: 'app-open-opening-component',
    templateUrl: './open-opening-component.component.html',
    styleUrls: ['./open-opening-component.component.css']
})
export class OpenOpeningComponentComponent implements OnInit {

    openingAccount: FormGroup;
    openingForm: OpeningForm = new OpeningForm();

    constructor(
        private formBuilder: FormBuilder,
        private dataService: CommonDataService
    ) {
    }

    ngOnInit() {
        this.openingForm = this.dataService.getOpeningForm();
        console.log('opening Form', this.openingForm);
        this.openingAccount = this.formBuilder.group({
            // OpeningForm
            branch: [undefined],
            requestedDate: [undefined],
            // Opening Account
            accountType: [undefined],
            proposeOfAccount: [undefined],
            haveExistingAccount: [undefined],
            existingAccountNumber: [undefined],
            accountCurrency: [undefined],
            jointAccountRadio: [undefined],
            applicantDetail: this.formBuilder.array([
                this.applicantDetailFormGroup()
            ]),
            annualTurnOver: [undefined],
            annualTransaction: [undefined],
            // Nominee
            nomineeName: [undefined],
            relationWithNominee: [undefined],
            nomineeRadio: [undefined],
            nomineeDateOfBirth: [undefined],
            nomineePermanentAddress: [undefined],
            nomineePresentAddress: [undefined],
            nomineeCitizenshipNumber: [undefined],
            nomineeCitizenshipIssueAddress: [undefined],
            // Beneficiary
            beneficiaryRadio: [undefined],
            beneficiaryName: [undefined],
            relationWithBeneficiary: [undefined],
            beneficiaryDateOfBirth: [undefined],
            beneficiaryAddress: [undefined],
            beneficiaryPresentAddress: [undefined],
            beneficiaryCitizenshipNumber: [undefined],
            beneficiaryCitizenshipIssueAddress: [undefined],
            // Account Services
            accountStatementRadio: [undefined],
            accountStatementFrequencyRadio: [undefined],
            statementMode: [undefined],
            debitCardRadio: [undefined],
            internetBankingRadio: [undefined],
            mobileBankingRadio: [undefined]
        });
        if (this.openingForm.id !== undefined) {
            this.openingAccount = this.formBuilder.group({
                // OpeningForm
                branch: this.openingForm.branch.name,
                requestedDate: this.openingForm.requestedDate,
                // Opening Account
                accountType: this.openingForm.openingAccount.accountType,
                proposeOfAccount: this.openingForm.openingAccount.purposeOfAccount,
                haveExistingAccount: this.openingForm.openingAccount.haveExistingAccountNo,
                existingAccountNumber: this.openingForm.openingAccount.existingAccountNo,
                accountCurrency: this.openingForm.openingAccount.currency,
                jointAccountRadio: this.openingForm.openingAccount.haveJoint + '',
                applicantDetail: this.formBuilder.array([
                    this.applicantDetailFormGroup()
                ]),
                annualTurnOver: this.openingForm.openingAccount.annualTurnover,
                annualTransaction: this.openingForm.openingAccount.annualTransaction,
                // Nominee
                nomineeRadio: this.openingForm.openingAccount.haveNominee + '',
                nomineeName: this.openingForm.openingAccount.nominee.fullName,
                relationWithNominee: this.openingForm.openingAccount.nominee.relationToMe,
                nomineeDateOfBirth: this.openingForm.openingAccount.nominee.dateOfBirth,
                nomineePermanentAddress: this.openingForm.openingAccount.nominee.permanentAddress,
                nomineePresentAddress: this.openingForm.openingAccount.nominee.temporaryAddress,
                nomineeCitizenshipNumber: this.openingForm.openingAccount.nominee.citizenNumber,
                nomineeCitizenshipIssueAddress: this.openingForm.openingAccount.nominee.issuedPlace,
                // Beneficiary
                beneficiaryRadio: this.openingForm.openingAccount.haveBeneficiary + '',
                beneficiaryName: this.openingForm.openingAccount.beneficiary.fullName,
                relationWithBeneficiary: this.openingForm.openingAccount.beneficiary.relationToMe,
                beneficiaryDateOfBirth: this.openingForm.openingAccount.beneficiary.dateOfBirth,
                beneficiaryAddress: this.openingForm.openingAccount.beneficiary.permanentAddress,
                beneficiaryPresentAddress: this.openingForm.openingAccount.beneficiary.temporaryAddress,
                beneficiaryCitizenshipNumber: this.openingForm.openingAccount.beneficiary.citizenNumber,
                beneficiaryCitizenshipIssueAddress: this.openingForm.openingAccount.beneficiary.issuedPlace,
                // Account Services
                accountStatementRadio: this.openingForm.openingAccount.statement + '',
                accountStatementFrequencyRadio: this.openingForm.openingAccount.statementFrequency + '',
                statementMode: this.openingForm.openingAccount.statementMode + '',
                debitCardRadio: this.openingForm.openingAccount.debitCard + '',
                internetBankingRadio: this.openingForm.openingAccount.internetBanking + '',
                mobileBankingRadio: this.openingForm.openingAccount.mobileBanking + '',
            });
            this.openingAccount.setControl('applicantDetail', this.setApplicantDetailFormGroup
            (this.openingForm.openingAccount.openingCustomers));
        }

    }

    applicantDetailFormGroup(): FormGroup {
        return this.formBuilder.group({
            // Opening Customer
            customerTitle: [undefined],
            customerFirstName: [undefined],
            customerMiddleName: [undefined],
            customerLastName: [undefined],
            applicantMaritalStatusRadio: [undefined],
            applicantGenderRadio: [undefined],
            applicantEducationalQualification: [undefined],
            applicantPermanentProvince: [undefined],
            applicantPermanentDistrict: [undefined],
            applicantPermanentMunicipalityOrVDC: [undefined],
            applicantPermanentWard: [undefined],
            applicantPermanentStreet: [undefined],
            applicantPermanentHouseNo: [undefined],
            applicantPresentProvince: [undefined],
            applicantPresentDistrict: [undefined],
            applicantPresentMunicipalityOrVDC: [undefined],
            applicantPresentWard: [undefined],
            applicantPresentStreet: [undefined],
            applicantPresentHouseNo: [undefined],
            applicantLandLordName: [undefined],
            applicantLandLordContactNumber: [undefined],
            applicantResidentialContact: [undefined],
            applicantOfficeContact: [undefined],
            applicantMobileContact: [undefined],
            applicantEmail: [undefined],
            applicantRelative: this.formBuilder.array([
                this.applicantRelativeFormGroup()
            ]),
            applicantNationality: [undefined],
            applicantDateOfBirth: [undefined],
            applicantPanNumber: [undefined],
            applicantCitizenNumber: [undefined],
            applicantCitizenIssuedPlace: [undefined],
            applicantCitizenIssuedDate: [undefined],
            applicantPassportNumber: [undefined],
            applicantPassportIssuedPlace: [undefined],
            applicantPassportIssuedDate: [undefined],
            applicantPassportExpireDate: [undefined],
            applicantSalaried: [undefined],
            applicantSelfEmployed: [undefined],
            occupationDetails: this.formBuilder.array([
                this.applicantOccupationDetailsFormGroup()
            ]),
            otherIncomeSource: [undefined],
            isPoliticallyExposed: [undefined],
            pepName: [undefined],
            pepRelationWithApplicant: [undefined],
            isConvictedForCrime: [undefined],
            crimeConvictedFor: [undefined],
            holdResidentialOfForeign: [undefined],
            holdResidentialOfForeignType: [undefined],
            isUsResidentRadio: [undefined],
            isUsCitizenRadio: [undefined],
            isUsGreenCardHolderRadio: [undefined]
        });
    }

    setApplicantDetailFormGroup(applicantList: Array<OpeningCustomer>): FormArray {
        const applicantFormArray = new FormArray([]);
        applicantList.forEach(applicant => {
                const applicantControl = this.formBuilder.group({
                    customerTitle: applicant.title,
                    customerFirstName: applicant.firstName,
                    customerMiddleName: applicant.middleName,
                    customerLastName: applicant.lastName,
                    applicantMaritalStatusRadio: applicant.maritalStatus,
                    applicantGenderRadio: applicant.gender,
                    applicantEducationalQualification: applicant.education,
                    applicantPermanentProvince: applicant.permanentProvince,
                    applicantPermanentDistrict: applicant.permanentDistrict,
                    applicantPermanentMunicipalityOrVDC: applicant.permanentMunicipality,
                    applicantPermanentWard: applicant.permanentWard,
                    applicantPermanentStreet: applicant.permanentStreet,
                    applicantPermanentHouseNo: applicant.permanentHouseNumber,
                    applicantPresentProvince: applicant.presentProvince,
                    applicantPresentDistrict: applicant.presentDistrict,
                    applicantPresentMunicipalityOrVDC: applicant.presentMunicipality,
                    applicantPresentWard: applicant.presentWard,
                    applicantPresentStreet: applicant.presentStreet,
                    applicantPresentHouseNo: applicant.presentHouseNumber,
                    applicantLandLordName: applicant.landLordName,
                    applicantLandLordContactNumber: applicant.landLordContactNo,
                    applicantResidentialContact: applicant.residentialContactNo,
                    applicantOfficeContact: applicant.officeContactNo,
                    applicantMobileContact: applicant.mobileContactNo,
                    applicantEmail: applicant.email,
                    applicantRelative: this.formBuilder.array([
                        this.applicantRelativeFormGroup()
                    ]),
                    applicantNationality: applicant.nationality,
                    applicantDateOfBirth: new Date(applicant.dateOfBirthAD),
                    applicantPanNumber: applicant.panNo,
                    applicantCitizenNumber: applicant.citizenNumber,
                    applicantCitizenIssuedPlace: applicant.citizenIssuedPlace,
                    applicantCitizenIssuedDate: applicant.citizenIssuedDate,
                    applicantPassportNumber: applicant.passportNumber,
                    applicantPassportIssuedPlace: applicant.passportIssuedPlace,
                    applicantPassportIssuedDate: applicant.passportIssuedDate,
                    applicantPassportExpireDate: applicant.passportExpireDate,
                    applicantSalaried: applicant.salariedEmployedWith,
                    applicantSelfEmployed: applicant.selfEmployedWith,
                    occupationDetails: this.formBuilder.array([
                        this.applicantOccupationDetailsFormGroup()
                    ]),
                    otherIncomeSource: applicant.otherSourceOfIncome,
                    isPoliticallyExposed: applicant.exposeToPep + '',
                    pepName: applicant.pepName,
                    pepRelationWithApplicant: applicant.pepRelationToYou,
                    isConvictedForCrime: applicant.convictedOfCrime + '',
                    crimeConvictedFor: applicant.convictedCrime,
                    holdResidentialOfForeign: applicant.residentialPermitOfForeign + '',
                    holdResidentialOfForeignType: applicant.residentialPermitOfForeignType + '',
                    isUsResidentRadio: applicant.usResident + '',
                    isUsCitizenRadio: applicant.usCitizen + '',
                    isUsGreenCardHolderRadio: applicant.greenCardHolder + ''
                });
                applicantControl.setControl('applicantRelative', this.setApplicantRelativeFormGroup
                (applicant.kyc.customerRelatives));
                applicantControl.setControl('occupationDetails', this.setOccupationDetailsFormGroup
                (applicant.kyc.occupationalDetails));
                applicantFormArray.push(applicantControl);
                console.log('date of birth', applicant.dateOfBirthAD);
            }
        );
        return applicantFormArray;
    }

    removeApplicantDetail(index: number) {
        (<FormArray>this.openingAccount.get('applicantDetail')).removeAt(index);
    }


    addApplicantDetail() {
        (<FormArray>this.openingAccount.get('applicantDetail')).push(this.applicantDetailFormGroup());
    }

    applicantRelativeFormGroup(): FormGroup {
        return this.formBuilder.group({
            applicantRelationWith: [undefined],
            applicantRelativeName: [undefined]
        });
    }

    setApplicantRelativeFormGroup(relativeList: Array<OpeningCustomerRelative>): FormArray {
        const relativeFormArray = new FormArray([]);
        relativeList.forEach(relative => {
            relativeFormArray.push(this.formBuilder.group({
                applicantRelationWith: relative.customerRelation,
                applicantRelativeName: relative.customerRelativeName
            }));
        });
        return relativeFormArray;
    }

    removeApplicantRelative(control, relativeIndex: number) {
        control.removeAt(relativeIndex);
    }

    addApplicantRelative(applicantIndex) {
        const control = (<FormArray>this.openingAccount.controls['applicantDetail'])
            .at(applicantIndex).get('applicantRelative') as FormArray;
        control.push(this.applicantRelativeFormGroup());
    }

    applicantOccupationDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            nameOfOrganization: [undefined],
            organizationAddress: [undefined],
            organizationTelephone: [undefined],
            organizationBusiness: [undefined],
            applicantDesignation: [undefined],
            annualIncomeFromOrganization: [undefined]
        });
    }

    setOccupationDetailsFormGroup(occupationList: Array<OpeningOccupationalDetails>): FormArray {
        const occupationFormArray = new FormArray([]);
        occupationList.forEach(occupation => {
            occupationFormArray.push(this.formBuilder.group({
                nameOfOrganization: occupation.nameOfOrganization,
                organizationAddress: occupation.address,
                organizationTelephone: occupation.telNo,
                organizationBusiness: occupation.natureOfBusiness,
                applicantDesignation: occupation.designation,
                annualIncomeFromOrganization: occupation.estimatedAnnualIncome
            }));
        });
        return occupationFormArray;
    }

    removeApplicantOccupationDetails(control, occupationIndex: number) {
        control.removeAt(occupationIndex);
    }

    addApplicantOccupationDetails(applicantIndex) {
        const control = (<FormArray>this.openingAccount.controls['applicantDetail'])
            .at(applicantIndex).get('occupationDetails') as FormArray;
        control.push(this.applicantOccupationDetailsFormGroup());
    }

    onSubmit() {
        // left to do
    }

}
