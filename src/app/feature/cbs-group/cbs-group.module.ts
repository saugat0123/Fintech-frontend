import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCbsCustomerComponent } from './tag-cbs-customer/tag-cbs-customer.component';
import {ThemeModule} from '../../@theme/theme.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { CbsViewCustomerComponent } from './cbs-view-customer/cbs-view-customer.component';
import { CbsTableComponent } from './cbs-view-customer/cbs-table/cbs-table.component';
import {CoreModule} from '../../@core/core.module';



@NgModule({
    declarations: [TagCbsCustomerComponent, CbsViewCustomerComponent, CbsTableComponent],
    exports: [
        TagCbsCustomerComponent,
        CbsViewCustomerComponent,
        CbsTableComponent
    ],
    imports: [
        CommonModule,
        ThemeModule,
        InfiniteScrollModule,
        CoreModule,
    ]
})
export class CbsGroupModule { }
