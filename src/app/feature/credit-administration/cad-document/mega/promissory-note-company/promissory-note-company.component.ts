import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-promissory-note-company',
  templateUrl: './promissory-note-company.component.html',
  styleUrls: ['./promissory-note-company.component.scss']
})
export class PromissoryNoteCompanyComponent implements OnInit {

  promissorynotecompany: FormGroup;

  constructor(private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    console.log(this.promissorynotecompany);
    this.buildForm();
  }

  buildForm() {
    this.promissorynotecompany = this.formBuilder.group({
      branch: [undefined],
      temporaryProvince: [undefined],
      temporaryProvince2: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityVDC: [undefined],
      permanentWardNo: [undefined],
      permanentDistrict2: [undefined],
      permanentMunicipalityVDC2: [undefined],
      permanentWardNo2: [undefined],
      grandParents: [undefined],
      parents: [undefined],
      grandParents2: [undefined],
      parents2: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalityVDC: [undefined],
      temporaryWardNo: [undefined],
      temporaryDistrict2: [undefined],
      temporaryMunicipalityVDC2: [undefined],
      temporaryWardNo2: [undefined],
      age: [undefined],
      age2: [undefined],
      relation: [undefined],
      citizenshipNo: [undefined],
      citizenshipNo2: [undefined],
      issueDate: [undefined],
      issueDistrict: [undefined],
      issueDate2: [undefined],
      issueDistrict2: [undefined],
      annualRate: [undefined],
      onePerson: [undefined],
      relation2: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      nameOfWitness: [undefined],
      addressOfWitness: [undefined],
      nameOfWitness2: [undefined],
      addressOfWitness2: [undefined],
      namesOfTheRightPeopleInTheAffidavit: [undefined],
      namesOfTheRightPeopleInTheAffidavit2: [undefined]
    });
  }

  submit(): void {
    console.log(this.promissorynotecompany.value);
  }
}
