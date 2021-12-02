import { Component, OnInit, Input } from '@angular/core';
import {ObjectUtil} from "../../../../../../../../../@core/utils/ObjectUtil";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NepaliCurrencyWordPipe} from "../../../../../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../../../../@core/pipe/currency-formatter.pipe";
import {DatePipe} from "@angular/common";
import {EngNepDatePipe} from "nepali-patro";

@Component({
  selector: 'app-pre-export-loan',
  templateUrl: './pre-export-loan.component.html',
  styleUrls: ['./pre-export-loan.component.scss']
})
export class PreExportLoanComponent implements OnInit {
  @Input() loanName;
  preExportForm: FormGroup;
  isComplimentryOtherLoan = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ADExpiry = false;
  BSExpiry = false;
  loanDetails: any = [];
  isMarketValue = false;
  isLetterOfCredit = false;


  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engToNepDatePipe: EngNepDatePipe) { }

  ngOnInit() {
    this.buildForm();
    if(!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
    }
  }

  buildForm() {
    this.preExportForm = this.formBuilder.group({
      //for form data
      complementryOther: [undefined],
      drawingBasis: [undefined],
      multiLoan: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      drawingPower: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],

      //for translated data
      complementryOtherTrans: [undefined],
      drawingBasisTrans: [undefined],
      multiLoanTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      drawingPowerTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],

      //for corrected data
      complementryOtherCT: [undefined],
      drawingBasisCT: [undefined],
      multiLoanCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      drawingPowerCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],

    })
  }

  checkComplimetryOtherLoan(data) {
    this.isComplimentryOtherLoan = data;
    this.preExportForm.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.preExportForm.get(numLabel).value);
    this.preExportForm.get(wordLabel).patchValue(transformValue);
  }

  translateAndSetVal() {

    /* SET TRANS VALUE FOR CONDITIONS */
    const tempMultiLoan = this.preExportForm.get('multiLoan').value;
    if (!ObjectUtil.isEmpty(tempMultiLoan)) {
      this.preExportForm.get('multiLoanTrans').patchValue(tempMultiLoan);
    }

    const tempComplemetry = this.preExportForm.get('complementryOther').value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.preExportForm.get('complementryOtherTrans').patchValue(tempComplemetry);
    }

    const tempDrawingBasis = this.preExportForm.get('drawingBasis').value;
    if (!ObjectUtil.isEmpty(tempDrawingBasis)) {
      this.preExportForm.get('drawingBasisTrans').patchValue(tempDrawingBasis);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.preExportForm.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.preExportForm.get('loanAmountTrans').patchValue(convertNumber);

    this.preExportForm.get('loanAmountWordsTrans').patchValue(
        this.preExportForm.get('loanAmountWords').value
    );
    const drawingPower = this.convertNumbersToNepali(this.preExportForm.get('drawingPower').value, false);
    this.preExportForm.get('drawingPowerTrans').patchValue(drawingPower);

    /* Converting value for date */
    this.preExportForm.get('dateOfExpiryTypeTrans').patchValue(
        this.preExportForm.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.preExportForm.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.preExportForm.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
          this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
      this.preExportForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    } else {
      const tempDateOfExpNep = this.preExportForm.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.preExportForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    }
    this.setCTValue();
  }

  setCTValue() {
    this.preExportForm.get('multiLoanCT').patchValue(
        this.preExportForm.get('multiLoanTrans').value
    );
    this.preExportForm.get('drawingBasisCT').patchValue(
        this.preExportForm.get('drawingBasisTrans').value
    );
    this.preExportForm.get('complementryOtherCT').patchValue(
        this.preExportForm.get('complementryOtherTrans').value
    );
    this.preExportForm.get('loanAmountCT').patchValue(
        this.preExportForm.get('loanAmountTrans').value
    );
    this.preExportForm.get('loanAmountWordsCT').patchValue(
        this.preExportForm.get('loanAmountWordsTrans').value
    );
    this.preExportForm.get('drawingPowerCT').patchValue(
        this.preExportForm.get('drawingPowerTrans').value
    );
    this.preExportForm.get('dateOfExpiryTypeCT').patchValue(
        this.preExportForm.get('dateOfExpiryTypeTrans').value
    );
    this.preExportForm.get('dateOfExpiryNepaliCT').patchValue(
        this.preExportForm.get('dateOfExpiryNepaliTrans').value
    );
    this.preExportForm.get('dateOfExpiryCT').patchValue(
        this.preExportForm.get('dateOfExpiryTrans').value
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

  setDrawingBasis(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isMarketValue = tempData === 'MARKET_VALUE';
    this.isLetterOfCredit = tempData === 'LETTER_OF_CREDIT';
  }
}
