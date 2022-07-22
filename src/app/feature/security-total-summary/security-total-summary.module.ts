import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SecurityTotalSummaryComponent} from './security-total-summary.component';
import {CoreModule} from '../../@core/core.module';



@NgModule({
  declarations: [SecurityTotalSummaryComponent],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [SecurityTotalSummaryComponent]
})
export class SecurityTotalSummaryModule { }
