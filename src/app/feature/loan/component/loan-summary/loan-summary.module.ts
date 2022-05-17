import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanSummaryComponent } from './loan-summary.component';
import { SitevistSummaryComponentComponent } from './sitevist-summary-component/sitevist-summary-component.component';
import { FinancialSummaryComponent } from './financial-summary/financial-summary.component';
import { SecuritySummaryComponent } from './security-summary/security-summary.component';
import { InsuranceSummaryComponent } from './insurance-summary/insurance-summary.component';
import { GuarantorSummaryComponent } from './guarantor-summary/guarantor-summary.component';
import { CustomerGroupSummaryComponent } from './customer-group-summary/customer-group-summary.component';
import { ThemeModule } from '../../../../@theme/theme.module';
import { LoanSummaryRoutingModule } from './loan-summary-routing.module';
import { ProposalSummaryComponent } from './proposal-summary/proposal-summary.component';
import { ReportingModule } from '../../../reporting/reporting.module';
import { NgxPrintModule } from 'ngx-print';
import { CoreModule } from '../../../../@core/core.module';
import { CompanyInfoSummaryComponent } from './company-info-summary/company-info-summary.component';
import { IncomeFromAccountSummeryComponent } from './income-from-account-summery/income-from-account-summery.component';
import { LoanInformationTemplateModule } from '../../../loan-information-template/loan-information-template.module';
import { ProposalJustificationSummaryComponent } from './proposal-justification-summary/proposal-justification-summary.component';
import { BusinessBackgroundComponent } from './company-info-summary/business-background/business-background.component';
import { FinancialRiskSummaryComponent } from './financial-risk-summary/financial-risk-summary.component';
import { CollateralSummaryComponent } from './collateral-summary/collateral-summary.component';
import { NtaSummaryComponent } from './nta-summary/nta-summary.component';
import { ProposalTermsAndConditionSummeryComponent } from './proposal-terms-and-condition-summery/proposal-terms-and-condition-summery.component';
import { CbsGroupModule } from '../../../cbs-group/cbs-group.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoanInformationViewModule } from '../../../loan-information-view/loan-information-view.module';
import { RoleHierarchyChainComponent } from './role-heirarchy-chain/role-hierarchy-chain.component';
import { MGroupSummaryComponent } from './m-group-summary/m-group-summary.component';
import { CommentsSummaryComponent } from './comments-summary/comments-summary.component';
import { PreviousSecuritySummaryComponent } from '../../../loan-information-view/previous-security-summary/previous-security-summary.component';
import { NepaliPatroModule } from 'nepali-patro';
import { SignatureSectionComponent } from './signature-section/signature-section.component';
import { CreditFacilityReportComponent } from './credit-facility-report/credit-facility-report.component';
import { SmeLoanSummaryComponent } from './sme-loan-summary/sme-loan-summary.component';
import { CurrentStatusTableComponent } from './sme-loan-summary/current-status-table/current-status-table.component';
import { ConlusionReviewTableComponent } from './sme-loan-summary/conlusion-review-table/conlusion-review-table.component';
import { ExecutiveSummarySmeComponent } from './sme-loan-summary/executive-summary-sme/executive-summary-sme.component';
import { AboveTenMillionComponent } from './sme-loan-summary/above-ten-million/above-ten-million.component';
import { AboveBackgroundOfCustomerComponent } from './sme-loan-summary/above-ten-million/above-background-of-customer/above-background-of-customer.component';
import { AssessmentForRequirementOfFundComponent } from './sme-loan-summary/assessment-for-requirement-of-fund/assessment-for-requirement-of-fund.component';
import { BankingRelationshipComponent } from './sme-loan-summary/banking-relationship/banking-relationship.component';
import { OtherChargesComponent } from './sme-loan-summary/other-charges/other-charges.component';
import { CovenantsComponent } from './sme-loan-summary/covenants/covenants.component';
import { NrbStatutoryRemarksStatusComponent } from './sme-loan-summary/nrb-statutory-remarks-status/nrb-statutory-remarks-status.component';
import { AboveRequestOfTheCustomerComponent } from './sme-loan-summary/above-ten-million/above-request-of-the-customer/above-request-of-the-customer.component';
import { AbovePurposeJustificationForProposalComponent } from './sme-loan-summary/above-ten-million/above-purpose-justification-for-proposal/above-purpose-justification-for-proposal.component';
import { AboveBusinessRelatedInformationComponent } from './sme-loan-summary/above-ten-million/above-business-related-information/above-business-related-information.component';
import { AboveBankSolComponent } from './sme-loan-summary/above-ten-million/above-bank-sol/above-bank-sol.component';
import { AboveInspectionComponent } from './sme-loan-summary/above-ten-million/above-inspection/above-inspection.component';
import { AboveAssessmentOfFacilitiesRequirementComponent } from './sme-loan-summary/above-ten-million/above-assessment-of-facilities-requirement/above-assessment-of-facilities-requirement.component';
import { AboveSecurityArrangementComponent } from './sme-loan-summary/above-ten-million/above-security-arrangement/above-security-arrangement.component';
import { AboveGroupExposureWithCcblComponent } from './sme-loan-summary/above-ten-million/above-group-exposure-with-ccbl/above-group-exposure-with-ccbl.component';
import { AboveBankingArrangementOfTheCustomerComponent } from './sme-loan-summary/above-ten-million/above-banking-arrangement-of-the-customer/above-banking-arrangement-of-the-customer.component';
import { AboveStockStatementComponent } from './sme-loan-summary/above-ten-million/above-stock-statement/above-stock-statement.component';
import { AboveRiskAnalysisComponent } from './sme-loan-summary/above-ten-million/above-risk-analysis/above-risk-analysis.component';
import { AboveSwotAnalysisComponent } from './sme-loan-summary/above-ten-million/above-swot-analysis/above-swot-analysis.component';
import { AbovePricingAndEstimatedIncomeFromTheAccountComponent } from './sme-loan-summary/above-ten-million/above-pricing-and-estimated-income-from-the-account/above-pricing-and-estimated-income-from-the-account.component';
import { AboveFixedAssetsCollateralComputationSheetComponent } from './sme-loan-summary/above-ten-million/above-fixed-assets-collateral-computation-sheet/above-fixed-assets-collateral-computation-sheet.component';
import { AboveSpecialCovenantsComponent } from './sme-loan-summary/above-ten-million/above-special-covenants/above-special-covenants.component';
import { AboveModeOfDisbursementComponent } from './sme-loan-summary/above-ten-million/above-mode-of-disbursement/above-mode-of-disbursement.component';
import { AboveRepaymentModalityOfCreditFacilitiesComponent } from './sme-loan-summary/above-ten-million/above-repayment-modality-of-credit-facilities/above-repayment-modality-of-credit-facilities.component';
import { AboveWaiverDeviationsDeferalsRebatesComponent } from './sme-loan-summary/above-ten-million/above-waiver-deviations-deferals-rebates/above-waiver-deviations-deferals-rebates.component';
import { AboveReviewOfCreditFacilitiesComponent } from './sme-loan-summary/above-ten-million/above-review-of-credit-facilities/above-review-of-credit-facilities.component';
import { GroupCreditFacilityReportComponent } from './group-credit-facility-report/group-credit-facility-report.component';
import { UptoTenMillionComponent } from './sme-loan-summary/upto-ten-million/upto-ten-million.component';
import { UptoDetailsOfTheCustomerComponent } from './sme-loan-summary/upto-ten-million/upto-details-of-the-customer/upto-details-of-the-customer.component';
import { SecurityArrangementComponent } from './sme-loan-summary/upto-ten-million/security-arrangement/security-arrangement.component';
import {AssessmentRequirementOfFundComponent} from './sme-loan-summary/upto-ten-million/assessment-requirement-of-fund/assessment-requirement-of-fund.component';
import { UptoOtherChargesComponent } from './sme-loan-summary/upto-ten-million/upto-other-charges/upto-other-charges.component';
import { UptoConvenantsComponent } from './sme-loan-summary/upto-ten-million/upto-convenants/upto-convenants.component';
import { UptoDisbursementModalityComponent } from './sme-loan-summary/upto-ten-million/upto-disbursement-modality/upto-disbursement-modality.component';
import { UptoRepaymentModalityComponent } from './sme-loan-summary/upto-ten-million/upto-repayment-modality/upto-repayment-modality.component';
import { NtaStatementAndInspectionComponent } from './sme-loan-summary/upto-ten-million/nta-statement-and-inspection/nta-statement-and-inspection.component';
import { WaiverDeviationsAndDeferralComponent } from './sme-loan-summary/upto-ten-million/waiver-deviations-and-deferral/waiver-deviations-and-deferral.component';
import { SanaByabasayiSaralKarjaComponent } from './sme-loan-summary/sana-byabasayi-saral-karja/sana-byabasayi-saral-karja.component';
import { SanaCurrentStatusAndPresentProposalComponent } from './sme-loan-summary/sana-byabasayi-saral-karja/sana-current-status-and-present-proposal/sana-current-status-and-present-proposal.component';
import { SanaSecurityArrangementComponent } from './sme-loan-summary/sana-byabasayi-saral-karja/sana-security-arrangement/sana-security-arrangement.component';
import { SanaAssessmentForRequirementOfFundComponent } from './sme-loan-summary/sana-byabasayi-saral-karja/sana-assessment-for-requirement-of-fund/sana-assessment-for-requirement-of-fund.component';
import { SanaOtherChargesComponent } from './sme-loan-summary/sana-byabasayi-saral-karja/sana-other-charges/sana-other-charges.component';
import { SanaCovenantsComponent } from './sme-loan-summary/sana-byabasayi-saral-karja/sana-covenants/sana-covenants.component';
import { SanaDisbursementModalityComponent } from './sme-loan-summary/sana-byabasayi-saral-karja/sana-disbursement-modality/sana-disbursement-modality.component';
import { SanaRepaymentModalityComponent } from './sme-loan-summary/sana-byabasayi-saral-karja/sana-repayment-modality/sana-repayment-modality.component';
import { SanaMisNrbReportingComponent } from './sme-loan-summary/sana-byabasayi-saral-karja/sana-mis-nrb-reporting/sana-mis-nrb-reporting.component';
import {SecurityTaggedModule} from '../../../loan-information-template/security/security-tagged-component/security-tagged.module';
import {SecurityTaggedViewModule} from '../../../loan-information-template/security/security-tagged-view/security-tagged-view.module';


