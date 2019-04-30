import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerBaseComponent} from './component/customer-base/customer-base.component';
import {RouterModule} from '@angular/router';
import {CustomerRoutes} from './customer-routes';
import {CustomerHeaderComponent} from './component/customer-base/customer-header/customer-header.component';
import {CustomerFooterComponent} from './component/customer-base/customer-footer/customer-footer.component';
import {CustomerFormComponent} from './component/customer-form/customer-form.component';

@NgModule({
    declarations: [
        CustomerBaseComponent,
        CustomerHeaderComponent,
        CustomerFooterComponent,
        CustomerFormComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(CustomerRoutes)
    ]
})
export class CustomerModule {
}
