import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from '../component/dashboard/dashboard.component';
import {NgModule} from '@angular/core';
import {FeatureComponent} from './feature.component';
import {PendingsComponent} from '../component/dashboard/pendings/pendings.component';

const routes: Routes = [
    {
        path: '', component: FeatureComponent,
        children: [
            {path: 'pending', component: PendingsComponent},
            {path: 'dashboard', component: DashboardComponent},
            {path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
            {path: 'memo', loadChildren: './memo/memo.module#MemoModule'},
            {path: 'loan', loadChildren: './loan/loan.module#LoanModule'},
            {path: '', redirectTo: 'dashboard'},
            {path: '**', redirectTo: 'dashboard'}
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule {
}
