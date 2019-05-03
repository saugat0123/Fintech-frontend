import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {LoanCycle} from '../../../modal/loan-cycle';
import {Document} from '../../../modal/document';
import {Router} from '@angular/router';

@Component({
    selector: 'app-update-document',
    templateUrl: './update-document.component.html',
    styleUrls: ['./update-document.component.css']
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
        private commonService: CommonService
    ) {
    }

    ngOnInit() {
        this.loanCycle = this.cycle;
        this.title = this.loanCycle.cycle;
        this.loanCycle.level = '';
        this.documentsNotContaining(this.loanCycle);
    }

    documentsNotContaining(loanCycle: LoanCycle) {
        this.commonService.getByPost('v1/document/list', loanCycle).subscribe((response: any) => {
            this.documentList = response.detail;
        });
    }

    updateLoanCycle() {
        this.commonService.getByPostDocument('v1/document/saveList', this.selectedDocumentList, this.loanCycle.id)
            .subscribe((response: any) => {
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/document']));
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
