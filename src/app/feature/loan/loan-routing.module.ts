import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {DmsLoanFileComponent} from './component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {LoanSummaryComponent} from './component/loan-summary/loan-summary.component';
import {KycInfoComponent} from './component/loan-main-template/kyc-info/kyc-info.component';
import {LoanPullComponent} from './component/loan-pull/loan-pull.component';
import {LoanOfferLetterComponent} from './loan-offer-letter/loan-offer-letter.component';
import {OfferLetterComponent} from './component/offer-letter/offer-letter.component';
import {AllTemplateDetailsComponent} from './component/loan-summary/all-template-details/all-template-details.component';

export const routes: Routes = [
    {path: 'loanForm', component: LoanFormComponent},
    {path: 'loanDataHolder', component: DmsLoanFileComponent},
    {path: 'summary', component: LoanSummaryComponent},
    {path: 'detailed-summary', component: AllTemplateDetailsComponent},
    {path: 'kyc', component: KycInfoComponent},
    {path: 'offer-letter', component: OfferLetterComponent},
    {path: 'pull', component: LoanPullComponent},
    {path: 'loan-offer-letter', component: LoanOfferLetterComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoanRoutingModule {
}
