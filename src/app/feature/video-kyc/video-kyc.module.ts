import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoKycComponent } from './video-kyc.component';
import {TimeOutPopUpComponent} from '../../@core/time-out-pop-up/time-out-pop-up.component';
import {NbButtonModule, NbCardModule, NbDialogModule, NbInputModule, NbRadioModule} from '@nebular/theme';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [VideoKycComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbRadioModule,
    ReactiveFormsModule,
    NbDialogModule.forRoot(),
      NbInputModule,
      NbButtonModule
  ],
  exports: [
    VideoKycComponent
  ],
  entryComponents: [VideoKycComponent]
})
export class VideoKycModule { }
