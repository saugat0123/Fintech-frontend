import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {DmsLoanFileComponent} from './component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {LoanSummaryComponent} from './component/loan-summary/loan-summary.component';
import {KycInfoComponent} from './component/loan-main-template/kyc-info/kyc-info.component';
import {OfferLetterNepaliComponent} from './component/loan-main-template/offer-letter-nepali/offer-letter-nepali.component';

export const routes: Routes = [
    {path: 'loanForm', component: LoanFormComponent},
    {path: 'loanType', component: DmsLoanFileComponent},
    {path: 'summary', component: LoanSummaryComponent},
    {path: 'kyc', component: KycInfoComponent},
    {path: 'offerLetter', component: OfferLetterNepaliComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoanRoutingModule {
}
