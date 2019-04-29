import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MemoBaseComponent} from './component/memo-base/memo-base.component';
import {MemoTypeComponent} from './component/memo-type/memo-type.component';
import {AddMemoTypeComponent} from './component/memo-type/add-memo-type/add-memo-type.component';
import {MemoDeleteComponent} from './component/modal/memo-delete/memo-delete.component';
import {MemoComposeComponent} from './component/memo-compose/memo-compose.component';
import {MemoUnderReviewComponent} from './component/memo-underReview/memo-underReview.component';
import {MemoReadComponent} from './component/memo-read/memo-read.component';
import {SharedModule} from '../shared/shared.module';
import {MemoService} from './service/memo.service';
import {MemoDataService} from "./service/memo-data.service";
import {MemoRoutes} from './memo-routes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {QuillModule} from 'ngx-quill';
import {NgSelectModule} from '@ng-select/ng-select';
import {SafePipe} from "./pipe/safe.pipe";
import {AgGridModule} from "ag-grid-angular";
import {MemoViewButtonComponent} from './component/memo-underReview/memo-view-button/memo-view-button.component';

@NgModule({
    declarations: [
        MemoBaseComponent,
        MemoTypeComponent,
        AddMemoTypeComponent,
        MemoDeleteComponent,
        MemoComposeComponent,
        MemoUnderReviewComponent,
        MemoReadComponent,
        SafePipe,
        MemoViewButtonComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(MemoRoutes),
        NgbModule,
        ReactiveFormsModule,
        QuillModule,
        NgSelectModule,
        AgGridModule.withComponents([MemoViewButtonComponent])
    ],
    entryComponents: [
        AddMemoTypeComponent,
        MemoDeleteComponent
    ],
    providers: [MemoService, MemoDataService]
})
export class MemoModule {
}
