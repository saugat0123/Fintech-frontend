import {Component, Input, OnInit} from '@angular/core';
import {DocumentService} from '../../admin/component/document/document.service';
import {ObtainableDoc} from './obtainableDoc';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {ObtainableDocuments} from './obtainableDocuments';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NbDialogRef} from '@nebular/theme';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {any} from 'codelyzer/util/function';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

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
    spinner = false;
    @Input() fromSummary = false;
    obtainableDocuments = {
        documents: Array<ObtainableDoc>(),
        OtherDocuments: null
    };
    loanDataHolder: LoanDataHolder;

    constructor(
        private docService: DocumentService,
        private activatedRoute: ActivatedRoute,
        private customerLoanService: LoanFormService,
        private toastService: ToastService,
        private nbgActiveModal: NgbActiveModal
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
            if (this.fromSummary) {
                this.spinner = true;
            }
            this.customerLoanService.detail(res.customerId).subscribe(singleDoc => {
                this.loanDataHolder = singleDoc.detail;
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
                   this.otherDocument = details.OtherDocuments;
                }
                this.spinner = false;
            }, error => {
                console.error(error);
                this.spinner = false;
            });
        });


    }

    setObtainedDocument( event, document: ObtainableDoc) {
      if (event.target.checked === true) {
          const  documents = new ObtainableDoc();
          documents.name = document.name;
          documents.checked = true;
        this.obtainabledDocument.push(documents);
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
        this.otherDocument = null;
        this.otherDocValue = null;
      }
    }

    insertOtherDocuments(event) {
        this.otherDocument = event.target.value;
    }


    onUpdate() {
        this.obtainableDocuments.documents = this.obtainabledDocument;
        this.obtainableDocuments.OtherDocuments = this.otherDocument;
        this.loanDataHolder.data = JSON.stringify(this.obtainableDocuments);
        this.spinner = true;
        this.customerLoanService.save(this.loanDataHolder).subscribe(res => {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully updated document'));
            this.nbgActiveModal.close();
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Error updating document'));
            console.error(error);
            this.spinner = false;
        });
    }

    close() {
        this.nbgActiveModal.close();
    }
}
