import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CoreModule} from '../../../../../../@core/core.module';
import {ThemeModule} from '../../../../../../@theme/theme.module';
import {VideoKycModule} from '../../../../../video-kyc/video-kyc.module';
import {DbrModule} from '../../../../../dbr/dbr.module';
import {LoanInformationViewModule} from '../../../../../loan-information-view/loan-information-view.module';
import {LoanSummaryModule} from '../../loan-summary.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CoreModule,
    ThemeModule,
    VideoKycModule,
    DbrModule,
    LoanInformationViewModule,
    LoanSummaryModule
  ],
  exports: [
  ]
})
export class SummaryInstitutionalModule { }
