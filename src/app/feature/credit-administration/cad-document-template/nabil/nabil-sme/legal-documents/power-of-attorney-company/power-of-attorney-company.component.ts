import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CadFile} from '../../../../../model/CadFile';
import {Document} from '../../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../../utils/router-utils.service';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-power-of-attorney-company',
  templateUrl: './power-of-attorney-company.component.html',
  styleUrls: ['./power-of-attorney-company.component.scss']
})
export class PowerOfAttorneyCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  powerOfAttorneyCompanyForm: FormGroup;
  companyInfo: any = [];
  offerDocumentDetails: any;
  loanHolderNepData: any;
  finalAmount;
  loanAmountWord;
  isAuth = false;
  isAuth1 = false;
  spinner = false;
  freeText;
  totalAmount;
  totalAmountInWord;
  savedFreeText: Array<any> = new Array<any>();
  issueDate = [];
  authorizedNameArray: Array<any> = new Array<any>();
  constructor(private formBuilder: FormBuilder,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              public englishNepaliDatePipe: EngNepDatePipe,
              public datePipe: DatePipe) {
  }

  ngOnInit() {
    this.setData();
    this.setTotalAmount();
    this.buildForm();
    this.patchData();
    this.setSavedFreeText();
  }

  setData() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0])) {
      this.companyInfo = JSON.parse(this.cadData.assignedLoan[0].companyInfo.companyJsonData);
      this.companyInfo.forEach(val => {
        if (val.isAuthorizedPerson === 'Authorized Person Only' || val.isAuthorizedPerson === 'Both') {
          const authorizedName = val.ownerNameCT;
          this.authorizedNameArray.push(authorizedName);
          this.isAuth = true;
        } else {
          this.isAuth1 = true;
        }
      });
      this.dateConvert();
    }
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.loanHolderNepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.freeText = JSON.parse(singleCadFile.supportedInformation);
        }
      });
    }
    let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
  }

  dateConvert() {
    let date;
    let date2;
    this.companyInfo.forEach(val => {
      if (val.ownerNationality === 'Nepali') {
        if (val.radioOwnerCitizenshipIssuedDate === 'AD') {
          date = this.englishNepaliDatePipe.transform(val ?
              val.ownerCitizenshipIssuedDateCT : val.ownerCitizenshipIssuedDateCT, true) || '';
        } else {
          date = val ? val.ownerCitizenshipIssuedDateNepali.nDate : '';
        }
        const newDate = {
          issueDate : date
        };
        this.issueDate.push(newDate);
      }
      if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Passport') {
        date = this.englishNepaliDatePipe.transform(val ?
            val.indianOwnerPassportIssuedDateCT : val.indianOwnerPassportIssuedDateCT, true) || '';
        date2 = this.englishNepaliDatePipe.transform(val ?
            val.indianOwnerPassportValidityDateCT : val.indianOwnerPassportValidityDateCT, true) || '';
        const newDate = {
          issueDate : date,
          validDate : date2
        };
        this.issueDate.push(newDate);
      }
      if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Adhar Card') {
        date = this.englishNepaliDatePipe.transform(val ?
            val.indianOwnerAdharCardIssuedDateCT : val.indianOwnerAdharCardIssuedDateCT, true) || '';
        const newDate = {
          issueDate : date,
        };
        this.issueDate.push(newDate);
      }
      if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Embassy Certificate') {
        date = this.englishNepaliDatePipe.transform(val ?
            val.indianEmbassyIssuedDateCT : val.indianEmbassyIssuedDateCT, true) || '';
        const newDate = {
          issueDate : date,
        };
        this.issueDate.push(newDate);
      }
      if (val.ownerNationality === 'Other') {
        if (val.otherOwnerPassportIssuedDateOption === 'AD') {
          date = this.englishNepaliDatePipe.transform(val ?
              val.otherOwnerPassportIssuedDateCT : val.otherOwnerPassportIssuedDateCT, true) || '';
        }
        if (val.otherOwnerPassportValidityDateOption === 'AD') {
          date2 = this.englishNepaliDatePipe.transform(val ?
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

  setSavedFreeText() {
    this.companyInfo.forEach((v, index) => {
      this.addFreeTextArray();
      if (this.cadData.cadFileList.length > 0) {
        if (!ObjectUtil.isEmpty(this.freeText.freeTextArray)) {
          this.powerOfAttorneyCompanyForm.get(['freeTextArray', index, 'freeText2']).patchValue(
              this.freeText.freeTextArray ? this.freeText.freeTextArray[index].freeText2 : ''
          );
        }
      }
    });
  }


  buildForm() {
    this.powerOfAttorneyCompanyForm = this.formBuilder.group({
      districtOfCompany: [this.loanHolderNepData.registeredDistrict ? this.loanHolderNepData.registeredDistrict.ct : ''],
      vdcCompany: [this.loanHolderNepData.registeredMunicipality ? this.loanHolderNepData.registeredMunicipality.ct : ''],
      wardNumber: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
      streetName: [this.loanHolderNepData.registeredStreetTole ? this.loanHolderNepData.registeredStreetTole.ct : ''],
      nameOfBorrower: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
      freeText1: [this.freeText ? this.freeText.freeText1 : ''],
      branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
      sanctionLetterIssuedDate: [this.setApprovalDate()],
      loanAmountInFigure: this.totalAmount,
      loanAmountInWords: this.totalAmountInWord,
      sakshiDistrict1: [this.freeText ? this.freeText.sakshiDistrict1 : ''],
      sakshiDistrict2: [this.freeText ? this.freeText.sakshiDistrict2 : ''],
      sakshiMunicipality1: [this.freeText ? this.freeText.sakshiMunicipality1 : ''],
      sakshiMunicipality2: [this.freeText ? this.freeText.sakshiMunicipality2 : ''],
      sakshiAge1: [this.freeText ? this.freeText.sakshiAge1 : ''],
      sakshiAge2: [this.freeText ? this.freeText.sakshiAge2 : ''],
      sakshiWard1: [this.freeText ? this.freeText.sakshiWard1 : ''],
      sakshiWard2: [this.freeText ? this.freeText.sakshiWard2 : ''],
      sakshiName1: [this.freeText ? this.freeText.sakshiName1 : ''],
      sakshiName2: [this.freeText ? this.freeText.sakshiName2 : ''],
      nameOfBankStaff: [this.freeText ? this.freeText.nameOfBankStaff : ''],
      authorizedBodyName: [undefined],
      freeTextArray: this.formBuilder.array([]),
      date: [undefined],
    });
  }
  patchData() {
    this.companyInfo.forEach(val => {
    if (val.isAuthorizedPerson === 'Share Holder Only') {
      this.powerOfAttorneyCompanyForm.patchValue({
        authorizedBodyName: this.freeText ? this.freeText.authorizedBodyName : ''
      });
    }});
  }
  freeTextForm() {
    return this.formBuilder.group({
      freeText2: ['सञ्चालक/प्रबन्ध सञ्चालक/प्रमुख कार्यकारी अधिकृत'],
       // freeText2: [undefined],
    });
  }

  addFreeTextArray() {
    (this.powerOfAttorneyCompanyForm.get('freeTextArray') as FormArray).push(this.freeTextForm());
  }

  setFreeText() {
    for (let i = 0; i < this.companyInfo.length; i++) {
      const tempFreeText = {
        freeText2: this.powerOfAttorneyCompanyForm.get(['freeTextArray', i, 'freeText2']) ?
            this.powerOfAttorneyCompanyForm.get(['freeTextArray', i, 'freeText2']).value : '',
      };
      this.savedFreeText.push(tempFreeText);
    }
    const free = {
      freeText1: this.powerOfAttorneyCompanyForm.get('freeText1').value ? this.powerOfAttorneyCompanyForm.get('freeText1').value : '',
      sakshiDistrict1: this.powerOfAttorneyCompanyForm.get('sakshiDistrict1').value ? this.powerOfAttorneyCompanyForm.get('sakshiDistrict1').value : '',
      sakshiDistrict2: this.powerOfAttorneyCompanyForm.get('sakshiDistrict2').value ? this.powerOfAttorneyCompanyForm.get('sakshiDistrict2').value : '',
      sakshiMunicipality1: this.powerOfAttorneyCompanyForm.get('sakshiMunicipality1').value ? this.powerOfAttorneyCompanyForm.get('sakshiMunicipality1').value : '',
      sakshiMunicipality2: this.powerOfAttorneyCompanyForm.get('sakshiMunicipality2').value ? this.powerOfAttorneyCompanyForm.get('sakshiMunicipality2').value : '',
      sakshiAge1: this.powerOfAttorneyCompanyForm.get('sakshiAge1').value ? this.powerOfAttorneyCompanyForm.get('sakshiAge1').value : '',
      sakshiAge2: this.powerOfAttorneyCompanyForm.get('sakshiAge2').value ? this.powerOfAttorneyCompanyForm.get('sakshiAge2').value : '',
      sakshiWard1: this.powerOfAttorneyCompanyForm.get('sakshiWard1').value ? this.powerOfAttorneyCompanyForm.get('sakshiWard1').value : '',
      sakshiWard2: this.powerOfAttorneyCompanyForm.get('sakshiWard2').value ? this.powerOfAttorneyCompanyForm.get('sakshiWard2').value : '',
      sakshiName1: this.powerOfAttorneyCompanyForm.get('sakshiName1').value ? this.powerOfAttorneyCompanyForm.get('sakshiName1').value : '',
      sakshiName2: this.powerOfAttorneyCompanyForm.get('sakshiName2').value ? this.powerOfAttorneyCompanyForm.get('sakshiName2').value : '',
      nameOfBankStaff: this.powerOfAttorneyCompanyForm.get('nameOfBankStaff').value ? this.powerOfAttorneyCompanyForm.get('nameOfBankStaff').value : '',
      authorizedBodyName: this.powerOfAttorneyCompanyForm.get('authorizedBodyName').value ? this.powerOfAttorneyCompanyForm.get('authorizedBodyName').value : '',
      freeTextArray: this.savedFreeText,
      date: this.powerOfAttorneyCompanyForm.get('date').value ? this.powerOfAttorneyCompanyForm.get('date').value : '',
    };
    return JSON.stringify(free);
  }
  setTotalAmount() {
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
        this.totalAmount = (this.offerDocumentDetails.smeGlobalForm && this.offerDocumentDetails.smeGlobalForm.totalLimitInFigureCT) ?
            this.offerDocumentDetails.smeGlobalForm.totalLimitInFigureCT : '';
        this.totalAmountInWord = (this.offerDocumentDetails.smeGlobalForm && this.offerDocumentDetails.smeGlobalForm.totalLimitInWordsCT ) ?
            this.offerDocumentDetails.smeGlobalForm.totalLimitInWordsCT : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
        this.totalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.loanLimitAmountFigure) ?
            this.offerDocumentDetails.loanLimitAmountFigure.ct : '';
        this.totalAmountInWord = (this.offerDocumentDetails && this.offerDocumentDetails.loanLimitAmountFigureWords) ?
            this.offerDocumentDetails.loanLimitAmountFigureWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        this.totalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitInFigure) ?
            this.offerDocumentDetails.totalLimitInFigure.ct : '';
        this.totalAmountInWord = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitInWords) ?
            this.offerDocumentDetails.totalLimitInWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
        this.totalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitFigure) ?
            this.offerDocumentDetails.totalLimitFigure.ct : '';
        this.totalAmountInWord = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitWords) ?
            this.offerDocumentDetails.totalLimitWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
        const proposedLimit = this.cadData.assignedLoan[0] ?
            this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
        this.totalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
        this.totalAmountInWord = this.nepaliCurrencyWordPipe.transform(proposedLimit ? proposedLimit : '');
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        this.totalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.loanAmountFigure) ?
            this.offerDocumentDetails.loanAmountFigure.ct : '';
        this.totalAmountInWord = (this.offerDocumentDetails && this.offerDocumentDetails.loanAmountFigureWords) ?
            this.offerDocumentDetails.loanAmountFigureWords.ct : '';
      }
    }
  }
  setApprovalDate() {
    let approvalDate;
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
      const dateOfApproval = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
      if (dateOfApproval === 'AD') {
        approvalDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.ct : '';
      } else {
        approvalDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.ct : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
      const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        approvalDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
      } else {
        approvalDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
      approvalDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
      const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        const templateDateApproval = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.en : '';
        approvalDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateApproval), true);
      } else {
        const templateDateApproval = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.en : '';
        approvalDate = templateDateApproval ? templateDateApproval.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.smeGlobalForm) {
      const dateOfApprovalType = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType ?
          this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType : '';
      if (dateOfApprovalType === 'AD') {
        const templateDateApproval = this.offerDocumentDetails.smeGlobalForm.dateOfApproval ?
            this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT : '';
        approvalDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateApproval), true);
      } else {
        const templateDateApproval = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali ?
            this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali : '';
        approvalDate = templateDateApproval ? templateDateApproval.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
      const sanctionLetterDate = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
      if (sanctionLetterDate === 'AD') {
        const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.en : '';
        approvalDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateSanctionDate), true);
      } else {
        const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.en : '';
        approvalDate = templateDateSanctionDate ? templateDateSanctionDate.nDate : '';
      }
    }
    return approvalDate ? approvalDate : '';
  }

  submit() {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        // cadFile.initialInformation = JSON.stringify(this.powerOfAttorneyCompanyForm.value);
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.powerOfAttorneyCompanyForm.value);
      cadFile.supportedInformation = this.setFreeText();
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.dialogRef.close();
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
      this.spinner = false;
    });
  }
}
