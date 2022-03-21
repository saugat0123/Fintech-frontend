import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductPaperChecklistComponent} from './product-paper-checklist.component';
import {NbButtonModule, NbCardModule, NbDialogModule, NbInputModule, NbRadioModule, NbSpinnerModule, NbToggleModule} from '@nebular/theme';
import {ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../../@core/core.module';



@NgModule({
  declarations: [ProductPaperChecklistComponent],
    imports: [
        CommonModule,
        NbCardModule,
        NbRadioModule,
        ReactiveFormsModule,
        NbDialogModule.forRoot(),
        NbInputModule,
        NbButtonModule,
        NbToggleModule,
        NbSpinnerModule,
        CoreModule,
    ],
  exports: [ProductPaperChecklistComponent],
  entryComponents: [ProductPaperChecklistComponent]
})
export class ProductPaperModule {
}
