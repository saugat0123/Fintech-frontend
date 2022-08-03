import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    currentIndex: number;
    currentDocumentPath;
    documentView = 'Click to view Document List';

    constructor(private ngbModal: NgbModal,
                private ngxSpinnerService: NgxSpinnerService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData.previousList)) {
            this.currentIndex = this.cadData.previousList.length;
        }

    }

    openDocument(document: any, docPath: string) {
        this.ngxSpinnerService.show();
        this.currentDocumentPath = (docPath).split(',');
        this.ngbModal.open(document, {size: 'xl', backdrop: 'static'});
        this.ngxSpinnerService.hide();
    }

    previewDoc(url: any) {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }

    onClose() {
        this.ngbModal.dismissAll();
    }
}
