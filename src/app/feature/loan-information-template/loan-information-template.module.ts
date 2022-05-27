import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SiteVisitComponent} from './site-visit/site-visit.component';
import {ThemeModule} from '../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// @ts-ignore
import {NgbActiveModal, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
// @ts-ignore
import {NbDatepickerModule, NbDialogModule} from '@nebular/theme';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../../../environments/environment';
import {FinancialComponent} from './financial/financial.component';
import {IncomeStatementComponent} from './financial/income-statement/income-statement.component';
import {BalanceSheetComponent} from './financial/balance-sheet/balance-sheet.component';
import {CashFlowStatementComponent} from './financial/cash-flow-statement/cash-flow-statement.component';
import {KeyIndicatorsComponent} from './financial/key-indicators/key-indicators.component';
import {InitialFormComponent} from './financial/initial-form/initial-form.component';
import {FiscalYearModalComponent} from './financial/fiscal-year-modal/fiscal-year-modal.component';
import {CoreModule} from '../../@core/core.module';
import {SecurityComponent} from './security/security.component';
import {SecurityInitialFormComponent} from './security/security-initial-form/security-initial-form.component';
import {GuarantorComponent} from './guarantor/guarantor.component';
import {InsuranceComponent} from './insurance/insurance.component';
import {CustomerLoanDocumentComponent} from './customer-loan-document/customer-loan-document.component';
import {CreditGradingComponent} from './credit-grading/credit-grading.component';
import {ProposalComponent} from './proposal/proposal.component';
import {CiclComponent} from './cicl/cicl.component';
import {FinancialDeleteComponentComponent} from './financial/financial-delete-component/financial-delete-component.component';
import {TemplateDocumentComponent} from './template-document/template-document.component';
import {CKEditorModule} from 'ng2-ckeditor';
import {IncomeFromAccountComponent} from './income-from-account/income-from-account.component';
import {NetTradingAssetsComponent} from './net-trading-assets/net-trading-assets.component';
import {CreditChecklistGeneralComponent} from './credit-checklist-general/credit-checklist-general.component';
import {CadDocumentUploadComponent} from './cad-document-upload/cad-document-upload.component';
import {SecurityRevaluationComponent} from './security/security-initial-form/security-revaluation/security-revaluation.component';
import {FeatureModule} from '../feature.module';
import {OwnerKycApplicableComponent} from './security/security-initial-form/owner-kyc-applicable/owner-kyc-applicable.component';
import {CommentsComponent} from './comments/comments.component';
import {PreviousSecurityComponent} from './previous-security/previous-security.component';
import {FixAssetCollateralComponent} from './security/security-initial-form/fix-asset-collateral/fix-asset-collateral.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {SecurityTableComponent} from './security/security-initial-form/security-table/security-table.component';
import {CreateDocumentComponent} from './security/security-initial-form/create-document/create-document.component';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';
import { SwotAnalysisComponent } from './swot-analysis/swot-analysis.component';
import {CreditAdministrationModule} from '../credit-administration/credit-administration.module';
import { FinancialCcblComponent } from './financial-ccbl/financial-ccbl.component';

const COMPONENTS = [
    SiteVisitComponent,
    // Financial components--
    FinancialComponent,
    IncomeStatementComponent,
    BalanceSheetComponent,
    CashFlowStatementComponent,
    KeyIndicatorsComponent,
    InitialFormComponent,
    FiscalYearModalComponent,
    SecurityComponent,
    SecurityInitialFormComponent,
    GuarantorComponent,
    InsuranceComponent,
    CustomerLoanDocumentComponent,
    CreditGradingComponent,
    ProposalComponent,
    FinancialDeleteComponentComponent,
    CiclComponent,
    TemplateDocumentComponent,
    NetTradingAssetsComponent,
    IncomeFromAccountComponent,
    CreditChecklistGeneralComponent,
    SecurityRevaluationComponent,
    OwnerKycApplicableComponent,
    CadDocumentUploadComponent,
    PreviousSecurityComponent,
    FixAssetCollateralComponent,
    SecurityTableComponent,
    CreateDocumentComponent,
];


@NgModule({
    declarations: [...COMPONENTS, CadDocumentUploadComponent,  CommentsComponent, PreviousSecurityComponent,
        SwotAnalysisComponent,
        ],
    exports: [...COMPONENTS,  CommentsComponent, SwotAnalysisComponent],
    entryComponents: [...COMPONENTS],
    imports: [
        CommonModule,
        ThemeModule,
        FormsModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        NgSelectModule,
        NbDatepickerModule,
        NepaliCalendarModule,
        NbDialogModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_MAP_API_KEY
        }),
        CoreModule,
        CKEditorModule,
        FeatureModule,
        AngularDraggableModule,
        LoanInformationViewModule,
        CreditAdministrationModule
    ],
    providers: [
        NgbActiveModal
    ]
})
export class LoanInformationTemplateModule {
}
