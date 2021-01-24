import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {Editor} from '../../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-sme',
  templateUrl: './sme.component.html',
  styleUrls: ['./sme.component.scss']
})
export class SmeComponent implements OnInit {
    loanForm: FormGroup;
  // todo replace enum constant string compare
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  offerLetterConst = MegaOfferLetterConst;
  offerLetterDocument: OfferDocument;
  selectedLoanArray = [];
  overdraft = false;
  demandLoan = false;
  fixedTermLoan = false;
  hirePurchase = false;
  letterOfCredit = false;
  trustReceipt = false;
  cashCredit = false;
  shortTermLoan = false;
  bankGuarantee = false;
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
  ckeConfig = Editor.CK_CONFIG;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;


  constructor( private formBuilder: FormBuilder,
               private router: Router,
               private toastService: ToastService,
               private administrationService: CreditAdministrationService,
               protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
               private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetterData();
    this.chooseLoanType(this.selectedLoanArray);
  }

  buildForm() {
    this.loanForm = this.formBuilder.group({
      referenceNo: [undefined],
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
      currentNonMovableAsset: [undefined],
      equalLoanAsset: [undefined],
      loanAsset: [undefined],
      loanTypeSelectedArray: [undefined],
      overdraftLoan: this.formBuilder.array([]),
      demandLoanType: this.formBuilder.array([this.demandLoanFormGroup()]),
      fixTermLoan: this.formBuilder.array([this.fixTermLoanFormGroup()]),
      hirePurchaseLoan: this.formBuilder.array([this.hirePurchaseLoan()]),
      letterOfCredit: this.formBuilder.array([this.letterOfCreditFormGroup()]),
      trustReceipt: this.formBuilder.array([this.trustReceiptFormGroup()]),
      cashCredit: this.formBuilder.array([this.cashCreditFormGroup()]),
      shortTermLoan: this.formBuilder.array([this.shortTermLoanFormGroup()]),
      bankGuarantee: this.formBuilder.array([this.bankGuaranteeFormGroup()]),
      multiCollateral: this.formBuilder.array([this.collateralFormGroup()]),
      tableData: this.formBuilder.array([]),
      securityNotes: [undefined]
    });

  }

  overdraftFormGroup(): FormGroup {
    return this.formBuilder.group({
      overdrafLoanCurrentTermRate: [undefined],
      overdrafLoanAmountInWord: [undefined],
      overdrafLoanAmount: [undefined],
      overdrafLoanPremiumRate: [undefined],
      overdrafLoanCurrentAnnualRate: [undefined],
      overdrafLoanEndOfFiscalYear: [undefined],
      overdrafLoanPayment: [undefined],
      overdrafLoanServiceRate: [undefined],
      overdrafLoanServiceCharge: [undefined],
      overdrafLoanPrices: [undefined],
      overdrafLoanYear: [undefined],
      overdrafLoanReturned: [undefined],
      dasturFlag: [true],
    });
  }

  addMoreOverdraftLoan() {
    (this.loanForm.get('overdraftLoan') as FormArray).push(this.overdraftFormGroup());
  }

  removeOverDraftLoan(index: number) {
    (this.loanForm.get('overdraftLoan') as FormArray).removeAt(index);
  }

  demandLoanFormGroup(): FormGroup {
    return this.formBuilder.group({
      demandLoanLimit: [undefined],
      demandLoanLimitInWord: [undefined],
      demandLoanPurpose: [undefined],
      demandLoanCurrentBaseRate: [undefined],
      demandLoanPremiumRate: [undefined],
      demandLoanNetTradingAsset: [undefined],
      demandLoanLimitDuration: [undefined],
      demandLoanLimitDurationAmount: [undefined],
      demandLoanDasturAmount: [undefined],
      demandLoanAnnualRate: [undefined],
      demandLoanDurationRatio: [undefined],
    });
  }

  addMoreDemandLoan() {
    (this.loanForm.get('demandLoanType') as FormArray).push(this.demandLoanFormGroup());
  }

  removeDemandLoan(index: number) {
    (this.loanForm.get('demandLoanType') as FormArray).removeAt(index);
  }

