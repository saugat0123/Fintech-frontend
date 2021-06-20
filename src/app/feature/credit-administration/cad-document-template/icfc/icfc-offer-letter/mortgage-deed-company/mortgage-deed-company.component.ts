import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ToastService} from '../../../../../../@core/utils';

@Component({
  selector: 'app-mortgage-deed-company',
  templateUrl: './mortgage-deed-company.component.html',
  styleUrls: ['./mortgage-deed-company.component.scss']
})
export class MortgageDeedCompanyComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  mortgageDeedCompany: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private toastService: ToastService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.mortgageDeedCompany = this.formBuilder.group({
      registeredNo: [undefined],
      registrationNo: [undefined],
      letterPersonName: [undefined],
      loanType: [undefined],
      guarantorName: [undefined],
      borrowerName: [undefined],
      proprietorName: [undefined],
      bankBranch: [undefined],
      loanName: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      bankBranch2: [undefined],
      landRevenueOffice: [undefined],
      guarantorName2: [undefined],
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
      FatherName: [undefined],
      grandFatherName: [undefined],
      borrowerName2: [undefined],
      borrowerNameNepali: [undefined],
      borrowerNameEnglish: [undefined],
      officeRegisteredNo: [undefined],
      officeRegisteredDate: [undefined],
      companyName: [undefined],
      companyOperatorName: [undefined],
      borrowerAddress: [undefined],
      officeStaffName: [undefined],
      branchDistrict: [undefined],
      branchWardNo: [undefined],
      branchAddress: [undefined],
      propertyOwnerName: [undefined],
      regLandRevOffice: [undefined],
      landProvince: [undefined],
      landDistrict: [undefined],
      propertyEvaluation: this.formBuilder.array([]),
      receipt: [undefined],
      borrowerName3: [undefined],
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
      ApprovedBy: [undefined],
      inspectorRole: [undefined],
      checkedDate1: [undefined],
      ApprovedBy1: [undefined],
      inspectorRole1: [undefined],
    });
  }

  submit() {
    console.log(this.mortgageDeedCompany.value);
  }

  removeTableDetail(index) {
    // getting the form array from form group:
    (this.mortgageDeedCompany.get('propertyEvaluation') as FormArray).removeAt(index);
  }

  addTableDate() {
    // building or adding / pushing value of the form in array:
    (this.mortgageDeedCompany.get('propertyEvaluation') as FormArray).push(
        this.formBuilder.group({
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
        })
    );
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.mortgageDeedCompany.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.mortgageDeedCompany.get(wordLabel).patchValue(convertedVal);
  }



}
