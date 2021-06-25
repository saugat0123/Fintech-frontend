import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
      name2: [undefined],
      amount2: [undefined],
      amountInWords2: [undefined],
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
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {}
      this.businessLoan.patchValue(this.initialInfoPrint);
    }
  }

  onSubmit() {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.BUSINESS_LOAN).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.businessLoan.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.BUSINESS_LOAN);
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

}
