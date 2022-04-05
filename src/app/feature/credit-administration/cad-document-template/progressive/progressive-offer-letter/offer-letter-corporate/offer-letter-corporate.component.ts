import {Component, Input, OnInit} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProgressiveOfferLetterConst} from '../progressive-offer-letter-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {NepDataPersonal} from '../../../../model/nepDataPersonal';

@Component({
    selector: 'app-offer-letter-corporate',
    templateUrl: './offer-letter-corporate.component.html',
    styleUrls: ['./offer-letter-corporate.component.scss']
})
export class OfferLetterCorporateComponent implements OnInit {
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
    nepDataPersonal = new NepDataPersonal();
    primaryCollaterals = new Array<any>();
    secondaryCollaterals = new Array<any>();
    additionalGuarantor = new Array<any>();

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
                private dialogRef: NbDialogRef<OfferLetterCorporateComponent>) {
    }

    ngOnInit() {
        this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        this.nepDataPersonal = JSON.parse(this.cadOfferLetterApprovedDoc.nepDataPersonal);
        (this.nepaliData.collateralDetails).forEach(value => {
            if (value.securityDetails === 'HP') {
                this.primaryCollaterals.push(value);
            }
        });
        (this.nepaliData.collateralDetails).forEach(value => {
            if (value.securityDetails === 'Land_And_Building') {
                this.secondaryCollaterals.push(value);
            }
        });
        (this.nepaliData.guarantorDetails).forEach(value => {
            if (value.guarantorType === 'Personal_Guarantor') {
                this.additionalGuarantor.push(value);
            }
        });
        this.buildForm();
        this.checkOfferLetter();
        this.setSecondarySecurityDetails(this.secondaryCollaterals);
        this.setPrimaryCollaterals(this.primaryCollaterals);
        this.setAdditionalGuarantor(this.additionalGuarantor);
    }

    fillForm() {
        let guarantorName = '';
        if (this.nepaliData.guarantorDetails.length > 0) {
            if (this.nepaliData.guarantorDetails.length === 1) {
                guarantorName = !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].guarantorName) ?
                    this.nepaliData.guarantorDetails[0].guarantorName :
                    (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].companyNameGuarantor) ?
                        this.nepaliData.guarantorDetails[0].companyNameGuarantor : '');
            }
            if (this.nepaliData.guarantorDetails.length === 2) {
                guarantorName = !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].guarantorName) ?
                    this.nepaliData.guarantorDetails[0].guarantorName :
                    (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].companyNameGuarantor) ?
                        this.nepaliData.guarantorDetails[0].companyNameGuarantor : '') + ' र ' +
                    !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[1].guarantorName) ?
                        this.nepaliData.guarantorDetails[1].guarantorName :
                        (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[1].companyNameGuarantor) ?
                            this.nepaliData.guarantorDetails[1].companyNameGuarantor : '');
            }
            if (this.nepaliData.guarantorDetails.length > 2) {
                guarantorName = !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].guarantorName) ?
                    this.nepaliData.guarantorDetails[0].guarantorName :
                    (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].companyNameGuarantor) ?
                        this.nepaliData.guarantorDetails[0].companyNameGuarantor : '') + ' , ' +
                    !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[1].guarantorName) ?
                        this.nepaliData.guarantorDetails[1].guarantorName :
                        (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[1].companyNameGuarantor) ?
                            this.nepaliData.guarantorDetails[1].companyNameGuarantor : '') + ' र ' +
                        !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[1].guarantorName) ?
                        this.nepaliData.guarantorDetails[1].guarantorName :
                        (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[1].companyNameGuarantor) ?
                            this.nepaliData.guarantorDetails[1].companyNameGuarantor : '');
            }
        }
        const customerAddress =
            this.nepaliData.companyDistrict + ', ' +
            this.nepaliData.companyVdcMun + ', ' +
            this.nepaliData.companyWardNo;

        this.form.patchValue({
            customerName: !ObjectUtil.isEmpty(this.nepaliData.companyName) ? this.nepaliData.companyName : '',
            customerAddress: customerAddress ? customerAddress : '',
            shreeName: !ObjectUtil.isEmpty(this.nepaliData.representativeName) ? this.nepaliData.representativeName : '',

            // loan Details
            loanTypeNepali: [!ObjectUtil.isEmpty(this.nepDataPersonal.loanType) ? this.nepDataPersonal.loanType : ''],
            loanTypeEnglish: [!ObjectUtil.isEmpty(this.nepDataPersonal.typeOfLoanInEnglish) ?
                this.nepDataPersonal.typeOfLoanInEnglish : ''],
            amount: [!ObjectUtil.isEmpty(this.nepDataPersonal.numberNepali) ? this.nepDataPersonal.numberNepali : ''],
            amountInWords: [!ObjectUtil.isEmpty(this.nepDataPersonal.nepaliWords) ? this.nepDataPersonal.nepaliWords : ''],
            loanPurpose: [!ObjectUtil.isEmpty(this.nepDataPersonal.purposeOfLoan) ? this.nepDataPersonal.purposeOfLoan : ''],
            interestRate: [!ObjectUtil.isEmpty(this.nepDataPersonal.interestRate) ? this.nepDataPersonal.interestRate : ''],
            interestRepayPlan: [!ObjectUtil.isEmpty(this.nepDataPersonal.interestInstallmentPaymentFrequency) ?
                this.nepDataPersonal.interestInstallmentPaymentFrequency : ''],
            loanLimitYearAD: [!ObjectUtil.isEmpty(this.nepDataPersonal.loanMaturityDateAD) ? this.nepDataPersonal.loanMaturityDateAD : ''],
            loanLimitYearBS: [!ObjectUtil.isEmpty(this.nepDataPersonal.loanMaturityDateBS) ? this.nepDataPersonal.loanMaturityDateBS : ''],
            loanLimitMonths: [!ObjectUtil.isEmpty(this.nepDataPersonal.tenureOfLoanInMonths) ? this.nepDataPersonal.tenureOfLoanInMonths : ''],
            // loan free text
           /* interestRepayMonths: [!ObjectUtil.isEmpty(this.nepDataPersonal.interestRepayMonths) ? this.nepDataPersonal : ''],
            interestBaseRate: [!ObjectUtil.isEmpty(this.nepDataPersonal.interestBaseRate) ? this.nepDataPersonal : ''],
            interestPremiumRate: [!ObjectUtil.isEmpty(this.nepDataPersonal.interestPremiumRate) ? this.nepDataPersonal : ''],
            interestTempDiscountRate: [!ObjectUtil.isEmpty(this.nepDataPersonal.interestTempDiscountRate) ? this.nepDataPersonal : ''],
            interestFinalRate: [!ObjectUtil.isEmpty(this.nepDataPersonal.interestFinalRate) ? this.nepDataPersonal : ''],
            pratibadhataAdditionalAmount: [!ObjectUtil.isEmpty(this.nepDataPersonal.pratibadhataAdditionalAmount) ?
             this.nepDataPersonal : ''],
            pratibadhataRate: [!ObjectUtil.isEmpty(this.nepDataPersonal.pratibadhataRate) ? this.nepDataPersonal : ''],
            pratibadhataYearlyRate: [!ObjectUtil.isEmpty(this.nepDataPersonal.pratibadhataYearlyRate) ? this.nepDataPersonal : ''],
            sthantarandRate: [!ObjectUtil.isEmpty(this.nepDataPersonal.sthantarandRate) ? this.nepDataPersonal : ''],*/
            dhitoLekhi: [!ObjectUtil.isEmpty(this.nepDataPersonal.numberNepali) ? this.nepDataPersonal.numberNepali : ''],
            dhitoDate : [!ObjectUtil.isEmpty(this.nepaliData.valuationDate) ? this.nepaliData.valuationDate : ''],
            dhitoAuditor : [!ObjectUtil.isEmpty(this.nepaliData.valuatorName) ? this.nepaliData.valuatorName : ''],
            dhitoAmount : [!ObjectUtil.isEmpty(this.nepaliData.fairMarketValue) ? this.nepaliData.fairMarketValue : ''],
            dhitoDistress : [!ObjectUtil.isEmpty(this.nepaliData.distressValue) ? this.nepaliData.distressValue : ''],
            shreeName1 : [guarantorName ? guarantorName : ''],
            financeBranch: [!ObjectUtil.isEmpty(this.nepaliData.branchName) ? this.nepaliData.branchName : ''],
            financeMunicipality: [!ObjectUtil.isEmpty(this.nepaliData.branchMunVdc) ? this.nepaliData.branchMunVdc : ''],
            financeWardNum: [!ObjectUtil.isEmpty(this.nepaliData.branchWardNo) ? this.nepaliData.branchWardNo : ''],
            financeDistrict: [!ObjectUtil.isEmpty(this.nepaliData.branchDistrict) ? this.nepaliData.branchDistrict : ''],
            financeTelephoneNum: [!ObjectUtil.isEmpty(this.nepaliData.branchTelNo) ? this.nepaliData.branchTelNo : ''],
            financeFaxNum: [!ObjectUtil.isEmpty(this.nepaliData.branchFaxNo) ? this.nepaliData.branchFaxNo : ''],
            financeEmail: [!ObjectUtil.isEmpty(this.nepaliData.branchEmail) ? this.nepaliData.branchEmail : ''],
            customerMunicipality: [!ObjectUtil.isEmpty(this.nepaliData.companyVdcMun) ? this.nepaliData.companyVdcMun : ''],
            customerWardNum: [!ObjectUtil.isEmpty(this.nepaliData.companyWardNo) ? this.nepaliData.companyWardNo : ''],
            customerDistrict: [!ObjectUtil.isEmpty(this.nepaliData.companyDistrict) ? this.nepaliData.companyDistrict : ''],
            akhtiyarName: [!ObjectUtil.isEmpty(this.nepaliData.representativeName) ? this.nepaliData.representativeName : ''],
            signatoryName: [!ObjectUtil.isEmpty(this.nepaliData.representativeName) ? this.nepaliData.representativeName : ''],
            signatoryCitizenshipNum: [!ObjectUtil.isEmpty(this.nepaliData.representativeCitizenshipNo) ?
                this.nepaliData.representativeCitizenshipNo : ''],
            signatoryCitizenshipIssueDate: [!ObjectUtil.isEmpty(this.nepaliData.representativeCitizenshipIssueDate) ?
                this.nepaliData.representativeCitizenshipIssueDate : ''],
            signatoryCitizenshipIssuePlace: [!ObjectUtil.isEmpty(this.nepaliData.representativeCitizenshipIssuingAuthority) ?
                this.nepaliData.representativeCitizenshipIssuingAuthority : ''],
            akhtiyarName2: [!ObjectUtil.isEmpty(this.nepaliData.representativePermanentDistrict) ?
                this.nepaliData.representativePermanentDistrict : ''],
            akhtiyarMunicipality2: [!ObjectUtil.isEmpty(this.nepaliData.representativePermanentVdc) ?
                this.nepaliData.representativePermanentVdc : ''],
            akhtiyarWardNum2: [!ObjectUtil.isEmpty(this.nepaliData.representativePermanentVdcWard) ?
                this.nepaliData.representativePermanentVdcWard : ''],
            signatoryGrandParentName: [!ObjectUtil.isEmpty(this.nepaliData.representativeGrandFatherName) ?
                this.nepaliData.representativeGrandFatherName : ''],
            signatoryParentName: [!ObjectUtil.isEmpty(this.nepaliData.representativeFatherName) ?
                this.nepaliData.representativeFatherName : ''],
            bottomDate: !ObjectUtil.isEmpty(this.initialInfoPrint) ? this.initialInfoPrint.bottomDate : '',
            bottomPatraNum: !ObjectUtil.isEmpty(this.initialInfoPrint) ? this.initialInfoPrint.bottomPatraNum : ''
        });

    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_CORPORATE).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_CORPORATE);
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.setGuarantors(initialInfo.guarantors);
            this.form.patchValue(this.initialInfoPrint);
        }
    }

    onSubmit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;
        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_CORPORATE).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_CORPORATE);
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

    setSecondarySecurityDetails(data) {
        const formArray = this.form.get('securityDetails') as FormArray;
        (this.form.get('securityDetails') as FormArray).clear();
       /* if (data.length === 0) {
            this.addEmptySecurityDetail();
            return;
        }*/
        data.forEach(value => {
            if (value.securityDetails === 'Land_And_Building') {
                const tempExistingAddress = value.collateralMunVdcOriginal + ', ' + value.collateralWardNoOld;
                formArray.push(this.formBuilder.group({
                    name: [!ObjectUtil.isEmpty(value.collateralName) ? value.collateralName : ''],
                    parentName: [!ObjectUtil.isEmpty(value.collateralFatherName) ? value.collateralFatherName : ''],
                    grandParentName: [!ObjectUtil.isEmpty(value.collateralGrandFatherName) ? value.collateralGrandFatherName : ''],
                    address: [!ObjectUtil.isEmpty(value.collateralPermanentMunVdc) ? value.collateralPermanentMunVdc.nepaliName : ''],
                    addressVDC: [!ObjectUtil.isEmpty(value.collateralPermanentVdc) ? value.collateralPermanentVdc : ''],
                    addressWard: [!ObjectUtil.isEmpty(value.collateralPermanentVdcWard) ? value.collateralPermanentVdcWard : ''],
                    jaggaDistrict: [!ObjectUtil.isEmpty(value.collateralDistrict) ? value.collateralDistrict : ''],
                    jaggaWard: [tempExistingAddress ? tempExistingAddress : ''],
                    jaggaKittaNum: [!ObjectUtil.isEmpty(value.plotNo) ? value.plotNo : ''],
                    jaggaArea: [!ObjectUtil.isEmpty(value.areaOfCollateral) ? value.areaOfCollateral : ''],
                    jaggaSiNum: [!ObjectUtil.isEmpty(value.seatNo) ? value.seatNo : ''],
                }));
            }
        });
    }

    setAdditionalGuarantor(data) {
        const formArray = this.form.get('additionalGuarantor') as FormArray;
        (this.form.get('additionalGuarantor') as FormArray).clear();
        data.forEach((value, i) => {
            if (value.guarantorType === 'Personal_Guarantor') {
                formArray.push(this.formBuilder.group({
                    tapsilGuarantorName: [!ObjectUtil.isEmpty(value.guarantorName) ? value.guarantorName : ''],
                    tapsilGuarantorCitizenshipNum: [!ObjectUtil.isEmpty(value.citizenNumber) ? value.citizenNumber : ''],
                    tapsilGuarantorCitizenshipIssueDate: [!ObjectUtil.isEmpty(value.issuedYear) ? value.issuedYear : ''],
                    tapsilGuarantorCitizenshipIssuePlace: [!ObjectUtil.isEmpty(value.issuedPlace) ? value.issuedPlace : ''],
                    tapsilGuarantorDistrict: [!ObjectUtil.isEmpty(value.guarantorPermanentDistrict) ?
                        value.guarantorPermanentDistrict.nepaliName : ''],
                    tapsilGuarantorMunicipality: [!ObjectUtil.isEmpty(value.guarantorPermanentVdc) ? value.guarantorPermanentVdc : ''],
                    tapsilGuarantorWardNum: [!ObjectUtil.isEmpty(value.guarantorPermanentVdcWard) ? value.guarantorPermanentVdcWard : ''],
                    tapsilGuarantorRelation: [!ObjectUtil.isEmpty(value.relationship) ? value.relationship : ''],
                    tapsilGuarantorInLawName: [!ObjectUtil.isEmpty(value.guarantorFatherInLawName) ? value.guarantorFatherInLawName : ''],
                    tapsilGuarantorSpouseName: [!ObjectUtil.isEmpty(value.guarantorSpouseName) ? value.guarantorSpouseName : ''],
                    tapsilGuarantorFatherName: [!ObjectUtil.isEmpty(value.guarantorFatherName) ? value.guarantorFatherName : ''],
                    tapsilGuarantorGrandFatherName: [!ObjectUtil.isEmpty(value.guarantorGrandfatherName) ?
                        value.guarantorGrandfatherName : ''],
                    tapsilGuarantorContactNum: [!ObjectUtil.isEmpty(value.guarantorMobileNumber) ? value.guarantorMobileNumber : ''],
                    tapsilGuarantorEmail: [!ObjectUtil.isEmpty(value.guarantorEmailAddress) ? value.guarantorEmailAddress : ''],
                    tapsilGuarantorDate: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        this.initialInfoPrint.additionalGuarantor[i].tapsilGuarantorDate : ''],
                }));
            }
        });
    }

    setPrimaryCollaterals(data) {
        const formArray = this.form.get('primaryCollaterals') as FormArray;
        /*if (data.length === 0) {
          this.addPrimaryCollateral();
          return;
        }*/
        data.forEach((value, i) => {
            if (value.securityDetails === 'HP') {
                formArray.push(this.formBuilder.group({
                    vehicleType: [!ObjectUtil.isEmpty(value.vehicleType) ? value.vehicleType : ''],
                    vehicleNumber: [!ObjectUtil.isEmpty(value.vehicleNumber) ? value.vehicleNumber : ''],
                    vehicleModelNum: [!ObjectUtil.isEmpty(value.vehicleModelNum) ? value.vehicleModelNum : ''],
                    engineNumber: [!ObjectUtil.isEmpty(value.engineNumber) ? value.engineNumber : ''],
                    chassisNumber: [!ObjectUtil.isEmpty(value.chassisNumber) ? value.chassisNumber : ''],
                    vehicleQuotationPrice: [!ObjectUtil.isEmpty(value.vehicleQuotationPrice) ? value.vehicleQuotationPrice : ''],
                    marginPercentageOne: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        this.initialInfoPrint.primaryCollaterals[i].marginPercentageOne : ''],
                    marginPercentageTwo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        this.initialInfoPrint.primaryCollaterals[i].marginPercentageTwo : ''],
                }));
            }
        });
    }

    buildSecurityDetail() {
        return this.formBuilder.group({
            name: [undefined],
            parentName: [undefined],
            grandParentName: [undefined],
            address: [undefined],
            jaggaDistrict: [undefined],
            jaggaWard: [undefined],
            jaggaKittaNum: [undefined],
            jaggaArea: [undefined],
            jaggaSiNum: [undefined],
        });
    }

   /* addEmptySecurityDetail() {
        (this.form.get('securityDetails') as FormArray).push(this.buildSecurityDetail());
    }*/

    removeSecurityDetail(index) {
        (this.form.get('securityDetails') as FormArray).removeAt(index);
    }

    removePrimaryCollateral(i: number) {
        (this.form.get('primaryCollaterals') as FormArray).removeAt(i);
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

    addEmptyGuarantor() {
        (this.form.get('guarantors') as FormArray).push(
            this.formBuilder.group({
                guarantorLegalDocumentAddress: [undefined],
                name: [undefined],
            }));
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
            shreeName: [undefined],
            shreeMobile: [undefined],
            securityDetails: this.formBuilder.array([]),
            primaryCollaterals: this.formBuilder.array([]),
            additionalGuarantor: this.formBuilder.array([]),
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
            bulletText641: [undefined],
            bulletText642: [undefined],
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
           // loan : this.formBuilder.array([]),
            loanTypeNepali: [undefined],
            loanTypeEnglish: [undefined],
            amount: [undefined],
            amountInWords: [undefined],
            loanPurpose: [undefined],
            interestRate: [undefined],
            interestRepayPlan: [undefined],
            loanLimitYearAD: [undefined],
            loanLimitYearBS: [undefined],
            loanLimitMonths: [undefined],

            interestRepayMonths: [undefined],
            interestBaseRate: [undefined],
            interestPremiumRate: [undefined],
            interestTempDiscountRate: [undefined],
            interestFinalRate: [undefined],
            pratibadhataAdditionalAmount: [undefined],
            pratibadhataRate: [undefined],
            pratibadhataYearlyRate: [undefined],
            sthantarandRate: [undefined],

            guarantors: this.formBuilder.array([]),
            sahichhapEmployee: [undefined],
            docYear: [undefined],
            docMonth: [undefined],
            docDate: [undefined],
            docRoj: [undefined],
            bottomFinanceBranch: [undefined],
            bottomFinanceBranchAddress: [undefined],
            bottomDate: [undefined],
            bottomPatraNum: [undefined],
            freeText: [undefined],
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

    calcYearlyRate(base, premium, discount, target) {
        const baseRate = this.nepToEngNumberPipe.transform(this.form.get( base).value);
        const premiumRate = this.nepToEngNumberPipe.transform(this.form.get(premium).value);
        const discountRate = this.nepToEngNumberPipe.transform(this.form.get(discount).value);
        const addRate = parseFloat(baseRate) + parseFloat(premiumRate) - parseFloat(discountRate);
        const finalValue = this.engToNepaliNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
        this.form.get(target).patchValue(finalValue);
    }

   /* addLoan() {
        const formArray = this.form.get('loan') as FormArray;
        formArray.push(this.LoanFormGroup());
    }*/
    /*removeLoan(i) {
        const formArray = this.form.get('loan') as FormArray;
        formArray.removeAt(i);
    }*/


    /*LoanFormGroup(): FormGroup {
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
            // loanLimit: [undefined],
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
    }*/

    /*setLoan(data) {
        const formArray = this.form.get('loan') as FormArray;
        /!*if (data.length === 0) {
            this.addLoan();
            return;
        }*!/
        /!*data.forEach(val => {
            formArray.push(this.formBuilder.group({
                loanTypeNepali: [val.loanType],
                loanTypeEnglish: [val.typeOfLoanInEnglish],
                amount: [val.numberNepali],
                amountInWords: [val.nepaliWords],
                loanPurpose: [val.purposeOfLoan],
                interestRate: [val.interestRate],
                interestRepayPlan: [val.interestInstallmentPaymentFrequency],
                loanLimitYearAD: [val.loanMaturityDateAD],
                loanLimitYearBS: [val.loanMaturityDateBS],
                loanLimitMonths: [val.tenureOfLoanInMonths],

                interestRepayMonths: [val.interestRepayMonths],
                interestBaseRate: [val.interestBaseRate],
                interestPremiumRate: [val.interestPremiumRate],
                interestTempDiscountRate: [val.interestTempDiscountRate],
                interestFinalRate: [val.interestFinalRate],

                pratibadhataAdditionalAmount: [val.pratibadhataAdditionalAmount],
                pratibadhataRate: [val.pratibadhataRate],
                pratibadhataYearlyRate: [val.pratibadhataYearlyRate],

                sthantarandRate: [val.sthantarandRate],
            }));
        });*!/
    }*/
}
