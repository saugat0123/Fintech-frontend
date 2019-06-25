import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NgxPrintModule} from 'ngx-print';
import {LoanRoutingModule} from './loan-routing.module';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {BasicInfoComponent} from './component/loan-main-template/basic-info/basic-info.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbActiveModal, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {CompanyInfoComponent} from './component/loan-main-template/company-info/company-info.component';
import {KycInfoComponent} from './component/loan-main-template/kyc-info/kyc-info.component';
import {DmsLoanFileComponent} from './component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {SecurityComponent} from './component/loan-main-template/security/security.component';
import {NbDatepickerModule} from '@nebular/theme';
import {ThemeModule} from '../../@theme/theme.module';
import {LoanActionComponent} from './loan-action/loan-action.component';
import {LoanFormService} from './component/loan-form/service/loan-form.service';
import {LoanSummaryComponent} from './component/loan-summary/loan-summary.component';
import {SummaryComponent} from './component/print-summary/summary.component';
import {ProposalComponent} from './component/loan-main-template/proposal/proposal.component';




@NgModule({
    declarations: [
        LoanFormComponent,
        BasicInfoComponent,
        CompanyInfoComponent,
        KycInfoComponent,
        DmsLoanFileComponent,
        SecurityComponent,
        LoanActionComponent,
        LoanSummaryComponent,
        SummaryComponent,
        ProposalComponent

    ],
    imports: [
        ThemeModule,
        CommonModule,
        LoanRoutingModule,
        FormsModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NbDatepickerModule,
        NgxPrintModule,
    ],

    providers: [
        DatePipe,
        LoanFormService,
        NgbActiveModal
    ]

})
export class LoanModule {
}
