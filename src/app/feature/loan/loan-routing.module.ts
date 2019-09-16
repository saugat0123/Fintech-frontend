import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {DmsLoanFileComponent} from './component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {LoanSummaryComponent} from './component/loan-summary/loan-summary.component';
import {KycInfoComponent} from './component/loan-main-template/kyc-info/kyc-info.component';
import {BirthMarkLetterNepaliComponent} from './component/offer-letter/birth-mark-letter/birth-mark-letter-nepali.component';
import {SuccessOfferLetterComponent} from './component/offer-letter/success-offer-letter/success-offer-letter.component';
import {LoanPullComponent} from './component/loan-pull/loan-pull.component';

export const routes: Routes = [
    {path: 'loanForm', component: LoanFormComponent},
    {path: 'loanDataHolder', component: DmsLoanFileComponent},
    {path: 'summary', component: LoanSummaryComponent},
    {path: 'kyc', component: KycInfoComponent},
    {path: 'birth-mark-letter', component: BirthMarkLetterNepaliComponent},
    {path: 'success-offer-letter', component: SuccessOfferLetterComponent},
    {path: 'pull', component: LoanPullComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoanRoutingModule {
}
