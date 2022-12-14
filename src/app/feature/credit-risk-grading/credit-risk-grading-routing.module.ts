import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComposeGradingQuestionsComponent} from './component/compose-grading-questions/compose-grading-questions.component';
import {RiskGroupComponent} from './component/risk-group/risk-group.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'setup'
    },
    {
        path: 'setup',
        component: ComposeGradingQuestionsComponent
    },
    {
        path: 'group',
        component: RiskGroupComponent
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
