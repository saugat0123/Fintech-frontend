import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DbrComponent} from './dbr.component';


@NgModule({
  declarations: [DbrComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    DbrComponent
  ],
  entryComponents: [DbrComponent]
})
export class DbrModule { }
