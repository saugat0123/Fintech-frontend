import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {DatePipe} from "@angular/common";
import {EngNepDatePipe} from "nepali-patro";
import {HomeLoanType} from '../../../cad-view/cad-constant/home-loan-type';

@Component({
  selector: 'app-home-loan',
  templateUrl: './home-loan.component.html',
  styleUrls: ['./home-loan.component.scss']
})
export class HomeLoanComponent implements OnInit {
  form: FormGroup;
  existingOfferLetter = false;
  initialInfoPrint;
  spinner = false;
  nepaliNumber = new NepaliNumberAndWords();
  nepaliAmount = [];
  finalNepaliWord = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterDocument: OfferDocument;
  selectedArray = [];
  ckeConfig = NepaliEditor.CK_CONFIG;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() preview;
  nepData;
  external = [];
  loanHolderInfo;
  tempData;
  guarantorData;
  offerDocumentDetails;
  allguarantorNames;
  guarantorNames: Array<String> = [];
  offerLetterData;
  selectedSecurity;
  finalName;
  loanLimit;
  afterSave = false;
  landbuilding;
  homeLoanType = HomeLoanType;
  nepaliBranchName;
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
              private datePipe: DatePipe,
              private engNepDatePipe: EngNepDatePipe,
              private ref: NbDialogRef<HomeLoanComponent>) { }

  ngOnInit() {
    this.buildPersonal();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.nepaliBranchName = this.cadOfferLetterApprovedDoc.loanHolder.branch.nepaliName + 'मा';
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      console.log('this.tempData', this.tempData);
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      // tslint:disable-next-line:max-line-length
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    if (this.tempData.loanType === this.homeLoanType.PURCHASE || this.tempData.loanType === this.homeLoanType.TAKE_OVER) {
      this.landbuilding = this.tempData.loan.landBuildingType;
    }
    console.log('Selected Data:', this.cadOfferLetterApprovedDoc);
    console.log('All Data:', this.tempData);
    console.log('Loan Holder initial data:', this.loanHolderInfo);
    this.checkOfferLetterData();
    this.guarantorDetails();
  }

  buildPersonal() {
    let refNumberAuto;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      refNumberAuto = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    this.form = this.formBuilder.group({
      referenceNumber: [refNumberAuto ? refNumberAuto : undefined],
      loanLimitChecked: [undefined],
      dateofApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
        dateofApplication: [undefined],
      loanCommitmentFee: [undefined],
      loanAmountInWords: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanadminFee: [undefined],
      loanadminFeeWords: [undefined],
      dateofExpiry: [undefined],
      ownerName: [undefined],
      additionalDetails: [undefined],
      ownersAddress: [undefined],
      propertyPlotNumber: [undefined],
      beneficiaryName: [undefined],
      freeText: [undefined],
      propertyArea: [undefined],
      branchName: [undefined],
      nameofCompanyCustomerWorking: [undefined],
      nameofGuarantors: [undefined],
      guaranteedamountinFigure: [undefined],
      guaranteedamountinWords: [undefined],
      insuranceAmountinFigure: [undefined],
      relationshipofficerName: [undefined],
      additionalGuarantorDetails: [undefined],
      district: [undefined],
      branchManager: [undefined],
      wardNum: [undefined],
      witnessName: [undefined],
      staffName: [undefined],
      distressSituationPercentage: [undefined],
      EMIAmount: [undefined],
      EMIAmountInWord: [undefined],
      equatedMonth: [undefined],
      guaranteeAmount: [undefined],
      loanAmountinFigure: [undefined],
      loanAmountinWord: [undefined],
      lateFee: [undefined],
      loanAmount: [undefined],
      insuranceAmount: [undefined],
      insuranceAmountinWord: [undefined],
      guarantorName: [undefined],
      seatNumber: [undefined],
      guarantorAmount: [undefined],
      guarantorAmountinWord: [undefined],
      dateofSignature: [undefined],
      municipalityVDC: [undefined],
      nameOfBank: [undefined],
      moratoriumPeriodInMonth: [undefined],
      purposeOfLoan: [undefined],
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
    console.log('Check Offer Data works:');
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.HOME_LOAN).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.HOME_LOAN);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
          this.offerLetterData = this.offerLetterDocument;
          this.form.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
        }
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.pointInformation)) {
          this.offerLetterData = this.offerLetterDocument;
          this.form.get('additionalDetails').patchValue(this.offerLetterData.pointInformation);
        }
        this.initialInfoPrint = initialInfo;
        this.loanLimit = this.tempData.loan.loanLimitChecked;
        this.existingOfferLetter = true;
        this.initialInfoPrint = initialInfo;
        this.fillForm();
      }
    } else {
      this.fillForm();
    }
  }


  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
    this.form.get('loanLimitChecked').patchValue(this.loanLimit);
    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.HOME_LOAN).toString()) {
          offerLetterPath.supportedInformation = this.form.get('additionalGuarantorDetails').value;
          offerLetterPath.pointInformation= this.form.get('additionalDetails').value;
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.HOME_LOAN);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      offerDocument.supportedInformation = this.form.get('additionalGuarantorDetails').value;
      offerDocument.pointInformation = this.form.get('additionalDetails').value;
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
  fillForm() {
    const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
    const customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
        this.loanHolderInfo.permanentWard.ct + ', ' +
        this.loanHolderInfo.permanentDistrict.ct + ' ,' + this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ';
    const loanAmount = this.engToNepNumberPipe.transform(proposalData.proposedLimit);
    let totalLoanAmount = 0;
    this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
      const val = value.proposal.proposedLimit;
      totalLoanAmount = totalLoanAmount + val;
    });
    let dateOfApprovalTemp;
    if (!ObjectUtil.isEmpty(this.initialInfoPrint.loan.dateOfApproval)) {
      dateOfApprovalTemp = this.engNepDatePipe.transform(this.datePipe.transform(this.tempData.loan.dateOfApproval), true);
    } else {
      dateOfApprovalTemp = this.initialInfoPrint.loan.dateOfApprovalCT;
    }
    let tempDateOfApplication;
    if (!ObjectUtil.isEmpty(this.initialInfoPrint.loan.dateOfApplication)) {
      tempDateOfApplication = this.engNepDatePipe.transform(this.datePipe.transform(this.tempData.loan.dateOfApplication), true);
    } else {
      tempDateOfApplication = this.initialInfoPrint.loan.dateOfApplicationCT;
    }
    this.selectedSecurity = this.tempData.loan.landBuildingType ? this.tempData.loan.landBuildingType : '';
    this.form.patchValue({
      dateofApproval: dateOfApprovalTemp ? dateOfApprovalTemp : '',
      customerName: this.loanHolderInfo.name.ct ? this.loanHolderInfo.name.ct : '',
      dateofApplication: tempDateOfApplication ? tempDateOfApplication : '',
      ownerName: this.tempData.loan.nameOfLandOwnerCT ? this.tempData.loan.nameOfLandOwnerCT : '',
      ownersAddress: this.tempData.loan.landLocationCT ? this.tempData.loan.landLocationCT : '',
      propertyPlotNumber: this.tempData.loan.kittaNumberCT ? this.tempData.loan.kittaNumberCT : '',
      propertyArea: (this.tempData.loan.areaCT) ? (this.tempData.loan.areaCT) : ((this.tempData.loan.areasCT) ? (this.tempData.loan.areasCT) : ('')),
      branchName: this.loanHolderInfo.branch.ct ? this.loanHolderInfo.branch.ct : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmountinFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      loanAmount: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      loanAmountInWords: this.nepaliCurrencyWordPipe.transform(totalLoanAmount),
      distressSituationPercentage: this.tempData.loan.drawingPowerCT ? this.tempData.loan.drawingPowerCT : '',
      baseRate: this.tempData.loan.baseRateCT ? this.tempData.loan.baseRateCT : '',
      premiumRate: this.tempData.loan.premiumRateCT ? this.tempData.loan.premiumRateCT : '',
      yearlyInterestRate: this.tempData.loan.interestRateCT ? this.tempData.loan.interestRateCT : '',
      EMIAmount: this.tempData.loan.emiInFigureCT ? this.tempData.loan.emiInFigureCT : '',
      EMIAmountInWord: this.tempData.loan.emiInWordCT ? this.tempData.loan.emiInWordCT : '',
      equatedMonth: this.tempData.loan.loanPeriodInMonthsCT ? this.tempData.loan.loanPeriodInMonthsCT : '',
      loanadminFee: this.tempData.loan.loanAdminFeeInFigureCT ? this.tempData.loan.loanAdminFeeInFigureCT : '',
      loanadminFeeWords: this.tempData.loan.loanAdminFeeInWordCT ? this.tempData.loan.loanAdminFeeInWordCT : '',
      beneficiaryName: this.tempData.loan.beneficiaryNameCT ? this.tempData.loan.beneficiaryNameCT : '',
      loanCommitmentFee: this.tempData.loan.loanCommitmentFeeCT ? this.tempData.loan.loanCommitmentFeeCT : '',
      insuranceAmount: this.tempData.loan.insuranceAmountInFigureCT ? this.tempData.loan.insuranceAmountInFigureCT : '',
      insuranceAmountinWord: this.tempData.loan.insuranceAmountInWordCT ? this.tempData.loan.insuranceAmountInWordCT : '',
      seatNumber: this.tempData.loan.seatNumberCT ? this.tempData.loan.seatNumberCT : '',
      relationshipofficerName: this.tempData.loan.nameOfRelationshipOfficerCT ? this.tempData.loan.nameOfRelationshipOfficerCT : '',
      branchManager: this.tempData.loan.nameOfBranchManagerCT ? this.tempData.loan.nameOfBranchManagerCT : '',
      nameOfBank: this.tempData.loan.nameOfBankCT ? this.tempData.loan.nameOfBankCT : '',
      moratoriumPeriodInMonth: this.tempData.loan.moratoriumPeriodInMonthCT ? this.tempData.loan.moratoriumPeriodInMonthCT : '',
      purposeOfLoan: this.tempData.loan.purposeOfLoanCT ? this.tempData.loan.purposeOfLoanCT : '',
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
  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      let temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1 ; i++) {
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' , ');
      let temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName =  this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
    }
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
  close() {
    this.ref.close();
  }
  dateConversion(controlVal) {
    let dateTemp;
    if (!ObjectUtil.isEmpty(controlVal.en)) {
      if (!ObjectUtil.isEmpty(controlVal.en.nDate)) {
        dateTemp = controlVal.en.nDate;
      } else {
        const date = this.datePipe.transform(controlVal.en);
        dateTemp = this.engNepDatePipe.transform(date, true);
      }
    }
    return dateTemp;
  }
}
