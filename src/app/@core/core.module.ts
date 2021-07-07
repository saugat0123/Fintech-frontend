import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {throwIfAlreadyLoaded} from './module-import-guard';
import {AnalyticsService, LayoutService, StateService, ToastService} from './utils';
import {PermissionService} from './service/permission.service';
import {CurrencyFormatterPipe} from './pipe/currency-formatter.pipe';
import {NaturalNumberValidatorDirective} from './directive/natural-number-validator.directive';
import {PositiveDecimalNumberValidatorDirective} from './directive/positive-decimal-number-validator.directive';
import {SafePipe} from '../feature/memo/pipe/safe.pipe';
import {NepaliWordPipe} from './pipe/nepali-word.pipe';
import {ReplacePipe} from './utils/replace.pipe';
import {RoundvaluePipe} from './pipe/roundvalue.pipe';
import {BooleanConvertPipe} from './pipe/boolean-convert.pipe';
import {DecimalNumberDirective} from './directive/decimal-number.directive';
import {NepaliToEngNumberPipe} from './pipe/nepali-to-eng-number.pipe';
import {LoanStatusPipe} from './pipe/loan-status-pipe';
import {EngToNepaliNumberPipe} from './pipe/eng-to-nepali-number.pipe';
import {NepaliPercentWordPipe} from './pipe/nepali-percent-word.pipe';
import {NgxNumToWordsModule} from 'ngx-num-to-words';
import {FormsModule} from '@angular/forms';
import {LoginPopUp} from './login-popup/login-pop-up';
import {NepaliCurrencyWordPipe} from './pipe/nepali-currency-word.pipe';
import { NepaliNumberPipe } from './pipe/nepali-number.pipe';


const DATA_SERVICES = [];

export const NB_CORE_PROVIDERS = [
    ...DATA_SERVICES,
    AnalyticsService,
    LayoutService,
    StateService,
    ToastService,
    PermissionService,
    LoanStatusPipe,
    EngToNepaliNumberPipe,
    NepaliCurrencyWordPipe
];

const UTILITY_MODULES = [
    NgxNumToWordsModule
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ...UTILITY_MODULES
    ],
    exports: [
        // NbAuthModule,
        CurrencyFormatterPipe,
        PositiveDecimalNumberValidatorDirective,
        NaturalNumberValidatorDirective,
        SafePipe,
        NepaliWordPipe,
        ReplacePipe,
        RoundvaluePipe,
        BooleanConvertPipe,
        DecimalNumberDirective,
        NepaliToEngNumberPipe,
        LoanStatusPipe,
        EngToNepaliNumberPipe,
        NepaliCurrencyWordPipe,
        ...UTILITY_MODULES,
        LoginPopUp,
        NepaliNumberPipe
    ],
    declarations: [CurrencyFormatterPipe,
        NaturalNumberValidatorDirective,
        PositiveDecimalNumberValidatorDirective,
        SafePipe,
        NepaliWordPipe,
        ReplacePipe,
        RoundvaluePipe,
        BooleanConvertPipe,
        DecimalNumberDirective,
        NepaliToEngNumberPipe,
        LoanStatusPipe,
        EngToNepaliNumberPipe,
        NepaliPercentWordPipe,
        NepaliCurrencyWordPipe,
        LoginPopUp,
        NepaliNumberPipe

    ], entryComponents: [LoginPopUp]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }

    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: CoreModule,
            providers: [
                ...NB_CORE_PROVIDERS,
            ],
        };
    }
}
