import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicroCompanyFormComponentComponent } from './form-component/micro-company-form-component/micro-company-form-component.component';
import { MicroIndividualFormComponent } from './form-component/micro-individual-form/micro-individual-form.component';
import {ThemeModule} from '../../@theme/theme.module';



@NgModule({
  declarations: [MicroCompanyFormComponentComponent, MicroIndividualFormComponent],
  exports: [
    MicroCompanyFormComponentComponent,
    MicroIndividualFormComponent
  ],
  imports: [
    CommonModule,
    ThemeModule
  ]
})
export class MicroLoanModule { }
