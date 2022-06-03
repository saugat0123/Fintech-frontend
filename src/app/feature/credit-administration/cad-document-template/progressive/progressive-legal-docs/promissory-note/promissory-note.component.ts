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
import {NepDataPersonal} from '../../../../model/nepDataPersonal';

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
  nepDataPersonal = new NepDataPersonal();
  constructor(private dialogRef: NbDialogRef<PromissoryNoteComponent>,
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
         /* if (!ObjectUtil.isEmpty(initialInfo.secguarantorDetails)) {
            this.setsecGuarantorDetails(initialInfo.secguarantorDetails);
          }
          if (!ObjectUtil.isEmpty(initialInfo.guarantorDetails)) {
            this.setGuarantorDetails(initialInfo.guarantorDetails);
          }*/
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      const loanAmount = JSON.parse(this.cadData.nepData);
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.nepDataPersonal = JSON.parse(this.cadData.nepDataPersonal);
      this.form.patchValue({
        grandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
        fatherName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        motherName: this.nepaliData.motherName ? this.nepaliData.motherName : '',
        husbandName: this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
        districtName: !ObjectUtil.isEmpty(this.nepaliData.permanentDistrict) ? this.nepaliData.permanentDistrict.nepaliName : '',
        municipality: !ObjectUtil.isEmpty(this.nepaliData.permanentMunicipalities) ? this.nepaliData.permanentMunicipalities.nepaliName : '',
        wardNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
        temporaryDistrict: !ObjectUtil.isEmpty(this.nepaliData.temporaryDistrict) ? this.nepaliData.temporaryDistrict.nepaliName : '',
        tempMunicipality: !ObjectUtil.isEmpty(this.nepaliData.temporaryMunicipalities) ? this.nepaliData.temporaryMunicipalities.nepaliName : '',
        tempWardNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
        age: this.nepaliData.age ? this.nepaliData.age : '',
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
        citizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        date: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        cdoOffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        amount: loanAmount.numberNepali ? loanAmount.numberNepali : '',
        amountInNumber: loanAmount.nepaliWords ? loanAmount.nepaliWords : '',
        branchName : this.nepaliData.branchName ? this.nepaliData.branchName : '',
        gender: this.nepaliData.gender ? this.nepaliData.gender : '',
        permanentVdc: this.nepaliData.permanentVdc ? this.nepaliData.permanentVdc : '',
        permanentVdcWard: this.nepaliData.permanentVdcWard ? this.nepaliData.permanentVdcWard : ''
      });
    }

  }

  // patchAddressObject(): void {
  //   if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
  //     const data = JSON.parse(this.cadData.loanHolder.nepData);
  //     this.form.patchValue(data);
  //     this.form.get('permanentProvince').patchValue(data.permanentProvince);
  //     this.form(data.permanentProvince);
  //     this.form.get('permanentDistrict').patchValue(data.permanentDistrict);
  //     this.form(data.permanentDistrict);
  //     this.form.get('permanentMunicipalities').patchValue(data.permanentMunicipalities);
  //     this.form.get('temporaryProvince').patchValue(data.temporaryProvince);
  //     this.form(data.temporaryProvince);
  //     this.form.get('temporaryDistrict').patchValue(data.temporaryDistrict);
  //     this.form(data.temporaryDistrict);
  //     this.form.get('temporaryMunicipalities').patchValue(data.temporaryMunicipalities);
  //   }
  // }
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
      address: [undefined],
      grandParentName: [undefined],
      fatherName: [undefined],
      motherName: [undefined],
      husbandName: [undefined],
      districtName: [undefined],
      municipality: [undefined],
      wardNo: [undefined],
      temporaryDistrict: [undefined],
      tempMunicipality: [undefined],
      tempWardNo: [undefined],
      age: [undefined],
      gender: [undefined],
      customerName: [undefined],
      citizenshipNo: [undefined],
      date: [undefined],
      cdoOffice: [undefined],
      branchName: [undefined],
      amount: [undefined],
      amountInNumber: [undefined],
      sabikVDC: [undefined],
      sabikWardNo: [undefined],
      guarantor2WardNo: [undefined],
      IdentifiedGuarantorName: [undefined],
      IdentifiedHintNo: [undefined],
      ItisambatYear: [undefined],
      ItisambatMonth: [undefined],
      ItisambatDay: [undefined],
      ItisambatTime: [undefined],
      ItisambatRojSubham: [undefined],
      guarantorDetails: this.formBuilder.array([]),
      secguarantorDetails: this.formBuilder.array([]),
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
      permanentVdc: [undefined],
      permanentVdcWard: [undefined]
    });
  }

 /* addGuarantor(): void {
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
  }*/

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
}
