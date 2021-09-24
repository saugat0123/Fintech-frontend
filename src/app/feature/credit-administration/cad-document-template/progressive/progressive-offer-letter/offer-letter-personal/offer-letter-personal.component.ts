import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProgressiveOfferLetterConst} from '../progressive-offer-letter-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {AddressService} from '../../../../../../@core/service/baseservice/address.service';

@Component({
    selector: 'app-offer-letter-personal',
    templateUrl: './offer-letter-personal.component.html',
    styleUrls: ['./offer-letter-personal.component.scss']
})
export class OfferLetterPersonalComponent implements OnInit {
    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    form: FormGroup;
    spinner;
    offerLetterConst = ProgressiveOfferLetterConst;
    customerOfferLetter: CustomerOfferLetter;
    initialInfoPrint;
    existingOfferLetter = false;
    offerLetterDocument: OfferDocument;
    nepaliData;
    districtList;
    loanAmountTemplate;

    constructor(private formBuilder: FormBuilder,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepaliNumberPipe: EngToNepaliNumberPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepPercentWordPipe: NepaliPercentWordPipe,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService,
                private customerOfferLetterService: CustomerOfferLetterService,
                private addressService: AddressService,
                private dialogRef: NbDialogRef<OfferLetterPersonalComponent>) {
    }

    ngOnInit() {
      this.addressService.getAllDistrict().subscribe((res: any) => {
          this.districtList = res.detail;
      });
        this.buildForm();
        this.loanAmountTemplate = JSON.parse(this.cadOfferLetterApprovedDoc.nepData);
        this.checkOfferLetter();
    }

    fillForm() {
        this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        let allGuarantors = '';
        (JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData).guarantorDetails).forEach(guarantor => {
            allGuarantors = allGuarantors + guarantor.name + ', ';
        });
        allGuarantors = allGuarantors.slice(0, -2);


