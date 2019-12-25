import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerComponent} from './component/customer-list/customer.component';
import {CustomerRoutingModule} from './customer-routing.module';
import {ThemeModule} from '../../@theme/theme.module';
import {CustomerProfileComponent} from './component/customer-profile/customer-profile.component';


@NgModule({
    declarations: [CustomerComponent, CustomerProfileComponent],
    imports: [
        CommonModule,
        CustomerRoutingModule,
        ThemeModule
    ]
})
export class CustomerModule {
}
