import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SecurityTaggedSummaryComponent} from '../security-tagged-summary/security-tagged-summary.component';
import {SecurityTaggedCommonComponent} from '../security-tagged-common/security-tagged-common.component';
import {NbSpinnerModule} from '@nebular/theme';
import {SecuritySummaryComponent} from '../../../loan/component/loan-summary/security-summary/security-summary.component';
import {CoreModule} from '../../../../@core/core.module';
import {NepaliPatroModule} from 'nepali-patro';
import {ProposalSummaryComponent} from '../../../loan/component/loan-summary/proposal-summary/proposal-summary.component';
import {ThemeModule} from '../../../../@theme/theme.module';



@NgModule({
  declarations: [ SecurityTaggedSummaryComponent,
    SecurityTaggedCommonComponent, SecuritySummaryComponent, ProposalSummaryComponent],
    imports: [
        CommonModule,
        NbSpinnerModule,
        CoreModule,
        NepaliPatroModule,
        ThemeModule
    ],
  exports: [ SecurityTaggedSummaryComponent,
      SecuritySummaryComponent, ProposalSummaryComponent]
})
export class SecurityViewModule { }
