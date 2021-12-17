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
          if (initialInfo.witnessDetails) {
            this.setWitnessDetails(initialInfo.witnessDetails);
          }
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

      this.form.patchValue({
        borrowerName: this.nepaliData.name ? this.nepaliData.name : '',
        borrowerPermanentMunicipality: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
        borrowerPermanentWardNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
        borrowerPermanentDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
        borrowerCitizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        borrowerCitizenshipIssueDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        borrowerCdoOffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        borrowerParentsName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        borrowerGrandParentsName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
        borrowerHusbandWifeName : this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
        borrowerTempMunicipality: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
        borrowerTempWardNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
        borrowerTempDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
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

      IdentifiedGuarantorName: [undefined],
      IdentifiedHintNo: [undefined],
      branchName: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDay: [undefined],
      itiSambatTime: [undefined],
      itiSambatRojSubham: [undefined],
      witnessDetails: this.formBuilder.array([]),
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

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
}
