import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NbDialogRef} from '@nebular/theme';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {LegalDocumentCheckListEnum} from '../../legalDocumentCheckListEnum';
import {RemoveNumberCommaPipe} from "../../../../../../@core/pipe/remove-number-comma.pipe";

@Component({
  selector: 'app-mrtg-deed-individual-different',
  templateUrl: './mrtg-deed-individual-different.component.html',
  styleUrls: ['./mrtg-deed-individual-different.component.scss']
})
export class MrtgDeedIndividualDifferentComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;

  mrtgIndividualDifferent: FormGroup;
  nepData;
  spinner;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterConst = LegalDocumentCheckListEnum;
  customVar;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<MrtgDeedIndividualDifferentComponent>,
              private removeCommaPipe: RemoveNumberCommaPipe) { }

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
    const cleanVal = this.removeCommaPipe.transform(wordLabelVar);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(cleanVal);
    this.mrtgIndividualDifferent.get(wordLabel).patchValue(convertedVal);
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
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
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.cadFileList.length > 0) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            const initialInfo = JSON.parse(singleCadFile.initialInformation);
            this.initialInfoPrint = initialInfo;
            if (!ObjectUtil.isEmpty(initialInfo)) {
              this.setTablePropertyDetails(initialInfo.mrtgPropertyDetails);
            }
            this.mrtgIndividualDifferent.patchValue(this.initialInfoPrint);
          } else {
            this.fillForm();
          }
        });
      } else {
        this.fillForm();
      }
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
        KittaNo: [value.KittaNo],
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
    let flag = true;

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.mrtgIndividualDifferent.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.mrtgIndividualDifferent.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.mrtgIndividualDifferent.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadData.id);
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
