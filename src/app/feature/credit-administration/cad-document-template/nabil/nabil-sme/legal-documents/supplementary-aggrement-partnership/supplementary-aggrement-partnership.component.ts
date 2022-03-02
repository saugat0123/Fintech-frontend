import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../../@core/utils';
import {CadOfferLetterModalComponent} from '../../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {NbDialogRef} from '@nebular/theme';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {CadFile} from '../../../../../model/CadFile';
import {Document} from '../../../../../../admin/modal/document';
import {OfferDocument} from '../../../../../model/OfferDocument';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-supplementary-aggrement-partnership',
  templateUrl: './supplementary-aggrement-partnership.component.html',
  styleUrls: ['./supplementary-aggrement-partnership.component.scss']
})
export class SupplementaryAggrementPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  form: FormGroup;
  individualData;
  finalAmount;
  loanAmountWord;
  supportedInfo;
  initialInfo;
  sanctionDate;
  freeTextVal: Array<any> = new Array<any>();
  constructor(private  formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              public engToNepaliDate: EngNepDatePipe,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    this.setTotalAmount();
    this.setFreeInfo();
    this.fillForm();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      addressOfBank: [undefined],
      nameOfBorrower: [undefined],
      dateOfHyothenciation: [undefined],
      sanctionLetter: [undefined],
      loanAmountInFig: [undefined],
      loanAmountInWord: [undefined],
      dateOfTrust: [undefined],
      letterOfCredit: [undefined],
      letterOfCreditIssueDate: [undefined],
      securityFreeText: this.formBuilder.array([]),
      // Witness Fields
      witnessDistrict1: [undefined],
      witnessMuni1: [undefined],
      witnessWard1: [undefined],
      witnessAge1: [undefined],
      witnessName1: [undefined],
      witnessDistrict2: [undefined],
      witnessMuni2: [undefined],
      witnessWard2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
      karmachariName: [undefined],
      year: [undefined],
      month: [undefined],
      date: [undefined],
      days: [undefined],
      suvam: [undefined],
    });
    this.addTextArea();
  }
  setFreeText() {
    for (let i = 0; i < this.form.get('securityFreeText')['length']; i++) {
      const free = {
        freeTexts: this.form.get(['securityFreeText', i, 'freeTexts']) ? this.form.get(['securityFreeText', i, 'freeTexts']).value : '',
      };
      this.freeTextVal.push(free);
    }
    const tempFree = {
      // for witness
      freeTextVal : this.freeTextVal,
      witnessDistrict1: this.form.get('witnessDistrict1') ? this.form.get('witnessDistrict1').value : '',
      witnessMuni1: this.form.get('witnessMuni1') ? this.form.get('witnessMuni1').value : '',
      witnessWard1: this.form.get('witnessWard1') ? this.form.get('witnessWard1').value : '',
      witnessAge1: this.form.get('witnessAge1') ? this.form.get('witnessAge1').value : '',
      witnessName1: this.form.get('witnessName1') ? this.form.get('witnessName1').value : '',
      witnessDistrict2: this.form.get('witnessDistrict2') ? this.form.get('witnessDistrict2').value : '',
      witnessMuni2: this.form.get('witnessMuni2') ? this.form.get('witnessMuni2').value : '',
      witnessWard2: this.form.get('witnessWard2') ? this.form.get('witnessWard2').value : '',
      witnessAge2: this.form.get('witnessAge2') ? this.form.get('witnessAge2').value : '',
      witnessName2: this.form.get('witnessName2') ? this.form.get('witnessName2').value : '',
      karmachariName: this.form.get('karmachariName') ? this.form.get('karmachariName').value : '',
      year: this.form.get('year') ? this.form.get('year').value : '',
      month: this.form.get('month') ? this.form.get('month').value : '',
      date: this.form.get('date') ? this.form.get('date').value : '',
      days: this.form.get('days') ? this.form.get('days').value : '',
      suvam: this.form.get('suvam') ? this.form.get('suvam').value : '',
      dateOfHyothenciation: this.form.get('dateOfHyothenciation') ? this.form.get('dateOfHyothenciation').value : '',
      letterOfCreditIssueDate: this.form.get('letterOfCreditIssueDate') ? this.form.get('letterOfCreditIssueDate').value : '',
      letterOfCredit: this.form.get('letterOfCredit') ? this.form.get('letterOfCredit').value : '',
      dateOfTrust: this.form.get('dateOfTrust') ? this.form.get('dateOfTrust').value : '',
    };
    return JSON.stringify(tempFree);
  }
  setTotalAmount() {
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
        this.finalAmount = (this.initialInfo.smeGlobalForm && this.initialInfo.smeGlobalForm.totalLimitInFigureCT) ?
            this.initialInfo.smeGlobalForm.totalLimitInFigureCT : '';
        this.loanAmountWord = (this.initialInfo.smeGlobalForm && this.initialInfo.smeGlobalForm.totalLimitInWordsCT ) ?
            this.initialInfo.smeGlobalForm.totalLimitInWordsCT : '';
      } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
        this.finalAmount = (this.initialInfo && this.initialInfo.loanLimitAmountFigure) ?
            this.initialInfo.loanLimitAmountFigure.ct : '';
        this.loanAmountWord = (this.initialInfo && this.initialInfo.loanLimitAmountFigureWords) ?
            this.initialInfo.loanLimitAmountFigureWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        this.finalAmount = (this.initialInfo && this.initialInfo.totalLimitInFigure) ?
            this.initialInfo.totalLimitInFigure.ct : '';
        this.loanAmountWord = (this.initialInfo && this.initialInfo.totalLimitInWords) ?
            this.initialInfo.totalLimitInWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
        this.finalAmount = (this.initialInfo && this.initialInfo.totalLimitFigure) ?
            this.initialInfo.totalLimitFigure.ct : '';
        this.loanAmountWord = (this.initialInfo && this.initialInfo.totalLimitWords) ?
            this.initialInfo.totalLimitWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
        const proposedLimit = this.cadData.assignedLoan[0] ?
            this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
        this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
        this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(proposedLimit ? proposedLimit : '');
      } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        this.finalAmount = (this.initialInfo && this.initialInfo.loanAmountFigure) ?
            this.initialInfo.loanAmountFigure.ct : '';
        this.loanAmountWord = (this.initialInfo && this.initialInfo.loanAmountFigureWords) ?
            this.initialInfo.loanAmountFigureWords.ct : '';
      }
    }
  }

  fillForm() {
    // for sanction letter date
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy' ||
          this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        const dateOfApproval = this.initialInfo.sanctionLetterDateType ? this.initialInfo.sanctionLetterDateType.en : '';
        if (dateOfApproval === 'AD') {
          this.sanctionDate = this.initialInfo.sanctionLetterDate ? this.initialInfo.sanctionLetterDate.ct : '';
        } else {
          this.sanctionDate = this.initialInfo.sanctionLetterDateNepali ? this.initialInfo.sanctionLetterDateNepali.ct : '';
        }
      }
      if (this.cadData.offerDocumentList[0].docName !== 'DDSL Without Subsidy' &&
          this.cadData.offerDocumentList[0].docName !== 'Combined Offer Letter' &&
          this.cadData.offerDocumentList[0].docName !== 'Class A Sanction letter') {
        const dateOfApproval = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
        if (dateOfApproval === 'AD') {
          this.sanctionDate = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.ct : '';
        } else {
          this.sanctionDate = this.initialInfo.dateOfApprovalNepali ? this.initialInfo.dateOfApprovalNepali.ct : '';
        }
      }
      if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.initialInfo.smeGlobalForm.dateOfApprovalType) && this.initialInfo.smeGlobalForm.dateOfApprovalType === 'AD') {
          this.sanctionDate = this.initialInfo.smeGlobalForm.dateOfApprovalCT ? this.initialInfo.smeGlobalForm.dateOfApprovalCT : '';
        } else {
          this.sanctionDate = this.initialInfo.smeGlobalForm.dateOfApprovalNepali ?
              this.initialInfo.smeGlobalForm.dateOfApprovalNepali.nDate : '';
        }
      }
    }
    this.form.patchValue({
      addressOfBank: this.individualData.branch ? this.individualData.branch.ct : '',
      nameOfBorrower: this.individualData.name ? this.individualData.name.ct : '',
      // dateOfHyothenciation: this.individualData.name ? this.individualData.name.ct : '',
      loanAmountInFig: this.finalAmount ? this.finalAmount : '',
      loanAmountInWord: this.loanAmountWord ? this.loanAmountWord : '',
      sanctionLetter: this.sanctionDate ? this.sanctionDate : '',
      // for witness
      witnessDistrict1: this.supportedInfo ? this.supportedInfo.witnessDistrict1 : '',
      witnessMuni1: this.supportedInfo ? this.supportedInfo.witnessMuni1 : '',
      witnessWard1: this.supportedInfo ? this.supportedInfo.witnessWard1 : '',
      witnessAge1: this.supportedInfo ? this.supportedInfo.witnessAge1 : '',
      witnessName1: this.supportedInfo ? this.supportedInfo.witnessName1 : '',
      witnessDistrict2: this.supportedInfo ? this.supportedInfo.witnessDistrict2 : '',
      witnessMuni2: this.supportedInfo ? this.supportedInfo.witnessMuni2 : '',
      witnessWard2: this.supportedInfo ? this.supportedInfo.witnessWard2 : '',
      witnessAge2: this.supportedInfo ? this.supportedInfo.witnessAge2 : '',
      witnessName2: this.supportedInfo ? this.supportedInfo.witnessName2 : '',
      karmachariName: this.supportedInfo ? this.supportedInfo.karmachariName : '',
      year: this.supportedInfo ? this.supportedInfo.year : '',
      month: this.supportedInfo ? this.supportedInfo.month : '',
      date: this.supportedInfo ? this.supportedInfo.date : '',
      days: this.supportedInfo ? this.supportedInfo.days : '',
      suvam: this.supportedInfo ? this.supportedInfo.suvam : '',
      dateOfHyothenciation: this.supportedInfo ? this.supportedInfo.dateOfHyothenciation : '',
      letterOfCreditIssueDate: this.supportedInfo ? this.supportedInfo.letterOfCreditIssueDate : '',
      letterOfCredit: this.supportedInfo ? this.supportedInfo.letterOfCredit : '',
      dateOfTrust: this.supportedInfo ? this.supportedInfo.dateOfTrust : '',
    });
    if (!ObjectUtil.isEmpty(this.supportedInfo)) {
      for (let val = 0; val < this.supportedInfo.freeTextVal.length - 1; val++) {
        this.addTextArea();
      }
      for (let i = 0; i < this.supportedInfo.freeTextVal.length; i++) {
        this.form.get(['securityFreeText', i, 'freeTexts']).patchValue(this.supportedInfo.freeTextVal[i].freeTexts);
      }
    }
  }
  setFreeInfo() {
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
        }
      });
    }
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          individualCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        document.id = this.documentId;
        cadFile.supportedInformation = this.setFreeText();
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
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
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }
  addTextArea() {
    (this.form.get('securityFreeText') as FormArray).push(
        this.formBuilder.group({
          freeTexts: [undefined]
        })
    );
  }
  removeAtIndex(i: number) {
    (this.form.get('securityFreeText') as FormArray).removeAt(i);
  }
}
