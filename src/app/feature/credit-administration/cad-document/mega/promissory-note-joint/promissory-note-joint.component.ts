import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-promissory-note-joint',
  templateUrl: './promissory-note-joint.component.html',
  styleUrls: ['./promissory-note-joint.component.scss']
})
export class PromissoryNoteJointComponent implements OnInit {

  promissorynotejoint: FormGroup;

  constructor(private formBuilder: FormBuilder,
             ) {
  }

  ngOnInit() {
    console.log(this.promissorynotejoint);
    this.buildForm();
  }

  buildForm() {
    this.promissorynotejoint = this.formBuilder.group({
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
    console.log(this.promissorynotejoint.value);
  }
}
