import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoanRoutingModule} from './loan-routing.module';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {BasicInfoComponent} from './component/loan-main-template/basic-info/basic-info.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../shared/shared.module';
import {CompanyInfoComponent} from './component/loan-main-template/company-info/company-info.component';
import {MsgModalComponent} from '../../common/msg-modal/msg-modal.component';
import {KycInfoComponent} from './component/loan-main-template/kyc-info/kyc-info.component';


@NgModule({
    declarations: [
        LoanFormComponent,
        BasicInfoComponent,
        CompanyInfoComponent,
        KycInfoComponent
    ],
    imports: [
        CommonModule,
        LoanRoutingModule,
        FormsModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        ReactiveFormsModule,
        SharedModule

    ],
    entryComponents: [
        MsgModalComponent
    ]
})
export class LoanModule {
}
