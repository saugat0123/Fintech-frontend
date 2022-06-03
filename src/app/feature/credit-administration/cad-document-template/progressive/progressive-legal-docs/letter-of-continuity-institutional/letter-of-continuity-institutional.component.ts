import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';

class CustomerOfferLetterInstitutional {
}

@Component({
  selector: 'app-letter-of-continuity-institutional',
  templateUrl: './letter-of-continuity-institutional.component.html',
  styleUrls: ['./letter-of-continuity-institutional.component.scss']
})
export class LetterOfContinuityInstitutionalComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;

  spinner;
  form: FormGroup;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetterInstitutional;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepaliData;

  constructor(private dialogRef: NbDialogRef<LetterOfContinuityInstitutionalComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
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
          this.setGuarantors(initialInfo.guarantorDetails);
          this.setsecGuarantors(initialInfo.secguarantorDetails);
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    const loanAmount = JSON.parse(this.cadData.nepData);
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.form.patchValue({
        udhyogBibhag: this.nepaliData.department ? this.nepaliData.department : '',
        praliNo: this.nepaliData.companyRegistrationNo ? this.nepaliData.companyRegistrationNo : '',
        underDate: this.nepaliData.registrationDate ? this.nepaliData.registrationDate : '',
        sewaKendra: this.nepaliData.taxPayerServiceOffice ? this.nepaliData.taxPayerServiceOffice : '',
        certificateNo: this.nepaliData.panNo ? this.nepaliData.panNo : '',
        regDate: this.nepaliData.panRegistrationDate ? this.nepaliData.panRegistrationDate : '',
        debtorName: this.nepaliData.companyName ? this.nepaliData.companyName : '',
        pratiNidhi: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
        // belowAmount: this.nepaliData.name ? this.nepaliData.name : '',
        signaturePersonName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
        signaturePersonCitizenshipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
        // tslint:disable-next-line:max-line-length
        signaturePersonCitizenshipIssueDate: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
        // tslint:disable-next-line:max-line-length
        signaturePersonCDOoffice: this.nepaliData.representativeCitizenshipIssuingAuthority ? this.nepaliData.representativeCitizenshipIssuingAuthority : '',
        // tslint:disable-next-line:max-line-length
        signaturePersonPermanentDistrict: this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
        // tslint:disable-next-line:max-line-length
        signaturePersonPermanentMuniciplity: this.nepaliData.representativePermanentMunicipality ? this.nepaliData.representativePermanentMunicipality : '',
        signaturePersonPermanentWadNo: this.nepaliData.representativePermanentWard ? this.nepaliData.representativePermanentWard : '',
        // sabikVDC: this.nepaliData.companyName ? this.nepaliData.companyName : '',
        // sabikWadNo: this.nepaliData.companyName ? this.nepaliData.companyName : '',
        signaturePersonTempDistrict: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
        // tslint:disable-next-line:max-line-length
        signaturePersonTempMunicipality: this.nepaliData.representativeTemporaryMunicipality ? this.nepaliData.representativeTemporaryMunicipality : '',
        signaturePersonTempWadNo: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
        buttonParentName: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
        buttonGrandParentName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
        buttonHusbandWifeName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
        branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
        companyDistrict: this.nepaliData.companyDistrict ? this.nepaliData.companyDistrict : '',
        companyMunVdc: this.nepaliData.companyVdcMun ? this.nepaliData.companyVdcMun : '',
        companyWardNo: this.nepaliData.companyWardNo ? this.nepaliData.companyWardNo : '',
        address: this.nepaliData.companyRegistrarOfficeDistrict ? this.nepaliData.companyRegistrarOfficeDistrict : '',
        sabikVDC: this.nepaliData.representativePermanentVdc ? this.nepaliData.representativePermanentVdc : '',
        sabikWadNo: this.nepaliData.representativePermanentVdcWard ? this.nepaliData.representativePermanentVdcWard : ''
      });
    }
    this.form.get('belowAmount').patchValue(loanAmount.numberNepali);
    this.form.get('belowAmountInWord').patchValue(loanAmount.nepaliWords);
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
      amount: [undefined],
      sincerlyName: [undefined],
      sincerlyPermanentAddress: [undefined],
      sincerlyTempAdress: [undefined],
      ParentsName: [undefined],
      grandParentsName: [undefined],
      address: [undefined],
      IdentifiedGuarantorName: [undefined],
      IdentifiedHintNo: [undefined],
      ItisambatYear: [undefined],
      ItisambatMonth: [undefined],
      ItisambatDay: [undefined],
      ItisambatTime: [undefined],
      ItisambatRojSubham: [undefined],
      branchName: [undefined],
      udhyogBibhag: [undefined],
      praliNo: [undefined],
      underDate: [undefined],
      sewaKendra: [undefined],
      certificateNo: [undefined],
      regDate: [undefined],
      debtorName: [undefined],
      pratiNidhi: [undefined],
      belowAmount: [undefined],
      belowAmountInWord: [undefined],
      signaturePersonName: [undefined],
      signaturePersonCitizenshipNo: [undefined],
      signaturePersonCitizenshipIssueDate: [undefined],
      signaturePersonCDOoffice: [undefined],
      signaturePersonPermanentDistrict: [undefined],
      signaturePersonPermanentMuniciplity: [undefined],
      signaturePersonPermanentWadNo: [undefined],
      sabikVDC: [undefined],
      sabikWadNo: [undefined],
      signaturePersonTempDistrict: [undefined],
      signaturePersonTempMunicipality: [undefined],
      signaturePersonTempWadNo: [undefined],
      sanakhatPersonName: [undefined],
      sanakhatPersonSymNo: [undefined],
      itisambatYear: [undefined],
      itisambatMonth: [undefined],
      itisambatDate: [undefined],
      itisambatTime: [undefined],
      itisambatSubham: [undefined],
      buttonParentName: [undefined],
      buttonGrandParentName: [undefined],
      buttonHusbandWifeName: [undefined],
      guarantorDetails: this.formBuilder.array([]),
      secguarantorDetails: this.formBuilder.array([]),
      shakhaName: [undefined],
      naPraNaName: [undefined],
      mitiName: [undefined],
      jiPrakaName: [undefined],
      jillaName: [undefined],
      jagaName: [undefined],
      jillaName1: [undefined],
      jagaName1: [undefined],
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
      companyDistrict: [undefined],
      companyMunVdc: [undefined],
      companyWardNo: [undefined],
    });
  }


  guarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      guarantorName: [undefined],
      issuedPlace: [undefined]

    });
  }
  secaddGuarantor(): void {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    formArray.push(this.secguarantorFormGroup());
  }

  secguarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      guarantorName: [undefined],
      citizenNumber: [undefined],
      issuedYear: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorDistrictara: [undefined],
      guarantorMunicipality: [undefined],
      guarantorWadNo: [undefined]

    });
  }
  secguarantorDetails(data) {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    if (data.length === 0) {
      this.secaddGuarantor();
      return;
    }
  }

  addGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }

  setGuarantors(data) {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (data.length === 0) {
      this.addGuarantor();
      return;
    }

    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        guarantorName: [value.name],
        issuedPlace: [value.issuedPlace]
      }));
    });


  }

  setsecGuarantors(data) {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    if (data.length === 0) {
      this.addGuarantor();
      return;
    }

    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        guarantorName: [value.name],
        citizenNumber: [value.citizenNumber],
        issuedYear: [value.issuedYear],
        guarantorCDOoffice: [value.guarantorCDOoffice],
        guarantorDistrictara: [value.guarantorDistrictara],
        guarantorMunicipality: [value.guarantorMunicipality],
        guarantorWadNo: [value.guarantorWadNo]
      }));
    });


  }

  addsecGuarantor(): void {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    formArray.push(this.secguarantorFormGroup());
  }

  removesecGuarantor(index: number): void {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    formArray.removeAt(index);
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }


}
