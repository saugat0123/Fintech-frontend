import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InsuranceViewComponent} from './insurance-view/insurance-view.component';
import {CoreModule} from '../../@core/core.module';
import {FinancialViewComponent} from "./financial-view/financial-view.component";
import {NbTabsetModule} from "@nebular/theme";



@NgModule({
  declarations: [InsuranceViewComponent, FinancialViewComponent],
  exports: [
    InsuranceViewComponent,
    FinancialViewComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    NbTabsetModule
  ]
})
export class LoanInformationViewModule {
}
