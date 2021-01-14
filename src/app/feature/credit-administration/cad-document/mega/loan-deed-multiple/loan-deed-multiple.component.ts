import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-loan-deed-multiple',
  templateUrl: './loan-deed-multiple.component.html',
  styleUrls: ['./loan-deed-multiple.component.scss']
})
export class LoanDeedMultipleComponent implements OnInit {

  loandeedmultiple: FormGroup;


  constructor(private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    console.log(this.loandeedmultiple);
    this.buildForm();
  }

  buildForm() {
    this.loandeedmultiple = this.formBuilder.group({
      branch: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityVDC: [undefined],
      permanentWardNo: [undefined],
      grandParents: [undefined],
      parents: [undefined],
      temporaryProvince: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalityVDC: [undefined],
      temporaryWardNo: [undefined],
      temporaryAddress: [undefined],
      age: [undefined],
      relation: [undefined],
      citizenshipNo: [undefined],
      issueDate: [undefined],
      issueDistrict: [undefined],
      date: [undefined],
      loan: [undefined],
      purpose: [undefined],
      onePerson: [undefined],
      rate: [undefined],
      landOwnerName: [undefined],
      landOwnerMunicipalityVDC: [undefined],
      landOwnerWardNo: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      timeDuration: [undefined],
      debtorName: [undefined],
      debtorName2: [undefined],
      seatNo: [undefined],
      kNo: [undefined],
      area: [undefined],
      rNoDate: [undefined],
      rohbarBankEmployeeName: [undefined],
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
      relationOfWitness2: [undefined]
    });
  }


  submit(): void {
    console.log(this.loandeedmultiple.value);
  }
}
