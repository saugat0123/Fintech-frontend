import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../../../../../loan/model/loanData';
import {LoanNameConstant} from '../../../../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';

@Component({
  selector: 'app-section5-interst-penal-charge',
  templateUrl: './section5-interst-penal-charge.component.html',
  styleUrls: ['./section5-interst-penal-charge.component.scss']
})
export class Section5InterstPenalChargeComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  section5: FormGroup;
  tempData: any;
  globalData: any;
  loanScheme: any;
  loanSchemeSelected: any;
  selectedInterestRate;
  loanNames: any = [];
  loanNameConst = LoanNameConstant;
  isTermLoanEmiSelected = false;
  isTermLoanSelected = false;
  isAutoLoanSelected = false;
  isAutoLoanEmiSelected = false;
  isMortgageTermLoanSelected = false;
  isEquityMortgageTermLoanSelected = false;
  subsidyAgricultureSelected;
  typeOfServiceCharge;
  termSelected = false;
  mortgageTermSelected = false;
  equityMortgageSelected = false;
  isWorkingCapitalLoan = false;
  isAutoLoanOtherCreditSelected = false;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      if (!ObjectUtil.isEmpty(this.tempData)) {
        this.globalData = this.tempData.smeGlobalForm;
        this.typeOfServiceCharge = this.globalData.serviceChargeType;
        this.fillForm();

          /* For Loan Name */
          this.getLoanName();
          if (this.loanNames.length > 0) {
              this.setLoanFlags(this.loanNames);
          }
      }
    }
    console.log('this.tempData', this.tempData);
  }
  buildForm() {
    this.section5 = this.formBuilder.group({
      interestRate: [undefined],
      /*securities: this.formBuilder.array([]),
      freeTextVal : [undefined],*/
      serviceChargeInFigure: [undefined],
      serviceChargeInWords: [undefined],
      detailsOfFacility: [undefined],
      serviceChargeInPercentage: [undefined],
    });
  }

    fillForm() {
        this.loanScheme = this.globalData.loanSchemeType;
        this.loanSchemeSelected = this.globalData.loanScheme;
        this.subsidyAgricultureSelected = this.globalData.subsidyOrAgricultureLoan;
        this.selectedInterestRate = this.globalData.interestRateType;
        this.section5.patchValue({
            serviceChargeInFigure: this.tempData.smeGlobalForm.serviceChargeInFigureCT ?
                this.tempData.smeGlobalForm.serviceChargeInFigureCT : '',
            serviceChargeInWords: this.tempData.smeGlobalForm.serviceChargeInWordsCT ? this.tempData.smeGlobalForm.serviceChargeInWordsCT : '',
            detailsOfFacility: this.tempData.smeGlobalForm.detailOfFacilityCT ? this.tempData.smeGlobalForm.detailOfFacilityCT : '',
            serviceChargeInPercentage: this.tempData.smeGlobalForm.serviceChargeInPercentCT ?
                this.tempData.smeGlobalForm.serviceChargeInPercentCT : '',
            interestRate: !ObjectUtil.isEmpty(this.globalData) ? this.globalData.schemeInterestRateCT : '',
        });

    }

    getLoanName() {
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach((loanDataHolder: LoanDataHolder) => {
          this.loanNames.push(loanDataHolder.loan.name);
      });
    }

    setLoanFlags(selectedLoanLists) {
        selectedLoanLists.forEach((data) => {
            if (data === this.loanNameConst.AUTO_LOAN) {
                this.isAutoLoanSelected = true;
            }
            if (data === this.loanNameConst.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
                this.termSelected = true;
            }
            if (data === this.loanNameConst.MORTGAGE_TERM_LOAN) {
                this.mortgageTermSelected = true;
            }
            if (data === this.loanNameConst.EQUITY_MORTGAGE_TERM_LOAN) {
                this.equityMortgageSelected = true;
            }
            if (data === this.loanNameConst.DEMAND_LOAN_FOR_WORKING_CAPITAL ||
            data === this.loanNameConst.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT ||
                data === this.loanNameConst.MORTGAGE_OVERDRAFT ||
                data === this.loanNameConst.EQUITY_MORTGAGED_OVERDRAFT ||
                data === this.loanNameConst.BRIDGE_GAP_LOAN ||
                data === this.loanNameConst.SHORT_TERM_LOAN ||
                data === this.loanNameConst.IMPORT_LOAN_TRUST_RECEIPT_LOAN) {
                this.isWorkingCapitalLoan = true;
            }
        });
        if (this.isAutoLoanSelected === true) {
            const autoLoanKey = this.tempData.autoLoanMasterForm.autoLoanFormArray;
            autoLoanKey.forEach(val => {
                if (val.autoLoanType === 'NEW_EMI_TERM_LOAN') {
                    this.isAutoLoanEmiSelected = true;
                }
            });
        }
        if (this.isAutoLoanSelected === true) {
            const autoLoanKey = this.tempData.autoLoanMasterForm.autoLoanFormArray;
            autoLoanKey.forEach(val => {
                if (val.autoLoanType === 'OTHER_CREDIT_LIMITS') {
                    this.isAutoLoanOtherCreditSelected = true;
                }
            });
        }
        if (this.termSelected === true) {
            const termLoanKey = this.tempData.termLoanForm.termLoanDetails;
            termLoanKey.forEach(val => {
                this.isTermLoanSelected = val.termLoanFor === 'VEHICLE';
                if (val.termLoanType === 'NEW_EMI' || val.termLoanType === 'NEW_ANNUAL_REVIEW') {
                    this.isTermLoanEmiSelected = true;
                }
            });
        }
        if (this.mortgageTermSelected === true) {
            const tempTermMortgageKey = this.tempData.mortgageEquityTermForm.mortgageTermFormArray;
            tempTermMortgageKey.forEach(val => {
                if (val.termLoanType === 'NEW_EMI_TERM_LOAN' || val.termLoanType === 'NEW_ANNUAL_REVIEW') {
                    this.isMortgageTermLoanSelected = true;
                }
            });
        }
        if (this.equityMortgageSelected === true) {
            const tempTermMortgageKey = this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray;
            tempTermMortgageKey.forEach(val => {
                if (val.termLoanType === 'NEW_EMI_TERM_LOAN' || val.termLoanType === 'NEW_ANNUAL_REVIEW') {
                    this.isEquityMortgageTermLoanSelected = true;
                }
            });
        }
    }
}