  fixTermLoanFormGroup(): FormGroup {
    return this.formBuilder.group({
      fixedTermLoanBoundaryAmountInNumber: [undefined],
      fixedTermLoanBoundaryAmountInWord: [undefined],
      fixedTermLoanPlanBankName: [undefined],
      fixedTermLoanTime: [undefined],
      fixedTermLoanMonthlyTerm: [undefined],
      fixedTermLoanAmountInNumber: [undefined],
      fixedTermLoanAmountInWord: [undefined],
      fixedTermLoanMonth: [undefined],
      fixedTermLoanBaseRate: [undefined],
      fixedTermLoanPremiumRate: [undefined],
      fixedTermLoanCurrentYearPercent: [undefined],
      fixedTermLoanBankName: [undefined],
      fixedTermLoanPaymentFee: [undefined],
      fixedTermLoanBorrowPercent: [undefined],
      fixedTermLoanPaymentAmount: [undefined],
      fixedTermLoanPaymentAmountDescription: [undefined],
      fixedTermLoanTwoBoundaryAmountInNumber: [undefined],
      fixedTermLoanTwoBoundaryAmountInWord: [undefined],
      fixedTermLoanTwoBankName: [undefined],
      fixedTermLoanTwoTime: [undefined],
      fixedTermLoanTwoMonthlyTerm: [undefined],
      fixedTermLoanTwoAmountInNumber: [undefined],
      fixedTermLoanTwoAmountInWord: [undefined],
      fixedTermTwoLoanMonth: [undefined],
      fixedTermLoanTwoBaseRate: [undefined],
      fixedTermLoanTwoPremiumRate: [undefined],
      fixedTermLoanTwoCurrentYearPercent: [undefined],
      fixedTermLoanTwoPaymentBankName: [undefined],
      fixedTermLoanTwoPaymentFee: [undefined],
      fixedTermLoanTwoBorrowPercent: [undefined],
      fixedTermLoanTwoPaymentAmount: [undefined],
      fixedTermLoanPaymentTwoAmountDescription: [undefined],
    });
  }

  addMoreFixTermLoan() {
    (this.loanForm.get('fixTermLoan') as FormArray).push(this.demandLoanFormGroup());
  }

  removeFixTermLoan(index: number) {
    (this.loanForm.get('fixTermLoan') as FormArray).removeAt(index);
  }

  hirePurchaseLoan(): FormGroup {
      return this.formBuilder.group({
        hirePurchasePaymentAmountInNumber: [undefined],
        hirePurchaseLoanPaymentAmountInWord: [undefined],
        hirePurchaseLoanPlanBankName: [undefined],
        hirePurchaseLoanTime: [undefined],
        hirePurchaseLoanBaseRate: [undefined],
        hirePurchaseLoanPremiumRate: [undefined],
        hirePurchaseLoanCurrentYear: [undefined],
        hirePurchaseLoanTerm: [undefined],
        hirePurchaseLoanAmountInNumber: [undefined],
        hirePurchaseLoanInWord: [undefined],
        hirePurchaseLoanMonth: [undefined],
        hirPurchaseLoanPaymentBankName: [undefined],
        hirPurchaseLoanPaymentPercent: [undefined],
        hirePurchaseLoanPaymentMonth: [undefined],
        hirePurchaseLoanServiceCharge: [undefined],
        hirePurchaseLoanServicePercent: [undefined],
      });
  }

  addMoreHirePurchaseLoan() {
    (this.loanForm.get('hirePurchaseLoan') as FormArray).push(this.hirePurchaseLoan());
  }

  removeHirePurchaseLoan(index: number) {
    (this.loanForm.get('hirePurchaseLoan') as FormArray).removeAt(index);
  }

  letterOfCreditFormGroup(): FormGroup {
    return this.formBuilder.group({
      letterOfCreditAmountInNumber: [undefined],
      latterOfCreditAmountInWord: [undefined],
      letterOfCreditMargin: [undefined],
      letterOfCreditMarginPercent: [undefined],
      letterOfCreditCurrentFiscalYear: [undefined],
      letterOfCreditCommission: [undefined],
      letterOfCreditCommissionPercent: [undefined],
      letterOfCreditDastur: [undefined],
    });
  }

  addMoreLetterOfCreditForm() {
    (this.loanForm.get('letterOfCredit') as FormArray).push(this.letterOfCreditFormGroup());
  }

  removeLetterOfCreditForm(index: number) {
    (this.loanForm.get('letterOfCredit') as FormArray).removeAt(index);
  }

  trustReceiptFormGroup(): FormGroup {
    return this.formBuilder.group({
      trustReceiptAmountInNumber: [undefined],
      trustReceiptAmountInWord: [undefined],
      trustReceiptBaseRate: [undefined],
      trustReceiptPremiumRate: [undefined],
      trustReceiptYearlyRate: [undefined],
      trustReceiptPayment: [undefined],
      trustReceiptTerm: [undefined],
      trustReceiptFixTerm: [undefined],
      trustReceiptDastur: [undefined],
    });
  }

