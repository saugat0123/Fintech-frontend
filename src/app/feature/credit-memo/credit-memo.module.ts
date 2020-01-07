import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ThemeModule} from '../../@theme/theme.module';
import {CoreModule} from '../../@core/core.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {RouterModule} from '@angular/router';
import {CreditMemoRoutes} from './credit-memo-routes';
import { ActionComponent } from './component/action/action.component';
import { CreditMemoBaseComponent } from './component/credit-memo-base/credit-memo-base.component';
import { CreditMemoTypeComponent } from './component/credit-memo-type/credit-memo-type.component';
import { ReadComponent } from './component/read/read.component';
import { ComposeComponent } from './component/compose/compose.component';
import { ViewMemoComponent } from './component/view-memo/view-memo.component';



@NgModule({
  declarations: [ActionComponent, CreditMemoBaseComponent, CreditMemoTypeComponent, ReadComponent, ComposeComponent, ViewMemoComponent],
  imports: [
    CommonModule,
      FormsModule,
      ReactiveFormsModule,
      ThemeModule,
      CoreModule,
      NgSelectModule,
      RouterModule.forChild(CreditMemoRoutes)
  ]
})
export class CreditMemoModule { }
