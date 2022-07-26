import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeModule} from '../../@theme/theme.module';
import {MasterDocumentRoutingModule} from './master-document-routing.module';
import { MasterDocumentComponent } from './components/master-document/master-document.component';
import { BookmarkPopUpComponent } from './components/master-document/bookmark-pop-up/bookmark-pop-up.component';
import {NbDialogModule} from '@nebular/theme';



@NgModule({
  declarations: [MasterDocumentComponent, BookmarkPopUpComponent],
  imports: [
    CommonModule,
    MasterDocumentRoutingModule,
    ThemeModule,
    NbDialogModule.forChild()
  ],
  entryComponents: [BookmarkPopUpComponent]
})
export class MasterDocumentModule { }
