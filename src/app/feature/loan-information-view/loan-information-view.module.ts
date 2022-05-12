import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InsuranceViewComponent} from './insurance-view/insurance-view.component';
import {CoreModule} from '../../@core/core.module';
import {FinancialViewComponent} from './financial-view/financial-view.component';
import {NbTabsetModule} from '@nebular/theme';

import {GuarantorViewComponent} from './guarantor-view/guarantor-view.component';
import {SiteVisitViewComponent} from './sitevisit-view/site-visit-view.component';
import {IndividualViewComponent} from './individual-view/individual-view.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ThemeModule} from '../../@theme/theme.module';
import {CustomerInfoSearchFormComponent} from './customer-info-search-form/customer-info-search-form.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {CompanyInfoViewComponent} from './company-info-view/company-info-view.component';
import {CiclViewComponent} from './cicl-view/cicl-view.component';
import {AllDocumentViewComponent} from './all-document-view/all-document-view.component';
import {ProposalViewComponent} from './proposal-view/proposal-view.component';
import {IncomeFromAccountViewComponent} from './income-from-account-view/income-from-account-view.component';
import {CrgGammaDetailViewComponent} from './crg-gamma-detail-view/crg-gamma-detail-view.component';
import {CrgAlphaDetailedViewComponent} from './crg-alpha-detailed-view/crg-alpha-detailed-view.component';
import {CrgLambdaDetailViewComponent} from './crg-lambda-detail-view/crg-lambda-detail-view.component';
import {NepaliPatroModule} from 'nepali-patro';
import {RemitProfileComponent} from '../loan/component/loan-summary/remit-profile/remit-profile.component';
import {SecurityScheduleComponent} from '../loan/component/security-schedule/security-schedule.component';
import {FinancialJsonParserComponent} from '../loan/component/loan-summary/financial-json-parser/financial-json-parser.component';
import {NetWorthModule} from '../newt-worth/net-worth-module';
import {CreditChecklistViewComponent} from './credit-checklist-view/credit-checklist-view.component';
import {CrossCollateralizedViewComponent} from './cross-collateralized-view/cross-collateralized-view.component';
import {SecurityAdderComponent} from './security-view/security-adder/security-adder.component';
import {SecurityTaggedModule} from '../loan-information-template/security/security-tagged-component/security-tagged.module';
import {SecurityTaggerComponent} from './security-view/security-adder/security-tagger/security-tagger.component';


@NgModule({
    declarations: [
        InsuranceViewComponent,
        FinancialViewComponent,
        GuarantorViewComponent,
        SiteVisitViewComponent,
        IndividualViewComponent,
        CustomerInfoSearchFormComponent,
        SecurityAdderComponent,
        CompanyInfoViewComponent,
        CiclViewComponent,
        AllDocumentViewComponent,
        ProposalViewComponent,
        IncomeFromAccountViewComponent,
        CrgGammaDetailViewComponent,
        CrgAlphaDetailedViewComponent,
        CrgLambdaDetailViewComponent,
        RemitProfileComponent,
        SecurityScheduleComponent,
        FinancialJsonParserComponent,
        CreditChecklistViewComponent,
        CrossCollateralizedViewComponent,
        SecurityTaggerComponent,
    ],
    exports: [
        InsuranceViewComponent,
        FinancialViewComponent,
        GuarantorViewComponent,
        SiteVisitViewComponent,
        IndividualViewComponent,
        SecurityAdderComponent,
        CompanyInfoViewComponent,
        CiclViewComponent,
        AllDocumentViewComponent,
        ProposalViewComponent,
        IncomeFromAccountViewComponent,
        CrgGammaDetailViewComponent,
        CrgAlphaDetailedViewComponent,
        CrgLambdaDetailViewComponent,
        RemitProfileComponent,
        SecurityScheduleComponent,
        FinancialJsonParserComponent,
        CreditChecklistViewComponent,
        CrossCollateralizedViewComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        NbTabsetModule,
        ReactiveFormsModule,
        ThemeModule,
        NgSelectModule,
        NepaliCalendarModule,
        NepaliPatroModule,
        NetWorthModule,
        SecurityTaggedModule,
    ],
    entryComponents: [
        AllDocumentViewComponent
    ]
})
export class LoanInformationViewModule {
}
