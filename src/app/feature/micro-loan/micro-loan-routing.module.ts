import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MicroSummaryComponent} from './summary/micro-summary/micro-summary.component';


const routes: Routes = [
  {
    path: 'micro-loan-summary', component: MicroSummaryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MicroLoanRoutingModule {
}