const COMPONENTS = [
  SitevistSummaryComponentComponent,
  FinancialSummaryComponent,
  SecuritySummaryComponent,
  ProposalSummaryComponent,
  LoanSummaryComponent,
  InsuranceSummaryComponent,
  GuarantorSummaryComponent,
  CustomerGroupSummaryComponent,
  LoanSummaryComponent,
  CompanyInfoSummaryComponent,
  IncomeFromAccountSummeryComponent,
  ProposalJustificationSummaryComponent,
  FinancialRiskSummaryComponent,
  BusinessBackgroundComponent,
  CollateralSummaryComponent,
  NtaSummaryComponent,
  ProposalTermsAndConditionSummeryComponent,
  RoleHierarchyChainComponent
];

const ENTRY_COMPONENTS = [];

@NgModule({
  declarations: [
    ...COMPONENTS,
    MGroupSummaryComponent,
    CommentsSummaryComponent,
    PreviousSecuritySummaryComponent,
    SignatureSectionComponent,
    CreditFacilityReportComponent,
    SmeLoanSummaryComponent,
    CurrentStatusTableComponent,
    ConlusionReviewTableComponent,
    ExecutiveSummarySmeComponent,
    AboveTenMillionComponent,
    AboveBackgroundOfCustomerComponent,
    AssessmentForRequirementOfFundComponent,
    BankingRelationshipComponent,
    OtherChargesComponent,
    CovenantsComponent,
    NrbStatutoryRemarksStatusComponent,
    AboveRequestOfTheCustomerComponent,
    AbovePurposeJustificationForProposalComponent,
    AboveBusinessRelatedInformationComponent,
    AboveBankSolComponent,
    AboveInspectionComponent,
    AboveAssessmentOfFacilitiesRequirementComponent,
    AboveSecurityArrangementComponent,
    MGroupSummaryComponent,
    CommentsSummaryComponent,
    PreviousSecuritySummaryComponent,
    SignatureSectionComponent,
    CreditFacilityReportComponent,
    SmeLoanSummaryComponent,
    CurrentStatusTableComponent,
    ConlusionReviewTableComponent,
    ExecutiveSummarySmeComponent,
    AboveTenMillionComponent,
    AboveBackgroundOfCustomerComponent,
    AssessmentForRequirementOfFundComponent,
    BankingRelationshipComponent,
    OtherChargesComponent,
    CovenantsComponent,
    NrbStatutoryRemarksStatusComponent,
    AboveGroupExposureWithCcblComponent,
    AboveBankingArrangementOfTheCustomerComponent,
    AboveStockStatementComponent,
    AboveRiskAnalysisComponent,
    AboveSwotAnalysisComponent,
    AbovePricingAndEstimatedIncomeFromTheAccountComponent,
    AboveFixedAssetsCollateralComputationSheetComponent,
    AboveSpecialCovenantsComponent,
    AboveModeOfDisbursementComponent,
    AboveRepaymentModalityOfCreditFacilitiesComponent,
    AboveWaiverDeviationsDeferalsRebatesComponent,
    AboveReviewOfCreditFacilitiesComponent,
    GroupCreditFacilityReportComponent,
    UptoTenMillionComponent,
    UptoDetailsOfTheCustomerComponent,
    SecurityArrangementComponent,
    AssessmentRequirementOfFundComponent,
    UptoOtherChargesComponent,
    UptoConvenantsComponent,
    UptoDisbursementModalityComponent,
    UptoRepaymentModalityComponent,
    NtaStatementAndInspectionComponent,
    WaiverDeviationsAndDeferralComponent,
    SanaByabasayiSaralKarjaComponent,
    SanaCurrentStatusAndPresentProposalComponent,
    SanaSecurityArrangementComponent,
    SanaAssessmentForRequirementOfFundComponent,
    SanaOtherChargesComponent,
    SanaCovenantsComponent,
    SanaDisbursementModalityComponent,
    SanaRepaymentModalityComponent,
    SanaMisNrbReportingComponent,
  ],
    imports: [
        CommonModule,
        ThemeModule,
        LoanInformationTemplateModule,
        LoanSummaryRoutingModule,
        ReportingModule,
        NgxPrintModule,
        CoreModule,
        CbsGroupModule,
        NgSelectModule,
        LoanInformationViewModule,
        NepaliPatroModule,
        SecurityTaggedViewModule,
    ],
    exports: [
        LoanSummaryComponent,
        CustomerGroupSummaryComponent,
        IncomeFromAccountSummeryComponent,
        NtaSummaryComponent,
        ProposalTermsAndConditionSummeryComponent,
        CollateralSummaryComponent,
        ProposalJustificationSummaryComponent,
        SecuritySummaryComponent,
        GuarantorSummaryComponent,
        SitevistSummaryComponentComponent,
        InsuranceSummaryComponent,
        FinancialSummaryComponent,
        ProposalSummaryComponent,
        MGroupSummaryComponent,
        CommentsSummaryComponent,
        PreviousSecuritySummaryComponent,
        RoleHierarchyChainComponent,
        SignatureSectionComponent,
        CreditFacilityReportComponent,
        SmeLoanSummaryComponent,
        AboveSwotAnalysisComponent,
    ],
  entryComponents: [...ENTRY_COMPONENTS],
})
export class LoanSummaryModule {}
