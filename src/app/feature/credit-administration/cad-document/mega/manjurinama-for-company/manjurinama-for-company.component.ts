import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-manjurinama-for-company',
  templateUrl: './manjurinama-for-company.component.html',
  styleUrls: ['./manjurinama-for-company.component.scss']
})
export class ManjurinamaForCompanyComponent implements OnInit {

  manjurimaCompany: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.manjurimaCompany = this.formBuilder.group({
      grandFatherName: [undefined],
      fatherName: [undefined],
      husbandName: [undefined],
      perDistrictName: [undefined],
      perMunicipality: [undefined],
      perWardNo: [undefined],
      tempAddProvinceName: [undefined],
      tempAddDistrictName: [undefined],
      tempAddMunicipalityOrVdc: [undefined],
      tempAddWardNo: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      landRevenueOfficeBranch: [undefined],
      governmentMinistryName: [undefined],
      govOfficeDepName: [undefined],
      govOfficeName: [undefined],
      officeRegNo: [undefined],
      registeredDate: [undefined],
      officeDistrict: [undefined],
      officeMunicipalityOrVdc: [undefined],
      officeWardNo: [undefined],
      businessName: [undefined],
      snNo: [undefined],
      landOwnerName: [undefined],
      propertyDistrict: [undefined],
      propertyMunicipalityOrVdc: [undefined],
      propertyWardNo: [undefined],
      propertyKeyNo: [undefined],
      propertyArea: [undefined],
      nameOfTheHeir: [undefined],
      heirCitizenshipNo: [undefined],
      date: [undefined],
      heirDistrictName: [undefined],
      heirAddress: [undefined],
      relationship: [undefined],
      nameOfTheHeir1: [undefined],
      heirCitizenshipNo1: [undefined],
      date1: [undefined],
      heirDistrictName1: [undefined],
      heirAddress1: [undefined],
      relationship1: [undefined],
      docWrittenYear: [undefined],
      docWrittenMonth: [undefined],
      docWrittenDay: [undefined],
      docWrittenWeek: [undefined],
      witnessDistrict1: [undefined],
      witnessMunicipalityOrVdc1: [undefined],
      witnessWardNo1: [undefined],
      witnessAge1: [undefined],
      witnessName1: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipalityOrVdc2: [undefined],
      witnessWardNo2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
    });
  }
  submit() {
    console.log(this.manjurimaCompany.value);
  }

}
