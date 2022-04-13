import {Component, Input, OnInit} from '@angular/core';
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
  selector: 'app-hire-purchase-deed',
  templateUrl: './hire-purchase-deed.component.html',
  styleUrls: ['./hire-purchase-deed.component.scss']
})
export class HirePurchaseDeedComponent implements OnInit {
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
  primaryCollaterals = new Array<any>();
  loanCategory;

  constructor(private dialogRef: NbDialogRef<HirePurchaseDeedComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService) {
  }

  ngOnInit() {
    this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanCategory = this.cadData.assignedLoan[0].loanCategory;
    }
    this.buildForm();
    this.fillForm();
    (this.nepaliData.collateralDetails).forEach(value => {
      if (value.securityDetails === 'HP') {
        this.primaryCollaterals.push(value);
      }
    });
    this.setPrimaryCollaterals(this.primaryCollaterals);
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.setGuarantors(initialInfo.guarantorDetail);
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.form.patchValue({
        districtName: this.nepaliData.branchDistrict ? this.nepaliData.branchDistrict : '',
        municipalityName: this.nepaliData.branchMunVdc ? this.nepaliData.branchMunVdc : '',
        wardNo: this.nepaliData.branchWardNo ? this.nepaliData.branchWardNo : '',
        branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
        matralayaName: this.nepaliData.ministryOfGovernmentOfNepal ? this.nepaliData.ministryOfGovernmentOfNepal : '',
        biBhagCompany: this.nepaliData.department ? this.nepaliData.department : '',
        regOffice: this.nepaliData.companyRegistrarOfficeDistrict ? this.nepaliData.companyRegistrarOfficeDistrict : '',
        act: this.nepaliData.nameOfRegisteringAct ? this.nepaliData.nameOfRegisteringAct : '',
        under:  this.nepaliData.yearOfActEnactment ? this.nepaliData.yearOfActEnactment : '',
        underDate: this.nepaliData.registrationDate ? this.nepaliData.registrationDate : '',
        praliNo: this.nepaliData.companyRegistrationNo ? this.nepaliData.companyRegistrationNo : '',
        serviceOffice: this.nepaliData.taxPayerServiceOffice ? this.nepaliData.taxPayerServiceOffice : '',
        serviceDate: this.nepaliData.panRegistrationDate ? this.nepaliData.panRegistrationDate : '',
        certificateNo: this.nepaliData.panNo ? this.nepaliData.panNo : '',
        certifiedDistrict: this.nepaliData.companyDistrict ? this.nepaliData.companyDistrict : '',
        certifiedMunicipality: this.nepaliData.companyVdcMun ? this.nepaliData.companyVdcMun : '',
        certifiedWardNo: this.nepaliData.companyWardNo ? this.nepaliData.companyWardNo : '',
        secRegOffice: this.nepaliData.companyName ? this.nepaliData.companyName : '',
        pratinidhiGrandParent: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
        pratinidhiParent: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
        pratinidhiHusbandWifeName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
        pratinidhiDistrict: this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
        pratinidhiMunicipality: this.nepaliData.representativePermanentMunicipality ? this.nepaliData.representativePermanentMunicipality : '',
        pratinidhiWardNo: this.nepaliData.representativePermanentWard ? this.nepaliData.representativePermanentWard : '',
        pratinidhiTempDistrict: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
        pratinidhiTempMunicipality:  this.nepaliData.representativeTemporaryMunicipality ?
            this.nepaliData.representativeTemporaryMunicipality : '',
        pratinidhiTempWardNo: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
        pratinidhiAge: this.nepaliData.borrowerAge ? this.nepaliData.borrowerAge : '',
        pratinidhiName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
        pratinidhiCitizenshipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
        pratinidhiDate: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
        pratinidhiCDOoffice: this.nepaliData.representativeCitizenshipIssuingAuthority ?
            this.nepaliData.representativeCitizenshipIssuingAuthority : '',
        // for Individual
        grandParentName: !ObjectUtil.isEmpty(this.nepaliData.grandFatherName) ? this.nepaliData.grandFatherName : '',
        parentName: !ObjectUtil.isEmpty(this.nepaliData.fatherName) ? this.nepaliData.fatherName : '',
        husbandWifeName: !ObjectUtil.isEmpty(this.nepaliData.husbandName) ? this.nepaliData.husbandName : '',
        customerDistrict: !ObjectUtil.isEmpty(this.nepaliData.permanentDistrict) ? this.nepaliData.permanentDistrict.nepaliName : '',
        customerMunicipality: !ObjectUtil.isEmpty(this.nepaliData.permanentMunicipalities) ?
            this.nepaliData.permanentMunicipalities.nepaliName : '',
        customerWardNo: !ObjectUtil.isEmpty(this.nepaliData.permanentWard) ? this.nepaliData.permanentWard : '',
        sabikVDC: !ObjectUtil.isEmpty(this.nepaliData.permanentVdc) ? this.nepaliData.permanentVdc : '',
        sabikWardNo: !ObjectUtil.isEmpty(this.nepaliData.permanentVdcWard) ? this.nepaliData.permanentVdcWard : '',
        tempDistrict: !ObjectUtil.isEmpty(this.nepaliData.temporaryDistrict) ? this.nepaliData.temporaryDistrict.nepaliName : '',
        tempMunicipality: !ObjectUtil.isEmpty(this.nepaliData.temporaryMunicipalities) ?
            this.nepaliData.temporaryMunicipalities.nepaliName : '',
        tempWardNo: !ObjectUtil.isEmpty(this.nepaliData.temporaryWard) ? this.nepaliData.temporaryWard : '',
        age: !ObjectUtil.isEmpty(this.nepaliData.age) ? this.nepaliData.age : '',
        customerName: !ObjectUtil.isEmpty(this.nepaliData.name) ? this.nepaliData.name : '',
        customerCitizenshipNo: !ObjectUtil.isEmpty(this.nepaliData.citizenshipNo) ? this.nepaliData.citizenshipNo : '',
        date: !ObjectUtil.isEmpty(this.nepaliData.citizenshipIssueDate) ? this.nepaliData.citizenshipIssueDate : '',
        cdoOffice: !ObjectUtil.isEmpty(this.nepaliData.citizenshipIssueDistrict) ? this.nepaliData.citizenshipIssueDistrict : '',
        });
      this.patchDetails();
    }
  }

  patchDetails() {
    if (this.loanCategory === 'INSTITUTION') {
      this.form.patchValue({
        akhtiyarName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
        akhtiyarCitizenshipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
        akhtiyarDate: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
        akhtiyarMuniciplity: this.nepaliData.representativeCitizenshipIssuingAuthority ?
            this.nepaliData.representativeCitizenshipIssuingAuthority : '',
        akhtiyarPermanentDistrict: this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
        akhtiyarPermanentMunicipality: this.nepaliData.representativePermanentMunicipality ?
            this.nepaliData.representativePermanentMunicipality : '',
        akhtiyarPermanentWardNo: this.nepaliData.representativePermanentWard ? this.nepaliData.representativePermanentWard : '',
        akhtiyarSabikVDC: this.nepaliData.representativePermanentVdc ? this.nepaliData.representativePermanentVdc : '',
        akhtiyarSabikWardNo: this.nepaliData.representativePermanentVdcWard ? this.nepaliData.representativePermanentVdcWard : '',
        akhtiyarTempDistrict: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
        akhtiyarTempMunicipality: this.nepaliData.representativeTemporaryMunicipality ?
            this.nepaliData.representativeTemporaryMunicipality : '',
        akhtiyarTempWardNo: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
        sicerlyFatherName: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
        sicerlyGrandFatherName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
        sicerlyHusbandName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
      });
    }
    if (this.loanCategory === 'INDIVIDUAL') {
      this.form.patchValue({
        akhtiyarName: !ObjectUtil.isEmpty(this.nepaliData.name) ? this.nepaliData.name : '',
        akhtiyarCitizenshipNo: !ObjectUtil.isEmpty(this.nepaliData.citizenshipNo) ? this.nepaliData.citizenshipNo : '',
        akhtiyarDate: !ObjectUtil.isEmpty(this.nepaliData.citizenshipIssueDate) ? this.nepaliData.citizenshipIssueDate : '',
        akhtiyarMuniciplity: !ObjectUtil.isEmpty(this.nepaliData.citizenshipIssueDistrict) ? this.nepaliData.citizenshipIssueDistrict : '',
        akhtiyarPermanentDistrict: !ObjectUtil.isEmpty(this.nepaliData.permanentDistrict) ?
            this.nepaliData.permanentDistrict.nepaliName : '',
        akhtiyarPermanentMunicipality: !ObjectUtil.isEmpty(this.nepaliData.permanentMunicipalities) ?
            this.nepaliData.permanentMunicipalities.nepaliName : '',
        akhtiyarPermanentWardNo: !ObjectUtil.isEmpty(this.nepaliData.permanentWard) ? this.nepaliData.permanentWard : '',
        akhtiyarSabikVDC: !ObjectUtil.isEmpty(this.nepaliData.permanentVdc) ? this.nepaliData.permanentVdc : '',
        akhtiyarSabikWardNo: !ObjectUtil.isEmpty(this.nepaliData.permanentVdcWard) ? this.nepaliData.permanentVdcWard : '',
        akhtiyarTempDistrict: !ObjectUtil.isEmpty(this.nepaliData.temporaryDistrict) ? this.nepaliData.temporaryDistrict.nepaliName : '',
        akhtiyarTempMunicipality: !ObjectUtil.isEmpty(this.nepaliData.temporaryMunicipalities) ?
            this.nepaliData.temporaryMunicipalities.nepaliName : '',
        akhtiyarTempWardNo: !ObjectUtil.isEmpty(this.nepaliData.temporaryWard) ? this.nepaliData.temporaryWard : '',
        sicerlyFatherName: !ObjectUtil.isEmpty(this.nepaliData.fatherName) ? this.nepaliData.fatherName : '',
        sicerlyMotherName: !ObjectUtil.isEmpty(this.nepaliData.motherName) ? this.nepaliData.motherName : '',
        sicerlyGrandFatherName: !ObjectUtil.isEmpty(this.nepaliData.grandFatherName) ? this.nepaliData.grandFatherName : '',
        sicerlyHusbandName: !ObjectUtil.isEmpty(this.nepaliData.husbandName) ? this.nepaliData.husbandName : '',
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


  buildForm() {
    this.form = this.formBuilder.group({
      districtName: [undefined],
      municipalityName: [undefined],
      wardNo: [undefined],
      branchName: [undefined],
      grandParentName: [undefined],
      parentName: [undefined],
      husbandWifeName: [undefined],
      customerDistrict: [undefined],
      customerMunicipality: [undefined],
      customerWardNo: [undefined],
      sabikVDC: [undefined],
      sabikWardNo: [undefined],
      tempDistrict: [undefined],
      tempMunicipality: [undefined],
      tempWardNo: [undefined],
      age: [undefined],
      customerName: [undefined],
      customerCitizenshipNo: [undefined],
      date: [undefined],
      cdoOffice: [undefined],
      matralayaName: [undefined],
      biBhagCompany: [undefined],
      regOffice: [undefined],
      act: [undefined],
      under: [undefined],
      underDate: [undefined],
      praliNo: [undefined],
      serviceOffice: [undefined],
      serviceDate: [undefined],
      certificateNo: [undefined],
      certifiedDistrict: [undefined],
      certifiedMunicipality: [undefined],
      certifiedWardNo: [undefined],
      secRegOffice: [undefined],
      pratinidhiGrandParent: [undefined],
      pratinidhiParent: [undefined],
      pratinidhiHusbandWifeName: [undefined],
      pratinidhiDistrict: [undefined],
      pratinidhiMunicipality: [undefined],
      pratinidhiWardNo: [undefined],
      pratinidhiTempDistrict: [undefined],
      pratinidhiTempMunicipality: [undefined],
      pratinidhiTempWardNo: [undefined],
      pratinidhiAge: [undefined],
      pratinidhiName: [undefined],
      pratinidhiCitizenshipNo: [undefined],
      pratinidhiDate: [undefined],
      pratinidhiCDOoffice: [undefined],
      kistabandiBranchName: [undefined],
      kistabandiBranchAddress: [undefined],
      sincerlySign: [undefined],
      akhtiyarName: [undefined],
      akhtiyarCitizenshipNo: [undefined],
      akhtiyarDate: [undefined],
      akhtiyarMuniciplity: [undefined],
      akhtiyarPermanentDistrict: [undefined],
      akhtiyarPermanentMunicipality: [undefined],
      akhtiyarPermanentWardNo: [undefined],
      akhtiyarSabikVDC: [undefined],
      akhtiyarSabikWardNo: [undefined],
      akhtiyarTempDistrict: [undefined],
      akhtiyarTempMunicipality: [undefined],
      akhtiyarTempWardNo: [undefined],
      sicerlyFatherName: [undefined],
      sicerlyMotherName: [undefined],
      sicerlyGrandFatherName: [undefined],
      sicerlyGrandMotherName: [undefined],
      sicerlyHusbandName: [undefined],
      sicerlyWifeNAme: [undefined],
      sanakhatPersonName: [undefined],
      sanakhatPersonSymNo: [undefined],
      itisambatYear: [undefined],
      itisambatMonth: [undefined],
      itisambatDate: [undefined],
      itisambatTime: [undefined],
      itisambatSubham: [undefined],
      guarantorDetail: this.formBuilder.array([]),
      witnessName: [undefined],
      witnessCitizenshipNo: [undefined],
      witnessCitizenshipIssueDate: [undefined],
      witnessCDOoffice: [undefined],
      witnessIssuedPlace: [undefined],
      witnessMunicipality: [undefined],
      witnessWardNo: [undefined],
      witnessName1: [undefined],
      witnessCitizenshipNo1: [undefined],
      witnessCitizenshipIssueDate1: [undefined],
      witnessCDOoffice1: [undefined],
      witnessIssuedPlace1: [undefined],
      witnessMunicipality1: [undefined],
      witnessWardNo1: [undefined],
      primaryCollaterals: this.formBuilder.array([]),
    });
  }

  guarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [undefined],
      citizenNumber: [undefined],
      issuedYear: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipality: [undefined],
      guarantorWardNo: [undefined]

    });


  }

  setGuarantors(data) {
    const formArray = this.form.get('guarantorDetail') as FormArray;
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
        guarantorWardNo: [value.guarantorWardNo]
      }));
    });
  }

  addMoreGuarantor(): void {
    const formArray = this.form.get('guarantorDetail') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetail') as FormArray;
    formArray.removeAt(index);
  }

  removePrimaryCollateral(i: number) {
    (this.form.get('primaryCollaterals') as FormArray).removeAt(i);
  }

  setPrimaryCollaterals(data) {
    const formArray = this.form.get('primaryCollaterals') as FormArray;
    data.forEach((value, i) => {
      if (value.securityDetails === 'HP') {
        formArray.push(this.formBuilder.group({
          sawariPrakar: [!ObjectUtil.isEmpty(value.vehicleType) ? value.vehicleType : ''],
          regNo: [!ObjectUtil.isEmpty(value.vehicleNumber) ? value.vehicleNumber : ''],
          engineNo: [!ObjectUtil.isEmpty(value.engineNumber) ? value.engineNumber : ''],
          chasisNo: [!ObjectUtil.isEmpty(value.chassisNumber) ? value.chassisNumber : ''],
          regDate: [!ObjectUtil.isEmpty(value.vehicleRegistrationDate) ? value.vehicleRegistrationDate : ''],
        }));
      }
    });
  }

}
