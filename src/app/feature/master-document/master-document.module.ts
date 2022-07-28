import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeModule} from '../../@theme/theme.module';
import {MasterDocumentRoutingModule} from './master-document-routing.module';
import { MasterDocumentComponent } from './components/master-document/master-document.component';
import { BookmarkPopUpComponent } from './components/bookmark-pop-up/bookmark-pop-up.component';
import {NbDialogModule} from '@nebular/theme';
import { CodocumentComponent } from './components/codocument/codocument.component';
import { CodocumentPopUpComponent } from './components/codocument-pop-up/codocument-pop-up.component';



@NgModule({
  declarations: [MasterDocumentComponent, BookmarkPopUpComponent, CodocumentComponent, CodocumentPopUpComponent],
  imports: [
    CommonModule,
    MasterDocumentRoutingModule,
    ThemeModule,
    NbDialogModule.forChild()
  ],
  entryComponents: [BookmarkPopUpComponent, CodocumentPopUpComponent]
})
export class MasterDocumentModule { }
