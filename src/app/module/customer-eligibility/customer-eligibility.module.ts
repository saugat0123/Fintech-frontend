import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeSelectComponent } from './component/scheme-select/scheme-select.component';
import { SchemeQuestionComponent } from './component/scheme-question/scheme-question.component';
import {RouterModule} from '@angular/router';
import {CustomerEligibilityRoutingModule} from './customer-eligibility-routing.module';

@NgModule({
  declarations: [
      SchemeSelectComponent,
      SchemeQuestionComponent
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(CustomerEligibilityRoutingModule)
  ]
})
export class CustomerEligibilityModule { }
