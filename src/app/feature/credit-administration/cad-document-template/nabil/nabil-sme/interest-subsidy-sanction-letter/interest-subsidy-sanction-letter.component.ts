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
  freeTextVal: any = {};
  guarantorNames: Array<String> = [];
  allguarantorNames;
  finalName;
  freeInformation: any;
  autoPopulate1 = 'सम्पर्क अधिकृत';
  autoPopulate2 = 'शाखा प्रबन्धक÷बरिष्ठ सम्पर्क प्रबन्धक';
  personalGuarantorsName: Array<any> = new Array<any>();
  guarantorParsed: Array<any> = new Array<any>();
  tempPersonalGuarantors;
  temp2;
  finalPersonalName;

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
    this.buildSanction();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      // tslint:disable-next-line:max-line-length
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    this.checkOfferLetterData();
    this.guarantorData.forEach(any => {
      this.guarantorParsed.push(JSON.parse(any.nepData));
    });
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
      marginInPercentageMotor: [undefined],
      marginInPercentageFoot: [undefined],
      totalLimitFigure: [undefined],
      totalLimitWords: [undefined],
      baseRate: [undefined],
      totalAmountInWords: [undefined],
      totalAmountInFigure: [undefined],
      // additionalGuarantorDetails: [undefined],
      premiumRate: [undefined],
      totalInterestRate: [undefined],
      totalTenureOfLoan: [undefined],
      ratePerNrb: [undefined],
      branchName: [undefined],
      amountInFigure: [undefined],
      guarantorName: [undefined],
      relationshipOfficerName: [undefined],
      nameOfBranchManager: [undefined],
      firstAdditionalDetails: [undefined],
      secondAdditionalDetails: [undefined],
      thirdAdditionalDetails: [undefined],
      fourthAdditionalDetails: [undefined],
      autoPopulate1: [undefined],
      autoPopulate2: [undefined],
      purposeOfLoan: [undefined],
      loanSubType: [undefined],
      loanSubTypeEn: [undefined]
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
    /*this.loanHolderInfo.registeredMunicipality.ct + '-' +
    this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct + ' ,' +
    this.loanHolderInfo.registeredProvince.ct;*/
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
    const customerAddress = this.loanHolderInfo.registeredMunicipality.ct + '-' +
        this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct + ' ,' +
        this.loanHolderInfo.registeredProvince.ct;
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
    this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
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
      loanSubType: this.tempData.loanSubType ? this.tempData.loanSubType.ct : '',
      loanSubTypeEn: this.tempData.loanSubType ? this.tempData.loanSubType.en.eData : '',
      previousSanctionLetter: finalSanctionDate ? finalSanctionDate : '',
      totalInterestRate: this.tempData.interestRate ? this.tempData.interestRate.ct : '',
      marginInPercentage: this.tempData.marginInPercentage ? this.tempData.marginInPercentage.ct : '',
      marginInPercentageMotor: this.tempData.marginInPercentageMotor ? this.tempData.marginInPercentageMotor.ct : '',
      marginInPercentageFoot: this.tempData.marginInPercentageFoot ? this.tempData.marginInPercentageFoot.ct : '',
      totalLimitFigure: this.tempData.totalLimitFigure ? this.tempData.totalLimitFigure.ct : '',
      totalLimitWords: this.tempData.totalLimitWords ? this.tempData.totalLimitWords.ct : '',
      totalTenureOfLoan: this.tempData.totalTenureOfLoan ? this.tempData.totalTenureOfLoan.ct : '',
      ratePerNrb: this.tempData.circularRate ? this.tempData.circularRate.ct : '',
      relationshipOfficerName: this.tempData.nameOfStaff ? this.tempData.nameOfStaff.ct : '',
      nameOfBranchManager: this.tempData.nameOfBranchManager ? this.tempData.nameOfBranchManager.ct : '',
      branchName : this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
      purposeOfLoan : this.tempData.purposeOfLoan ? this.tempData.purposeOfLoan.ct : '',
      // insuranceAmountinFigure : this.tempData.insuranceAmountinFigure.ct ? this.tempData.insuranceAmountinFigure.ct : '',
      dateOfApplication : finalDateOfApplication ? finalDateOfApplication : '',
      firstAdditionalDetails : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.firstText : '',
      secondAdditionalDetails : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.secondText : '',
      thirdAdditionalDetails : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.thirdText : '',
      fourthAdditionalDetails : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.fourthText : '',
      autoPopulate1: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.autoPopulate1 : '',
      autoPopulate2: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.autoPopulate2 : '',

    });
  }
  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.INTEREST_SUBSIDY_SANCTION_LETTER)
            .toString()) {
          this.setFreeText();
          offerLetterPath.supportedInformation = JSON.stringify(this.freeTextVal);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.INTEREST_SUBSIDY_SANCTION_LETTER);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      this.setFreeText();
      offerDocument.supportedInformation = JSON.stringify(this.freeTextVal);
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
  setFreeText() {
    this.freeTextVal = {
      firstText: this.form.get('firstAdditionalDetails').value,
      secondText: this.form.get('secondAdditionalDetails').value,
      thirdText: this.form.get('thirdAdditionalDetails').value,
      fourthText: this.form.get('fourthAdditionalDetails').value,
      autoPopulate1: this.form.get('autoPopulate1').value,
      autoPopulate2: this.form.get('autoPopulate2').value,
    };
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

  guarantorDetails() {
    this.tempPersonalGuarantors = this.guarantorParsed.filter(val =>
        val.guarantorType.en === 'Personal Guarantor');
    this.tempPersonalGuarantors.forEach(i => {
      this.personalGuarantorsName.push(i.guarantorName ? i.guarantorName.ct : '');
    })
  }

  commonGuarantorDetails(guarantorName, finalName) {
    if(guarantorName.length === 1) {
      finalName = guarantorName[0];
    }
    if(guarantorName.length === 2) {
      finalName = guarantorName.join(' र ');
    }
    if(guarantorName.length > 2){
      for (let i = 0; i < guarantorName.length - 1; i++) {
        this.temp2 = guarantorName.join(' , ');
      }
      const temp1 = guarantorName[guarantorName.length - 1];
      finalName = this.temp2 + ' र ' + temp1;
    }
    return finalName ? finalName : '';
  }

  guarantorParse(nepData, key, trans?) {
    const data = JSON.parse(nepData);
    if (ObjectUtil.isEmpty(trans)) {
      return data[key].ct;
    } else {
      return data[key].en;
    }
  }
}
