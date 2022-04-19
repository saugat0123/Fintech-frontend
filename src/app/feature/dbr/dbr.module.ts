import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DbrComponent} from './dbr.component';
import {JointCustomerViewComponent} from '../joint-customer-view/joint-customer-view.component';
import {NepaliPatroModule} from 'nepali-patro';
import {CoreModule} from '../../@core/core.module';


@NgModule({
  declarations: [DbrComponent, JointCustomerViewComponent],
    imports: [
        CommonModule,
        NepaliPatroModule,
        CoreModule,
    ],
  exports: [
    DbrComponent,
    JointCustomerViewComponent
  ],
  entryComponents: [DbrComponent, JointCustomerViewComponent]
})
export class DbrModule { }