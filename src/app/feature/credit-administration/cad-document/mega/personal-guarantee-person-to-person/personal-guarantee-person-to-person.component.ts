import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-personal-guarantee-person-to-person',
  templateUrl: './personal-guarantee-person-to-person.component.html',
  styleUrls: ['./personal-guarantee-person-to-person.component.scss']
})
export class PersonalGuaranteePersonToPersonComponent implements OnInit {

  personalGuarantee: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(){
    this.buildForm();
  }

  buildForm() {
    this.personalGuarantee = this.formBuilder.group({
      officeDistrict: [undefined],
      municipalityName: [undefined],
      officeWardNo: [undefined],
      officeBranch: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      districtName: [undefined],
      municipalityOrVdc: [undefined],
      wardNo: [undefined],
      guarantorAge: [undefined],
      guarantorName: [undefined],
      citizenshipNo: [undefined],
      citizenshipIssuedDate: [undefined],
      citizenshipIssuedOffice: [undefined],
      borrowerGrandFather: [undefined],
      borrowerFatherName2: [undefined],
      borrowerDistrict: [undefined],
      borrowerMunicipalityOrVdc: [undefined],
      borrowerWardNo: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      borrowerCitizenshipNo: [undefined],
      borrowerCitizenshipIssuedDate: [undefined],
      borrowerCitizenshipIssuedOffice: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      loanApprovalDate: [undefined],
      documentWrittenYear: [undefined],
      documentWrittenMonth: [undefined],
      documentWrittenDay: [undefined],
      documentWrittenWeek: [undefined],
      bankStaffName: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipalityOrVdc: [undefined],
      witnessWardNo: [undefined],
      witnessAge: [undefined],
      witnessName: [undefined],

    });
  }
  submit() {
    console.log(this.personalGuarantee.value);
  }

}
