import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditMemoTypeComponent } from './component/credit-memo-type/credit-memo-type.component';
import {NbCardModule} from "@nebular/theme";
import { CreditMemoTypeFormComponent } from './component/credit-memo-type/credit-memo-type-form/credit-memo-type-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ThemeModule} from "../../@theme/theme.module";
import {CreditMemoRoutes} from './credit-memo-routes';
import {RouterModule} from "@angular/router";
import { CreditMemoTypeDeleteComponent } from './component/credit-memo-type/credit-memo-type-delete/credit-memo-type-delete.component';



@NgModule({

    imports: [
        CommonModule,
        NbCardModule,
        ReactiveFormsModule,
        ThemeModule,
        RouterModule.forChild(CreditMemoRoutes)
    ],

  declarations: [CreditMemoTypeComponent, CreditMemoTypeFormComponent, CreditMemoTypeDeleteComponent],

    entryComponents: [
        CreditMemoTypeFormComponent,
        CreditMemoTypeDeleteComponent
    ]

})
export class CreditMemoModule { }
