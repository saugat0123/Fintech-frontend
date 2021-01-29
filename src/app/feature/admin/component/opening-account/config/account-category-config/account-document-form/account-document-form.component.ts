import {Component, Input, OnInit} from '@angular/core';
import {DocumentService} from '../../../../document/document.service';
import {Status} from '../../../../../../../@core/Status';
import {AccountCategory} from '../../../../../modal/accountCategory';
import {Document} from '../../../../../modal/document';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AccountCategoryService} from '../../../service/account-category.service';
import {ModalResponse, ToastService} from '../../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-account-document-form',
  templateUrl: './account-document-form.component.html',
  styleUrls: ['./account-document-form.component.scss']
})
export class AccountDocumentFormComponent implements OnInit {
  @Input() model: AccountCategory;
  documentList: Array<Document> = new Array<Document>();
  finalDocumentList: Array<Document> = new Array<Document>();

  constructor(
      private documentService: DocumentService,
      public activeModal: NgbActiveModal,
      private accountCategoryService: AccountCategoryService,
      private toastService: ToastService
  ) {
  }

  ngOnInit() {
    // Id of Full Settlement Loan cycle is set 8 in patch backend
    this.documentService.getByLoanCycleAndStatus(8, Status.ACTIVE)
    .subscribe((response: any) => {
      this.documentList = response.detail;

      const documentIds = this.model.documents.map(d => d.id);
      if (this.model.id !== undefined && this.model.id !== 0) {
        this.documentList.forEach(document => {
          if (documentIds.includes(document.id)) {
            this.finalDocumentList.push(document);
            document.checked = true;
          }
        });
      }
    });
  }

  public updateDocument($event, document: Document, documentArray: Document[]) {
    if ($event.target.checked === true) {
      documentArray.push(document);
    } else {
      const index: number = documentArray.indexOf(document);
      if (index !== -1) {
        documentArray.splice(index, 1);
      }
    }
  }

  public save() {
    this.model.documents = this.finalDocumentList;
    this.accountCategoryService.save(this.model).subscribe(() => {
      if (this.model.id == null) {
        this.activeModal.close(ModalResponse.SUCCESS);
        const alert = new Alert(AlertType.SUCCESS, 'Successfully saved documents');
        this.toastService.show(alert);
      } else {
        this.activeModal.close(ModalResponse.SUCCESS);
        const alert = new Alert(AlertType.SUCCESS, 'Successfully Updated documents');
        this.toastService.show(alert);
      }
        }, (err) => {
          console.error(err);
          const alert = new Alert(AlertType.ERROR, 'Failed to save documents');
          this.toastService.show(alert);
        }
    );
  }
}
