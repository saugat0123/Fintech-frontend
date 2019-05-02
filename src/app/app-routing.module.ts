import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaseComponent} from './component/base/base.component';
import {DashboardComponent} from './component/dashboard/dashboard.component';
import {LoginComponent} from './component/login/login.component';


const routes: Routes = [
    {
        path: 'home', component: BaseComponent,
        children: [
            {path: 'dashboard', component: DashboardComponent},
            {path: '', loadChildren: './module/admin/admin.module#AdminModule'}
        ],


    },
    {path: '', component: LoginComponent},

    { path: 'customer', loadChildren: './module/customer-eligibility/customer-eligibility.module#CustomerEligibilityModule' }

];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
