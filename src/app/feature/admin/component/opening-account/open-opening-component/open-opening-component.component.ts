import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {OpeningForm} from '../../../modal/openingForm';
import {OpeningCustomerRelative} from '../../../modal/openingCustomerRelative';
import {OpeningOccupationalDetails} from '../../../modal/openingOccupationalDetails';
import {OpeningCustomer} from '../../../modal/openingCustomer';
import {OpeningAccountService} from '../service/opening-account.service';
import {DatePipe} from '@angular/common';
import {OpeningAccount} from '../../../modal/openingAccount';
import {OpeningKyc} from '../../../modal/openingKyc';
import {OpeningBeneficiary} from '../../../modal/openingBeneficiary';
import {OpeningNominee} from '../../../modal/openingNominee';
import {BranchService} from '../../branch/branch.service';
import {Branch} from '../../../modal/branch';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountType} from '../../../modal/accountType';
import {AccountCategory} from '../../../modal/accountCategory';
import {AccountCategoryService} from '../service/account-category.service';
import {AccountTypeService} from '../service/account-type.service';
import {AccountStatus} from '../../../modal/accountStatus';
import {RoleType} from '../../../modal/roleType';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {AccountNumberModalComponent} from '../account-no-modal/account-no-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RemarkModalComponent} from '../remark-modal/remark-modal.component';

@Component({
    selector: 'app-open-opening-component',
    templateUrl: './open-opening-component.component.html',
    styleUrls: ['./open-opening-component.component.css']
})

// todo verify and remove function which is not needed
export class OpenOpeningComponentComponent implements OnInit {
    title: string;
    restUrl = ApiConfig.URL;
    requestedDate: string;
    openingAccount: FormGroup;
    account: OpeningAccount = new OpeningAccount();
    openingForm: OpeningForm = new OpeningForm();
    openingCustomer: OpeningCustomer = new OpeningCustomer();
    openingKyc: OpeningKyc = new OpeningKyc();
    openingBeneficiary: OpeningBeneficiary = new OpeningBeneficiary();
    openingNominee: OpeningNominee = new OpeningNominee();
    openingOccupationalDetails: OpeningOccupationalDetails = new OpeningOccupationalDetails();
    openingCustomerRelative: OpeningCustomerRelative = new OpeningCustomerRelative();
    branchList: Array<Branch> = new Array<Branch>();
    accountPurposeList: Array<AccountCategory> = new Array<AccountCategory>();
    accountTypeList: Array<AccountType> = new Array<AccountType>();
    id = 0;
    isApproval = false;
    showAction = false;
    documents: {
        name: string,
        url: string
    }[] = [];

    constructor(
        private service: OpeningAccountService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private branchService: BranchService,
        private toastService: ToastService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private accountCategoryService: AccountCategoryService,
        private accountTypeService: AccountTypeService,
        private modalService: NgbModal,
    ) {
    }

    getAccountPurpose(accountTypeId: number) {
        this.accountCategoryService.getAccountPurposeByAccountType(accountTypeId).subscribe((response: any) => {
            this.accountPurposeList = response.detail;
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to loan Account Purpose'));
        });
    }

