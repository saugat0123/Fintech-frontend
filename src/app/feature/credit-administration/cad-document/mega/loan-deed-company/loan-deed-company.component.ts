import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

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
      branch: [undefined],
      temporaryProvince: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityVDC: [undefined],
      permanentWardNo: [undefined],
      registrarRegistrationOffice: [undefined],
      registrarRegistrationOfficeProvince: [undefined],
      registrarRegistrationOfficeDistrict: [undefined],
      registrarRegistrationOfficeMunicipalityVDC: [undefined],
      registrarRegistrationOfficeWardNo: [undefined],
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
      sNo: [undefined],
      landOwnerName: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      landOwnerMunicipalityVDC: [undefined],
      landOwnerWardNo: [undefined],
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
    console.log(this.loandeedcompany.value);
  }
}
