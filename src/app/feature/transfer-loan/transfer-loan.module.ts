import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SingleLoanTransferModelComponent} from './components/single-loan-transfer-model/single-loan-transfer-model.component';
import {CombinedLoanTransferModelComponent} from './components/combined-loan-transfer-model/combined-loan-transfer-model.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ThemeModule} from '../../@theme/theme.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {NbTooltipModule} from '@nebular/theme';
import { VerificationActionModelComponent } from './components/verification-action-model/verification-action-model.component';



@NgModule({
  declarations: [
      SingleLoanTransferModelComponent,
      CombinedLoanTransferModelComponent,
      VerificationActionModelComponent,
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
    VerificationActionModelComponent]
})
export class TransferLoanModule { }
