import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";
import {OfferDocument} from "../../../model/OfferDocument";
import {CadDocStatus} from "../../../model/CadDocStatus";
import {Alert, AlertType} from "../../../../../@theme/model/Alert";
import {MegaOfferLetterConst} from "../../../mega-offer-letter-const";
import {CustomerApprovedLoanCadDocumentation} from "../../../model/customerApprovedLoanCadDocumentation";
import {Router} from "@angular/router";
import {ToastService} from "../../../../../@core/utils";
import {RouterUtilsService} from "../../../utils/router-utils.service";
import {CreditAdministrationService} from "../../../service/credit-administration.service";
import {NbDialogRef} from "@nebular/theme";
import {CadOfferLetterModalComponent} from "../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component";
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';

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
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private routerUtilService: RouterUtilsService,
              private administrationService: CreditAdministrationService,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>) { }

  ngOnInit(): void {
    this.buildForm();
    this.checkOfferLetterData();
  }
  buildForm() {
    this.retailLoanAgainstInsurance = this.formBuilder.group({
      refNo: [undefined],
      offerLetterDate: [undefined],
      borrowerName: [undefined],
      borrowerAddress: [undefined],
      borrowerContactNo: [undefined],
      insuranceCompanyName: [undefined],
      borrowerInsuranceNo: [undefined],
      pageCount: [undefined],
      identityCardNo: [undefined],
      identityCardNo1: [undefined],
      borrowerName3: [undefined],
      offerLetterDate2: [undefined],

      loanTypeSelectedArray: [undefined],

      laiTermLoanArray: this.formBuilder.array([this.buildTermLoan()]),
      laiOverDraftLoanArray: this.formBuilder.array([this.buildOverDraftLoanGroup()]),
      laiDemandLoanArray: this.formBuilder.array([this.buildDemandLoanGroup()]),
      note: this.note,
    });
  }

  buildTermLoan() {
    return this.formBuilder.group({
      termLoanDebitLimitAmount: [undefined],
      tenure: [undefined],
      termLoanDebitLimitAmountWord: [undefined],
      termLoanPurpose: [undefined],
      termBaseRate: [undefined],
      termLoanPaymentDate: [undefined],
      termLoanPremiumRate: [undefined],
      termLoanYearlyInterest: [undefined],
      termLoanFirstInstallment: [undefined],
      termLoanInstallmentRate: [undefined],
      termLoanInstallmentRateWords: [undefined],
      termLoanServiceChargeRate: [undefined],
      termLoanServiceChargeRateWords: [undefined],
      termLoanCustomAmount: [undefined],
      chargeAmountFlag: [true],
    });
  }

  buildOverDraftLoanGroup() {
    return this.formBuilder.group({
      overdraftDebitLimitAmount: [undefined],
      overdraftDebitLimitAmountWords: [undefined],
      overdraftPurpose: [undefined],
      overdraftTimePeriod: [undefined],
      overdraftBaseRate: [undefined],
      overdraftPremiumRate: [undefined],
      overdraftYearlyInterest: [undefined],
      overdraftServiceChargeRate: [undefined],
      overdraftServiceChargeRateWords: [undefined],
      overdraftCustomAmount: [undefined],
      chargeAmountFlag: [true],
    });
  }

  buildDemandLoanGroup() {
    return this.formBuilder.group({
      demandLimitAmount: [undefined],
      demandLimitAmountWord: [undefined],
      premiumAadharRate: [undefined],
      demandLoanPremiumRate: [undefined],
      demandLoanPremiumRateWords: [undefined],
      demandLoanServiceChargeRate: [undefined],
      demandLoanServiceChargeRateWords: [undefined],
      demandLoanCustomAmount: [undefined],
      demandLoanPurpose: [undefined],
      demandTimePeriod: [undefined],
      chargeAmountFlag: [true],
    });
  }

  changeLoanType($event) {
    this.selectedArray = $event;
    $event.includes('LAI Term Loan') ? this.laiTermLoanSelected = true : this.laiTermLoanSelected = false;
    $event.includes('LAI Overdraft Loan') ? this.laiOverdraftLoanSelected = true : this.laiOverdraftLoanSelected = false;
    $event.includes('LAI Demand Loan') ? this.laiDemandLoanSelected = true : this.laiDemandLoanSelected = false;
  }

  removeOptionalField(formGroup, fieldControlName) {
    formGroup.get(fieldControlName).patchValue(false);
  }

  undoRemovalOfOptionalField(formGroup, fieldControlName) {
    formGroup.get(fieldControlName).patchValue(true);
  }

  addMoreLaiTermLoan() {
    (this.retailLoanAgainstInsurance.get('laiTermLoanArray') as FormArray).push(this.buildTermLoan());
  }

  removeLaiTermLoan(i) {
    (this.retailLoanAgainstInsurance.get('laiTermLoanArray') as FormArray).removeAt(i);
  }

  addMoreLaiOverdraftLoan() {
    (this.retailLoanAgainstInsurance.get('laiOverDraftLoanArray') as FormArray).push(this.buildOverDraftLoanGroup());
  }

  removeLaiOverDraftLoan(i) {
    (this.retailLoanAgainstInsurance.get('laiOverDraftLoanArray') as FormArray).removeAt(i);
  }

  addMoreLaiDemandLoan() {
    (this.retailLoanAgainstInsurance.get('laiDemandLoanArray') as FormArray).push(this.buildDemandLoanGroup());
  }

  removeLaiDemandLoan(i) {
    (this.retailLoanAgainstInsurance.get('laiDemandLoanArray') as FormArray).removeAt(i);
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

        this.selectedArray = initialInfo.loanTypeSelectedArray;
        this.changeLoanType(this.selectedArray);
        (this.retailLoanAgainstInsurance.get('laiTermLoanArray') as FormArray).clear();
        initialInfo.laiTermLoanArray.forEach( value => {
          (this.retailLoanAgainstInsurance.get('laiTermLoanArray') as FormArray).push(this.formBuilder.group(value));
        });

        (this.retailLoanAgainstInsurance.get('laiOverDraftLoanArray') as FormArray).clear();
        initialInfo.laiOverDraftLoanArray.forEach( value => {
          (this.retailLoanAgainstInsurance.get('laiOverDraftLoanArray') as FormArray).push(this.formBuilder.group(value));
        });

        (this.retailLoanAgainstInsurance.get('laiDemandLoanArray') as FormArray).clear();
        initialInfo.laiDemandLoanArray.forEach( value => {
          (this.retailLoanAgainstInsurance.get('laiDemandLoanArray') as FormArray).push(this.formBuilder.group(value));
        });
        this.initialInfoPrint = initialInfo;
      }
    }
  }


  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.RETAIL_LOAN_AGAINST_INSURANCE)
            .toString()) {
          this.retailLoanAgainstInsurance.get('loanTypeSelectedArray').patchValue(this.selectedArray);
          offerLetterPath.initialInformation = JSON.stringify(this.retailLoanAgainstInsurance.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_LOAN_AGAINST_INSURANCE);
      this.retailLoanAgainstInsurance.get('loanTypeSelectedArray').patchValue(this.selectedArray);
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
