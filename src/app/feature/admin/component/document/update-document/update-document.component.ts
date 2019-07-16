import {Component, Input, OnInit} from '@angular/core';
import {LoanCycle} from '../../../modal/loan-cycle';
import {Document} from '../../../modal/document';
import {Router} from '@angular/router';
import {DocumentService} from '../document.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Status} from '../../../../../@core/Status';

@Component({
    selector: 'app-update-document',
    templateUrl: './update-document.component.html'
})
export class UpdateDocumentComponent implements OnInit {

    @Input() public cycle;
    title: string;
    documentList: Array<Document>;
    allList = [];
    show = false;
    loanCycle: LoanCycle = new LoanCycle();
    selectedDocumentList = Array<number>();
    label: string;
    spinner = false;

    constructor(
        private router: Router,
        private service: DocumentService,
        private modalService: NgbModal,
        private toastService: ToastService
    ) {
    }

    static loadData(other: UpdateDocumentComponent) {
        other.spinner = true;
        other.service.getAllByStatus(Status.ACTIVE).subscribe((response: any) => {
            other.allList = response.detail;
            other.spinner = false;
            other.documentsContaining(other.loanCycle.id);
        }, error => {
            console.log(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Update Documents'));
        });
    }

    ngOnInit() {
        this.loanCycle = this.cycle;
        this.title = this.loanCycle.cycle;
        this.label = this.loanCycle.label;
        UpdateDocumentComponent.loadData(this);
    }

    documentsContaining(loanCycleId: number) {
        this.service.getByLoanCycleAndStatus(loanCycleId, 'ACTIVE').subscribe((response: any) => {
            this.documentList = response.detail;
            this.documentList.forEach(selectedDocument => {
                this.allList.forEach(document => {
                    if (selectedDocument.id === document.id) {
                        this.selectedDocumentList.push(document.id);
                        document.checked = true;
                    }
                });
            });
        });
    }

    updateLoanCycleInBulk() {
        this.service.updateDocumentByLoanCycle(this.loanCycle.id, this.selectedDocumentList)
            .subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Document Loan Cycle'));
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Update Document Loan Cycle'));
            });
    }

    updateCheckedOptions(events, documentId: number) {
        if (events.target.checked === true) {
            this.selectedDocumentList.push(documentId);
            console.log(this.selectedDocumentList);
        } else {
            const index = this.selectedDocumentList.indexOf(documentId);
            if (index !== -1) {
                this.selectedDocumentList.splice(index, 1);
                console.log(this.selectedDocumentList);
            }
        }
    }

    toggle() {
        this.show = !this.show;
    }

}
