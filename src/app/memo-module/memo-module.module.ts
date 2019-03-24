import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoComposeComponent } from './memo-compose/memo-compose.component';
import {MemoModuleRoutingModule} from "./memo-module-routing.module";
import { MemoInboxComponent } from './memo-inbox/memo-inbox.component';
import { MemoReadComponent } from './memo-read/memo-read.component';
import { MemoBaseComponent } from './memo-base/memo-base.component';

@NgModule({
  declarations: [MemoComposeComponent, MemoInboxComponent, MemoReadComponent, MemoBaseComponent],
  imports: [
    CommonModule,
    MemoModuleRoutingModule
  ],
  exports: [
      MemoInboxComponent,
      MemoComposeComponent
  ]
})
export class MemoModuleModule { }
