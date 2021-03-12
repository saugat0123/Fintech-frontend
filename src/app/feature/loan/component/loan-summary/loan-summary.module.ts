import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoanSummaryComponent} from './loan-summary.component';
import {SitevistSummaryComponentComponent} from './sitevist-summary-component/sitevist-summary-component.component';
import {FinancialSummaryComponent} from './financial-summary/financial-summary.component';
import {SecuritySummaryComponent} from './security-summary/security-summary.component';
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
import { BusinessBackgroundComponent } from './company-info-summary/business-background/business-background.component';
import { FinancialRiskSummaryComponent } from './financial-risk-summary/financial-risk-summary.component';
import { CollateralSummaryComponent } from './collateral-summary/collateral-summary.component';
import { NtaSummaryComponent } from './nta-summary/nta-summary.component';
import { ProposalTermsAndConditionSummeryComponent } from './proposal-terms-and-condition-summery/proposal-terms-and-condition-summery.component';
import { ApprovalSheetComponent } from './approval-sheet/approval-sheet.component';
import {CbsGroupModule} from '../../../cbs-group/cbs-group.module';
import { ApprovalSheetConfigComponent } from './approval-sheet-config/approval-sheet-config.component';
import { ApprovalSheetInfoComponent } from './approval-sheet-info/approval-sheet-info.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { ApprovalSheetDocumentListComponent } from './approval-sheet/approval-sheet-document-list/approval-sheet-document-list.component';
import {RoleHierarchyChainComponent} from './role-heirarchy-chain/role-hierarchy-chain.component';


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
    ApprovalSheetComponent,
    RoleHierarchyChainComponent
];

const ENTRY_COMPONENTS = [ApprovalSheetInfoComponent];

@NgModule({
    declarations: [...COMPONENTS, ApprovalSheetConfigComponent, ApprovalSheetInfoComponent, ApprovalSheetDocumentListComponent ],
    imports: [
        CommonModule,
        ThemeModule,
        LoanInformationTemplateModule,
        LoanSummaryRoutingModule,
        ReportingModule,
        NgxPrintModule,
        CoreModule,
        CbsGroupModule,
        NgSelectModule
    ],
    exports: [
        LoanSummaryComponent,
        CustomerGroupSummaryComponent,
        IncomeFromAccountSummeryComponent,
        NtaSummaryComponent,
        ProposalTermsAndConditionSummeryComponent,
        ApprovalSheetComponent
    ],
    entryComponents: [...ENTRY_COMPONENTS]
})
export class LoanSummaryModule {
}
