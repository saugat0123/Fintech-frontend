import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCbsCustomerComponent } from './tag-cbs-customer/tag-cbs-customer.component';
import {ThemeModule} from '../../@theme/theme.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';



@NgModule({
    declarations: [TagCbsCustomerComponent],
    exports: [
        TagCbsCustomerComponent
    ],
    imports: [
        CommonModule,
        ThemeModule,
        InfiniteScrollModule,
    ]
})
export class CbsGroupModule { }
