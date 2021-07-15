import {Component, OnInit} from '@angular/core';
import {DocumentService} from '../../admin/component/document/document.service';
import {Document} from '../../admin/modal/document';
import {ObtainableDoc} from './obtainableDoc';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {ObtainableDocuments} from './obtainableDocuments';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-obtained-document',
    templateUrl: './obtained-document.component.html',
    styleUrls: ['./obtained-document.component.scss']
})
export class ObtainedDocumentComponent implements OnInit {
    showOtherDocuments = false;
    documents = Array<ObtainableDoc>();
    obtainabledDocument = Array<ObtainableDoc>();
    otherDocument: any;
    otherDocValue: string;
    constructor(
        private docService: DocumentService,
        private activatedRoute: ActivatedRoute,
        private customerLoanService: LoanFormService
    ) {
    }
    ngOnInit() {
        ObtainableDocuments.data.forEach(res => {
            const doc = new ObtainableDoc();
            doc.name = res;
            doc.checked = false;
            this.documents.push(doc);
        });

        this.activatedRoute.queryParams.subscribe((res) => {
            console.log(res);
            this.customerLoanService.detail(res.customerId).subscribe(singleDoc => {
                const details = JSON.parse(singleDoc.detail.data);
                details.documents.forEach( doc => {
                    this.documents.forEach( prevDoc => {
                        if ( doc.name === prevDoc.name) {
                            prevDoc.checked = true;
                            const document = new ObtainableDoc();
                            document.name = prevDoc.name;
                            document.checked = true;
                            this.obtainabledDocument.push(document);
                        }
                    });
                });

                if (!ObjectUtil.isEmpty(details.OtherDocuments)) {
                   this.showOtherDocuments = true;
                   this.otherDocValue = details.OtherDocuments;
                }
            });
        });


    }

    setObtainedDocument( event, document: ObtainableDoc) {
      if (event.target.checked === true) {
          const  documents = new ObtainableDoc();
          documents.name = document.name;
          documents.checked = true;
        this.obtainabledDocument.push(documents);
        console.log(this.obtainabledDocument);
      } else if (event.target.checked === false) {
        const removeInxdex = this.obtainabledDocument.findIndex( index => index.name === document.name);
        if (removeInxdex !== -1) {
          this.obtainabledDocument.splice(removeInxdex, 1);
        }
      }
    }



    setOtherDocuments(event) {
      if (event.target.checked === true) {
        this.showOtherDocuments = true;
      } else {
        this.showOtherDocuments = false;
      }
    }

    insertOtherDocuments(event) {
        this.otherDocument = event.target.value;
    }


}
