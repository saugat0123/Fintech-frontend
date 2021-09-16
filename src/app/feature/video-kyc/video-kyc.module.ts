import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoKycComponent } from './video-kyc.component';
import {TimeOutPopUpComponent} from '../../@core/time-out-pop-up/time-out-pop-up.component';
import {NbButtonModule, NbCardModule, NbDialogModule, NbInputModule, NbRadioModule, NbSpinnerModule, NbToggleModule} from '@nebular/theme';
import {ReactiveFormsModule} from '@angular/forms';
import {LoanSummaryModule} from '../loan/component/loan-summary/loan-summary.module';
import {VideoKycInformationComponent} from '../loan/component/loan-summary/video-kyc-information/video-kyc-information.component';



@NgModule({
    declarations: [VideoKycComponent, VideoKycInformationComponent],
    imports: [
        CommonModule,
        NbCardModule,
        NbRadioModule,
        ReactiveFormsModule,
        NbDialogModule.forRoot(),
        NbInputModule,
        NbButtonModule,
        NbToggleModule,
        NbSpinnerModule,
    ],
  exports: [
    VideoKycComponent
  ],
  entryComponents: [VideoKycComponent,  VideoKycInformationComponent]
})
export class VideoKycModule { }
