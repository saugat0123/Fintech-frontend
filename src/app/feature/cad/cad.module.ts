import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CadRoutingModule } from './cad-routing.module';
import { CadComponent } from './cad.component';
import { SourceComponent } from './source/source.component';
import {NbButtonModule, NbCardModule} from '@nebular/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [CadComponent, SourceComponent],
  imports: [
    CommonModule,
    CadRoutingModule,
    NbCardModule,
    NbButtonModule,
    ReactiveFormsModule,
      FormsModule

  ]
})
export class CadModule { }
