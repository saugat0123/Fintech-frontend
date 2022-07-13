import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from '../component/dashboard/dashboard.component';
import {NgModule} from '@angular/core';
import {FeatureComponent} from './feature.component';
import {PendingsLoanComponent} from '../component/dashboard/pending/pendings/pendings-loan.component';
import {ApprovalRoleHierarchyComponent} from './loan/approval/approval-role-hierarchy.component';
import {RouteGuard} from '../@core/service/authentication/route-guard';
import {ErrorPageComponent} from './error-page/error-page.component';

const routes: Routes = [
  {
    path: '', component: FeatureComponent,
    children: [
      {path: 'status/:name', component: PendingsLoanComponent},
      {path: 'dashboard', component: DashboardComponent},
      {
        path: 'approval-role-hierarchy/:type/:refId',
        component: ApprovalRoleHierarchyComponent
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [RouteGuard]
      },
      {
        path: 'memo',
        loadChildren: () => import('./memo/memo.module').then(m => m.MemoModule)
      },
      {
        path: 'loan',
        loadChildren: () => import('./loan/loan.module').then(m => m.LoanModule)
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./reporting/reporting.module').then(m => m.ReportingModule),
        canActivate: [RouteGuard]
      },
      {
        path: 'update-loan',
        loadChildren: () => import('./loan-update/loan-update.module').then(m => m.LoanUpdateModule)
      },
      {
        path: 'crg',
        loadChildren: () => import('./credit-risk-grading/credit-risk-grading.module').then(m => m.CreditRiskGradingModule)
      },

      {
        path: 'customer-activity',
        loadChildren: () => import('./customer-activity/customer-activity.module').then(m => m.CustomerActivityModule)
      },
      {
        path: 'cad-document',
        loadChildren: () => import('./cad-documents/cad-documents.module').then(m => m.CadDocumentsModule)
      },

      {
        path: 'template',
        loadChildren: () => import('./form-builder/form-builder.module').then(m => m.FormBuilderModule)
      },

      {
        path: 'credit',
        loadChildren: () => import('./credit-administration/credit-administration.module').then(m => m.CreditAdministrationModule)
      },
      {
        path: 'error',
        component: ErrorPageComponent
      },
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
