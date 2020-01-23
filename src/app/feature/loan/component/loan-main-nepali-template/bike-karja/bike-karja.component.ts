import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bike-karja',
  templateUrl: './bike-karja.component.html',
  styleUrls: ['./bike-karja.component.scss']
})
export class BikeKarjaComponent implements OnInit {

  // date1: string;
  // proposalAmount: number;
  // applicantFullName: string;
  // applicantDob: string;
  //
  bikeKarjaForm: FormGroup;


  constructor(
      private formBuilder: FormBuilder) {

  }


  ngOnInit() {
    this.buildBikeKarjaForm();
  }

  buildBikeKarjaForm() {

    // pesonal info
    this.bikeKarjaForm = this.formBuilder.group({

      maritalStatus: [undefined],
      gender: [undefined],

      // // gender: [undefined], used no more
      // male: [undefined],
      // female: [undefined],
      // thirdsex: [undefined],

      date1: [undefined],
      photo: [undefined],
      proposalAmount: [undefined],
      applicantFullName: [undefined],
      applicantDob: [undefined],
      applicantAge : [undefined],
      applicantCitizenshipNo: [undefined],
      applicantCitizenshipIssuedDate: [undefined],
      citizenshipIssuedDistrict: [undefined],
      grandfatherName: [undefined],
      fatherName: [undefined],
      motherName: [undefined],
      spouseName: [undefined],
      guardian: [undefined],
      children: [undefined],
      other: [undefined],
      permanentAddress: [undefined],
      currentAddress: [undefined],
      district: [undefined],
      vdcMunicipality: [undefined],
      wardNo: [undefined],
      tole: [undefined],
      homeNo: [undefined],
      livedSince: [undefined],
      phoneNum: [undefined],
      mobileNum: [undefined],
      email: [undefined],
      residencyType: [undefined],

    //  placeholder for basasthan ko prakar

      academicQualification: [undefined],
      occupation: [undefined],
      employersName: [undefined],
      employersAddress: [undefined],
      employersPhoneNum: [undefined],
      employersFaxNum: [undefined],
      post: [undefined],
      monthlySalary: [undefined],
      yearsWorkedWithCurrentEmployer: [undefined],
      businessName: [undefined],
      businessAddress: [undefined],
      businessPhone: [undefined],
      businessFax: [undefined],
      businessEmail: [undefined],
      businessRegdType: [undefined],
      businessRegdDate: [undefined],
      businessStartDate: [undefined],
      businessTotalInvestment: [undefined],
      incomeTaxCertification: [undefined],
      incomeTaxCertifiedNum: [undefined],
      montlyKarobar: [undefined],
      businessIncomeMonthly: [undefined],

      businessOtherIncome: [undefined],
      homeOwnerName: [undefined],
      homeOwnerPhone: [undefined],
      relationWithHomeOwner: [undefined],
      homeRentMonthly: [undefined],
      homeAddress: [undefined],
      homeRentAgreement: [undefined],
      propertyOwnershipInfo: [undefined],
      homeLandType: [undefined],
      homeLandAddress: [undefined],
      homeLandArea: [undefined],
      homeLandKittaNum: [undefined],
      homeLandEstimatedPrice: [undefined],
      vehicleType: [undefined],
      vehicleModel: [undefined],
      vehicleEstimatedPrice: [undefined],
      vehicleRegdNo: [undefined],
      householdUtensilInfo: [undefined],

      // <!-- बैंक खाताको विवरण -->

      bankName: [undefined],
      accountNo: [undefined],
      branch: [undefined],
      accountType: [undefined],
      bankBalanceWithDate: [undefined],
      creditCard: [undefined],
      creditCardInfo: [undefined],
      transactionPrev: [undefined],
      loanTitle: [undefined],
      loanProvidedDate: [undefined],
      loanAmount: [undefined],
      loanDuration: [undefined],
      recPerName1: [undefined],
      relationWithRecPer1: [undefined],
      recPerAdd1: [undefined],
      recPerPhone1: [undefined],
      recPerMobile1: [undefined],
      recPerName2: [undefined],
      relationWithRecPer2: [undefined],
      recPerAdd2: [undefined],
      recPerPhone2: [undefined],
      recPerMobile2: [undefined],
      recPerName3: [undefined],
      recPerRel3: [undefined],
      recPerAdd3: [undefined],
      recPerPhone3: [undefined],
      recPerMobile3: [undefined],
      recPerName4: [undefined],
      recPerRel4: [undefined],
      recPerAdd4: [undefined],
      recPerPhone4: [undefined],
      recPerMobile4: [undefined],

      applicantAddMap: [undefined],
      jamanikartaAddMap: [undefined],
      vehicleMachineModel: [undefined],
      loanAmount2: [undefined],
      aksherepi2: [undefined],

    //  ब्याज दर

      interestRate: [undefined],
      yearsFromLoanApproval: [undefined],
      premiumPerMonth: [undefined],
      numOfPremium: [undefined],
      address2: [undefined],
      tdVehicleModel: [undefined],
      tdVehicleRegdNum: [undefined],
      tdEngineNum: [undefined],
      chasisNum: [undefined],
      color: [undefined],

      /* jamanikartaharu ko information*/

      personalJamanikartaName: [undefined],
      sign1: [undefined],
      date2: [undefined],
      personalJamanikartaName2: [undefined],
      sign2: [undefined],
      date3: [undefined],

    //  ghosana section
      applicantSign: [undefined],
      applicantName: [undefined],
      sign3: [undefined],
      jamanikartaName: [undefined],
      preparedBy: [undefined],
      preparedDate: [undefined],
      approvedBy: [undefined],

    });
  }


}
