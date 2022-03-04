import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {JointCustomerViewComponent} from '../joint-customer-view.component';



@NgModule({
  declarations: [JointCustomerViewComponent],
  imports: [
    CommonModule
  ],
  exports: [JointCustomerViewComponent]
})
export class JointInformationModule { }
