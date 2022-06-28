import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {LoanPullComponent} from './component/loan-pull/loan-pull.component';
import {LoanOfferLetterComponent} from './loan-offer-letter/loan-offer-letter.component';
import {CadDocumentUploadComponent} from '../loan-information-template/cad-document-upload/cad-document-upload.component';
import { PostApprovalFormComponent } from './loan-offer-letter/post-approval-form/post-approval-form.component';

export const routes: Routes = [
    {path: 'loanForm', component: LoanFormComponent},
    {path: 'pull', component: LoanPullComponent},
    {path: 'loan-offer-letter', component: LoanOfferLetterComponent},
    {path: 'cad-document', component: CadDocumentUploadComponent},
    {path: 'post-approval-form', component: PostApprovalFormComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoanRoutingModule {
}
