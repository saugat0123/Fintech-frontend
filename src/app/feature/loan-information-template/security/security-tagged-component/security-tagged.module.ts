import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SecurityTaggedComponentComponent} from './security-tagged-component.component';
import {CoreModule} from '../../../../@core/core.module';



@NgModule({
  declarations: [SecurityTaggedComponentComponent],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [SecurityTaggedComponentComponent],
  entryComponents: [SecurityTaggedComponentComponent]
})
export class SecurityTaggedModule { }
