import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-promissory-note-single-borrower',
  templateUrl: './promissory-note-single-borrower.component.html',
  styleUrls: ['./promissory-note-single-borrower.component.scss']
})
export class PromissoryNoteSingleBorrowerComponent implements OnInit {

  promissorySingleNote: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.promissorySingleNote = this.formBuilder.group({
      date: [undefined],
      amount: [undefined],
      amountInWord: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      perDistrict: [undefined],
      perMunicipalityOrVdc: [undefined],
      perWardNo: [undefined],
      currentDistrict: [undefined],
      CurrentMunicipalityOrVdc: [undefined],
      CurrentWardNo: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      citizenshipNo: [undefined],
      citizenshipIssuedDate: [undefined],
      districtOffice: [undefined],
      bankBranch: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      loanInterest: [undefined],
      docWrittenName: [undefined],
      witnessName: [undefined],
      witnessAddress: [undefined],
      witnessName1: [undefined],
      witnessAddress1: [undefined],
    });
  }

  submit(){
    console.log(this.promissorySingleNote.value);
  }

}
