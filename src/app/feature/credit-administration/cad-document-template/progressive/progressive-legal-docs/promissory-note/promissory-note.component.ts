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
  selector: 'app-promissory-note',
  templateUrl: './promissory-note.component.html',
  styleUrls: ['./promissory-note.component.scss']
})
export class PromissoryNoteComponent implements OnInit {
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

  constructor(private dialogRef: NbDialogRef<PromissoryNoteComponent>,
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
      const loanAmount = JSON.parse(this.cadData.nepData);
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

      this.form.patchValue({
        grandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
        fatherName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        motherName: this.nepaliData.motherName ? this.nepaliData.motherName : '',
        districtName: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
        municipality: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
        wadNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
        temporaryDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
        tempMunicipality: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
        tempWadNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
        age: this.nepaliData.age ? this.nepaliData.age : '',
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
        citizenShipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        date: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        cdoOffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        sincerlyName: this.nepaliData.name ? this.nepaliData.name : '',
        sincerlyCitizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        sincerlyDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        sincerlyCDOoffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        sincerlyPermanentDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
        sincerlyPermanentMunicipality: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
        sincerlyPermanentWadNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
        sincerlyTemporaryDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
        sincerlyTemporaryVDCname: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
        sincerlyTemporaryWadNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
        sincerlyParentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        sincerlyGrandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
        amount: loanAmount.numberNepali ? loanAmount.numberNepali : '',
        amountInNumber: loanAmount.nepaliWords ? loanAmount.nepaliWords : '',
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
      address:[undefined],
      grandParentName: [undefined],
      fatherName: [undefined],
      motherName: [undefined],
      husbandName: [undefined],
      districtName: [undefined],
      municipality: [undefined],
      wadNo: [undefined],
      temporaryDistrict: [undefined],
      tempMunicipality: [undefined],
      tempWadNo: [undefined],
      age: [undefined],
      customerName: [undefined],
      citizenShipNo: [undefined],
      date: [undefined],
      cdoOffice: [undefined],
      branchName: [undefined],
      amount: [undefined],
      amountInNumber: [undefined],
      sincerlyName: [undefined],
      sabikVDC: [undefined],
      sincerlySign: [undefined],
      sincerlyCitizenshipNo: [undefined],
      sincerlyDate: [undefined],
      sincerlyCDOoffice: [undefined],
      sincerlyPermanentMunicipality: [undefined],
      sincerlyPermanentDistrict: [undefined],
      sincerlyPermanentWadNo: [undefined],
      sabikWadNo: [undefined],
      sincerlyTemporaryDistrict: [undefined],
      sincerlyTemporaryVDCname: [undefined],
      sincerlyTemporaryWadNo: [undefined],
      sincerlyParentName: [undefined],
      sincerlyGrandParentName: [undefined],
      sincerlyHusbandWifeName: [undefined],
      guarantor2WadNo: [undefined],
      IdentifiedGuarantorName: [undefined],
      IdentifiedHintNo: [undefined],
      ItisambatYear: [undefined],
      ItisambatMonth: [undefined],
      ItisambatDay: [undefined],
      ItisambatTime: [undefined],
      ItisambatRojSubham: [undefined],
      guarantorDetails: this.formBuilder.array([]),
      secguarantorDetails: this.formBuilder.array([])

    });
  }

  addGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
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
        guarantorWadNo: [value.guarantorWadNo]
      }));
    });
  }

  secaddGuarantor(): void {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    formArray.push(this.secguarantorFormGroup());
  }

  secremoveGuarantor(index: number): void {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    formArray.removeAt(index);
  }


  secguarantorFormGroup(): FormGroup {
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
        guarantorWadNo: [value.guarantorWadNo]
      }));
    });
  }


  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
}
