import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UnassignedLoanComponent} from './component/unassigned-loan-list/unassigned-loan.component';
import {RouterModule} from '@angular/router';
import {routes} from './credit-administration-routing';
import {ThemeModule} from '../../@theme/theme.module';
import {AssignPopUpComponent} from './component/assign-pop-up/assign-pop-up.component';
import {LoanListComponent} from './component/loan-list/loan-list.component';
import {VerifyPopUpComponent} from './component/verify-pop-up/verify-pop-up.component';


@NgModule({
    declarations: [UnassignedLoanComponent,
        AssignPopUpComponent,
        LoanListComponent,
        VerifyPopUpComponent],
    imports: [
        ThemeModule,
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [AssignPopUpComponent, VerifyPopUpComponent],
    entryComponents: [AssignPopUpComponent, VerifyPopUpComponent]
})
export class CreditAdministrationModule {
}
