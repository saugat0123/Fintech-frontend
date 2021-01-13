import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-loan-deed-single',
  templateUrl: './loan-deed-single.component.html',
  styleUrls: ['./loan-deed-single.component.scss']
})
export class LoanDeedSingleComponent implements OnInit {

  loandeedsingle: FormGroup;


  constructor(private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    console.log(this.loandeedsingle);
    this.buildForm();
  }

  buildForm() {
    this.loandeedsingle = this.formBuilder.group({
      branch: [undefined],
      name: [undefined],
      temporaryProvince: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityVDC: [undefined],
      permanentWardNo: [undefined],
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
      loanRequestDate: [undefined],
      loan: [undefined],
      purpose: [undefined],
      annualRate: [undefined],
      onePerson: [undefined],
      sNo: [undefined],
      landOwnerName: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      timeDuration: [undefined],
      seatNo: [undefined],
      kNo: [undefined],
      area: [undefined],
      rNoDate: [undefined],
      rohbarBankEmployeeName: [undefined],
      guarantorName: [undefined],
      guarantorName2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined],
      districtOfWitness: [undefined],
      municipalityVDCOfWitness: [undefined],
      wardNoOfWitness: [undefined],
      ageOfWitness: [undefined],
      relationOfWitness: [undefined],
      districtOfWitness2: [undefined],
      municipalityVDCOfWitness2: [undefined],
      wardNoOfWitness2: [undefined],
      ageOfWitness2: [undefined],
      relationOfWitness2: [undefined],
      landOwnerMunicipalityVDC: [undefined],
      landOwnerWardNo: [undefined]
    });
  }


  submit(): void {
    console.log(this.loandeedsingle.value);
  }
}
