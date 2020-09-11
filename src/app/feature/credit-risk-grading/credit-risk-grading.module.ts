import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeModule} from '../../@theme/theme.module';
import {CreditRiskGradingRoutingModule} from './credit-risk-grading-routing.module';
import {ComposeGradingQuestionsComponent} from './component/compose-grading-questions/compose-grading-questions.component';
import {RiskGroupComponent} from './component/risk-group/risk-group.component';
import {RiskGroupFormComponent} from './component/risk-group-form-component/risk-group-form.component';
import { RiskGroupDeleteComponent } from './component/risk-group-delete/risk-group-delete.component';

const COMPONENTS = [
    ComposeGradingQuestionsComponent,
    RiskGroupComponent,
    RiskGroupFormComponent,
    RiskGroupDeleteComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        CommonModule,
        CreditRiskGradingRoutingModule,
        ThemeModule
    ],
    entryComponents: [
        RiskGroupFormComponent,
        RiskGroupDeleteComponent
    ]
})
export class CreditRiskGradingModule {
}
