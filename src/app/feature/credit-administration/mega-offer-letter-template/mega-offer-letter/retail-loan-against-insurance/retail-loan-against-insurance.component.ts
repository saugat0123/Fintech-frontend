import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../model/OfferDocument';
import {CadDocStatus} from '../../../model/CadDocStatus';
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

@Component({
  selector: 'app-retail-loan-against-insurance',
  templateUrl: './retail-loan-against-insurance.component.html',
  styleUrls: ['./retail-loan-against-insurance.component.scss']
})
export class RetailLoanAgainstInsuranceComponent implements OnInit {
  retailLoanAgainstInsurance: FormGroup;
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  offerLetterConst = MegaOfferLetterConst;
  offerLetterDocument: OfferDocument;

  selectedArray = [];
  loanTypeArray = ['LAI Term Loan', 'LAI Overdraft Loan', 'LAI Demand Loan' ];

  laiTermLoanSelected = false;
  laiOverdraftLoanSelected = false;
  laiDemandLoanSelected = false;
  editor = NepaliEditor.CK_CONFIG;
  note = '<ul><li><span style="font-family:Preeti">C0fL tyf JolQmutsf] ;DklQ v\'nfpg] lnvt -</span><span>Net Worth Statement<span style="font-family:Preeti">_ kmf]6f] tyf ;Dks{ 7]ufgf ;lxt k]z ug\'kg]{5 .</span></li>' +
      '<li><span style="font-family:Preeti">tcGo a}+sx?;+u u/]sf] sf/f]jf/ af/] lnlvt ?kdf v\'nfpg\'kg]{ -</span><span>Multiple Banking Declaration<span style="font-family:Preeti">_ k]z ug\'{kg]{5 .</span></li> ' +
      '<li><span style="font-family:Preeti">tpNn]lvt k|:tfljt crn ;DklQsf] k"0f{ d\'Nofªsg k|ltj]bg -</span><span>Complete Valuation Report<span style="font-family:Preeti">_ k]z ePkZrft dfq shf{ e\'Qmfg ul/g]5 .</span></li> </ul>';

  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  loanHolderInfo;
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
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>) { }

  ngOnInit(): void {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
    this.checkOfferLetterData();
  }
  buildForm() {
    this.retailLoanAgainstInsurance = this.formBuilder.group({
      dateofGeneration: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      applicationDateInAD: [undefined],
      LoanType: [undefined],
      LoanAmount: [undefined],
      LoanAmountWords: [undefined],
      drawingPowerRate: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyFloatingInterestRate: [undefined],
      serviceCharge: [undefined],
      serviceChargeWords: [undefined],
      communicationFee: [undefined],
      emiAmount: [undefined],
      emiAmountWords: [undefined],
      emiCount: [undefined],
      loanCommitmentFee: [undefined],
      ownersName : [undefined],
      ownersAddress: [undefined],
      propertyPlotNumber: [undefined],
      propertyArea: [undefined],
      sheetNumber: [undefined],
      GuarantorName: [undefined],
      changeFeeBelow1Cr: [undefined],
      changeFeeAbove1Cr: [undefined],
      collateralReleaseFee: [undefined],
      documentAccessFee: [undefined],
      promissoryNoteAmount : [undefined],
      loanDeedAmount : [undefined],
      pledgeAmount : [undefined],
      guarantorName1 : [undefined],
      guarantorAmount1 : [undefined],
      guarantorAmountWords1 : [undefined],
      signatureDate : [undefined],
      sakshiDistrict: [undefined],
      sakshiMunicipality: [undefined],
      sakshiWardNum: [undefined],
      sakshiName: [undefined],
      employeeName : [undefined]
    });
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.retailLoanAgainstInsurance.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.retailLoanAgainstInsurance.get(wordLabel).patchValue(returnVal);
  }

  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.RETAIL_LOAN_AGAINST_INSURANCE).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_LOAN_AGAINST_INSURANCE);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        this.initialInfoPrint = initialInfo;
        this.existingOfferLetter = true;
        this.retailLoanAgainstInsurance.patchValue(initialInfo, {emitEvent: false});
        this.initialInfoPrint = initialInfo;
      }
    } else {
      if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
        this.setLoanConfigData(this.loanHolderInfo);
      }
    }
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
    this.retailLoanAgainstInsurance.patchValue({
      CustomerName: data.name ? data.name : '',
      CustomerAddress: customerAddress ? customerAddress : '',
      LoanAmount: cadNepData.numberNepali,
      LoanAmountWords: cadNepData.nepaliWords,
    });
  }
  calculateData(baseRateName, premiumRateName) {
    const baseRate = this.nepToEngNumberPipe.transform(this.retailLoanAgainstInsurance.get(baseRateName).value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.retailLoanAgainstInsurance.get(premiumRateName).value);
    const calculatedValue = parseFloat(baseRate) + parseFloat(premiumRate);
    const finalVal = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(calculatedValue));
    this.retailLoanAgainstInsurance.get('yearlyFloatingInterestRate').patchValue(finalVal);
  }
  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.RETAIL_LOAN_AGAINST_INSURANCE)
            .toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.retailLoanAgainstInsurance.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_LOAN_AGAINST_INSURANCE);
      offerDocument.initialInformation = JSON.stringify(this.retailLoanAgainstInsurance.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Retail Loan Against Insurance Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save  Retail Loan Against Insurance Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }
}
