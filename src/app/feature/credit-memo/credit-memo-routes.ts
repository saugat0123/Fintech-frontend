import {Routes} from '@angular/router';
import {MemoBaseComponent} from '../memo/component/memo-base/memo-base.component';
import {ComposeComponent} from '../memo/component/compose/compose.component';
import {DraftComponent} from '../memo/component/draft/draft.component';
import {RejectedComponent} from '../memo/component/reject/rejected.component';
import {ReviewComponent} from '../memo/component/review/review.component';
import {ApprovedComponent} from '../memo/component/approved/approved.component';
import {ReadComponent} from '../memo/component/read/read.component';
import {MemoTypeComponent} from '../memo/component/memo-type/memo-type.component';

export const CreditMemoRoutes: Routes = [
    {
        path: '', component: MemoBaseComponent, children: [
            {path: 'compose', component: ComposeComponent},
            {path: 'draft', component: DraftComponent},
            {path: 'rejected', component: RejectedComponent},
            {path: 'review', component: ReviewComponent},
            {path: 'approved', component: ApprovedComponent},
            {path: 'compose/:id', component: ComposeComponent},
            {path: 'read/:id', component: ReadComponent}

        ]
    },
    {path: 'type', component: MemoTypeComponent}
];
