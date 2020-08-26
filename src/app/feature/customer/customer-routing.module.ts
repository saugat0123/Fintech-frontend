import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomerComponent} from './component/customer-list/customer.component';
import {CustomerProfileComponent} from './component/customer-profile/customer-profile.component';
import {CompanyProfileComponent} from './component/company-profile/company-profile.component';


export const routes: Routes = [
    {path: '', component: CustomerComponent},
    {path: 'profile/:id', component: CustomerProfileComponent},
    {path: 'company-profile/:id', component: CompanyProfileComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule {
}
