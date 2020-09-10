import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {environment} from '../../../../../../environments/environment';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {SiteVisit} from '../../../../admin/modal/siteVisit';
import {MawCreditRiskGrading} from '../../../model/MawCreditRiskGrading';
import {Financial} from '../../../model/financial';
import {Guarantor} from '../../../model/guarantor';
import {ReadmoreModelComponent} from '../../readmore-model/readmore-model.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanStage} from '../../../model/loanStage';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {SignatureUtils} from '../../../../../@core/utils/SignatureUtils';
import {Insurance} from '../../../../admin/modal/insurance';
import {Group} from '../../../model/group';
import {ReportingInfoLevel} from '../../../../reporting/model/reporting-info-level';


@Component({
  selector: 'app-all-template-details',
  templateUrl: './all-template-details.component.html',
  styleUrls: ['./all-template-details.component.scss']
})
export class AllTemplateDetailsComponent implements OnInit {
  customerLoanData: LoanDataHolder;
  client: string;
  loanCategory;
  allId;
  customerId;
  loanConfigId;
  catalogueStatus = false;
  currentIndex;
  id: number;
  loanConfig: LoanConfig = new LoanConfig();
  checkCustomerInfo = false;
  customerInfo;
  checkSecurityData = false;
  securityData;
  checkProposalData = false;
  proposalData;
  companyInfo: CompanyInfo;
  checkCompanyInfo = false;
  siteVisitData: SiteVisit;
  checkSiteVisit = false;
  guarantorData: Array<Guarantor>;
  checkGuarantorData = false;
  mawCreditRiskGradingData: MawCreditRiskGrading;
  checkMawCreditRiskGradingData = false;
  financialData: Financial;
  spinner = false;
  checkFinancialData = false;
  signatureList: Array<LoanStage> = new Array<LoanStage>();
  RootUrl = ApiConfig.URL;
  insurance: Insurance;
  checkInsuranceData = false;
  group: Group;
  checkGroupData = false;
  reportingInfoLevels: Array<ReportingInfoLevel>;
  checkReportingInfo = false;
  checkShareSecurity = false;
  shareSecurity;


  constructor(private activatedRoute: ActivatedRoute,
              private customerLoanService: LoanFormService,
              private loanConfigService: LoanConfigService,
              private modalService: NgbModal) {
    this.client = environment.client;

  }

  ngOnInit() {
    this.loadSummary();
    this.activatedRoute.queryParams.subscribe(params => {
      this.customerLoanService.detail(params.customerId).subscribe(response => {
        this.customerLoanData = response.detail;
        this.loanCategory = this.customerLoanData.loanCategory;
        // customerInfo
        if (!ObjectUtil.isEmpty(this.customerLoanData.customerInfo)) {
          this.customerInfo = this.customerLoanData.customerInfo;
          this.checkCustomerInfo = true;
        }
        // companyInfo
        if (!ObjectUtil.isEmpty(this.customerLoanData.companyInfo)) {
          this.companyInfo = this.customerLoanData.companyInfo;
          this.checkCompanyInfo = true;
        }
        // security
        if (!ObjectUtil.isEmpty(this.customerLoanData.security)) {
          this.securityData = JSON.parse(this.customerLoanData.security.data);
          this.checkSecurityData = true;
        }
        // guarantor
        if (!ObjectUtil.isEmpty(this.customerLoanData.guarantor)) {
          this.guarantorData = this.customerLoanData.guarantor.guarantorList;
          this.checkGuarantorData = true;
        }
        // proposal
        if (!ObjectUtil.isEmpty(this.customerLoanData.proposal)) {
          this.proposalData = JSON.parse(this.customerLoanData.proposal.data);
          this.checkProposalData = true;
        }
        // site Visit
        if (!ObjectUtil.isEmpty(this.customerLoanData.siteVisit)) {
          this.siteVisitData = JSON.parse(this.customerLoanData.siteVisit.data);
          this.checkSiteVisit = true;
        }
        // Financial
        if (!ObjectUtil.isEmpty(this.customerLoanData.financial)) {
          this.financialData = JSON.parse(this.customerLoanData.financial.data);
          this.checkFinancialData = true;
        }
        // Insurance
        if (!ObjectUtil.isEmpty(this.customerLoanData.insurance)) {
          this.insurance = this.customerLoanData.insurance;
          this.checkInsuranceData = true;
        }
        if (!ObjectUtil.isEmpty(this.customerLoanData.group)) {
          this.group = JSON.parse(this.customerLoanData.group.data);
          this.checkGroupData = true;
        }
        if (!ObjectUtil.isEmpty(this.customerLoanData.reportingInfoLevels)) {
          this.reportingInfoLevels = this.customerLoanData.reportingInfoLevels;
          this.checkReportingInfo = true;
        }
        if (!ObjectUtil.isEmpty(this.customerLoanData.shareSecurity)) {
          this.shareSecurity = this.customerLoanData.shareSecurity;
          this.checkShareSecurity = true;
        }
        // MAW Credit Risk
        if (!ObjectUtil.isEmpty(this.customerLoanData.mawCreditRiskGrading)) {
          this.mawCreditRiskGradingData = JSON.parse(this.customerLoanData.mawCreditRiskGrading.data);
          this.checkMawCreditRiskGradingData = true;
        }
        this.currentIndex = this.customerLoanData.previousList.length;
        this.signatureList = SignatureUtils.getSignatureList(new Array<LoanStage>
        (...this.customerLoanData.previousList, this.customerLoanData.currentStage));
      });
    });
  }

  loadSummary() {
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          this.allId = {
            loanConfigId: null,
            customerId: null,
            catalogue: null
          };
          this.allId = paramsValue;
          this.customerId = this.allId.customerId;
          this.loanConfigId = this.allId.loanConfigId;
          if (this.allId.catalogue) {
            this.catalogueStatus = true;
          }
        });
    this.id = this.activatedRoute.snapshot.params['id'];
    this.loanConfigService.detail(this.loanConfigId).subscribe(
        (response: any) => {
          this.loanConfig = response.detail;
        }
    );
  }


  onBack() {
    this.spinner = true;
    window.history.back();
  }

  open(comments) {
    const modalRef = this.modalService.open(ReadmoreModelComponent, {size: 'lg'});
    modalRef.componentInstance.comments = comments;
  }

  // TODO need to parameterize docstatus and move function in util
  loanHandler(index: number, length: number) {
    if (index === 0) {
      return 'INITIATED BY:';
    } else if (index === length - 1) {
      if (this.customerLoanData.documentStatus.toString() === 'APPROVED') {
        return 'APPROVED BY:';
      } else if (this.customerLoanData.documentStatus.toString() === 'REJECTED') {
        return 'REJECTED BY:';
      } else if (this.customerLoanData.documentStatus.toString() === 'CLOSED') {
        return 'CLOSED BY:';
      } else {
        return 'SUPPORTED BY:';
      }
    } else {
      return 'SUPPORTED BY:';
    }
  }
}

