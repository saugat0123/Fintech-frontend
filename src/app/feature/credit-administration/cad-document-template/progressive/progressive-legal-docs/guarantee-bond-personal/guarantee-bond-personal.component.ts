import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
  styleUrls: ['./guarantee-bond-personal.component.scss']
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
      const loanAmount = JSON.parse(this.cadData.nepData);
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.nepDataPersonal = JSON.parse(this.cadData.nepDataPersonal);
      console.log('asdf', this.nepaliData);

      this.form.patchValue({
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
        sincerlyCitizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        sincerlyDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        sincerlyCdOoffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        district: this.nepaliData.guarantorDetails[0].guarantorPermanentDistrict.nepaliName ? this.nepaliData.guarantorDetails[0].guarantorPermanentDistrict.nepaliName : '',
        municipality: this.nepaliData.guarantorDetails[0].guarantorPermanentMunicipality.nepaliName ? this.nepaliData.guarantorDetails[0].guarantorPermanentMunicipality.nepaliName : '',
        wardNo: this.nepaliData.guarantorDetails[0].guarantorPermanentWard ? this.nepaliData.guarantorDetails[0].guarantorPermanentWard : '',
        tempDistrict: this.nepaliData.guarantorDetails[0].guarantorTemporaryDistrict.nepaliName ? this.nepaliData.guarantorDetails[0].guarantorTemporaryDistrict.nepaliName : '',
        tempMunicipality: this.nepaliData.guarantorDetails[0].guarantorTemporaryMunicipality.nepaliName ? this.nepaliData.guarantorDetails[0].guarantorTemporaryMunicipality.nepaliName : '',
        tempWardNo: this.nepaliData.guarantorDetails[0].guarantorTemporaryWard ? this.nepaliData.guarantorDetails[0].guarantorTemporaryWard : '',
        parentName: this.nepaliData.guarantorDetails[0].guarantorFatherName ? this.nepaliData.guarantorDetails[0].guarantorFatherName : '',
        grandParentName: this.nepaliData.guarantorDetails[0].guarantorGrandfatherName ? this.nepaliData.guarantorDetails[0].guarantorGrandfatherName : '',
        husbandWifeName: this.nepaliData.guarantorDetails[0].guarantorSpouseName ? this.nepaliData.guarantorDetails[0].guarantorSpouseName : '',
        amount: loanAmount.numberNepali ? loanAmount.numberNepali : '',
        amountInWord: loanAmount.nepaliWords ? loanAmount.nepaliWords : '',
        branchName : this.nepaliData.branchName ? this.nepaliData.branchName : '',
        chaltiKhata: this.nepaliData.accountNo ? this.nepaliData.accountNo : '',
        buttonCitizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        buttonDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        buttonCdoOffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        age: this.nepaliData.guarantorDetails[0].guarantorAge ? this.nepaliData.guarantorDetails[0].guarantorAge : '',
        namName: this.nepaliData.guarantorDetails[0].guarantorName ? this.nepaliData.guarantorDetails[0].guarantorName : '',
        newName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
        buttonParentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        buttonhusbandName: this.nepaliData.husbandName ? this. nepaliData.husbandName : '',
        buttonDistrict: this.nepaliData.permanentDistrict.nepaliName ? this.nepaliData.permanentDistrict.nepaliName : '',
        buttonMunicipalityt: this.nepaliData.permanentMunicipalities.nepaliName ? this.nepaliData.permanentMunicipalities.nepaliName : '',
        buttonWardNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
        buttonTempDistrict: this.nepaliData.temporaryDistrict.nepaliName ? this.nepaliData.temporaryDistrict.nepaliName : '',
        buttonTempMuniciplity: this.nepaliData.temporaryMunicipalities.nepaliName ? this.nepaliData.temporaryMunicipalities.nepaliName : '',
        buttonTempWardNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
        date: this.nepaliData.guarantorDetails[0].issuedYear ? this.nepaliData.guarantorDetails[0].issuedYear : '',
        cdoOffice: this.nepaliData.guarantorDetails[0].issuedPlace ? this.nepaliData.guarantorDetails[0].issuedPlace : '',
        citizenshipNo: this.nepaliData.guarantorDetails[0].citizenNumber ? this.nepaliData.guarantorDetails[0].citizenNumber : '',
        buttonAge: this.nepaliData.age ? this.nepaliData.age : '',
        borrowerName: this.nepaliData.name ? this.nepaliData.name : '',
        personalLoan: this.nepDataPersonal.loanType ? this.nepDataPersonal.loanType : '',
        karjaYojana: this.nepDataPersonal.typeOfLoanInEnglish ? this.nepDataPersonal.typeOfLoanInEnglish : '',
        sriName: loanAmount.numberNepali ? loanAmount.numberNepali : '',
        sriiName: loanAmount.nepaliWords ? loanAmount.nepaliWords : ''
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
      sasuSasura: [undefined],
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
      buttonSasuSasura: [undefined],
      buttonDistrict: [undefined],
      buttonMunicipalityt: [undefined],
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
      saSura: [undefined],
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

 /* guarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [undefined],
      citizenNumber: [undefined],
      issuedYear: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipality: [undefined],
      guarantorWadNo: [undefined]
    });

  }*/

 /* setGuarantors(data) {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (data.length === 0) {
      this.addMoreGuarantor();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        name: [value.name],
        citizenNumber: [value.citizenNumber],
        issuedYear: [value.issuedYear],
        guarantorCDOoffice: [value.guarantorCDOoffice],
        guarantorDistrict: [value.guarantorDistrict],
        guarantorMunicipality: [value.guarantorMunicipality],
        guarantorWadNo: [value.guarantorWadNo]
      }));
    });
  }*/

  /*addMoreGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }*/

 /* removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }*/

}
