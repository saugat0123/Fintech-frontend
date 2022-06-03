import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-promisory-note-institutional',
  templateUrl: './promisory-note-institutional.component.html',
  styleUrls: ['./promisory-note-institutional.component.scss']
})
export class PromisoryNoteInstitutionalComponent implements OnInit {
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
  loanAmount;

  constructor(private dialogRef: NbDialogRef<PromisoryNoteInstitutionalComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      MinistryOffice: [undefined],
      DepartmentName: [undefined],
      RegisterOffice: [undefined],
      Act: [undefined],
      UnderName: [undefined],
      UnderDate: [undefined],
      PraliNo: [undefined],
      ServiceOfficeName: [undefined],
      CertifiedCompany: [undefined],
      certificateNo: [undefined],
      CertifiedDistrict: [undefined],
      CertifiedMunicipality: [undefined],
      CertifiedWardNo: [undefined],
      bottomGrandfatherName: [undefined],
      bottomGrandMotherName: [undefined],
      bottomFatherName: [undefined],
      bottomMotherName: [undefined],
      bottomHusbandName: [undefined],
      bottomDistrictName: [undefined],
      bottomMunicipalityName: [undefined],
      bottomWardNo: [undefined],
      bottomTempDistrict: [undefined],
      bottomTempMunicipality: [undefined],
      bottomTempWardNo: [undefined],
      bottomAge: [undefined],
      bottoCustomerName: [undefined],
      bottoCustomerCizenshipNo: [undefined],
      bottomDate: [undefined],
      bottomCDOoffice: [undefined],
      bottomBranchName: [undefined],
      bottomAmount: [undefined],
      bottomAmountInWord: [undefined],
      bottomSincerlySign: [undefined],
      AkhtiyarName: [undefined],
      bottomSincerlyCitizenShipNo: [undefined],
      bottomSincerlyDate: [undefined],
      bottomSincerlyCDOoffice: [undefined],
      AkhtiyarPermanentDistrict: [undefined],
      AkhtiyarPermanentVDC: [undefined],
      AkhtiyarPermanentWardNo: [undefined],
      SabikVDC: [undefined],
      SabikWardNo: [undefined],
      AkhtiyarTempDistrict: [undefined],
      AkhtiyarTempVDC: [undefined],
      AkhtiyarTempWardNo: [undefined],
      buttomSincerlyParentName: [undefined],
      buttomSincerlyGrandParentName: [undefined],
      buttomSincerlyHusbandName: [undefined],
      buttomIdentifiedGuarantorName: [undefined],
      buttomIdentifiedHintNo: [undefined],
      buttomItisambatYear: [undefined],
      buttomItisambatMonth: [undefined],
      buttomItisambatDay: [undefined],
      buttomItisambatTime: [undefined],
      buttomItisambatRojSubham: [undefined],
      guarantorDetails: this.formBuilder.array([]),
      secguarantorDetails: this.formBuilder.array([]),
      address: [undefined],
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
      address1: [undefined]
    });

  }
  fillForm() {
    this.loanAmount = JSON.parse(this.cadData.nepData);
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          if (!ObjectUtil.isEmpty(initialInfo.secguarantorDetails)) {
            this.setsecGuarantorDetails(initialInfo.secguarantorDetails);
          }
          if (!ObjectUtil.isEmpty(initialInfo.guarantorDetails)) {
            this.setGuarantorDetails(initialInfo.guarantorDetails);
          }
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

      this.form.patchValue({
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
        MinistryOffice: this.nepaliData.ministryOfGovernmentOfNepal ? this.nepaliData.ministryOfGovernmentOfNepal : '',
        DepartmentName: this.nepaliData.department ? this.nepaliData.department : '',
        RegisterOffice: this.nepaliData.companyRegistrarOfficeDistrict ? this.nepaliData.companyRegistrarOfficeDistrict : '',
        Act: this.nepaliData.nameOfRegisteringAct ? this.nepaliData.nameOfRegisteringAct : '',
        UnderName: this.nepaliData.yearOfActEnactment ? this.nepaliData.yearOfActEnactment : '',
        UnderDate: this.nepaliData.registrationDate ? this.nepaliData.registrationDate : '',
        PraliNo: this.nepaliData.companyRegistrationNo ? this.nepaliData.companyRegistrationNo : '',
        ServiceOfficeName: this.nepaliData.taxPayerServiceOffice ? this.nepaliData.taxPayerServiceOffice : '',
        certificateNo: this.nepaliData.panNo ? this.nepaliData.panNo : '',
        CertifiedDistrict: this.nepaliData.companyDistrict ? this.nepaliData.companyDistrict : '',
        CertifiedMunicipality: this.nepaliData.companyVdcMun ? this.nepaliData.companyVdcMun : '',
        CertifiedWardNo: this.nepaliData.companyWardNo ? this.nepaliData.companyWardNo : '',
        CertifiedCompany: this.nepaliData.companyName ? this.nepaliData.companyName : '',
        bottomGrandfatherName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
        bottomFatherName: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
        bottomHusbandName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
        bottomDistrictName: this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
        bottomMunicipalityName: this.nepaliData.representativePermanentMunicipality ? this.nepaliData.representativePermanentMunicipality : '',
        bottomWardNo: this.nepaliData.representativePermanentWard ? this.nepaliData.representativePermanentWard : '',
        bottomTempDistrict: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
        bottomTempMunicipality: this.nepaliData.representativeTemporaryMunicipality ? this.nepaliData.representativeTemporaryMunicipality : '',
        bottomTempWardNo: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
        bottomAge: this.nepaliData.borrowerAge ? this.nepaliData.borrowerAge : '',
        bottoCustomerName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
        bottoCustomerCizenshipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
        bottomDate: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
        bottomCDOoffice: this.nepaliData.representativeCitizenshipIssuingAuthority ? this.nepaliData.representativeCitizenshipIssuingAuthority : '',
        bottomBranchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
        bottomAmount: !ObjectUtil.isEmpty(this.loanAmount) ? this.loanAmount.numberNepali : '',
        bottomAmountInWord: !ObjectUtil.isEmpty(this.loanAmount) ? this.loanAmount.nepaliWords : '',
        AkhtiyarName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
        bottomSincerlyCitizenShipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
        bottomSincerlyDate: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
        bottomSincerlyCDOoffice: this.nepaliData.representativeCitizenshipIssuingAuthority ? this.nepaliData.representativeCitizenshipIssuingAuthority : '',
        AkhtiyarPermanentDistrict:  this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
        AkhtiyarPermanentVDC: this.nepaliData.representativePermanentMunicipality ? this.nepaliData.representativePermanentMunicipality : '',
        AkhtiyarPermanentWardNo: this.nepaliData.representativePermanentWard ? this.nepaliData.representativePermanentWard : '',
        SabikVDC: this.nepaliData.representativePermanentVdc ? this.nepaliData.representativePermanentVdc : '',
        SabikWardNo: this.nepaliData.representativePermanentVdcWard ? this.nepaliData.representativePermanentVdcWard : '',
        AkhtiyarTempDistrict: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
        AkhtiyarTempVDC: this.nepaliData.representativeTemporaryMunicipality ? this.nepaliData.representativeTemporaryMunicipality : '',
        AkhtiyarTempWardNo: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
        buttomSincerlyParentName: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
        buttomSincerlyGrandParentName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
        buttomSincerlyHusbandName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
      });
    }
  }

  secaddGuarantor(): void {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    formArray.push(this.secguarantorFormGroup());
  }

  secguarantorFormGroup(): FormGroup {
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
  setsecGuarantorDetails(data) {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    if (data.length === 0) {
      this.secaddGuarantor();
      return;
    }
    data.forEach((value) => {
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

  secremoveGuarantor(index: number): void {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    formArray.removeAt(index);
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }


  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }
  addGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
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

  setGuarantorDetails(data) {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (data.length === 0) {
      this.addGuarantor();
      return;
    }
    data.forEach((value) => {
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

}
