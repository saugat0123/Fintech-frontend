import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoanRoutingModule} from './loan-routing.module';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {BasicInfoComponent} from './component/loan-main-template/basic-info/basic-info.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {CompanyInfoComponent} from './component/loan-main-template/company-info/company-info.component';
import {KycInfoComponent} from './component/loan-main-template/kyc-info/kyc-info.component';
import {DmsLoanFileComponent} from './component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {DmsSummaryComponent} from './component/loan-main-template/dms-summary/dms-summary.component';
import {SecurityComponent} from './component/loan-main-template/security/security.component';
import {NbDatepickerModule} from '@nebular/theme';
import {ThemeModule} from '../../@theme/theme.module';


@NgModule({
    declarations: [
        LoanFormComponent,
        BasicInfoComponent,
        CompanyInfoComponent,
        KycInfoComponent,
        DmsLoanFileComponent,
        DmsSummaryComponent,
        SecurityComponent

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
        NbDatepickerModule

    ]
})
export class LoanModule {
}
