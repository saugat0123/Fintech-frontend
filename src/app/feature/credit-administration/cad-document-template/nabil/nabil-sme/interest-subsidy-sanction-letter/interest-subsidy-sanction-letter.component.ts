import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-interest-subsidy-sanction-letter',
  templateUrl: './interest-subsidy-sanction-letter.component.html',
  styleUrls: ['./interest-subsidy-sanction-letter.component.scss']
})
export class InterestSubsidySanctionLetterComponent implements OnInit {
  form: FormGroup;
  // todo replace enum constant string compare
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  nepaliNumber = new NepaliNumberAndWords();
  nepaliAmount = [];
  finalNepaliWord = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterDocument: OfferDocument;
  selectedArray = [];
  ckeConfig = NepaliEditor.CK_CONFIG;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() preview;
  @Input() letter: any;
  @Input() security: any;
  @Input() renewal: any;
  @Input() offerData;
  // @Input() loanLimit;
  guarantorData;
  nepData;
  external = [];
  loanHolderInfo;
  tempData;
  offerLetterData;
  afterSave = false;
  // selectedSecurity;
  offerDocumentDetails;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  finalName;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private ref: NbDialogRef<InterestSubsidySanctionLetterComponent>,
              private engToNepaliDate: EngNepDatePipe,
              public datePipe: DatePipe) {
  }

  ngOnInit() {
    console.log('Offer Letter Details for Home Loan', this.cadOfferLetterApprovedDoc);
    this.buildSanction();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    console.log('Selected Data:', this.cadOfferLetterApprovedDoc);
    console.log('All Data:', this.tempData);
    console.log('Loan Holder initial data:', this.loanHolderInfo);
    this.checkOfferLetterData();
    this.guarantorDetails();
  }

  buildSanction() {
    this.form = this.formBuilder.group({
      referenceNumber: [undefined],
      dateOfApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateOfApplication: [undefined],
      previousSanctionLetter: [undefined],
      requestLetterDate: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      marginInPercentage: [undefined],
      totalLimitFigure: [undefined],
      totalLimitWords: [undefined],
      baseRate: [undefined],
      totalAmountInWords: [undefined],
      totalAmountInFigure: [undefined],
      additionalGuarantorDetails: [undefined],
      premiumRate: [undefined],
      totalInterestRate: [undefined],
      totalTenureOfLoan: [undefined],
      ratePerNrb: [undefined],
      branchName: [undefined],
      amountInFigure: [undefined],
      guarantorName: [undefined],
      relationshipofficerName: [undefined],
      nameOfBranchManager: [undefined],
    });
  }
  setLoanConfigData(data: any) {
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
    this.form.patchValue({
      customerName: data.name ? data.name : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmount: cadNepData.numberNepali,
      loanNameInWords: cadNepData.nepaliWords,
    });
  }
  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.INTEREST_SUBSIDY_SANCTION_LETTER).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.INTEREST_SUBSIDY_SANCTION_LETTER);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        console.log('Selected Security Details:', initialInfo);
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
          this.offerLetterData = this.offerLetterDocument;
          this.form.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
        }
        // this.selectedSecurity = initialInfo.selectedSecurity.en;
        // this.loanLimit = initialInfo.loanLimitChecked.en;
        // this.renewal = initialInfo.renewalChecked.en;
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
    console.log('FIll Form works');
    const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
    const customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
        this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct + ' ,' +
        this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ';
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
    // For date of Approval
    const dateOfApprovalType = this.initialInfoPrint.dateOfApprovalType ? this.initialInfoPrint.dateOfApprovalType.en : '';
    let finalDateOfApproval;
    if (dateOfApprovalType === 'AD') {
      const templateDateApproval = this.initialInfoPrint.dateOfApproval ? this.initialInfoPrint.dateOfApproval.en : '';
      finalDateOfApproval = this.engToNepaliDate.transform(this.datePipe.transform(templateDateApproval), true);
    } else {
      const templateDateApproval = this.initialInfoPrint.dateOfApprovalNepali ? this.initialInfoPrint.dateOfApprovalNepali.en : '';
      finalDateOfApproval = templateDateApproval ? templateDateApproval.nDate : '';
    }
    // For Date of Application:
    const dateOfApplication = this.initialInfoPrint.dateOfApplicationType ? this.initialInfoPrint.dateOfApplicationType.en : '';
    let finalDateOfApplication;
    if (dateOfApplication === 'AD') {
      const templateDateApplication = this.initialInfoPrint.dateOfApplication ? this.initialInfoPrint.dateOfApplication.en : '';
      finalDateOfApplication = this.engToNepaliDate.transform(this.datePipe.transform(templateDateApplication), true);
    } else {
      const templateDateApplication = this.initialInfoPrint.dateOfApplicationNepali ? this.initialInfoPrint.dateOfApplicationNepali.en : '';
      finalDateOfApplication = templateDateApplication ? templateDateApplication.nDate : '';
    }
    // For Sanction Letter Date:
    const sanctionLetterDate = this.initialInfoPrint.previousSanctionType ? this.initialInfoPrint.previousSanctionType.en : '';
    let finalSanctionDate;
    if (sanctionLetterDate === 'AD') {
      const templateSanctionDate = this.initialInfoPrint.previousSanctionDate ? this.initialInfoPrint.previousSanctionDate.en : '';
      finalSanctionDate = this.engToNepaliDate.transform(this.datePipe.transform(templateSanctionDate), true);
    } else {
      const templateSanctionDate = this.initialInfoPrint.previousSanctionDateNepali ? this.initialInfoPrint.previousSanctionDateNepali.en : '';
      finalSanctionDate = templateSanctionDate ? templateSanctionDate.nDate : '';
    }
    this.form.patchValue({
      customerName: this.loanHolderInfo.name ? this.loanHolderInfo.name.ct : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmountInFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      loanAmountInWords: this.nepaliCurrencyWordPipe.transform(totalLoanAmount),
      amountInFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      // guarantorName: this.loanHolderInfo.guarantorDetails[0].guarantorName.np,
      referenceNumber: autoRefNumber ? autoRefNumber : '',
      dateOfApproval: finalDateOfApproval ? finalDateOfApproval : '',
      baseRate: this.tempData.baseRate ? this.tempData.baseRate.ct : '',
      premiumRate: this.tempData.premiumRate ? this.tempData.premiumRate.ct : '',
      previousSanctionLetter: finalSanctionDate ? finalSanctionDate : '',
      totalInterestRate: this.tempData.interestRate ? this.tempData.interestRate.ct : '',
      marginInPercentage: this.tempData.marginInPercentage ? this.tempData.marginInPercentage.ct : '',
      totalLimitFigure: this.tempData.totalLimitFigure ? this.tempData.totalLimitFigure.ct : '',
      totalLimitWords: this.tempData.totalLimitWords ? this.tempData.totalLimitWords.ct : '',
      totalTenureOfLoan: this.tempData.totalTenureOfLoan ? this.tempData.totalTenureOfLoan.ct : '',
      ratePerNrb: this.tempData.circularRate ? this.tempData.circularRate.ct : '',
       // relationshipofficerName: this.tempData.relationshipofficerName.ct ? this.tempData.relationshipofficerName.ct : '',
      nameOfBranchManager: this.tempData.nameOfBranchManager ? this.tempData.nameOfBranchManager.ct : '',
      branchName : this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
      // insuranceAmountinFigure : this.tempData.insuranceAmountinFigure.ct ? this.tempData.insuranceAmountinFigure.ct : '',
      dateOfApplication : finalDateOfApplication ? finalDateOfApplication : '',
    });
  }
  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    // this.form.get('selectedSecurity').patchValue(this.selectedSecurity);
    // this.form.get('loanLimitChecked').patchValue(this.loanLimit);
    // this.form.get('renewalChecked').patchValue(this.renewal);

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.INTEREST_SUBSIDY_SANCTION_LETTER)
            .toString()) {
          offerLetterPath.supportedInformation = this.form.get('additionalGuarantorDetails').value;
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.INTEREST_SUBSIDY_SANCTION_LETTER);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      offerDocument.supportedInformation = this.form.get('additionalGuarantorDetails').value;
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
  calcYearlyRate() {
    const baseRate = this.nepToEngNumberPipe.transform(this.form.get('baseRate').value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.form.get('premiumRate').value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.form.get('yearlyInterestRate').patchValue(asd);
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  close() {
    this.ref.close();
  }

  guarantorParse(nepData, key, trans?) {
    const data = JSON.parse(nepData);
    try {
      if (ObjectUtil.isEmpty(trans)) {
        return data[key].ct;
      } else {
        return data[key].en;
      }
    } catch (exp) {
      console.log(exp);
    }
  }
  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      let temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++){
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1; i++) {
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(' , ');
      let temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName =  this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
    }
  }
}
