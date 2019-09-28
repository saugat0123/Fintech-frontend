import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { FeatureComponent } from './feature.component';
import { PendingsLoanComponent } from '../component/dashboard/pending/pendings/pendings-loan.component';

const routes: Routes = [
    {
        path: '', component: FeatureComponent,
        children: [
            { path: 'status/:name', component: PendingsLoanComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
            { path: 'memo', loadChildren: () => import('./memo/memo.module').then(m => m.MemoModule) },
            { path: 'loan', loadChildren: () => import('./loan/loan.module').then(m => m.LoanModule) },
            { path: '', redirectTo: 'dashboard' },
            { path: '**', redirectTo: 'dashboard' }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule {
}
