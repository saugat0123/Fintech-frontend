import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../../../../model/OfferDocument';

@Component({
  selector: 'app-bridge-gap-loan',
  templateUrl: './bridge-gap-loan.component.html',
  styleUrls: ['./bridge-gap-loan.component.scss']
})
export class BridgeGapLoanComponent implements OnInit {
  @Input() customerApprovedDoc;
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  initialInformation: any;
  bridgeGapLoan: FormGroup;
  isComplimentryOtherLoan = false;
  isInterestSubsidy = false;
  loanDetails: any = [];
  termLoanNumber: Array<any> = new Array<any>();

  constructor(
      private formBuilder: FormBuilder,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatterPipe: CurrencyFormatterPipe,
  ) { }

  ngOnInit() {
    this.termLoanNumber = this.customerApprovedDoc.assignedLoan.filter(val =>
        val.loan.name === 'BRIDGE GAP LOAN');
    console.log(this.customerApprovedDoc);
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
    }
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
    }
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      this.bridgeGapLoan.patchValue(this.initialInformation.bridgeGapLoan);
    }
  }
  buildForm() {
    this.bridgeGapLoan = this.formBuilder.group({
      termLoanDetails: this.formBuilder.array([])
    });
    this.setTermLoanForm();
  }
  setFormArray() {
    return this.formBuilder.group({
      // for form data
      complementryOther: [undefined],
      interestSubsidy: [undefined],
      complimentaryLoanSelected: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      totalInterestRate: [undefined],
      // for translated data
      complementryOtherTrans: [undefined],
      interestSubsidyTrans: [undefined],
      complimentaryLoanSelectedTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      totalInterestRateTrans: [undefined],
      // for corrected data
      complementryOtherCT: [undefined],
      interestSubsidyCT: [undefined],
      complimentaryLoanSelectedCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      totalInterestRateCT: [undefined],
    });
  }
  setTermLoanForm() {
    for (let a = 0; a < this.termLoanNumber.length; a++) {
      (this.bridgeGapLoan.get('termLoanDetails') as FormArray).push(this.setFormArray());
    }
  }
  checkComplimetryOtherLoan(event, i) {
    if (!event) {
      this.bridgeGapLoan.get(['termLoanDetails', i, 'complimentaryLoanSelected']).patchValue(null);
    }
  }
  interestSubsidyCheck(data) {
    this.isInterestSubsidy = data;
    this.bridgeGapLoan.get(['termLoanDetails', data, 'interestSubsidy']).patchValue(this.isInterestSubsidy);
  }
  public getNumAmountWord(numLabel, wordLabel, i): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.bridgeGapLoan.get(['termLoanDetails', i,  numLabel]).value);
    this.bridgeGapLoan.get(['termLoanDetails', i, wordLabel]).patchValue(transformValue);
  }
  translateAndSetVal(i) {
    // set translate data for subsidy
    this.bridgeGapLoan.get(['termLoanDetails', i, 'interestSubsidy']).patchValue(this.isInterestSubsidy);
    /* SET TRANS VALUE FOR CONDITIONS */
    const tempComplemetry = this.bridgeGapLoan.get(['termLoanDetails', i, 'complementryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.bridgeGapLoan.get(['termLoanDetails', i, 'complementryOtherTrans']).patchValue(tempComplemetry);
    }
    const tempComplimentaryLoanSelected = this.bridgeGapLoan.get(['termLoanDetails', i, 'complimentaryLoanSelected']).value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoanSelected)) {
      this.bridgeGapLoan.get(['termLoanDetails', i, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoanSelected);
    }
    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.bridgeGapLoan.get(['termLoanDetails', i, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.bridgeGapLoan.get(['termLoanDetails', i, 'loanAmountTrans']).patchValue(convertNumber);

    this.bridgeGapLoan.get(['termLoanDetails', i, 'loanAmountWordsTrans']).patchValue(
        this.bridgeGapLoan.get(['termLoanDetails', i, 'loanAmountWords']).value
    );
    const baseRate1 = this.convertNumbersToNepali(this.bridgeGapLoan.get(['termLoanDetails', i, 'baseRate']).value, false);
    this.bridgeGapLoan.get(['termLoanDetails', i, 'baseRateTrans']).patchValue(baseRate1);
    const premiumRate1 = this.convertNumbersToNepali(this.bridgeGapLoan.get(['termLoanDetails', i, 'premiumRate']).value, false);
    this.bridgeGapLoan.get(['termLoanDetails', i, 'premiumRateTrans']).patchValue(premiumRate1);
    const interestRate = this.convertNumbersToNepali(this.bridgeGapLoan.get(['termLoanDetails', i, 'interestRate']).value, false);
    this.bridgeGapLoan.get(['termLoanDetails', i, 'interestRateTrans']).patchValue(interestRate);
    const totalinterestRate = this.convertNumbersToNepali(this.bridgeGapLoan.get(['termLoanDetails', i, 'totalInterestRate']).value, false);
    this.bridgeGapLoan.get(['termLoanDetails', i, 'totalInterestRateTrans']).patchValue(totalinterestRate);
    this.setCTValue(i);
  }
  setCTValue(i) {
    this.bridgeGapLoan.get(['termLoanDetails', i, 'complementryOtherCT']).patchValue(
        this.bridgeGapLoan.get(['termLoanDetails', i, 'complementryOtherTrans']).value
    );
    this.bridgeGapLoan.get(['termLoanDetails', i, 'complimentaryLoanSelectedCT']).patchValue(
        this.bridgeGapLoan.get(['termLoanDetails', i, 'complimentaryLoanSelectedTrans']).value
    );
    this.bridgeGapLoan.get(['termLoanDetails', i, 'interestSubsidyCT']).patchValue(
        this.bridgeGapLoan.get(['termLoanDetails', i, 'interestSubsidyTrans']).value
    );
    this.bridgeGapLoan.get(['termLoanDetails', i, 'loanAmountCT']).patchValue(
        this.bridgeGapLoan.get(['termLoanDetails', i, 'loanAmountTrans']).value
    );
    this.bridgeGapLoan.get(['termLoanDetails', i, 'loanAmountWordsCT']).patchValue(
        this.bridgeGapLoan.get(['termLoanDetails', i, 'loanAmountWordsTrans']).value
    );
    this.bridgeGapLoan.get(['termLoanDetails', i, 'baseRateCT']).patchValue(
        this.bridgeGapLoan.get(['termLoanDetails', i, 'baseRateTrans']).value
    );
    this.bridgeGapLoan.get(['termLoanDetails', i, 'premiumRateCT']).patchValue(
        this.bridgeGapLoan.get(['termLoanDetails', i, 'premiumRateTrans']).value
    );
    this.bridgeGapLoan.get(['termLoanDetails', i, 'interestRateCT']).patchValue(
        this.bridgeGapLoan.get(['termLoanDetails', i, 'interestRateTrans']).value
    );
    this.bridgeGapLoan.get(['termLoanDetails', i, 'totalInterestRateCT']).patchValue(
        this.bridgeGapLoan.get(['termLoanDetails', i, 'totalInterestRateTrans']).value
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
  calInterestRate(i) {
    const baseRate = this.bridgeGapLoan.get(['termLoanDetails', i, 'baseRate']).value;
    const premiumRate = this.bridgeGapLoan.get(['termLoanDetails', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.bridgeGapLoan.get(['termLoanDetails', i, 'interestRate']).patchValue(sum);
  }
}
