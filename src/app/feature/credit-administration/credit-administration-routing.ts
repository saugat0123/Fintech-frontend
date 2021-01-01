import {Routes} from '@angular/router';
import {LoanListComponent} from './component/loan-list/loan-list.component';
import {OfferLetterListComponent} from './component/offer-letter-list/offer-letter-list.component';
import {CadOfferLetterProfileComponent} from './cad-offerletter-profile/cad-offerletter-profile.component';

export const routes: Routes = [
    {path: 'offer-pending', component: OfferLetterListComponent},
    {path: 'offer-letter-profile', component: CadOfferLetterProfileComponent},

    {path: '', component: LoanListComponent},
];
