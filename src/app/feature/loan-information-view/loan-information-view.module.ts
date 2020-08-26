import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InsuranceViewComponent} from './insurance-view/insurance-view.component';
import {CoreModule} from '../../@core/core.module';


@NgModule({
  declarations: [InsuranceViewComponent],
  exports: [
    InsuranceViewComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class LoanInformationViewModule {
}
