import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FinancialAccountInformationComponent} from './financial-account-information.component';
import {NbCardModule, NbDatepickerModule, NbRadioModule} from '@nebular/theme';
import {ReactiveFormsModule} from '@angular/forms';
import {CKEditorModule} from 'ng2-ckeditor';
import {CoreModule} from '../../../@core/core.module';



@NgModule({
  declarations: [FinancialAccountInformationComponent],
    imports: [
        CommonModule,
        NbRadioModule,
        NbCardModule,
        ReactiveFormsModule,
        NbDatepickerModule,
        CKEditorModule,
        CoreModule
    ],
  exports: [FinancialAccountInformationComponent]
})
export class FinancialAccountInformationModule { }
