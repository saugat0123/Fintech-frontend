import {Routes} from '@angular/router';
import {LoanListComponent} from './component/loan-list/loan-list.component';
import {OfferLetterListComponent} from './component/offer-letter-list/offer-letter-list.component';
import {CadOfferLetterProfileComponent} from './cad-offerletter-profile/cad-offerletter-profile.component';
import {LegalAndDisbursementComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/legal-and-disbursement.component';

export const routes: Routes = [
    {path: 'offer-pending', component: OfferLetterListComponent},
    {path: 'offer-letter-profile', component: LegalAndDisbursementComponent},

    {path: '', component: LoanListComponent},
];
