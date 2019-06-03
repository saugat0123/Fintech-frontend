import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {DmsLoanFileComponent} from './component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {DmsSummaryComponent} from './component/loan-main-template/dms-summary/dms-summary.component';

export const routes: Routes = [
    {path: 'loanForm', component: LoanFormComponent},
    {path: 'loanType', component: DmsLoanFileComponent},
    {path: 'summary/:id', component: DmsSummaryComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoanRoutingModule {
}
