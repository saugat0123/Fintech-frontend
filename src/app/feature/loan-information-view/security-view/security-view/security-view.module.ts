import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SecurityTaggedSummaryComponent} from '../security-tagged-summary/security-tagged-summary.component';
import {SecurityTaggedCommonComponent} from '../security-tagged-common/security-tagged-common.component';
import {NbSpinnerModule} from '@nebular/theme';



@NgModule({
  declarations: [ SecurityTaggedSummaryComponent,
    SecurityTaggedCommonComponent],
    imports: [
        CommonModule,
        NbSpinnerModule
    ],
  exports: [ SecurityTaggedSummaryComponent,
    SecurityTaggedCommonComponent]
})
export class SecurityViewModule { }
