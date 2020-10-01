import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoanSummaryComponent} from './loan-summary.component';
import {CoreModule} from '../../../../@core/core.module';


const routes: Routes = [
  {path: '' , component: LoanSummaryComponent}
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule
  ],
})
export class LoanSummaryRoutingModule { }
