import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {NbButtonModule, NbCardModule, NbSpinnerModule} from '@nebular/theme';
import {NgxPrintModule} from 'ngx-print';
import { HomeLoanComponent } from './home-loan/home-loan.component';
import { HomeLoanPrintComponent } from './home-loan/home-loan-print/home-loan-print.component';
import {MegaOfferLetterTemplateModule} from '../../mega-offer-letter-template/mega-offer-letter-template.module';
import {CoreModule} from '../../../../@core/core.module';


@NgModule({
  declarations: [
    HomeLoanComponent,
    HomeLoanPrintComponent,
],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NbCardModule,
        NbButtonModule,
        NgxPrintModule,
        MegaOfferLetterTemplateModule,
        NbSpinnerModule,
        CoreModule
    ],
    exports: [
        HomeLoanComponent,
        HomeLoanPrintComponent,
    ],
  entryComponents: [
    HomeLoanComponent,
  ]

})
export class MegaModule { }
