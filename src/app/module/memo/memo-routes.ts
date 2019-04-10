import {Routes} from '@angular/router';
import {MemoUnderReviewComponent} from "./component/memo-underReview/memo-underReview.component";
import {MemoComposeComponent} from "./component/memo-compose/memo-compose.component";
import {MemoBaseComponent} from "./component/memo-base/memo-base.component";
import {MemoReadComponent} from "./component/memo-read/memo-read.component";
import {MemoTypeComponent} from "./component/memo-type/memo-type.component";

export const MemoRoutes: Routes = [
    {
        path: '', component: MemoBaseComponent, children: [
            {path: 'underReview', component: MemoUnderReviewComponent},
            {path: 'compose', component: MemoComposeComponent},
            {path: 'read', component: MemoReadComponent},

        ]
    },
    {path: 'type', component: MemoTypeComponent}
];