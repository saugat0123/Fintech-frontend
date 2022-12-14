import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../../../../admin/modal/proposal';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanType} from '../../../../loan/model/loanType';

@Component({
  selector: 'app-micro-proposal-view',
  templateUrl: './micro-proposal-view.component.html',
  styleUrls: ['./micro-proposal-view.component.scss']
})
export class MicroProposalViewComponent implements OnInit {
  @Input() formData: Proposal;
  @Input() customerType;
  proposalData;
  recommendationChecked;
  checkApproved = false;
  absoluteSelected = false;
  customSelected = false;
  isFundable = false;
  fundableNonFundableSelcted = false;
  isFixedDeposit = false;
  loanNature;
  loanNatureSelected = false;
  isRevolving = false;
  isTerminating = false;
  isGeneral = false;
  isVehicle = false;
  isShare = false;
  allId;
  showInstallmentAmount = false;
  showRepaymentMode = false;
  public loanType = LoanType;

  constructor(private activatedRoute: ActivatedRoute,
              private loanConfigService: LoanConfigService) {
  }


  ngOnInit() {
    this.proposalData = JSON.parse(this.formData.data);
    this.recommendationChecked = JSON.parse(this.formData.checkedData);
    this.getLoanConfig();
    this.checkInstallmentAmount();
  }

  getLoanConfig() {
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          this.allId = {
            loanConfigId: null
          };
          this.allId = paramsValue;
          this.loanConfigService.detail(this.allId.loanConfigId).subscribe((response: any) => {
            this.isFundable = response.detail.isFundable;
            this.fundableNonFundableSelcted = !ObjectUtil.isEmpty(response.detail.isFundable);
            this.isFixedDeposit = response.detail.loanTag === 'FIXED_DEPOSIT';
            this.isGeneral = response.detail.loanTag === 'GENERAL';
            this.isShare = response.detail.loanTag === 'SHARE_SECURITY';
            this.isVehicle = response.detail.loanTag === 'VEHICLE';
            this.loanNature = response.detail.loanNature;
            if (!ObjectUtil.isEmpty(this.loanNature)) {
              this.loanNatureSelected = true;
              this.isTerminating = this.loanNature === 'Terminating';
              this.isRevolving = this.loanNature === 'Revolving';
              if (this.isRevolving) {
                this.isGeneral = false;
              }
            }
            if (!this.isFundable) {
              this.isGeneral = false;
            }
            if (this.isFixedDeposit) {
              this.loanNatureSelected = false;
              this.fundableNonFundableSelcted = false;
            }
          });
        });
  }
  checkInstallmentAmount() {
    if (this.proposalData.repaymentMode === 'EMI' || this.proposalData.repaymentMode === 'EQI') {
      this.showInstallmentAmount = true;
    }
    if (this.proposalData.repaymentMode === 'CUSTOM') {
      this.showRepaymentMode = true;
    }
  }
}
