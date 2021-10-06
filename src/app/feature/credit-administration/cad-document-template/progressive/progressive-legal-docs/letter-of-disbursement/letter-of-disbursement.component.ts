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
  selector: 'app-letter-of-disbursement',
  templateUrl: './letter-of-disbursement.component.html',
  styleUrls: ['./letter-of-disbursement.component.scss']
})
export class LetterOfDisbursementComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  form: FormGroup;
  spinner;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepaliData;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<LetterOfDisbursementComponent>) {
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
          this.setWitnessDetails(initialInfo.witnessDetails);
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      const loanAmount = JSON.parse(this.cadData.nepData);
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

      this.form.patchValue({
        clientName: this.nepaliData.name ? this.nepaliData.name : '',
        amount: loanAmount.numberNepali ? loanAmount.numberNepali : '',
        amountInWord: loanAmount.nepaliWords ? loanAmount.nepaliWords : '',
        sincerlyname: this.nepaliData.name ? this.nepaliData.name : '',
        naPraNaName: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        mitiName: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        jiPrakaName: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        sincerlyPermanentAddress: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
        jillaName: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
        jagaName: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
        sincerlytempAddress: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
        jillaName1: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
        jagaName1: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
        parentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        grandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
        husbandWifeName: this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
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
      date: [undefined],
      amount: [undefined],
      amountInWord: [undefined],
      accNumber: [undefined],
      sincerlyname: [undefined],
      sincerlyPermanentAddress: [undefined],
      sincerlytempAddress: [undefined],
      parentName: [undefined],
      grandParentName: [undefined],
      husbandWifeName: [undefined],
      biktiyaPersonName: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDate: [undefined],
      itiSambatTime: [undefined],
      itiSambatRojSumbham: [undefined],
      witnessDetails: this.formBuilder.array([]),
      clientName: [undefined],
      BranchName: [undefined],
      udhyogBibhag: [undefined],
      praliNo: [undefined],
      underDate: [undefined],
      sewaKendra: [undefined],
      certificateNo: [undefined],
      regDate: [undefined],
      registeredName: [undefined],
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
      secguarantorDetails: this.formBuilder.array([]),
      shakhaName: [undefined],
      naPraNaName: [undefined],
      mitiName: [undefined],
      jiPrakaName: [undefined],
      jillaName: [undefined],
      jagaName: [undefined],
      jillaName1: [undefined],
      jagaName1: [undefined],
      SakNaPraNaName1: [undefined],
      SakMitiName1: [undefined],
      SakJiPrakaName1: [undefined],
      SakIssuedPlace1: [undefined],
      SakJillaName1: [undefined],
      SakJagaName1: [undefined],
      SakNaPraNaName2: [undefined],
      SakMitiName2: [undefined],
      SakJiPrakaName2: [undefined],
      SakIssuedPlace2: [undefined],
      SakJillaName2: [undefined],
      SakJagaName2: [undefined],
      grandParentsName: [undefined],
      ItisambatYear: [undefined],
      ItisambatMonth: [undefined],
      ItisambatDay: [undefined],
      ItisambatTime: [undefined],
      ItisambatRojSubham: [undefined],
      kaSanNumber: [undefined],
      KarmachariSanNu: [undefined],
    });
  }

  witnessFormgroup(): FormGroup {
    return this.formBuilder.group({
      witnessName: [undefined],
      witnessCitizenshipNo: [undefined],
      witnessCitizenshipIssueDate: [undefined],
      witnessCitizenshipIssueOffice: [undefined],
      witnessDistrict: [undefined],
      witnessVdcMun: [undefined],
      witnessWardNo: [undefined],
    });
  }

  addWitness(): void {
    const formArray = this.form.get('witnessDetails') as FormArray;
    formArray.push(this.witnessFormgroup());
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
      formArray.push(
          this.formBuilder.group({
            witnessName: [value.name],
            witnessCitizenshipNo: [value.witnessCitizenshipNo],
            witnessCitizenshipIssueDate: [value.witnessCitizenshipIssueDate],
            witnessCitizenshipIssueOffice: [value.witnessCitizenshipIssueOffice],
            witnessDistrict: [value.witnessDistrict],
            witnessVdcMun: [value.witnessVdcMun],
            witnessWardNo: [value.witnessWardNo],
          })
      );
    });

  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

}
