import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {ToastService} from '../../../@core/utils';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    currentIndex: number;
    currentDocumentPath;

    constructor(private ngbModal: NgbModal,
                private loanFormService: LoanFormService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData.previousList)) {
            this.currentIndex = this.cadData.previousList.length;
        }

    }

    openDocument(document: any, docPath: string) {
        this.ngbModal.open(document);
        this.currentDocumentPath = (docPath).split(',');
    }

    previewDoc(url: any) {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }
}
