import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SecurityTaggedSummaryComponent} from '../security-tagged-summary/security-tagged-summary.component';
import {SecurityTaggedCommonComponent} from '../security-tagged-common/security-tagged-common.component';
import {NbSpinnerModule} from '@nebular/theme';
import {SecuritySummaryComponent} from '../../../loan/component/loan-summary/security-summary/security-summary.component';
import {CoreModule} from '../../../../@core/core.module';
import {NepaliPatroModule} from 'nepali-patro';



@NgModule({
  declarations: [ SecurityTaggedSummaryComponent,
    SecurityTaggedCommonComponent, SecuritySummaryComponent],
    imports: [
        CommonModule,
        NbSpinnerModule,
        CoreModule,
        NepaliPatroModule
    ],
  exports: [ SecurityTaggedSummaryComponent,
      SecuritySummaryComponent]
})
export class SecurityViewModule { }
