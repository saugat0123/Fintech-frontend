import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoanInformationDetailViewComponent} from './loan-information-detail-view.component';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';
import {ThemeModule} from '../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {ReportingModule} from '../reporting/reporting.module';
import {LoanInformationTemplateModule} from '../loan-information-template/loan-information-template.module';
import {LoanSummaryModule} from '../loan/component/loan-summary/loan-summary.module';
import {DetailViewBaseComponent} from './detail-view-base/detail-view-base.component';
import {MicroLoanModule} from '../micro-loan/micro-loan.module';
import {
    ChecklistViewVersionOne, ChecklistViewVersionZero, CreditChecklistViewComponent
} from '../loan-information-view/credit-checklist-view/credit-checklist-view.component';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {CoreModule} from '../../@core/core.module';
import {CbsGroupModule} from '../cbs-group/cbs-group.module';
import {NepaliPatroModule} from 'nepali-patro';
import { GammaDetailViewComponent } from './gamma-detail-view/gamma-detail-view.component';
import { AlphaDetailViewComponent } from './alpha-detail-view/alpha-detail-view.component';
import {NtaModule} from '../loan/component/nta/nta.module';


@NgModule({
    declarations: [LoanInformationDetailViewComponent,
        CreditChecklistViewComponent,
        DetailViewBaseComponent,
        GammaDetailViewComponent,
        AlphaDetailViewComponent,
        ChecklistViewVersionOne,
        ChecklistViewVersionZero],
    exports: [
        CreditChecklistViewComponent,
        ChecklistViewVersionOne,
        ChecklistViewVersionZero
    ],
    imports: [
        CommonModule,
        LoanInformationViewModule,
        ThemeModule,
        NgxPrintModule,
        ReportingModule,
        LoanInformationTemplateModule,
        LoanSummaryModule,
        NepaliCalendarModule,
        MicroLoanModule,
        CoreModule,
        CbsGroupModule,
        NepaliPatroModule,
        NtaModule,
    ],
    entryComponents: [
        ChecklistViewVersionOne,
        ChecklistViewVersionZero]
})
export class LoanInformationDetailViewModule { }
