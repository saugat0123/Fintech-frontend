import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaseComponent} from './component/base/base.component';
import {DashboardComponent} from './component/dashboard/dashboard.component';
import {LoginComponent} from './component/login/login.component';
import {AuthGuard} from './shared-service/authentication/auth.guard';


const routes: Routes = [
    {
        path: 'home', component: BaseComponent, canActivate: [AuthGuard],
        children: [
            {path: 'dashboard', component: DashboardComponent},
            {path: '', loadChildren: './module/admin/admin.module#AdminModule'},
            {path: 'memo', loadChildren: './module/memo/memo.module#MemoModule'},
            {path: 'loan', loadChildren: './module/loan/loan.module#LoanModule'}
        ],


    },
    {path: '', component: LoginComponent}
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
