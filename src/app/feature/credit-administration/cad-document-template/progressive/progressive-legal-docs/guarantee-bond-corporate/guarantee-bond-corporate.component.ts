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
  corporateGuarantor = new Array<any>();

  constructor(private dialogRef: NbDialogRef<GuaranteeBondCorporateComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService) {
  }


  ngOnInit() {
    this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
    this.buildForm();
    this.fillForm();
    (this.nepaliData.guarantorDetails).forEach(value => {
      if (value.guarantorType === 'Corporate_Guarantor') {
        this.corporateGuarantor.push(value);
      }
    });
    this.setCorporateGuarantor(this.corporateGuarantor);
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
      corporateGuarantors: this.formBuilder.array([]),
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

  setCorporateGuarantor(data) {
    const formArray = this.form.get('corporateGuarantors') as FormArray;
    const loanAmount = JSON.parse(this.cadData.nepData);
    data.forEach((value, i) => {
      formArray.push(this.formBuilder.group({
        registerCompanyName: value.departmentGuarantor ? value.departmentGuarantor : '',
        date: value.registrationDateGuarantor ? value.registrationDateGuarantor : '',
        ltdNo: value.companyRegistrationNoGuarantor ? value.companyRegistrationNoGuarantor : '',
        registerDistrict: value.companyDistrictGuarantor ? value.companyDistrictGuarantor : '',
        regsiterMunicipality: value.companyVdcMunGuarantor ? value.companyVdcMunGuarantor : '',
        registerWadNo: value.companyWardNoGuarantor ? value.companyWardNoGuarantor : '',
        sewaKendra: value.taxPayerServiceOfficeGuarantor ? value.taxPayerServiceOfficeGuarantor : '',
        certificateNo: value.panNoGuarantor ? value.panNoGuarantor : '',
        registerDate: value.panRegistrationDateGuarantor ? value.panRegistrationDateGuarantor : '',
        guaranterName: value.companyNameGuarantor ? value.companyNameGuarantor : '',
        branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
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
        sicerlyHusbandName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
        districtName: [undefined],
        municipalityName: [undefined],
        wadNo: [undefined],
        customerName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].customerName : '' : '' : ''],
        sonDaughterName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                        !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                        this.initialInfoPrint.corporateGuarantors[i].sonDaughterName : '' : '' : ''],
        husbandWifeName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].husbandWifeName : '' : '' : ''],
        grandParentName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                         !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                         !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                         this.initialInfoPrint.corporateGuarantors[i].grandParentName : '' : '' : ''],
        grandChildName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                        !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                        this.initialInfoPrint.corporateGuarantors[i].grandChildName : '' : '' : ''],
        childName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].childName : '' : '' : ''],
        middleDistrict: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].middleDistrict : '' : '' : ''],
        middleMunicipality: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].middleMunicipality : '' : '' : ''],
        middleWadNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].middleWadNo : '' : '' : ''],
        age: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].age : '' : '' : ''],
        citizenshipNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].citizenshipNo : '' : '' : ''],
        citizenshipRegDate: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].citizenshipRegDate : '' : '' : ''],
        pradanKaryalaya: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].pradanKaryalaya : '' : '' : ''],
        middleAmount: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].middleAmount : '' : '' : ''],
        middleAmountInWord: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].middleAmountInWord : '' : '' : ''],
        sanakhatPersonNAme: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].sanakhatPersonNAme : '' : '' : ''],
        sanakhatPersonSymbNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].sanakhatPersonSymbNo : '' : '' : ''],
        itiSambatYear: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].itiSambatYear : '' : '' : ''],
        itiSambaMonth: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].itiSambaMonth : '' : '' : ''],
        itiSambatDate: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].itiSambatDate : '' : '' : ''],
        itiSambatTime: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].itiSambatTime : '' : '' : ''],
        itiSambatRojSubham: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].itiSambatRojSubham : '' : '' : ''],
        witnessName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessName : '' : '' : ''],
        witnessCitizenshipNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessCitizenshipNo : '' : '' : ''],
        witnessCitizenshipIssueDate: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessCitizenshipIssueDate : '' : '' : ''],
        witnessCDOoffice: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessCDOoffice : '' : '' : ''],
        witnessIssuedPlace: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessIssuedPlace : '' : '' : ''],
        witnessMunicipality: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessMunicipality : '' : '' : ''],
        witnessWardNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessWardNo : '' : '' : ''],
        witnessName1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessName1 : '' : '' : ''],
        witnessCitizenshipNo1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessCitizenshipNo1 : '' : '' : ''],
        witnessCitizenshipIssueDate1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessCitizenshipIssueDate1 : '' : '' : ''],
        witnessCDOoffice1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessCDOoffice1 : '' : '' : ''],
        witnessIssuedPlace1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessIssuedPlace1 : '' : '' : ''],
        witnessMunicipality1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessMunicipality1 : '' : '' : ''],
        witnessWardNo1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
            !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.corporateGuarantors[i]) ?
                    this.initialInfoPrint.corporateGuarantors[i].witnessWardNo1 : '' : '' : '']
      }));
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
