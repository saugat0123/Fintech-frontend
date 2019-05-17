import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from '../component/dashboard/dashboard.component';
import {NgModule} from '@angular/core';
import {ModuleComponent} from './module.component';

const routes: Routes = [
    {
        path: '', component: ModuleComponent,
        children: [
            {path: 'dashboard', component: DashboardComponent},
            {path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
            {path: 'memo', loadChildren: './memo/memo.module#MemoModule'},
            {path: 'loan', loadChildren: './module/loan/loan.module#LoanModule'},
            {path: '', redirectTo: 'dashboard'},
            {path: '**', redirectTo: 'dashboard'}
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModuleRoutingModule {
}
