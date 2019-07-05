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
    selectedDocumentList = Array<number>();
    label: string;
    constructor(
        private router: Router,
        private service: DocumentService
    ) {
    }

    ngOnInit() {
        this.loanCycle = this.cycle;
        this.title = this.loanCycle.cycle;
        this.label = this.loanCycle.label;
        this.documentsNotContaining(this.loanCycle);
    }

    documentsNotContaining(loanCycle: LoanCycle) {
        this.service.getByLoanCycle(loanCycle).subscribe((response: any) => {
            this.documentList = response.detail;
        });
    }

    updateLoanCycleInBulk() {
        // not complete
        /*this.service.updateDocumentByLoanCycle(this.loanCycle.id, this.selectedDocumentList)
            .subscribe(() => {
                console.log('operation success');
            });*/
    }

    updateCheckedOptions(events, number) {
        if (events.target.checked === true) {
            this.selectedDocumentList.push(number);
        } else {
            const index: number = this.selectedDocumentList.indexOf(number);
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