    ngOnInit() {
        this.isApproval = LocalStorageUtil.getStorage().roleType === RoleType.APPROVAL &&
            LocalStorageUtil.getStorage().roleName !== 'admin';
        this.id = Number(this.activatedRoute.snapshot.queryParamMap.get('openingFormId'));
        this.accountTypeService.getAll().subscribe((response: any) => {
            this.accountTypeList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Account Types.'));
        });
        this.accountCategoryService.getAll().subscribe((response: any) => {
            this.accountPurposeList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Account Purposes.'));
        });
        this.branchService.getAll().subscribe((response: any) => {
            this.branchList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error loading Branches.'));
        });
        this.openingAccount = this.formBuilder.group({
            // OpeningForm
            id: [undefined],
            branch: [undefined],
            requestedDate: [undefined],
            // Opening Account
            accountType: [undefined],
            purposeOfAccount: [undefined],
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
            nomineeContactNumber: [undefined],
            nomineeDateOfBirth: [undefined],
            nomineePermanentAddress: [undefined],
            nomineePresentAddress: [undefined],
            nomineeCitizenshipNumber: [undefined],
            nomineeCitizenshipIssueAddress: [undefined],
            // Nominee Relatives
            nomineeFamily: this.formBuilder.array([]),
            // Beneficiary
            beneficiaryRadio: [undefined],
            beneficiaryName: [undefined],
            relationWithBeneficiary: [undefined],
            beneficiaryContactNumber: [undefined],
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
        this.service.detail(this.id).subscribe((response: any) => {
            this.openingForm = response.detail;
            this.showAction = this.isApproval &&
                this.openingForm.status === AccountStatus.name(AccountStatus.NEW_REQUEST);
            this.setOpeningForm(this.openingForm);
            console.log(this.openingAccount);
            const nomineeFamilyArray = (this.openingForm.openingAccount.nominee.nomineeFamily) as Array<OpeningCustomerRelative>;
            this.setNomineeFamily(nomineeFamilyArray);
        });

    }

    setOpeningForm(openingForm: OpeningForm) {
        this.title = openingForm.accountType.name;
        this.requestedDate = this.formatDate(openingForm.requestedDate);
        this.openingAccount = this.formBuilder.group({
            // OpeningForm
            id: openingForm.id,
            branch: openingForm.branch.id,
            requestedDate: this.formatDate(openingForm.requestedDate),
            // Opening Account
            accountType: openingForm.accountType.id,
            purposeOfAccount: openingForm.openingAccount.purposeOfAccount.id,
            accountCurrency: openingForm.openingAccount.currency,
            jointAccountRadio: openingForm.openingAccount.haveJoint + '',
            applicantDetail: this.formBuilder.array([
                this.applicantDetailFormGroup()
            ]),
            annualTurnOver: openingForm.openingAccount.annualTransactionNumber,
            annualTransaction: openingForm.openingAccount.annualTransaction,
            // Nominee
            nomineeRadio: openingForm.openingAccount.haveNominee + '',
            nomineeName: openingForm.openingAccount.nominee.fullName,
            nomineeContactNumber: openingForm.openingAccount.nominee.citizenNumber,
            relationWithNominee: openingForm.openingAccount.nominee.relationToMe,
            nomineeDateOfBirth: this.formatDate(openingForm.openingAccount.nominee.dateOfBirth),
            nomineePermanentAddress: openingForm.openingAccount.nominee.permanentAddress,
            nomineePresentAddress: openingForm.openingAccount.nominee.temporaryAddress,
            nomineeCitizenshipNumber: openingForm.openingAccount.nominee.citizenNumber,
            nomineeCitizenshipIssueAddress: openingForm.openingAccount.nominee.issuedPlace,
            // Nominee Relatives
            nomineeFamily: this.formBuilder.array([]),
            // Beneficiary
            beneficiaryRadio: openingForm.openingAccount.haveBeneficiary + '',
            beneficiaryName: openingForm.openingAccount.beneficiary.fullName,
            relationWithBeneficiary: openingForm.openingAccount.beneficiary.relationToMe,
            beneficiaryContactNumber: openingForm.openingAccount.beneficiary.contactNumber,
            beneficiaryDateOfBirth: this.formatDate(openingForm.openingAccount.beneficiary.dateOfBirth),
            beneficiaryAddress: openingForm.openingAccount.beneficiary.permanentAddress,
            beneficiaryPresentAddress: openingForm.openingAccount.beneficiary.temporaryAddress,
            beneficiaryCitizenshipNumber: openingForm.openingAccount.beneficiary.citizenNumber,
            beneficiaryCitizenshipIssueAddress: openingForm.openingAccount.beneficiary.issuedPlace,
            // Account Services
            accountStatementRadio: openingForm.openingAccount.statement + '',
            accountStatementFrequencyRadio: openingForm.openingAccount.statementFrequency + '',
            statementMode: openingForm.openingAccount.statementMode + '',
            debitCardRadio: openingForm.openingAccount.debitCard + '',
            internetBankingRadio: openingForm.openingAccount.internetBanking + '',
            mobileBankingRadio: openingForm.openingAccount.mobileBanking + '',
        });
        // this.getAccountPurpose(openingForm.accountType.id);
        this.openingAccount.setControl('applicantDetail', this.setApplicantDetailFormGroup
        (this.openingForm.openingAccount.openingCustomers));
        // documents array
        if (!ObjectUtil.isEmpty(openingForm.openingAccount.beneficiary) &&
            !ObjectUtil.isEmpty(openingForm.openingAccount.beneficiary.imagePath)) {
            this.documents.push(
                {
                    name: 'Beneficiary Photo',
                    url: openingForm.openingAccount.beneficiary.imagePath
                }
            );
        }
        if (!ObjectUtil.isEmpty(openingForm.openingAccount.nominee) &&
            !ObjectUtil.isEmpty(openingForm.openingAccount.nominee.imagePath)) {
            this.documents.push(
                {
                    name: 'Nominee Photo',
                    url: openingForm.openingAccount.nominee.imagePath
                }
            );
        }
        if (openingForm.openingAccount.openingCustomers.length > 0) {
            const selectedAccountCategory = this.openingForm.openingAccount.purposeOfAccount;
            openingForm.openingAccount.openingCustomers.forEach((customer) => {
                customer.documents.forEach(doc => {
                    const docDetail = selectedAccountCategory.documents
                    .filter(d => d.id === doc.documentId)[0];
                    this.documents.push({
                        name: `Applicant: ${customer.firstName} ${customer.lastName} ${docDetail.displayName}`,
                        url: doc.path
                    });
                });
            });
        }
    }
    setNomineeFamily(nomineeRelativeArray: Array<OpeningCustomerRelative>) {
        const control = (this.openingAccount.get('nomineeFamily') as FormArray).controls;
        nomineeRelativeArray.forEach( value => {
            control.push(
                this.formBuilder.group({
                    relation: [value.customerRelation],
                    relativeName: [value.customerRelativeName]
                })
            );
        });
    }

    addNomineeRelative() {
        (this.openingAccount.get('nomineeFamily') as FormArray).push(
            this.formBuilder.group({
                relation: [undefined],
                relativeName: [undefined]
            })
        );
    }

    removeNomineeRelativeField(index) {
        (this.openingAccount.get('nomineeFamily') as FormArray).removeAt(index);
    }

    applicantDetailFormGroup(): FormGroup {
        return this.formBuilder.group({
            // Opening Customer
            id: [undefined],
            customerTitle: [undefined],
            customerFirstName: [undefined],
            customerMiddleName: [undefined],
            customerLastName: [undefined],
            applicantMaritalStatusRadio: [undefined],
            applicantMaritalStatusRadioOtherMarriedStatus: [undefined],
            applicantGenderRadio: [undefined],
            applicantGenderRadioOtherGender: [undefined],
            applicantEducationalQualification: [undefined],
            applicantEducationalQualificationOther: [undefined],
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
            applicantVoterNumber: [undefined],
            applicantVoterIssuedPlace: [undefined],
            applicantVoterIssuedDate: [undefined],
            applicantPassportNumber: [undefined],
            applicantPassportIssuedPlace: [undefined],
            applicantPassportIssuedDate: [undefined],
            applicantPassportExpireDate: [undefined],
            applicantLicenseNumber: [undefined],
            applicantLicenseIssuedPlace: [undefined],
            applicantLicenseIssuedDate: [undefined],
            applicantLicenseExpireDate: [undefined],
            employedDetailRadio: [undefined],
            applicantSalaried: [undefined],
            applicantSalariedOther: [undefined],
            applicantSelfEmployed: [undefined],
            applicantSelfEmployedOther: [undefined],
            haveAccountInOtherBank: [undefined],
            accountInOtherBankName: [undefined],
            occupationDetails: this.formBuilder.array([
                this.applicantOccupationDetailsFormGroup()
            ]),
            otherIncomeSource: [undefined],
            isPoliticallyExposed: [undefined],
            pepName: [undefined],
            pepRelationWithApplicant: [undefined],
            isConvictedForCrime: [undefined],
            isMemberHighProfile: [undefined],
            crimeConvictedFor: [undefined],
            holdResidentialOfForeign: [undefined],
            holdResidentialOfForeignType: [undefined],
            holdResidentialOf: [undefined],
            isUsResidentRadio: [undefined],
            isUsCitizenRadio: [undefined],
            isUsGreenCardHolderRadio: [undefined]
        });
    }

    setApplicantDetailFormGroup(applicantList: Array<OpeningCustomer>): FormArray {
        const applicantFormArray = new FormArray([]);
        applicantList.forEach(applicant => {
                const applicantControl = this.formBuilder.group({
                    // Applicant Details
                    customerTitle: applicant.title,
                    customerFirstName: applicant.firstName,
                    customerMiddleName: applicant.middleName,
                    customerLastName: applicant.lastName,
                    applicantMaritalStatusRadio: applicant.maritalStatus,
                    applicantMaritalStatusRadioOtherMarriedStatus: [undefined],
                    applicantGenderRadio: applicant.gender,
                    applicantGenderRadioOtherGender: [undefined],
                    applicantEducationalQualification: applicant.education,
                    applicantEducationalQualificationOther: [undefined],
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
                    applicantDateOfBirth: this.formatDate(applicant.dateOfBirthAD),
                    applicantPanNumber: applicant.panNo,
                    applicantCitizenNumber: applicant.citizenNumber,
                    applicantCitizenIssuedPlace: applicant.citizenIssuedPlace,
                    applicantCitizenIssuedDate: this.formatDate(applicant.citizenIssuedDate),
                    applicantVoterNumber: applicant.voterNumber,
                    applicantVoterIssuedPlace: applicant.voterIssuedPlace,
                    applicantVoterIssuedDate: this.formatDate(applicant.voterIssuedDate),
                    applicantPassportNumber: applicant.passportNumber,
                    applicantPassportIssuedPlace: applicant.passportIssuedPlace,
                    applicantPassportIssuedDate: this.formatDate(applicant.passportIssuedDate),
                    applicantPassportExpireDate: this.formatDate(applicant.passportExpireDate),
                    applicantLicenseNumber: applicant.licenseNumber,
                    applicantLicenseIssuedPlace: applicant.licenseIssuedPlace,
                    applicantLicenseIssuedDate: this.formatDate(applicant.licenseIssuedDate),
                    applicantLicenseExpireDate: this.formatDate(applicant.licenseExpireDate),
                    employedDetailRadio: 'Salaried',
                    applicantSalaried: applicant.salariedEmployedWith,
                    applicantSalariedOther: [undefined],
                    applicantSelfEmployed: applicant.selfEmployedWith,
                    applicantSelfEmployedOther: [undefined],
                    haveAccountInOtherBank: applicant.accountInAnotherBank + '',
                    accountInOtherBankName: applicant.bankName,
                    occupationDetails: this.formBuilder.array([
                        this.applicantOccupationDetailsFormGroup()
                    ]),
                    otherIncomeSource: applicant.otherSourceOfIncome,
                    isPoliticallyExposed: applicant.exposeToPep + '',
                    pepName: applicant.pepName,
                    pepRelationWithApplicant: applicant.pepDesignation,
                    isConvictedForCrime: applicant.convictedOfCrime + '',
                    isMemberHighProfile: applicant.highProfileRelation + '',
                    crimeConvictedFor: applicant.convictedCrime,
                    holdResidentialOfForeign: applicant.residentialPermitOfForeign + '',
                    holdResidentialOfForeignType: applicant.residentialPermitOfForeignType + '',
                    holdResidentialOf: applicant.residentialPermitOfForeignCountryName,
                    isUsResidentRadio: applicant.usResident + '',
                    isUsCitizenRadio: applicant.usCitizen + '',
                    isUsGreenCardHolderRadio: applicant.greenCardHolder + ''
                });
                if (applicant.maritalStatus !== 'Married' && applicant.maritalStatus !== 'Unmarried') {
                    applicantControl.get('applicantMaritalStatusRadio').setValue('Others');
                    applicantControl.get('applicantMaritalStatusRadioOtherMarriedStatus').setValue(applicant.maritalStatus);
                }
                if (applicant.gender !== 'Male' && applicant.gender !== 'Female') {
                    applicantControl.get('applicantGenderRadio').setValue('Other Gender');
                    applicantControl.get('applicantGenderRadioOtherGender').setValue(applicant.gender);
                }
                if (applicant.education !== 'Literate' && applicant.education !== 'SLC' &&
                    applicant.education !== 'Literate' && applicant.education !== 'PostGraduate') {
                    applicantControl.get('applicantEducationalQualification').setValue('Others');
                    applicantControl.get('applicantEducationalQualificationOther').setValue(applicant.education);
                }
                if (applicant.salariedEmployedWith !== 'Nepal Government' && applicant.salariedEmployedWith !== 'Public Organization') {
                    applicantControl.get('applicantSalaried').setValue('Others');
                    applicantControl.get('applicantSalariedOther').setValue(applicant.salariedEmployedWith);
                }
                if (applicant.selfEmployedWith !== 'CA' && applicant.selfEmployedWith !== 'Doctor' &&
                    applicant.selfEmployedWith !== 'Engineer' && applicant.selfEmployedWith !== 'Lawyer' &&
                    applicant.selfEmployedWith !== 'Business') {
                    applicantControl.get('applicantSelfEmployed').setValue('Others');
                    applicantControl.get('applicantSelfEmployedOther').setValue(applicant.selfEmployedWith);
                }
                applicantControl.setControl('applicantRelative', this.setApplicantRelativeFormGroup
                (applicant.kyc.customerRelatives));
                applicantControl.setControl('occupationDetails', this.setOccupationDetailsFormGroup
                (applicant.kyc.occupationalDetails));
                applicantFormArray.push(applicantControl);
            }
        );
        return applicantFormArray;
    }

    getApplicantDetail() {
        return (this.openingAccount.value.applicantDetail as FormArray);
    }

    removeApplicantDetail(index: number) {
        (this.openingAccount.get('applicantDetail') as FormArray).removeAt(index);
    }

    addApplicantDetail() {
        (this.openingAccount.get('applicantDetail') as FormArray).push(this.applicantDetailFormGroup());
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
            if (relative.customerRelativeName !== null && relative.customerRelativeName !== '') {
                relativeFormArray.push(this.formBuilder.group({
                    applicantRelationWith: relative.customerRelation,
                    applicantRelativeName: relative.customerRelativeName
                }));
            }
        });
        return relativeFormArray;
    }

