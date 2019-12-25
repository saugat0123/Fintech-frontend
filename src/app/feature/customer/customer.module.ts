import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerComponent} from './component/customer-list/customer.component';
import {CustomerRoutingModule} from './customer-routing.module';


@NgModule({
    declarations: [CustomerComponent],
    imports: [
        CommonModule,
        CustomerRoutingModule
    ]
})
export class CustomerModule {
}
