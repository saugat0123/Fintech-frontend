import {Routes} from '@angular/router';
import {SchemeSelectComponent} from './component/scheme-select/scheme-select.component';
import {SchemeQuestionComponent} from './component/scheme-question/scheme-question.component';
import {CustomerEligibilityBaseComponent} from './component/customer-eligibility-base/customer-eligibility-base.component';
import {CustomerEligibilityResultComponent} from './component/customer-eligibility-result/customer-eligibility-result.component';

export const CustomerEligibilityRoutingModule: Routes = [
  { path: '', component: CustomerEligibilityBaseComponent,
  children: [
    { path: 'schemeselect', component: SchemeSelectComponent },
    { path: 'schemequestion', component: SchemeQuestionComponent },
    { path: 'schemeresult', component: CustomerEligibilityResultComponent}
  ]}

];
