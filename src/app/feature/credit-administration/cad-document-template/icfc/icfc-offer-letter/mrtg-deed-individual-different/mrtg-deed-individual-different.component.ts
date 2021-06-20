import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
  selector: 'app-mrtg-deed-individual-different',
  templateUrl: './mrtg-deed-individual-different.component.html',
  styleUrls: ['./mrtg-deed-individual-different.component.scss']
})
export class MrtgDeedIndividualDifferentComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  mrtgIndividualDifferent: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.mrtgIndividualDifferent = this.formBuilder.group({
      registeredNo: [undefined],
      registrationNo: [undefined],
      letterWriterName: [undefined],
      guarantorName: [undefined],
      bankBranch: [undefined],
      loanName: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      bankBranch2: [undefined],
      landRevenueOffice: [undefined],
      guarantorNameNepali: [undefined],
      guarantorNameEnglish: [undefined],
      dob: [undefined],
      gender: [undefined],
      address: [undefined],
      citizenshipNo: [undefined],
      citizenshipIssuedDate: [undefined],
      citizenshipIssuedOffice: [undefined],
      landLordSignNo: [undefined],
      mobileNo: [undefined],
      spouseName: [undefined],
      fatherName: [undefined],
      grandFatherName: [undefined],
      grandMotherName: [undefined],
      borrowerNameNepali: [undefined],
      borrowerNameEnglish: [undefined],
      borrowerDob: [undefined],
      borrowerGender: [undefined],
      borrowerAddress: [undefined],
      borrowerCitizenshipNo: [undefined],
      borrowerCitizenshipIssuedDate: [undefined],
      borrowerCitizenshipIssuedOffice: [undefined],
      borrowerLandLordSignNo: [undefined],
      borrowerMobileNo: [undefined],
      borrowerSpouseName: [undefined],
      borrowerFatherName: [undefined],
      borrowerGrandFatherName: [undefined],
      borrowerGrandMotherName: [undefined],
      officeStaffName: [undefined],
      branchDistrict: [undefined],
      branchWardNo: [undefined],
      branchAddress: [undefined],
      propertyOwnerName: [undefined],
      regLandRevOffice: [undefined],
      landProvince: [undefined],
      landDistrict: [undefined],
      districtName: [undefined],
      MunicipalityOrVdc: [undefined],
      wardNo: [undefined],
      seatNo: [undefined],
      KittaNo: [undefined],
      area: [undefined],
      propertyDetails: [undefined],
      propertyRight: [undefined],
      propertyEast: [undefined],
      propertyWest: [undefined],
      propertyNorth: [undefined],
      propertySouth: [undefined],
      receipt: [undefined],
      recommendationDoc: [undefined],
      guarantorName1: [undefined],
      docWrittenYear: [undefined],
      docWrittenMonth: [undefined],
      docWrittenDate: [undefined],
      docWrittenDay: [undefined],
      staffName1: [undefined],
      staffPosition1: [undefined],
      signedDate1: [undefined],
      propKittaNo: [undefined],
      staffName2: [undefined],
      staffPosition2: [undefined],
      signedDate2: [undefined],
      staffName3: [undefined],
      staffPosition3: [undefined],
      signedDate3: [undefined],
      docRegistrationNo: [undefined],
      passedDate: [undefined],
      tokenRegisteredDate: [undefined],
      verifiedDate: [undefined],
      businessAmnt: [undefined],
      customRegistrationNoAmnt: [undefined],
      GainedCapitalAmnt: [undefined],
      otherTaxAmnt: [undefined],
      docRecieptNo: [undefined],
      verifiedLandRevenueOffice: [undefined],
      checkedDate: [undefined],
      approvedBy: [undefined],
      inspectorRole: [undefined],
      checkedDate1: [undefined],
      approvedBy1: [undefined],
      inspectorRole1: [undefined],

    });
  }

  submit() {
    console.log(this.mrtgIndividualDifferent.value);
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.mrtgIndividualDifferent.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.mrtgIndividualDifferent.get(wordLabel).patchValue(convertedVal);
  }

}
