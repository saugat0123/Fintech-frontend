import {Routes} from '@angular/router';
import {ReviewComponent} from './component/review/review.component';
import {ComposeComponent} from './component/compose/compose.component';
import {MemoBaseComponent} from './component/memo-base/memo-base.component';
import {ReadComponent} from './component/read/read.component';
import {MemoTypeComponent} from './component/memo-type/memo-type.component';
import {DraftComponent} from './component/draft/draft.component';
import {RejectedComponent} from './component/reject/rejected.component';
import {ApprovedComponent} from './component/approved/approved.component';
import {SentMemoComponent} from './component/sent-memo/sent-memo.component';
import {BackwardedMemoComponent} from './component/backwarded-memo/backwarded-memo.component';

export const MemoRoutes: Routes = [
    {
        path: '', component: MemoBaseComponent, children: [
            { path: '', redirectTo: 'compose', pathMatch: 'full' },
            {path: 'compose', component: ComposeComponent},
            {path: 'draft', component: DraftComponent},
            {path: 'rejected', component: RejectedComponent},
            {path: 'sent', component: SentMemoComponent},
            {path: 'review', component: ReviewComponent},
            {path: 'approved', component: ApprovedComponent},
            {path: 'compose/:id', component: ComposeComponent},
            {path: 'read/:id', component: ReadComponent},
            {path: 'backward', component: BackwardedMemoComponent},
            { path: '**', redirectTo: 'compose', pathMatch: 'full' }
        ]
    },
    {path: 'type', component: MemoTypeComponent}
];
