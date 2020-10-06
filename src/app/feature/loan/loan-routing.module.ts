import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {DmsLoanFileComponent} from './component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {KycInfoComponent} from './component/loan-main-template/kyc-info/kyc-info.component';
import {LoanPullComponent} from './component/loan-pull/loan-pull.component';
import {LoanOfferLetterComponent} from './loan-offer-letter/loan-offer-letter.component';
import {OfferLetterComponent} from './component/offer-letter/offer-letter.component';
import {SummaryBaseComponent} from './summary-base/summary-base.component';
import {LoanInformationDetailViewComponent} from '../loan-information-detail-view/loan-information-detail-view.component';

export const routes: Routes = [
    {path: 'loanForm', component: LoanFormComponent},
    {path: 'loanDataHolder', component: DmsLoanFileComponent},
    {path: 'summary', component: SummaryBaseComponent},
    {path: 'kyc', component: KycInfoComponent},
    {path: 'offer-letter', component: OfferLetterComponent},
    {path: 'pull', component: LoanPullComponent},
    {path: 'loan-offer-letter', component: LoanOfferLetterComponent},
    {path: 'detailed-summary', component: LoanInformationDetailViewComponent},

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoanRoutingModule {
}
