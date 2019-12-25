import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomerComponent} from './component/customer-list/customer.component';


export const routes: Routes = [
    {path: '', component: CustomerComponent},

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule {
}
