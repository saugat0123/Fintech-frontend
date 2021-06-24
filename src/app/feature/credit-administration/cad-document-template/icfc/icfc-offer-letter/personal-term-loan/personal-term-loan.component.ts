import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
      purpose: [undefined],
      depositApprovedLoanAmount: [undefined],
      dhaniName: [undefined],
      district2: [undefined],
      munVdc: [undefined],
      wardNo: [undefined],
      kiNo: [undefined],
      area: [undefined],
      details: [undefined]
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
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {}
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
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.PERSONAL_TERM_LOAN).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.personalTermLoan.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_TERM_LOAN);
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

  calcYearlyRate(base, premium, annual) {
    const baseRate = this.nepToEngNumberPipe.transform(this.personalTermLoan.get(base).value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.personalTermLoan.get(premium).value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const finalValue = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.personalTermLoan.get(annual).patchValue(finalValue);
  }

}
