import {Component, Input, OnInit} from '@angular/core';
import {LoanCycle} from '../../../modal/loan-cycle';
import {Document} from '../../../modal/document';
import {Router} from '@angular/router';
import {DocumentService} from '../document.service';

@Component({
    selector: 'app-update-document',
    templateUrl: './update-document.component.html'
})
export class UpdateDocumentComponent implements OnInit {

    @Input() public cycle;
    title: string;
    documentList: Array<Document>;
    show = false;
    loanCycle: LoanCycle = new LoanCycle();
    selectedDocumentList = Array<Document>();

    constructor(
        private router: Router,
        private service: DocumentService
    ) {
    }

    ngOnInit() {
        this.loanCycle = this.cycle;
        this.title = this.loanCycle.cycle;
        this.loanCycle.level = '';
        this.documentsNotContaining(this.loanCycle);
    }

    documentsNotContaining(loanCycle: LoanCycle) {
        this.service.getByLoanCycle(loanCycle).subscribe((response: any) => {
            this.documentList = response.detail;
        });
    }

    updateLoanCycle() {
        this.service.updateDocumentByLoanCycle(this.loanCycle.id, this.selectedDocumentList)
            .subscribe(() => {
                console.log('operation success');
            });


    }

    updateCheckedOptions(events) {
        let d: Document = new Document();
        d = events.target.value;
        if (events.target.checked === true) {
            this.selectedDocumentList.push(d);
        } else {
            const index: number = this.selectedDocumentList.indexOf(d);
            if (index !== -1) {
                this.selectedDocumentList.splice(index, 1);
            }
        }


    }

    toggle() {
        this.show = !this.show;
    }

}
