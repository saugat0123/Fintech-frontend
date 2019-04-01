import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoComposeComponent } from './memo-compose/memo-compose.component';
import {MemoModuleRoutingModule} from "./memo-module-routing.module";
import { MemoInboxComponent } from './memo-inbox/memo-inbox.component';
import { MemoReadComponent } from './memo-read/memo-read.component';
import { MemoBaseComponent } from './memo-base/memo-base.component';
import {MemoCommonService} from "./memo-common.service";
import {SharedModule} from "../shared-module/shared.module";

@NgModule({
  declarations: [
      MemoComposeComponent,
      MemoInboxComponent,
      MemoReadComponent,
      MemoBaseComponent
  ],
  imports: [
    CommonModule,
    MemoModuleRoutingModule,
    SharedModule
  ],
    providers: [MemoCommonService]
})
export class MemoModuleModule { }
