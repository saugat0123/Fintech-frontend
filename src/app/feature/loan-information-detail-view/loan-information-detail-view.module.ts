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
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {CoreModule} from '../../@core/core.module';
import {CbsGroupModule} from '../cbs-group/cbs-group.module';
import {NepaliPatroModule} from 'nepali-patro';
import {DbrModule} from '../dbr/dbr.module';
import { DetailViewOfIndividualComponent } from './detail-view-of-individual/detail-view-of-individual.component';
import { DetailViewOfInstitutionalComponent } from './detail-view-of-institutional/detail-view-of-institutional.component';
import {ProductPaperModule} from '../loan-information-template/product-paper-checklist/product-paper-.module';
import {VideoKycModule} from '../video-kyc/video-kyc.module';


@NgModule({
    declarations: [LoanInformationDetailViewComponent, DetailViewBaseComponent, DetailViewOfIndividualComponent, DetailViewOfInstitutionalComponent],
    exports: [
        DetailViewOfIndividualComponent, DetailViewOfInstitutionalComponent
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
        DbrModule,
        ProductPaperModule,
        VideoKycModule,

    ]
})
export class LoanInformationDetailViewModule { }
