import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportDashboardComponent} from './component/report-dashboard/report-dashboard.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: ReportDashboardComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule {
}