    getApplicantRelative(customerIndex: number): FormArray {
        return (this.openingAccount.value.applicantDetail[customerIndex].applicantRelative as FormArray);
    }

    removeApplicantRelative(control, relativeIndex: number) {
        control.removeAt(relativeIndex);
    }

    addApplicantRelative(applicantIndex) {
        const control = (this.openingAccount.controls['applicantDetail'] as FormArray)
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

    getOccupationalDetail(customerIndex: number): FormArray {
        return (this.openingAccount.value.applicantDetail[customerIndex].occupationDetails as FormArray);
    }

    removeApplicantOccupationDetails(control, occupationIndex: number) {
        control.removeAt(occupationIndex);
    }

    addApplicantOccupationDetails(applicantIndex) {
        const control = (this.openingAccount.controls['applicantDetail'] as FormArray)
        .at(applicantIndex).get('occupationDetails') as FormArray;
        control.push(this.applicantOccupationDetailsFormGroup());
    }

    submitForm(action: string) {
        const openingActionDto = {
            'id': this.id,
            actionStatus: action,
            openingCustomers: this.getApplicantDetail()
        };
        if (action === 'APPROVAL') {
            const modalRef = this.modalService.open(AccountNumberModalComponent);
            modalRef.componentInstance.openingForm = openingActionDto.openingCustomers;
            modalRef.componentInstance.openingForm.id = this.id;
            modalRef.result.then(() => {
                this.updateForm(openingActionDto);
            }, () => {
            });
        } else if (action === 'REJECTED') {
            const modalRef = this.modalService.open(RemarkModalComponent);
            modalRef.componentInstance.openingForm = openingActionDto.openingCustomers;
            modalRef.componentInstance.openingForm.id = this.id;
            modalRef.componentInstance.action = 'Reject';
            modalRef.result.then(() => {
                this.updateForm(openingActionDto);
            }, () => {
            });
        }
    }

    updateForm(openingActionDto) {
        this.service.postAccountOpeningAction(openingActionDto).subscribe(value => {
            this.router.navigate(['home/admin/openingAccount']);
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved'));
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Opening Form'));
        });
    }

    formatDate(sentDate): string {
        if (sentDate === null) {
            return null;
        }
        const date = new Date(sentDate);
        return this.datePipe.transform(date, 'yyyy-MM-dd');
    }

    setCustomers() {
        const branch = new Branch();
        branch.id = this.openingAccount.get('branch').value;
        this.openingForm.branch = branch;
        this.openingForm.id = this.openingAccount.get('id').value;
        // Account Details
        this.openingForm.fullName = this.getApplicantDetail()[0].customerFirstName + ' ' + this.getApplicantDetail()[0].customerMiddleName
            + ' ' + this.getApplicantDetail()[0].customerLastName;
        this.openingForm.requestedDate = this.openingAccount.get('requestedDate').value;
        const accountType = new AccountType();
        accountType.id = this.openingAccount.get('accountType').value;
        this.openingForm.accountType = accountType;
        const accountPurpose = new AccountCategory();
        accountPurpose.id = this.openingAccount.get('purposeOfAccount').value;
        this.account.purposeOfAccount = accountPurpose;
        this.account.currency = this.openingAccount.get('accountCurrency').value;
        this.account.haveJoint = this.openingAccount.get('jointAccountRadio').value;
        // Applicant Personal Details
        this.account.openingCustomers = new Array<OpeningCustomer>();
        let customerIndex = 0;
        while (customerIndex < this.getApplicantDetail().length) {
            this.openingCustomer = new OpeningCustomer();
            this.openingCustomer.title = this.getApplicantDetail()[customerIndex].customerTitle;
            this.openingCustomer.firstName = this.getApplicantDetail()[customerIndex].customerFirstName;
            this.openingCustomer.middleName = this.getApplicantDetail()[customerIndex].customerMiddleName;
            this.openingCustomer.lastName = this.getApplicantDetail()[customerIndex].customerLastName;
            if (this.getApplicantDetail()[customerIndex].applicantMaritalStatusRadio !== 'Others') {
                this.openingCustomer.maritalStatus = this.getApplicantDetail()[customerIndex].applicantMaritalStatusRadio;
            } else {
                this.openingCustomer.maritalStatus = this.getApplicantDetail()[customerIndex].applicantMaritalStatusRadioOtherMarriedStatus;
            }
            if (this.getApplicantDetail()[customerIndex].applicantGenderRadio !== 'Other Gender') {
                this.openingCustomer.gender = this.getApplicantDetail()[customerIndex].applicantGenderRadio;
            } else {
                this.openingCustomer.gender = this.getApplicantDetail()[customerIndex].applicantGenderRadioOtherGender;
            }
            if (this.getApplicantDetail()[customerIndex].applicantEducationalQualification !== 'Others') {
                this.openingCustomer.education = this.getApplicantDetail()[customerIndex].applicantEducationalQualification;
            } else {
                this.openingCustomer.education = this.getApplicantDetail()[customerIndex].applicantEducationalQualificationOther;
            }
            this.openingCustomer.permanentHouseNumber = this.getApplicantDetail()[customerIndex].applicantPermanentHouseNo;
            this.openingCustomer.permanentStreet = this.getApplicantDetail()[customerIndex].applicantPermanentStreet;
            this.openingCustomer.permanentWard = this.getApplicantDetail()[customerIndex].applicantPermanentWard;
            this.openingCustomer.permanentMunicipality = this.getApplicantDetail()[customerIndex].applicantPermanentMunicipalityOrVDC;
            this.openingCustomer.permanentProvince = this.getApplicantDetail()[customerIndex].applicantPermanentProvince;
            this.openingCustomer.permanentDistrict = this.getApplicantDetail()[customerIndex].applicantPermanentDistrict;
            this.openingCustomer.presentHouseNumber = this.getApplicantDetail()[customerIndex].applicantPresentHouseNo;
            this.openingCustomer.presentStreet = this.getApplicantDetail()[customerIndex].applicantPresentStreet;
            this.openingCustomer.presentWard = this.getApplicantDetail()[customerIndex].applicantPresentWard;
            this.openingCustomer.presentMunicipality = this.getApplicantDetail()[customerIndex].applicantPresentMunicipalityOrVDC;
            this.openingCustomer.presentProvince = this.getApplicantDetail()[customerIndex].applicantPresentProvince;
            this.openingCustomer.presentDistrict = this.getApplicantDetail()[customerIndex].applicantPresentDistrict;
            this.openingCustomer.landLordName = this.getApplicantDetail()[customerIndex].applicantLandLordName;
            this.openingCustomer.landLordContactNo = this.getApplicantDetail()[customerIndex].applicantLandLordContactNumber;
            // Contact Details
            this.openingCustomer.residentialContactNo = this.getApplicantDetail()[customerIndex].applicantResidentialContact;
            this.openingCustomer.officeContactNo = this.getApplicantDetail()[customerIndex].applicantOfficeContact;
            this.openingCustomer.mobileContactNo = this.getApplicantDetail()[customerIndex].applicantMobileContact;
            this.openingCustomer.email = this.getApplicantDetail()[customerIndex].applicantEmail;
            // Identification
            this.openingCustomer.dateOfBirthAD = this.getApplicantDetail()[customerIndex].applicantDateOfBirth;
            this.openingCustomer.nationality = this.getApplicantDetail()[customerIndex].applicantNationality;
            this.openingCustomer.panNo = this.getApplicantDetail()[customerIndex].applicantPanNumber;
            this.openingCustomer.citizenNumber = this.getApplicantDetail()[customerIndex].applicantCitizenNumber;
            this.openingCustomer.citizenIssuedPlace = this.getApplicantDetail()[customerIndex].applicantCitizenIssuedPlace;
            this.openingCustomer.citizenIssuedDate = this.getApplicantDetail()[customerIndex].applicantCitizenIssuedDate;
            this.openingCustomer.voterNumber = this.getApplicantDetail()[customerIndex].applicantVoterNumber;
            this.openingCustomer.voterIssuedPlace = this.getApplicantDetail()[customerIndex].applicantVoterIssuedPlace;
            this.openingCustomer.voterIssuedDate = this.getApplicantDetail()[customerIndex].applicantVoterIssuedDate;
            this.openingCustomer.passportNumber = this.getApplicantDetail()[customerIndex].applicantPassportNumber;
            this.openingCustomer.passportIssuedPlace = this.getApplicantDetail()[customerIndex].applicantPassportIssuedPlace;
            this.openingCustomer.passportIssuedDate = this.getApplicantDetail()[customerIndex].applicantPassportIssuedDate;
            this.openingCustomer.passportExpireDate = this.getApplicantDetail()[customerIndex].applicantPassportExpireDate;
            this.openingCustomer.licenseNumber = this.getApplicantDetail()[customerIndex].applicantLicenseNumber;
            this.openingCustomer.licenseIssuedPlace = this.getApplicantDetail()[customerIndex].applicantLicenseIssuedPlace;
            this.openingCustomer.licenseIssuedDate = this.getApplicantDetail()[customerIndex].applicantLicenseIssuedDate;
            this.openingCustomer.licenseExpireDate = this.getApplicantDetail()[customerIndex].applicantLicenseExpireDate;
            // Family Details
            this.openingKyc = new OpeningKyc();
            this.openingKyc.customerRelatives = new Array<OpeningCustomerRelative>();
            let relativeIndex = 0;
            while (relativeIndex < this.getApplicantRelative(customerIndex).length) {
                this.openingCustomerRelative = new OpeningCustomerRelative();
                this.openingCustomerRelative.customerRelation = this.getApplicantRelative(customerIndex)[relativeIndex]
                    .applicantRelationWith;
                this.openingCustomerRelative.customerRelativeName = this.getApplicantRelative(customerIndex)[relativeIndex]
                    .applicantRelativeName;
                this.openingKyc.customerRelatives.push(this.openingCustomerRelative);
                relativeIndex++;
            }
            // Employment Details
            if (this.getApplicantDetail()[customerIndex].applicantSalaried === 'Others') {
                this.openingCustomer.salariedEmployedWith = this.getApplicantDetail()[customerIndex].applicantSalariedOther;
            } else {
                this.openingCustomer.salariedEmployedWith = this.getApplicantDetail()[customerIndex].applicantSalaried;
            }
            if (this.getApplicantDetail()[customerIndex].applicantSelfEmployed === 'Others') {
                this.openingCustomer.selfEmployedWith = this.getApplicantDetail()[customerIndex].applicantSelfEmployedOther;
            } else {
                this.openingCustomer.selfEmployedWith = this.getApplicantDetail()[customerIndex].applicantSelfEmployed;
            }
            this.openingCustomer.otherSourceOfIncome = this.getApplicantDetail()[customerIndex].otherIncomeSource;
            this.openingCustomer.accountInAnotherBank = this.getApplicantDetail()[customerIndex].haveAccountInOtherBank;
            this.openingCustomer.bankName = this.getApplicantDetail()[customerIndex].accountInOtherBankName;
            // Occupational Details
            this.openingKyc.occupationalDetails = new Array<OpeningOccupationalDetails>();
            let occupationalDetailIndex = 0;
            while (occupationalDetailIndex < this.getOccupationalDetail(customerIndex).length) {
                this.openingOccupationalDetails = new OpeningOccupationalDetails();
                this.openingOccupationalDetails.nameOfOrganization = this.getOccupationalDetail(customerIndex)[occupationalDetailIndex]
                    .nameOfOrganization;
                this.openingOccupationalDetails.address = this.getOccupationalDetail(customerIndex)[occupationalDetailIndex]
                    .organizationAddress;
                this.openingOccupationalDetails.telNo = this.getOccupationalDetail(customerIndex)[occupationalDetailIndex]
                    .organizationTelephone;
                this.openingOccupationalDetails.designation = this.getOccupationalDetail(customerIndex)[occupationalDetailIndex]
                    .applicantDesignation;
                this.openingOccupationalDetails.natureOfBusiness = this.getOccupationalDetail(customerIndex)[occupationalDetailIndex]
                    .organizationBusiness;
                this.openingOccupationalDetails.estimatedAnnualIncome = this.getOccupationalDetail(customerIndex)[occupationalDetailIndex]
                    .annualIncomeFromOrganization;
                this.openingKyc.occupationalDetails.push(this.openingOccupationalDetails);
                occupationalDetailIndex++;
            }
            this.openingCustomer.kyc = this.openingKyc;
            // Declarations
            this.openingCustomer.exposeToPep = this.getApplicantDetail()[customerIndex].isPoliticallyExposed;
            this.openingCustomer.pepName = this.getApplicantDetail()[customerIndex].pepName;
            this.openingCustomer.pepDesignation = this.getApplicantDetail()[customerIndex].pepRelationWithApplicant;
            this.openingCustomer.convictedOfCrime = this.getApplicantDetail()[customerIndex].isConvictedForCrime;
            this.openingCustomer.convictedCrime = this.getApplicantDetail()[customerIndex].crimeConvictedFor;
            this.openingCustomer.highProfileRelation = this.getApplicantDetail()[customerIndex].isMemberHighProfile;
            this.openingCustomer.residentialPermitOfForeign = this.getApplicantDetail()[customerIndex].holdResidentialOfForeign;
            this.openingCustomer.residentialPermitOfForeignType = this.getApplicantDetail()[customerIndex].holdResidentialOfForeignType;
            this.openingCustomer.residentialPermitOfForeignCountryName = this.getApplicantDetail()[customerIndex].holdResidentialOf;
            // FATCA Declaration
            this.openingCustomer.usResident = this.getApplicantDetail()[customerIndex].isUsResidentRadio;
            this.openingCustomer.usCitizen = this.getApplicantDetail()[customerIndex].isUsCitizenRadio;
            this.openingCustomer.greenCardHolder = this.getApplicantDetail()[customerIndex].isUsGreenCardHolderRadio;
            customerIndex++;
            this.account.openingCustomers.push(this.openingCustomer);
        }
        // Account Transaction Details
        this.account.annualTransactionNumber = this.openingAccount.get('annualTurnOver').value;
        this.account.annualTransaction = this.openingAccount.get('annualTransaction').value;
        // Beneficiary Details
        this.account.haveBeneficiary = this.openingAccount.get('beneficiaryRadio').value;
        this.openingBeneficiary = new OpeningBeneficiary();
        this.openingBeneficiary.fullName = this.openingAccount.get('beneficiaryName').value;
        this.openingBeneficiary.dateOfBirth = this.openingAccount.get('beneficiaryDateOfBirth').value;
        this.openingBeneficiary.relationToMe = this.openingAccount.get('relationWithBeneficiary').value;
        this.openingBeneficiary.contactNumber = this.openingAccount.get('beneficiaryContactNumber').value;
        this.openingBeneficiary.permanentAddress = this.openingAccount.get('beneficiaryAddress').value;
        this.openingBeneficiary.temporaryAddress = this.openingAccount.get('beneficiaryPresentAddress').value;
        this.openingBeneficiary.citizenNumber = this.openingAccount.get('beneficiaryCitizenshipNumber').value;
        this.openingBeneficiary.issuedPlace = this.openingAccount.get('beneficiaryCitizenshipIssueAddress').value;
        this.account.beneficiary = this.openingBeneficiary;
        // Nominee
        this.account.haveNominee = this.openingAccount.get('nomineeRadio').value;
        this.openingNominee = new OpeningNominee();
        this.openingNominee.fullName = this.openingAccount.get('nomineeName').value;
        this.openingNominee.dateOfBirth = this.openingAccount.get('nomineeDateOfBirth').value;
        this.openingNominee.relationToMe = this.openingAccount.get('relationWithNominee').value;
        this.openingNominee.contactNumber = this.openingAccount.get('nomineeContactNumber').value;
        this.openingNominee.permanentAddress = this.openingAccount.get('nomineePermanentAddress').value;
        this.openingNominee.temporaryAddress = this.openingAccount.get('nomineePresentAddress').value;
        this.openingNominee.citizenNumber = this.openingAccount.get('nomineeCitizenshipNumber').value;
        this.openingNominee.issuedPlace = this.openingAccount.get('nomineeCitizenshipIssueAddress').value;

        // Nominee Relative
        this.openingNominee.nomineeFamily = new Array<OpeningCustomerRelative>();
        (this.openingAccount.get('nomineeFamily') as FormArray).controls.forEach( value => {
            const nomineeRelativeObject = new OpeningCustomerRelative();
            nomineeRelativeObject.customerRelation = value.get('relation').value;
            nomineeRelativeObject.customerRelativeName = value.get('relativeName').value;
            this.openingNominee.nomineeFamily.push(nomineeRelativeObject);
        });
        this.account.nominee = this.openingNominee;
        // Required Service
        this.account.statement = this.openingAccount.get('accountStatementRadio').value;
        this.account.statementFrequency = this.openingAccount.get('accountStatementFrequencyRadio').value;
        this.account.statementMode = this.openingAccount.get('statementMode').value;
        this.account.debitCard = this.openingAccount.get('debitCardRadio').value;
        this.account.internetBanking = this.openingAccount.get('internetBankingRadio').value;
        this.account.mobileBanking = this.openingAccount.get('mobileBankingRadio').value;
        this.openingForm.openingAccount = this.account;
    }

    downloadDocument(url: string, name: string): void {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
        link.download = name;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }

    onBack() {
        window.history.back();
    }
}
