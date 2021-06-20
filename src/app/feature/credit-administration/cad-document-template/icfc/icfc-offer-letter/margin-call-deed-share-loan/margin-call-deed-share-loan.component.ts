import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ToastService} from '../../../../../../@core/utils';

@Component({
  selector: 'app-margin-call-deed-share-loan',
  templateUrl: './margin-call-deed-share-loan.component.html',
  styleUrls: ['./margin-call-deed-share-loan.component.scss']
})
export class MarginCallDeedShareLoanComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
    marginShareLoan: FormGroup;

  constructor(private fromBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private toastService: ToastService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.marginShareLoan = this.fromBuilder.group({
      shareLoan: [undefined],
      shareLoanWords: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      zoneName: [undefined],
      districtName: [undefined],
      municipalityOrVdc: [undefined],
      wardNo: [undefined],
      tempZone: [undefined],
      tempDistrict: [undefined],
      tempMunicipalityOrVdc: [undefined],
      tempWardNo: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      interestRate: [undefined],
      serviceRate: [undefined],
      repaymentPeriod: [undefined],
      duration: [undefined],
      loanValueRate: [undefined],
      debtFlowRate: [undefined],
      singedYear: [undefined],
      signedMonth: [undefined],
      singedDate: [undefined],
      singedDay: [undefined],
      docWrittenYear: [undefined],
      docWrittenMonth: [undefined],
      docWrittenDate: [undefined],
      docWrittenDay: [undefined],
    });
  }

  submit() {
    console.log(this.marginShareLoan.value);
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.marginShareLoan.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.marginShareLoan.get(wordLabel).patchValue(convertedVal);
  }

}
