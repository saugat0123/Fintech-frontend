import {Routes} from '@angular/router';
import {ViewMemoComponent} from './component/view-memo/view-memo.component';
import {ComposeComponent} from './component/compose/compose.component';
import {ReadComponent} from './component/read/read.component';
import {CreditMemoBaseComponent} from './component/credit-memo-base/credit-memo-base.component';
import {CreditMemoTypeComponent} from './component/credit-memo-type/credit-memo-type.component';

export const CreditMemoRoutes: Routes = [
    {
        path: '', component: CreditMemoBaseComponent, children: [
            {path: '', redirectTo: 'compose', pathMatch: 'full'},
            {path: 'compose', component: ComposeComponent},
            {path: 'draft', component: ViewMemoComponent},
            {path: 'rejected', component: ViewMemoComponent},
            {path: 'sent', component: ViewMemoComponent},
            {path: 'under-review', component: ViewMemoComponent},
            {path: 'approved', component: ViewMemoComponent},
            {path: 'compose/:id', component: ComposeComponent},
            {path: 'read/:id', component: ReadComponent},
            {path: 'backward', component: ViewMemoComponent},
            {path: '**', redirectTo: 'compose', pathMatch: 'full'}
        ]
    },
    {path: 'type', component: CreditMemoTypeComponent}

];
