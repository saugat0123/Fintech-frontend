import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoComposeComponent } from './memo-compose/memo-compose.component';

@NgModule({
  declarations: [MemoComposeComponent],
  imports: [
    CommonModule
  ],
  exports: [
      MemoComposeComponent
  ]
})
export class MemoModuleModule { }
