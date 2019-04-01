import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SpinnerComponent} from "../common/spinner/spinner.component";
import {PaginationComponent} from "../common/pagination/pagination.component";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
      SpinnerComponent,
      PaginationComponent
  ],
  imports: [
    CommonModule,
    NgbPaginationModule
  ],
  exports: [
      SpinnerComponent,
      PaginationComponent
  ]
})
export class SharedModule { }
