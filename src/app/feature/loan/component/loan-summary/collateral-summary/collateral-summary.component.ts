import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanType} from '../../../model/loanType';
import {ProposalCalculationUtils} from '../ProposalCalculationUtils';
import {LoanDataKey} from '../../../../../@core/utils/constants/loan-data-key';
import {Security} from '../../../model/security';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {ActivatedRoute} from '@angular/router';
import {DocStatus} from '../../../model/docStatus';
import {ToastService} from '../../../../../@core/utils';

@Component({
  selector: 'app-collateral-summary',
  templateUrl: './collateral-summary.component.html',
  styleUrls: ['./collateral-summary.component.scss']
})
export class CollateralSummaryComponent implements OnInit {
  @Input() customerAllLoanList;
  @Input() security: Security;
  @Input() loanCategory;
  @Input() approveSheet;
  @Input() loan;
  @Input() loanData;

  client = environment.client;
  clientName = Clients;
  fundedList: LoanDataHolder[];
  nonFundedList: LoanDataHolder[];
  loanType = LoanType;
  proposalUtil = ProposalCalculationUtils;
  loanDataKey = LoanDataKey;
  totalProposedAmount = 0;
  totalRequiredCollateral = 0;
  securityExposure = false;
  approvedLoans=[];
  outstandingAmount;
  loanExposureFmv = 0;
  loanExposureDv =0;
  approvedTerminatingLoan;
  companyInfoId;
  approvedTerminatingLoanTotal = 0;
  approvedRevolvingLoanTotal = 0;
  existingLimitTotal =0;
  outstandingLimitTotal=0;
  proposedLimit =0;
  approvedCollateralTotal =0;
  coverage =0;
  nonFundedApprovedLoans;
  fundedApprovedLoans;
  allFundedList;
  allNonFundedList;
  fundedProposedTotal;
  NonFundedProposedTotal;
  fundedCollateralTotal =0;
  nonFundedCollateralTotal=0;
  nonFundedCollateralTotalView=0;
  totalCollateralView=0;
  totalCollateral=0;
  facSelectedLoans;
  nonFundedFacSelected;
  nonFundedSelectedFac;
  nonFundedApprovedTerminatingTotal=0;
  nonFundedApprovedRevolvingTotal=0;
  loanTag;
  customerLoanDtoList;
  spinner=false;
    fundedListFromDto;
    nonFundedListFromDto
    fundedApprovedLoansFromDto;
    nonFundedApprovedLoansFromDto;
    terminatingLoanFromLoanData = 0;
    revolvingLoanFromLoanData= 0;
    nonFundedApprovedTerminatingFromLoanData =0;
    nonFundedApprovedRevolvingFromLoanData = 0;
    existingLimitFromLoanData = 0;
    outstandingLimitFromLoanData = 0;
    approvedCollateralRequirementFromLoanData =0;
    approvedFundedProposedTotal = 0;
    approvedNonFundedProposedTotal = 0;
    approvedProposedFundedFromLoanData = 0;
    approvedProposedNonFundedFromLoanData = 0;
    approvedFacSelectedLoans;
    constructor(
      private customerLoanService: LoanFormService,
      private loanFormService: LoanFormService,
      private toastService: ToastService,
      private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.displaySecurityExposure();
    this.spinner=true;
    this.activatedRoute.queryParams.subscribe((data)=> {
        this.spinner=false;
      this.companyInfoId = data.customerInfoId;
      this.filterLoan();
      this.getApprovedLoans(this.companyInfoId);
      this.calculation();
      this.calculationForApprovedLoans();
      this.loanTag = this.loan.loanTag === 'GENERAL';
    })
  }

