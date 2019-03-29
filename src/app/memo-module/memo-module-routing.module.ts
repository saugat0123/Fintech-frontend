import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MemoInboxComponent} from './memo-inbox/memo-inbox.component';
import {MemoBaseComponent} from './memo-base/memo-base.component';
import {BaseComponent} from '../component/base/base.component';

const routes: Routes = [
    {
        path: 'home', component: BaseComponent, children: [
            {
                path: 'memo', component: MemoBaseComponent, children: [
                    {path: 'sent', component: MemoInboxComponent}
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MemoModuleRoutingModule {
}
