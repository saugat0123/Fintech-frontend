import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MemoBaseComponent} from './component/memo-base/memo-base.component';
import {MemoTypeComponent} from './component/memo-type/memo-type.component';
import {MemoComposeComponent} from './component/memo-compose/memo-compose.component';
import {MemoUnderReviewComponent} from './component/memo-underReview/memo-underReview.component';
import {MemoReadComponent} from './component/memo-read/memo-read.component';
import {MemoService} from './service/memo.service';
import {MemoRoutes} from './memo-routes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {QuillModule} from 'ngx-quill';
import {NgSelectModule} from '@ng-select/ng-select';
import {ThemeModule} from '../../@theme/theme.module';
import {CoreModule} from '../../@core/core.module';
import {MemoTypeService} from './service/memo-type.service';
import {MemoTypeFormComponent} from './component/memo-type/memo-type-form/memo-type-form.component';
import {MemoTypeDeleteComponent} from './component/memo-type/memo-type-form/memo-type-delete.component';

@NgModule({
    declarations: [
        MemoBaseComponent,
        MemoTypeComponent,
        MemoTypeFormComponent,
        MemoTypeDeleteComponent,
        MemoComposeComponent,
        MemoUnderReviewComponent,
        MemoReadComponent
    ],

    imports: [
        FormsModule,
        RouterModule.forChild(MemoRoutes),
        NgbModule,
        ReactiveFormsModule,
        QuillModule,
        NgSelectModule,
        ThemeModule,
        CoreModule
    ],
    providers: [MemoService, MemoTypeService],
    entryComponents: [
        MemoTypeFormComponent
    ]
})
export class MemoModule {
}
