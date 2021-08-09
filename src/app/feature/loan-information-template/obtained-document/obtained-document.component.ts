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

                const tempDoc = JSON.parse(localStorage.getItem('obtainabledDocument'));
                tempDoc.forEach(doc => {
                        console.log('documentssss::::' + doc);
                        this.documents.forEach(prevDoc => {
                            if (doc.name === prevDoc.name) {
                                prevDoc.checked = true;
                                const document = new ObtainableDoc();
                                document.name = prevDoc.name;
                                document.checked = true;
                                this.obtainabledDocument.push(document);
                            }
                        });
                    });


                const tempOtherDoc = JSON.parse(localStorage.getItem('otherDocument'));
                if (!ObjectUtil.isEmpty(tempOtherDoc)) {
                    this.showOtherDocuments = true;
                    this.otherDocValue = tempOtherDoc.name;
                    this.otherDocument = tempOtherDoc.name;
                } else {
                   this.showOtherDocuments = true;
                   this.otherDocValue = details.OtherDocuments;
                   this.otherDocument = details.OtherDocuments;
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
        localStorage.setItem('obtainabledDocument', JSON.stringify(this.obtainabledDocument));
      } else if (event.target.checked === false) {
        const removeInxdex = this.obtainabledDocument.findIndex( index => index.name === document.name);
        if (removeInxdex !== -1) {
          this.obtainabledDocument.splice(removeInxdex, 1);
          localStorage.setItem('obtainabledDocument', JSON.stringify(this.obtainabledDocument));
        }
      }
    }



    setOtherDocuments(event) {
      if (event.target.checked === true) {
        this.showOtherDocuments = true;
      } else {
        this.showOtherDocuments = false;
        this.otherDocument = null;
        this.otherDocValue = null;
      }
    }

    insertOtherDocuments(event) {
        this.otherDocument = event.target.value;
        const otherTempDoc = {
            name: this.otherDocument,
            checked: true
        };
        localStorage.setItem('otherDocument', JSON.stringify(otherTempDoc));
    }


}
