import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MasterDocumentComponent} from './components/master-document/master-document.component';
import {CodocumentComponent} from './components/codocument/codocument.component';

const routes: Routes = [
  {path: 'document', component: MasterDocumentComponent},
  {path: 'codocument', component: CodocumentComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterDocumentRoutingModule { }
