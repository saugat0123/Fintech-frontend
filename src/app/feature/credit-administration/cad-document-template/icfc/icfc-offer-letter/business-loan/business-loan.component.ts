import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NbDialogRef} from '@nebular/theme';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {Router} from '@angular/router';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';



@Component({
  selector: 'app-business-loan',
  templateUrl: './business-loan.component.html',
  styleUrls: ['./business-loan.component.scss']
})
export class BusinessLoanComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  businessLoan: FormGroup;
  nepData;
  offerLetterDocument: OfferDocument;
  offerLetterConst = IcfcOfferLetterConst;
  existingOfferLetter = false;
  spinner: boolean;
  initialInfoPrint;
  selectedArray = [];
  selectedLoanTermArray = [];
  selectedInterestArray = [];
  loanRateOptions = ['Business Overdraft Loan (Quarterly)', 'Business Overdraft Loan (Monthly)', 'Business Term Loan'];
  loanCondition = ['Overdraft Loan', 'Term Loan'];
  overdraftLoanSelected;
  termLoanSelected;
  businessOverdraftLoanQSelected;
  businessOverdraftLoanMSelected;
  businessTermLoanSelected;
  translateBtn = false;



  constructor(private dialogRef: NbDialogRef<BusinessLoanComponent>,
              private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private routerUtilService: RouterUtilsService,
              private administrationService: CreditAdministrationService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              ) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.businessLoan.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.businessLoan.get(wordLabel).patchValue(returnVal);
  }

  buildForm() {
    this.businessLoan = this.formBuilder.group({
      branch: [undefined],
      regNo: [undefined],
      letterYear: [undefined],
      month: [undefined],
      day: [undefined],
      name: [undefined],
      field: [undefined],
      field2: [undefined],
      subject: [undefined],
      year: [undefined],
      month2: [undefined],
      day2: [undefined],
      credit: [undefined],
      annualRate: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      annualRate2: [undefined],
      baseRate2: [undefined],
      premiumRate2: [undefined],
      annualRate3: [undefined],
      baseRate3: [undefined],
      premiumRate3: [undefined],
      month3: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      years: [undefined],
      serviceChargeRate: [undefined],
      serviceCharge: [undefined],
      creditInformationFee: [undefined],
      creditCommitmentFeeRate: [undefined],
      creditCommitmentFeeAnnualRate: [undefined],
      biAnnualRate: [undefined],
      twoToFiveRate: [undefined],
      afterFiveRate: [undefined],
      sawa: [undefined],
      sawa2: [undefined],
      debtorName: [undefined],
      date: [undefined],
      guarantorName: [undefined],
      assessor: [undefined],
      evaluationDate: [undefined],
      fmv: [undefined],
      dv: [undefined],
      from: [undefined],
      amount3: [undefined],
      amountInWords3: [undefined],
      amount4: [undefined],
      amountInWords4: [undefined],
      amount5: [undefined],
      amount6: [undefined],
      address: [undefined],
      district: [undefined],
      year2: [undefined],
      month4: [undefined],
      day3: [undefined],
      branch2: [undefined],
      regNo2: [undefined],
      date2: [undefined],
      purpose: [undefined],
      depositApprovedLoanAmount: [undefined],
      dhaniName: [undefined],
      district2: [undefined],
      munVdc: [undefined],
      wardNo: [undefined],
      kiNo: [undefined],
      area: [undefined],
      details: [undefined],
      interestTypeSelectedArray: [undefined],
      loanTermSelectedArray: [undefined],
      prePaymentFlag: [true],
      inApprovalFlag: [true],
      prePaymentChargeFive: [undefined],

      loanSecurityTable: this.formBuilder.array([this.buildLandSecurity()]),
      loanFacilityTable: this.formBuilder.array([this.buildLoanFacilityTable()]),
      guarantorDetails: this.formBuilder.array([]),
      personalGarntAmt: this.formBuilder.array([this.buildPersonalGuarantorAmount()]),
      btnToggleVal: [false],
    });
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.businessLoan.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.businessLoan.get(wordLabel).patchValue(convertedVal);
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.businessLoan.patchValue({

    });
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.BUSINESS_LOAN).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.BUSINESS_LOAN);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.selectedInterestArray = initialInfo.interestTypeSelectedArray;
      this.selectedArray = initialInfo.loanTermSelectedArray;
      this.changeType(this.selectedArray);
      this.changeInterestType(this.selectedInterestArray);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {
        this.setLoanSecurityTableData(initialInfo.loanSecurityTable);
        this.setLoanFacilityTable(initialInfo.loanFacilityTable);
        this.setPersonalGuarantorAmount(initialInfo.personalGarntAmt);
        this.setGuarantorDetails(initialInfo.guarantorDetails);
      }
      this.businessLoan.patchValue(this.initialInfoPrint);
      this.translateBtn = this.initialInfoPrint.btnToggleVal;
    }
  }

  onSubmit() {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.BUSINESS_LOAN).toString()) {
          this.businessLoan.get('interestTypeSelectedArray').patchValue(this.selectedInterestArray);
          console.log(this.selectedInterestArray, 'Selected');
          this.businessLoan.get('loanTermSelectedArray').patchValue(this.selectedArray);
          offerLetterPath.initialInformation = JSON.stringify(this.businessLoan.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.BUSINESS_LOAN);
      this.businessLoan.get('interestTypeSelectedArray').patchValue(this.selectedInterestArray);
      this.businessLoan.get('loanTermSelectedArray').patchValue(this.selectedArray);
      offerDocument.initialInformation = JSON.stringify(this.businessLoan.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
      console.log('This is cad offer letter : ', this.cadOfferLetterApprovedDoc);
    }
    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }

  calcYearlyRate(base, premium, annual) {
    const baseRate = this.nepToEngNumberPipe.transform(this.businessLoan.get(base).value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.businessLoan.get(premium).value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const finalValue = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.businessLoan.get(annual).patchValue(finalValue);
  }

  buildLandSecurity() {
    return this.formBuilder.group({
      snNo: [undefined],
      dhaniName: [undefined],
      district2: [undefined],
      munVdc: [undefined],
      wardNo: [undefined],
      kiNo: [undefined],
      area: [undefined],
      details: [undefined],
    });
  }

  addTableData() {
    (this.businessLoan.get('loanSecurityTable') as FormArray).push(this.buildLandSecurity());
  }

  removeTable(index) {
    (this.businessLoan.get('loanSecurityTable') as FormArray).removeAt(index);
  }

  setLoanSecurityTableData(data) {
    const formArray = this.businessLoan.get('loanSecurityTable') as FormArray;
    (this.businessLoan.get('loanSecurityTable') as FormArray).clear();
    if (data.length === 0) {
      this.addTableData();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        snNo: [value.snNo],
        dhaniName: [value.dhaniName],
        district2: [value.district2],
        munVdc: [value.munVdc],
        wardNo: [value.wardNo],
        kiNo: [value.kiNo],
        area: [value.area],
        details: [value.details],
      }));
    });
  }

  changeType($event) {
    this.selectedArray = $event;
    $event.includes('Overdraft Loan') ? this.overdraftLoanSelected = true : this.overdraftLoanSelected = false;
    $event.includes('Term Loan') ? this.termLoanSelected = true : this.termLoanSelected = false;
  }

  buildLoanFacilityTable() {
    return this.formBuilder.group({
      purpose: [undefined],
      depositApprovedLoanAmount: [undefined],
      depositAmountWords: [undefined],
      credit: [undefined],
    });
  }

  addLoanFacilityTable() {
    (this.businessLoan.get('loanFacilityTable') as FormArray).push(this.buildLoanFacilityTable());
  }

  removeLoanFacilityData(index) {
    (this.businessLoan.get('loanFacilityTable') as FormArray).removeAt(index);
  }

  setLoanFacilityTable(data) {
    const formArray = this.businessLoan.get('loanFacilityTable') as FormArray;
    (this.businessLoan.get('loanFacilityTable') as FormArray).clear();
    if (data.length === 0) {
      this.addLoanFacilityTable();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        purpose: [value.purpose],
        depositAmountWords: [value.depositAmountWords],
        depositApprovedLoanAmount: [value.depositApprovedLoanAmount],
        credit: [value.credit],
      }));
    });
  }

  buildGuarantor() {
    return this.formBuilder.group({
      guarantorName1: [undefined],
      date3: [undefined],
    });
  }

  addNewGuarantor() {
    (this.businessLoan.get('guarantorDetails') as FormArray).push(this.buildGuarantor());
  }

  removeAddedGuarantor(index) {
    (this.businessLoan.get('guarantorDetails') as FormArray).removeAt(index);
  }

  setGuarantorDetails(data) {
    const formArray = this.businessLoan.get('guarantorDetails') as FormArray;
    (this.businessLoan.get('guarantorDetails') as FormArray).clear();
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        guarantorName1: [value.guarantorName1],
        date3: [value.date3],
      }));
    });
  }

  buildPersonalGuarantorAmount() {
    return this.formBuilder.group({
      name2: [undefined],
      amount2: [undefined],
      amountInWords2: [undefined],
    });
  }

  addPersonalGuarantorAmt() {
    (this.businessLoan.get('personalGarntAmt') as FormArray).push(this.buildPersonalGuarantorAmount());
  }

  removePersonalGuarantorAmt(index) {
    (this.businessLoan.get('personalGarntAmt') as FormArray).removeAt(index);
  }

  setPersonalGuarantorAmount(data) {
    const formArray = this.businessLoan.get('personalGarntAmt') as FormArray;
    (this.businessLoan.get('personalGarntAmt') as FormArray).clear();
    if (data.length === 0) {
      this.addPersonalGuarantorAmt();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        name2: [value.name2],
        amount2: [value.amount2],
        amountInWords2: [value.amountInWords2],
      }));
    });
  }

  changeInterestType($event) {
    this.selectedInterestArray = $event;
    $event.includes('Business Overdraft Loan (Quarterly)') ?
        this.businessOverdraftLoanQSelected = true : this.businessOverdraftLoanQSelected = false;
    $event.includes('Business Overdraft Loan (Monthly)') ?
        this.businessOverdraftLoanMSelected = true : this.businessOverdraftLoanMSelected = false;
    $event.includes('Business Term Loan') ? this.businessTermLoanSelected = true : this.businessTermLoanSelected = false;
  }

  removeOptionalFields(formGroup, fieldControlName) {
    formGroup.get(fieldControlName).patchValue(false);
  }

  undoFieldRemove(formGroup, fieldControlName) {
    formGroup.get(fieldControlName).patchValue(true);
  }

  convertAmountArrayVal(numLabel, wordLabel, index, formArray) {
    const numValue = this.businessLoan.get([formArray, index, numLabel]).value;
    const wordLabelVar = this.nepToEngNumberPipe.transform(numValue);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.businessLoan.get([formArray, index, wordLabel]).patchValue(convertedVal);
  }

  btnTranslateToggle(event) {
    console.log('Event Value: ', event);
    if (event) {
      this.translateBtn = event;
    } else {
      this.translateBtn = event;
    }
  }

  calcOtherRate(serviceCharge, chargeRate, swapfeeTwo, afterFiveRate, afterFiveRate2) {
    const servCharge = this.nepToEngNumberPipe.transform(this.businessLoan.get(serviceCharge).value);
    const calculatedRate = ( parseFloat(servCharge) / 100) * 50;
    const finalCalcValue = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(calculatedRate));
    this.businessLoan.get(chargeRate).patchValue(finalCalcValue);
    this.businessLoan.get(swapfeeTwo).patchValue(finalCalcValue);
    const calcFiveYears = ( parseFloat(servCharge) / 100) * 20;
    const finalFiveYearsValue = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(calcFiveYears));
    this.businessLoan.get(afterFiveRate).patchValue(finalFiveYearsValue);
    this.businessLoan.get(afterFiveRate2).patchValue(finalFiveYearsValue);
    this.businessLoan.get('sawa').patchValue(this.businessLoan.get(serviceCharge).value);
    this.businessLoan.get('biAnnualRate').patchValue(this.businessLoan.get(serviceCharge).value);

  }

}
