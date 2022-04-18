import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../../../model/nepaliNumberAndWords';
import {NabilDocumentChecklist} from '../../../../../../admin/modal/nabil-document-checklist.enum';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {NepaliToEngNumberPipe} from '../../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../../model/CadFile';
import {Document} from '../../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-assignment-of-receivable-proprietorship',
  templateUrl: './assignment-of-receivable-proprietorship.component.html',
  styleUrls: ['./assignment-of-receivable-proprietorship.component.scss']
})
export class AssignmentOfReceivableProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  form: FormGroup;
  nepData;
  companyInfo;
  initialInfo;
  supportedInfo;
  purposeOfLoan = 'व्यापार/ व्यवसाय संचालन';
  registrationDate;
  actYear;
  totalAmount;
  totalAmountInWord;
  finalAmount;
  loanAmountWord;
  sanctionDate;
  issueDate = [];

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              public datePipe: DatePipe,
              public engToNepaliDate: EngNepDatePipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe, ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0])) {
      this.companyInfo = this.cadData.assignedLoan[0] ? JSON.parse(this.cadData.assignedLoan[0].companyInfo.companyJsonData) : '';
    }
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
        }
      });
    }
    this.setTotalAmount();
    this.dateConvert();
    this.fillForm();
  }
  setTotalAmount() {
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
        this.totalAmount = (this.initialInfo.smeGlobalForm && this.initialInfo.smeGlobalForm.totalLimitInFigureCT) ?
            this.initialInfo.smeGlobalForm.totalLimitInFigureCT : '';
        this.totalAmountInWord = (this.initialInfo.smeGlobalForm && this.initialInfo.smeGlobalForm.totalLimitInWordsCT ) ?
            this.initialInfo.smeGlobalForm.totalLimitInWordsCT : '';
      } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
        this.totalAmount = (this.initialInfo && this.initialInfo.loanLimitAmountFigure) ?
            this.initialInfo.loanLimitAmountFigure.ct : '';
        this.totalAmountInWord = (this.initialInfo && this.initialInfo.loanLimitAmountFigureWords) ?
            this.initialInfo.loanLimitAmountFigureWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        this.totalAmount = (this.initialInfo && this.initialInfo.totalLimitInFigure) ?
            this.initialInfo.totalLimitInFigure.ct : '';
        this.totalAmountInWord = (this.initialInfo && this.initialInfo.totalLimitInWords) ?
            this.initialInfo.totalLimitInWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
        this.totalAmount = (this.initialInfo && this.initialInfo.totalLimitFigure) ?
            this.initialInfo.totalLimitFigure.ct : '';
        this.totalAmountInWord = (this.initialInfo && this.initialInfo.totalLimitWords) ?
            this.initialInfo.totalLimitWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
        const proposedLimit = this.cadData.assignedLoan[0] ?
            this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
        this.totalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
        this.totalAmountInWord = this.nepaliCurrencyWordPipe.transform(proposedLimit ? proposedLimit : '');
      } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        this.totalAmount = (this.initialInfo && this.initialInfo.loanAmountFigure) ?
            this.initialInfo.loanAmountFigure.ct : '';
        this.totalAmountInWord = (this.initialInfo && this.initialInfo.loanAmountFigureWords) ?
            this.initialInfo.loanAmountFigureWords.ct : '';
      }
    }
  }
  // AD date captured in nepali font
  dateConvert() {
    let date;
    let date2;
    this.companyInfo.forEach(val => {
      if (val.ownerNationality === 'Nepali') {
      if (val.radioOwnerCitizenshipIssuedDate === 'AD') {
        date = this.engToNepaliDate.transform(val ?
            val.ownerCitizenshipIssuedDateCT : val.ownerCitizenshipIssuedDateCT, true) || '';
      } else {
        date = val ? val.ownerCitizenshipIssuedDateNepaliCT.nDate : '';
      }
      const newDate = {
        issueDate : date
      };
      this.issueDate.push(newDate);
    }
      let indianOwnerPPIssuedDate;
      let indianOwnerPassportValidityDate;
      if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Passport') {
        indianOwnerPPIssuedDate = this.datePipe.transform(val.indianOwnerPassportIssuedDate ? val.indianOwnerPassportIssuedDate : '');
        date = this.transformEnglishDate(indianOwnerPPIssuedDate ? indianOwnerPPIssuedDate : '');
        // tslint:disable-next-line:max-line-length
        indianOwnerPassportValidityDate = this.datePipe.transform(val.indianOwnerPassportValidityDateCT ? val.indianOwnerPassportValidityDateCT : '');
        date2 = this.transformEnglishDate(indianOwnerPassportValidityDate ? indianOwnerPassportValidityDate : '');
        const newDate = {
          issueDate : date,
          validDate : date2
        };
        this.issueDate.push(newDate);
      }
      let indianOwnerAdharCardIssuedDate;
      if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Adhar Card') {
        indianOwnerAdharCardIssuedDate = this.datePipe.transform(val.indianOwnerAdharCardIssuedDate ? val.indianOwnerAdharCardIssuedDate : '');
        date = this.transformEnglishDate(indianOwnerAdharCardIssuedDate ? indianOwnerAdharCardIssuedDate : '');
        const newDate = {
          issueDate : date,
        };
        this.issueDate.push(newDate);
      }
      let indianEmbassyIssuedDate;
      if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Embassy Certificate') {
        indianEmbassyIssuedDate = this.datePipe.transform(val.indianEmbassyIssuedDate ? val.indianEmbassyIssuedDate : '');
        date = this.transformEnglishDate(indianEmbassyIssuedDate ? indianEmbassyIssuedDate : '');
        const newDate = {
          issueDate : date,
        };
        this.issueDate.push(newDate);
      }
      let ppIssueDate;
      let valDate;
      if (val.ownerNationality === 'Other') {
        if (val.otherOwnerPassportIssuedDateOption === 'AD') {
          ppIssueDate = this.datePipe.transform(val.otherOwnerPassportIssuedDateCT ? val.otherOwnerPassportIssuedDateCT : '');
          date = this.transformEnglishDate(ppIssueDate ? ppIssueDate : '');
        }  else {
          date = val.otherOwnerPassportIssuedDateNepaliCT.nDate;
        }
        if (val.otherOwnerPassportValidityDateOption === 'AD') {
          valDate = this.datePipe.transform(val.otherOwnerPassportValidityDateCT ? val.otherOwnerPassportValidityDateCT : '');
          date2 = this.transformEnglishDate(valDate ? valDate : '');
        } else {
          date2 = val.otherOwnerPassportValidityDateNepaliCT.nDate;
        }
        const newDate = {
          issueDate : date,
          validDate : date2
        };
        this.issueDate.push(newDate);
      }
    });
  }
  transformEnglishDate(date) {
    let transformedDate;
    let monthName;
    const dateArray1 = [];
    const splittedDate = date.split(' ');
    if (splittedDate[0] === 'Jan') {
      monthName = 'जनवरी';
    } else if (splittedDate[0] === 'Feb') {
      monthName = 'फेब्रुअरी';
    } else if (splittedDate[0] === 'Mar') {
      monthName = 'मार्च';
    } else if (splittedDate[0] === 'Apr') {
      monthName = 'अप्रिल';
    } else if (splittedDate[0] === 'May') {
      monthName = 'मे';
    } else if (splittedDate[0] === 'Jun') {
      monthName = 'जुन';
    } else if (splittedDate[0] === 'Jul') {
      monthName = 'जुलाई';
    } else if (splittedDate[0] === 'Aug') {
      monthName = 'अगष्ट';
    } else if (splittedDate[0] === 'Sep') {
      monthName = 'सेप्टेम्बर';
    } else if (splittedDate[0] === 'Oct') {
      monthName = 'अक्टुबर';
    } else if (splittedDate[0] === 'Nov') {
      monthName = 'नोभेम्बर';
    } else {
      monthName = 'डिसेम्बर';
    }
    dateArray1.push(this.engToNepNumberPipe.transform(splittedDate[1].slice(0, -1)));
    dateArray1.push(monthName + ',');
    dateArray1.push(this.engToNepNumberPipe.transform(splittedDate[2]));
    transformedDate = dateArray1.join(' ');
    return transformedDate;
  }
  buildForm() {
    this.form = this.formBuilder.group({
      nameOfBranchLocated: [undefined],
      actName: [undefined],
      yearInFigure: [undefined],
      nameOfAuthorizedBody: [undefined],
      nameOfDepartment: [undefined],
      dateOfRegistration: [undefined],
      registrationNo: [undefined],
      // Firm Details
      districtOfFirm: [undefined],
      municipalityOfFirm: [undefined],
      wardNoOfFirm: [undefined],
      addressOfFirm: [undefined],
      firmName: [undefined],
      purposeOfLoan: [undefined],
      sanctionLetterIssuedDate: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
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
    });
  }
  setFreeText() {
    const free1 = {
      purposeOfLoan: this.form.get('purposeOfLoan').value ? this.form.get('purposeOfLoan').value : '',
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
    };
    return JSON.stringify(free1);
  }
  patchFreeText() {
    if (!ObjectUtil.isEmpty(this.cadData) && this.cadData.cadFileList.length > 0) {
      if (!ObjectUtil.isEmpty(this.supportedInfo) && this.purposeOfLoan === this.supportedInfo.purposeOfLoan) {
        this.purposeOfLoan = 'व्यापार/ व्यवसाय संचालन';
      }
      if (!ObjectUtil.isEmpty(this.supportedInfo) && this.supportedInfo.purposeOfLoan !== this.purposeOfLoan) {
        this.purposeOfLoan = this.supportedInfo.purposeOfLoan;
      }
    }
    this.form.patchValue({
      purposeOfLoan: !ObjectUtil.isEmpty(this.purposeOfLoan) ? this.purposeOfLoan : '',
    });
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          individualCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
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
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }

  fillForm() {
    let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
    // for date conversion of registration date
    if (!ObjectUtil.isEmpty(this.individualData.registrationDateOption)) {
      if (this.individualData.registrationDateOption.en === 'AD') {
        this.registrationDate = this.engToNepaliDate.transform(this.individualData.registrationDate ?
            this.individualData.registrationDate.en : this.individualData.registrationDate.en, true) || '';
      } else {
        this.registrationDate = this.individualData.registrationDateNepali.en ? this.individualData.registrationDateNepali.en.nDate : '';
      }
    }
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
    if (!ObjectUtil.isEmpty(this.individualData.radioActYearDate)) {
      if (this.individualData.radioActYearDate.en === 'AD') {
        this.actYear = this.individualData.actYear ?
            this.individualData.actYear.en : this.individualData.actYear.en || '' ;
      } else {
        this.actYear = this.individualData.actYear ? this.individualData.actYear.en : '';
      }
    }
    /*this.checkOfferLetterData();*/
    this.form.patchValue({
      nameOfBranchLocated: this.individualData.branch ? this.individualData.branch.ct : '',
      actName: this.individualData.actName ? this.individualData.actName.ct : '',
      yearInFigure: this.actYear ? this.actYear : '',
      nameOfAuthorizedBody: this.individualData.authorizedBodyName ? this.individualData.authorizedBodyName.ct : '',
      nameOfDepartment: this.individualData.registeredWith ? this.individualData.registeredWith.ct : '',
      dateOfRegistration: this.registrationDate ? this.registrationDate : '',
      registrationNo: this.individualData.registrationNo ? this.individualData.registrationNo.ct : '',
      districtOfFirm: this.individualData.registeredDistrict ? this.individualData.registeredDistrict.ct : '',
      municipalityOfFirm: this.individualData.registeredMunicipality ? this.individualData.registeredMunicipality.ct : '',
      wardNoOfFirm: this.individualData.permanentWard ? this.individualData.permanentWard.ct : '',
      addressOfFirm: this.individualData.registeredStreetTole ? this.individualData.registeredStreetTole.ct : '',
      firmName: this.individualData.name ? this.individualData.name.ct : '',
      loanAmountInFigure: this.totalAmount,
      loanAmountInWords: this.totalAmountInWord,
      sanctionLetterIssuedDate: this.sanctionDate ? this.sanctionDate : '',
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
    });
    this.patchFreeText();
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

}
