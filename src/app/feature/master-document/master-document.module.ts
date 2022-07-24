import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeModule} from '../../@theme/theme.module';
import {MasterDocumentRoutingModule} from './master-document-routing.module';
import { MasterDocumentComponent } from './components/master-document/master-document.component';



@NgModule({
  declarations: [MasterDocumentComponent],
  imports: [
    CommonModule,
    MasterDocumentRoutingModule,
    ThemeModule,
  ]
})
export class MasterDocumentModule { }
