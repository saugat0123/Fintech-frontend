import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NtaSummaryComponent} from '../loan-summary/nta-summary/nta-summary.component';
import {NepaliPatroModule} from 'nepali-patro';
import {CoreModule} from '../../../../@core/core.module';
import {NtaMegaSummaryComponent} from '../loan-summary/nta-mega-summary/nta-mega-summary.component';



@NgModule({
  declarations: [NtaSummaryComponent, NtaMegaSummaryComponent],
  exports: [
    NtaSummaryComponent, NtaMegaSummaryComponent
  ],
  imports: [
    CommonModule,
    NepaliPatroModule,
    CoreModule
  ]
})
export class NtaModule { }