        const customerAddress =
            this.nepaliData.permanentMunicipality + ' वडा नं. ' +
            this.nepaliData.permanentWard + ' , ' +
            this.nepaliData.permanentDistrict;
        const customerTempAddress =
            this.nepaliData.temporaryMunicipality + ' वडा नं. ' +
            this.nepaliData.temporaryWard + ' , ' +
            this.nepaliData.temporaryDistrict;
        this.form.get(['loanFacilityTable', 0, 'amount']).patchValue(this.loanAmountTemplate.numberNepali);
        this.form.get(['loanFacilityTable', 0, 'amountInWords']).patchValue(this.loanAmountTemplate.nepaliWords);
        this.form.patchValue({
            customerName: this.nepaliData.name ? this.nepaliData.name : '',
            customerAddress: customerAddress ? customerAddress : '',
            customerTemporaryAddress: customerTempAddress ? customerTempAddress : '',
            customerMunicipality: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
            customerWardNum: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
            customerDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
            signatoryCitizenshipNum: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
            signatoryCitizenshipIssueDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
            signatoryCitizenshipIssuePlace: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
            signatoryParentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
            signatoryGrandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
            temporaryMunicipality: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
            temporaryWardNum: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
            temporaryDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
            shreeName1: allGuarantors ? allGuarantors : '',
            dhitoLekhi: this.loanAmountTemplate.numberNepali ? this.loanAmountTemplate.numberNepali : '',
            shreeAmount: this.loanAmountTemplate.numberNepali ? this.loanAmountTemplate.numberNepali : '',
            shreeAmountInWord: this.loanAmountTemplate.nepaliWords ? this.loanAmountTemplate.nepaliWords : '',
            amount2: this.loanAmountTemplate.numberNepali ? this.loanAmountTemplate.numberNepali : '',
            amountInWords2: this.loanAmountTemplate.nepaliWords ? this.loanAmountTemplate.nepaliWords : ''
        });
        this.setEmptyGuarantors(this.nepaliData.guarantorDetails);
        this.setGuarantors(this.nepaliData.guarantorDetails);
        this.addEmptySecurityDetail();
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_PERSONAL).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_PERSONAL);
            if (this.loanAmountTemplate) {
                this.fillForm();
            }
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.setEmptyGuarantors(initialInfo.guarantorDetails);
            this.setGuarantors(initialInfo.guarantors);
            this.setSecurityDetails(initialInfo.securityDetails);
            this.setLoanFacility(initialInfo.loanFacilityTable);
            this.form.patchValue(initialInfo);
        }
    }

    onSubmit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_PERSONAL).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_PERSONAL);
            offerDocument.initialInformation = JSON.stringify(this.form.value);
            this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
        }

        this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        });

    }


    setSecurityDetails(data) {
        const formArray = this.form.get('securityDetails') as FormArray;
        if (data.length === 0) {
            this.addEmptySecurityDetail();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                name: [value.name],
                parentName: [value.parentName],
                grandParentName: [value.grandParentName],
                address: [value.address],
                jaggaDistrict: [value.jaggaDistrict],
                jaggaWard: [value.jaggaWard],
                hal: [value.hal],
                jaggaKittaNum: [value.jaggaKittaNum],
                jaggaArea: [value.jaggaArea],
                jaggaSiNum: [value.jaggaSiNum],
            }));
        });
    }

    addEmptySecurityDetail() {
        (this.form.get('securityDetails') as FormArray).push(
            this.formBuilder.group({
                name: [undefined],
                parentName: [undefined],
                grandParentName: [undefined],
                address: [undefined],
                jaggaDistrict: [undefined],
                jaggaWard: [undefined],
                jaggaKittaNum: [undefined],
                jaggaArea: [undefined],
                jaggaSiNum: [undefined],
                hal : [undefined]
            }));
    }

    removeSecurityDetail(index) {
        (this.form.get('securityDetails') as FormArray).removeAt(index);
    }

    setGuarantors(data) {
        const formArray = this.form.get('guarantors') as FormArray;
        if (data.length === 0) {
            this.addEmptyGuarantor();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                guarantorLegalDocumentAddress: [value.guarantorLegalDocumentAddress],
                name: [value.name],
            }));
        });
    }

    setEmptyGuarantors(data) {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        if (data.length === 0) {
            this.addEmptyGuarantor();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                jamaniKartaName: [value.name],
                guarantorCitizenshipNo: [value.citizenNumber],
                guarantorIssuedDate: [value.issuedYear],
                guarantorCitizenIssuedOffice: [value.issuedPlace],
                guarantorLegalDocumentAddress: [value.guarantorLegalDocumentAddress],
                name: [value.name],
            }));
        });
    }

    buildGuarantorDetails() {
        return this.formBuilder.group({
            jamaniKartaName: [undefined],
            guarantorCitizenshipNo: [undefined],
            guarantorIssuedDate: [undefined],
            guarantorCitizenIssuedOffice: [undefined],
            name: [undefined],
            guarantorLegalDocumentAddress: [undefined]
        });
    }

    addEmptyGuarantor() {
        (this.form.get('guarantors') as FormArray).push(this.buildGuarantorDetails());
    }

    removeGuarantor(index) {
        (this.form.get('guarantors') as FormArray).removeAt(index);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            patraNum: [undefined],
            date: [undefined],
            customerName: [undefined],
            customerAddress: [undefined],
            customerTemporaryAddress: [undefined],
            customerMobile: [undefined],

            temporaryMunicipality: [undefined],
            temporaryWardNum: [undefined],
            temporaryDistrict: [undefined],

            // loanTypeNepali: [undefined],
            // loanTypeEnglish: [undefined],
            // amount: [undefined],
            // amountInWords: [undefined],
            // loanPurpose: [undefined],
            // interestRate: [undefined],
            // interestRepayMonths: [undefined],
            // interestBaseRate: [undefined],
            // interestPremiumRate: [undefined],
            // interestTempDiscountRate: [undefined],
            // interestFinalRate: [undefined],
            // loanLimitPercent: [undefined],
            // loanLimitAmount: [undefined],
            // loanInstallmentAmount: [undefined],
            // interestRepayPlan: [undefined],
            // loanLimitYearAD: [undefined],
            // loanLimitYearBS: [undefined],
            // loanLimitMonths: [undefined],
            //
            // pratibadhataAmount: [undefined],
            // pratibadhataAdditionalAmount: [undefined],
            // pratibadhataRate: [undefined],
            // pratibadhataYearlyRate: [undefined],
            //
            // sthantarandRate: [undefined],

            securityDetails: this.formBuilder.array([]),

            dhitoDate: [undefined],
            dhitoAuditor: [undefined],
            dhitoAmount: [undefined],
            dhitoDistress: [undefined],
            dhitoLekhi: [undefined],

            shreeName1: [undefined],
            shreeAmount: [undefined],
            shreeAmountInWord: [undefined],

            amount2: [undefined],
            amountInWords2: [undefined],

            financeBranch: [undefined],
            financeMunicipality: [undefined],
            financeWardNum: [undefined],
            financeDistrict: [undefined],
            financeTelephoneNum: [undefined],
            financeTelephoneNum2: [undefined],
            financeTelephoneNum3: [undefined],
            financeFaxNum: [undefined],
            financeEmail: [undefined],
            customerMunicipality: [undefined],
            customerWardNum: [undefined],
            customerDistrict: [undefined],
            customerTelephone: [undefined],
            customerTelephone2: [undefined],
            customerTelephone3: [undefined],
            customerFax: [undefined],
            customerEmail: [undefined],
            akhtiyarName: [undefined],
            akhtiyarContactNum: [undefined],

            employeeName: [undefined],
            employeeFinanceBranch: [undefined],
            employeeFinanceDistrict: [undefined],

            employeeName2: [undefined],
            employeeFinanceBranch2: [undefined],
            employeeFinanceDistrict2: [undefined],

            signatoryName: [undefined],
            signatoryCitizenshipNum: [undefined],
            signatoryCitizenshipIssueDate: [undefined],
            signatoryCitizenshipIssuePlace: [undefined],
            akhtiyarName2: [undefined],
            akhtiyarMunicipality2: [undefined],
            akhtiyarWardNum2: [undefined],
            signatoryGrandParentName: [undefined],
            signatoryParentName: [undefined],

            guarantors: this.formBuilder.array([]),
            guarantorDetails: this.formBuilder.array([]),

            sahichhapEmployee: [undefined],
            docYear: [undefined],
            docMonth: [undefined],
            docDate: [undefined],
            docRoj: [undefined],
            officeType: [undefined],
            branchName: [undefined],
            secondLetterDate: [undefined],
            secondPatraNo: [undefined],
            loanHolderName: [undefined],
            guarantorDistrict: [undefined],
            municipalityName: [undefined],
            guarantorWardNo: [undefined],
            guarantorRelation: [undefined],
            fatherInLawName: [undefined],
            spouseOrFatherName: [undefined],
            guarantorMobileNo: [undefined],
            guarantorEmail: [undefined],
            letterSubmittedDate: [undefined],
            loanFacilityTable: this.formBuilder.array([this.addLoanFacilityTable()]),

        });
    }

    addLoanFacilityTable() {
        return this.formBuilder.group({
            loanTypeNepali: [undefined],
            loanTypeEnglish: [undefined],
            amount: [undefined],
            amountInWords: [undefined],
            loanPurpose: [undefined],
            interestRate: [undefined],
            interestRepayMonths: [undefined],
            interestBaseRate: [undefined],
            interestPremiumRate: [undefined],
            interestTempDiscountRate: [undefined],
            interestFinalRate: [undefined],
            loanLimitPercent: [undefined],
            loanLimitAmount: [undefined],
            loanInstallmentAmount: [undefined],
            interestRepayPlan: [undefined],
            loanLimitYearAD: [undefined],
            loanLimitYearBS: [undefined],
            loanLimitMonths: [undefined],

            pratibadhataAmount: [undefined],
            pratibadhataAdditionalAmount: [undefined],
            pratibadhataRate: [undefined],
            pratibadhataYearlyRate: [undefined],

            sthantarandRate: [undefined],
        });
    }

    addMoreLoanFacility() {
        const formArray = (this.form.get('loanFacilityTable') as FormArray);
        formArray.push(this.addLoanFacilityTable());
    }

    removeLoanFacilityTable(index) {
        (this.form.get('loanFacilityTable') as FormArray).removeAt(index);
    }

    setLoanFacility(data) {
        const formArray = this.form.get('loanFacilityTable') as FormArray;
        (this.form.get('loanFacilityTable') as FormArray).clear();
        if (data.length === 0) {
            this.addLoanFacilityTable();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                loanTypeNepali: [value.loanTypeNepali],
                loanTypeEnglish: [value.loanTypeEnglish],
                amount: [value.amount],
                amountInWords: [value.amountInWords],
                loanPurpose: [value.loanPurpose],
                interestRate: [value.interestRate],
                interestRepayMonths: [value.interestRepayMonths],
                interestBaseRate: [value.interestBaseRate],
                interestPremiumRate: [value.interestPremiumRate],
                interestTempDiscountRate: [value.interestTempDiscountRate],
                interestFinalRate: [value.interestFinalRate],
                loanLimitPercent: [value.loanLimitPercent],
                loanLimitAmount: [value.loanLimitAmount],
                loanInstallmentAmount: [value.loanInstallmentAmount],
                interestRepayPlan: [value.interestRepayPlan],
                loanLimitYearAD: [value.loanLimitYearAD],
                loanLimitYearBS: [value.loanLimitYearBS],
                loanLimitMonths: [value.loanLimitMonths],
                pratibadhataAmount: [value.pratibadhataAmount],
                pratibadhataAdditionalAmount: [value.pratibadhataAdditionalAmount],
                pratibadhataRate: [value.pratibadhataRate],
                pratibadhataYearlyRate: [value.pratibadhataYearlyRate],
                sthantarandRate: [value.sthantarandRate],
            }));
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

    getNumAmountFormArray(numLabel, wordLabel, index) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(['loanFacilityTable', index, numLabel]).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(['loanFacilityTable', index, wordLabel]).patchValue(returnVal);
    }

    calcYearlyRate(base, premium, discount, target, index) {
        const baseRate = this.nepToEngNumberPipe.transform(this.form.get(['loanFacilityTable', index, base]).value);
        const premiumRate = this.nepToEngNumberPipe.transform(this.form.get(['loanFacilityTable', index, premium]).value);
        const discountRate = this.nepToEngNumberPipe.transform(this.form.get(['loanFacilityTable', index, discount]).value);
        const addRate = parseFloat(baseRate) + parseFloat(premiumRate) - parseFloat(discountRate);
        const finalValue = this.engToNepaliNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
        this.form.get(['loanFacilityTable', index, target]).patchValue(finalValue);
    }

    updateServiceCharge(formArrayName, i) {
        const loanLimitPercent = Number(this.nepToEngNumberPipe.transform(this.form.get([formArrayName, i, 'loanLimitPercent']).value) / 100);
        const amount = this.loanAmountTemplate.engNumber;
        const loanLimitAmount = loanLimitPercent * amount;
        const asd = this.engToNepNumberPipe.transform(loanLimitAmount.toString());
        this.form.get([formArrayName, i, 'loanLimitAmount']).patchValue(asd);
    }
}

