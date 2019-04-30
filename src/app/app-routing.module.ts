import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaseComponent} from './component/base/base.component';
import {DashboardComponent} from './component/dashboard/dashboard.component';
import {LoginComponent} from './component/login/login.component';
import {BranchComponent} from './component/branch/branch.component';
import {UserComponent} from './component/user/user.component';


const routes: Routes = [
    {
        path: 'home', component: BaseComponent,
        children: [
            {path: 'dashboard', component: DashboardComponent},
            {path: 'branch', component: BranchComponent},
            {path: 'user', component: UserComponent},
        ],
    },
    // {path: '', component: LoginComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
