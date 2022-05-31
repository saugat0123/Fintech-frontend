import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-mortgage-term-loan',
  templateUrl: './mortgage-term-loan.component.html',
  styleUrls: ['./mortgage-term-loan.component.scss']
})
export class MortgageTermLoanComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() loanData;
  @Input() index;
  @Input() pointNumber;
  @Input() mortgageData;
  form: FormGroup;
  initialData;
  tempData;
  tempInformation;
  newEMIAutoPopulateMortgageTerm = "lgsf;f ePsf] kl5Nnf] dlxgf b]lv ls:tf e'QmfgL ldlt x'g]5";
  equityMortgageFreeText: Array <any> = new Array<any>();

  constructor(private formBuilder: FormBuilder, ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.initialData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
      this.tempInformation = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].supportedInformation);
      this.fillForm();
    }
    console.log('Temp Information:', this.tempInformation);
    /*this.setFreeTextMortgage();*/
  }

  buildForm() {
    this.form = this.formBuilder.group({
      // Mortgage Term Loan
      mortgageTermLoan: this.formBuilder.array([]),
    });
    this.setMortgageTermLoan();
  }
  setMortgageTermLoan() {
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.mortgageEquityTermForm) &&
        !ObjectUtil.isEmpty(this.initialData.mortgageEquityTermForm.mortgageTermFormArray)) {
      for (let a = 0; a < this.initialData.mortgageEquityTermForm.mortgageTermFormArray.length; a++) {
        (this.form.get('mortgageTermLoan') as FormArray).push(this.setMortgageTermLoanForm());
      }
    }
  }
  setMortgageTermLoanForm() {
    return this.formBuilder.group({
      SNOfParentLimitMortgageTerm: [undefined],
      drawingPowerMortgageTerm: [undefined],
      // For New EMI Term Loan
      newEMIBaseRateMortgageTerm: [undefined],
      newEMIPremiumRateMortgageTerm: [undefined],
      newEMIInterestRateMortgageTerm: [undefined],
      newEMIAmountMortgageTerm: [undefined],
      newEMIAmountInWordMortgageTerm: [undefined],
      newEMINoOfInstallmentMortgageTerm: [undefined],
      newEMIAutoPopulateMortgageTerm: ["lgsf;f ePsf] kl5Nnf] dlxgf b]lv ls:tf e'QmfgL ldlt x'g]5"],
      newEMILoanPurposeMortgageTerm: [undefined],
      newEMIServiceChargeMortgageTerm: [undefined],
      newEMILoanTenureMortgageTerm: [undefined],
      // For EMI Term Loan at the time of Annual Review of other credit limits
      annualEMIBaseRateMortgageTerm: [undefined],
      annualEMIPremiumRateMortgageTerm: [undefined],
      annualEMIInterestRateMortgageTerm: [undefined],
      annualEMIAmountMortgageTerm: [undefined],
      annualEMIAmountInWordMortgageTerm: [undefined],
      annualEMILoanExpiryDateMortgageTerm: [undefined],
      // For New Installment Basis Term Loan
      newInstallmentBaseRateMortgageTerm: [undefined],
      newInstallmentPremiumRateMortgageTerm: [undefined],
      newInstallmentInterestRateMortgageTerm: [undefined],
      newInstallmentTotalInterestRateMortgageTerm: [undefined],
      newInstallmentLoanTenureMortgageTerm: [undefined],
      newInstallmentPaymentAmountMortgageTerm: [undefined],
      newInstallmentPaymentAmountInWordMortgageTerm: [undefined],
      newInstallmentNoOfPaymentMortgageTerm: [undefined],
      newInstallmentLoanPurposeMortgageTerm: [undefined],
      newInstallmentServiceChargeMortgageTerm: [undefined],
      // For Installment Basis Term Loan at the time of Annual Review of other credit limits
      annualInstallmentBaseRateMortgageTerm: [undefined],
      annualInstallmentPremiumRateMortgageTerm: [undefined],
      annualInstallmentInterestRateMortgageTerm: [undefined],
      annualInstallmentTotalInterestRateMortgageTerm: [undefined],
      annualInstallmentPaymentAmountMortgageTerm: [undefined],
      annualInstallmentPaymentAmountInWordMortgageTerm: [undefined],
      annualInstallmentNoOfPaymentMortgageTerm: [undefined],
      annualInstallmentLoanExpiryDateMortgageTerm: [undefined],
      annualInstallmentDrawingPowerMortgageTerm: [undefined],
      annualInstallmentDrawingPowerMortgageTerm1: [undefined],
      // Free Text
      freeTextThirteen: [undefined],
    });
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.tempData) &&
        !ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm) &&
        !ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm.mortgageTermFormArray)) {
      for (let val = 0; val < this.tempData.mortgageEquityTermForm.mortgageTermFormArray.length; val++) {
        this.form.get(['mortgageTermLoan', val, 'drawingPowerMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].drawingPowerInPercentageCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newEMIBaseRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].baseRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newEMIPremiumRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].premiumRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newEMIInterestRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].interestRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newEMIAmountMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].emiInFigureCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newEMIAmountInWordMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].emiInWordsCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newEMINoOfInstallmentMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].totalNumberOfInstallmentCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newEMILoanPurposeMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].purposeOfLoanCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newEMIServiceChargeMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].serviceChargeCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newEMILoanTenureMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].tenureOfLoanCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualEMIBaseRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].baseRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualEMIPremiumRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].premiumRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualEMIInterestRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].interestRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualEMIAmountMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].emiInFigureCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualEMIAmountInWordMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].emiInWordsCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualEMILoanExpiryDateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiryCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newInstallmentBaseRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].baseRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newInstallmentPremiumRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].premiumRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newInstallmentInterestRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].interestRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newInstallmentTotalInterestRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].interestRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newInstallmentLoanTenureMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].tenureOfLoanCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newInstallmentPaymentAmountMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].paymentAmountInFigureCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newInstallmentPaymentAmountInWordMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].paymentAmountInWords : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newInstallmentNoOfPaymentMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].totalNumberOfPaymentsCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newInstallmentLoanPurposeMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].purposeOfLoanCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'newInstallmentServiceChargeMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].serviceChargeCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualInstallmentBaseRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].baseRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualInstallmentPremiumRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].premiumRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualInstallmentInterestRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].interestRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualInstallmentTotalInterestRateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].interestRateCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualInstallmentPaymentAmountMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].paymentAmountInFigure : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualInstallmentPaymentAmountInWordMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].paymentAmountInWords : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualInstallmentNoOfPaymentMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].totalNumberOfPayments : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualInstallmentLoanExpiryDateMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiryCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualInstallmentDrawingPowerMortgageTerm']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].drawingPowerInPercentageCT : ''
        );
        this.form.get(['mortgageTermLoan', val, 'annualInstallmentDrawingPowerMortgageTerm1']).patchValue(
            this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val] ?
                this.tempData.mortgageEquityTermForm.mortgageTermFormArray[val].drawingPowerInPercentageCT : ''
        );
      }
    }
    this.patchFreeText();
  }

  setFreeTextMortgage() {
    if (!ObjectUtil.isEmpty(this.tempData) &&
        !ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm) &&
        !ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm.mortgageTermFormArray)) {
      for (let val = 0; val < this.tempData.mortgageEquityTermForm.mortgageTermFormArray.length; val++) {
        const tempFreeText = {
          freeTextThirteen: this.form.get(['mortgageTermLoan', val, 'freeTextThirteen']).value ?
              this.form.get(['mortgageTermLoan', val, 'freeTextThirteen']).value : '',
          SNOfParentLimitMortgageTerm: this.form.get(['mortgageTermLoan', val, 'SNOfParentLimitMortgageTerm']).value ?
              this.form.get(['mortgageTermLoan', val, 'SNOfParentLimitMortgageTerm']).value : '',
          newEMIAutoPopulateMortgageTerm: this.form.get(['mortgageTermLoan', val, 'newEMIAutoPopulateMortgageTerm']).value ?
              this.form.get(['mortgageTermLoan', val, 'newEMIAutoPopulateMortgageTerm']).value : '',
        };
        this.equityMortgageFreeText.push(tempFreeText);
      }
      return this.equityMortgageFreeText;
    }
  }
  patchFreeText() {
    if (!ObjectUtil.isEmpty(this.tempInformation) &&
        !ObjectUtil.isEmpty(this.tempInformation.section2) &&
        !ObjectUtil.isEmpty(this.tempInformation.section2.mortgageTermLoanFreeText)) {
      for (let val = 0; val < this.tempInformation.section2.mortgageTermLoanFreeText.length; val++) {
        this.form.get(['mortgageTermLoan', val, 'freeTextThirteen']).patchValue(
            this.tempInformation.section2.mortgageTermLoanFreeText[val] ?
                this.tempInformation.section2.mortgageTermLoanFreeText[val].freeTextThirteen : '');
        this.form.get(['mortgageTermLoan', val, 'SNOfParentLimitMortgageTerm']).patchValue(
            this.tempInformation.section2.mortgageTermLoanFreeText[val] ?
                this.tempInformation.section2.mortgageTermLoanFreeText[val].SNOfParentLimitMortgageTerm : '');
        this.form.get(['mortgageTermLoan', val, 'newEMIAutoPopulateMortgageTerm']).patchValue(
            this.tempInformation.section2.mortgageTermLoanFreeText[val] ?
                this.tempInformation.section2.mortgageTermLoanFreeText[val].newEMIAutoPopulateMortgageTerm :
                "lgsf;f ePsf] kl5Nnf] dlxgf b]lv ls:tf e'QmfgL ldlt x'g]5");
      }
    }
  }

}
