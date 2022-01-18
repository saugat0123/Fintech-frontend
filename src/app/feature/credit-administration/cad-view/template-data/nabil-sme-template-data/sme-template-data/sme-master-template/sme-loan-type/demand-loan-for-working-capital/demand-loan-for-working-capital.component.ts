import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';

@Component({
  selector: 'app-demand-loan-for-working-capital',
  templateUrl: './demand-loan-for-working-capital.component.html',
  styleUrls: ['./demand-loan-for-working-capital.component.scss']
})
export class DemandLoanForWorkingCapitalComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  initialInformation: any;
  demandLoanForm: FormGroup;
  translatedFormGroup: FormGroup;
  translatedValue: any;
  isComplimentryOtherLoan = false;
  isARFinancing = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ADExpiry = false;
  BSExpiry = false;
  loanDetails: any = [];
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];

  constructor(private formBuilder: FormBuilder,
              private translateService: SbTranslateService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engToNepDatePipe: EngNepDatePipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
    }
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.demandLoanForm.patchValue(this.initialInformation.demandLoanForm);
      }
      const dateOfExpiryType = this.initialInformation.demandLoanForm.dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.demandLoanForm.dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.demandLoanForm.get('dateOfExpiry').patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.demandLoanForm.dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.demandLoanForm.get('dateOfExpiryNepali').patchValue(dateOfExpiry);
        }
      }
    }
  }

  buildForm() {
    this.demandLoanForm = this.formBuilder.group({
      // for form data
      complementryOther: [undefined],
      complimentaryLoanSelected: [undefined],
      arFinancing: [undefined],
      subsidyOrAgricultureLoan: [undefined],
      arDays: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],

      // for translated data
      complementryOtherTrans: [undefined],
      complimentaryLoanSelectedTrans: [undefined],
      arFinancingTrans: [undefined],
      arDaysTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      drawingPowerTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],

      // for corrected data
      complementryOtherCT: [undefined],
      complimentaryLoanSelectedCT: [undefined],
      arFinancingCT: [undefined],
      arDaysCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      drawingPowerCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],

    });
  }

  checkComplimetryOtherLoan(data) {
    this.isComplimentryOtherLoan = data;
    this.demandLoanForm.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
  }

  checkARFinancing(data) {
    this.isARFinancing = data;
    this.demandLoanForm.get('arFinancing').patchValue(this.isARFinancing);
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.demandLoanForm.get(numLabel).value);
    this.demandLoanForm.get(wordLabel).patchValue(transformValue);
  }

  translateAndSetVal() {

    /* SET TRANS VALUE FOR CONDITIONS */

    const tempComplemetry = this.demandLoanForm.get('complementryOther').value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.demandLoanForm.get('complementryOtherTrans').patchValue(tempComplemetry);
    }
    const tempComplimentaryLoanSelected = this.demandLoanForm.get('complimentaryLoanSelected').value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoanSelected)) {
      this.demandLoanForm.get('complimentaryLoanSelectedTrans').patchValue(tempComplimentaryLoanSelected);
    }
    const tempArFinancing = this.demandLoanForm.get('arFinancing').value;
    if (!ObjectUtil.isEmpty(tempArFinancing)) {
      this.demandLoanForm.get('arFinancingTrans').patchValue(tempArFinancing);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.demandLoanForm.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.demandLoanForm.get('loanAmountTrans').patchValue(convertNumber);

    this.demandLoanForm.get('loanAmountWordsTrans').patchValue(
        this.demandLoanForm.get('loanAmountWords').value
    );
    const drawingPower = this.convertNumbersToNepali(this.demandLoanForm.get('drawingPower').value, false);
    this.demandLoanForm.get('drawingPowerTrans').patchValue(drawingPower);
    const arDays = this.convertNumbersToNepali(this.demandLoanForm.get('arDays').value, false);
    this.demandLoanForm.get('arDaysTrans').patchValue(arDays);
    const baseRate1 = this.convertNumbersToNepali(this.demandLoanForm.get('baseRate').value, false);
    this.demandLoanForm.get('baseRateTrans').patchValue(baseRate1);
    const premiumRate1 = this.convertNumbersToNepali(this.demandLoanForm.get('premiumRate').value, false);
    this.demandLoanForm.get('premiumRateTrans').patchValue(premiumRate1);
    const interestRate = this.convertNumbersToNepali(this.demandLoanForm.get('interestRate').value, false);
    this.demandLoanForm.get('interestRateTrans').patchValue(interestRate);

    /* Converting value for date */
    this.demandLoanForm.get('dateOfExpiryTypeTrans').patchValue(
        this.demandLoanForm.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.demandLoanForm.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.demandLoanForm.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      this.demandLoanForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    } else {
      const tempDateOfExpNep = this.demandLoanForm.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.eDate : '';
      this.demandLoanForm.get('dateOfExpiryTrans').patchValue(this.datePipe.transform(tempExpDate));
    }
    // translated date by google api
    // this.translatedFormGroup = this.formBuilder.group({
    //   dateOfExpiry: this.demandLoanForm.get('dateOfExpiry').value
    // });
    // this.translatedValue = this.translateService.translateForm(this.translatedFormGroup);
    this.setCTValue();
  }

  setCTValue() {
    this.demandLoanForm.get('complementryOtherCT').patchValue(
        this.demandLoanForm.get('complementryOtherTrans').value
    );
    this.demandLoanForm.get('complimentaryLoanSelectedCT').patchValue(
        this.demandLoanForm.get('complimentaryLoanSelectedTrans').value
    );
    this.demandLoanForm.get('arFinancingCT').patchValue(
        this.demandLoanForm.get('arFinancingTrans').value
    );
    this.demandLoanForm.get('loanAmountCT').patchValue(
        this.demandLoanForm.get('loanAmountTrans').value
    );
    this.demandLoanForm.get('loanAmountWordsCT').patchValue(
        this.demandLoanForm.get('loanAmountWordsTrans').value
    );
    this.demandLoanForm.get('drawingPowerCT').patchValue(
        this.demandLoanForm.get('drawingPowerTrans').value
    );
    this.demandLoanForm.get('arDaysCT').patchValue(
        this.demandLoanForm.get('arDaysTrans').value
    );
    this.demandLoanForm.get('baseRateCT').patchValue(
        this.demandLoanForm.get('baseRateTrans').value
    );
    this.demandLoanForm.get('premiumRateCT').patchValue(
        this.demandLoanForm.get('premiumRateTrans').value
    );
    this.demandLoanForm.get('interestRateCT').patchValue(
        this.demandLoanForm.get('interestRateTrans').value
    );
    this.demandLoanForm.get('dateOfExpiryTypeCT').patchValue(
        this.demandLoanForm.get('dateOfExpiryTypeTrans').value
    );
    this.demandLoanForm.get('dateOfExpiryNepaliCT').patchValue(
        this.demandLoanForm.get('dateOfExpiryNepaliTrans').value
    );
    this.demandLoanForm.get('dateOfExpiryCT').patchValue(
        this.demandLoanForm.get('dateOfExpiryTrans').value
    );
  }

  /* FOR CURRENCY FORMATTER IT TAKES PARAMETER TYPE TRUE*/
  convertNumbersToNepali(val, type: boolean) {
    let finalConvertedVal;
    if (!ObjectUtil.isEmpty(val)) {
      if (type) {
        finalConvertedVal = this.engToNepNumberPipe.transform(
            this.currencyFormatterPipe.transform(val.toString())
        );
      } else {
        finalConvertedVal = this.engToNepNumberPipe.transform(val.toString());
      }
    }
    return finalConvertedVal;
  }

  calInterestRate() {
    const baseRate = this.demandLoanForm.get('baseRate').value;
    const premiumRate = this.demandLoanForm.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.demandLoanForm.get('interestRate').patchValue(sum);
  }

}
