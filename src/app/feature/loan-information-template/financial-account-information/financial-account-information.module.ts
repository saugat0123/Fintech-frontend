import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FinancialAccountInformationComponent} from './financial-account-information.component';
import {NbCardModule, NbDatepickerModule, NbRadioModule} from '@nebular/theme';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [FinancialAccountInformationComponent],
  imports: [
    CommonModule,
    NbRadioModule,
    NbCardModule,
    ReactiveFormsModule,
    NbDatepickerModule
  ],
  exports: [FinancialAccountInformationComponent]
})
export class FinancialAccountInformationModule { }
