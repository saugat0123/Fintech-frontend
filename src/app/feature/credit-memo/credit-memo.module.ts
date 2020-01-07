import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ThemeModule} from '../../@theme/theme.module';
import {CoreModule} from '../../@core/core.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {RouterModule} from '@angular/router';
import {CreditMemoRoutes} from './credit-memo-routes';
import { ActionComponent } from './component/action/action.component';



@NgModule({
  declarations: [ActionComponent],
  imports: [
    CommonModule,
      FormsModule,
      ReactiveFormsModule,
      ThemeModule,
      CoreModule,
      NgSelectModule,
      RouterModule.forRoot(CreditMemoRoutes)
  ]
})
export class CreditMemoModule { }
