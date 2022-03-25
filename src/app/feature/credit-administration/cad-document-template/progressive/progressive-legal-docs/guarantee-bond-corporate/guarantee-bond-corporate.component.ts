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
  selector: 'app-guarantee-bond-corporate',
  templateUrl: './guarantee-bond-corporate.component.html',
  styleUrls: ['./guarantee-bond-corporate.component.scss']
})
export class GuaranteeBondCorporateComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  spinner;
  form: FormGroup;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepaliData;

  constructor(private dialogRef: NbDialogRef<GuaranteeBondCorporateComponent>,
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
          this.setGuarantors(initialInfo.guarantorDetails);
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      const loanAmount = JSON.parse(this.cadData.nepData);
      this.form.patchValue({
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
        branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
        registerCompanyName: this.nepaliData.guarantorDetails[0].departmentGuarantor ? this.nepaliData.guarantorDetails[0].departmentGuarantor : '',
        date: this.nepaliData.guarantorDetails[0].registrationDateGuarantor ? this.nepaliData.guarantorDetails[0].registrationDateGuarantor : '',
        ltdNo: this.nepaliData.guarantorDetails[0].companyRegistrationNoGuarantor ? this.nepaliData.guarantorDetails[0].companyRegistrationNoGuarantor : '',
        registerDistrict: this.nepaliData.guarantorDetails[0].companyDistrictGuarantor ? this.nepaliData.guarantorDetails[0].companyDistrictGuarantor : '',
        regsiterMunicipality: this.nepaliData.guarantorDetails[0].companyVdcMunGuarantor ? this.nepaliData.guarantorDetails[0].companyVdcMunGuarantor : '',
        registerWadNo: this.nepaliData.guarantorDetails[0].companyWardNoGuarantor ? this.nepaliData.guarantorDetails[0].companyWardNoGuarantor : '',
        sewaKendra: this.nepaliData.guarantorDetails[0].taxPayerServiceOfficeGuarantor ? this.nepaliData.guarantorDetails[0].taxPayerServiceOfficeGuarantor : '',
        certificateNo: this.nepaliData.guarantorDetails[0].panNoGuarantor ? this.nepaliData.guarantorDetails[0].panNoGuarantor : '',
        registerDate: this.nepaliData.guarantorDetails[0].panRegistrationDateGuarantor ? this.nepaliData.guarantorDetails[0].panRegistrationDateGuarantor : '',
        guaranterName: this.nepaliData.guarantorDetails[0].companyNameGuarantor ? this.nepaliData.guarantorDetails[0].companyNameGuarantor : '',
        regOffice: this.nepaliData.department ? this.nepaliData.department : '',
        regDate: this.nepaliData.registrationDate ? this.nepaliData.registrationDate : '',
        praliNo: this.nepaliData.companyRegistrationNo ? this.nepaliData.companyRegistrationNo : '',
        rajaswaDistrict: this.nepaliData.companyDistrict ? this.nepaliData.companyDistrict : '',
        rajaswaMunicipality: this.nepaliData.companyVdcMun ? this.nepaliData.companyVdcMun : '',
        rajaswaWadNo: this.nepaliData.companyWardNo ? this.nepaliData.companyWardNo : '',
        sewakendra: this.nepaliData.taxPayerServiceOffice ? this.nepaliData.taxPayerServiceOffice : '',
        PanNo: this.nepaliData.panNo ? this.nepaliData.panNo : '',
        PaNoRegDate: this.nepaliData.panRegistrationDate ? this.nepaliData.panRegistrationDate : '',
        registered: this.nepaliData.companyName ? this.nepaliData.companyName : '',
        amount: loanAmount.numberNepali ? loanAmount.numberNepali : '',
        amountInWord: loanAmount.nepaliWords ? loanAmount.nepaliWords : '',
        GuaranteeName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
        GuaranteeCitizenshipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
        GuaranteeDate: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
        GuaranteeCDOoffice: this.nepaliData.representativeCitizenshipIssuingAuthority ? this.nepaliData.representativeCitizenshipIssuingAuthority : '',
        GuaranteePermanentDistrict: this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
        GuaranteePermanentMunicipality: this.nepaliData.representativePermanentMunicipality ? this.nepaliData.representativePermanentMunicipality : '',
        GuaranteePermanentWadNo: this.nepaliData.representativePermanentWard ? this.nepaliData.representativePermanentWard : '',
        sabikVDC: this.nepaliData.representativePermanentVdc ? this.nepaliData.representativePermanentVdc : '',
        sabikWadNo: this.nepaliData.representativePermanentVdcWard ? this.nepaliData.representativePermanentVdcWard : '',
        GuaranteeTempDistrict: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
        GuaranteeTempMunicipality: this.nepaliData.representativeTemporaryMunicipality ? this.nepaliData.representativeTemporaryMunicipality : '',
        GuaranteeTempWadNo: this.nepaliData.representativeTemporaryWard ?  this.nepaliData.representativeTemporaryWard : '',
        sicerlyFatherName: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
        sicerlyGrandFatherName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
        sicerlyHusbandName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : ''
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
      wadNo: [undefined],
      branchName: [undefined],
      sonDaughterName: [undefined],
      husbandWifeName: [undefined],
      registerCompanyName: [undefined],
      date: [undefined],
      ltdNo: [undefined],
      registerDistrict: [undefined],
      regsiterMunicipality: [undefined],
      registerWadNo: [undefined],
      sewaKendra: [undefined],
      certificateNo: [undefined],
      registerDate: [undefined],
      guaranterName: [undefined],
      grandParentName: [undefined],
      grandChildName: [undefined],
      childName: [undefined],
      middleDistrict: [undefined],
      middleMunicipality: [undefined],
      middleWadNo: [undefined],
      age: [undefined],
      customerName: [undefined],
      citizenshipNo: [undefined],
      citizenshipRegDate: [undefined],
      pradanKaryalaya: [undefined],
      regOffice: [undefined],
      regDate: [undefined],
      praliNo: [undefined],
      rajaswaDistrict: [undefined],
      rajaswaMunicipality: [undefined],
      rajaswaWadNo: [undefined],
      sewakendra: [undefined],
      PanNo: [undefined],
      PaNoRegDate: [undefined],
      registered: [undefined],
      amount: [undefined],
      amountInWord: [undefined],
      middleAmount: [undefined],
      middleAmountInWord: [undefined],
      GuaranteeName: [undefined],
      GuaranteeCitizenshipNo: [undefined],
      GuaranteeDate: [undefined],
      GuaranteeCDOoffice: [undefined],
      GuaranteePermanentDistrict: [undefined],
      GuaranteePermanentMunicipality: [undefined],
      GuaranteePermanentWadNo: [undefined],
      sabikVDC: [undefined],
      sabikWadNo: [undefined],
      GuaranteeTempDistrict: [undefined],
      GuaranteeTempMunicipality: [undefined],
      GuaranteeTempWadNo: [undefined],
      sanakhatPersonNAme: [undefined],
      sanakhatPersonSymbNo: [undefined],
      itiSambatYear: [undefined],
      itiSambaMonth: [undefined],
      itiSambatDate: [undefined],
      itiSambatTime: [undefined],
      sicerlyFatherName: [undefined],
      sicerlyGrandFatherName: [undefined],
      sicerlyHusbandName: [undefined],
      itiSambatRojSubham: [undefined],
      guarantorDetails: this.formBuilder.array([]),
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
      witnessWardNo1: [undefined]
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
      guarantorWadNo: [undefined]
    });
  }

  setGuarantors(data) {
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
  }

  addMoreGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

}
