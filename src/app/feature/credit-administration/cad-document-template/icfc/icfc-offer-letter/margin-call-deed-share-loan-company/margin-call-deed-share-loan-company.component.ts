import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../../@core/utils';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
  selector: 'app-margin-call-deed-share-loan-company',
  templateUrl: './margin-call-deed-share-loan-company.component.html',
  styleUrls: ['./margin-call-deed-share-loan-company.component.scss']
})
export class MarginCallDeedShareLoanCompanyComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  shareLoanCompany: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.shareLoanCompany = this.formBuilder.group({
      shareLoan: [undefined],
      shareLoanWords: [undefined],
      governmentOfficeName: [undefined],
      governmentOfficeAddress: [undefined],
      registrationNo: [undefined],
      registeredDate: [undefined],
      province: [undefined],
      zoneName: [undefined],
      districtName: [undefined],
      municipalityOrVdc: [undefined],
      wardNo: [undefined],
      panNo: [undefined],
      orgOwnerName: [undefined],
      grandfatherName: [undefined],
      fatherName: [undefined],
      borrowerProvince: [undefined],
      borrowerZone: [undefined],
      borrowerDistrict: [undefined],
      borrowerVdcOrMunicipality: [undefined],
      borrowerWardNo: [undefined],
      tempProvince: [undefined],
      tempZone: [undefined],
      tempDistrict: [undefined],
      tempMunicipalityOrVdc: [undefined],
      tempWardNo: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      interestRate: [undefined],
      interestAmount: [undefined],
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
    console.log(this.shareLoanCompany.value);
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.shareLoanCompany.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.shareLoanCompany.get(wordLabel).patchValue(convertedVal);
  }



}
