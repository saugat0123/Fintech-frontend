import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadComponent } from './cad.component';
import {SourceComponent} from './source/source.component';

const routes: Routes = [
    { path: '', component: SourceComponent },
  {
    path: 'source', component: SourceComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadRoutingModule { }
