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
      actName: [undefined],
      actYear: [undefined],
      ministry: [undefined],
      department: [undefined],
      office: [undefined],
      registrationNo:[undefined],
      registrationDate: [undefined],
      name: [undefined],
      proprietorName: [undefined],
      nameOfAuthorizedPerson: [undefined],
      annualRate: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      nameOfWitness: [undefined],
      addressOfWitness: [undefined],
      nameOfWitness2: [undefined],
      addressOfWitness2: [undefined],
    });
  }

  submit(): void {
    console.log(this.promissorynotecompany.value);
  }
}
