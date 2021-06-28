import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ToastService} from '../../../../../../@core/utils';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-mortgage-deed-company',
  templateUrl: './mortgage-deed-company.component.html',
  styleUrls: ['./mortgage-deed-company.component.scss']
})
export class MortgageDeedCompanyComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  mortgageDeedCompany: FormGroup;
  spinner;
  offerLetterDocument: OfferDocument;
  offerLetterConst = IcfcOfferLetterConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  customVar;
  nepData;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private dialogRef: NbDialogRef<MortgageDeedCompanyComponent>,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
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
      subham: [undefined],
      propertyEvaluation: this.formBuilder.array([]),
    });
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

  setPropertyEvaluationTable(data) {
    const formArray = this.mortgageDeedCompany.get('propertyEvaluation') as FormArray;
    if (data.length === 0) {
      this.addTableDate();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        districtName: [value.districtName],
        MunicipalityOrVdc: [value.MunicipalityOrVdc],
        wardNo: [value.wardNo],
        seatNo: [value.seatNo],
        KittaNo: [value.kittaNo],
        area: [value.area],
        propertyDetails: [value.propertyDetails],
        propertyRight: [value.propertyRight],
        propertyEast: [value.propertyEast],
        propertyWest: [value.propertyWest],
        propertyNorth: [value.propertyNorth],
        propertySouth: [value.propertySouth],
      }));
    });
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.mortgageDeedCompany.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.mortgageDeedCompany.get(wordLabel).patchValue(convertedVal);
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    // console.log(this.nepData);
    const customerAddress =
        this.nepData.permanentMunicipality + ' j8f g ' +
        this.nepData.permanentWard + ' , ' +
        this.nepData.permanentDistrict;
    this.checkGender(this.nepData.gender);
    this.mortgageDeedCompany.patchValue({
      letterPersonName: this.nepData.name ? this.nepData.name : '',
      borrowerName: this.nepData.name ? this.nepData.name : '',
      borrowerNameNepali: this.nepData.name ? this.nepData.name : '',
      borrowerAddress: customerAddress ? customerAddress : '',
      guarantorNameNepali: this.nepData.name ? this.nepData.name : '',
      gender: this.customVar ? this.customVar : '',
      address: customerAddress ? customerAddress : '',
      citizenshipNo: this.nepData.citizenshipNo ? this.nepData.citizenshipNo : '',
      citizenshipIssuedDate: this.nepData.citizenshipIssueDate ? this.nepData.citizenIssuedDate : '',
      citizenshipIssuedOffice: this.nepData.citizenshipIssueDistrict ? this.nepData.citizenshipIssueDistrict : '',
      spouseName: this.nepData.husbandName ? this.nepData.husbandName : '',
      FatherName: this.nepData.fatherName ? this.nepData.fatherName : '',
      grandFatherName: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
    });
    this.checkGender(this.nepData.gender);
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED_COMPANY).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED_COMPANY);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {
        this.setPropertyEvaluationTable(initialInfo.propertyEvaluation);
      }
      this.mortgageDeedCompany.patchValue(this.initialInfoPrint);
    }
  }

  submit() {
    console.log(this.mortgageDeedCompany.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
        this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED_COMPANY).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.mortgageDeedCompany.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED_COMPANY);
      offerDocument.initialInformation = JSON.stringify(this.mortgageDeedCompany.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }

  checkGender(gender) {
    if (gender === '1') {
      this.customVar = 'k\'?if';
    } else {
      this.customVar = 'dlxnf';
    }
  }

}
