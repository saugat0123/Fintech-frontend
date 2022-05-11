import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-personal-loan',
  templateUrl: './personal-loan.component.html',
  styleUrls: ['./personal-loan.component.scss']
})
export class PersonalLoanComponent implements OnInit {
  personalLoan: FormGroup;
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  offerLetterConst = MegaOfferLetterConst;
  offerLetterDocument: OfferDocument;
  selectedArray = [];
  laiTermLoanSelected = false;
  editor = NepaliEditor.CK_CONFIG;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() preview;
  loanHolderInfo;
  tempData;
  afterSave = false;
  offerLetterData;
  guarantorData;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  guarantorAmount = 0;
  guarantorAmountNepali;
  finalName;
  loanLimit;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private routerUtilService: RouterUtilsService,
              private administrationService: CreditAdministrationService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private ref: NbDialogRef<PersonalLoanComponent>,
              private routerUtilsService: RouterUtilsService,
              private datePipe: DatePipe,
              private engNepDatePipe: EngNepDatePipe) {
  }

  ngOnInit(): void {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.guarantorDetails();
    this.checkOfferLetterData();
    console.log('Template loan holder Information', this.loanHolderInfo);

  }

  buildForm() {
    this.personalLoan = this.formBuilder.group({
      loanLimitChecked: [undefined],
      refNumber: [undefined],
      dateOfApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateofApplication: [undefined],
      purposeOfLoan: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyFloatingInterestRate: [undefined],
      loanAdminFee: [undefined],
      loanAdminFeeinWords: [undefined],
      emiAmount: [undefined],
      emiAmountWords: [undefined],
      loanPeriodInMonth: [undefined],
      companyName: [undefined],
      branchName: [undefined],
      accountNumber: [undefined],
      additionalGuarantorDetails: [undefined],
      relationshipOfficer: [undefined],
      managerName: [undefined],
      sakshiDistrict: [undefined],
      sakshiMunicipality: [undefined],
      sakshiWardNum: [undefined],
      sakshiName: [undefined],
      guarantorName: [undefined],
      guaranteedAmountFigure: [undefined]
    });
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.personalLoan.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.personalLoan.get(wordLabel).patchValue(returnVal);
  }

  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
          this.offerLetterData = this.offerLetterDocument;
          this.personalLoan.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
        }
        this.loanLimit = initialInfo.loanLimitChecked.en;
        this.initialInfoPrint = initialInfo;
        this.existingOfferLetter = true;
        this.selectedArray = initialInfo.loanTypeSelectedArray;
        this.fillForm();
        this.initialInfoPrint = initialInfo;
      }
    } else {
      this.fillForm();
    }
  }

  fillForm() {
    const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
    let customerAddress;
    if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
      customerAddress =  ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality) &&
              !ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality.ct)) ?
              this.loanHolderInfo.permanentMunicipality.ct : '') +
          ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard) &&
              !ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard.ct)) ?
              '-' + this.loanHolderInfo.permanentWard.ct : '') +
          ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict) &&
              !ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict.ct)) ?
              ', ' + this.loanHolderInfo.permanentDistrict.ct : '') +
          ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince) &&
              !ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince.ct)) ?
              ' ,' + this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ' : '');
    }
    const loanAmount = this.engToNepNumberPipe.transform(proposalData.proposedLimit);
    let totalLoanAmount = 0;
    this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
      const val = value.proposal.proposedLimit;
      totalLoanAmount = totalLoanAmount + val;
    });
    let autoRefNumber;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    const guarantorNep = JSON.parse(this.guarantorData[0].nepData);
    let guaranteedAmount;
    if (!ObjectUtil.isEmpty(guarantorNep.gurantedAmount)) {
      guaranteedAmount = guarantorNep.gurantedAmount.en;
    }
    let approvalDate;
    const approvalDateType = this.initialInfoPrint.dateOfApprovalType ? this.initialInfoPrint.dateOfApprovalType.en : '';
    if (approvalDateType === 'AD') {
      const finalApprDate = this.initialInfoPrint.dateOfApproval ? this.datePipe.transform(this.initialInfoPrint.dateOfApproval.en) : '';
      approvalDate = this.engNepDatePipe.transform(finalApprDate, true);
    } else {
      approvalDate = this.initialInfoPrint.dateOfApprovalNepali ? this.initialInfoPrint.dateOfApprovalNepali.en.nDate : '';
    }
    let applicationDate;
    const applicationDateType = this.initialInfoPrint.dateofApplicationType ? this.initialInfoPrint.dateofApplicationType.en : '';
    if (applicationDateType === 'AD') {
      const finalAppDate = this.initialInfoPrint.dateofApplication ? this.datePipe.transform(this.initialInfoPrint.dateofApplication.en) : '';
      applicationDate = this.engNepDatePipe.transform(finalAppDate, true);
    } else {
      applicationDate = this.initialInfoPrint.dateofApplicationNepali ? this.initialInfoPrint.dateofApplicationNepali.en.nDate : '';
    }
    this.personalLoan.patchValue({
      customerName: this.loanHolderInfo.name.ct ? this.loanHolderInfo.name.ct : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmount: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      loanAmountWords: this.nepaliCurrencyWordPipe.transform(totalLoanAmount),
      guarantorName: this.finalName ? this.finalName : '',
      guaranteedAmountFigure: guaranteedAmount ?  this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(guaranteedAmount)) : '',
      branchName: this.loanHolderInfo.branch.ct ? this.loanHolderInfo.branch.ct : '',
      baseRate: this.tempData.baseRate.ct ? this.tempData.baseRate.ct : '',
      premiumRate: this.tempData.premiumRate.ct ? this.tempData.premiumRate.ct : '',
      refNumber: autoRefNumber ? autoRefNumber : '',
      purposeOfLoan: this.tempData.purposeOfLoan.ct ? this.tempData.purposeOfLoan.ct : '',
      yearlyFloatingInterestRate: this.tempData.yearlyFloatingInterestRate.ct ? this.tempData.yearlyFloatingInterestRate.ct : '',
      loanAdminFee: this.tempData.loanAdminFee.ct ? this.tempData.loanAdminFee.ct : '',
      loanAdminFeeinWords: this.tempData.loanAdminFeeinWords.ct ? this.tempData.loanAdminFeeinWords.ct : '',
      emiAmount: this.tempData.emiAmount.ct ? this.tempData.emiAmount.ct : '',
      emiAmountWords: this.tempData.emiAmountWords.ct ? this.tempData.emiAmountWords.ct : '',
      loanPeriodInMonth: this.tempData.loanPeriodInMonth.ct ? this.tempData.loanPeriodInMonth.ct : '',
      companyName: this.tempData.companyName.ct ? this.tempData.companyName.ct : '',
      accountNumber: this.tempData.accountNumber.ct ? this.tempData.accountNumber.ct : '',
      // freeText: this.tempData.purposeOfLoan.ct ? this.tempData.purposeOfLoan.ct : '',
      relationshipOfficer: this.tempData.relationshipOfficer.ct ? this.tempData.relationshipOfficer.ct : '',
      managerName: this.tempData.managerName.ct ? this.tempData.managerName.ct : '',
      /*sakshiDistrict: this.tempData.sakshiDistrict.ct ? this.tempData.sakshiDistrict.ct : '',
      sakshiMunicipality: this.tempData.sakshiMunicipality.ct ? this.tempData.sakshiMunicipality.ct : '',
      sakshiWardNum: this.tempData.sakshiWardNum.ct ? this.tempData.sakshiWardNum.ct : '',
      sakshiName: this.tempData.sakshiName.ct ? this.tempData.sakshiName.ct : '',*/
      dateOfApproval: approvalDate ? approvalDate : '',
      dateofApplication: applicationDate ? applicationDate : '',
    });
    // this.retailProfessionalLoan.patchValue(this.loanHolderInfo);
  }

  setLoanConfigData(data) {
    let cadNepData = {
      numberNepali: ')',
      nepaliWords: 'सुन्य',
    };
    const customerAddress =
        data.permanentMunicipality + ' , ' +
        data.permanentWard + ' , ' +
        data.permanentProvince + ' , ' +
        data.permanentDistrict;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepData)) {
      cadNepData = JSON.parse(this.cadOfferLetterApprovedDoc.nepData);
    }
    this.personalLoan.patchValue({
      CustomerName: data.name ? data.name : '',
      CustomerAddress: customerAddress ? customerAddress : '',
      LoanAmount: cadNepData.numberNepali,
      LoanAmountWords: cadNepData.nepaliWords,
    });
  }

  calculateData(baseRateName, premiumRateName) {
    const baseRate = this.nepToEngNumberPipe.transform(this.personalLoan.get(baseRateName).value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.personalLoan.get(premiumRateName).value);
    const calculatedValue = parseFloat(baseRate) + parseFloat(premiumRate);
    const finalVal = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(calculatedValue));
    this.personalLoan.get('yearlyFloatingInterestRate').patchValue(finalVal);
  }

  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
    this.personalLoan.get('loanLimitChecked').patchValue(this.loanLimit);

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN)
        .toString()) {
          offerLetterPath.supportedInformation = this.personalLoan.get('additionalGuarantorDetails').value;
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN);
      offerDocument.initialInformation = JSON.stringify(this.personalLoan.value);
      offerDocument.supportedInformation = this.personalLoan.get('additionalGuarantorDetails').value;
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.afterSave = true;
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.afterSave = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }

  close() {
    this.ref.close();
  }

  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      const temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(' , ');
      const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName =  this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
    }
  }
}
