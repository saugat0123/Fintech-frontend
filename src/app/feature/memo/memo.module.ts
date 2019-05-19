import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MemoBaseComponent} from './component/memo-base/memo-base.component';
import {MemoTypeComponent} from './component/memo-type/memo-type.component';
import {MemoComposeComponent} from './component/memo-compose/memo-compose.component';
import {MemoUnderReviewComponent} from './component/memo-underReview/memo-underReview.component';
import {MemoReadComponent} from './component/memo-read/memo-read.component';
import {MemoService} from './service/memo.service';
import {MemoDataService} from './service/memo-data.service';
import {MemoRoutes} from './memo-routes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {QuillModule} from 'ngx-quill';
import {NgSelectModule} from '@ng-select/ng-select';
import {SafePipe} from './pipe/safe.pipe';
import {AgGridModule} from 'ag-grid-angular';
import {MemoViewButtonComponent} from './component/memo-underReview/memo-view-button/memo-view-button.component';
import {ThemeModule} from '../../@theme/theme.module';
import {CoreModule} from '../../@core/core.module';

@NgModule({
    declarations: [
        MemoBaseComponent,
        MemoTypeComponent,
        MemoComposeComponent,
        MemoUnderReviewComponent,
        MemoReadComponent,
        SafePipe,
        MemoViewButtonComponent
    ],
    imports: [
        FormsModule,
        RouterModule.forChild(MemoRoutes),
        NgbModule,
        ReactiveFormsModule,
        QuillModule,
        NgSelectModule,
        AgGridModule.withComponents([MemoViewButtonComponent]),
        ThemeModule,
        CoreModule
    ],
    providers: [MemoService, MemoDataService]
})
export class MemoModule {
}
