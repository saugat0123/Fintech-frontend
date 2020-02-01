import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliTemplateDataHolder} from '../../../model/nepali-template-data-holder';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NepaliTemplateType} from '../../../../admin/modal/nepali-template-type.enum';

@Component({
  selector: 'app-bike-karja',
  templateUrl: './bike-karja.component.html',
  styleUrls: ['./bike-karja.component.scss']
})
export class BikeKarjaComponent implements OnInit {

  @Input() nepaliTemplates: NepaliTemplateDataHolder[];
  bikeKarjaForm: FormGroup;
  templateIndexInArray: number = undefined;

  constructor(
      private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildBikeKarjaForm();
    // In case of edit
    if (!ObjectUtil.isEmpty(this.nepaliTemplates)) {
      for (let i = 0; i < this.nepaliTemplates.length; i++) {
        if (this.nepaliTemplates[i].type === NepaliTemplateType.getEnum(NepaliTemplateType.HIRE_PURCHASE_KARJA_BIKE)) {
          const parsedData = JSON.parse(this.nepaliTemplates[i].data);
          this.bikeKarjaForm.patchValue(parsedData);
          this.templateIndexInArray = i;
          break;
        }
      }
    }
  }

  buildBikeKarjaForm() {

    this.bikeKarjaForm = this.formBuilder.group({
    // personal info
      maritalStatus: [undefined],
      gender: [undefined],

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

  onSubmit() {
    if (!ObjectUtil.isEmpty(this.nepaliTemplates)) {
      this.nepaliTemplates[this.templateIndexInArray].data = JSON.stringify(this.bikeKarjaForm.value);
    } else {
      const newBikeKarja = new NepaliTemplateDataHolder();
      newBikeKarja.type = NepaliTemplateType.getEnum(NepaliTemplateType.HIRE_PURCHASE_KARJA_BIKE);
      newBikeKarja.data = JSON.stringify(this.bikeKarjaForm.value);
      this.nepaliTemplates.push(newBikeKarja);
    }
  }
}
