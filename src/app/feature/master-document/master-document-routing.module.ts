import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MasterDocumentComponent} from './components/master-document/master-document.component';

const routes: Routes = [
  {path: '', component: MasterDocumentComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDocumentRoutingModule { }
