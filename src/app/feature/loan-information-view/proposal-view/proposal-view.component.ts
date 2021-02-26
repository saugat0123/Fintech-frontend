import {Component, OnInit, Input} from '@angular/core';
import {Proposal} from '../../admin/modal/proposal';
import {ActivatedRoute, Params} from '@angular/router';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {LoanDataHolder} from '../../loan/model/loanData';

@Component({
  selector: 'app-proposal-view',
  templateUrl: './proposal-view.component.html',
  styleUrls: ['./proposal-view.component.scss']
})
export class ProposalViewComponent implements OnInit {
  @Input() formData: Proposal;
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
  otherInformationAndConfirmation;

  client = environment.client;
  clientName = Clients;


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
