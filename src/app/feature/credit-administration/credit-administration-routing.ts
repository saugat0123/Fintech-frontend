import {Routes} from '@angular/router';
import {CreditAdminCoreComponent} from './component/credit-admin-core/credit-admin-core.component';
import {CreditLettersComponent} from './component/credit-letters/credit-letters.component';

export const routes: Routes = [
    {path: '', component: CreditAdminCoreComponent},
    {path: 'offer-pending', component: CreditLettersComponent},
    {path: 'offer-approved', component: CreditLettersComponent},
    {path: 'legal-pending', component: CreditLettersComponent},
    {path: 'legal-approved', component: CreditLettersComponent},
    {path: 'disbursement-pending', component: CreditLettersComponent},
    {path: 'disbursement-approved', component: CreditLettersComponent},
];
