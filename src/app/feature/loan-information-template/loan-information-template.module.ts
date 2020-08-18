import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SiteVisitComponent} from './site-visit/site-visit.component';
import {ThemeModule} from '../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {NbDatepickerModule, NbDialogModule} from '@nebular/theme';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../../../environments/environment';
import {SecurityComponent} from './security/security.component';
import {SecurityInitialFormComponent} from './security/security-initial-form/security-initial-form.component';

const COMPONENTS = [
  SiteVisitComponent,
  SecurityComponent,
  SecurityInitialFormComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [
    SiteVisitComponent,
    SecurityComponent,
    SecurityInitialFormComponent

  ],
  entryComponents: [...COMPONENTS],
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgSelectModule,
    NbDatepickerModule,
    NepaliCalendarModule,
    NbDialogModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_MAP_API_KEY
    }),
  ]
})
export class LoanInformationTemplateModule {
}
