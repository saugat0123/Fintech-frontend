import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-personal-guarantee-joint-borrower',
  templateUrl: './personal-guarantee-joint-borrower.component.html',
  styleUrls: ['./personal-guarantee-joint-borrower.component.scss']
})
export class PersonalGuaranteeJointBorrowerComponent implements OnInit {

  personalGuaranteeJoint: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.personalGuaranteeJoint = this.formBuilder.group({
      bankBranchName: [undefined],
      guarantorGrandFatherName: [undefined],
      guarrantorFatherName: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipalityOrVdc: [undefined],
      guarantorWardNo: [undefined],
      tempProvinceNo: [undefined],
      tempAddDistrict: [undefined],
      tempAddMunicipality: [undefined],
      tempAddWardNo: [undefined],
      tempAddress: [undefined],
      guarantorAge: [undefined],
      guarantorName: [undefined],
      guarantorCitizenshipNo: [undefined],
      guarantorCitizenshipIssuedDate: [undefined],
      citizenshipIssuedDistrict: [undefined],
      guarantorGrandfather1: [undefined],
      guarrantorFatherName1: [undefined],
      guarantorDistrict1: [undefined],
      guarantorMunicipalityOrVdc1: [undefined],
      guarantorWardNo1: [undefined],
      guarantorProvinceNo: [undefined],
      tempAddDistrict1: [undefined],
      TempAddMunicipality1: [undefined],
      tempAddWardNo1: [undefined],
      tempAddress1: [undefined],
      guarantorAge1: [undefined],
      guarantorName1: [undefined],
      guarantorCitizenshipNo1: [undefined],
      CitizenshipIssuedDate1: [undefined],
      CitizenshipIssuedDistrict1: [undefined],
      guarantorGrandFather2: [undefined],
      guarrantorFatherName2: [undefined],
      borrowerDistrict: [undefined],
      borrowerMunicipalityOrVdc: [undefined],
      borrowerWardNo: [undefined],
      borrowerProvinceNo: [undefined],
      borrowerTempDistrict: [undefined],
      tempMunicipalityOrVdc2: [undefined],
      tempWardNo2: [undefined],
      tempAddress2: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      borrowerCitizenshipNo: [undefined],
      borrowerCitizenshipIssuedDate: [undefined],
      borrowerCitizenshipIssuedDistrict: [undefined],
      numberOfGuarantor: [undefined],
      loanApprovalDate: [undefined],
      loanAmount: [undefined],
      loanAmtInWord: [undefined],
      loanFacility1: [undefined],
      purpose1: [undefined],
      loanFacilityAmount1: [undefined],
      interestRate1: [undefined],
      timePeriod1: [undefined],
      apology1: [undefined],
      loanFacility2: [undefined],
      purpose2: [undefined],
      loanFacilityAmount2: [undefined],
      interestRate2: [undefined],
      timePeriod2: [undefined],
      apology2: [undefined],
      staffName: [undefined],
      guarantorName2: [undefined],
      guarantorAddress: [undefined],
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

  onSubmit() {
    console.log(this.personalGuaranteeJoint.value);
  }

}
