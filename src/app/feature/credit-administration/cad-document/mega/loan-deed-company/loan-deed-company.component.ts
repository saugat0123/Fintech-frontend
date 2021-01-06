import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {DocStatus} from '../../../../loan/model/docStatus';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {CustomerOfferLetterPath} from '../../../../loan/model/customer-offer-letter-path';

@Component({
  selector: 'app-loan-deed-company',
  templateUrl: './loan-deed-company.component.html',
  styleUrls: ['./loan-deed-company.component.scss']
})
export class LoanDeedCompanyComponent implements OnInit {

  loandeedcompany: FormGroup;


  constructor(private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    console.log(this.loandeedcompany);
    this.buildForm();
  }

  buildForm() {
    this.loandeedcompany = this.formBuilder.group({
      temporaryProvince: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityVdc: [undefined],
      permanentWardNo: [undefined],
      registrarRegistrationOffice: [undefined],
      registrationNo: [undefined],
      registrationDate: [undefined],
      grandParents: [undefined],
      parents: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalityVDC: [undefined],
      temporaryWardNo: [undefined],
      temporaryAddress: [undefined],
      age: [undefined],
      relation: [undefined],
      citizenshipNo: [undefined],
      issueDate: [undefined],
      issueDistrict: [undefined],
      date2: [undefined],
      date3: [undefined],
      loan: [undefined],
      purpose: [undefined],
      annualRate: [undefined],
      onePerson: [undefined],
      relation2: [undefined],
      rate: [undefined],
      sNo: [undefined],
      landOwnerName: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      district4: [undefined],
      timeDuration: [undefined],
      municipalityVdc5: [undefined],
      wardNo5: [undefined],
      seatNo: [undefined],
      kNo: [undefined],
      area: [undefined],
      rNoDate: [undefined],
      rohbarBankEmployeeName: [undefined],
      nameOfAuthorizedPerson: [undefined],
      guarantorName: [undefined],
      guarantorName2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined],
      districtOfWitness: [undefined],
      municipalityVdcOfWitness: [undefined],
      wardNoOfWitness: [undefined],
      ageOfWitness: [undefined],
      relationOfWitness: [undefined],
      districtOfWitness2: [undefined],
      municipalityVdcOfWitness2: [undefined],
      wardNoOfWitness2: [undefined],
      ageOfWitness2: [undefined],
      relationOfWitness2: [undefined]
    });
  }


  submit(): void {
    console.log(this.loandeedcompany.value);
  }
}
