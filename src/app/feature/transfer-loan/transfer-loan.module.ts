import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SingleLoanTransferModelComponent} from './components/single-loan-transfer-model/single-loan-transfer-model.component';
import {CombinedLoanTransferModelComponent} from './components/combined-loan-transfer-model/combined-loan-transfer-model.component';
import {VerificationComponent} from './components/verification/verification.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ThemeModule} from '../../@theme/theme.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {NbTooltipModule} from '@nebular/theme';



@NgModule({
  declarations: [
      SingleLoanTransferModelComponent,
      CombinedLoanTransferModelComponent,
      VerificationComponent
  ],
    imports: [
        ThemeModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        AngularDraggableModule,
        NbTooltipModule
    ],
    entryComponents: [SingleLoanTransferModelComponent,
        CombinedLoanTransferModelComponent,
        VerificationComponent]
})
export class TransferLoanModule { }
