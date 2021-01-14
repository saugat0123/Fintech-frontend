import {Routes} from '@angular/router';
import {LoanListComponent} from './component/loan-list/loan-list.component';
import {OfferLetterListComponent} from './component/offer-letter/offer-letter-list/offer-letter-list.component';
import {LegalAndDisbursementComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/legal-and-disbursement.component';
import {OfferLetterApprovedComponent} from './component/offer-letter/offer-letter-approved/offer-letter-approved.component';
import {LegalReviewPendingComponent} from './component/legal/legal-review-pending/legal-review-pending.component';
import {LegalReviewApprovedComponent} from './component/legal/legal-review-approved/legal-review-approved.component';
import {DisbursementPendingComponent} from './component/disbursement/disbursement-pending/disbursement-pending.component';
import {DisbursementApprovedComponent} from './component/disbursement/disbursement-approved/disbursement-approved.component';
import {CadDocumentListComponent} from './component/cad-document-list/cad-document-list.component';
import {CadSummaryComponent} from './cad-work-flow/cad-summary/cad-summary.component';

/** Always add new route to RouteConst.ts file as a static route Variable **/
export const routes: Routes = [
    {path: 'offer-pending', component: OfferLetterListComponent},
    {path: 'offer-approved', component: OfferLetterApprovedComponent},
    {path: 'legal-pending', component: LegalReviewPendingComponent},
    {path: 'legal-approved', component: LegalReviewApprovedComponent},
    {path: 'disbursement-pending', component: DisbursementPendingComponent},
    {path: 'disbursement-approved', component: DisbursementApprovedComponent},
    {path: 'offer-letter-profile', component: LegalAndDisbursementComponent},
    {path: 'cad-documents', component: CadDocumentListComponent},
    {path: 'cad-summary/:id', component: CadSummaryComponent},

    {path: '', component: LoanListComponent},
];
