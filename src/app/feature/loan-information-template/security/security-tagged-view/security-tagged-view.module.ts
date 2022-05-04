import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CoreModule} from '../../../../@core/core.module';
import {SecurityTaggedViewComponent} from './security-tagged-view.component';



@NgModule({
  declarations: [SecurityTaggedViewComponent],
  imports: [
    CommonModule,
      CoreModule
  ],
  exports: [SecurityTaggedViewComponent]
})
export class SecurityTaggedViewModule { }