  filterLoan() {
      this.spinner = true;
      if(this.loanData.documentStatus !== 'APPROVED') {
          this.customerLoanService.getFinalLoanListByLoanHolderId(this.companyInfoId).subscribe((response: any) => {
              this.spinner=false;
              this.approvedLoans =response.detail.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED]);
              this.nonFundedApprovedLoans = this.approvedLoans.filter((l) => !l.loan.isFundable);
              this.fundedApprovedLoans =  this.approvedLoans.filter((l)=> l.loan.isFundable);

              this.allFundedList = response.detail.filter((l) => l.loan.isFundable && l.documentStatus !== DocStatus[DocStatus.CLOSED] && l.documentStatus !== DocStatus[DocStatus.REJECTED] );
              this.fundedList = this.allFundedList.filter((l) => l.documentStatus !== DocStatus[DocStatus.APPROVED]
                  && l.loanType.toString() !== 'FULL_SETTLEMENT_LOAN' && l.loanType.toString() !== 'CLOSURE_LOAN');
              this.allNonFundedList = response.detail.filter((l) => !l.loan.isFundable && l.documentStatus !== DocStatus[DocStatus.CLOSED] && l.documentStatus !== DocStatus[DocStatus.REJECTED])
              this.nonFundedList  = this.allNonFundedList.filter((l) => l.documentStatus !== DocStatus[DocStatus.APPROVED]);
              this.facSelectedLoans = this.nonFundedList.filter((l) => l.proposal.cashMarginOrFac === 'FAC');
          });
      }

  }

  calculateRequiredCollateral(list: LoanDataHolder[]) {
    let total = 0;
    list.forEach(value => {
      if (value.proposal) {
        total += value.proposal.proposedLimit * (value.proposal.collateralRequirement / 100);
      }
    });
    return ProposalCalculationUtils.isNumber(total);
  }

  setField(key , amount) {
    this[key] = amount;
    return amount;
  }

  displaySecurityExposure() {
        if (!ObjectUtil.isEmpty(this.security)) {
            if (!ObjectUtil.isEmpty(this.security.data)) {
                const securityData = JSON.parse(this.security.data);
                // const initialData = securityData.initialForm;
                if (!ObjectUtil.isEmpty(this.security) && securityData.selectedArray.length > 0) {
                    this.securityExposure = true;
                    if (securityData.selectedArray.length === 1 &&
                        securityData.selectedArray.includes('OtherSecurity')) {
                        this.securityExposure = false;
                    }
                } else {
                    this.securityExposure = false;
                }
            }
        }
  }
  getApprovedLoans(id) {
      this.spinner=true;
    this.customerLoanService.getFinalLoanListByLoanHolderId(id).subscribe((response: any) => {
        this.spinner=false;
      this.approvedLoans = response.detail.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED]);
    }, err => {
      console.log(err);
      this.spinner=false;
    });
  }

  calculation(){
        if(this.loanData.documentStatus !== 'APPROVED'){
            this.spinner= true;
            this.customerLoanService.getFinalLoanListByLoanHolderId(this.companyInfoId).subscribe((response: any) => {
                    this.spinner=false;
                    this.approvedLoans =response.detail.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED]);

                    // calculation of Approved Terminating Loan Total
                    let approvedTerminatingLoanTotal = [];
                    this.fundedApprovedLoans.map(val => {
                        if (val.loan.loanNature === 'Terminating') {
                            approvedTerminatingLoanTotal.push(val.proposal.outStandingLimit);
                        }
                    });
                    this.approvedTerminatingLoanTotal = approvedTerminatingLoanTotal.reduce((a, b) => Number(a) + Number(b), 0);

                    // Calculation of Approved Revolving Loan Total
                    let approvedRevolvingLoanTotal =[];
                    this.fundedApprovedLoans.map(val => {
                        if (val.loan.loanNature === 'Revolving'){
                            approvedRevolvingLoanTotal.push(val.proposal.proposedLimit);
                        }
                    });
                    this.approvedRevolvingLoanTotal =approvedRevolvingLoanTotal.reduce((a, b) => Number(a) + Number(b),0);

                    // Non Funded Approved Terminating Loan

                    let nonFundedApprovedTerminatingTotal =[];
                    this.nonFundedApprovedLoans.map(val => {
                        if(val.loan.loanNature === 'Terminating' && val.proposal.cashMarginOrFac === 'FAC'){
                            nonFundedApprovedTerminatingTotal.push(val.proposal.outStandingLimit);
                        }
                    });
                    this.nonFundedApprovedTerminatingTotal = nonFundedApprovedTerminatingTotal.reduce((a,b) => Number(a) + Number(b),0);

                // Non Funded Approved Revolving Loan

                    let nonFundedApprovedRevolvingTotal =[];
                    this.nonFundedApprovedLoans.map(val => {
                        if(val.loan.loanNature === 'Revolving' && val.proposal.cashMarginOrFac === 'FAC'){
                            nonFundedApprovedRevolvingTotal.push(val.proposal.proposedLimit);
                        }
                    });
                    this.nonFundedApprovedRevolvingTotal = nonFundedApprovedRevolvingTotal.reduce((a,b) => Number(a) + Number(b),0);


                    // calculation of Total Existing Limit
                    let existingLimitTotal = [];
                    this.approvedLoans.map(val => {
                        existingLimitTotal.push(val.proposal.proposedLimit);
                    });
                    this.existingLimitTotal = existingLimitTotal.reduce((a,b) => Number(a) + Number(b),0);


                    // Calculation of Total Outstanding
                    let outstandingLimitTotal = [];
                    this.approvedLoans.map(val => {
                        outstandingLimitTotal.push(val.proposal.outStandingLimit);
                    });
                    this.outstandingLimitTotal = outstandingLimitTotal.reduce((a,b) => Number(a) + Number(b),0);


                    // Calculation of Total Collateral  of Approved Loans
                    let approvedCollateralTotal = 0;
                    this.approvedLoans.forEach(value => {
                        if(value.proposal) {
                            approvedCollateralTotal += value.proposal.proposedLimit *(value.proposal.collateralRequirement/100);
                        }
                    });
                    this.approvedCollateralTotal = approvedCollateralTotal;


                    // Total Fundable Proposed Amount
                    let fundedProposedTotal = 0;
                    this.fundedList.forEach(value => {
                        if(value.proposal){
                            fundedProposedTotal += value.proposal.proposedLimit
                        }
                    });
                    this.fundedProposedTotal = fundedProposedTotal;

                    // Total Non Fundable Proposed Amount
                    let nonFundedProposedTotal = 0;
                    this.nonFundedList.forEach(value => {
                        if(value.proposal){
                            nonFundedProposedTotal += value.proposal.proposedLimit
                        }
                    });
                    this.NonFundedProposedTotal = nonFundedProposedTotal;


                    // Total Fundable Collateral
                    let fundedCollateralTotal =0;
                    this.allFundedList.forEach(value => {
                        if(value.proposal){
                            fundedCollateralTotal += value.proposal.proposedLimit *(value.proposal.collateralRequirement/100);
                        }
                    });
                    this.fundedCollateralTotal =fundedCollateralTotal;


                    // Total Non-Fundable Collateral
                    let nonFundedCollateralTotal = 0;
                    this.allNonFundedList.forEach(value => {
                        if(value.proposal &&  value.proposal.cashMarginOrFac === 'FAC'){
                            nonFundedCollateralTotal += value.proposal.proposedLimit *(value.proposal.collateralRequirement/100);
                        }
                    });
                    this.nonFundedCollateralTotal = nonFundedCollateralTotal;


                    // Total Non-Fundable Collateral view
                    let nonFundedCollateralTotalView = 0;
                    this.allNonFundedList.forEach(value => {
                        if(value.proposal ){
                            nonFundedCollateralTotalView += value.proposal.proposedLimit *(value.proposal.collateralRequirement/100);
                        }
                    });
                    this.nonFundedCollateralTotalView = nonFundedCollateralTotalView;

                    this.totalCollateralView = this.fundedCollateralTotal + this.nonFundedCollateralTotalView



                    let nonFundedSelectedFac = 0;
                    this.facSelectedLoans.forEach( value => {
                        if(value.proposal){
                            nonFundedSelectedFac += value.proposal.proposedLimit;
                        }
                    })
                    this.nonFundedSelectedFac = nonFundedSelectedFac;


                    if(this.facSelectedLoans.length !== 0){
                        this.totalProposedAmount = (this.fundedProposedTotal+this.nonFundedSelectedFac);
                    }else if(this.facSelectedLoans.length == 0){
                        this.totalProposedAmount=this.fundedProposedTotal;
                    }

                    // Total Collateral
                    this.totalCollateral = (this.fundedCollateralTotal + this.nonFundedCollateralTotal );

                    // Loan Exposure FMV
                    if(this.facSelectedLoans.length == 0){
                        this.loanExposureFmv = ((this.totalProposedAmount + this.approvedTerminatingLoanTotal + this.approvedRevolvingLoanTotal ) / this.security.totalSecurityAmount) *100;
                    } else if(this.facSelectedLoans.length !== 0){
                        this.loanExposureFmv =((this.totalProposedAmount + this.approvedTerminatingLoanTotal + this.approvedRevolvingLoanTotal + this.nonFundedApprovedTerminatingTotal+ this.nonFundedApprovedRevolvingTotal)/ this.security.totalSecurityAmount)*100;
                    }


                    // Loan Exposure Dv
                    if(this.facSelectedLoans.length == 0){
                        this.loanExposureDv = ((this.totalProposedAmount + this.approvedTerminatingLoanTotal + this.approvedRevolvingLoanTotal ) / this.security.totalDistressAmount) *100;
                    } else if(this.facSelectedLoans.length !== 0){
                        this.loanExposureDv =((this.totalProposedAmount + this.approvedTerminatingLoanTotal + this.approvedRevolvingLoanTotal + this.nonFundedApprovedTerminatingTotal+ this.nonFundedApprovedRevolvingTotal)/ this.security.totalDistressAmount)*100;
                    }

                    if(this.facSelectedLoans.length == 0) {
                        this.coverage = (this.security.totalSecurityAmount / (this.totalProposedAmount + this.approvedTerminatingLoanTotal + this.approvedRevolvingLoanTotal)) * 100;
                    } else if(this.facSelectedLoans.length !== 0){
                        this.coverage = (this.security.totalSecurityAmount/(this.totalProposedAmount + this.approvedTerminatingLoanTotal + this.approvedRevolvingLoanTotal + this.nonFundedApprovedTerminatingTotal+ this.nonFundedApprovedRevolvingTotal))*100;
                    }
                }

            )}
        }

        calculationForApprovedLoans(){
        if(this.loanData.documentStatus ==='APPROVED') {
            if (!ObjectUtil.isEmpty(this.loanData.customerLoanDtoList)) {
                this.customerLoanDtoList = this.loanData.customerLoanDtoList;
                this.fundedListFromDto = this.customerLoanDtoList.filter((l) => l.loan.isFundable);
                this.fundedApprovedLoansFromDto = this.fundedListFromDto.filter((l) => l.documentStatus === 'APPROVED');
                this.fundedList = this.fundedListFromDto.filter((l) => l.documentStatus !== 'APPROVED'
                    && l.loanType.toString() !== 'FULL_SETTLEMENT_LOAN' && l.loanType.toString() !== 'CLOSURE_LOAN');
                this.nonFundedListFromDto = this.customerLoanDtoList.filter((l) => !l.loan.isFundable);
                this.nonFundedApprovedLoansFromDto = this.nonFundedListFromDto.filter((l) => l.documentStatus === 'APPROVED');
                this.approvedLoans = this.customerLoanDtoList.filter((l) => l.documentStatus === 'APPROVED');
                this.allFundedList = this.customerLoanDtoList.filter((l) => l.loan.isFundable && l.documentStatus !== DocStatus[DocStatus.CLOSED] && l.documentStatus !== DocStatus[DocStatus.REJECTED]);
                this.fundedList = this.allFundedList.filter((l) => l.documentStatus !== DocStatus[DocStatus.APPROVED]
                    && l.loanType.toString() !== 'FULL_SETTLEMENT_LOAN' && l.loanType.toString() !== 'CLOSURE_LOAN');
                this.allNonFundedList = this.customerLoanDtoList.filter((l) => !l.loan.isFundable && l.documentStatus !== DocStatus[DocStatus.CLOSED] && l.documentStatus !== DocStatus[DocStatus.REJECTED])
                this.nonFundedList = this.allNonFundedList.filter((l) => l.documentStatus !== DocStatus[DocStatus.APPROVED]);
                this.facSelectedLoans = this.nonFundedList.filter((l) => l.proposal.cashMarginOrFac === 'FAC');
                this.approvedFacSelectedLoans = this.allNonFundedList.filter((l)=> l.proposal.cashMarginOrFac ==='FAC')


                // calculation of Approved Terminating Loan Total
                let approvedTerminatingLoanTotal = [];
                this.fundedApprovedLoansFromDto.map(val => {
                    if (val.loan.loanNature === 'Terminating') {
                        approvedTerminatingLoanTotal.push(val.proposal.outStandingLimit);
                    }
                });
                if (this.loanData.loan.loanNature === 'Terminating') {
                    this.terminatingLoanFromLoanData = this.loanData.proposal.outStandingLimit;
                }
                this.approvedTerminatingLoanTotal = approvedTerminatingLoanTotal.reduce((a, b) => Number(a) + Number(b), 0) + this.terminatingLoanFromLoanData;


                // Calculation of Approved Revolving Loan Total
                let approvedRevolvingLoanTotal = [];
                this.fundedApprovedLoansFromDto.map(val => {
                    if (val.loan.loanNature === 'Revolving') {
                        approvedRevolvingLoanTotal.push(val.proposal.proposedLimit);
                    }
                });
                if (this.loanData.loan.loanNature === 'Revolving' && this.loanData.loan.isFunded) {
                    this.revolvingLoanFromLoanData = this.loanData.proposal.proposedLimit;
                }
                this.approvedRevolvingLoanTotal = approvedRevolvingLoanTotal.reduce((a, b) => Number(a) + Number(b), 0) + this.revolvingLoanFromLoanData;


                // Non Funded Approved Terminating Loan

                let nonFundedApprovedTerminatingTotal = [];
                this.nonFundedApprovedLoansFromDto.map(val => {
                    if (val.loan.loanNature === 'Terminating' && val.proposal.cashMarginOrFac === 'FAC') {
                        nonFundedApprovedTerminatingTotal.push(val.proposal.outStandingLimit);
                    }
                });
                if (this.loanData.loan.loanNature === 'Terminating' && this.loanData.proposal.cashMarginOrFac === 'FAC' && !this.loanData.loan.isFunded) {
                    this.nonFundedApprovedTerminatingFromLoanData = this.loanData.proposal.outStandingLimit;
                }
                this.nonFundedApprovedTerminatingTotal = nonFundedApprovedTerminatingTotal.reduce((a, b) => Number(a) + Number(b), 0) + this.nonFundedApprovedTerminatingFromLoanData;


                // Non Funded Approved Revolving Loan

                let nonFundedApprovedRevolvingTotal = [];
                this.nonFundedApprovedLoansFromDto.map(val => {
                    if (val.loan.loanNature === 'Revolving' && val.proposal.cashMarginOrFac === 'FAC') {
                        nonFundedApprovedRevolvingTotal.push(val.proposal.proposedLimit);
                    }
                });
                if (this.loanData.loan.loanNature === 'Revolving' && this.loanData.proposal.cashMarginOrFac === 'FAC' && !this.loanData.loan.isFunded) {
                    this.nonFundedApprovedRevolvingFromLoanData = this.loanData.proposal.proposedLimit;
                }
                this.nonFundedApprovedRevolvingTotal = nonFundedApprovedRevolvingTotal.reduce((a, b) => Number(a) + Number(b), 0) + this.nonFundedApprovedRevolvingFromLoanData;


                // calculation of Total Existing Limit
                let existingLimitTotal = [];
                this.approvedLoans.map(val => {
                    existingLimitTotal.push(val.proposal.proposedLimit);
                });
                this.existingLimitFromLoanData = this.loanData.proposal.proposedLimit;
                this.existingLimitTotal = existingLimitTotal.reduce((a, b) => Number(a) + Number(b), 0) + this.existingLimitFromLoanData;


                // Calculation of Total Outstanding
                let outstandingLimitTotal = [];
                this.approvedLoans.map(val => {
                    outstandingLimitTotal.push(val.proposal.outStandingLimit);
                });
                this.outstandingLimitFromLoanData = this.loanData.proposal.outStandingLimit;
                this.outstandingLimitTotal = outstandingLimitTotal.reduce((a, b) => Number(a) + Number(b), 0) + this.outstandingLimitFromLoanData;


                // Calculation of Total Collateral  of Approved Loans
                let approvedCollateralTotal = 0;
                this.approvedLoans.forEach(value => {
                    if (value.proposal) {
                        approvedCollateralTotal += value.proposal.proposedLimit * (value.proposal.collateralRequirement / 100);
                    }
                });
                this.approvedCollateralRequirementFromLoanData = (this.loanData.proposal.collateralRequirement * this.loanData.proposal.proposedLimit) / 100;
                this.approvedCollateralTotal = approvedCollateralTotal + this.approvedCollateralRequirementFromLoanData;


                // Total funded Proposed Total From Approved Files
                let approvedFundedProposedTotal = 0;
                this.fundedApprovedLoansFromDto.forEach(value => {
                    if (value.proposal) {
                        approvedFundedProposedTotal += value.proposal.proposedLimit;
                    }
                })
                console.log(this.loanData);
                if (this.loanData.loan.isFundable) {
                    this.approvedProposedFundedFromLoanData = this.loanData.proposal.proposedLimit;
                }
                this.approvedFundedProposedTotal = approvedFundedProposedTotal + this.approvedProposedFundedFromLoanData;


                console.log(this.approvedFundedProposedTotal, 'approved funded proposed total');

                // Total Non Funded Proposed Total From Approved Files
                let approvedNonFundedProposedTotal = 0;
                this.approvedFacSelectedLoans.forEach(value => {
                    if (value.proposal) {
                        approvedNonFundedProposedTotal += value.proposal.proposedLimit;
                    }
                })
                if (!this.loanData.loan.isFundable && this.loanData.proposal.cashMarginOrFac ==='FAC') {
                    this.approvedProposedNonFundedFromLoanData = this.loanData.proposal.proposedLimit;
                }
                this.approvedNonFundedProposedTotal = approvedNonFundedProposedTotal + this.approvedProposedNonFundedFromLoanData;
                console.log(approvedNonFundedProposedTotal, 'approved non funded proposed total');


                // Total Fundable Proposed Amount
                let fundedProposedTotal = 0;
                this.fundedList.forEach(value => {
                    if (value.proposal) {
                        fundedProposedTotal += value.proposal.proposedLimit
                    }
                });
                this.fundedProposedTotal = fundedProposedTotal;
                console.log(this.fundedProposedTotal, 'funded proposed total');


                // Total Non Fundable Proposed Amount
                let nonFundedProposedTotal = 0;
                this.nonFundedList.forEach(value => {
                    if (value.proposal) {
                        nonFundedProposedTotal += value.proposal.proposedLimit
                    }
                });
                this.NonFundedProposedTotal = nonFundedProposedTotal;
                console.log(this.NonFundedProposedTotal, 'non funded proposed total');


                // Total Fundable Collateral
                let fundedCollateralTotal = 0;
                this.allFundedList.forEach(value => {
                    if (value.proposal) {
                        fundedCollateralTotal += value.proposal.proposedLimit * (value.proposal.collateralRequirement / 100);
                    }
                });
                this.fundedCollateralTotal = fundedCollateralTotal;


                // Total Non-Fundable Collateral
                let nonFundedCollateralTotal = 0;
                this.allNonFundedList.forEach(value => {
                    if (value.proposal && value.proposal.cashMarginOrFac === 'FAC') {
                        nonFundedCollateralTotal += value.proposal.proposedLimit * (value.proposal.collateralRequirement / 100);
                    }
                });
                this.nonFundedCollateralTotal = nonFundedCollateralTotal;


                // Total Non-Fundable Collateral view
                let nonFundedCollateralTotalView = 0;
                this.allNonFundedList.forEach(value => {
                    if (value.proposal) {
                        nonFundedCollateralTotalView += value.proposal.proposedLimit * (value.proposal.collateralRequirement / 100);
                    }
                });
                this.nonFundedCollateralTotalView = nonFundedCollateralTotalView;


                this.totalCollateralView = this.fundedCollateralTotal + this.nonFundedCollateralTotalView


                // Non Funded FAC SElected

                let nonFundedSelectedFac = 0;
                this.facSelectedLoans.forEach(value => {
                    if (value.proposal) {
                        nonFundedSelectedFac += value.proposal.proposedLimit;
                    }
                })
                this.nonFundedSelectedFac = nonFundedSelectedFac;


                // Total Proposed Amount
                this.totalProposedAmount = (this.fundedProposedTotal + this.approvedFundedProposedTotal + this.approvedNonFundedProposedTotal);


                // Total Collateral
                this.totalCollateral = (this.fundedCollateralTotal + this.nonFundedCollateralTotal);


                // Loan Exposure FMV
                this.loanExposureFmv = ((this.totalProposedAmount + this.approvedTerminatingLoanTotal + this.approvedRevolvingLoanTotal + this.nonFundedApprovedTerminatingTotal + this.nonFundedApprovedRevolvingTotal) / this.security.totalSecurityAmount) * 100;


                // Loan Exposure Dv


                this.loanExposureDv = ((this.totalProposedAmount + this.approvedTerminatingLoanTotal + this.approvedRevolvingLoanTotal + this.nonFundedApprovedTerminatingTotal + this.nonFundedApprovedRevolvingTotal) / this.security.totalDistressAmount) * 100;

                //coverage

                this.coverage = (this.security.totalSecurityAmount / (this.totalProposedAmount + this.approvedTerminatingLoanTotal + this.approvedRevolvingLoanTotal + this.nonFundedApprovedTerminatingTotal + this.nonFundedApprovedRevolvingTotal)) * 100;



            }
        }
        }


}
