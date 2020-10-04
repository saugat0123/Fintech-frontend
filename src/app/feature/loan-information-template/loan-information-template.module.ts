import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SiteVisitComponent} from './site-visit/site-visit.component';
import {ThemeModule} from '../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
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
import {QuillModule} from 'ngx-quill';
import {CKEditorModule} from 'ng2-ckeditor';

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
  TemplateDocumentComponent
];

const modules = {
  table: true,
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'table'],        // toggled buttons
    ['blockquote', 'code-block'],


    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction

    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],

    ['clean'],                                         // remove formatting button
    // link and image, video
  ]
};

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
    QuillModule.forRoot({modules: modules}),
      CKEditorModule
  ]
})
export class LoanInformationTemplateModule {
}
