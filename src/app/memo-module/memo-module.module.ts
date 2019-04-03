import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from "@angular/forms";
import { MemoComposeComponent } from './memo-compose/memo-compose.component';
import {MemoModuleRoutingModule} from "./memo-module-routing.module";
import { MemoInboxComponent } from './memo-inbox/memo-inbox.component';
import { MemoReadComponent } from './memo-read/memo-read.component';
import { MemoBaseComponent } from './memo-base/memo-base.component';
import {MemoCommonService} from "./memo-common.service";
import {SharedModule} from "../shared-module/shared.module";
import { MemoTypeComponent } from './memo-type/memo-type.component';
import { AddMemoTypeComponent } from './memo-type/add-memo-type/add-memo-type.component';

@NgModule({
  declarations: [
      MemoComposeComponent,
      MemoInboxComponent,
      MemoReadComponent,
      MemoBaseComponent,
      MemoTypeComponent,
      AddMemoTypeComponent
  ],
  imports: [
    CommonModule,
    MemoModuleRoutingModule,
    FormsModule,
    SharedModule
  ],
    providers: [MemoCommonService]
})
export class MemoModuleModule { }
