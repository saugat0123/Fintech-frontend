import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaisedPreProcessViewComponent } from './component/raised-pre-process-view/raised-pre-process-view.component';
import {NbButtonModule, NbCardModule, NbSelectModule, NbSpinnerModule} from '@nebular/theme';
import {FormsModule} from '@angular/forms';
import { PreProcessLoanModalComponent } from './component/pre-process-loan-modal/pre-process-loan-modal.component';
import {CoreModule} from '../../@core/core.module';



@NgModule({
    declarations: [RaisedPreProcessViewComponent, PreProcessLoanModalComponent],
    exports: [
        RaisedPreProcessViewComponent,
        PreProcessLoanModalComponent
    ],
    imports: [
        CommonModule,
        NbCardModule,
        NbSelectModule,
        FormsModule,
        NbButtonModule,
        NbSpinnerModule,
        CoreModule
    ],
    entryComponents: [
        PreProcessLoanModalComponent
    ]
})
export class PreProcessModule { }
