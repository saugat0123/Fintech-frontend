import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-personal-guarantee-company',
  templateUrl: './personal-guarantee-company.component.html',
  styleUrls: ['./personal-guarantee-company.component.scss']
})
export class PersonalGuaranteeCompanyComponent implements OnInit {

  personalGuaranteeCompany: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(){
    this.buildForm();
  }


  buildForm(){
    this.personalGuaranteeCompany = this.formBuilder.group({
      districtName: [undefined],
      municipalityName: [undefined],
      wardNo: [undefined],
      branchName: [undefined],
      GrandFatherName: [undefined],
      grandChildrenName: [undefined],
      districtName2: [undefined],
      municipalityName2: [undefined],
      wardNo2: [undefined],
      age: [undefined],
      guarantorName: [undefined],
      citizenshipNo: [undefined],
      date: [undefined],
      districtAdministrationOfficeName: [undefined],
      registeredOffice: [undefined],
      companyName: [undefined],
      companyRegistrationNumber: [undefined],
      registeredDate: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      loanApprovalDate: [undefined],
      documentWrittenYear: [undefined],
      documentWrittenMonth: [undefined],
      documentWrittenDay: [undefined],
      bankStaffName: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipalityOrVdc: [undefined],
      witnessWardNo: [undefined],
      witnessAge: [undefined],
      witnessName: [undefined],
      docWrittenWeek: [undefined],
    });
  }

  submit(){
    console.log(this.personalGuaranteeCompany.value);
  }

}
