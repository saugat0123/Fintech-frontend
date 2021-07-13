import { Component, OnInit } from '@angular/core';
import {DocumentService} from '../../admin/component/document/document.service';
import {Document} from '../../admin/modal/document';
import {ObtainableDoc} from './obtainableDoc';

@Component({
  selector: 'app-obtained-document',
  templateUrl: './obtained-document.component.html',
  styleUrls: ['./obtained-document.component.scss']
})
export class ObtainedDocumentComponent implements OnInit {
  documents;
  otherDocuments = false;
  obtainabledDocument = Array<ObtainableDoc>();

  constructor(
      private docService: DocumentService
  ) { }

  ngOnInit() {
    this.docService.getAll().subscribe( response => {
      this.documents = response.detail;
    });
  }

  setObtainedDocument( event, document: Document){
    if (event.target.checked === true) {
      const doc = new ObtainableDoc();
      doc.id = document.id;
      doc.name = document.name;
      this.obtainabledDocument.push(doc);
    } else if(event.target.checked === false) {
      const removeInxdex = this.obtainabledDocument.findIndex( index => index.id === document.id);
      if(removeInxdex !== -1){
        this.obtainabledDocument.splice(removeInxdex,1);
      }
    }

   console.log(JSON.stringify(this.obtainabledDocument), '::checkedDoc');
  }

  setOtherDocuments(event){
    if(event.target.checked === true){
      this.otherDocuments = true;
    } else {
      this.otherDocuments = false;
    }
  }
}
