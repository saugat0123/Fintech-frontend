import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComposeGradingQuestionsComponent} from './component/compose-grading-questions/compose-grading-questions.component';
import {RiskGroupComponent} from './component/risk-group/risk-group.component';
import {RouteGuard} from '../../@core/service/authentication/route-guard';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'setup',
        canActivate: [RouteGuard]
    },
    {
        path: 'setup',
        component: ComposeGradingQuestionsComponent,
        canActivate: [RouteGuard]
    },
    {
        path: 'group',
        component: RiskGroupComponent,
        canActivate: [RouteGuard]
    },
    {
        path: '**',
        redirectTo: 'setup'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CreditRiskGradingRoutingModule {
}
