import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../mega-offer-letter-const';
import {OfferLetteDocrTypeEnum} from '../../model/OfferLetteDocrTypeEnum';
import {OfferLetterDocType} from '../../../cad-documents/cad-document-core/model/OfferLetteDocrTypeEnum';
import {ToastService} from '../../../../@core/utils';
import {CustomerOfferLetterService} from '../../../loan/service/customer-offer-letter.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {OfferDocument} from '../../model/OfferDocument';
import {NepaliEditor} from '../../../../@core/utils/constants/nepaliEditor';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../model/CadDocStatus';

@Component({
  selector: 'app-offer-letter-of-all-other-loan-retail-loan',
  templateUrl: './offer-letter-of-all-other-loan-retail-loan.component.html',
  styleUrls: ['./offer-letter-of-all-other-loan-retail-loan.component.scss']
})
export class OfferLetterOfAllOtherLoanRetailLoanComponent implements OnInit {

    RetailLoan: FormGroup;
    // todo replace enum constant string compare
    smeLoanHolderInfo;
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;
    selectedLoanTypeArray = [];
    overdraft = false;
    demandLoan = false;
    fixedTermLoan = false;
    hirePurchase = false;
    letterOfCredit = false;
    trustReceipt = false;
    cashCredit = false;
    shortTermLoan = false;
    bankGuarantee = false;
    listOfLoan = [];
    loanTypes = [
        {key: 'Overdraft', value: 'अधिबिकर्ष(Overdraft)'},
        {key: 'DemandLoan', value: 'डिमाण्ड कर्जा(Demand Loan)'},
        {key: 'FixedTermLoan', value: 'आवधिक कर्जा (Fixed Term Loan)'},
        {key: 'HirePurchase', value: 'सवारी साधन कर्जा (Hire Purchase)'},
        {key: 'LetterOfCredit', value: 'प्रतितपत्र (Letter of Credit)'},
        {key: 'TrustReceipt', value: 'विश्वास रसीद (Trust Receipt)'},
        {key: 'CashCredit', value: 'नगद क्रेडिट (Cash Credit)'},
        {key: 'ShortTermLoan', value: 'अल्पकालीन कर्जा (Short Term Loan)'},
        {key: 'BankGuarantee', value: 'बैंक जमानत (Bank Guarantee)'},
    ];
    ckeConfig = NepaliEditor.CK_CONFIG;
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;


    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private toastService: ToastService,
                private administrationService: CreditAdministrationService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetterData();
        this.chooseLoanType(this.selectedLoanTypeArray);
        this.listOfLoan.push(this.RetailLoan.get('loanTypeSelectedArray').value);
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder.nepData)) {
            this.smeLoanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
            console.log(this.smeLoanHolderInfo);
        }
    }

    buildForm() {
        this.RetailLoan = this.formBuilder.group({
            minChargeAmtWordSme: [undefined],
            minChargeAmtSme: [undefined],
            emiAmtInWordSme: [undefined],
            emiAmtSme: [undefined],
            loanAmountInWordSme: [undefined],
            loanAmountSme: [undefined],
            referenceNo: [undefined],
            overdrafLoanPrices: [undefined],
            date: [undefined],
            address: [undefined],
            to: [undefined],
            sector: [undefined],
            mobileNo: [undefined],
            name: [undefined],
            borrowerLoanType: [undefined],
            borrowerName: [undefined],
            loanBorrowerOneName: [undefined],
            loanBorrowerAddress: [undefined],
            loanBorrowerContactNo: [undefined],
            loanBorrowerName: [undefined],
            signatureDate: [undefined],
            totalLoanAmount: [undefined],
            totalLoanAmountInWord: [undefined],
            currentNonMovableAsset: [undefined],
            equalLoanAsset: [undefined],
            loanAsset: [undefined],
            loanTypeSelectedArray: [undefined],
            printPageCount: [undefined],
            overdraftLoan: this.formBuilder.array([]),
            demandLoanType: this.formBuilder.array([]),
            fixTermLoan: this.formBuilder.array([]),
            hirePurchaseLoan: this.formBuilder.array([]),
            letterOfCredit: this.formBuilder.array([]),
            trustReceipt: this.formBuilder.array([]),
            cashCredit: this.formBuilder.array([]),
            shortTermLoan: this.formBuilder.array([]),
            bankGuarantee: this.formBuilder.array([]),
            multiCollateral: this.formBuilder.array([]),
            tableData: this.formBuilder.array([]),
            securityNotes: [undefined],
            citizenShipNo1: [undefined],
            citizenShipNo2: [undefined],
            tempMun: [undefined],
            tempDis: [undefined],
            tempWard: [undefined],
            wardNo: [undefined],
            onlySelf: [undefined],
            faxNo: [undefined],
            postBox: [undefined],
            branchDis: [undefined],
            marfatBank: [undefined],
            branchTelNo: [undefined],
            branchFax: [undefined],
            borrowerTempProvince: [undefined],
            borrowerTempDis: [undefined],
            borrowerTempMun: [undefined],
            borrowerPerWard: [undefined],
            borrowerName2: [undefined],
            branchName: [undefined],
            borrowerTempWard: [undefined],
            borrowerTempTole: [undefined],
            borrowerHouseNo: [undefined],
            borrowerTempStreet: [undefined],
            borrowerEmail: [undefined],
            borrowerPerMun: [undefined],
            borrowerPerDis: [undefined],
            borrowerMobile: [undefined],
            issuedDate: [undefined],
            instRegVdcMun: [undefined],
            instRegWardNo: [undefined],
            instRegDist: [undefined],
            instRegProvince: [undefined],
            instRegProvinceNo: [undefined],
            compRegOffice: [undefined],
            authPersonName: [undefined],
            authPersonMobileNo: [undefined],
            authPersonEmail: [undefined],
            authPersonDist: [undefined],
            authPersonVdcMun: [undefined],
            authPersonWard: [undefined],
            facOwnerName: [undefined],
            facOffice: [undefined],
            facDistrict: [undefined],
            facVdcMun: [undefined],
            facWardNo: [undefined],
            facCurrentDistrict: [undefined],
            facCurrentVdcMun: [undefined],
            facCurrentWardNo: [undefined],
            noOfVehiclesToFinance: [undefined],
            vehicleModel: [undefined],
            plotNo: [undefined],
            plotArea: [undefined],
            valuatorName: [undefined],
            fmvAmount: [undefined],
            fmvAmountInWord: [undefined],
            dvAmount: [undefined],
            dvAmountInWord: [undefined],
            reviewYearIncreased: [undefined],
            DebtEquityAmount: [undefined],
            vatBillPercent: [undefined],
            voucher1District: [undefined],
            voucher1VdcMun: [undefined],
            voucher1Ward: [undefined],
            voucher2District: [undefined],
            voucher2VdcMun: [undefined],
            voucher2Ward: [undefined],
            guarantorName: [undefined],
            guarantorPerDistrict: [undefined],
            guarantorPerVdcMun: [undefined],
            guarantorPerWard: [undefined],
            guarantorTempPradesh: [undefined],
            guarantorTempDist: [undefined],
            guarantorTempVdcMun: [undefined],
            guarantorTempWard: [undefined],
            guarantorTempTole: [undefined],
            guarantorTempHouseNo: [undefined],
            guarantorTempStreetName: [undefined],
            guarantorEmail: [undefined],
            guarantorMobile: [undefined],
            adminFeeFundedAmt: [undefined],
            adminFeeFundedAmtWord: [undefined],
            adminFeeNonFundedAmt: [undefined],
            adminFeeNonFundedAmtWord: [undefined],
            fiscalYear: [undefined],
            quarter: [undefined],
            averageBaseRate: [undefined],
            sawariSadhan: [undefined],
            assestNepali: [undefined],
            assestEnglish: [undefined],
            bankersClause: [undefined],
            loanReviewDate: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined]
        });

    }

    overdraftFormGroup(): FormGroup {
        return this.formBuilder.group({
            baseRate: [undefined],
            loanAmountInWord: [undefined],
            loanAmount: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            overdrafLoanEndOfFiscalYear: [undefined],
            overdrafLoanPayment: [undefined],
            overdrafLoanServiceRate: [undefined],
            serviceChargeAmount: [undefined],
            overdrafLoanPrices: [undefined],
            overdrafLoanReturned: [undefined],
            dasturFlag: [true],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            purposeOfLoan: [undefined],
            loanReviewDate: [undefined],
            preview: [undefined],
            drawdownPercent: [undefined],
            purposeDate: [undefined]
        });
    }

    addMoreOverdraftLoan() {
        (this.RetailLoan.get('overdraftLoan') as FormArray).push(this.overdraftFormGroup());
    }

    removeOverDraftLoan(index: number) {
        (this.RetailLoan.get('overdraftLoan') as FormArray).removeAt(index);
    }

    demandRetailLoanGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            demandLoanPurpose: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            demandLoanNetTradingAsset: [undefined],
            demandLoanLimitDuration: [undefined],
            demandLoanLimitDurationAmount: [undefined],
            demandLoanDasturAmount: [undefined],
            yearlyRate: [undefined],
            demandLoanDurationRatio: [undefined],
            dasturFlag: [true],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            purposeOfLoan: [undefined],
            loanReviewDate: [undefined],
            purpose: [undefined],
            preview: [undefined],
            drawdownPercent: [undefined],
            noOfEmi: [undefined],
            emiAmtInWord: [undefined],
            emiAmt: [undefined],
            engDate: [undefined],
            premiumInterestRate: [undefined],
        });
    }

    addMoreDemandLoan() {
        (this.RetailLoan.get('demandLoanType') as FormArray).push(this.demandRetailLoanGroup());
    }

    removeDemandLoan(index: number) {
        (this.RetailLoan.get('demandLoanType') as FormArray).removeAt(index);
    }

    fixTermRetailLoanGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            termLoanPlanBankName: [undefined],
            termLoanTime: [undefined],
            termLoanMonthlyTerm: [undefined],
            loanAmountInNumber: [undefined],
            loanAkchyarupi: [undefined],
            termLoanMonth: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            termLoanBankName: [undefined],
            termLoanPaymentFee: [undefined],
            termLoanBorrowPercent: [undefined],
            termLoanPaymentAmount: [undefined],
            serviceChargeAmount: [undefined],
            secondtermLoan: [undefined],
            secondtermLoanInWord: [undefined],
            termLoanTwoBankName: [undefined],
            termLoanTwoTime: [undefined],
            termLoanTwoMonthlyTerm: [undefined],
            termLoanTwoAmountInNumber: [undefined],
            termLoanTwoAmountInWord: [undefined],
            fixedTermTwoLoanMonth: [undefined],
            secondBaseRate: [undefined],
            secondPremiumRate: [undefined],
            secondYearlyRate: [undefined],
            termLoanTwoPaymentBankName: [undefined],
            termLoanTwoPaymentFee: [undefined],
            termLoanTwoBorrowPercent: [undefined],
            termLoanTwoPaymentAmount: [undefined],
            secondServiceChargeAmount: [undefined],
            dasturFlag: [true],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            purposeOfLoan: [undefined],
            loanReviewDate: [undefined],
            preview: [undefined],
            drawdownPercent: [undefined],
            noOfEmi: [undefined],
            emiAmtInWord: [undefined],
            emiAmt: [undefined],
            engDate: [undefined],
            premiumInterestRate: [undefined],
            provisional: [undefined],
            netFixAssestPercent: [undefined],
            moratoriumPeriod: [undefined],
        });
    }

    addMoreFixTermLoan() {
        (this.RetailLoan.get('fixTermLoan') as FormArray).push(this.fixTermRetailLoanGroup());
    }

    removeFixTermLoan(index: number) {
        (this.RetailLoan.get('fixTermLoan') as FormArray).removeAt(index);
    }

    hirePurchaseLoan(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            minChargeAmtInWord: [undefined],
            minChargeAmt: [undefined],
            acceptCommissionRate: [undefined],
            lcCommissionRate: [undefined],
            lcCashMargin: [undefined],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
        });
    }

    addMoreHirePurchaseLoan() {
        (this.RetailLoan.get('hirePurchaseLoan') as FormArray).push(this.hirePurchaseLoan());
    }

    removeHirePurchaseLoan(index: number) {
        (this.RetailLoan.get('hirePurchaseLoan') as FormArray).removeAt(index);
    }

    letterOfCreditFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            letterOfCreditMargin: [undefined],
            letterOfCreditMarginPercent: [undefined],
            letterOfCreditCurrentFiscalYear: [undefined],
            letterOfCreditCommission: [undefined],
            letterOfCreditCommissionPercent: [undefined],
            letterOfCreditDastur: [undefined],
            dasturFlag: [true],
            trTenure: [undefined],
            trDrawdown: [undefined],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
            premiumRate: [undefined],
            premium: [undefined]
        });
    }

    addMoreLetterOfCreditForm() {
        (this.RetailLoan.get('letterOfCredit') as FormArray).push(this.letterOfCreditFormGroup());
    }

    removeLetterOfCreditForm(index: number) {
        (this.RetailLoan.get('letterOfCredit') as FormArray).removeAt(index);
    }

    trustReceiptFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            trustReceiptPayment: [undefined],
            trustReceiptTerm: [undefined],
            trustReceiptFixTerm: [undefined],
            trustReceiptDastur: [undefined],
            dasturFlag: [true],
            dlTenure: [undefined],
            dlDrawdown: [undefined],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
            premium: [undefined]
        });
    }

    addMoreTrustReceiptForm() {
        (this.RetailLoan.get('trustReceipt') as FormArray).push(this.trustReceiptFormGroup());
    }

    removeTrustReceiptForm(index: number) {
        (this.RetailLoan.get('trustReceipt') as FormArray).removeAt(index);
    }

    cashCreditFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            casCreditAim: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            cashCreditPay: [undefined],
            cashCreditPayTill: [undefined],
            cashCreditTerm: [undefined],
            cashCreditFixTerm: [undefined],
            cashCreditSecurity: [undefined],
            cashCreditDastur: [undefined],
            dasturFlag: [true],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
            bbgCommission: [undefined],
            pbgCommission: [undefined],
            apgCommission: [undefined],
            csgCommission: [undefined],
            bgPurpose: [undefined],
            minChargeAmtInWord: [undefined],
            minChargeAmt: [undefined],
            lcCashMargin: [undefined],
        });
    }

    addMoreCashCreditForm() {
        (this.RetailLoan.get('cashCredit') as FormArray).push(this.cashCreditFormGroup());
    }

    removeCashCreditForm(index: number) {
        (this.RetailLoan.get('cashCredit') as FormArray).removeAt(index);
    }

    shortTermRetailLoanGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            shortTermLoanAim: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            shortTermLoanPay: [undefined],
            shortTermLoanPayTill: [undefined],
            shortTermLoanTimePlan: [undefined],
            shortTermLoanTimePlanTill: [undefined],
            shortTermLoanDastur: [undefined],
            dasturFlag: [true],
            noOfVehiclesToFinance: [undefined],
            vehicleModel: [undefined],
            newOrOld: [undefined],
            vatBillDrawdown: [undefined],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
            noOfEmi: [undefined],
            emiAmtInWord: [undefined],
            emiAmt: [undefined],
            premium: [undefined]
        });
    }

    addMoreShortTermRetailLoan() {
        (this.RetailLoan.get('shortTermLoan') as FormArray).push(this.shortTermRetailLoanGroup());
    }

    removeShortTermRetailLoan(index: number) {
        (this.RetailLoan.get('shortTermLoan') as FormArray).removeAt(index);
    }

    bankGuaranteeFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
            adminFeeFundedAmt: [undefined],
            adminFeeFundedAmtWord: [undefined],
            adminFeeNonFundedAmt: [undefined],
            adminFeeNonFundedAmtWord: [undefined],
            renewalFee: [undefined],
            premium: [undefined]
        });
    }

    addMoreBankGuaranteeForm() {
        (this.RetailLoan.get('bankGuarantee') as FormArray).push(this.bankGuaranteeFormGroup());
    }

    removeBankGuaranteeForm(index: number) {
        (this.RetailLoan.get('bankGuarantee') as FormArray).removeAt(index);
    }


    setOverDrafLoanData(details) {
        const overDraftDetails = this.RetailLoan.get('overdraftLoan') as FormArray;
        details.forEach(data => {
            overDraftDetails.push(
                this.formBuilder.group({
                    baseRate: [data.baseRate],
                    loanAmountInWord: [data.loanAmountInWord],
                    loanAmount: [data.loanAmount],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    overdrafLoanEndOfFiscalYear: [data.overdrafLoanEndOfFiscalYear],
                    overdrafLoanPayment: [data.overdrafLoanPayment],
                    overdrafLoanServiceRate: [data.overdrafLoanServiceRate],
                    serviceChargeAmount: [data.serviceChargeAmount],
                    overdrafLoanPrices: [data.overdrafLoanPrices],
                    overdrafLoanReturned: [data.overdrafLoanReturned],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    purposeOfLoan: [data.purposeOfLoan],
                    loanReviewDate: [data.loanReviewDate],
                    preview: [data.preview],
                    drawdownPercent: [data.drawdownPercent],
                    purposeDate: [data.purposeDate]
                })
            );
        });
    }

    setdemandLoanData(details) {
        const demandLoanDetails = this.RetailLoan.get('demandLoanType') as FormArray;
        details.forEach(data => {
            demandLoanDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    demandLoanPurpose: [data.demandLoanPurpose],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    demandLoanNetTradingAsset: [data.demandLoanNetTradingAsset],
                    demandLoanLimitDuration: [data.demandLoanLimitDuration],
                    demandLoanLimitDurationAmount: [data.demandLoanLimitDurationAmount],
                    demandLoanDasturAmount: [data.demandLoanDasturAmount],
                    yearlyRate: [data.yearlyRate],
                    demandLoanDurationRatio: [data.demandLoanDurationRatio],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    purposeOfLoan: [data.purposeOfLoan],
                    loanReviewDate: [data.loanReviewDate],
                    purpose: [data.purpose],
                    preview: [data.preview],
                    drawdownPercent: [data.drawdownPercent],
                    noOfEmi: [data.noOfEmi],
                    emiAmtInWord: [data.emiAmtInWord],
                    emiAmt: [data.emiAmt],
                    engDate: [data.engDate],
                    premiumInterestRate: [data.premiumInterestRate],
                })
            );
        });
    }

    setFixTermLoanData(details) {
        const fixTermLoanDetails = this.RetailLoan.get('fixTermLoan') as FormArray;
        details.forEach(data => {
            fixTermLoanDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    termLoanPlanBankName: [data.termLoanPlanBankName],
                    termLoanTime: [data.termLoanTime],
                    termLoanMonthlyTerm: [data.termLoanMonthlyTerm],
                    loanAmountInNumber: [data.loanAmountInNumber],
                    loanAkchyarupi: [data.loanAkchyarupi],
                    termLoanMonth: [data.termLoanMonth],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    termLoanBankName: [data.termLoanBankName],
                    termLoanPaymentFee: [data.termLoanPaymentFee],
                    termLoanBorrowPercent: [data.termLoanBorrowPercent],
                    termLoanPaymentAmount: [data.termLoanPaymentAmount],
                    serviceChargeAmount: [data.serviceChargeAmount],
                    secondtermLoan: [data.secondtermLoan],
                    secondtermLoanInWord: [data.secondtermLoanInWord],
                    termLoanTwoBankName: [data.termLoanTwoBankName],
                    termLoanTwoTime: [data.termLoanTwoTime],
                    termLoanTwoMonthlyTerm: [data.termLoanTwoMonthlyTerm],
                    termLoanTwoAmountInNumber: [data.termLoanTwoAmountInNumber],
                    termLoanTwoAmountInWord: [data.termLoanTwoAmountInWord],
                    fixedTermTwoLoanMonth: [data.fixedTermTwoLoanMonth],
                    secondBaseRate: [data.secondBaseRate],
                    secondPremiumRate: [data.secondPremiumRate],
                    secondYearlyRate: [data.secondYearlyRate],
                    termLoanTwoPaymentBankName: [data.termLoanTwoPaymentBankName],
                    termLoanTwoPaymentFee: [data.termLoanTwoPaymentFee],
                    termLoanTwoBorrowPercent: [data.termLoanTwoBorrowPercent],
                    termLoanTwoPaymentAmount: [data.termLoanTwoPaymentAmount],
                    secondServiceChargeAmount: [data.secondServiceChargeAmount],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    purposeOfLoan: [data.purposeOfLoan],
                    loanReviewDate: [data.loanReviewDate],
                    purpose: [data.purpose],
                    preview: [data.preview],
                    drawdownPercent: [data.drawdownPercent],
                    noOfEmi: [data.noOfEmi],
                    emiAmtInWord: [data.emiAmtInWord],
                    emiAmt: [data.emiAmt],
                    engDate: [data.engDate],
                    premiumInterestRate: [data.premiumInterestRate],
                    provisional: [data.provisional],
                    netFixAssestPercent: [data.netFixAssestPercent],
                    moratoriumPeriod: [data.moratoriumPeriod],
                })
            );
        });
    }

    setHirePurchaseLoanData(details) {
        const hirePurchaseDetails = this.RetailLoan.get('hirePurchaseLoan') as FormArray;
        details.forEach(data => {
            hirePurchaseDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    hirePurchaseLoanPlanBankName: [data.hirePurchaseLoanPlanBankName],
                    hirePurchaseLoanTime: [data.hirePurchaseLoanTime],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    hirePurchaseLoanTerm: [data.hirePurchaseLoanTerm],
                    loanAmountInNumber: [data.loanAmountInNumber],
                    loanAkchyarupi: [data.loanAkchyarupi],
                    hirePurchaseLoanMonth: [data.hirePurchaseLoanMonth],
                    hirPurchaseLoanPaymentBankName: [data.hirPurchaseLoanPaymentBankName],
                    hirPurchaseLoanPaymentPercent: [data.hirPurchaseLoanPaymentPercent],
                    hirePurchaseLoanPaymentMonth: [data.hirePurchaseLoanPaymentMonth],
                    hirePurchaseLoanServiceCharge: [data.hirePurchaseLoanServiceCharge],
                    serviceChargeAmount: [data.serviceChargeAmount],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    minChargeAmtInWord: [data.minChargeAmtInWord],
                    minChargeAmt: [data.minChargeAmt],
                    acceptCommissionRate: [data.acceptCommissionRate],
                    lcCommissionRate: [data.lcCommissionRate],
                    lcCashMargin: [data.lcCashMargin],
                })
            );
        });
    }

    setLetterOfCreditData(details) {
        const letterOfCreditDetails = this.RetailLoan.get('letterOfCredit') as FormArray;
        details.forEach(data => {
            letterOfCreditDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    letterOfCreditMargin: [data.letterOfCreditMargin],
                    letterOfCreditMarginPercent: [data.letterOfCreditMarginPercent],
                    letterOfCreditCurrentFiscalYear: [data.letterOfCreditCurrentFiscalYear],
                    letterOfCreditCommission: [data.letterOfCreditCommission],
                    letterOfCreditCommissionPercent: [data.letterOfCreditCommissionPercent],
                    letterOfCreditDastur: [data.letterOfCreditDastur],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    trTenure: [data.trTenure],
                    trDrawdown: [data.trDrawdown],
                    premiumRate: [data.premiumRate],
                    premium: [data.premium]
                })
            );
        });
    }

    setTrustReceiptData(details) {
        const trustReceiptDetails = this.RetailLoan.get('trustReceipt') as FormArray;
        details.forEach(data => {
            trustReceiptDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    trustReceiptPayment: [data.trustReceiptPayment],
                    trustReceiptTerm: [data.trustReceiptTerm],
                    trustReceiptFixTerm: [data.trustReceiptFixTerm],
                    trustReceiptDastur: [data.trustReceiptDastur],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    dlTenure: [data.dlTenure],
                    dlDrawdown: [data.dlDrawdown],
                    premium: [data.premium]
                })
            );
        });
    }

    setCashCreditData(details) {
        const cashCreditDetails = this.RetailLoan.get('cashCredit') as FormArray;
        details.forEach(data => {
            cashCreditDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    casCreditAim: [data.casCreditAim],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    cashCreditPay: [data.cashCreditPay],
                    cashCreditPayTill: [data.cashCreditPayTill],
                    cashCreditTerm: [data.cashCreditTerm],
                    cashCreditSecurity: [data.cashCreditSecurity],
                    cashCreditFixTerm: [data.cashCreditFixTerm],
                    cashCreditDastur: [data.cashCreditDastur],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    bbgCommission: [data.bbgCommission],
                    pbgCommission: [data.pbgCommission],
                    apgCommission: [data.apgCommission],
                    csgCommission: [data.csgCommission],
                    bgPurpose: [data.bgPurpose],
                    minChargeAmtInWord: [data.minChargeAmtInWord],
                    minChargeAmt: [data.minChargeAmt],
                    lcCashMargin: [data.lcCashMargin],
                })
            );
        });
    }

    setShortTermLoanData(details) {
        const shortTermLoanDetails = this.RetailLoan.get('shortTermLoan') as FormArray;
        details.forEach(data => {
            shortTermLoanDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    shortTermLoanAim: [data.shortTermLoanAim],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    shortTermLoanPay: [data.shortTermLoanPay],
                    shortTermLoanPayTill: [data.shortTermLoanPayTill],
                    shortTermLoanTimePlan: [data.shortTermLoanTimePlan],
                    shortTermLoanTimePlanTill: [data.shortTermLoanTimePlanTill],
                    shortTermLoanDastur: [data.shortTermLoanDastur],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    noOfVehiclesToFinance: [data.noOfVehiclesToFinance],
                    vehicleModel: [data.vehicleModel],
                    newOrOld: [data.newOrOld],
                    vatBillDrawdown: [data.vatBillDrawdown],
                    noOfEmi: [data.noOfEmi],
                    emiAmtInWord: [data.emiAmtInWord],
                    emiAmt: [data.emiAmt],
                    premium: [data.premium]
                })
            );
        });
    }

    setBankGuaranteeData(details) {
        const bankGuaranteeDetails = this.RetailLoan.get('bankGuarantee') as FormArray;
        details.forEach(data => {
            bankGuaranteeDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    bankGuaranteeAmountAim: [data.bankGuaranteeAmountAim],
                    bankGuaranteeCommission: [data.bankGuaranteeCommission],
                    bankGuaranteeTimePlan: [data.bankGuaranteeTimePlan],
                    bankGuaranteeMargin: [data.bankGuaranteeMargin],
                    bankGuaranteeDastur: [data.bankGuaranteeDastur],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    adminFeeFundedAmt: [data.adminFeeFundedAmt],
                    adminFeeFundedAmtWord: [data.adminFeeFundedAmtWord],
                    adminFeeNonFundedAmt: [data.adminFeeNonFundedAmt],
                    adminFeeNonFundedAmtWord: [data.adminFeeNonFundedAmtWord],
                    renewalFee: [data.renewalFee],
                    premium: [data.premium]
                })
            );
        });
    }


    checkOfferLetterData() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.ALL_OTHER_LOAN_RETAIL_LOAN).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.addMoreOverdraftLoan();
            this.addMoreDemandLoan();
            this.addMoreFixTermLoan();
            this.addMoreHirePurchaseLoan();
            this.addMoreLetterOfCreditForm();
            this.addMoreTrustReceiptForm();
            this.addMoreCashCreditForm();
            this.addMoreShortTermRetailLoan();
            this.addMoreBankGuaranteeForm();
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.ALL_OTHER_LOAN_RETAIL_LOAN);
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            console.log(initialInfo);
            this.initialInfoPrint = initialInfo;
            console.log(this.offerLetterDocument);
            this.existingOfferLetter = true;
            this.RetailLoan.patchValue(initialInfo, {emitEvent: false});

            this.selectedLoanTypeArray = initialInfo.loanTypeSelectedArray;
            this.chooseLoanType(this.selectedLoanTypeArray);
            this.setOverDrafLoanData(initialInfo.overdraftLoan);
            this.setdemandLoanData(initialInfo.demandLoanType);
            this.setFixTermLoanData(initialInfo.fixTermLoan);
            this.setHirePurchaseLoanData(initialInfo.hirePurchaseLoan);
            this.setLetterOfCreditData(initialInfo.letterOfCredit);
            this.setTrustReceiptData(initialInfo.trustReceipt);
            this.setCashCreditData(initialInfo.cashCredit);
            this.setShortTermLoanData(initialInfo.shortTermLoan);
            this.setBankGuaranteeData(initialInfo.bankGuarantee);
            this.initialInfoPrint = initialInfo;
        }
    }

    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() === this.offerLetterConst.value
                (this.offerLetterConst.ALL_OTHER_LOAN_RETAIL_LOAN).toString()) {
                    this.RetailLoan.get('loanTypeSelectedArray').patchValue(this.selectedLoanTypeArray);
                    offerLetterPath.initialInformation = JSON.stringify(this.RetailLoan.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.ALL_OTHER_LOAN_RETAIL_LOAN);
            this.RetailLoan.get('loanTypeSelectedArray').patchValue(this.selectedLoanTypeArray);
            offerDocument.initialInformation = JSON.stringify(this.RetailLoan.value);
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

    chooseLoanType(selectedLoanTypeArray) {
        this.selectedLoanTypeArray = selectedLoanTypeArray;
        this.overdraft = this.demandLoan = this.fixedTermLoan = this.hirePurchase = this.letterOfCredit
            = this.trustReceipt = this.cashCredit = this.shortTermLoan = this.bankGuarantee = false;
        selectedLoanTypeArray.forEach(selectedValue => {
            switch (selectedValue) {
                case 'Overdraft':
                    this.overdraft = true;
                    break;
                case 'DemandLoan':
                    this.demandLoan = true;
                    break;
                case 'FixedTermLoan':
                    this.fixedTermLoan = true;
                    break;
                case 'HirePurchase':
                    this.hirePurchase = true;
                    break;
                case 'LetterOfCredit':
                    this.letterOfCredit = true;
                    break;
                case 'TrustReceipt':
                    this.trustReceipt = true;
                    break;
                case 'CashCredit':
                    this.cashCredit = true;
                    break;
                case 'ShortTermLoan':
                    this.shortTermLoan = true;
                    break;
                case 'BankGuarantee':
                    this.bankGuarantee = true;
                    break;
            }
        });
    }


    changeToNepAmount(event: any, i, formArrayName, formControlName) {
        this.RetailLoan.get([formArrayName, i, formControlName]).patchValue(event.nepVal);
        this.RetailLoan.get([formArrayName, i, formControlName]).patchValue(event.val);
    }

    patchFunction(formArrayName, i, formControlName) {
        return this.RetailLoan.get([formArrayName, i, formControlName]).value;
    }

    changeToNepAmount1(event: any, target, from) {
        this.RetailLoan.get([target]).patchValue(event.nepVal);
        this.RetailLoan.get([from]).patchValue(event.val);
    }

    patchFunction1(target) {
        return this.RetailLoan.get([target]).value;
    }


}
