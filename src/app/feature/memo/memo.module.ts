import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MemoBaseComponent} from './component/memo-base/memo-base.component';
import {MemoTypeComponent} from './component/memo-type/memo-type.component';
import {ComposeComponent} from './component/compose/compose.component';
import {ReviewComponent} from './component/review/review.component';
import {ReadComponent} from './component/read/read.component';
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
import {ForwardActionComponent} from './component/actions/forward-action.component';
import {RejectActionComponent} from './component/actions/reject-action.component';
import {ApproveActionComponent} from './component/actions/approve-action.component';
import {RejectedComponent} from './component/reject/rejected.component';
import {DraftComponent} from './component/draft/draft.component';
import {ApprovedComponent} from './component/approved/approved.component';
import { SentMemoComponent } from './component/sent-memo/sent-memo.component';
import { ReceivedMemoComponent } from './component/received-memo/received-memo.component';

@NgModule({
    declarations: [
        MemoBaseComponent,
        MemoTypeComponent,
        MemoTypeFormComponent,
        MemoTypeDeleteComponent,
        ComposeComponent,
        ReviewComponent,
        DraftComponent,
        ReadComponent,
        ReviewComponent,
        RejectedComponent,
        ApprovedComponent,
        ForwardActionComponent,
        RejectActionComponent,
        ApproveActionComponent,
        SentMemoComponent,
        ReceivedMemoComponent
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
        MemoTypeFormComponent,
        ApproveActionComponent,
        ForwardActionComponent,
        RejectActionComponent
    ]
})
export class MemoModule {
}
