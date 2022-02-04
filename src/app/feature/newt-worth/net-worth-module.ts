import { NgModule } from '@angular/core';
import {NewtWorthComponent} from './newt-worth.component';
import {CommonModule} from '@angular/common';


@NgModule({
    declarations: [NewtWorthComponent],
    imports: [
        CommonModule
    ],
    exports: [
  NewtWorthComponent
    ],
    entryComponents: [NewtWorthComponent]
})
export class NetWorthModule { }
