import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CrgCcblComponent} from './crg-ccbl.component';
import {NbButtonModule, NbCardModule, NbInputModule, NbSelectModule} from '@nebular/theme';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [CrgCcblComponent],
    imports: [
        CommonModule,
        NbCardModule,
        NbButtonModule,
        FormsModule,
        NbInputModule,
        NbSelectModule
    ],
  exports: [CrgCcblComponent]
})
export class CrgCcblModule { }
