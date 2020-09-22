import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerActivityComponent} from './component/customer-activity.component';
import {ThemeModule} from '../../@theme/theme.module';
import {CustomerActivityRoutingModule} from './customer-activity-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {CoreModule} from '../../@core/core.module';
import {UpdateViewComponent} from './component/update-view/update-view.component';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';


@NgModule({
  declarations: [CustomerActivityComponent, UpdateViewComponent],
  imports: [
    CommonModule,
    ThemeModule,
    CustomerActivityRoutingModule,
    FormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgSelectModule,
    CoreModule,
    LoanInformationViewModule
  ], entryComponents: [UpdateViewComponent]
})
export class CustomerActivityModule {
}
