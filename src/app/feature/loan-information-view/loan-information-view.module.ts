import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InsuranceViewComponent} from './insurance-view/insurance-view.component';
import {CoreModule} from '../../@core/core.module';
import { GuarantorViewComponent } from './guarantor-view/guarantor-view.component';


@NgModule({
  declarations: [InsuranceViewComponent, GuarantorViewComponent],
  exports: [
    InsuranceViewComponent,
    GuarantorViewComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class LoanInformationViewModule {
}
