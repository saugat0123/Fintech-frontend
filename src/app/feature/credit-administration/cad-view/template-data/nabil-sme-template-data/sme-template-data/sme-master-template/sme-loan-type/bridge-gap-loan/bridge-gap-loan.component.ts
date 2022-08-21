import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
  selector: 'app-bridge-gap-loan',
  templateUrl: './bridge-gap-loan.component.html',
  styleUrls: ['./bridge-gap-loan.component.scss']
})
export class BridgeGapLoanComponent implements OnInit {
  @Input() customerApprovedDoc;
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() cadDocAssignedLoan;
  initialInformation: any;
  bridgeGapLoan: FormGroup;
  isComplimentryOtherLoan = false;
  isInterestSubsidy = false;
  loanDetails: any = [];
  bridgeGapNumber: Array<any> = new Array<any>();
  loanNameConstant = LoanNameConstant;
  filteredList: any = [];
  filteredLoanIdList: any = [];

  constructor(
      private formBuilder: FormBuilder,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatterPipe: CurrencyFormatterPipe,
      private engToNepWord: NepaliCurrencyWordPipe
  ) { }

  ngOnInit() {
    this.bridgeGapNumber = this.customerApprovedDoc.assignedLoan.filter(val =>
        val.loan.name === 'BRIDGE GAP LOAN');
    console.log(this.customerApprovedDoc);
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
      this.filterLoanDetails(this.loanDetails);
    }
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
    }
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      this.bridgeGapLoan.patchValue(this.initialInformation.bridgeGapLoan);
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
        this.bridgeGapLoan.get(['bridgeGapDetails', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.bridgeGapLoan.get(['bridgeGapDetails', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
      this.setLoanId();
    }
  }
  buildForm() {
    this.bridgeGapLoan = this.formBuilder.group({
      bridgeGapDetails: this.formBuilder.array([])
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
      loanId: [undefined],
    });
  }
  filterLoanDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.BRIDGE_GAP_LOAN);
  }
  setTermLoanForm() {
    for (let a = 0; a < this.bridgeGapNumber.length; a++) {
      (this.bridgeGapLoan.get('bridgeGapDetails') as FormArray).push(this.setFormArray());
    }
  }
  checkComplimetryOtherLoan(event, i) {
    if (!event) {
      this.bridgeGapLoan.get(['bridgeGapDetails', i, 'complimentaryLoanSelected']).patchValue(null);
    }
  }
  interestSubsidyCheck(event, i) {
    if (!event) {
      this.bridgeGapLoan.get(['bridgeGapDetails', i, 'totalInterestRate']).patchValue(null);
    }
  }
  public getNumAmountWord(numLabel, wordLabel, i): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.bridgeGapLoan.get(['bridgeGapDetails', i,  numLabel]).value);
    this.bridgeGapLoan.get(['bridgeGapDetails', i, wordLabel]).patchValue(transformValue);
  }
  translateAndSetVal(i) {
    // set translate data for subsidy
/*    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'interestSubsidy']).patchValue(this.isInterestSubsidy);
    */
    const tempSubsidy = this.bridgeGapLoan.get(['bridgeGapDetails', i, 'interestSubsidy']).value;
    if (!ObjectUtil.isEmpty(tempSubsidy)) {
      this.bridgeGapLoan.get(['bridgeGapDetails', i, 'interestSubsidyTrans']).patchValue(tempSubsidy);
    }
    const tempSubsidySelected = this.bridgeGapLoan.get(['bridgeGapDetails', i, 'totalInterestRate']).value;
    if (!ObjectUtil.isEmpty(tempSubsidySelected)) {
      this.bridgeGapLoan.get(['bridgeGapDetails', i, 'totalInterestRateTrans']).patchValue(tempSubsidySelected);
    }
    /* SET TRANS VALUE FOR CONDITIONS */
    const tempComplemetry = this.bridgeGapLoan.get(['bridgeGapDetails', i, 'complementryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.bridgeGapLoan.get(['bridgeGapDetails', i, 'complementryOtherTrans']).patchValue(tempComplemetry);
    }
    const tempComplimentaryLoanSelected = this.bridgeGapLoan.get(['bridgeGapDetails', i, 'complimentaryLoanSelected']).value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoanSelected)) {
      this.bridgeGapLoan.get(['bridgeGapDetails', i, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoanSelected);
    }
    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.bridgeGapLoan.get(['bridgeGapDetails', i, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'loanAmountTrans']).patchValue(convertNumber);

    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'loanAmountWordsTrans']).patchValue(
        this.bridgeGapLoan.get(['bridgeGapDetails', i, 'loanAmountWords']).value
    );
    const baseRate1 = this.convertNumbersToNepali(this.bridgeGapLoan.get(['bridgeGapDetails', i, 'baseRate']).value.toFixed(2), false);
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'baseRateTrans']).patchValue(baseRate1);
    const premiumRate1 = this.convertNumbersToNepali(this.bridgeGapLoan.get(['bridgeGapDetails', i, 'premiumRate']).value.toFixed(2), false);
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'premiumRateTrans']).patchValue(premiumRate1);
    const interestRate = this.convertNumbersToNepali(this.bridgeGapLoan.get(['bridgeGapDetails', i, 'interestRate']).value, false);
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'interestRateTrans']).patchValue(interestRate);
    const totalinterestRate = this.convertNumbersToNepali(this.bridgeGapLoan.get(['bridgeGapDetails', i, 'totalInterestRate']).value, false);
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'totalInterestRateTrans']).patchValue(totalinterestRate);
    this.setCTValue(i);
  }
  setCTValue(i) {
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'complementryOtherCT']).patchValue(
        this.bridgeGapLoan.get(['bridgeGapDetails', i, 'complementryOtherTrans']).value
    );
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'complimentaryLoanSelectedCT']).patchValue(
        this.bridgeGapLoan.get(['bridgeGapDetails', i, 'complimentaryLoanSelectedTrans']).value
    );
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'interestSubsidyCT']).patchValue(
        this.bridgeGapLoan.get(['bridgeGapDetails', i, 'interestSubsidyTrans']).value
    );
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'loanAmountCT']).patchValue(
        this.bridgeGapLoan.get(['bridgeGapDetails', i, 'loanAmountTrans']).value
    );
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'loanAmountWordsCT']).patchValue(
        this.bridgeGapLoan.get(['bridgeGapDetails', i, 'loanAmountWordsTrans']).value
    );
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'baseRateCT']).patchValue(
        this.bridgeGapLoan.get(['bridgeGapDetails', i, 'baseRateTrans']).value
    );
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'premiumRateCT']).patchValue(
        this.bridgeGapLoan.get(['bridgeGapDetails', i, 'premiumRateTrans']).value
    );
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'interestRateCT']).patchValue(
        this.bridgeGapLoan.get(['bridgeGapDetails', i, 'interestRateTrans']).value
    );
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'totalInterestRateCT']).patchValue(
        this.bridgeGapLoan.get(['bridgeGapDetails', i, 'totalInterestRateTrans']).value
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
    const baseRate = this.bridgeGapLoan.get(['bridgeGapDetails', i, 'baseRate']).value;
    const premiumRate = this.bridgeGapLoan.get(['bridgeGapDetails', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.bridgeGapLoan.get(['bridgeGapDetails', i, 'interestRate']).patchValue(sum.toFixed(2));
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.BRIDGE_GAP_LOAN);
    this.filteredList.forEach((val, i) => {
      this.bridgeGapLoan.get(['bridgeGapDetails', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }
}
