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
  subsidyAgricultureSelected;
  typeOfServiceCharge;
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
        numberText: [undefined],
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
                const autoLoanKey = this.tempData.autoLoanMasterForm;
                if (autoLoanKey.autoLoanType === 'NEW_EMI_TERM_LOAN') {
                    this.isAutoLoanEmiSelected = true;
                }
            }
            if (data === this.loanNameConst.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
                const termLoanKey = this.tempData.termLoanForm;
                this.isTermLoanSelected = termLoanKey.termLoanFor === 'VEHICLE';
                // const termLoanKey = this.tempData.termLoanForm;
                if (termLoanKey.termLoanType === 'NEW_EMI' || termLoanKey.termLoanType === 'NEW_ANNUAL_REVIEW') {
                    this.isTermLoanEmiSelected = true;
                }
            }
            if (data === this.loanNameConst.MORTGAGE_TERM_LOAN_EQUITY_MORTGAGE_TERM_LOAN) {
                const tempTermMortgageKey = this.tempData.mortgageEquityTermForm;
                if (tempTermMortgageKey.termLoanType === 'NEW_EMI_TERM_LOAN' || tempTermMortgageKey.termLoanType === 'NEW_ANNUAL_REVIEW') {
                    this.isMortgageTermLoanSelected = true;
                }
            }
        });
    }
}
