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
import {ProposalCalculationUtils} from '../../../../../loan/component/loan-summary/ProposalCalculationUtils';
import {LoanDataKey} from '../../../../../../@core/utils/constants/loan-data-key';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {NepDataPersonal} from '../../../../model/nepDataPersonal';

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
    loanAmountTemplate = new NepaliNumberAndWords();
    nepDataPersonal = new NepDataPersonal();

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
  /*    this.addressService.getAllDistrict().subscribe((res: any) => {
          this.districtList = res.detail;
      });*/

        this.buildForm();
        if (ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepData)) {
            const number = ProposalCalculationUtils.calculateTotalFromProposalList(LoanDataKey.PROPOSE_LIMIT, this.cadOfferLetterApprovedDoc.assignedLoan);
            this.loanAmountTemplate.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
            this.loanAmountTemplate.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
            this.loanAmountTemplate.engNumber = number;
        } else {
            this.loanAmountTemplate = JSON.parse(this.cadOfferLetterApprovedDoc.nepData);
        }
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepDataPersonal)) {
            this.nepDataPersonal = JSON.parse(this.cadOfferLetterApprovedDoc.nepDataPersonal);
        }
        this.checkOfferLetter();
    }

    fillForm() {
        this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        let allGuarantors = '';
        if (!ObjectUtil.isEmpty(this.nepaliData)) {
            (this.nepaliData.guarantorDetails).forEach(guarantor => {
                allGuarantors = allGuarantors + guarantor.name + ', ';
            });
            allGuarantors = allGuarantors.slice(0, -2);
            allGuarantors = allGuarantors.replace(/,(?=[^,]*$)/, ' र');
            const customerAddress =
                this.nepaliData.permanentMunicipality + ' j8f g+= ' +
                this.nepaliData.permanentWard + ' , ' +
                this.nepaliData.permanentDistrict;
            const customerTempAddress =
                this.nepaliData.temporaryMunicipality + ' j8f g+= ' +
                this.nepaliData.temporaryWard + ' , ' +
                this.nepaliData.temporaryDistrict;
            this.form.patchValue({
                customerName: this.nepaliData.name ? this.nepaliData.name : '',
                customerAddress: customerAddress ? customerAddress : '',
                customerTemporaryAddress: customerTempAddress ? customerTempAddress : '',
                customerMunicipality: this.nepaliData.permanentMunicipalities.nepaliName ? this.nepaliData.permanentMunicipalities.nepaliName : '',
                customerWardNum: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
                customerDistrict: this.nepaliData.permanentDistrict.nepaliName ? this.nepaliData.permanentDistrict.nepaliName : '',
                signatoryCitizenshipNum: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
                signatoryCitizenshipIssueDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
                signatoryCitizenshipIssuePlace: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
                signatoryParentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
                signatoryGrandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
                temporaryMunicipality: this.nepaliData.temporaryMunicipalities.nepaliName ? this.nepaliData.temporaryMunicipalities.nepaliName : '',
                temporaryWardNum: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
                temporaryDistrict: this.nepaliData.temporaryDistrict.nepaliName ? this.nepaliData.temporaryDistrict.nepaliName : '',
                shreeName1: allGuarantors ? allGuarantors : '',
                financeBranch: this.nepDataPersonal.branchName ? this.nepDataPersonal.branchName : '',
                financeMunicipality: this.nepDataPersonal.branchMunVdc ? this.nepDataPersonal.branchMunVdc : '',
                financeWardNum: this.nepDataPersonal.branchWardNo ? this.nepDataPersonal.branchWardNo : '',
                financeDistrict: this.nepDataPersonal.branchDistrict ? this.nepDataPersonal.branchDistrict : '',
                financeTelephoneNum: this.nepaliData.branchTelNo ? this.nepaliData.branchTelNo : '',
                financeFaxNum: this.nepaliData.branchFaxNo ? this.nepaliData.branchFaxNo : '',
                financeEmail: this.nepaliData.branchEmail ? this.nepaliData.branchEmail : '',
                customerEmail: this.nepaliData.customerEmail ? this.nepaliData.customerEmail : '',
                customerMobile: this.nepaliData.contactNumber ? this.nepaliData.contactNumber : '',
                valuationDate: this.nepaliData.valuationDate ? this.nepaliData.valuationDate : '',
                valuatorName: this.nepaliData.valuatorName ? this.nepaliData.valuatorName : '',
                fairMarketValue: this.nepaliData.fairMarketValue ? this.nepaliData.fairMarketValue : '',
                distressValue: this.nepaliData.distressValue ? this.nepaliData.distressValue : '',
            });
            this.setEmptyGuarantors(this.nepaliData.guarantorDetails);
            this.setSecurityDetails(this.nepaliData.collateralDetails);
            console.log('security details', this.nepaliData.collateralDetails);

        }

        this.form.get(['loanFacilityTable', 0, 'amount']).patchValue(this.loanAmountTemplate.numberNepali);
        this.form.get(['loanFacilityTable', 0, 'amountInWords']).patchValue(this.loanAmountTemplate.nepaliWords);
        this.form.get(['loanFacilityTable', 0, 'loanPurpose']).patchValue(this.nepDataPersonal.purposeOfLoan);
        this.form.get(['loanFacilityTable', 0, 'interestFinalRate']).patchValue(this.nepDataPersonal.interestRate);
        this.form.get(['loanFacilityTable', 0, 'interestBaseRate']).patchValue(this.nepDataPersonal.baseRate);
        this.form.get(['loanFacilityTable', 0, 'interestPremiumRate']).patchValue(this.nepDataPersonal.premium);
        this.form.get(['loanFacilityTable', 0, 'interestTempDiscountRate']).patchValue(this.nepDataPersonal.discount);
        this.form.get(['loanFacilityTable', 0, 'serviceFeePercent']).patchValue(this.nepDataPersonal.serviceFeePercent);
        this.form.get(['loanFacilityTable', 0, 'serviceFeeAmount']).patchValue(this.nepDataPersonal.serviceFeeAmount);
        this.form.get(['loanFacilityTable', 0, 'cibCharges']).patchValue(this.nepDataPersonal.cibCharges);
        this.form.get(['loanFacilityTable', 0, 'interestInstallmentPaymentFrequency']).patchValue(this.nepDataPersonal.interestInstallmentPaymentFrequency);
        this.form.get(['loanFacilityTable', 0, 'loanMaturityDateAD']).patchValue(this.nepDataPersonal.loanMaturityDateAD);
        this.form.get(['loanFacilityTable', 0, 'loanMaturityDateBS']).patchValue(this.nepDataPersonal.loanMaturityDateBS);
        this.form.get(['loanFacilityTable', 0, 'tenureOfLoanInMonths']).patchValue(this.nepDataPersonal.tenureOfLoanInMonths);
        this.form.get(['loanFacilityTable', 0, 'loanTypeNepali']).patchValue(this.nepDataPersonal.loanType);
        this.form.get(['loanFacilityTable', 0, 'loanTypeEnglish']).patchValue(this.nepDataPersonal.typeOfLoanInEnglish);
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_PERSONAL).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_PERSONAL);
            this.fillForm();
            if (ObjectUtil.isEmpty(this.nepaliData.collateralDetails)) {
                this.addEmptySecurityDetail();
            }
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.fillForm();
            this.setEmptyGuarantors(initialInfo.guarantorDetails);
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
        console.log('data', data);
        const collateralAddress =
            this.nepaliData.collateralMunVdc + ' j8f g+= ' +
            this.nepaliData.collateralWardNo + ' , ' +
            this.nepaliData.collateralDistrict;
        const formArray = this.form.get('securityDetails') as FormArray;
        if (data.length === 0) {
            this.addEmptySecurityDetail();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                name: [value.collateralName],
                parentName: [value.collateralFatherName],
                grandParentName: [value.collateralGrandFatherName],
                address: collateralAddress,
                jaggaDistrict: [value.collateralDistrict],
                jaggaWard: [value.collateralMunVdc],
                hal: [value.collateralTemporaryMunVdc],
                jaggaKittaNum: [value.plotNo],
                jaggaArea: [value.areaOfCollateral],
                jaggaSiNum: [value.seatNo],
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
        data.forEach((value) => {
            formArray.push(this.formBuilder.group({
                jamaniKartaName: [value.name],
                guarantorCitizenshipNo: [value.citizenNumber],
                guarantorIssuedDate: [value.issuedYear],
                guarantorCitizenIssuedOffice: [value.issuedPlace],
                guarantorLegalDocumentAddress: [value.guarantorLegalDocumentAddress],
                name: [value.name],
                officeType: [value.officeType],
                branchName: [value.branchName],
                loanApprovalDate: this.loanAmountTemplate.initDate,
                loanApprovalNo: this.loanAmountTemplate.loanApprovalNo,
                loanHolderName: [value.loanHolderName],
                guarantorDistrict: [value.guarantorPermanentDistrict.nepaliName],
                municipalityName: [value.guarantorPermanentMunicipality.nepaliName],
                guarantorWardNo: [value.guarantorPermanentWard],
                guarantorRelation: [value.relationship],
                fatherInLawName: [value.guarantorFatherInLawName],
                spouseOrFatherName: [value.guarantorSpouseName],
                guarantorMobileNo: [value.guarantorMobileNumber],
                guarantorEmail: [value.guarantorEmailAddress],
                guarantorDate: [value.guarantorDate],
            }));
        });
    }

    /*setEmptyWitnesses(data) {
        const formArray = this.form.get('witnessDetails') as FormArray;
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                witnessName: [value.witnessName],
                witnessAddress: [value.witnessAddress],
            }));
        });
    }*/

    buildGuarantorDetails() {
        return this.formBuilder.group({
            jamaniKartaName: [undefined],
            guarantorCitizenshipNo: [undefined],
            guarantorIssuedDate: [undefined],
            guarantorCitizenIssuedOffice: [undefined],
            name: [undefined],
            guarantorLegalDocumentAddress: [undefined],
            officeType: [undefined],
            branchName: [undefined],
            loanApprovalDate: [undefined],
            loanApprovalNo: [undefined],
            loanHolderName: [undefined],
            guarantorDistrict: [undefined],
            municipalityName: [undefined],
            guarantorWardNo: [undefined],
            guarantorRelation: [undefined],
            fatherInLawName: [undefined],
            spouseOrFatherName: [undefined],
            guarantorMobileNo: [undefined],
            guarantorEmail: [undefined],
            guarantorDate: [undefined],
        });
    }

    /*buildWitnessDetails() {
        return this.formBuilder.group({
            witnessName: [undefined],
            witnessAddress: [undefined]
        });
    }*/

    addEmptyGuarantor() {
        (this.form.get('guarantors') as FormArray).push(this.buildGuarantorDetails());
    }

    /*addEmptyWitness() {
        (this.form.get('witnessDetails') as FormArray).push(this.buildWitnessDetails());
    }*/

    removeGuarantor(index) {
        (this.form.get('guarantors') as FormArray).removeAt(index);
    }

    /*removeWitness(index) {
        (this.form.get('witnessDetails') as FormArray).removeAt(index);
    }*/

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

            securityDetails: this.formBuilder.array([]),

            valuationDate: [undefined],
            valuatorName: [undefined],
            fairMarketValue: [undefined],
            distressValue: [undefined],
            dhitoLekhi: [undefined],

            shreeName1: [undefined],
            shreeAmount: [undefined],
            shreeAmountInWord: [undefined],

            amount2: [undefined],
            amountInWords2: [undefined],
            amount3: [undefined],
            amountInWords3: [undefined],
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
            witnessDetails: this.formBuilder.array([]),

            sahichhapEmployee: [undefined],
            docYear: [undefined],
            docMonth: [undefined],
            docDate: [undefined],
            docRoj: [undefined],
            officeType: [undefined],
            branchName: [undefined],
            loanApprovalDate: [undefined],
            loanApprovalNo: [undefined],
            loanHolderName: [undefined],
            guarantorDistrict: [undefined],
            municipalityName: [undefined],
            guarantorWardNo: [undefined],
            guarantorRelation: [undefined],
            fatherInLawName: [undefined],
            spouseOrFatherName: [undefined],
            guarantorMobileNo: [undefined],
            guarantorEmail: [undefined],
            guarantorDate: [undefined],
            letterSubmittedDate: [undefined],
            loanFacilityTable: this.formBuilder.array([this.addLoanFacilityTable()]),
            witnessName: [undefined],
            witnessAddress: [undefined],
            witnessName2: [undefined],
            witnessAddress2: [undefined]
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
            serviceFeePercent: [undefined],
            serviceFeeAmount: [undefined],
            cibCharges: [undefined],
            interestInstallmentPaymentFrequency: [undefined],
            loanMaturityDateAD: [undefined],
            loanMaturityDateBS: [undefined],
            tenureOfLoanInMonths: [undefined],

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
                serviceFeePercent: [value.serviceFeePercent],
                serviceFeeAmount: [value.serviceFeeAmount],
                cibCharges: [value.cibCharges],
                interestInstallmentPaymentFrequency: [value.interestInstallmentPaymentFrequency],
                loanMaturityDateAD: [value.loanMaturityDateAD],
                loanMaturityDateBS: [value.loanMaturityDateBS],
                tenureOfLoanInMonths: [value.tenureOfLoanInMonths],
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

    updateServiceCharge(i) {
        const amount1 = this.form.get(['loanFacilityTable', i, 'amount']).value;
        const serviceFeePercent1 = this.form.get(['loanFacilityTable', i, 'serviceFeePercent']).value;
        let amount = 0;
        const serviceFeePercent = Number(this.nepToEngNumberPipe.transform(serviceFeePercent1) / 100);

        if (i > 0) {
            amount = Number(this.nepToEngNumberPipe.transform(amount1));
        } else {
            amount = this.loanAmountTemplate.engNumber;
       }
        let value = Number(serviceFeePercent * amount).toFixed(2);
        value = this.engToNepNumberPipe.transform(value.toString());
        this.form.get(['loanFacilityTable', i, 'serviceFeeAmount']).patchValue(value);
    }
}