  addMoreTrustReceiptForm() {
    (this.loanForm.get('trustReceipt') as FormArray).push(this.trustReceiptFormGroup());
  }

  removeTrustReceiptForm(index: number) {
    (this.loanForm.get('trustReceipt') as FormArray).removeAt(index);
  }

  cashCreditFormGroup(): FormGroup {
    return this.formBuilder.group({
      cashCreditAmountInNumber: [undefined],
      cashCreditAmountInWord: [undefined],
      casCreditAim: [undefined],
      cashCreditBaseRate: [undefined],
      cashCreditPremiumRate: [undefined],
      cashCreditCurrentYear: [undefined],
      cashCreditPay: [undefined],
      cashCreditPayTill: [undefined],
      cashCreditTerm: [undefined],
      cashCreditFixTerm: [undefined],
      cashCreditDastur: [undefined],
    });
  }

  addMoreCashCreditForm() {
    (this.loanForm.get('cashCredit') as FormArray).push(this.cashCreditFormGroup());
  }

  removeCashCreditForm(index: number) {
    (this.loanForm.get('cashCredit') as FormArray).removeAt(index);
  }

  shortTermLoanFormGroup(): FormGroup {
    return this.formBuilder.group({
      shortTermLoanAmountInNumber: [undefined],
      shortTermLoanAmountInWord: [undefined],
      shortTermLoanAim: [undefined],
      shortTermLoanBaseRate: [undefined],
      shortTermLoanPremiumRate: [undefined],
      shortTermLoanCurrentYear: [undefined],
      shortTermLoanPay: [undefined],
      shortTermLoanPayTill: [undefined],
      shortTermLoanTimePlan: [undefined],
      shortTermLoanTimePlanTill: [undefined],
      shortTermLoanDastur: [undefined],
    });
  }

  addMoreShortTermLoanForm() {
    (this.loanForm.get('shortTermLoan') as FormArray).push(this.shortTermLoanFormGroup());
  }

  removeShortTermLoanForm(index: number) {
    (this.loanForm.get('shortTermLoan') as FormArray).removeAt(index);
  }

  bankGuaranteeFormGroup(): FormGroup {
    return this.formBuilder.group({
      bankGuaranteeAmountInNumber: [undefined],
      bankGuaranteeAmountInWord: [undefined],
      bankGuaranteeAmountAim: [undefined],
      bankGuaranteeCommission: [undefined],
      bankGuaranteeTimePlan: [undefined],
      bankGuaranteeMargin: [undefined],
      bankGuaranteeDastur: [undefined],
    });
  }
  addMoreBankGuaranteeForm() {
    (this.loanForm.get('bankGuarantee') as FormArray).push(this.bankGuaranteeFormGroup());
  }

  removeBankGuaranteeForm(index: number) {
    (this.loanForm.get('bankGuarantee') as FormArray).removeAt(index);
  }

  collateralFormGroup(): FormGroup {
    return this.formBuilder.group({
      onlySelf: [undefined],
      district: [undefined],
      wardNo: [undefined],
      placeName: [undefined],
      kittanNo: [undefined],
      squareMeter: [undefined],
      landAndHouse: [undefined],
      doDoesAsset: [undefined],
    });
  }

  addMoreCollateral() {
    (this.loanForm.get('multiCollateral') as FormArray).push(this.collateralFormGroup());
  }

  removeCollateral(index: number) {
    (this.loanForm.get('multiCollateral') as FormArray).removeAt(index);
  }

  removeTableColumn(index: number) {
    (this.loanForm.get('tableData') as FormArray).removeAt(index);
  }

  addTableData() {
    (this.loanForm.get('tableData') as FormArray).push(
        this.formBuilder.group({
        insuranceDetails: [undefined],
        insuranceAmount: [undefined],
        riskCoverage: [undefined],
  })
    );
  }

  removeOptionalField(formArray, index, fieldControlName) {
    this.loanForm.get([formArray, index, fieldControlName]).patchValue(false);
  }

  undoRemovalOfOptionalField(formArray, index, fieldControlName) {
    this.loanForm.get([formArray, index, fieldControlName]).patchValue(true);
  }

