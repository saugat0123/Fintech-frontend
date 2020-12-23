import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCbsCustomerComponent } from './tag-cbs-customer/tag-cbs-customer.component';
import {ThemeModule} from '../../@theme/theme.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { CbsViewCustomerComponent } from './cbs-view-customer/cbs-view-customer.component';



@NgModule({
    declarations: [TagCbsCustomerComponent, CbsViewCustomerComponent],
    exports: [
        TagCbsCustomerComponent,
        CbsViewCustomerComponent
    ],
    imports: [
        CommonModule,
        ThemeModule,
        InfiniteScrollModule,
    ]
})
export class CbsGroupModule { }
