import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {DmsLoanFileComponent} from './component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {KycInfoComponent} from './component/loan-main-template/kyc-info/kyc-info.component';
import {LoanPullComponent} from './component/loan-pull/loan-pull.component';
import {LoanOfferLetterComponent} from './loan-offer-letter/loan-offer-letter.component';
import {SummaryBaseComponent} from './summary-base/summary-base.component';
import {LoanInformationDetailViewComponent} from '../loan-information-detail-view/loan-information-detail-view.component';
import {CadDocumentUploadComponent} from '../loan-information-template/cad-document-upload/cad-document-upload.component';
import { PostApprovalFormComponent } from './loan-offer-letter/post-approval-form/post-approval-form.component';
import {CatalogueComponent} from "../admin/component/catalogue/catalogue.component";
import {TransferDocComponent} from "./transfer-doc/transfer-doc.component";
import {MicroLoanDetailViewBaseComponent} from '../micro-loan/detail-view/micro-loan-detail-view-base/micro-loan-detail-view-base.component';

export const routes: Routes = [
    {path: 'loanForm', component: LoanFormComponent},
    {path: 'loanDataHolder', component: DmsLoanFileComponent},
    {path: 'summary', component: SummaryBaseComponent},
    {path: 'kyc', component: KycInfoComponent},
    {path: 'pull', component: LoanPullComponent},
    {path: 'loan-offer-letter', component: LoanOfferLetterComponent},
    {path: 'detailed-summary', component: LoanInformationDetailViewComponent},
    {path: 'micro-detailed-summary', component: MicroLoanDetailViewBaseComponent},
    {path: 'cad-document', component: CadDocumentUploadComponent},
    {path: 'transfer-doc', component: TransferDocComponent},
    {path: 'post-approval-form', component: PostApprovalFormComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoanRoutingModule {
}
