import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ToastService} from '../../../../../../@core/utils';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {LegalDocumentCheckListEnum} from '../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-mortgage-deed-company',
  templateUrl: './mortgage-deed-company.component.html',
  styleUrls: ['./mortgage-deed-company.component.scss']
})
export class MortgageDeedCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;

  mortgageDeedCompany: FormGroup;
  spinner;
  offerLetterConst = LegalDocumentCheckListEnum;
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
    (this.mortgageDeedCompany.get('propertyEvaluation') as FormArray).removeAt(index);
  }

  addTableDate() {
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

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.mortgageDeedCompany.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.mortgageDeedCompany.get(wordLabel).patchValue(convertedVal);
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
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

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.cadFileList.length > 0) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            const initialInfo = JSON.parse(singleCadFile.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.mortgageDeedCompany.patchValue(this.initialInfoPrint);
            if (!ObjectUtil.isEmpty(initialInfo)) {
              this.setPropertyEvaluationTable(initialInfo.propertyEvaluation);
            }
          } else {
            this.fillForm();
          }
        });
      } else {
        this.fillForm();
      }
    }
  }

  submit() {
    console.log(this.mortgageDeedCompany.value);
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.mortgageDeedCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.mortgageDeedCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.mortgageDeedCompany.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
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