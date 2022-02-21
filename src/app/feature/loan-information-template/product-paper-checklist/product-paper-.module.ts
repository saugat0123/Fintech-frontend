import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductPaperChecklistComponent} from './product-paper-checklist.component';



@NgModule({
  declarations: [ProductPaperChecklistComponent],
  imports: [
    CommonModule
  ],
  exports: [ProductPaperChecklistComponent]
})
export class ProductPaperModule {
}
