import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SiteVisitComponent} from './site-visit/site-visit.component';
import {ThemeModule} from '../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// @ts-ignore
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
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
import {CreditRiskGradingAlphaComponent} from './credit-risk-grading-alpha/credit-risk-grading-alpha.component';
import {CreditGradingComponent} from './credit-grading/credit-grading.component';
import {ProposalComponent} from './proposal/proposal.component';
import {CreditRiskGradingGammaComponent} from './credit-risk-grading-gamma/credit-risk-grading-gamma.component';
import {CiclComponent} from './cicl/cicl.component';
import {FinancialDeleteComponentComponent} from './financial/financial-delete-component/financial-delete-component.component';
import {TemplateDocumentComponent} from './template-document/template-document.component';
import {CKEditorModule} from 'ng2-ckeditor';
import { IncomeFromAccountComponent } from './income-from-account/income-from-account.component';
import { NetTradingAssetsComponent } from './net-trading-assets/net-trading-assets.component';
import { CreditChecklistGeneralComponent } from './credit-checklist-general/credit-checklist-general.component';
import { CreditRiskGradingLambdaComponent } from './credit-risk-grading-lambda/credit-risk-grading-lambda.component';

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
  CreditChecklistGeneralComponent
];


@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
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
    CKEditorModule
  ]
})
export class LoanInformationTemplateModule {
}
