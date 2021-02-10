import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicroCompanyFormComponentComponent } from './form-component/micro-company-form-component/micro-company-form-component.component';
import { MicroIndividualFormComponent } from './form-component/micro-individual-form/micro-individual-form.component';
import {ThemeModule} from '../../@theme/theme.module';
import { MicroSynopsisComponent } from './form-component/micro-synopsis/micro-synopsis.component';



@NgModule({
  declarations: [MicroCompanyFormComponentComponent, MicroIndividualFormComponent, MicroSynopsisComponent],
  exports: [
    MicroCompanyFormComponentComponent,
    MicroIndividualFormComponent,
    MicroSynopsisComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule
  ]
})
export class MicroLoanModule { }
