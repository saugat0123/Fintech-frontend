import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';

@Component({
  selector: 'app-guarantee-bond-personal',
  templateUrl: './guarantee-bond-personal.component.html',
  styleUrls: ['./guarantee-bond-personal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GuaranteeBondPersonalComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  spinner;
  form: FormGroup;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepaliData;
  nepDataPersonal;

  constructor(private dialogRef: NbDialogRef<GuaranteeBondPersonalComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService) {
  }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          /*this.setGuarantors(initialInfo.guarantorDetails);*/
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.nepDataPersonal = JSON.parse(this.cadData.nepDataPersonal);
      this.setGuarantors(this.nepaliData.guarantorDetails);
      this.form.patchValue({

      });
    }


  }


  onSubmit(): void {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
          this.initialInfoPrint = singleCadFile.initialInformation;
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);

      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }


  buildForm(): void {
    this.form = this.formBuilder.group({
      grandParentName: [undefined],
      parentName: [undefined],
      husbandName: [undefined],
      district: [undefined],
      municipality: [undefined],
      wardNo: [undefined],
      tempDistrict: [undefined],
      tempMunicipality: [undefined],
      tempWardNo: [undefined],
      tempWardNo2: [undefined],
      date: [undefined],
      cdoOffice: [undefined],
      citizenshipNo: [undefined],
      age: [undefined],
      buttonGrandParentName: [undefined],
      buttonParentName: [undefined],
      buttonhusbandName: [undefined],
      buttonDistrict: [undefined],
      buttonMunicipality: [undefined],
      buttonWardNo: [undefined],
      buttonTempDistrict: [undefined],
      buttonTempMuniciplity: [undefined],
      buttonTempWardNo: [undefined],
      buttonDate: [undefined],
      buttonWifeName: [undefined],
      buttonCdoOffice: [undefined],
      buttonCitizenshipNo: [undefined],
      buttonAge: [undefined],
      guaranteeNAme: [undefined],
      guaranteeCitizenshipNo: [undefined],
      guaranteeIssueDate: [undefined],
      guaranteeCdoOffice: [undefined],
      guaranteePermanentDistrict: [undefined],
      guaranteePermanentMunicipality: [undefined],
      guaranteePermanentWardNo: [undefined],
      sabikVDC: [undefined],
      sabikWaNo: [undefined],
      guaranteeTempDistrict: [undefined],
      guaranteeTempMunicipality: [undefined],
      guaranteeTempWardNo: [undefined],
      fatherMotherName: [undefined],
      grandFatherGrandmomName: [undefined],
      husbandWifeName: [undefined],
      karmachariName: [undefined],
      karmachariSanketNo: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDate: [undefined],
      itiSambatRojSubham: [undefined],
      guarantorDetails: this.formBuilder.array([]),
      branchName: [undefined],
      sahiName: [undefined],
      namName: [undefined],
      newName: [undefined],
      sriName: [undefined],
      sriiName: [undefined],
      parName: [undefined],
      husName: [undefined],
      districtName: [undefined],
      municipalityName: [undefined],
      wardNoName: [undefined],
      tempDistrictName: [undefined],
      tempMunicipalityName: [undefined],
      buttonDateName: [undefined],
      buttonCdoOfficeName: [undefined],
      buttonCitizenshipNoName: [undefined],
      buttonAgeName: [undefined],
      sirName: [undefined],
      karjaYojana: [undefined],
      personalLoan: [undefined],
      name: [undefined],
      citizenNumber: [undefined],
      issuedYear: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipality: [undefined],
      guarantorWardNo: [undefined],
      name1: [undefined],
      citizenNumber1: [undefined],
      issuedYear1: [undefined],
      guarantorCDOoffice1: [undefined],
      guarantorDistrict1: [undefined],
      guarantorMunicipality1: [undefined],
      guarantorWardNo1: [undefined],
      borrowerName: [undefined]
    });
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  guarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [undefined],
      citizenNumber: [undefined],
      issuedYear: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipality: [undefined],
      guarantorWardNo: [undefined],
      customerName: [undefined],
      sincerlyCitizenshipNo: [undefined],
      sincerlyDate: [undefined],
      sincerlyCdOoffice: [undefined],
      district: [undefined],
      municipality: [undefined],
      wardNo: [undefined],
      tempDistrict: [undefined],
      tempMunicipality: [undefined],
      tempWardNo: [undefined],
      parentName: [undefined],
      grandParentName: [undefined],
      husbandWifeName: [undefined],
      amount: [undefined],
      amountInWord: [undefined],
      branchName : [undefined],
      chaltiKhata: [undefined],
      buttonCitizenshipNo: [undefined],
      buttonDate: [undefined],
      buttonCdoOffice: [undefined],
      age: [undefined],
      namName: [undefined],
      newName: [undefined],
      buttonParentName: [undefined],
      buttonhusbandName: [undefined],
      buttonDistrict: [undefined],
      buttonMunicipality: [undefined],
      buttonWardNo: [undefined],
      buttonTempDistrict: [undefined],
      buttonTempMuniciplity: [undefined],
      buttonTempWardNo: [undefined],
      date: [undefined],
      cdoOffice: [undefined],
      citizenshipNo: [undefined],
      buttonAge: [undefined],
      borrowerName: [undefined],
      personalLoan: [undefined],
      karjaYojana: [undefined],
      sriName: [undefined],
      sriiName: [undefined],
      buttonGrandParentName: [undefined],
      buttonWifeName: [undefined],
      parName: [undefined],
      husName: [undefined],
      districtName: [undefined],
      guaranteeNAme: [undefined],
      guaranteeCitizenshipNo: [undefined],
      guaranteeIssueDate: [undefined],
      guaranteeCdoOffice: [undefined],
      guaranteePermanentDistrict: [undefined],
      guaranteePermanentMunicipality: [undefined],
      guaranteePermanentWardNo: [undefined],
      guaranteeTempDistrict: [undefined],
      guaranteeTempMunicipality: [undefined],
      guaranteeTempWardNo: [undefined],
      fatherMotherName: [undefined],
      grandFatherGrandmomName: [undefined],
      karmachariName: [undefined],
      karmachariSanketNo: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDate: [undefined],
      itiSambatRojSubham: [undefined],
      sahiName: [undefined],
      tempMunicipalityName: [undefined],
      buttonDateName: [undefined],
      buttonCdoOfficeName: [undefined],
      buttonCitizenshipNoName: [undefined],
      buttonAgeName: [undefined],
      sirName: [undefined],
      name1: [undefined],
      citizenNumber1: [undefined],
      issuedYear1: [undefined],
      guarantorCDOoffice1: [undefined],
      guarantorDistrict1: [undefined],
      guarantorMunicipality1: [undefined],
      guarantorWardNo1: [undefined],
      tempWardNo2: [undefined],
      sabikMunicipality: [undefined],
      sabikWardNo: [undefined],
      municipalityName: [undefined],
      wardNoName: [undefined],
      tempDistrictName: [undefined],
      sabikVDC: [undefined],
      sabikWaNo: [undefined],
      citizenNo: [undefined],
      issuedYr: [undefined]
    });

  }

  setGuarantors(data) {
    const loanAmount = JSON.parse(this.cadData.nepData);
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (data.length === 0) {
      this.addMoreGuarantor();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        name: [value.name],
        citizenNo: [value.citizenNo],
        issuedYr: [value.issuedYr],
        guarantorCDOoffice: [value.guarantorCDOoffice],
        guarantorDistrict: [value.guarantorDistrict],
        guarantorMunicipality: [value.guarantorMunicipality],
        guarantorWardNo: [value.guarantorWardNo],
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
        sincerlyCitizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        sincerlyDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        sincerlyCdOoffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        district: [
          !ObjectUtil.isEmpty(value.guarantorPermanentDistrict) ?
              value.guarantorPermanentDistrict.nepaliName : ''
        ],
        municipality: [
          !ObjectUtil.isEmpty(value.guarantorPermanentMunicipality) ?
              value.guarantorPermanentMunicipality.nepaliName : ''
        ],
        wardNo: [value.guarantorPermanentWard],
        sabikVDC: [value.guarantorPermanentVdc],
        sabikWaNo: [value.guarantorPermanentVdcWard],
        tempDistrict: [
          !ObjectUtil.isEmpty(value.guarantorTemporaryDistrict) ?
              value.guarantorTemporaryDistrict.nepaliName : ''
        ],
        tempMunicipality: [
          !ObjectUtil.isEmpty(value.guarantorTemporaryMunicipality) ?
              value.guarantorTemporaryMunicipality.nepaliName : ''
        ],
        tempWardNo: [value.guarantorTemporaryWard],
        parentName: [value.guarantorFatherName],
        grandParentName: [value.guarantorGrandfatherName],
        husbandWifeName: [value.guarantorSpouseName],
        amount: loanAmount.numberNepali ? loanAmount.numberNepali : '',
        amountInWord: loanAmount.nepaliWords ? loanAmount.nepaliWords : '',
        branchName : this.nepaliData.branchName ? this.nepaliData.branchName : '',
        chaltiKhata: this.nepaliData.accountNo ? this.nepaliData.accountNo : '',
        buttonCitizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        buttonDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        buttonCdoOffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        age: [value.guarantorAge],
        namName: [value.guarantorName],
        newName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
        buttonParentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        buttonhusbandName: this.nepaliData.husbandName ? this. nepaliData.husbandName : '',
        buttonDistrict: [!ObjectUtil.isEmpty(this.nepaliData.permanentDistrict) ?
            this.nepaliData.permanentDistrict.nepaliName : ''],
        buttonMunicipality: [value.guarantorPermanentVdc],
        buttonWardNo: [value.guarantorPermanentVdcWard],
        buttonTempDistrict: [!ObjectUtil.isEmpty(this.nepaliData.temporaryDistrict) ?
            this.nepaliData.temporaryDistrict.nepaliName : ''],
        buttonTempMuniciplity: [!ObjectUtil.isEmpty(this.nepaliData.temporaryMunicipalities) ?
                this.nepaliData.temporaryMunicipalities.nepaliName : ''
        ],
        buttonTempWardNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
        date: [value.issuedYear],
        cdoOffice: [value.issuedPlace],
        citizenshipNo: [value.citizenNumber],
        buttonAge: this.nepaliData.age ? this.nepaliData.age : '',
        borrowerName: this.nepaliData.name ? this.nepaliData.name : '',
        personalLoan: this.nepDataPersonal.loanType ? this.nepDataPersonal.loanType : '',
        karjaYojana: this.nepDataPersonal.typeOfLoanInEnglish ? this.nepDataPersonal.typeOfLoanInEnglish : '',
        sriName: loanAmount.numberNepali ? loanAmount.numberNepali : '',
        sriiName: loanAmount.nepaliWords ? loanAmount.nepaliWords : '',
        buttonGrandParentName: [value.buttonGrandParentName],
        buttonWifeName: [value.buttonWifeName],
        parName: [value.parName],
        husName: [value.husName],
        districtName: [value.districtName],
        municipalityName: [value.municipalityName],
        wardNoName: [value.wardNoName],
        tempDistrictName: [value.tempDistrictName],
        guaranteeNAme: [value.guarantorName],
        guaranteeCitizenshipNo: [value.citizenNumber],
        guaranteeIssueDate: [value.issuedYear],
        guaranteeCdoOffice: [value.issuedPlace],
        guaranteePermanentDistrict: [!ObjectUtil.isEmpty(value.guarantorPermanentDistrict) ?
            value.guarantorPermanentDistrict.nepaliName : ''],
        guaranteePermanentMunicipality: [!ObjectUtil.isEmpty(value.guarantorPermanentMunicipality) ?
            value.guarantorPermanentMunicipality.nepaliName : ''],
        guaranteePermanentWardNo: [value.guarantorPermanentWard],
        guaranteeTempDistrict: [ !ObjectUtil.isEmpty(value.guarantorTemporaryDistrict) ?
            value.guarantorTemporaryDistrict.nepaliName : ''],
        guaranteeTempMunicipality: [!ObjectUtil.isEmpty(value.guarantorTemporaryMunicipality) ?
            value.guarantorTemporaryMunicipality.nepaliName : ''],
        guaranteeTempWardNo: [value.guarantorTemporaryWard],
        fatherMotherName: [value.guarantorFatherName],
        grandFatherGrandmomName: [value.guarantorGrandfatherName],
        karmachariName: [value.karmachariName],
        karmachariSanketNo: [value.karmachariSanketNo],
        itiSambatYear: [value.itiSambatYear],
        itiSambatMonth: [value.itiSambatMonth],
        itiSambatDate: [value.itiSambatDate],
        itiSambatRojSubham: [value.itiSambatRojSubham],
        sahiName: [value.sahiName],
        tempMunicipalityName: [value.tempMunicipalityName],
        buttonDateName: [value.buttonDateName],
        buttonCdoOfficeName: [value.buttonCdoOfficeName],
        buttonCitizenshipNoName: [value.buttonCitizenshipNoName],
        buttonAgeName: [value.buttonAgeName],
        sirName: [value.sirName],
        name1: [value.name1],
        citizenNumber1: [value.citizenNumber1],
        issuedYear1: [value.issuedYear1],
        guarantorCDOoffice1: [value.guarantorCDOoffice1],
        guarantorDistrict1: [value.guarantorDistrict1],
        guarantorMunicipality1: [value.guarantorMunicipality1],
        guarantorWardNo1: [value.guarantorWardNo1],
        tempWardNo2: [value.tempWardNo2],
        sabikMunicipality: [value.guarantorPermanentVdc],
        sabikWardNo: [value.guarantorPermanentVdcWard]

      }));
    });
  }

  addMoreGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

 /* removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }*/

}
