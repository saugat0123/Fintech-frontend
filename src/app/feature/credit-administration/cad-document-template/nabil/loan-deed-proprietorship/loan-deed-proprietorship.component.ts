import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {AgeCalculation} from '../../../../../@core/age-calculation';
import {LoanNameConstant} from '../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';

@Component({
  selector: 'app-loan-deed-proprietorship',
  templateUrl: './loan-deed-proprietorship.component.html',
  styleUrls: ['./loan-deed-proprietorship.component.scss']
})
export class LoanDeedProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  form: FormGroup;
  nepData;
  ckEditorConfig = Editor.CK_CONFIG;
  offerLetterDocument;
  educationalTemplateData;
  offerDocumentChecklist = NabilOfferLetterConst;
  selectiveArr = [];
  companyInfo;
  initialInfo;
  interestRate;
  supportedInfo;
  newOrExisting = false;
  loanData = [];
  purposeOfLoan = 'व्यापार/ व्यवसाय संचालन';
  newTempData: any = [];
  freeText: Array<any> = new Array<any>();
  primarySecurityTypeCheck = false;
  secondarySecurityTypeCheck = false;
  SecurityTypeCheck = false;
  autoCheck = false;
  nameOfAct = 'प्राइभेट फर्म रजिष्टेशन';
  nameOfAuthorizedBody = 'नेपाल सरकार';
  yearOfAct = '२०१४';
  offerDocumentDetails: any;
  dateOfExpirySingle;
  autoFreeText = 'यस अघी देखी नै तपाई धनी बैंकवाट विभिन्न ऋणकर्जा तथा बैकिङ्ग सुविधाहरु प्राप्त गरी उपभोग गर्दै आएको ठिक सांचो हो । हाल म/हामी ऋणी(हरु)लाई उक्त ऋणकर्जा तथा बैंकिङ्ग सुविधा नवीकरण गर्न एवम् थप तथा अतिरिक्त';
  autoFreeText2 = 'उपरोक्त ऋणकर्जा तथा बैंकिग सुविधाको सुरक्षण वापत देहाय बमोजिमको घरजग्गा तपाई धनी बैंकको नाममा धितो बन्धक पारित गरिदिएका छौं।';
  sanctionDate;
  finalAmount;
  loanAmountWord;
  registrationDate;
  freeText1Check = false;
  newData;
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
              private nepToEngNumberPipe: NepaliToEngNumberPipe, ) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0])) {
      this.companyInfo = JSON.parse(this.cadData.assignedLoan[0].companyInfo.companyJsonData);
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
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList) && this.cadData.offerDocumentList.length !== 0) {
      this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    if (this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy' ||
        this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter' ||
        this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
      this.primarySecurityCheck();
      this.secondarySecurityCheck();
    }
    /*this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter' ||*/
    if (this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy' ||
        this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
      this.SecurityCheck();
    }
    if (!ObjectUtil.isEmpty(this.supportedInfo) && !ObjectUtil.isEmpty(this.supportedInfo.freeText1)) {
      this.freeText1Check = true;
    }
    this.getLoanName();
    this.fillForm();
  }

  primarySecurityCheck() {
    this.initialInfo.securities.primarySecurity.forEach(val => {
      if (val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING') {
        this.primarySecurityTypeCheck = true;
      }
    });
  }
  secondarySecurityCheck() {
    this.initialInfo.securities.secondarySecurity.forEach(val => {
      if (val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING') {
        this.secondarySecurityTypeCheck = true;
      }
    });
  }
  SecurityCheck() {
    if (this.initialInfo.securities[0].securityOwnersName !== null) {
      this.SecurityTypeCheck = true;
    }
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
      firmName: [undefined],
      purposeOfLoan: [undefined],
      autoFreeText: [undefined],
      autoFreeText2: [undefined],
      sanctionLetterIssuedDate: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      freeText1: [undefined],
      dateOfExpirySingle: [undefined],
      combinedFreeText: this.formBuilder.array([]),
      grandfatherNameOfPartner: [undefined],
      fatherInLawNameOfPartner: [undefined],
      fatherNameOfPartner: [undefined],
      husbandNameOfPartner: [undefined],
      districtOfPartner: [undefined],
      vdcNameOfPartner: [undefined],
      wardNoOfPartner: [undefined],
      otherAddress: [undefined],
      ageOfPartner: [undefined],
      nameOfPartner: [undefined],
      districtOfWitness1: [undefined],
      vdcOrMunOfWitness1: [undefined],
      wardOfWitness1: [undefined],
      ageOfWitness1: [undefined],
      nameOfWitness1: [undefined],
      districtOfWitness2: [undefined],
      vdcOrMunOfWitness2: [undefined],
      wardOfWitness2: [undefined],
      ageOfWitness2: [undefined],
      nameOfWitness2: [undefined],
      nameOfBankStaff: [undefined],
      etiYear: [undefined],
      etiMonth: [undefined],
      etiDay: [undefined],
      roj: [undefined],
      shuvam: [undefined]
    });
  }

  combinedFree() {
    return this.formBuilder.group({
      dateOfExpiry: [undefined],
      interestRateCombined: [undefined],
    });
  }

  addCombinedFreeText() {
    (this.form.get('combinedFreeText') as FormArray).push(this.combinedFree());
  }

  setCombinedFreeText() {
    for (let i = 0; i < this.newTempData.length; i++) {
      const tempFreeText = {
        interest: this.form.get(['combinedFreeText', i, 'interestRateCombined']) ? this.form.get(['combinedFreeText', i, 'interestRateCombined']).value : '',
        // tslint:disable-next-line:max-line-length
        dateOfExpiry: this.form.get(['combinedFreeText', i, 'dateOfExpiry']) ? this.form.get(['combinedFreeText', i, 'dateOfExpiry']).value : ''
      };
      this.freeText.push(tempFreeText);
    }
    const free1 = {
      freeText1: this.form.get('freeText1') ? this.form.get('freeText1').value : '',
      autoFreeText: this.form.get('autoFreeText') ? this.form.get('autoFreeText').value : '',
      autoFreeText2: this.form.get('autoFreeText2') ? this.form.get('autoFreeText2').value : '',
      districtOfWitness1: this.form.get('districtOfWitness1') ? this.form.get('districtOfWitness1').value : '',
      vdcOrMunOfWitness1: this.form.get('vdcOrMunOfWitness1') ? this.form.get('vdcOrMunOfWitness1').value : '',
      wardOfWitness1: this.form.get('wardOfWitness1') ? this.form.get('wardOfWitness1').value : '',
      ageOfWitness1: this.form.get('ageOfWitness1') ? this.form.get('ageOfWitness1').value : '',
      nameOfWitness1: this.form.get('nameOfWitness1') ? this.form.get('nameOfWitness1').value : '',
      districtOfWitness2: this.form.get('districtOfWitness2') ? this.form.get('districtOfWitness2').value : '',
      vdcOrMunOfWitness2: this.form.get('vdcOrMunOfWitness2') ? this.form.get('vdcOrMunOfWitness2').value : '',
      wardOfWitness2: this.form.get('wardOfWitness2') ? this.form.get('wardOfWitness2').value : '',
      ageOfWitness2: this.form.get('ageOfWitness2') ? this.form.get('ageOfWitness2').value : '',
      nameOfWitness2: this.form.get('nameOfWitness2') ? this.form.get('nameOfWitness2').value : '',
      nameOfBankStaff: this.form.get('nameOfBankStaff') ? this.form.get('nameOfBankStaff').value : '',
      etiYear: this.form.get('etiYear') ? this.form.get('etiYear').value : '',
      etiMonth: this.form.get('etiMonth') ? this.form.get('etiMonth').value : '',
      etiDay: this.form.get('etiDay') ? this.form.get('etiDay').value : '',
      roj: this.form.get('roj') ? this.form.get('roj').value : '',
      shuvam: this.form.get('shuvam') ? this.form.get('shuvam').value : '',
      dateOfExpirySingle: this.form.get('dateOfExpirySingle') ? this.form.get('dateOfExpirySingle').value : '',
      combinedFreeText: this.freeText
    };
    return JSON.stringify(free1);
  }
  patchFreeText() {
    if (!ObjectUtil.isEmpty(this.cadData) && this.cadData.cadFileList.length > 0) {
      if (!ObjectUtil.isEmpty(this.supportedInfo) && this.autoFreeText === this.supportedInfo.autoFreeText) {
        this.autoFreeText = 'यस अघी देखी नै तपाई धनी बैंकवाट विभिन्न ऋणकर्जा तथा बैकिङ्ग सुविधाहरु प्राप्त गरी उपभोग गर्दै आएको ठिक सांचो हो । हाल म/हामी ऋणी(हरु)लाई उक्त ऋणकर्जा तथा बैंकिङ्ग सुविधा नवीकरण गर्न एवम् थप तथा अतिरिक्त';
      }
      if (!ObjectUtil.isEmpty(this.supportedInfo) && this.supportedInfo.autoFreeText !== this.autoFreeText) {
        this.autoFreeText = this.supportedInfo.autoFreeText;
      }
      if (!ObjectUtil.isEmpty(this.supportedInfo) && this.autoFreeText2 === this.supportedInfo.autoFreeText2) {
        this.autoFreeText2 = 'उपरोक्त ऋणकर्जा तथा बैंकिग सुविधाको सुरक्षण वापत देहाय बमोजिमको घरजग्गा तपाई धनी बैंकको नाममा धितो बन्धक पारित गरिदिएका छौं।';
      }
      if (!ObjectUtil.isEmpty(this.supportedInfo) && this.supportedInfo.autoFreeText2 !== this.autoFreeText2) {
        this.autoFreeText2 = this.supportedInfo.autoFreeText2;
      }
    }
    this.form.patchValue({
      freeText1: this.supportedInfo ? this.supportedInfo.freeText1 : '',
      autoFreeText: this.autoFreeText ? this.autoFreeText : '',
      autoFreeText2: this.autoFreeText2 ? this.autoFreeText2 : '',
      districtOfWitness1: this.supportedInfo ? this.supportedInfo.districtOfWitness1 : '',
      vdcOrMunOfWitness1: this.supportedInfo ? this.supportedInfo.vdcOrMunOfWitness1 : '',
      wardOfWitness1: this.supportedInfo ? this.supportedInfo.wardOfWitness1 : '',
      ageOfWitness1: this.supportedInfo ? this.supportedInfo.ageOfWitness1 : '',
      nameOfWitness1: this.supportedInfo ? this.supportedInfo.nameOfWitness1 : '',
      districtOfWitness2: this.supportedInfo ? this.supportedInfo.districtOfWitness2 : '',
      vdcOrMunOfWitness2: this.supportedInfo ? this.supportedInfo.vdcOrMunOfWitness2 : '',
      wardOfWitness2: this.supportedInfo ? this.supportedInfo.wardOfWitness2 : '',
      ageOfWitness2: this.supportedInfo ? this.supportedInfo.ageOfWitness2 : '',
      nameOfWitness2: this.supportedInfo ? this.supportedInfo.nameOfWitness2 : '',
      nameOfBankStaff: this.supportedInfo ? this.supportedInfo.nameOfBankStaff : '',
      etiYear: this.supportedInfo ? this.supportedInfo.etiYear : '',
      etiMonth: this.supportedInfo ? this.supportedInfo.etiMonth : '',
      etiDay: this.supportedInfo ? this.supportedInfo.etiDay : '',
      roj: this.supportedInfo ? this.supportedInfo.roj : '',
      shuvam: this.supportedInfo ? this.supportedInfo.shuvam : '',
    });
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          individualCadFile.supportedInformation = this.setCombinedFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        this.initialInfoPrint = cadFile.initialInformation;
        cadFile.supportedInformation = this.setCombinedFreeText();
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);
      this.initialInfoPrint = cadFile.initialInformation;
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

  getLoanName() {
    this.cadData.assignedLoan.forEach(val => {
      const loanName = val.loan.name;
      const loanNepaliName = val.loan.nepaliName;
      const tempLoan = {
        loanName: loanName,
        loanNepaliName: loanNepaliName,
      };
      this.loanData.push(tempLoan);
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
        this.registrationDate = this.individualData.registrationDate.en ? this.individualData.registrationDate.en.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy' ||
          this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        if (this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
          const dateOfApproval = this.initialInfo.sanctionLetterDateType ? this.initialInfo.sanctionLetterDateType.en : '';
          if (dateOfApproval === 'AD') {
            this.sanctionDate = this.initialInfo.sanctionLetterDate ?
                this.engToNepaliDate.transform(this.initialInfo.sanctionLetterDate.ct, true) : '';
          } else {
            this.sanctionDate = this.initialInfo.sanctionLetterDateNepali ? this.initialInfo.sanctionLetterDateNepali.ct : '';
          }
          if (this.initialInfo.costumerType.en === 'existingPlainRenewal' ||
              this.initialInfo.costumerType.en === 'existingRenewalWithEnhancement'
              || this.initialInfo.costumerType.en === 'existingAdditionalLoan') {
            this.newOrExisting = true;
          }
        }
        if (this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
          const dateOfApproval = this.initialInfo.sanctionLetterDateType ? this.initialInfo.sanctionLetterDateType.en : '';
          if (dateOfApproval === 'AD') {
            this.sanctionDate = this.initialInfo.sanctionLetterDate ? this.initialInfo.sanctionLetterDate.ct : '';
          } else {
            this.sanctionDate = this.initialInfo.sanctionLetterDateNepali ? this.initialInfo.sanctionLetterDateNepali.ct : '';
          }
          if (this.initialInfo.loanOption.en === 'EXISTING' || this.initialInfo.loanOption.en === 'Existing') {
            this.newOrExisting = true;
          }
        }
        this.interestRate = this.initialInfo.interestRate ? this.initialInfo.interestRate.ct : '';
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
        if (this.initialInfo.loanOption.en === 'EXISTING' || this.initialInfo.loanOption.en === 'Existing' ) {
          this.newOrExisting = true;
        }
        this.interestRate = this.initialInfo.interestRate ? this.initialInfo.interestRate.ct : '';
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
        if (this.initialInfo.smeGlobalForm.loanOption === 'Plain Renewal' || this.initialInfo.smeGlobalForm.loanOption === 'Other'
            || this.initialInfo.smeGlobalForm.loanOption === 'Renewal with Enhancement or Additional Loan' ||
            this.initialInfo.smeGlobalForm.loanOption === 'Additional Loan') {
          this.newOrExisting = true;
        }
        if (this.loanData.length > 0) {
          this.loanData.forEach((v, index) => {
            // tslint:disable-next-line:max-line-length
            if (v.loanName === LoanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT && !ObjectUtil.isEmpty(this.initialInfo.timeLetterCreditForm)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry;
              if (this.initialInfo.timeLetterCreditForm.loanOption === 'REGULAR') {
                const dateOfExpiryType = this.initialInfo.timeLetterCreditForm.dateOfExpiryType ?
                    this.initialInfo.timeLetterCreditForm.dateOfExpiryType : '';
                if (dateOfExpiryType === 'AD') {
                  tempDateOfExpiry = this.engToNepaliDate.transform(this.initialInfo.timeLetterCreditForm.dateOfApproval ?
                      this.initialInfo.timeLetterCreditForm.dateOfExpiry : '', true);
                } else {
                  tempDateOfExpiry = this.initialInfo.timeLetterCreditForm.dateOfExpiryNepali ?
                      this.initialInfo.timeLetterCreditForm.dateOfExpiryNepali.nDate : '';
                }
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: false,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            // tslint:disable-next-line:max-line-length
            if (v.loanName === LoanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY && !ObjectUtil.isEmpty(this.initialInfo.letterOfCreditForm)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry1;
              if (this.initialInfo.letterOfCreditForm.loanOption === 'REGULAR') {
                const dateOfExpiryType = this.initialInfo.letterOfCreditForm.dateOfExpiryType ?
                    this.initialInfo.letterOfCreditForm.dateOfExpiryType : '';
                if (dateOfExpiryType === 'AD') {
                  tempDateOfExpiry1 = this.engToNepaliDate.transform(this.initialInfo.letterOfCreditForm.dateOfExpiry ?
                      this.initialInfo.letterOfCreditForm.dateOfExpiry : '', true);
                } else {
                  tempDateOfExpiry1 = this.initialInfo.letterOfCreditForm.dateOfExpiryNepali ?
                      this.initialInfo.letterOfCreditForm.dateOfExpiryNepali.nDate : '';
                }
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: false,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry1,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            // tslint:disable-next-line:max-line-length
            if (v.loanName === LoanNameConstant.IMPORT_BILLS_DISCOUNTING && !ObjectUtil.isEmpty(this.initialInfo.importBillsDiscountForm)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry;
              if (this.initialInfo.importBillsDiscountForm.loanOption === 'REGULAR') {
                const dateOfExpiryType = this.initialInfo.importBillsDiscountForm.dateOfExpiryType ?
                    this.initialInfo.importBillsDiscountForm.dateOfExpiryType : '';
                if (dateOfExpiryType === 'AD') {
                  // tslint:disable-next-line:max-line-length
                  tempDateOfExpiry = this.engToNepaliDate.transform(this.initialInfo.importBillsDiscountForm.dateOfApproval ?
                      this.initialInfo.importBillsDiscountForm.dateOfExpiry : '', true);
                } else {
                  tempDateOfExpiry = this.initialInfo.importBillsDiscountForm.dateOfExpiryNepali ?
                      this.initialInfo.importBillsDiscountForm.dateOfExpiryNepali.nDate : '';
                }
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: false,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN &&
                !ObjectUtil.isEmpty(this.initialInfo.importLoanTrust)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry;
              if (this.initialInfo.importLoanTrust.loanOption === 'REGULAR') {
                const dateOfExpiryType = this.initialInfo.importLoanTrust.dateOfExpiryType ?
                    this.initialInfo.importLoanTrust.dateOfExpiryType : '';
                if (dateOfExpiryType === 'AD') {
                  tempDateOfExpiry = this.engToNepaliDate.transform(this.initialInfo.importLoanTrust.dateOfApproval ?
                      this.initialInfo.importLoanTrust.dateOfExpiry : '', true);
                } else {
                  tempDateOfExpiry = this.initialInfo.importLoanTrust.dateOfExpiryNepali ?
                      this.initialInfo.importLoanTrust.dateOfExpiryNepali.nDate : '';
                }
              }
              let importLoanInterest;
              for (const x of this.initialInfo.importLoanTrust) {
                importLoanInterest = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: true,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry,
                interestRate: importLoanInterest,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.SHORT_TERM_LOAN &&
                !ObjectUtil.isEmpty(this.initialInfo.revolvingShortTermLoan)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry;
              if (this.initialInfo.revolvingShortTermLoan.loanOption === 'REGULAR') {
                const dateOfExpiryType = this.initialInfo.revolvingShortTermLoan.dateOfExpiryType ?
                    this.initialInfo.revolvingShortTermLoan.dateOfExpiryType : '';
                if (dateOfExpiryType === 'AD') {
                  // tslint:disable-next-line:max-line-length
                  tempDateOfExpiry = this.engToNepaliDate.transform(this.initialInfo.revolvingShortTermLoan.dateOfApproval ?
                      this.initialInfo.revolvingShortTermLoan.dateOfExpiry : '', true);
                } else {
                  tempDateOfExpiry = this.initialInfo.revolvingShortTermLoan.dateOfExpiryNepali ?
                      this.initialInfo.revolvingShortTermLoan.dateOfExpiryNepali.nDate : '';
                }
              }
              let revolving;
              for (const x of this.initialInfo.revolvingShortTermLoan) {
                revolving = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: true,
                interestRate: revolving,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL &&
                !ObjectUtil.isEmpty(this.initialInfo.demandLoanForm)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry;
              const dateOfExpiryType = this.initialInfo.demandLoanForm.dateOfExpiryType ?
                  this.initialInfo.demandLoanForm.dateOfExpiryType : '';
              if (dateOfExpiryType === 'AD') {
                tempDateOfExpiry = this.engToNepaliDate.transform(this.initialInfo.demandLoanForm.dateOfApproval ?
                    this.initialInfo.demandLoanForm.dateOfExpiry : '', true);
              } else {
                tempDateOfExpiry = this.initialInfo.demandLoanForm.dateOfExpiryNepali ?
                    this.initialInfo.demandLoanForm.dateOfExpiryNepali.nDate : '';
              }
              let demandLoanForm;
              for (const x of this.initialInfo.demandLoanForm) {
                demandLoanForm = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: true,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry,
                interestRate: demandLoanForm
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.PRE_EXPORT_LOAN && !ObjectUtil.isEmpty(this.initialInfo.preExportForm)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry2;
              const dateOfExpiryType = this.initialInfo.preExportForm.dateOfExpiryType ?
                  this.initialInfo.preExportForm.dateOfExpiryType : '';
              if (dateOfExpiryType === 'AD') {
                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.preExportForm.dateOfExpiry ?
                    this.initialInfo.preExportForm.dateOfExpiry : '', true);
              } else {
                tempDateOfExpiry2 = this.initialInfo.preExportForm.dateOfExpiryNepali ?
                    this.initialInfo.preExportForm.dateOfExpiryNepali.nDate : '';
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: false,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry2,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION &&
                !ObjectUtil.isEmpty(this.initialInfo.documentaryBillPurchase)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry2;
              const dateOfExpiryType = this.initialInfo.documentaryBillPurchase.dateOfExpiryType ?
                  this.initialInfo.documentaryBillPurchase.dateOfExpiryType : '';
              if (dateOfExpiryType === 'AD') {
                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.documentaryBillPurchase.dateOfExpiry ?
                    this.initialInfo.documentaryBillPurchase.dateOfExpiry : '', true);
              } else {
                tempDateOfExpiry2 = this.initialInfo.documentaryBillPurchase.dateOfExpiryNepali ?
                    this.initialInfo.documentaryBillPurchase.dateOfExpiryNepali.nDate : '';
              }
              let importLoanInterest;
              for (const x of this.initialInfo.importLoanTrust) {
                importLoanInterest = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: false,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry2,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT &&
                !ObjectUtil.isEmpty(this.initialInfo.overdraftLoanForm)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry2;
              const dateOfExpiryType = this.initialInfo.overdraftLoanForm.dateOfExpiryType ?
                  this.initialInfo.overdraftLoanForm.dateOfExpiryType : '';
              if (dateOfExpiryType === 'AD') {
                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.overdraftLoanForm.dateOfExpiry ?
                    this.initialInfo.overdraftLoanForm.dateOfExpiry : '', true);
              } else {
                tempDateOfExpiry2 = this.initialInfo.overdraftLoanForm.dateOfExpiryNepali ?
                    this.initialInfo.overdraftLoanForm.dateOfExpiryNepali.nDate : '';
              }
              let overdraftLoanForm;
              for (const x of this.initialInfo.overdraftLoanForm) {
                overdraftLoanForm = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: true,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry2,
                interestRate: overdraftLoanForm,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.MORTGAGE_OVERDRAFT ||
                v.loanName === LoanNameConstant.EQUITY_MORTGAGED_OVERDRAFT &&
                !ObjectUtil.isEmpty(this.initialInfo.equityMortgaged)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry2;
              const dateOfExpiryType = this.initialInfo.equityMortgaged.dateOfExpiryType ?
                  this.initialInfo.equityMortgaged.dateOfExpiryType : '';
              if (dateOfExpiryType === 'AD') {
                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.equityMortgaged.dateOfExpiry ?
                    this.initialInfo.equityMortgaged.dateOfExpiry : '', true);
              } else {
                tempDateOfExpiry2 = this.initialInfo.equityMortgaged.dateOfExpiryNepali ?
                    this.initialInfo.equityMortgaged.dateOfExpiryNepali.nDate : '';
              }
              let equityMortgaged;
              for (const x of this.initialInfo.equityMortgaged.equityMortgagedFormArray) {
                equityMortgaged = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: true,
                interestRate: equityMortgaged,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry2,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            // tslint:disable-next-line:max-line-length
            if (v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_FIXED_DEPOSIT || v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_LIEN_ON_DEPOSIT_ACCOUNT ||
                v.loanName === LoanNameConstant.STL_AGAINST_FIXED_DEPOSIT ||
                v.loanName === LoanNameConstant.STL_LIEN_ON_DEPOSIT_ACCOUNT ||
                v.loanName === LoanNameConstant.DL_AGAINST_FIXED_DEPOSIT ||
                v.loanName === LoanNameConstant.DL_LIEN_ON_DEPOSIT_ACCOUNT &&
                !ObjectUtil.isEmpty(this.initialInfo.overdraftFixedForm)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry2;
              const dateOfExpiryType = this.initialInfo.overdraftFixedForm.dateOfExpiryType ?
                  this.initialInfo.overdraftFixedForm.dateOfExpiryType : '';
              if (dateOfExpiryType === 'AD') {
                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.overdraftFixedForm.dateOfExpiry ?
                    this.initialInfo.overdraftFixedForm.dateOfExpiry : '', true);
              } else {
                tempDateOfExpiry2 = this.initialInfo.overdraftFixedForm.dateOfExpiryNepali ?
                    this.initialInfo.overdraftFixedForm.dateOfExpiryNepali.nDate : '';
              }
              let overdraftFixedForm;
              for (const x of this.initialInfo.overdraftFixedForm) {
                overdraftFixedForm = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: true,
                interestRate: overdraftFixedForm,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry2,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            // tslint:disable-next-line:max-line-length
            if (v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_AGAINST_BOND || v.loanName === LoanNameConstant.STL_FACILITY_AGAINST_BOND ||
                v.loanName === LoanNameConstant.DL_FACILITY_AGAINST_BOND &&
                !ObjectUtil.isEmpty(this.initialInfo.overDraftFacilityForm)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry2;
              const dateOfExpiryType = this.initialInfo.overDraftFacilityForm.dateOfExpiryType ?
                  this.initialInfo.overDraftFacilityForm.dateOfExpiryType : '';
              if (dateOfExpiryType === 'AD') {
                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.overDraftFacilityForm.dateOfExpiry ?
                    this.initialInfo.overDraftFacilityForm.dateOfExpiry : '', true);
              } else {
                tempDateOfExpiry2 = this.initialInfo.overDraftFacilityForm.dateOfExpiryNepali ?
                    this.initialInfo.overDraftFacilityForm.dateOfExpiryNepali.nDate : '';
              }
              let overDraftFacilityForm;
              for (const x of this.initialInfo.overDraftFacilityForm) {
                overDraftFacilityForm = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: true,
                interestRate: overDraftFacilityForm,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry2,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.BRIDGE_GAP_LOAN && !ObjectUtil.isEmpty(this.initialInfo.bridgeGapLoan)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry2;
              const dateOfExpiryType = this.initialInfo.bridgeGapLoan.dateOfExpiryType ?
                  this.initialInfo.bridgeGapLoan.dateOfExpiryType : '';
              if (dateOfExpiryType === 'AD') {
                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.bridgeGapLoan.dateOfExpiry ?
                    this.initialInfo.bridgeGapLoan.dateOfExpiry : '', true);
              } else {
                tempDateOfExpiry2 = this.initialInfo.bridgeGapLoan.dateOfExpiryNepali ?
                    this.initialInfo.bridgeGapLoan.dateOfExpiryNepali.nDate : '';
              }
              let bridgeGapLoan;
              for (const x of this.initialInfo.bridgeGapLoan) {
                bridgeGapLoan = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: true,
                interestRate: bridgeGapLoan,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry2,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            let termLoanInterestRateCT;
            if (v.loanName === LoanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              if (this.initialInfo.termLoanForm.termLoanDetails.length > 0) {
                const tmpData = this.initialInfo.termLoanForm.termLoanDetails;
                tmpData.forEach(val => {
                  if (val.termLoanFor === 'VEHICLE') {
                    this.autoCheck = true;
                  }
                });
              }
              for (const x of this.initialInfo.termLoanForm.termLoanDetails) {
                termLoanInterestRateCT = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: true,
                loanAmount: tempLoanAmount,
                dateOfExpiry: '',
                interestRate: termLoanInterestRateCT,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.MORTGAGE_TERM_LOAN) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let mortgageEquityTermForm;
              for (const x of this.initialInfo.mortgageEquityTermForm.mortgageTermFormArray) {
                mortgageEquityTermForm = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: false,
                interestRate: mortgageEquityTermForm,
                loanAmount: tempLoanAmount,
                dateOfExpiry: '',
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.EQUITY_MORTGAGE_TERM_LOAN) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let mortgageEquityTermForm;
              for (const x of this.initialInfo.mortgageEquityTermForm.mortgageEquityTermFormArray) {
                mortgageEquityTermForm = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: false,
                interestRate: mortgageEquityTermForm,
                loanAmount: tempLoanAmount,
                dateOfExpiry: '',
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.AUTO_LOAN) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              this.autoCheck = true;
              let autoLoanInterestRateCT;
              for (const x of this.initialInfo.autoLoanMasterForm.autoLoanFormArray) {
                autoLoanInterestRateCT = x.interestRateCT;
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: true,
                loanAmount: tempLoanAmount,
                dateOfExpiry: '',
                interestRate: autoLoanInterestRateCT,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.BANK_GUARANTEE && !ObjectUtil.isEmpty(this.initialInfo.bankGuarantee)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry2;
              const dateOfExpiryType = this.initialInfo.bankGuarantee.dateOfExpiryType ?
                  this.initialInfo.bankGuarantee.dateOfExpiryType : '';
              if (dateOfExpiryType === 'AD') {
                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.bankGuarantee.dateOfExpiry ?
                    this.initialInfo.bankGuarantee.dateOfExpiry : '', true);
              } else {
                tempDateOfExpiry2 = this.initialInfo.bankGuarantee.dateOfExpiryNepali ?
                    this.initialInfo.bankGuarantee.dateOfExpiryNepali.nDate : '';
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: false,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry2,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            if (v.loanName === LoanNameConstant.BILLS_PURCHASE && !ObjectUtil.isEmpty(this.initialInfo.billPurchaseForm)) {
              // tslint:disable-next-line:max-line-length
              const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
              let tempDateOfExpiry2;
              const dateOfExpiryType = this.initialInfo.billPurchaseForm.dateOfExpiryType ?
                  this.initialInfo.billPurchaseForm.dateOfExpiryType : '';
              if (dateOfExpiryType === 'AD') {
                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.billPurchaseForm.dateOfExpiry ?
                    this.initialInfo.billPurchaseForm.dateOfExpiry : '', true);
              } else {
                tempDateOfExpiry2 = this.initialInfo.billPurchaseForm.dateOfExpiryNepali ?
                    this.initialInfo.billPurchaseForm.dateOfExpiryNepali.nDate : '';
              }
              this.newData = {
                loanNepaliName: v.loanNepaliName,
                interestRateExists: false,
                loanAmount: tempLoanAmount,
                dateOfExpiry: tempDateOfExpiry2,
              };
              this.newTempData.push(
                  this.newData
              );
            }
            this.addCombinedFreeText();
            if (this.cadData.cadFileList.length > 0) {
              this.form.get(['combinedFreeText', index, 'dateOfExpiry']).patchValue(
                  this.supportedInfo ? this.supportedInfo.combinedFreeText[index].dateOfExpiry : ''
              );
              this.form.get(['combinedFreeText', index, 'interestRateCombined']).patchValue(
                  this.supportedInfo ? this.supportedInfo.combinedFreeText[index].interest : ''
              );
            } else {
              this.form.get(['combinedFreeText', index, 'dateOfExpiry']).patchValue(
                  this.newTempData[index].dateOfExpiry
              );
            }
          });
        }
      }
    }
    // for date of expiry
    if (this.cadData.offerDocumentList[0].docName !== 'Combined Offer Letter') {
      if (this.cadData.cadFileList.length > 0) {
        const date = JSON.parse(this.cadData.cadFileList[0].supportedInformation);
        this.dateOfExpirySingle = !ObjectUtil.isEmpty(date) ? date.dateOfExpirySingle : '';
      }
    }
    /*this.checkOfferLetterData();*/
    this.form.patchValue({
      nameOfBranchLocated: this.individualData.branch ? this.individualData.branch.ct : '',
      actName: !ObjectUtil.isEmpty(this.individualData.actName) ? this.individualData.actName.ct : this.nameOfAct,
      yearInFigure: this.setActYear(),
      nameOfAuthorizedBody: !ObjectUtil.isEmpty(this.individualData.authorizedBodyName) ?
          this.individualData.authorizedBodyName.ct : this.nameOfAuthorizedBody,
      nameOfDepartment: this.individualData.registeredWith ? this.individualData.registeredWith.ct : '',
      dateOfRegistration: this.setRegistrationDate(),
      registrationNo: this.individualData.registrationNo ? this.individualData.registrationNo.ct : '',
      firmName: this.individualData.name ? this.individualData.name.ct : '',
      loanAmountInFigure: this.finalAmount ? this.finalAmount : '',
      loanAmountInWords: this.loanAmountWord ? this.loanAmountWord : '',
      sanctionLetterIssuedDate: this.sanctionDate ? this.sanctionDate : '',
      dateOfExpirySingle: this.dateOfExpirySingle ? this.dateOfExpirySingle : '',
      purposeOfLoan: this.setLoanPurpose(),
    });
    this.patchFreeText();
  }

  ageCalculation(startDate) {
    startDate = this.datePipe.transform(startDate, 'MMMM d, y, h:mm:ss a z');
    const stDate = new Date(startDate);
    const endDate = new Date();
    let diff = (endDate.getTime() - stDate.getTime()) / 1000;
    diff = diff / (60 * 60 * 24);
    const yr = Math.abs(Math.round(diff / 365.25));
    return this.engToNepNumberPipe.transform(yr.toString());
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  convertNepaliNumberAmount(value) {
    return this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(value));
  }

  setRegistrationDate() {
    let regDate = '';
    if (this.individualData.registrationDateOption.en === 'AD') {
      regDate = this.engToNepaliDate.transform(this.individualData.registrationDate.en ?
          this.individualData.registrationDate.en : this.individualData.registrationDate.en, true) || '' ;
    } else {
      regDate = this.individualData.registrationDate.en.nDate ? this.individualData.registrationDate.en.nDate : '';
    }
    return regDate ? regDate : '';
  }
  setLoanPurpose() {
    let loanKoPurpose = '';
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
      loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
      loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
      loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
      loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.mortgageEquityTermForm) {
      loanKoPurpose = this.offerDocumentDetails.mortgageEquityTermForm.purposeOfLoanCT;
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.autoLoanMasterForm) {
      loanKoPurpose = this.offerDocumentDetails.autoLoanMasterForm.purposeOfLoanCT;
    }
    return loanKoPurpose ? loanKoPurpose : this.purposeOfLoan;
  }

  setActYear() {
    let yearOfAct = '';
    if (!ObjectUtil.isEmpty(this.individualData.radioActYearDate.en === 'AD')) {
      yearOfAct = this.engToNepNumberPipe.transform(this.individualData.actYear.en ?
          this.individualData.actYear.en : this.individualData.actYear.en, true) || '' ;
    } else {
      yearOfAct = this.individualData.actYear.en ? this.individualData.actYear.en : '';
    }
    return yearOfAct ? yearOfAct : this.yearOfAct;
  }
}

