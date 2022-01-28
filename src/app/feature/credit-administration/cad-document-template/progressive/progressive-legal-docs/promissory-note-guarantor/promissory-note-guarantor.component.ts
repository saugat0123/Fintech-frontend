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
  selector: 'app-promissory-note-guarantor',
  templateUrl: './promissory-note-guarantor.component.html',
  styleUrls: ['./promissory-note-guarantor.component.scss']
})
export class PromissoryNoteGuarantorComponent implements OnInit {
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

  constructor(private dialogRef: NbDialogRef<PromissoryNoteGuarantorComponent>,
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
          if (!ObjectUtil.isEmpty(initialInfo.guarantorDetails)) {
            this.setGuarantorDetails(initialInfo.guarantorDetails);
          }
          if (initialInfo.witnessDetails) {
            this.setWitnessDetails(initialInfo.witnessDetails);
          }
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      const loanAmount = JSON.parse(this.cadData.nepData);
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.form.patchValue({
        borrowerName: this.nepaliData.name ? this.nepaliData.name : '',
        borrowerPermanentMunicipality: this.nepaliData.permanentMunicipalities.nepaliName ? this.nepaliData.permanentMunicipalities.nepaliName : '',
        borrowerPermanentWardNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
        borrowerPermanentDistrict: this.nepaliData.permanentDistrict.nepaliName ? this.nepaliData.permanentDistrict.nepaliName : '',
        borrowerCitizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        borrowerCitizenshipIssueDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        borrowerCdoOffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        borrowerParentsName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        borrowerGrandParentsName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
        borrowerHusbandWifeName : this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
        borrowerTempMunicipality: this.nepaliData.temporaryMunicipalities.nepaliName ? this.nepaliData.temporaryMunicipalities.nepaliName : '',
        borrowerTempWardNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
        borrowerTempDistrict: this.nepaliData.temporaryDistrict.nepaliName ? this.nepaliData.temporaryDistrict.nepaliName : '',
        age: this.nepaliData.age ? this.nepaliData.age : '',
        financeBranch : this.nepaliData.branchName ? this.nepaliData.branchName : '',
        amount: loanAmount.numberNepali ? loanAmount.numberNepali : '',
        amountInWords: loanAmount.nepaliWords ? loanAmount.nepaliWords : '',
        gender: this.nepaliData.gender
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
      amount: [undefined],
      amountInWords: [undefined],
      name: [undefined],
      permanentVdcMun: [undefined],
      permanentWardNo: [undefined],
      parentsName: [undefined],
      grandParentsName: [undefined],
      husbandWifeName: [undefined],
      citizenshipNo: [undefined],
      temporaryVdcMun: [undefined],
      temporaryWardNo: [undefined],
      citizenshipIssueDate: [undefined],
      citizenshipIssueOffice: [undefined],
      permanentDistrict: [undefined],
      SabikVdcMun: [undefined],
      sabikWardNo: [undefined],
      temporaryDistrict: [undefined],
      financeDistrict: [undefined],
      financeVdcMun: [undefined],
      financeWardNo: [undefined],
      financeBranch: [undefined],
      sabikVdcMun: [undefined],
      age: [undefined],
      gender :[undefined],
      relationship: [undefined],
      date: [undefined],
      borrowerName: [undefined],
      borrowerPermanentDistrict: [undefined],
      borrowerPermanentMunicipality: [undefined],
      borrowerPermanentWardNo: [undefined],
      borrowerParentsName: [undefined],
      borrowerGrandParentsName: [undefined],
      borrowerHusbandWifeName: [undefined],
      borrowerCitizenshipNo: [undefined],
      borrowerTempDistrict: [undefined],
      borrowerTempMunicipality: [undefined],
      borrowerTempWardNo: [undefined],
      borrowerCitizenshipIssueDate: [undefined],
      borrowerCdoOffice: [undefined],
      borrowerSabikVDC: [undefined],
      borrowerSabikWardNo: [undefined],

      guarantorName: [undefined],
      guarantorCitizenshipNo: [undefined],
      guarantorCitizenshipIssueDate: [undefined],
      guarantorCdoOffice: [undefined],
      guarantorPermanentDistrict: [undefined],
      guarantorPermanentMunicipality: [undefined],
      guarantorPermanentWardNo: [undefined],
      guarantorSabikVDC: [undefined],
      guarantorSabikWardNo: [undefined],
      guarantorTempDistrict: [undefined],
      guarantorTempMunicipality: [undefined],
      guarantorTempWardNo: [undefined],
      guarantorParentsName: [undefined],
      guarantorGrandParentsName: [undefined],
      guarantorHusbandWifeName: [undefined],

      IdentifiedGuarantorName: [undefined],
      IdentifiedHintNo: [undefined],
      branchName: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDay: [undefined],
      itiSambatTime: [undefined],
      itiSambatRojSubham: [undefined],
      witnessDetails: this.formBuilder.array([]),
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

  witnessFormGroup(): FormGroup {
    return this.formBuilder.group({
      witnessName: [undefined],
      witnessCitizenshipNo: [undefined],
      witnessCitizenshipIssueDate: [undefined],
      witnessCDOoffice: [undefined],
      witnessDistrict: [undefined],
      witnessPermanentMunicipality: [undefined],
      witnessPermanentWardNo: [undefined]
    });
  }

  addWitness(): void {
    const formArray = this.form.get('witnessDetails') as FormArray;
    formArray.push(this.witnessFormGroup());
  }

  removeWitness(index: number): void {
    const formArray = this.form.get('witnessDetails') as FormArray;
    formArray.removeAt(index);
  }

  setWitnessDetails(data) {
    const formArray = this.form.get('witnessDetails') as FormArray;
    if (data.length === 0) {
      this.addWitness();
      return;
    }

    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        witnessName: [value.name],
        witnessCitizenshipNo: [value.witnessCitizenshipNo],
        witnessCitizenshipIssueDate: [value.witnessCitizenshipIssueDate],
        witnessDistrict: [value.witnessDistrict],
        witnessCDOoffice: [value.witnessCDOoffice],
        witnessPermanentMunicipality: [value.witnessPermanentMunicipality],
        witnessPermanentWardNo: [value.witnessPermanentWardNo]
      }));
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
        guarantorName: [value.guarantorName],
        guarantorCitizenshipNo: [value.citizenNumber],
        guarantorCitizenshipIssueDate: [value.issuedYear],
        guarantorCdoOffice: [value.issuedPlace],
        guarantorPermanentDistrict: [
          !ObjectUtil.isEmpty(value.guarantorPermanentDistrict) ?
              value.guarantorPermanentDistrict.nepaliName : ''
        ],
        guarantorPermanentMunicipality: [
          !ObjectUtil.isEmpty(value.guarantorPermanentMunicipality) ?
              value.guarantorPermanentMunicipality.nepaliName : ''
        ],
        guarantorPermanentWardNo: [value.guarantorPermanentWard],
        guarantorSabikVDC: [
          !ObjectUtil.isEmpty(value.guarantorPermanentMunicipality) ?
              value.guarantorPermanentMunicipality.nepaliName : ''
        ],
        guarantorSabikWardNo: [value.guarantorPermanentWard],
        guarantorTempDistrict: [
          !ObjectUtil.isEmpty(value.guarantorTemporaryDistrict) ?
              value.guarantorTemporaryDistrict.nepaliName : ''
        ],
        guarantorTempMunicipality: [
          !ObjectUtil.isEmpty(value.guarantorTemporaryMunicipality) ?
              value.guarantorTemporaryMunicipality.nepaliName : ''
        ],
        guarantorTempWardNo: [value.guarantorTemporaryWard],
        guarantorHusbandWifeName: [value.guarantorSpouseName],
        guarantorGrandParentsName: [value.guarantorGrandfatherName],
        guarantorParentsName: [value.guarantorFatherName],
      }));
    });
  }

  addGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

  /*removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }*/


  guarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      guarantorName: [undefined],
      guarantorCitizenshipNo: [undefined],
      guarantorCitizenshipIssueDate: [undefined],
      guarantorCdoOffice: [undefined],
      guarantorPermanentDistrict: [undefined],
      guarantorPermanentMunicipality: [undefined],
      guarantorPermanentWardNo: [undefined],
      guarantorSabikVDC: [undefined],
      guarantorSabikWardNo: [undefined],
      guarantorTempDistrict: [undefined],
      guarantorTempMunicipality: [undefined],
      guarantorTempWardNo: [undefined],
      guarantorHusbandWifeName: [undefined],
      guarantorGrandParentsName: [undefined],
      guarantorParentsName: [undefined],
    });
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
}
