import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FacilityUtilizationComponent} from './facility-utilization.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NbButtonModule, NbDatepickerModule, NbInputModule} from '@nebular/theme';
import {CoreModule} from '../../../../@core/core.module';



@NgModule({
  declarations: [FacilityUtilizationComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NbInputModule,
        CoreModule,
        NbButtonModule,
        NbDatepickerModule
    ],
  exports: [FacilityUtilizationComponent]
})
export class FacilityUtilizationModule { }