  setOverDrafLoanData(details) {
    const overDraftDetails = this.loanForm.get('overdraftLoan') as FormArray;
    details.forEach(data => {
      overDraftDetails.push(
          this.formBuilder.group({
            overdrafLoanCurrentTermRate: [data.overdrafLoanCurrentTermRate],
            overdrafLoanAmountInWord: [data.overdrafLoanAmountInWord],
            overdrafLoanAmount: [data.overdrafLoanAmount],
            overdrafLoanPremiumRate: [data.overdrafLoanPremiumRate],
            overdrafLoanCurrentAnnualRate: [data.overdrafLoanCurrentAnnualRate],
            overdrafLoanEndOfFiscalYear: [data.overdrafLoanEndOfFiscalYear],
            overdrafLoanPayment: [data.overdrafLoanPayment],
            overdrafLoanServiceRate: [data.overdrafLoanServiceRate],
            overdrafLoanServiceCharge: [data.overdrafLoanServiceCharge],
            overdrafLoanPrices: [data.overdrafLoanPrices],
            overdrafLoanYear: [data.overdrafLoanYear],
            overdrafLoanReturned: [data.overdrafLoanReturned],
            dasturFlag: [data.dasturFlag],
          })
      );
    });
  }

  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.SME).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.SME);
        this.addMoreOverdraftLoan();
      } else  {
        const  initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        console.log(initialInfo);
        this.initialInfoPrint = initialInfo;
        console.log(this.offerLetterDocument);
        this.existingOfferLetter = true;
        this.loanForm.patchValue(initialInfo, {emitEvent: false});

        this.selectedLoanArray = initialInfo.loanTypeSelectedArray;
        this.chooseLoanType(this.selectedLoanArray);
        this.setOverDrafLoanData(initialInfo.overdraftLoan);
        // (this.loanForm.get('overdraftLoan') as FormArray).clear();
        // initialInfo.overdraftLoan.forEach(value => {
        //   (this.loanForm.get('overdraftLoan') as FormArray).push(this.formBuilder.group(value));
        // });
        (this.loanForm.get('demandLoanType') as FormArray).clear();
        initialInfo.demandLoanType.forEach(value => {
          (this.loanForm.get('demandLoanType') as FormArray).push(this.formBuilder.group(value));
        });
        (this.loanForm.get('fixTermLoan') as FormArray).clear();
        initialInfo.fixTermLoan.forEach(value => {
          (this.loanForm.get('fixTermLoan') as FormArray).push(this.formBuilder.group(value));
        });
        (this.loanForm.get('hirePurchaseLoan') as FormArray).clear();
        initialInfo.hirePurchaseLoan.forEach(value => {
          (this.loanForm.get('hirePurchaseLoan') as FormArray).push(this.formBuilder.group(value));
        });
        (this.loanForm.get('letterOfCredit') as FormArray).clear();
        initialInfo.letterOfCredit.forEach(value => {
          (this.loanForm.get('letterOfCredit') as FormArray).push(this.formBuilder.group(value));
        });
        (this.loanForm.get('trustReceipt') as FormArray).clear();
        initialInfo.trustReceipt.forEach(value => {
          (this.loanForm.get('trustReceipt') as FormArray).push(this.formBuilder.group(value));
        });
        (this.loanForm.get('cashCredit') as FormArray).clear();
        initialInfo.cashCredit.forEach(value => {
          (this.loanForm.get('cashCredit') as FormArray).push(this.formBuilder.group(value));
        });
        (this.loanForm.get('shortTermLoan') as FormArray).clear();
        initialInfo.shortTermLoan.forEach(value => {
          (this.loanForm.get('shortTermLoan') as FormArray).push(this.formBuilder.group(value));
        });
        (this.loanForm.get('bankGuarantee') as FormArray).clear();
        initialInfo.bankGuarantee.forEach(value => {
          (this.loanForm.get('bankGuarantee') as FormArray).push(this.formBuilder.group(value));
        });
        (this.loanForm.get('multiCollateral') as FormArray).clear();
        initialInfo.multiCollateral.forEach(value => {
          (this.loanForm.get('multiCollateral') as FormArray).push(this.formBuilder.group(value));
        });
        (this.loanForm.get('tableData') as FormArray).clear();
        initialInfo.tableData.forEach(value => {
          (this.loanForm.get('tableData') as FormArray).push(this.formBuilder.group(value));
        });
        this.initialInfoPrint = initialInfo;
      }
    }
  }

  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.SME).toString()) {
          this.loanForm.get('loanTypeSelectedArray').patchValue(this.selectedLoanArray);
          offerLetterPath.initialInformation = JSON.stringify(this.loanForm.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.SME);
      this.loanForm.get('loanTypeSelectedArray').patchValue(this.selectedLoanArray);
      offerDocument.initialInformation = JSON.stringify(this.loanForm.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe( () => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    } ,  error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });

  }

  chooseLoanType(selectedLoanTypeArray) {
    this.selectedLoanArray = selectedLoanTypeArray;
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
}
