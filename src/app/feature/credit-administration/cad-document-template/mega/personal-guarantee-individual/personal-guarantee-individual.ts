import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastService} from "../../../../../@core/utils";
import {RouterUtilsService} from "../../../utils/router-utils.service";
import {CreditAdministrationService} from "../../../service/credit-administration.service";
import {NepaliCurrencyWordPipe} from "../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../@core/pipe/currency-formatter.pipe";
import {NepaliToEngNumberPipe} from "../../../../../@core/pipe/nepali-to-eng-number.pipe";
import {NepaliPercentWordPipe} from "../../../../../@core/pipe/nepali-percent-word.pipe";

@Component({
  selector: 'app-guarantor-individual',
  templateUrl: './personal-guarantee-individual.html',
  styleUrls: ['./personal-guarantee-individual.scss']
})
export class PersonalGuaranteeIndividual implements OnInit {

  guarantorindividualGroup: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private toastService: ToastService,
      private routerUtilService: RouterUtilsService,
      private administrationService: CreditAdministrationService,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepPercentWordPipe: NepaliPercentWordPipe,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.guarantorindividualGroup = this.formBuilder.group({
      branchName: [undefined],
      grandFatherName: [undefined],
      father_husbandName: [undefined],
      district: [undefined],
      VDCMunicipality: [undefined],
      ward: [undefined],
      temporarydistrict: [undefined],
      temporaryVDCMunicipality: [undefined],
      temporaryward: [undefined],
      borrowerName: [undefined],
      loanPurpose: [undefined],
      sanctionIssueDate: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      guarantorName: [undefined],
      citizenshipNumber: [undefined],
      citizenshipIssuedDistrict: [undefined],
      citizenshipIssueDate: [undefined],
      year: [undefined],
      month: [undefined],
      date: [undefined],
      day: [undefined],
    });
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.guarantorindividualGroup.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.guarantorindividualGroup.get(wordLabel).patchValue(returnVal);
  }
  submit(){
    console.log('Submit Works');
  }
}
