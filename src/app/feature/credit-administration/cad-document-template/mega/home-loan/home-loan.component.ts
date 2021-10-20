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
  offerLetterData;
  selectedSecurity;
  loanLimit;
  afterSave = false;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private ref: NbDialogRef<HomeLoanComponent>) { }

  ngOnInit() {
    console.log('Offer Letter Details for Home Loan', this.cadOfferLetterApprovedDoc);
    this.buildPersonal();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      // tslint:disable-next-line:max-line-length
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    console.log('Selected Data:', this.cadOfferLetterApprovedDoc);
    console.log('All Data:', this.tempData);
    console.log('Loan Holder initial data:', this.loanHolderInfo);
    this.checkOfferLetterData();    }

  buildPersonal() {
    this.form = this.formBuilder.group({
      referenceNumber: [undefined],
      dateofApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
        dateofApplication: [undefined],
      nameoftheVehicle: [undefined],
      loanCommitmentFee: [undefined],
      loanAmountInWords: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanadminFee: [undefined],
      loanadminFeeWords: [undefined],
      dateofExpiry: [undefined],
      ownerName: [undefined],
      additionalDetail: [undefined],
      ownersAddress: [undefined],
      propertyPlotNumber: [undefined],
      freeText: [undefined],
      propertyArea: [undefined],
      nameofBranch: [undefined],
      nameofCompanyCustomerWorking: [undefined],
      nameofGuarantors: [undefined],
      guaranteedamountinFigure: [undefined],
      guaranteedamountinWords: [undefined],
      insuranceAmountinFigure: [undefined],
      relationshipofficerName: [undefined],
      branchName: [undefined],
      additionalGuarantorDetails: [undefined],
      district: [undefined],
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
        console.log('If condition works:');
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.HOME_LOAN);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
          this.offerLetterData = this.offerLetterDocument;
          this.form.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
        }
        this.initialInfoPrint = initialInfo;
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
    this.form.get('selectedSecurity').patchValue(this.selectedSecurity);

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.HOME_LOAN).toString()) {
          offerLetterPath.supportedInformation = this.form.get('additionalGuarantorDetails').value;
          offerLetterPath.pointInformation = this.form.get('additionalDetails').value;
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
    console.log('Fill form works:');
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
    this.form.patchValue({
      referenceNumber: this.tempData.loan.referenceNumberCT ? this.tempData.loan.referenceNumberCT : '',
      dateofApproval: this.tempData.loan.dateOfApprovalCT ? this.tempData.dateOfApprovalCT : '',
      dateOfApplication: this.tempData.loan.dateOfApplicationCT ? this.tempData.dateOfApplicationCT : '',
      freeTextRequired: this.tempData.loan.freeTextRequiredCT ? this.tempData.freeTextRequiredCT : '',
      // customerName: this.loanHolderInfo.name.ct ? this.loanHolderInfo.name.ct : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmountInFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      loanAmountInWords: this.nepaliCurrencyWordPipe.transform(totalLoanAmount),
      // drawingPowerRate: this.tempData.drawingPower.ct ? this.tempData.drawingPower.ct : '',
      baseRate: this.tempData.baseRateCT ? this.tempData.baseRateCT : '',
      premiumRate: this.tempData.premiumRateCT ? this.tempData.premiumRateCT : '',
      // yearlyLoanRate: this.tempData.interestRate.ct ? this.tempData.interestRate.ct : '',
      // emiAmountInFigure: this.tempData.emiInFigure.ct ? this.tempData.emiInFigure.ct : '',
      // emiAmountInWords: this.tempData.emiInWords.ct ? this.tempData.emiInWords.ct : '',
      // loanPeriod: this.tempData.loanPeriod.ct ? this.tempData.loanPeriod.ct : '',
      loanAdminFeeInFigure: this.tempData.loanAdminFeeInFigureCT ? this.tempData.loanAdminFeeInFigureCT : '',
      loanAdminFeeInWords: this.tempData.loanAdminFeeInWordCT ? this.tempData.loanAdminFeeInWordCT : '',
      loanCommitmentFee: this.tempData.loanCommitmentFeeCT ? this.tempData.loanCommitmentFeeCT : '',
      // branchName: this.loanHolderInfo.branch.ct ? this.loanHolderInfo.branch.ct : '',
      insuranceAmount: this.tempData.insuranceAmountInFigureCT ? this.tempData.insuranceAmountInFigureCT : '',
      insuranceAmountinWord: this.tempData.insuranceAmountInWordCT ? this.tempData.insuranceAmountInWordCT : '',
      seatNumber: this.tempData.seatNumberCT ? this.tempData.seatNumberCT : '',
      // relationshipOfficerName: this.tempData.relationshipOfficerName.ct ? this.tempData.relationshipOfficerName.ct : '',
      // branchManager: this.tempData.branchManagerName.ct ? this.tempData.branchManagerName.ct : '',

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
}
