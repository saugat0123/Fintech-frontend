import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UnassignedLoanComponent} from './component/unassigned-loan-list/unassigned-loan.component';
import {RouterModule} from '@angular/router';
import {routes} from './credit-administration-routing';
import {ThemeModule} from '../../@theme/theme.module';
import {AssignPopUpComponent} from './component/assign-pop-up/assign-pop-up.component';
import {LoanListComponent} from './component/loan-list/loan-list.component';
import {VerifyPopUpComponent} from './component/verify-pop-up/verify-pop-up.component';
import {CreditAdminCoreComponent} from './component/credit-admin-core/credit-admin-core.component';
import {CreditLettersComponent} from './component/credit-letters/credit-letters.component';
import {OfferLetterActionComponent} from './component/offer-letter-action/offer-letter-action.component';


@NgModule({
    declarations: [UnassignedLoanComponent, AssignPopUpComponent, LoanListComponent,
        VerifyPopUpComponent, CreditAdminCoreComponent, CreditLettersComponent,
        OfferLetterActionComponent],
    imports: [
        ThemeModule,
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class CreditAdministrationModule {
}
