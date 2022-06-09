import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ThemeModule} from '../../@theme/theme.module';
import {CoreModule} from '../../@core/core.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {RouterModule} from '@angular/router';
import {CreditMemoRoutes} from './credit-memo-routes';
import {ActionComponent} from './component/action/action.component';
import {ComposeComponent} from './component/compose/compose.component';
import {CreditMemoBaseComponent} from './component/credit-memo-base/credit-memo-base.component';
import {CreditMemoTypeComponent} from './component/credit-memo-type/credit-memo-type.component';
import {ReadComponent} from './component/read/read.component';
import {ViewMemoComponent} from './component/view-memo/view-memo.component';
import {CreditMemoTypeFormComponent} from './component/credit-memo-type/credit-memo-type-form/credit-memo-type-form.component';
import {UserVerificationModalComponent} from './component/user-verification-modal/user-verification-modal.component';
import {
    CreditMemoTypeDeleteModalComponent
} from './component/credit-memo-type/credit-memo-type-delete-modal/credit-memo-type-delete-modal.component';
import {NgxPrintModule} from 'ngx-print';
import {LoanSummaryModule} from '../loan/component/loan-summary/loan-summary.module';
import {SecurityViewModule} from '../loan-information-view/security-view/security-view/security-view.module';

@NgModule({
    declarations: [
        ActionComponent,
        ComposeComponent,
        CreditMemoBaseComponent,
        CreditMemoTypeComponent,
        ReadComponent,
        ViewMemoComponent,
        UserVerificationModalComponent,
        CreditMemoTypeFormComponent,
        CreditMemoTypeDeleteModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ThemeModule,
        CoreModule,
        NgSelectModule,
        SecurityViewModule,
        RouterModule.forChild(CreditMemoRoutes),
        NgxPrintModule,
        LoanSummaryModule
    ],
    entryComponents: [
        ActionComponent,
        UserVerificationModalComponent,
        CreditMemoTypeFormComponent,
        CreditMemoTypeDeleteModalComponent
    ]
})
export class CreditMemoModule {
}
