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
import {ProposalCalculationUtils} from '../../../../../loan/component/loan-summary/ProposalCalculationUtils';
import {LoanDataKey} from '../../../../../../@core/utils/constants/loan-data-key';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';

@Component({
  selector: 'app-letter-of-confession',
  templateUrl: './letter-of-confession.component.html',
  styleUrls: ['./letter-of-confession.component.scss']
})
export class LetterOfConfessionComponent implements OnInit {
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
  loanAmountTemplate = new NepaliNumberAndWords();

  constructor(private dialogRef: NbDialogRef<LetterOfConfessionComponent>,
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
    if (ObjectUtil.isEmpty(this.cadData.nepData)) {
      const number = ProposalCalculationUtils.calculateTotalFromProposalList(LoanDataKey.PROPOSE_LIMIT, this.cadData.assignedLoan);
      this.loanAmountTemplate.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
      this.loanAmountTemplate.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
      this.loanAmountTemplate.engNumber = number;
    } else {
      this.loanAmountTemplate = JSON.parse(this.cadData.nepData);
    }
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

    this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.form.patchValue({
        name: this.nepaliData.name ? this.nepaliData.name : '',
        permanentVdcMun: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
        permanentWardNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
        permanentDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
        citizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        citizenshipIssueDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        citizenshipIssueOffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        parentsName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        grandParentsName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
        husbandWifeName : this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
        temporaryVdcMun: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
        temporaryWardNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
        temporaryDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
      });
    }
    this.form.get('amount').patchValue(this.loanAmountTemplate.numberNepali);
    this.form.get('amountInWord').patchValue(this.loanAmountTemplate.nepaliWords);
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
      amountInWord: [undefined],
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
      IdentifiedGuarantorName: [undefined],
      IdentifiedHintNo: [undefined],
      ItisambatYear: [undefined],
      ItisambatMonth: [undefined],
      ItisambatDay: [undefined],
      ItisambatTime: [undefined],
      ItisambatRojSubham: [undefined],
      branchName: [undefined],
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
      guarantorName: [undefined],
      guarantorCitizenshipNo: [undefined],
      guarantorCitizenshipIssueDate: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorPermanentMunicipality: [undefined],
      guarantorPermanentWardNo: [undefined],
      issuedPlace: [undefined]

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

  setGuarantors(data) {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (data.length === 0) {
      this.addGuarantor();
      return;
    }

    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        guarantorName: [undefined],
        guarantorCitizenshipNo: [undefined],
        guarantorCitizenshipIssueDate: [undefined],
        guarantorCDOoffice: [undefined],
        guarantorPermanentMunicipality: [undefined],
        guarantorPermanentWardNo: [undefined],
        issuedPlace: [undefined]
      }));
    });


  }


  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }


}
