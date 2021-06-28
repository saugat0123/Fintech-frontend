import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {NbDialogRef} from '@nebular/theme';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-mrtg-deed-individual-different',
  templateUrl: './mrtg-deed-individual-different.component.html',
  styleUrls: ['./mrtg-deed-individual-different.component.scss']
})
export class MrtgDeedIndividualDifferentComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  mrtgIndividualDifferent: FormGroup;
  nepData;
  spinner;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterConst = IcfcOfferLetterConst;
  customerOfferLetter: CustomerOfferLetter;
  offerLetterDocument: OfferDocument;
  customVar;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<MrtgDeedIndividualDifferentComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
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
      subham: [undefined],
      mrtgPropertyDetails: this.formBuilder.array([]),

    });
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.mrtgIndividualDifferent.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.mrtgIndividualDifferent.get(wordLabel).patchValue(convertedVal);
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    const customerAddress =
        this.nepData.permanentMunicipality + ' j8f g ' +
        this.nepData.permanentWard + ' , ' +
        this.nepData.permanentDistrict;
    this.checkGender(this.nepData.gender);
    this.mrtgIndividualDifferent.patchValue({
      letterWriterName: this.nepData.name ? this.nepData.name : '',
      borrowerNameNepali: this.nepData.name ? this.nepData.name : '',
      borrowerGender: this.customVar ? this.customVar  : '',
      borrowerAddress: customerAddress ? customerAddress : '',
      borrowerCitizenshipNo: this.nepData.citizenshipNo ? this.nepData.citizenshipNo : '',
      borrowerCitizenshipIssuedDate: this.nepData.citizenshipIssueDate ? this.nepData.citizenshipIssueDate : '',
      borrowerCitizenshipIssuedOffice: this.nepData.citizenshipIssueDistrict ? this.nepData.citizenshipIssueDistrict : '',
      borrowerFatherName: this.nepData.fatherName ? this.nepData.fatherName : '',
      borrowerGrandFatherName: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
      borrowerSpouseName: this.nepData.husbandName ? this.nepData.husbandName : '',
    });
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED_INDIVIDUAL_DIFFERENT_BORROWER).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED_INDIVIDUAL_DIFFERENT_BORROWER);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {
        this.setTablePropertyDetails(initialInfo.mrtgPropertyDetails);
      }
      this.mrtgIndividualDifferent.patchValue(this.initialInfoPrint);
    }
  }

  addTable() {
    (this.mrtgIndividualDifferent.get('mrtgPropertyDetails') as FormArray).push(
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

  removeTableDetails(index) {
    (this.mrtgIndividualDifferent.get('mrtgPropertyDetails') as FormArray).removeAt(index);
  }

  setTablePropertyDetails(data) {
    const formArray = this.mrtgIndividualDifferent.get('mrtgPropertyDetails') as FormArray;
    if (data.length === 0) {
      this.addTable();
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

  submit() {
    console.log(this.mrtgIndividualDifferent.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED_INDIVIDUAL_DIFFERENT_BORROWER).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.mrtgIndividualDifferent.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED_INDIVIDUAL_DIFFERENT_BORROWER);
      offerDocument.initialInformation = JSON.stringify(this.mrtgIndividualDifferent.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }
    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
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
