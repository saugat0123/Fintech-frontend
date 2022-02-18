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
    this.dateConvert();
    this.fillForm();
  }

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
      if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Passport') {
        date = this.engToNepaliDate.transform(val ?
            val.indianOwnerPassportIssuedDateCT : val.indianOwnerPassportIssuedDateCT, true) || '';
        date2 = this.engToNepaliDate.transform(val ?
            val.indianOwnerPassportValidityDateCT : val.indianOwnerPassportValidityDateCT, true) || '';
        // if (val.indianOwnerPassportIssuedDateOption === 'AD') {
        //   date = this.engToNepaliDate.transform(val ?
        //       val.indianOwnerPassportIssuedDateCT : val.indianOwnerPassportIssuedDateCT, true) || '';
        // }
        // if (val.indianOwnerPassportValidityDateOption === 'AD') {
        //   date2 = this.engToNepaliDate.transform(val ?
        //       val.indianOwnerPassportValidityDateCT : val.indianOwnerPassportValidityDateCT, true) || '';
        // }
        // if (val.indianOwnerPassportIssuedDateOption === 'BS') {
        //   date = val ? val.indianOwnerPassportIssuedDateCT.nDate : '';
        // }
        // if (val.indianOwnerPassportValidityDateOption === 'BS') {
        //   date2 = val ? val.indianOwnerPassportValidityDateCT.nDate : '';
        // }
        const newDate = {
          issueDate : date,
          validDate : date2
        };
        this.issueDate.push(newDate);
      }
      if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Adhar Card') {
        date = this.engToNepaliDate.transform(val ?
            val.indianOwnerAdharCardIssuedDateCT : val.indianOwnerAdharCardIssuedDateCT, true) || '';
        // if (val.indianOwnerAdharCardIssuedDateOption === 'AD') {
        //   date = this.engToNepaliDate.transform(val ?
        //       val.indianOwnerAdharCardIssuedDateCT : val.indianOwnerAdharCardIssuedDateCT, true) || '';
        // } else {
        //   date = val ? val.indianOwnerAdharCardIssuedDateCT.nDate : '';
        // }
        const newDate = {
          issueDate : date,
        };
        this.issueDate.push(newDate);
      }
      if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Embassy Certificate') {
        date = this.engToNepaliDate.transform(val ?
            val.indianEmbassyIssuedDateCT : val.indianEmbassyIssuedDateCT, true) || '';
        // if (val.indianEmbassyIssuedDateOption === 'AD') {
        //   date = this.engToNepaliDate.transform(val ?
        //       val.indianEmbassyIssuedDateCT : val.indianEmbassyIssuedDateCT, true) || '';
        // } else {
        //   date = val ? val.indianEmbassyIssuedDateCT.nDate : '';
        // }
        const newDate = {
          issueDate : date,
        };
        this.issueDate.push(newDate);
      }
      if (val.ownerNationality === 'Other') {
        if (val.otherOwnerPassportIssuedDateOption === 'AD') {
          date = this.engToNepaliDate.transform(val ?
              val.otherOwnerPassportIssuedDateCT : val.otherOwnerPassportIssuedDateCT, true) || '';
        }
        if (val.otherOwnerPassportValidityDateOption === 'AD') {
          date2 = this.engToNepaliDate.transform(val ?
              val.otherOwnerPassportValidityDateCT : val.otherOwnerPassportValidityDateCT, true) || '';
        }
        if (val.otherOwnerPassportIssuedDateOption === 'BS') {
          date = val ? val.otherOwnerPassportIssuedDateNepali.nDate : '';
        }
        if (val.otherOwnerPassportValidityDateOption === 'BS') {
          date2 = val ? val.otherOwnerPassportValidityDateNepali.nDate : '';
        }
        const newDate = {
          issueDate : date,
          validDate : date2
        };
        this.issueDate.push(newDate);
      }
    });
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
        const dateOfApproval = this.initialInfo.smeGlobalForm.dateOfApprovalType ?
            this.initialInfo.smeGlobalForm.dateOfApprovalType : '';
        if (dateOfApproval === 'AD') {
          this.sanctionDate = this.engToNepaliDate.transform(this.initialInfo.smeGlobalForm.dateOfApproval ?
              this.initialInfo.smeGlobalForm.dateOfApprovalCT : '', true);
        } else {
          this.sanctionDate = this.initialInfo.smeGlobalForm.dateOfApprovalNepali ?
              this.initialInfo.smeGlobalForm.dateOfApprovalNepali.nDate : '';
        }
      }
    }
    if (!ObjectUtil.isEmpty(this.individualData.radioActYearDate)) {
      if (this.individualData.radioActYearDate.en === 'AD') {
        this.actYear = this.engToNepNumberPipe.transform(this.individualData.actYear ?
            this.individualData.actYear.en : this.individualData.actYear.en, true) || '' ;
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
      loanAmountInFigure: this.finalAmount ? this.finalAmount : '',
      loanAmountInWords: this.loanAmountWord ? this.loanAmountWord : '',
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
