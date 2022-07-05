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
import {GuarantorComponent} from './guarantor/guarantor.component';
import {InsuranceComponent} from './insurance/insurance.component';
import {CustomerLoanDocumentComponent} from './customer-loan-document/customer-loan-document.component';
import {CreditRiskGradingAlphaComponent} from './credit-risk-grading-alpha/credit-risk-grading-alpha.component';
import {CreditGradingComponent} from './credit-grading/credit-grading.component';
import {ProposalComponent} from './proposal/proposal.component';
import {CreditRiskGradingGammaComponent} from './credit-risk-grading-gamma/credit-risk-grading-gamma.component';
import {CiclComponent} from './cicl/cicl.component';
import {FinancialDeleteComponentComponent} from './financial/financial-delete-component/financial-delete-component.component';
import {TemplateDocumentComponent} from './template-document/template-document.component';
import {CKEditorModule} from 'ng2-ckeditor';
import {IncomeFromAccountComponent} from './income-from-account/income-from-account.component';
import {NetTradingAssetsComponent} from './net-trading-assets/net-trading-assets.component';
import {CreditChecklistGeneralComponent} from './credit-checklist-general/credit-checklist-general.component';
import {CreditRiskGradingLambdaComponent} from './credit-risk-grading-lambda/credit-risk-grading-lambda.component';
import {CadDocumentUploadComponent} from './cad-document-upload/cad-document-upload.component';
import {SecurityRevaluationComponent} from './security/security-initial-form/security-revaluation/security-revaluation.component';
import {FeatureModule} from '../feature.module';
import {OwnerKycApplicableComponent} from './security/security-initial-form/owner-kyc-applicable/owner-kyc-applicable.component';
import {NtaMegaComponent} from './nta-mega/nta-mega.component';
import {MicroProposalComponent} from '../micro-loan/form-component/micro-proposal/micro-proposal.component';
import {CommentsComponent} from './comments/comments.component';
import {PreviousSecurityComponent} from './previous-security/previous-security.component';
import {FixAssetCollateralComponent} from './security/security-initial-form/fix-asset-collateral/fix-asset-collateral.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {CrgMicroComponent} from './crg-micro/crg-micro.component';
import {CreateDocumentComponent} from './security/security-initial-form/create-document/create-document.component';
import {CreditAdministrationModule} from '../credit-administration/credit-administration.module';
import {ReviewDateComponent} from './review-date/review-date.component';
import {MultiBankingComponent} from './multi-banking/multi-banking.component';
import {FinancialUploadViewComponent} from './financial/financial-upload-view/financial-upload-view.component';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';
import {LandBuildingComponent} from './security/land-building/land-building.component';
import {VehicleComponent} from './security/vehicle/vehicle.component';
import {ApartmentComponent} from './security/apartment/apartment.component';
import {PlantMachineryComponent} from './security/plant-machinery/plant-machinery.component';
import {FixedDepositComponent} from './security/fixed-deposit/fixed-deposit.component';
import {ShareComponent} from './security/share/share.component';
import {HypothecationOfStockComponent} from './security/hypothecation-of-stock/hypothecation-of-stock.component';
import {CorporationGuaranteeComponent} from './security/corporation-guarantee/corporation-guarantee.component';
import {PersonalGuaranteeComponent} from './security/personal-guarantee/personal-guarantee.component';
import {InsurancePolicyComponent} from './security/insurance-policy/insurance-policy.component';
import {AssignmentOfReceivableComponent} from './security/assignment-of-receivable/assignment-of-receivable.component';
import {LeaseAssignmentComponent} from './security/lease-assignment/lease-assignment.component';
import {OtherSecurityComponent} from './security/other-security/other-security.component';
import {LandComponent} from './security/land/land.component';
import {ViewSecurityTableComponent} from './security/view-security-table/view-security-table.component';
import {SecurityTaggedModule} from './security/security-tagged-component/security-tagged.module';
import { GroupSummarySheetComponent } from './group-summary-sheet/group-summary-sheet.component';
import { OtherDetailsComponent } from './other-details/other-details.component';

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
    GuarantorComponent,
    InsuranceComponent,
    CustomerLoanDocumentComponent,
    CreditRiskGradingAlphaComponent,
    CreditGradingComponent,
    ProposalComponent,
    CreditRiskGradingGammaComponent,
    FinancialDeleteComponentComponent,
    CiclComponent,
    TemplateDocumentComponent,
    NetTradingAssetsComponent,
    IncomeFromAccountComponent,
    CreditRiskGradingLambdaComponent,
    CreditChecklistGeneralComponent,
    SecurityRevaluationComponent,
    OwnerKycApplicableComponent,
    CadDocumentUploadComponent,
    NtaMegaComponent,
    PreviousSecurityComponent,
    FixAssetCollateralComponent,
    CreateDocumentComponent,
    ReviewDateComponent,
    MultiBankingComponent,
];


@NgModule({
    declarations: [...COMPONENTS, CadDocumentUploadComponent, MicroProposalComponent, CommentsComponent, PreviousSecurityComponent,
        CrgMicroComponent,
        FinancialUploadViewComponent,
        LandBuildingComponent,
        VehicleComponent,
        ApartmentComponent,
        PlantMachineryComponent,
        FixedDepositComponent,
        ShareComponent,
        HypothecationOfStockComponent,
        CorporationGuaranteeComponent,
        PersonalGuaranteeComponent,
        InsurancePolicyComponent,
        AssignmentOfReceivableComponent,
        LeaseAssignmentComponent,
        OtherSecurityComponent,
        LandComponent,
        ViewSecurityTableComponent,
        GroupSummarySheetComponent,
        OtherDetailsComponent],
    exports: [...COMPONENTS, MicroProposalComponent, CommentsComponent, CrgMicroComponent, FinancialUploadViewComponent, GroupSummarySheetComponent, OtherDetailsComponent],
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
        CreditAdministrationModule,
        CoreModule,
        LoanInformationViewModule,
        SecurityTaggedModule,
    ],
    providers: [
        NgbActiveModal
    ]
})
export class LoanInformationTemplateModule {
}
