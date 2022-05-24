import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FinancialCcblComponent} from './financial-ccbl.component';
import {NbCardModule} from '@nebular/theme';
import {ReactiveFormsModule} from '@angular/forms';
import {CKEditorModule} from 'ng2-ckeditor';
import {CoreModule} from '../../../@core/core.module';



@NgModule({
  declarations: [FinancialCcblComponent],
  exports: [FinancialCcblComponent],
  imports: [
    CommonModule,
    NbCardModule,
    ReactiveFormsModule,
    CKEditorModule,
    CoreModule
  ]
})
export class FinancialCcblModule { }
