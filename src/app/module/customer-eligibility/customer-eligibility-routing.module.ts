import {Routes} from '@angular/router';
import {SchemeSelectComponent} from './component/scheme-select/scheme-select.component';
import {SchemeQuestionComponent} from './component/scheme-question/scheme-question.component';
import {CustomerEligibilityBaseComponent} from './component/customer-eligibility-base/customer-eligibility-base.component';

export const CustomerEligibilityRoutingModule: Routes = [
  { path: '', component: CustomerEligibilityBaseComponent,
  children: [
    { path: 'schemeselect', component: SchemeSelectComponent },
    { path: 'schemequestion', component: SchemeQuestionComponent }
  ]}

];
