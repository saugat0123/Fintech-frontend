import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {OfferDocument} from '../../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NbDialogRef} from '@nebular/theme';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {Router} from '@angular/router';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-personal-term-loan',
  templateUrl: './personal-term-loan.component.html',
  styleUrls: ['./personal-term-loan.component.scss']
})
export class PersonalTermLoanComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  personalTermLoan: FormGroup;
  existingOfferLetter = false;
  spinner: boolean;
  offerLetterConst = IcfcOfferLetterConst;
  offerLetterDocument: OfferDocument;
  nepData;
  initialInfoPrint;
  selectedArray = [];
  selectedLoanTermArray = [];
  selectedInterestArray = [];
  loanRateOptions = ['Variable Interest Rate', 'Fixed Interest Rate', 'Personal Overdraft Loan (Quarterly)', 'Personal Overdraft Loan (Monthly)'];
  varInterestRateSelected: boolean;
  fixedInterestRateSelected: boolean;
  personalOverdraftLoanSelected: boolean;
  personalOverdraftMonthlySelected: boolean;
  loanCondition = ['All Term Loan', 'OD Nature Loan'];
  allTermLoanSelected: boolean;
  odNatureLoanSelected: boolean;


  constructor(private dialogRef: NbDialogRef<PersonalTermLoanComponent>,
              private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private routerUtilService: RouterUtilsService,
              private administrationService: CreditAdministrationService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.personalTermLoan = this.formBuilder.group({
      branch: [undefined],
      regNo: [undefined],
      month: [undefined],
      day: [undefined],
      name: [undefined],
      field: [undefined],
      field2: [undefined],
      subject: [undefined],
      subhida: [undefined],
      month2: [undefined],
      day2: [undefined],
      annualRate: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      sawa: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      annualRate2: [undefined],
      baseRate2: [undefined],
      sawa2: [undefined],
      amount2: [undefined],
      amountInWords2: [undefined],
      premiumRate2: [undefined],
      annualRate3: [undefined],
      baseRate3: [undefined],
      premiumRate3: [undefined],
      annualRate4: [undefined],
      baseRate4: [undefined],
      premiumRate4: [undefined],
      debtorName: [undefined],
      date: [undefined],
      years: [undefined],
      rate: [undefined],
      serviceCharge: [undefined],
      creditInformationFee: [undefined],
      creditCommitmentFeeRate: [undefined],
      creditCommitmentFeeAnnualRate: [undefined],
      biAnnualRate: [undefined],
      twoToFiveRate: [undefined],
      afterFiveRate: [undefined],
      biAnnualRate2: [undefined],
      twoToFiveRate2: [undefined],
      afterFiveRate2: [undefined],
      assessor: [undefined],
      evaluationDate: [undefined],
      fmv: [undefined],
      dv: [undefined],
      name2: [undefined],
      from: [undefined],
      amount3: [undefined],
      amountInWords3: [undefined],
      amount4: [undefined],
      amountInWords4: [undefined],
      amount5: [undefined],
      amountInWords5: [undefined],
      insuranceAmount: [undefined],
      debtorName2: [undefined],
      date2: [undefined],
      dhaniName: [undefined],
      district2: [undefined],
      munVdc: [undefined],
      wardNo: [undefined],
      kiNo: [undefined],
      area: [undefined],
      details: [undefined],
      interestTypeSelectedArray: [undefined],
      loanTermSelectedArray: [undefined],
      regNo2: [undefined],
      address: [undefined],
      district: [undefined],
      inApprovalFlag: [true],
      prePaymentFlag: [true],
      letterYear: [undefined],
      footerLetterYear: [undefined],
      footerLetterMonth: [undefined],
      footerLetterDay: [undefined],
      year2: [undefined],

      loanSecurityTable: this.formBuilder.array([this.buildLandSecurity()]),
      loanFacilityTable: this.formBuilder.array([this.buildLoanFacilityTable()]),
    });
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_TERM_LOAN).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_TERM_LOAN);
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
      }
      this.personalTermLoan.patchValue(this.initialInfoPrint);
    }
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.personalTermLoan.patchValue({

    });
  }

  /*calcYearlyRate(formArrayName, i) {
    const baseRate = this.nepToEngNumberPipe.transform(this.personalTermLoan.get([formArrayName, i, 'baseRate']).value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.personalTermLoan.get([formArrayName, i, 'premiumRate']).value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.personalTermLoan.get([formArrayName, i, 'yearlyRate']).patchValue(asd);
  }*/

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.personalTermLoan.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.personalTermLoan.get(wordLabel).patchValue(convertedVal);
  }

  onSubmit() {
    console.log('This is print value: ', this.personalTermLoan.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;
    const flagCheck = this.personalTermLoan.get('inApprovalFlag').value;
    if (flagCheck === false) {
      this.personalTermLoan.get('inApprovalFlag').patchValue(null);
    }

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.PERSONAL_TERM_LOAN).toString()) {
          this.personalTermLoan.get('interestTypeSelectedArray').patchValue(this.selectedInterestArray);
          console.log(this.selectedArray);
          this.personalTermLoan.get('loanTermSelectedArray').patchValue(this.selectedArray);
          console.log('Mid of the process!:  ', this.personalTermLoan.value);
          offerLetterPath.initialInformation = JSON.stringify(this.personalTermLoan.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_TERM_LOAN);
      this.personalTermLoan.get('interestTypeSelectedArray').patchValue(this.selectedInterestArray);
      this.personalTermLoan.get('loanTermSelectedArray').patchValue(this.selectedArray);
      console.log('Mid of the process!:  ', this.personalTermLoan.value);
      offerDocument.initialInformation = JSON.stringify(this.personalTermLoan.value);
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

  buildLandSecurity() {
    return this.formBuilder.group({
      // snNo: [undefined],
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
    (this.personalTermLoan.get('loanSecurityTable') as FormArray).push(this.buildLandSecurity());
  }

  removeTable(index) {
    (this.personalTermLoan.get('loanSecurityTable') as FormArray).removeAt(index);
  }

  setLoanSecurityTableData(data) {
    const formArray = this.personalTermLoan.get('loanSecurityTable') as FormArray;
    (this.personalTermLoan.get('loanSecurityTable') as FormArray).clear();
    if (data.length === 0) {
      this.addTableData();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        // snNo: [value.snNo],
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
    $event.includes('All Term Loan') ? this.allTermLoanSelected = true : this.allTermLoanSelected = false;
    $event.includes('OD Nature Loan') ? this.odNatureLoanSelected = true : this.odNatureLoanSelected = false;
  }

  buildLoanFacilityTable() {
    return this.formBuilder.group({
      purpose: [undefined],
      depositApprovedLoanAmount: [undefined],
      loanTitle: [undefined],
    });
  }

  addLoanFacilityTable() {
    (this.personalTermLoan.get('loanFacilityTable') as FormArray).push(this.buildLoanFacilityTable());
  }

  removeLoanFacilityData(index) {
    (this.personalTermLoan.get('loanFacilityTable') as FormArray).removeAt(index);
  }

  setLoanFacilityTable(data) {
    const formArray = this.personalTermLoan.get('loanFacilityTable') as FormArray;
    (this.personalTermLoan.get('loanFacilityTable') as FormArray).clear();
    if (data.length === 0) {
      this.addLoanFacilityTable();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        purpose: [value.purpose],
        depositApprovedLoanAmount: [value.depositApprovedLoanAmount],
        loanTitle: [value.loanTitle],
      }));
    });
  }

  changeInterestType($event) {
    this.selectedInterestArray = $event;
    $event.includes('Variable Interest Rate') ? this.varInterestRateSelected = true : this.varInterestRateSelected = false;
    $event.includes('Fixed Interest Rate') ? this.fixedInterestRateSelected = true : this.fixedInterestRateSelected = false;
    $event.includes('Personal Overdraft Loan (Quarterly)') ?
        this.personalOverdraftLoanSelected = true : this.personalOverdraftLoanSelected = false;
    $event.includes('Personal Overdraft Loan (Monthly)') ?
        this.personalOverdraftMonthlySelected = true : this.personalOverdraftMonthlySelected = false;
  }

  calcYearlyRate(base, premium, annual) {
    const baseRate = this.nepToEngNumberPipe.transform(this.personalTermLoan.get(base).value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.personalTermLoan.get(premium).value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const finalValue = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.personalTermLoan.get(annual).patchValue(finalValue);
  }

  calcOtherRate(serviceCharge, chargeRate, swapfeeTwo, afterFiveRate, afterFiveRate2) {
    const servCharge = this.nepToEngNumberPipe.transform(this.personalTermLoan.get(serviceCharge).value);
    const calculatedRate = ( parseFloat(servCharge) / 100) * 50;
    const finalCalcValue = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(calculatedRate));
    this.personalTermLoan.get(chargeRate).patchValue(finalCalcValue);
    this.personalTermLoan.get(swapfeeTwo).patchValue(finalCalcValue);
    const calcFiveYears = ( parseFloat(servCharge) / 100) * 20;
    const finalFiveYearsValue = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(calcFiveYears));
    this.personalTermLoan.get(afterFiveRate).patchValue(finalFiveYearsValue);
    this.personalTermLoan.get(afterFiveRate2).patchValue(finalFiveYearsValue);
    this.personalTermLoan.get('biAnnualRate').patchValue(this.personalTermLoan.get(serviceCharge).value);
    this.personalTermLoan.get('biAnnualRate2').patchValue(this.personalTermLoan.get(serviceCharge).value);

  }

  // setValue() {
  //   const regValue = this.personalTermLoan.get('regNo').value;
  //   console.log('This is reg Value: ', regValue);
  //   this.personalTermLoan.get('regNo2').patchValue(regValue);
  // }

  removeOptionalField(formGroup, fieldControlName) {
    formGroup.get(fieldControlName).patchValue(false);
  }

  undoFieldRemove(formGroup, fieldControlName) {
    formGroup.get(fieldControlName).patchValue(true);
  }

}
