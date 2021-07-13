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
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
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
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService) {
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
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

      this.form.patchValue({
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
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
      guarantorDetails: this.formBuilder.array([])


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
