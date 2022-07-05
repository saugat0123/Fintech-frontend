import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SecurityTaggedComponentComponent} from './security-tagged-component.component';
import {CoreModule} from '../../../../@core/core.module';
import {ThemeModule} from '../../../../@theme/theme.module';



@NgModule({
  declarations: [SecurityTaggedComponentComponent],
    imports: [
        CommonModule,
        CoreModule,
        ThemeModule
    ],
  exports: [SecurityTaggedComponentComponent],
  entryComponents: [SecurityTaggedComponentComponent]
})
export class SecurityTaggedModule { }
