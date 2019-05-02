import {Routes} from '@angular/router';
import {SchemeSelectComponent} from './component/scheme-select/scheme-select.component';
import {SchemeQuestionComponent} from './component/scheme-question/scheme-question.component';

export const CustomerEligibilityRoutingModule: Routes = [

  { path: 'schemeselect', component: SchemeSelectComponent },
  { path: 'schemequestion', component: SchemeQuestionComponent }

];
