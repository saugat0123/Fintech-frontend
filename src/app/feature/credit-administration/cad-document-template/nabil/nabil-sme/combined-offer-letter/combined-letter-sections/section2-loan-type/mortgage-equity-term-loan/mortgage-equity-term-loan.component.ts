import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-mortgage-equity-term-loan',
    templateUrl: './mortgage-equity-term-loan.component.html',
    styleUrls: ['./mortgage-equity-term-loan.component.scss']
})
export class MortgageEquityTermLoanComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() loanData;
    @Input() index;
    @Input() pointNumber;
    @Input() equityMortgageData;
    form: FormGroup;
    initialData;
    tempData;
    mortgageEquity: any = {};
    termLoanForMortgageEquityTerm; mortgageTypeMortgageEquityTerm; complementaryOtherMortgageEquityTerm = false;
    emiPaymentTypeMortgageEquityTerm; interestSubAgMortgageEquityTerm; paymentTermMortgageEquityTerm;
    loanOptionMortgageEquityTerm; drawingPowerMortgageEquityTerm; termLoanTypeMortgageEquityTerm; complementaryOtherMortgageEquityTermName;
    tempInformation;
    newEMIAutoPopulateMortgageTerm = 'निकासा भएको पछिल्लोे महिना देखि किस्ता भुक्तानी मिति हुनेछ';
    equityMortgageFreeText: Array <any> = new Array<any>();

    constructor(private formBuilder: FormBuilder,
    ) {
    }

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
        /*if (!ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm)) {
            this.termLoanForMortgageEquityTerm = this.tempData.mortgageEquityTermForm.termLoanFor;
            this.mortgageTypeMortgageEquityTerm = this.tempData.mortgageEquityTermForm.mortgageType;
            this.termLoanTypeMortgageEquityTerm = this.tempData.mortgageEquityTermForm.termLoanType;
            this.emiPaymentTypeMortgageEquityTerm = this.tempData.mortgageEquityTermForm.emiPaymentType;
            this.interestSubAgMortgageEquityTerm = this.tempData.mortgageEquityTermForm.subsidyOrAgricultureLoan;
            this.paymentTermMortgageEquityTerm = this.tempData.mortgageEquityTermForm.paymentTerms;
            this.complementaryOtherMortgageEquityTermName = this.tempData.mortgageEquityTermForm.complimentaryLoanSelected;
            this.drawingPowerMortgageEquityTerm = this.tempData.mortgageEquityTermForm.drawingPowerBasis;
            this.loanOptionMortgageEquityTerm = this.tempData.smeGlobalForm.loanOption;
            if (this.tempData.mortgageEquityTermForm.complementaryOther === true) {
                this.complementaryOtherMortgageEquityTerm = true;
            }
        }*/
        /*this.setFreeTextMortgage();*/
    }

    buildForm() {
        this.form = this.formBuilder.group({
            // Mortgage Term Loan / Equity Mortgage Term Loan
            equityMortgageTermLoan: this.formBuilder.array([]),
        });
        this.setEquityMortgageTermLoan();
    }
    setEquityMortgageTermLoan() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.mortgageEquityTermForm) &&
            !ObjectUtil.isEmpty(this.initialData.mortgageEquityTermForm.mortgageEquityTermFormArray)) {
            for (let a = 0; a < this.initialData.mortgageEquityTermForm.mortgageEquityTermFormArray.length; a++) {
                (this.form.get('equityMortgageTermLoan') as FormArray).push(this.setEquityMortgageTermLoanForm());
            }
        }
    }
    setEquityMortgageTermLoanForm() {
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
            newEMIAutoPopulateMortgageTerm: ['निकासा भएको पछिल्लोे महिना देखि किस्ता भुक्तानी मिति हुनेछ'],
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
            !ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray)) {
            for (let val = 0; val < this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray.length; val++) {
                this.form.get(['equityMortgageTermLoan', val, 'drawingPowerMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].drawingPowerInPercentageCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newEMIBaseRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].baseRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newEMIPremiumRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].premiumRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newEMIInterestRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].interestRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newEMIAmountMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].emiInFigureCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newEMIAmountInWordMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].emiInWordsCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newEMINoOfInstallmentMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].totalNumberOfInstallmentCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newEMILoanPurposeMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].purposeOfLoanCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newEMIServiceChargeMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].serviceChargeCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newEMILoanTenureMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].tenureOfLoanCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualEMIBaseRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].baseRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualEMIPremiumRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].premiumRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualEMIInterestRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].interestRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualEMIAmountMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].emiInFigureCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualEMIAmountInWordMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].emiInWordsCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualEMILoanExpiryDateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiryCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newInstallmentBaseRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].baseRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newInstallmentPremiumRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].premiumRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newInstallmentInterestRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].interestRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newInstallmentTotalInterestRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].interestRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newInstallmentLoanTenureMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].tenureOfLoanCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newInstallmentPaymentAmountMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].paymentAmountInFigure : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newInstallmentPaymentAmountInWordMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].paymentAmountInWords : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newInstallmentNoOfPaymentMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].totalNumberOfPayments : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newInstallmentLoanPurposeMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].purposeOfLoanCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'newInstallmentServiceChargeMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].serviceChargeCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualInstallmentBaseRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].baseRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualInstallmentPremiumRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].premiumRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualInstallmentInterestRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].interestRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualInstallmentTotalInterestRateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].interestRateCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualInstallmentPaymentAmountMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].paymentAmountInFigure : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualInstallmentPaymentAmountInWordMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].paymentAmountInWords : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualInstallmentNoOfPaymentMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].totalNumberOfPayments : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualInstallmentLoanExpiryDateMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiryCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualInstallmentDrawingPowerMortgageTerm']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].drawingPowerInPercentageCT : ''
                );
                this.form.get(['equityMortgageTermLoan', val, 'annualInstallmentDrawingPowerMortgageTerm1']).patchValue(
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val] ?
                        this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray[val].drawingPowerInPercentageCT : ''
                );
            }
        }
        this.patchFreeText();
    }

    setFreeTextMortgage() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm) &&
            !ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray)) {
            for (let val = 0; val < this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray.length; val++) {
                const tempFreeText = {
                    freeTextThirteen: this.form.get(['equityMortgageTermLoan', val, 'freeTextThirteen']).value ?
                        this.form.get(['equityMortgageTermLoan', val, 'freeTextThirteen']).value : '',
                    SNOfParentLimitMortgageTerm: this.form.get(['equityMortgageTermLoan', val, 'SNOfParentLimitMortgageTerm']).value ?
                        this.form.get(['equityMortgageTermLoan', val, 'SNOfParentLimitMortgageTerm']).value : '',
                    newEMIAutoPopulateMortgageTerm: this.form.get(['equityMortgageTermLoan', val, 'newEMIAutoPopulateMortgageTerm']).value ?
                        this.form.get(['equityMortgageTermLoan', val, 'newEMIAutoPopulateMortgageTerm']).value : '',
                };
                this.equityMortgageFreeText.push(tempFreeText);
            }
            return this.equityMortgageFreeText;
        }
    }
    patchFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.equityTermLoanFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.equityTermLoanFreeText.length; val++) {
                this.form.get(['equityMortgageTermLoan', val, 'freeTextThirteen']).patchValue(
                    this.tempInformation.section2.equityTermLoanFreeText[val] ?
                        this.tempInformation.section2.equityTermLoanFreeText[val].freeTextThirteen : '');
                this.form.get(['equityMortgageTermLoan', val, 'SNOfParentLimitMortgageTerm']).patchValue(
                    this.tempInformation.section2.equityTermLoanFreeText[val] ?
                        this.tempInformation.section2.equityTermLoanFreeText[val].SNOfParentLimitMortgageTerm : '');
                this.form.get(['equityMortgageTermLoan', val, 'newEMIAutoPopulateMortgageTerm']).patchValue(
                    this.tempInformation.section2.equityTermLoanFreeText[val] ?
                        this.tempInformation.section2.equityTermLoanFreeText[val].newEMIAutoPopulateMortgageTerm :
                        'िकासा भएको पछिल्लोे महिना देखि किस्ता भुक्तानी मिति हुनेछ');
            }
        }
    }
}
