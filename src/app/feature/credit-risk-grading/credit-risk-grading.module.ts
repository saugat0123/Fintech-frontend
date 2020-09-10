import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeModule} from '../../@theme/theme.module';
import {CreditRiskGradingRoutingModule} from './credit-risk-grading-routing.module';
import { ComposeGradingQuestionsComponent } from './component/compose-grading-questions/compose-grading-questions.component';
import { RiskGroupComponent } from './component/risk-group/risk-group.component';

const COMPONENTS = [
    ComposeGradingQuestionsComponent,
    RiskGroupComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        CommonModule,
        CreditRiskGradingRoutingModule,
        ThemeModule
    ]
})
export class CreditRiskGradingModule {
}
