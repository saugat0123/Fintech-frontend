import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpinnerComponent} from '../../common/spinner/spinner.component';
import {PaginationComponent} from '../../common/pagination/pagination.component';
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {UpdateModalComponent} from '../../common/update-modal/update-modal.component';
import {MsgAlertComponent} from '../../common/msg-alert/msg-alert.component';
import {MsgModalComponent} from '../../common/msg-modal/msg-modal.component';
import {AlertComponent} from '../../common/alert/alert.component';
import {BreadcrumbComponent} from '../../common/breadcrum/breadcrumb.component';

@NgModule({
    declarations: [
        SpinnerComponent,
        PaginationComponent,
        UpdateModalComponent,
        MsgAlertComponent,
        MsgModalComponent,
        AlertComponent,
        BreadcrumbComponent
    ],
    imports: [
        CommonModule,
        NgbPaginationModule,
        NgbModule
    ],
    exports: [
        SpinnerComponent,
        PaginationComponent,
        UpdateModalComponent,
        MsgAlertComponent,
        MsgModalComponent,
        AlertComponent,
        BreadcrumbComponent
    ]
})
export class SharedModule {
}
