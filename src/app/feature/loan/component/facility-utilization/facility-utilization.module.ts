import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FacilityUtilizationComponent} from './facility-utilization.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbInputModule} from '@nebular/theme';
import {CoreModule} from '../../../../@core/core.module';
import {ThemeModule} from '../../../../@theme/theme.module';
import {CustomerModule} from '../../../customer/customer.module';
import {BankingRelationComponent} from '../../../customer/component/customer-form/banking-relation/banking-relation.component';



@NgModule({
  declarations: [FacilityUtilizationComponent, BankingRelationComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NbInputModule,
        CoreModule,
        NbButtonModule,
        NbDatepickerModule,
        NbCardModule,
        NbCheckboxModule,
        ThemeModule
    ],
  exports: [FacilityUtilizationComponent]
})
export class FacilityUtilizationModule { }
