import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoanSummaryComponent} from './loan-summary.component';
import {SitevistSummaryComponentComponent} from './sitevist-summary-component/sitevist-summary-component.component';
import {FinancialSummaryComponent} from './financial-summary/financial-summary.component';
import {InsuranceSummaryComponent} from './insurance-summary/insurance-summary.component';
import {GuarantorSummaryComponent} from './guarantor-summary/guarantor-summary.component';
import {CustomerGroupSummaryComponent} from './customer-group-summary/customer-group-summary.component';
import {ThemeModule} from '../../../../@theme/theme.module';
import {LoanSummaryRoutingModule} from './loan-summary-routing.module';
import {ProposalSummaryComponent} from './proposal-summary/proposal-summary.component';
import {ReportingModule} from '../../../reporting/reporting.module';
import {NgxPrintModule} from 'ngx-print';
import {CoreModule} from '../../../../@core/core.module';
import {CompanyInfoSummaryComponent} from './company-info-summary/company-info-summary.component';
import {IncomeFromAccountSummeryComponent} from './income-from-account-summery/income-from-account-summery.component';
import {LoanInformationTemplateModule} from '../../../loan-information-template/loan-information-template.module';
import {ProposalJustificationSummaryComponent} from './proposal-justification-summary/proposal-justification-summary.component';
import {BusinessBackgroundComponent} from './company-info-summary/business-background/business-background.component';
import {FinancialRiskSummaryComponent} from './financial-risk-summary/financial-risk-summary.component';
import {CollateralSummaryComponent} from './collateral-summary/collateral-summary.component';
import {NtaSummaryComponent} from './nta-summary/nta-summary.component';
import {ProposalTermsAndConditionSummeryComponent} from './proposal-terms-and-condition-summery/proposal-terms-and-condition-summery.component';
import {ApprovalSheetComponent} from './approval-sheet/approval-sheet.component';
import {CbsGroupModule} from '../../../cbs-group/cbs-group.module';
import {ApprovalSheetConfigComponent} from './approval-sheet-config/approval-sheet-config.component';
import {ApprovalSheetInfoComponent} from './approval-sheet-info/approval-sheet-info.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ApprovalSheetDocumentListComponent} from './approval-sheet/approval-sheet-document-list/approval-sheet-document-list.component';
import {LoanInformationViewModule} from '../../../loan-information-view/loan-information-view.module';
import {RoleHierarchyChainComponent} from './role-heirarchy-chain/role-hierarchy-chain.component';
import {NtaMegaSummaryComponent} from './nta-mega-summary/nta-mega-summary.component';
import {MGroupSummaryComponent} from './m-group-summary/m-group-summary.component';
import {CommentsSummaryComponent} from './comments-summary/comments-summary.component';
import {PreviousSecuritySummaryComponent} from '../../../loan-information-view/previous-security-summary/previous-security-summary.component';
import {NepaliPatroModule} from 'nepali-patro';
import {RemitDetailsComponent} from './remit-details/remit-details.component';
import {VideoKycModule} from '../../../video-kyc/video-kyc.module';
import {MultiBankingSummaryComponent} from './multi-banking-summary/multi-banking-summary.component';
import {NetWorthModule} from '../../../newt-worth/net-worth-module';
import {DbrModule} from '../../../dbr/dbr.module';
import { CollateralSiteVisitComponent } from './collateral-site-visit/collateral-site-visit.component';
import {ProductPaperModule} from '../../../loan-information-template/product-paper-checklist/product-paper-.module';
import {SecurityViewModule} from '../../../loan-information-view/security-view/security-view/security-view.module';
import {LoanSummaryInstitutionalComponent} from './loan-summary-institutional/loan-summary-institutional.component';
import {LoanSummaryIndividualComponent} from './loan-summary-individual/loan-summary-individual.component';
import { CustomerShareSummaryComponent } from './customer-share-summary/customer-share-summary.component';
import {
    FinancialAccountInformationModule
} from '../../../loan-information-template/financial-account-information/financial-account-information.module';
import {FeatureModule} from '../../../feature.module';
import {SecurityTotalSummaryModule} from '../../../security-total-summary/security-total-summary.module';
import {FacilityUtilizationModule} from '../facility-utilization/facility-utilization.module';
import { OnlyBusinessProfileComponent } from './company-info-summary/only-business-profile/only-business-profile.component';


const COMPONENTS = [
    SitevistSummaryComponentComponent,
    FinancialSummaryComponent,
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
    ApprovalSheetComponent,
    RoleHierarchyChainComponent,
    NtaMegaSummaryComponent,
    MultiBankingSummaryComponent
];

const ENTRY_COMPONENTS = [ApprovalSheetInfoComponent];

@NgModule({
    declarations: [...COMPONENTS, ApprovalSheetConfigComponent, ApprovalSheetInfoComponent, ApprovalSheetDocumentListComponent, MGroupSummaryComponent, CommentsSummaryComponent, PreviousSecuritySummaryComponent, RemitDetailsComponent, CollateralSiteVisitComponent,  LoanSummaryInstitutionalComponent,
        LoanSummaryIndividualComponent,
        CustomerShareSummaryComponent,
        OnlyBusinessProfileComponent],
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
        NepaliPatroModule,
        VideoKycModule,
        NetWorthModule,
        LoanInformationViewModule,
        DbrModule,
        ProductPaperModule,
        SecurityViewModule,
        FinancialAccountInformationModule,
        SecurityTotalSummaryModule,
        FacilityUtilizationModule,
    ],
    exports: [
        LoanSummaryComponent,
        CustomerGroupSummaryComponent,
        IncomeFromAccountSummeryComponent,
        NtaSummaryComponent,
        ProposalTermsAndConditionSummeryComponent,
        ApprovalSheetComponent,
        NtaMegaSummaryComponent,
        ApprovalSheetComponent,
        CollateralSummaryComponent,
        ProposalJustificationSummaryComponent,
        GuarantorSummaryComponent,
        SitevistSummaryComponentComponent,
        InsuranceSummaryComponent,
        FinancialSummaryComponent,
        MGroupSummaryComponent,
        CommentsSummaryComponent,
        PreviousSecuritySummaryComponent,
        RoleHierarchyChainComponent,
        RemitDetailsComponent,
        MultiBankingSummaryComponent,
        CollateralSiteVisitComponent,
        LoanSummaryInstitutionalComponent,
        LoanSummaryIndividualComponent,
        CompanyInfoSummaryComponent,
        OnlyBusinessProfileComponent,
    ],
    entryComponents: [...ENTRY_COMPONENTS]
})
export class LoanSummaryModule {
}
