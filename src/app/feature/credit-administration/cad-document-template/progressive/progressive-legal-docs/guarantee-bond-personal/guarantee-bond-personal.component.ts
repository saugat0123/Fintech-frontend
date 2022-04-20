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
  loanCategory;

  constructor(private dialogRef: NbDialogRef<GuaranteeBondPersonalComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanCategory = this.cadData.assignedLoan[0].loanCategory;
    }
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
      this.form.patchValue({});
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
      borrowerName: [undefined],
      company: [undefined],
      registerCompanyName: [undefined],
      companyDistrict: [undefined],
      actName: [undefined],
      actYear: [undefined],
      regDate: [undefined],
      companyRegDate: [undefined],
      taxSewa: [undefined],
      panRegDate: [undefined],
      panNo: [undefined],
      companyDist: [undefined],
      companyMunicipality: [undefined],
      companyWardNo: [undefined],
      enterpriseName: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      spouseName: [undefined],
      facilityDistrict: [undefined],
      muni: [undefined],
      ward: [undefined],
      tempDis: [undefined],
      tempMuni: [undefined],
      tempWard: [undefined],
      representativeAge: [undefined],
      representativeName: [undefined],
      reCitizenShipNo: [undefined],
      reCitizenShipIssueDate: [undefined],
      citizenshipIssueOffice: [undefined],
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
      issuedYr: [undefined],
      company: [undefined],
      registerCompanyName: [undefined],
      companyDistrict: [undefined],
      actName: [undefined],
      actYear: [undefined],
      regDate: [undefined],
      companyRegDate: [undefined],
      taxSewa: [undefined],
      panRegDate: [undefined],
      panNo: [undefined],
      companyDist: [undefined],
      companyMunicipality: [undefined],
      companyWardNo: [undefined],
      enterpriseName: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      spouseName: [undefined],
      facilityDistrict: [undefined],
      muni: [undefined],
      ward: [undefined],
      tempDis: [undefined],
      tempMuni: [undefined],
      tempWard: [undefined],
      representativeAge: [undefined],
      representativeName: [undefined],
      reCitizenShipNo: [undefined],
      reCitizenShipIssueDate: [undefined],
      citizenshipIssueOffice: [undefined],
    });

  }

  setGuarantors(data) {
    const loanAmount = JSON.parse(this.cadData.nepData);
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (data.length === 0) {
      this.addMoreGuarantor();
      return;
    }
    data.forEach((value, i) => {
      if (this.loanCategory === 'INDIVIDUAL' || (this.loanCategory === 'INSTITUTION' && value.guarantorType === 'Personal_Guarantor')) {
        formArray.push(this.formBuilder.group({
          name: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].name : '' : '' : ''],
          citizenNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].citizenNo : '' : '' : ''],
          issuedYr: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].issuedYr : '' : '' : ''],
          guarantorCDOoffice: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].guarantorCDOoffice : '' : '' : ''],
          guarantorDistrict: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].guarantorDistrict : '' : '' : ''],
          guarantorMunicipality: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].guarantorMunicipality : '' : '' : ''],
          guarantorWardNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].guarantorWardNo : '' : '' : ''],
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
          buttonGrandParentName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].buttonGrandParentName : '' : '' : ''],
          buttonWifeName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].buttonWifeName : '' : '' : ''],
          parName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].parName : '' : '' : ''],
          husName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].husName : '' : '' : ''],
          districtName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].districtName : '' : '' : ''],
          municipalityName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].municipalityName : '' : '' : ''],
          wardNoName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].wardNoName : '' : '' : ''],
          tempDistrictName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].tempDistrictName : '' : '' : ''],
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
          karmachariName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].karmachariName : '' : '' : ''],
          karmachariSanketNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].karmachariSanketNo : '' : '' : ''],
          itiSambatYear: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].itiSambatYear : '' : '' : ''],
          itiSambatMonth: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].itiSambatMonth : '' : '' : ''],
          itiSambatDate: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].itiSambatDate : '' : '' : ''],
          itiSambatRojSubham: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].itiSambatRojSubham : '' : '' : ''],
          sahiName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].sahiName : '' : '' : ''],
          tempMunicipalityName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].tempMunicipalityName : '' : '' : ''],
          buttonDateName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].buttonDateName : '' : '' : ''],
          buttonCdoOfficeName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].buttonCdoOfficeName : '' : '' : ''],
          buttonCitizenshipNoName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].buttonCitizenshipNoName : '' : '' : ''],
          buttonAgeName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].buttonAgeName : '' : '' : ''],
          sirName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].sirName : '' : '' : ''],
          name1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].name1 : '' : '' : ''],
          citizenNumber1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].citizenNumber1 : '' : '' : ''],
          issuedYear1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].issuedYear1 : '' : '' : ''],
          guarantorCDOoffice1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].guarantorCDOoffice1 : '' : '' : ''],
          guarantorDistrict1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].guarantorDistrict1 : '' : '' : ''],
          guarantorMunicipality1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].guarantorMunicipality1 : '' : '' : ''],
          guarantorWardNo1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].guarantorWardNo1 : '' : '' : ''],
          tempWardNo2: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].tempWardNo2 : '' : '' : ''],
          sabikMunicipality: [value.guarantorPermanentVdc],
          sabikWardNo: [value.guarantorPermanentVdcWard],
          company: this.nepaliData.ministryOfGovernmentOfNepal ? this.nepaliData.ministryOfGovernmentOfNepal : '',
          registerCompanyName: this.nepaliData.department ? this.nepaliData.department : '',
          companyDistrict: this.nepaliData.companyRegistrarOfficeDistrict ? this.nepaliData.companyRegistrarOfficeDistrict : '',
          actName: this.nepaliData.nameOfRegisteringAct ? this.nepaliData.nameOfRegisteringAct : '',
          actYear: this.nepaliData.yearOfActEnactment ? this.nepaliData.yearOfActEnactment : '',
          regDate: this.nepaliData.registrationDate ? this.nepaliData.registrationDate : '',
          companyRegDate: this.nepaliData.companyRegistrationNo ? this.nepaliData.companyRegistrationNo : '',
          taxSewa: this.nepaliData.taxPayerServiceOffice ? this.nepaliData.taxPayerServiceOffice : '',
          panRegDate: this.nepaliData.panRegistrationDate ? this.nepaliData.panRegistrationDate : '',
          panNo: this.nepaliData.panNo ? this.nepaliData.panNo : '',
          companyDist: this.nepaliData.companyDistrict ? this.nepaliData.companyDistrict : '',
          companyMunicipality: this.nepaliData.companyVdcMun ? this.nepaliData.companyVdcMun : '',
          companyWardNo: this.nepaliData.companyWardNo ? this.nepaliData.companyWardNo : '',
          enterpriseName: this.nepaliData.companyName ? this.nepaliData.companyName : '',
          grandFatherName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
          fatherName: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
          spouseName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
          facilityDistrict: this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
          muni: this.nepaliData.representativePermanentVdc ? this.nepaliData.representativePermanentVdc : '',
          ward: this.nepaliData.representativePermanentVdcWard ? this.nepaliData.representativePermanentVdcWard : '',
          tempDis: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
          tempMuni: this.nepaliData.representativeTemporaryMunicipality ? this.nepaliData.representativeTemporaryMunicipality : '',
          tempWard: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
          representativeAge: this.nepaliData.borrowerAge ? this.nepaliData.borrowerAge : '',
          representativeName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
          reCitizenShipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
          // tslint:disable-next-line:max-line-length
          reCitizenShipIssueDate: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
          // tslint:disable-next-line:max-line-length
          citizenshipIssueOffice: this.nepaliData.representativeCitizenshipIssuingAuthority ? this.nepaliData.representativeCitizenshipIssuingAuthority : '',
        }));
      }
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
